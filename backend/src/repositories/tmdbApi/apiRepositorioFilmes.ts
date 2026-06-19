import { json } from "express";
import { Ator } from "../../entities/domains/Ator.ts";
import { Diretor } from "../../entities/domains/Diretor.ts";
import { Filme } from "../../entities/domains/Filme.ts";
import { Obra } from "../../entities/domains/Obra.ts";
import { ApiRepositorioObra } from "./apiRepositorio.ts";

export class ApiRepositorioFilmes extends ApiRepositorioObra {
    constructor() {
        super("movie");
    }

    async getObras(quantidadeObras: number): Promise<Obra[]> {
        const obras: Obra[] = []
        const qtdObrasPorPagina = 20;
        //arredonda pra cima para o numero inteiro mais proximo
        const paginasNecessarias = Math.ceil(quantidadeObras / qtdObrasPorPagina);

        try {
            for (let i = 1; i <= paginasNecessarias; i++) {
                const response = await fetch(`${this._url}&page=${i}`);
                if (!response.ok) {
                    throw new Error("Erro na comunicação com a API TMDB");
                }
                const data = await response.json();
                const mapearParaObra = data.results.map((jsonTMDB: any) => this.mapToObra(jsonTMDB));
                obras.push(...mapearParaObra);
            }

            return obras.slice(0, quantidadeObras);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Falha ao buscar filmes:", error.message);
            }             
            throw new Error("Erro desconhecido ao buscar filmes.");
        }
    }

    async getGeneros(obra: Obra): Promise<Obra> {

    }

    async getAtores(): Promise<Obra> {

    }

    async getDiretores(): Promise<Obra> {

    }

    protected mapToObra(jsonTMDB: any): Filme {
        return new Filme(
            jsonTMDB.id,
            jsonTMDB.title,
            jsonTMDB.overview,
            jsonTMDB.vote_average,
            [],
            [],
            [],
            jsonTMDB.poster_path,
            jsonTMDB.release_date
        )
    }
}