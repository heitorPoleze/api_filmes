import { FilmeDoc, ObraDoc } from "../types/ObraDoc.ts";
import { tipoObra } from "../types/tipoObra.ts";
import { Ator } from "./Ator.ts";
import { Diretor } from "./Diretor.ts";
import { Obra } from "./Obra.ts";

export class Filme extends Obra {
    private _diretores: Diretor[];

    constructor(name: string, overview: string, atores: Array<Ator>, genres: Array<string>, diretores: Array<Diretor>, imgLink?: string, release_date?: string, nota?: number, idTmdb?: number, id?: string) {
        super(name, overview, atores, genres, imgLink, release_date, nota, idTmdb, id);
        this._diretores = diretores;
    }
    get tipoObra(): tipoObra {
        return 'movie';
    }

    get diretores(): Array<Diretor> {
        return [...this._diretores];
    }

    toString(): string {
        return super.toString() + ` \n\n Diretor(es): ${this.diretores.map(d => d.name).join(', ')}`;
    }

    toJson(): object {
        return {
            ...super.toJson(), 
            diretor: this.diretores.map(diretor => diretor.name)
        };  
    }

    toDatabaseDocument(): FilmeDoc {
        return {
            ...super.toDatabaseDocument(),
            diretores: this.diretores.map(d => d.name),
            tipo: "filme"
        }
    }

    static fromDatabase(payload: FilmeDoc): Filme {
        const atores = payload.atores.map(ator => new Ator(ator.name, ator.character));
        const diretores = payload.diretores.map(diretor => new Diretor(diretor));
        return new Filme(
            payload.name,
            payload.overview,
            atores,
            payload.genres,
            diretores,
            payload.imgLink,
            payload.release_date,
            payload.nota,
            payload.idTmdb,
            payload._id!.toString()
        )
    }


    createDoc(): FilmeDoc {
        return {
            ...super.createDoc(),
            diretores: this.diretores.map(d => d.name),
            tipo: "filme"
        }
    }
}