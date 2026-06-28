import { Request, Response } from "express";
import { UsuarioServices } from "../services/application/UsuarioServices.ts";

export class UsuarioController {
    _userServices: UsuarioServices;
    constructor() {
        this._userServices = new UsuarioServices();
    }

    async criarUsuario(req: Request, res: Response): Promise<void> {
        try {
            const usuarioCriado = await this._userServices.criarUsuario(req.body);

            res.status(201).json(usuarioCriado.toJson());
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            res.status(400).json({ error: "Erro desconhecido ao criar usuário no Banco de Dados." });
        }
    }

    async criarMuitos(req: Request, res: Response): Promise<void> {
        try {
            const usuariosCriados = await this._userServices.criarMuitos(req.body);

            res.status(201).json(usuariosCriados.map(usuario => usuario.toJson()));
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            res.status(400).json({ error: "Erro desconhecido ao criar usuários no Banco de Dados." });
        }
    }

    async buscarTodos(req: Request, res: Response): Promise<void> {
        try {
            let usuarios;
            const nome = req.query.nome as string | undefined;
            const email = req.query.email as string | undefined;
            if(email || nome) {
                usuarios = await this._userServices.buscarPorFiltros(nome, email);
            }else{
                usuarios = await this._userServices.buscarTodos();
            }

            res.status(200).json(usuarios.map(usuario => usuario.toJson()));
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            res.status(400).json({ error: "Erro desconhecido ao buscar usuários no Banco de Dados." });
        }
    }

    async buscarPorId(req: Request, res: Response): Promise<void> {
        try {
            const usuario = await this._userServices.buscarPorId(req.params.id);

            res.status(200).json(usuario.toJson());
        } catch (error) {
            if (error instanceof Error) {
                if(error.message.includes("não encontrado")){
                    res.status(404).json({ error: error.message });
                }else{
                    res.status(400).json({ error: error.message });
                }
            }
            res.status(400).json({ error: "Erro desconhecido ao buscar usuário no Banco de Dados." });
        }
    }

    async atualizar(req: Request, res: Response): Promise<void> {
        try {
            const usuario = await this._userServices.atualizar(req.params.id, req.body);

            res.status(200).json(usuario.toJson());
        } catch (error) {
            if (error instanceof Error) {
                if(error.message.includes("não encontrado")){
                    res.status(404).json({ error: error.message });
                }else{
                    res.status(400).json({ error: error.message });
                }
            }
            res.status(400).json({ error: "Erro desconhecido ao atualizar usuário no Banco de Dados." });
        }
    }

    async deletar(req: Request, res: Response): Promise<void> {
        try{
            const id = req.params.id;
            await this._userServices.deletar(id);
            res.status(204).send();
        }catch (error) {
            if (error instanceof Error) {
                if(error.message.includes("não encontrado")){
                    res.status(404).json({ error: error.message });
                }else{
                    res.status(400).json({ error: error.message });
                }
            }
            res.status(400).json({ error: "Erro desconhecido ao deletar usuário no Banco de Dados." });
        }
    }

    async adicionarFavorito(req: Request, res: Response): Promise<void> {
        try {
            const idUser = req.params.idUser;
            const idObra = req.params.idObra;

            const user = await this._userServices.adicionarFavorito(idUser, idObra);
            
            res.status(200).json(user.toJson());
        }catch (error) {
            if (error instanceof Error) {
                if(error.message.includes("não encontrado")){
                    res.status(404).json({ error: error.message });
                }else{
                    res.status(400).json({ error: error.message });
                }
            }
            res.status(400).json({ error: "Erro desconhecido ao adicionar favorito no Banco de Dados." });
        }
    }

    async removerFavorito(req: Request, res: Response): Promise<void> {
        try {
            const idUser = req.params.idUser;
            const idObra = req.params.idObra;

            const user = await this._userServices.removerFavorito(idUser, idObra);
            
            res.status(200).json(user.toJson());
        }catch (error) {
            if (error instanceof Error) {
                if(error.message.includes("não encontrado")){
                    res.status(404).json({ error: error.message });
                }else{
                    res.status(400).json({ error: error.message });
                }
            }
            res.status(400).json({ error: "Erro desconhecido ao remover favorito no Banco de Dados." });
        }
    }
}

