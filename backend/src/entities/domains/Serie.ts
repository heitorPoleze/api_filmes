import { Obra } from "./Obra.ts";
import { tipoObra } from "../types/tipoObra.ts";
import { Ator } from "./Ator.ts";

export class Serie extends Obra {
    private _number_of_episodes: number;
    private _number_of_seasons: number;

    constructor(id: number, name: string, overview: string, nota: number, atores: Array<Ator>, genres: Array<string>, number_of_episodes: number, number_of_seasons: number, imgLink?: string, release_date?: string){
        super(id, name, overview, nota, atores, genres, imgLink, release_date);
        this._number_of_episodes = number_of_episodes;
        this._number_of_seasons = number_of_seasons;
    } 

    get tipoObra(): tipoObra {
        return 'tv';
    }

    get number_of_episodes(): number {
        return this._number_of_episodes;
    }
    
    get number_of_seasons(): number {
        return this._number_of_seasons;
    }

    toString(): string {
        return super.toString() + ` \n\n Nº Episodios: ${this._number_of_episodes} \n\n Nº Temporadas: ${this._number_of_seasons}`;
    }

    toJson(): object {
        return {
            ...super.toJson(), 
            number_of_episodes: this.number_of_episodes, 
            number_of_seasons: this.number_of_seasons
        };
    }
}