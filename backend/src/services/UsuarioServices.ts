import { Usuario } from "../entities/domains/Usuario.ts";
import { UsuarioDoc } from "../entities/types/UsuarioDoc.ts";
import { ObraRepository } from "../repositories/aplication/ObraRepository.ts";
import { UsuarioRepository } from "../repositories/aplication/UsuarioRepository.ts";

export class UsuarioServices {
    private _userRepo: UsuarioRepository;
    private _obraRepo: ObraRepository;
    constructor(){
        this._userRepo = new UsuarioRepository();
        this._obraRepo = new ObraRepository();
    }

    async criarUsuario(payload: UsuarioDoc): Promise<Usuario>{
        try{
            const jsonToUser = new Usuario(payload.nome, payload.email, []);
            const createdUser = await this._userRepo.criar(jsonToUser);
            return createdUser;
        }catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao criar usuário no Banco de Dados.");
        }
    }

    async criarMuitos(payload: UsuarioDoc[]): Promise<Usuario[]>{
        try{
            if (!Array.isArray(payload)) {
            throw new Error("Os dados devem ser enviados em formato de lista (Array).");
          }
            const jsonToUser = payload.map(user => new Usuario(user.nome, user.email, []));
            const createdUsers = await this._userRepo.criarMuitos(jsonToUser);
            return createdUsers;
        }catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao criar usuários no Banco de Dados");
        }
    }

    async buscarTodos(): Promise<Usuario[]>{
        try{
            const users = await this._userRepo.buscarTodos();
            return users;
        }catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao buscar usuários no Banco de Dados");
        }
    }

    async buscarPorId(id: string): Promise<Usuario>{
        try{
            const user = await this._userRepo.buscarPorId(id);
            if(!user) throw new Error("Usuário não encontrado.");
            return user;
        }catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao buscar usuário no Banco de Dados");
        }
    }

    async atualizar(id: string, payload: UsuarioDoc): Promise<Usuario>{
        try{
            const oldUser = await this._userRepo.buscarPorId(id);
            
            if(!oldUser) throw new Error("Usuário não encontrado.");
            
            const userToUpdate = {
                _id: oldUser.id,
                email: payload.email || oldUser.email,
                nome: payload.nome || oldUser.nome,
                favoritos: oldUser.favoritos
            }

            const userToDb = Usuario.fromJson(userToUpdate);
            const updatedUser = await this._userRepo.atualizar(id, userToDb);
            
            if(!updatedUser) throw new Error("Usuário não encontrado.");
            return updatedUser;
        }catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao atualizar usuário no Banco de Dados");
        }
    }

    async deletar(id: string): Promise<boolean>{
        try{
            return await this._userRepo.deletar(id);
        }catch(error){
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao deletar usuário no Banco de Dados.");
        }
    }

    async adicionarFavorito(idUser: string, idObra: string): Promise<Usuario>{
        try{
            const user = await this._userRepo.buscarPorId(idUser);
            if(!user) throw new Error("Usuário não encontrado.");
            
            const obra = await this._obraRepo.buscarPorId(idObra);
            if(!obra) throw new Error("Obra não encontrada.");

            user.adicionarFavorito(idObra);
            
            const userUpdated = await this._userRepo.atualizar(idUser, user);
            if(!userUpdated) throw new Error("Falha ao atualizar usuário.");
            
            return userUpdated;
        }catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao adicionar favorito no Banco de Dados.");
        }
    }

    async removerFavorito(idUser: string, idObra: string): Promise<Usuario>{
        try{
            const user = await this._userRepo.buscarPorId(idUser);
            if(!user) throw new Error("Usuário não encontrado.");
            
            user.removerFavorito(idObra);
            
            const userUpdated = await this._userRepo.atualizar(idUser, user);
            if(!userUpdated) throw new Error("Falha ao atualizar usuário.");
            
            return userUpdated;
        }catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao remover favorito no Banco de Dados.");
        }
    }
}