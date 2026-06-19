import { tipoObra } from "../Controllers/tipoObra.ts";
import { Filme } from "../entity/domain/Filme.ts";
import { Obra } from "../entity/domain/Obra.ts";
import { Serie } from "../entity/domain/Serie.ts";
import dotenv from "dotenv";
dotenv.config();
const API_KEY = process.env.TMDB_API_KEY;
export class RepositorioObras {
    private tipoObra: tipoObra;
    constructor(tipoObra: tipoObra) {
        this.tipoObra = tipoObra;
    },
    private obras: Array<Obra> = [];
    async getMelhoresObras(page: number = 1): Promise<any[]> {
        const url = `https://api.themoviedb.org/3/${this.tipoObra}/top_rated?api_key=${API_KEY}&page=${page}`;

        const response = await fetch(url);
    if (!response.ok) throw new Error("Erro na API externa");
    const data = await response.json();
    return data.results;
    }

    async getNomesDosGenerosDaObra(tipoObra: tipoObra, obraId: number): Promise<string[]> {
      const generos: string[] = [];
      const url = `https://api.themoviedb.org/3/${tipoObra}/${obraId}?api_key=${API_KEY}`;
      const response: Response = await fetch(url);
      const data = await response.json();
      data.genres.forEach((genero: any) => {
        generos.push(genero.name);
      });
      return generos;
    }


    adicionar(obra: Obra): void {
        this.obras.push(obra);
    }
    listarSeries(): Serie[] {
        return this.obras.filter((obra: Obra) => {
            return obra instanceof Serie
        })
    }
    listarFilmes(): Filme[] {
        return this.obras.filter((obra: Obra) => {
            return obra instanceof Filme
        })
    }
    buscarPorGenero(inpGenero: string[]): Obra[] {
        return this.obras.filter(obra => inpGenero.every(genero => obra.genres.includes(genero)));
    }

    buscarPorTitulo(inpTitulo: string): Obra[] {
        return this.obras.filter(obra => obra.pesquisarPorCriterio(inpTitulo));
    }

    buscarPorNomeAtor(inpNome: string): Obra[] {
        return this.obras.filter(obra => obra.atores.some(ator => ator.pesquisarPorCriterio(inpNome)));
    }

    buscarPorNomePersonagem(inpNome: string): Obra[] {
        return this.obras.filter(obra => obra.atores.some(ator => ator.character.toLowerCase().includes(inpNome.toLowerCase())));
    }

    buscarPorNomeDiretor(inpNome: string): Filme[] {
        const filmes = this.obras.filter(obra => obra instanceof Filme) as Filme[];
        return filmes.filter(filme => filme.diretor.some(diretor => diretor.pesquisarPorCriterio(inpNome)));
    }
}