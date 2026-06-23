import { Obra } from "./Obra.ts";
import { tipoObra } from "../types/tipoObra.ts";
import { Ator } from "./Ator.ts";
import { ObraDoc, SerieDoc } from "../types/ObraDoc.ts";

export class Serie extends Obra {
    private _number_of_episodes: number;
    private _number_of_seasons: number;

    constructor(name: string, overview: string, atores: Array<Ator>, genres: Array<string>, imgLink?: string, release_date?: string, nota?: number, idTmdb?: number, number_of_episodes?: number, number_of_seasons?: number, id?: string) {
        super(name, overview, atores, genres, imgLink, release_date, nota, idTmdb, id);
        this._number_of_episodes = number_of_episodes ? number_of_episodes : 0;
        this._number_of_seasons = number_of_seasons ? number_of_seasons : 0;
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

    toDatabaseDocument(): SerieDoc {
        return {
            ...super.toDatabaseDocument(),
            number_of_episodes: this.number_of_episodes,
            number_of_seasons: this.number_of_seasons,
            tipo: "serie"
        }
    }

    static fromDatabase(payload: SerieDoc): Serie {
        const atores = payload.atores.map(ator => new Ator(ator.name, ator.character));

        return new Serie(
            payload.name,
            payload.overview,
            atores,
            payload.genres,
            payload.imgLink,
            payload.release_date,
            payload.nota,
            payload.idTmdb,
            payload.number_of_episodes,
            payload.number_of_seasons,
            payload._id!.toString()
        )
    }

    createDoc(): SerieDoc {
        return {
            ...super.createDoc(),
            number_of_episodes: this.number_of_episodes,
            number_of_seasons: this.number_of_seasons,
            tipo: "serie"
        }
    }
}