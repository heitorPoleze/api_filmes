import { ObraFactory } from "../entities/domains/factories/ObraFactory.ts";
import { Filme } from "../entities/domains/Filme.ts";
import { Obra } from "../entities/domains/Obra.ts";
import { ObraDoc } from "../entities/types/ObraDoc.ts";
import { ObraRepository } from "../repositories/aplication/ObraRepository.ts";

export class ObraServices {
    private _obraRepo: ObraRepository;

    constructor() {
        this._obraRepo = new ObraRepository();
    }

    async criar(obra: Obra): Promise<Obra> {
        try {
            const createdObra = await this._obraRepo.criar(obra);
            return createdObra;
        }catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao criar obra no Banco de Dados.");
        }
    }

    async criarMuitos(obras: Obra[]): Promise<Obra[]> {
        try {
            const createdObras = await this._obraRepo.criarMuitos(obras);
            return createdObras;
        }catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao criar obras no Banco de Dados.");
        }
    }

    async buscarTodos(): Promise<Obra[]> {
        try {
            const obras = await this._obraRepo.buscarTodos();
            return obras;
        }catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao buscar obras no Banco de Dados.");
        }
    }

    async buscarPorId(id: string): Promise<Obra> {
        try {
            const obra = await this._obraRepo.buscarPorId(id);

            if(!obra) throw new Error("Obra nao encontrada.");

            return obra;
        }catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao buscar obra no Banco de Dados.");
        }
    }

    async buscarPorNome(nome: string): Promise<Obra> {
        try {
            const obra = await this._obraRepo.buscarPorNome(nome);

            if(!obra) throw new Error("Obra nao encontrada.");

            return obra;
        }catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao buscar obra no Banco de Dados.");
        }
    }

async atualizar(id: string, obra: ObraDoc): Promise<Obra> {
        try {
            const oldObra = await this._obraRepo.buscarPorId(id);

            if(!oldObra) throw new Error("Obra nao encontrada.");

            const dadosMesclados = {
                ...oldObra.toDatabaseDocument(),
                ...obra,
                _id: id,
                tipo: obra.tipo || (oldObra instanceof Filme ? "filme" : "serie"),
                nota: oldObra.nota,
                idTmdb: oldObra.idTmdb
            };

            const obraAtualizada = ObraFactory.mapFromPayload(dadosMesclados, id);

            const updatedObra = await this._obraRepo.atualizar(id, obraAtualizada);
            if(!updatedObra) throw new Error("Falha ao atualizar obra.");

            return updatedObra;
        } catch (error) {
            if(error instanceof Error) throw new Error(error.message);
            throw new Error("Erro desconhecido ao atualizar obra.");
        }
    }

    async deletar(id: string): Promise<boolean> {
        try {
            const isDeleted = await this._obraRepo.deletar(id);

            if (!isDeleted) throw new Error("Falha ao deletar obra.");

            return true;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao deletar obra no Banco de Dados.");
        }
    }

    async deletarPorNome(nome: string): Promise<boolean> {
        try {
            const isDeleted = await this._obraRepo.deletarPorNome(nome);

            if (!isDeleted) throw new Error("Falha ao deletar obra.");

            return true;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao deletar obra no Banco de Dados.");
        }
    }
}