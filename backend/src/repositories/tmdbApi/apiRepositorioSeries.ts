import { Ator } from "../../entities/domains/Ator.ts";
import { Serie } from "../../entities/domains/Serie.ts";
import { ApiRepositorioObras } from "./apiRepositorioObras.ts";

export class ApiRepositorioSeries extends ApiRepositorioObras {
    constructor() {
        super("tv");
    }

    async getObras(quantidadeObras: number): Promise<Serie[]> {
        const series: Serie[] = [];
        const qtdObrasPorPagina = 20;
        //arredonda pra cima para o numero inteiro mais proximo
        const paginasNecessarias = Math.ceil(quantidadeObras / qtdObrasPorPagina);

        try {
            for (let i = 1; i <= paginasNecessarias; i++) {
                const response = await fetch(`${this._topRatedUrl}&page=${i}`);

                if (!response.ok) {
                    throw new Error("Erro na comunicação com a API TMDB");
                }

                const data = await response.json();
                const seriesMapeadas = data.results.map((payloadTMDB: any) => this.mapToObra(payloadTMDB));
                series.push(...seriesMapeadas);
            }

            return series.slice(0, quantidadeObras);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Falha ao buscar filmes:", error.message);
            }
            console.error(error)
            throw new Error("Erro desconhecido ao buscar filmes.");
        }
    }

    async getGeneros(serie: Serie): Promise<Serie> {
        try {
            const id = serie.idTmdb;
            const url = `${this._baseURL}${id}?api_key=${this._api_key}`;
            const response = await fetch(url);

            if (!response.ok) throw new Error("Erro na comunicação com API TMDB");

            const data = await response.json();

            const generos: string[] = [];
            data.genres.forEach((genre: any) => generos.push(genre.name))

            return new Serie(
                serie.name,
                serie.overview,
                serie.atores,
                generos,
                serie.imgLink,
                serie.release_date,
                serie.nota,
                serie.idTmdb,
                serie.number_of_episodes,
                serie.number_of_seasons
            )
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Falha ao buscar gêneros do filme ${serie.name}: ${error.message}`);
            }
            console.error(error)
            throw new Error("Erro desconhecido ao buscar gênero do filme.");
        }
    }

    async getAtores(serie: Serie): Promise<Serie> {
        try {
            const id = serie.idTmdb;
            const url = `${this._baseURL}${id}/credits?api_key=${this._api_key}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("Erro na comunicação com API TMDB");
            const data = await response.json();

            const atores: Ator[] = [];
            data.cast.slice(0, 15).map((ator: any) => {
                atores.push(new Ator(
                    ator.name,
                    ator.character
                ))
            });
            const newSerie =  new Serie(
                serie.name,
                serie.overview,
                atores,
                serie.genres,
                serie.imgLink,
                serie.release_date,
                serie.nota,
                serie.idTmdb,
                serie.number_of_episodes,
                serie.number_of_seasons
            );

            return newSerie;
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Falha ao buscar atores do filme ${serie.name}: ${error.message}`);
            }
            console.error(error)
            throw new Error("Erro desconhecido ao buscar atores do filme.");
        }
    }

    async getNumberOfEpisodesAndSeasons(serie: Serie): Promise<Serie> {
        try{
            const id = serie.idTmdb;
            const url = `${this._baseURL}${id}?api_key=${this._api_key}`

            const response = await fetch(url);
            if (!response.ok) throw new Error("Erro na comunicação com API TMDB");
            const data = await response.json();

            const number_of_episodes = data.number_of_episodes;
            const number_of_seasons = data.number_of_seasons;

            return new Serie(
                serie.name,
                serie.overview,
                serie.atores,
                serie.genres,
                serie.imgLink,
                serie.release_date,
                serie.nota,
                serie.idTmdb,
                number_of_episodes,
                number_of_seasons
            )
        }catch(error){
            if (error instanceof Error) {
                console.error(`Falha ao buscar dados do filme ${serie.name}: ${error.message}`);
            }
            console.error(error)
            throw new Error("Erro desconhecido ao buscar dados do filme.");
        }
    }
    protected mapToObra(jsonTMDB: any): Serie {
        return new Serie(
            jsonTMDB.name,
            jsonTMDB.overview,
            [],
            [],
            jsonTMDB.poster_path,
            jsonTMDB.release_date,
            jsonTMDB.vote_average,
            jsonTMDB.id,
            jsonTMDB.number_of_episodes,
            jsonTMDB.number_of_seasons
        )
    }
}