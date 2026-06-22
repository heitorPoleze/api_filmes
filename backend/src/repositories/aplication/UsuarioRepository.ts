import { Types } from "mongoose";
import { Usuario } from "../../entities/domains/Usuario.ts";
import { UsuarioModel } from "../../entities/models/UsuarioModel.ts";

export class UsuarioRepository {
    async criar(usuario: Usuario): Promise<Usuario> {
        try {
            const userToDB = usuario.toDatabaseDocument();
            const userCreated = await UsuarioModel.create(userToDB);

            return new Usuario(
                userCreated.nome,
                userCreated.email,
                userCreated.favoritos,
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
            const usersToDB = usuarios.map(user => user.toDatabaseDocument());
            const usersCreated = await UsuarioModel.insertMany(usersToDB);

            return usersCreated.map(user => Usuario.fromJson(user));
        }catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao criar usuários no Banco de Dados.");
        }
    }

    async buscarTodos(): Promise<Usuario[]> {
        try {
            const users = await UsuarioModel.find();

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

            const user = await UsuarioModel.findById(id);

            if (!user) {
                return null;
            }

            return new Usuario(
                user.nome,
                user.email,
                user.favoritos,
                user._id.toString()
            );
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
                userUpdated.favoritos,
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