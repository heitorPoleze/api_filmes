import { Request, Response } from "express";
import { Avaliacao } from "../entities/domains/Avaliacao.ts";
import { AvaliacaoServices } from "../services/application/AvaliacaoServices.ts";

export class AvaliacaoController {
    private _avaliacaoServices: AvaliacaoServices;

    constructor() {
        this._avaliacaoServices = new AvaliacaoServices();
    }

    async criar(req: Request, res: Response) {
        try {
            console.log("Passou pela fase 0 do controller");
            const avaliacaoDominio = Avaliacao.fromJson(req.body);
            console.log("Passou pela fase 1 do controller");
            const avaliacaoCriada = await this._avaliacaoServices.criar(avaliacaoDominio);
            console.log("Passou pela fase 2 do controller");
            return res.status(201).json(avaliacaoCriada.toJson());
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }
            res.status(400).json({ error: "Erro desconhecido ao criar avaliação." });
        }
    }

    async buscarTodos(req: Request, res: Response): Promise<void> {
        try {
            const nomeObra = req.query.name as string | undefined;
            
            let avaliacoes: Avaliacao[];
            
            if (nomeObra) {
                avaliacoes = await this._avaliacaoServices.buscarPorNomeObra(nomeObra);
            } else {
                avaliacoes = await this._avaliacaoServices.buscarTodos();
            }

            res.status(200).json(avaliacoes.map(a => a.toJson()));
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            res.status(400).json({ error: "Erro desconhecido ao buscar avaliações." });
        }
    }

    async buscarPorId(req: Request, res: Response): Promise<void> {
        try {
            const avaliacao = await this._avaliacaoServices.buscarPorId(req.params.id);
            res.status(200).json(avaliacao.toJson());
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("não encontrado")) {
                    res.status(404).json({ error: error.message });
                    return;
                }
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(400).json({ error: "Erro desconhecido ao buscar avaliação." });
        }
    }

    async atualizar(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const avaliacaoDominio = Avaliacao.fromJson(req.body);
            
            const avaliacaoAtualizada = await this._avaliacaoServices.atualizar(id, avaliacaoDominio);

            res.status(200).json(avaliacaoAtualizada.toJson());
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("não encontrado")) {
                    res.status(404).json({ error: error.message });
                    return;
                }
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(400).json({ error: "Erro desconhecido ao atualizar avaliação." });
        }
    }

    async deletar(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const deletado = await this._avaliacaoServices.deletar(id);
            
            if (!deletado) {
                res.status(404).json({ error: "Avaliação não encontrada para exclusão." });
                return;
            }

            res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(400).json({ error: "Erro desconhecido ao deletar avaliação." });
        }
    }

    async rankingUsuarios(req: Request, res: Response){
        try {
            const ranking = await this._avaliacaoServices.obterUsuariosMaisAtivos();
            return res.status(200).json(ranking);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar ranking de usuários." });
        }
    }

    async rankingObras(req: Request, res: Response){
        try {
            const dataInicio = req.query.data as string;
            if (!dataInicio) return res.status(400).json({ error: "Data de início obrigatória." });

            const ranking = await this._avaliacaoServices.obterMelhoresObrasPorData(dataInicio);
            return res.status(200).json(ranking);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar ranking de obras." });
        }
    }
}