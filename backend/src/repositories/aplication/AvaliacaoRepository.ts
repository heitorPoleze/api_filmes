import { Types } from "mongoose";
import { Avaliacao } from "../../entities/domains/Avaliacao.ts";
import { AvaliacaoModel } from "../../entities/models/AvaliacaoModel.ts";
import { ObraRepository } from "./ObraRepository.ts";
import { RankingObraPorDataDTO, RankingUsuarioDTO } from "../../entities/types/rankingsTypes.ts";

export class AvaliacaoRepository {
    private _duplicataStatusCode: number;
    private _obraRepo: ObraRepository;

    constructor() {
        this._duplicataStatusCode = 11000;
        this._obraRepo = new ObraRepository();
    }

    async criar(avaliacao: Avaliacao): Promise<Avaliacao> {
        try{
            const avaliacaoDoc = avaliacao.toDatabaseDocument();
            const avaliacaoCriada = await AvaliacaoModel.create(avaliacaoDoc);

            return Avaliacao.fromJson(avaliacaoCriada);
        }catch (error: any) {
            if(error.code == this._duplicataStatusCode) throw new Error("Usuário já avaliou essa obra.");
            if (error instanceof Error) throw new Error(error.message);
            throw new Error("Erro desconhecido ao criar avaliação no Banco de Dados.");
        }
    }

    async buscarPorNomeObra(nomeObra: string): Promise<Avaliacao[]> {
        try {
            const obra = await this._obraRepo.buscarPorNome(nomeObra);

            if(!obra) throw new Error("Obra nao encontrada.");

            const avaliacoes = await AvaliacaoModel.find({ obra: obra.id });
            if(!avaliacoes) throw new Error("Avaliacoes nao encontradas.");
            if(avaliacoes.length == 0) throw new Error("Nenhuma avaliação foi registrada para essa obra.");
            
            return avaliacoes.map(avaliacao => Avaliacao.fromJson(avaliacao));
        } catch (error: any) {
            if (error instanceof Error) throw new Error(error.message);
            throw new Error("Erro desconhecido ao buscar avaliacoes no Banco de Dados.");
        }
    }

    async buscarPorId(id: string): Promise<Avaliacao> {
        try {
            if(!Types.ObjectId.isValid(id)) throw new Error("ID inválido.");
            const avaliacao = await AvaliacaoModel.findById(id);
            if(!avaliacao) throw new Error("Avaliação nao encontrada.");

            return Avaliacao.fromJson(avaliacao);
        } catch (error: any) {
            if (error instanceof Error) throw new Error(error.message);
            throw new Error("Erro desconhecido ao buscar avaliação no Banco de Dados.");
        }
    }

    async buscarTodos(): Promise<Avaliacao[]> {
        try {
            const avaliacoes = await AvaliacaoModel.find();
            if(!avaliacoes) throw new Error("Avaliacoes nao encontradas.");
            if(avaliacoes.length == 0) throw new Error("Nenhuma avaliação foi registrada.");
            
            return avaliacoes.map(avaliacao => Avaliacao.fromJson(avaliacao));
        } catch (error: any) {
            if (error instanceof Error) throw new Error(error.message);
            throw new Error("Erro desconhecido ao buscar avaliacoes no Banco de Dados.");
        }
    }

    async atualizar(id: string, avaliacaoAtualizada: Avaliacao): Promise<Avaliacao> {
        try {
            if(!Types.ObjectId.isValid(id)) throw new Error("ID inválido.");
            const avaliacaoDoc = {
                $set: {
                    nota: avaliacaoAtualizada.nota,
                    comentario: avaliacaoAtualizada.comentario
                }
            }
            const avaliacaoDb = await AvaliacaoModel.findByIdAndUpdate(id, avaliacaoDoc, { new: true });
            if(!avaliacaoDb) throw new Error("Avaliação nao encontrada.");

            return Avaliacao.fromJson(avaliacaoDb);
        } catch (error: any) {
            if (error instanceof Error) throw new Error(error.message);
            throw new Error("Erro desconhecido ao atualizar avaliação no Banco de Dados.");
        }
    }

    async deletar(id: string): Promise<boolean> {
        try {
            if(!Types.ObjectId.isValid(id)) throw new Error("ID inválido.");
            const avaliacao = await AvaliacaoModel.findByIdAndDelete(id);
            if(!avaliacao) return false;
            return true;
        } catch (error: any) {
            if (error instanceof Error) throw new Error(error.message);
            throw new Error("Erro desconhecido ao deletar avaliação no Banco de Dados.");
        }
    }

    async calculaNotaObra(idObra: string): Promise<number>{
        const result = await AvaliacaoModel.aggregate([
            { $match: { obra: new Types.ObjectId(idObra) } }, //where
            { $group: { _id: "$obraId", media: { $avg: "$nota" } } } // $ para demarcar qual é a variável
        ])

        return result.length > 0 ? result[0].media : 0;
    }

    async usuariosMaisAtivos(): Promise<RankingUsuarioDTO[]>{
        return await AvaliacaoModel.aggregate([
            { 
                $group: { 
                    _id: "$usuarioId", 
                    totalAvaliacoesFeitas: { $sum: 1 } //soma 1 pra cada documento
                } 
            },
            { 
                $lookup: {
                    from: "usuarios", // Nome da collection de usuários
                    localField: "_id",
                    foreignField: "_id",
                    as: "dadosUsuario"
                } 
            },
            { $unwind: "$dadosUsuario" },
            {
                $addFields: {
                    nomeUsuario: "$dadosUsuario.nome",
                    emailUsuario: "$dadosUsuario.email"
                }
            },
            {
                $project: {
                    _id: 1,
                    nomeUsuario: 1,
                    emailUsuario: 1,
                    totalAvaliacoesFeitas: 1
                }
            },
            { $sort: { totalAvaliacoesFeitas: -1 } },
            { $limit: 5 }
        ]);
    }

    async melhoresObrasPorData(dataInicio: Date): Promise<RankingObraPorDataDTO[]> {
        return await AvaliacaoModel.aggregate([
            { 
                $match: { createdAt: { $gte: dataInicio } } //igual ou maior que a data de início
            },
            { 
                $group: { 
                    _id: "$obraId", 
                    notaMedia: { $avg: "$nota" },
                    maiorNotaRecebida: { $max: "$nota" },
                    totalAvaliacoes: { $sum: 1 }
                } 
            },
            { 
                $lookup: {
                    from: "obras", // dê join em obras
                    localField: "_id", // pega o id do $group
                    foreignField: "_id", // compara com o id de obras
                    as: "dadosObra" // retorna os docs de obras como dadosObra
                } 
            },
            { $unwind: "$dadosObra" }, // tira os dados de cada obra de um vetor
            {
                $project: {
                    _id: 0,
                    idObra: { $toString: "$_id"},
                    nomeDaObra: "$dadosObra.name",
                    tipo: "$dadosObra.tipo",
                    mediaNotas: { $round: ["$mediaNotas", 1] },
                    maiorNotaRecebida: 1,
                    totalAvaliacoes: 1
                }
            },
            { $sort: { mediaNotas: -1, totalAvaliacoes: -1 } },
            { $limit: 5 }
        ]);
    }
}