import { Types } from "mongoose";
import { Usuario } from "../../entities/domains/Usuario.ts";
import { UsuarioModel } from "../../entities/models/UsuarioModel.ts";

export class UsuarioRepository {
    async criar(usuario: Usuario): Promise<Usuario> {
        try {
            const usuarioExistente = await UsuarioModel.findOne({ email: usuario.email });
            if (usuarioExistente) {
                throw new Error("Usuário com email duplicado.");
            }

            const userToDB = usuario.toDatabaseDocument();
            const userCreated = await UsuarioModel.create(userToDB);

            return new Usuario(
                userCreated.nome,
                userCreated.email,
                userCreated.favoritos as string[],
                userCreated._id.toString()
            )
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao criar usuário no Banco de Dados.");
        }
    }

    async criarMuitos(usuarios: Usuario[]): Promise<Usuario[]> {
        try{
            const emails = new Set<string>();
            const payloadSemDuplicatas = usuarios.filter(user => {
                if (emails.has(user.email)) return false; 
                emails.add(user.email);
                return true;
            });

            if (payloadSemDuplicatas.length === 0) {
                throw new Error("O payload contém apenas usuários com e-mails duplicados entre si.");
            }

            const emailsParaVerificar = payloadSemDuplicatas.map(user => user.email);
            const usuariosNoBanco = await UsuarioModel.find({ email: { $in: emailsParaVerificar } });

            const emailsDuplicadosNoBanco = new Set(usuariosNoBanco.map(user => user.email));
            const usuariosUnicos = payloadSemDuplicatas.filter(user => !emailsDuplicadosNoBanco.has(user.email));

            if (usuariosUnicos.length === 0) {
                throw new Error("O payload contém apenas e-mails que já existem no banco de dados.");
            }

            const usersToDB = usuariosUnicos.map(user => user.toDatabaseDocument());
            const usersCreated = await UsuarioModel.insertMany(usersToDB);

            return usersCreated.map(user => Usuario.fromJson(user));
        }catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao criar usuários no Banco de Dados.");
        }
    }

    async buscarTodos(): Promise<any[]> {
        try {
            const users = await UsuarioModel.find().populate("favoritos", "-atores").lean();
            
            return users.map(user => Usuario.fromJson(user));
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao buscar usuários no Banco de Dados.");
        }
    }


    async buscarPorId(id: string): Promise<Usuario | null> {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new Error("ID inválido.");
            }

            const user = await UsuarioModel.findById(id).populate("favoritos").lean();

            if (!user) {
                return null;
            }

            return Usuario.fromJson(user);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao buscar usuário no Banco de Dados.");
        }
    }

    async atualizar(id: string, usuarioAtualizado: Usuario): Promise<Usuario | null> {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new Error("ID inválido.");
            }

            const userToDb = usuarioAtualizado.toDatabaseDocument();

            const userUpdated = await UsuarioModel.findByIdAndUpdate(
                id,
                userToDb,
                { new: true } //devolve os dados novos
            );

            if (!userUpdated) {
                return null;
            }

            return new Usuario(
                userUpdated.nome,
                userUpdated.email,
                userUpdated.favoritos as string[],
                userUpdated._id.toString()
            );
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao atualizar usuário no Banco de Dados.");
        }
    }

    async deletar(id: string): Promise<boolean> {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new Error("ID inválido.");
            }
            const result = await UsuarioModel.findByIdAndDelete(id);
            if (result) return true;
            return false;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao deletar usuário no Banco de Dados.");
        }
    }
}