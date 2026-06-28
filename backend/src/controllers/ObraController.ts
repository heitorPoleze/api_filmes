import { Request, Response } from "express";
import { ObraServices } from "../services/application/ObraServices.ts";
import { ObraFactory } from "../entities/domains/factories/ObraFactory.ts";

export class ObraController {
    private _obraServices: ObraServices;

    constructor() {
        this._obraServices = new ObraServices();
    }

    async criar(req: Request, res: Response): Promise<void> {
        try{
            const obra = ObraFactory.mapFromPayload(req.body);
            
            const obraCriada = await this._obraServices.criar(obra);

            res.status(201).json(obraCriada.toJson());
        }catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            res.status(400).json({ error: "Erro desconhecido ao criar obra no Banco de Dados." });
        }
    }

    async criarMuitos(req: Request, res: Response): Promise<void> {
        try{
            const obras = req.body.map((obra: any) => ObraFactory.mapFromPayload(obra));

            const obrasCriadas = await this._obraServices.criarMuitos(obras);

            res.status(201).json(obrasCriadas.map(obra => obra.toJson()));
        }catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            res.status(400).json({ error: "Erro desconhecido ao criar obras no Banco de Dados." });
        }
    }

    async buscarTodos(req: Request, res: Response): Promise<void> {
        try{
            const obras = await this._obraServices.buscarTodos();

            res.status(200).json(obras.map(obra => obra.toJson()));
        }catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Erro desconhecido ao buscar obras no Banco de Dados." });
        }
    }

    async buscarPorId(req: Request, res: Response): Promise<void> {
        try{
            const obra = await this._obraServices.buscarPorId(req.params.id);

            res.status(200).json(obra.toJson());
        }catch (error) {
            if (error instanceof Error) {
                if(error.message.includes("não encontrado")){
                    res.status(404).json({ error: error.message });
                }else{
                    res.status(400).json({ error: error.message });
                }
            }
            res.status(500).json({ error: "Erro desconhecido ao buscar obra no Banco de Dados." });
        }
    }

    async buscarPorNome(req: Request, res: Response): Promise<void> {
        try{
            const obra = await this._obraServices.buscarPorNome(req.params.nome);

            res.status(200).json(obra.toJson());
        }catch (error) {
            if (error instanceof Error) {
                if(error.message.includes("não encontrado")){
                    res.status(404).json({ error: error.message });
                }else{
                    res.status(400).json({ error: error.message });
                }
            }
            res.status(500).json({ error: "Erro desconhecido ao buscar obra no Banco de Dados." });
        }
    }

    async atualizar(req: Request, res: Response): Promise<void> {
        try{
            const obraAtualizada = await this._obraServices.atualizar(req.params.id, req.body);

            res.status(200).json(obraAtualizada.toJson());
        }catch (error) {
            if (error instanceof Error) {
                if(error.message.includes("não encontrado")){
                    res.status(404).json({ error: error.message });
                }else{
                    res.status(400).json({ error: error.message });
                }
            }
            res.status(500).json({ error: "Erro desconhecido ao atualizar obra no Banco de Dados." });
        }
    }

    async deletar(req: Request, res: Response): Promise<void> {
        try{
            const id = req.params.id;
            await this._obraServices.deletar(id);
            res.status(204).send();
        }catch (error) {
            if (error instanceof Error) {
                if(error.message.includes("não encontrado")){
                    res.status(404).json({ error: error.message });
                }else{
                    res.status(400).json({ error: error.message });
                }
            }
            res.status(500).json({ error: "Erro desconhecido ao deletar obra no Banco de Dados." });
        }
    }

    async deletarPorNome(req: Request, res: Response): Promise<void> {
        try{
            const nome = req.params.nome;
            await this._obraServices.deletarPorNome(nome);
            res.status(204).send();
        }catch (error) {
            if (error instanceof Error) {
                if(error.message.includes("não encontrado")){
                    res.status(404).json({ error: error.message });
                }else{
                    res.status(400).json({ error: error.message });
                }
            }
            res.status(500).json({ error: "Erro desconhecido ao deletar obra no Banco de Dados." });
        }
    }
}