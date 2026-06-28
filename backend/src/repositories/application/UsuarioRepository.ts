import { Types } from "mongoose";
import { Usuario } from "../../entities/domains/Usuario.ts";
import { UsuarioModel } from "../../entities/models/UsuarioModel.ts";
import { Obra } from "../../entities/domains/Obra.ts";
import { ObraFactory } from "../../entities/domains/factories/ObraFactory.ts";
import { ObraModel } from "../../entities/models/ObraModel.ts";

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
        try {
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
        } catch (error) {
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

            const user = await UsuarioModel.findById(id).populate("favoritos", "-atores").lean();

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

            const emailEmUso = await UsuarioModel.findOne({
                email: usuarioAtualizado.email,
                _id: { $ne: id } //not equal
            });

            if (emailEmUso) throw new Error("E-mail já em uso no sistema.");

            const dadosParaAtualizar = {
                nome: usuarioAtualizado.nome,
                email: usuarioAtualizado.email,
            }

            const user = await UsuarioModel.findByIdAndUpdate(id, dadosParaAtualizar, { new: true });

            if (!user) throw new Error("Usuário não encontrado.");
            return Usuario.fromJson(user);

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


    async adicionarFavorito(idUser: string, idObra: string): Promise<Usuario> {
        try {
            if (!Types.ObjectId.isValid(idUser)) throw new Error("ID do usuário é inválido.");
            if (!Types.ObjectId.isValid(idObra)) throw new Error("ID da obra é inválido.");

            const user = await UsuarioModel.findById(idUser);
            if (!user) throw new Error("Usuário não encontrado.");

            const obra = await ObraModel.findById(idObra);
            if (!obra) throw new Error("Obra não encontrada no sistema.");

            const jaFavoritado = user.favoritos.some(favId => favId.toString() === idObra);            
            if (jaFavoritado) throw new Error("Esta obra já está na sua lista de favoritos.");
                        
            const userUpdated = await UsuarioModel.findByIdAndUpdate(
                idUser,
                { $addToSet: { favoritos: idObra } },
                { new: true } 
            );

            if (!userUpdated) throw new Error("Falha ao atualizar os favoritos do usuário.");

            return Usuario.fromJson(userUpdated);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao adicionar favorito no Banco de Dados.");
        }
    }

async removerFavorito(idUser: string, idObra: string): Promise<Usuario> {
        try {
            if (!Types.ObjectId.isValid(idUser)) {
                throw new Error("ID do usuário é inválido.");
            }
            if (!Types.ObjectId.isValid(idObra)) {
                throw new Error("ID da obra é inválido.");
            }

            const user = await UsuarioModel.findById(idUser);
            if (!user) {
                throw new Error("Usuário não encontrado.");
            }

            const userUpdated = await UsuarioModel.findByIdAndUpdate(
                idUser,
                { $pull: { favoritos: idObra } },
                { new: true }
            );

            if (!userUpdated) {
                throw new Error("Falha ao atualizar: Usuário não encontrado.");
            }

            return Usuario.fromJson(userUpdated);

        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao remover favorito no Banco de Dados.");
        }
    }


    async buscarPorFiltros(nome?: string, email?: string): Promise<Usuario[]> {
        const query: any = {};
        if (email) {
            query.email = {$regex: email, $options: 'i'}; //regex permite buscar sem palavra exata
        }

        if(nome){
            query.nome = {$regex: nome, $options: 'i'}; //i é opção para case insensitive
        }

        const users = await UsuarioModel.find(query);
        if(!users) throw new Error("Usuário não encontrado.");

        return users.map(user =>Usuario.fromJson(user));
    }
}