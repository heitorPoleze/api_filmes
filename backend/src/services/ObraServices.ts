import { Filme } from "../entities/domains/Filme.ts";
import { Obra } from "../entities/domains/Obra.ts";
import { Serie } from "../entities/domains/Serie.ts";
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

async atualizar(id: string, obra: Obra): Promise<Obra> {
        try {
            const oldObra = await this._obraRepo.buscarPorId(id);

            if(!oldObra) throw new Error("Obra nao encontrada.");

            if (obra instanceof Filme) {
                const oldFilme = oldObra as Filme; 

                const filmeToUpdate = new Filme(
                    oldFilme.name,
                    oldFilme.overview,
                    oldFilme.atores,
                    oldFilme.genres,
                    oldFilme.diretores,
                    oldFilme.imgLink,
                    oldFilme.release_date,
                    oldFilme.nota,
                    oldFilme.idTmdb,
                    oldFilme.id
                );

                const updatedFilme = await this._obraRepo.atualizar(id, filmeToUpdate);
                if (!updatedFilme) throw new Error("Falha ao atualizar filme.");
                
                return updatedFilme;
            }

            if (obra instanceof Serie) {
                const oldSerie = oldObra as Serie;

                const serieToUpdate = new Serie(
                    oldSerie.name,
                    oldSerie.overview,
                    oldSerie.atores,
                    oldSerie.genres,
                    oldSerie.imgLink,
                    oldSerie.release_date,
                    oldSerie.nota,
                    oldSerie.idTmdb,
                    oldSerie.number_of_episodes,
                    oldSerie.number_of_seasons,
                    oldSerie.id
                );

                const updatedSerie = await this._obraRepo.atualizar(id, serieToUpdate);
                if (!updatedSerie) throw new Error("Falha ao atualizar série.");
                
                return updatedSerie;
            }

            throw new Error("Tipo de obra inválida.");

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
}