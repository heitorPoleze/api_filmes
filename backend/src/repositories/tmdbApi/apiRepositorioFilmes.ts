import { Ator } from "../../entities/domains/Ator.ts";
import { Diretor } from "../../entities/domains/Diretor.ts";
import { Filme } from "../../entities/domains/Filme.ts";
import { ApiRepositorioObras } from "./apiRepositorioObras.ts";

export class ApiRepositorioFilmes extends ApiRepositorioObras {
    constructor() {
        super("movie");
    }

    async getObras(quantidadeObras: number): Promise<Filme[]> {
        const filmes: Filme[] = []
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
                const mapearParaObra = data.results.map((jsonTMDB: any) => this.mapToObra(jsonTMDB));
                filmes.push(...mapearParaObra);
            }

            return filmes.slice(0, quantidadeObras);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Falha ao buscar filmes:", error.message);
            }
            console.error(error)
            throw new Error("Erro desconhecido ao buscar filmes.");
        }
    }

    async getGeneros(filme: Filme): Promise<Filme> {
        try {
            const id = filme.idTmdb;
            const url = `${this._baseURL}${id}?api_key=${this._api_key}`;
            const response = await fetch(url);

            if(!response.ok) throw new Error("Erro na comunicação com API TMDB");

            const data = await response.json();

            const generos: string[] = [];
            data.genres.forEach((genre: any) => generos.push(genre.name))

            return new Filme(
                filme.name,
                filme.overview,
                filme.atores,
                generos,
                filme.diretores,
                filme.imgLink,
                filme.release_date,
                filme.nota,
                filme.idTmdb
            )
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Falha ao buscar gêneros do filme ${filme.name}: ${error.message}`);
            }
            console.error(error)
            throw new Error("Erro desconhecido ao buscar gênero do filme.");
        }
    }

    async getAtores(filme: Filme): Promise<Filme> {
        try {
            const id = filme.idTmdb;
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

            return new Filme(
                filme.name,
                filme.overview,
                atores,
                filme.genres,
                filme.diretores,
                filme.imgLink,
                filme.release_date,
                filme.nota,
                filme.idTmdb
            )
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Falha ao buscar atores do filme ${filme.name}: ${error.message}`);
            }
            console.error(error)
            throw new Error("Erro desconhecido ao buscar atores do filme.");
        }
    }

    async getDiretores(filme: Filme): Promise<Filme> {
        try {
            const id = filme.idTmdb;
            const url = `${this._baseURL}${id}/credits?api_key=${this._api_key}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("Erro na comunicação com API TMDB");
            const data = await response.json();

            const diretores: Diretor[] = data.crew
                .filter((tecnico: any) => tecnico.job === "Director")
                .map((diretorJson: any) => new Diretor(diretorJson.name));

            const newFilme =  new Filme(
                filme.name,
                filme.overview,
                filme.atores,
                filme.genres,
                diretores,
                filme.imgLink,
                filme.release_date,
                filme.nota,
                filme.idTmdb
            )
            return newFilme;
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Falha ao buscar diretores do filme ${filme.name}: ${error.message}`);
            }
            console.error(error)
            throw new Error("Erro desconhecido ao buscar diretores do filme.");
        }
    }

    protected mapToObra(jsonTMDB: any): Filme {
        return new Filme(
            jsonTMDB.title,
            jsonTMDB.overview,
            [],
            [],
            [],
            jsonTMDB.poster_path,
            jsonTMDB.release_date,
            jsonTMDB.vote_average,
            jsonTMDB.id
        )
    }
}