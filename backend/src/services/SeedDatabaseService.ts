import { Filme } from "../entities/domains/Filme.ts";
import { Serie } from "../entities/domains/Serie.ts";
import { FilmeModel, ObraModel, SerieModel } from "../entities/models/ObraModel.ts";
import { ApiRepositorioFilmes } from "../repositories/tmdbApi/apiRepositorioFilmes.ts";
import { ApiRepositorioSeries } from "../repositories/tmdbApi/apiRepositorioSeries.ts";

export class SeedDatabaseService {
    private _serieRepo: ApiRepositorioSeries;
    private _filmeRepo: ApiRepositorioFilmes;

    constructor() {
        this._filmeRepo = new ApiRepositorioFilmes();
        this._serieRepo = new ApiRepositorioSeries;
    }

    async seedearFilmes() {
        try {
            const filmes = await this._filmeRepo.getObras(50);
            //para o typescript, não se pode usar await em maps. Por isso usar Promisse.all
            const filmesCompletos = await Promise.all(
                filmes.map(async (filme: Filme) => {
                    let filmeAtualizado = await this._filmeRepo.getAtores(filme);

                    filmeAtualizado = await this._filmeRepo.getDiretores(filmeAtualizado);
                    
                    filmeAtualizado = await this._filmeRepo.getGeneros(filmeAtualizado);
                    
                    return filmeAtualizado;
                })
            );
            const filmesToDoc = filmesCompletos.map(filme => filme.toDatabaseDocument());
            await FilmeModel.deleteMany();
            await FilmeModel.insertMany(filmesToDoc);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao Seedear filmes no Banco de Dados.");

        }
    }

    async seedearSeries() {
        try {
            const series = await this._serieRepo.getObras(50);

            const seriesCompletas = await Promise.all(
                series.map(async (serie: Serie) => {
                    let serieAtualizada = await this._serieRepo.getAtores(serie);

                    serieAtualizada = await this._serieRepo.getGeneros(serieAtualizada);

                    serieAtualizada = await this._serieRepo.getNumberOfEpisodesAndSeasons(serieAtualizada);

                    return serieAtualizada;
                })
            );

            const seriesToDoc = seriesCompletas.map(serie => serie.toDatabaseDocument());
            await SerieModel.deleteMany();
            await SerieModel.insertMany(seriesToDoc);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao Seedear séries no Banco de Dados.");

        }
    }

    async executar(): Promise<void> {
        try {
            const totalObras = await ObraModel.countDocuments();
            if(totalObras < 90){
                await this.seedearFilmes();
                await this.seedearSeries();
            }else{
                console.log("Dados suficientes no banco de dados.")
            }

        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao Seedear o Banco de Dados.");
        }

    }
}