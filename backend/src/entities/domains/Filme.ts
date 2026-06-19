import { tipoObra } from "../types/tipoObra.ts";
import { Ator } from "./Ator.ts";
import { Diretor } from "./Diretor.ts";
import { Obra } from "./Obra.ts";

export class Filme extends Obra {
    private _diretores: Diretor[];
    constructor(id: number, name: string, overview: string, nota: number, atores: Array<Ator>, genres: Array<string>, diretores: Diretor[], imgLink?: string, release_date?: string ) {
        super(id, name, overview, nota, atores, genres, imgLink, release_date);
        this._diretores = diretores;
    }   

    get tipoObra(): tipoObra {
        return 'movie';
    }

    get diretor(): Array<Diretor> {
        return [...this._diretores];
    }

    toString(): string {
        return super.toString() + ` \n\n Diretor(es): ${this.diretor.map(d => d.name).join(', ')}`;
    }

    toJson(): object {
        return {
            ...super.toJson(), 
            diretor: this.diretor.map(diretor => diretor.name)
        };  
    }
}