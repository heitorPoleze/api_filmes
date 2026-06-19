import { tipoObra } from "../types/tipoObra.ts";
import { Diretor } from "./Diretor.ts";
import { Obra } from "./Obra.ts";
import { Participacao } from "./Participacao.ts";

export class Filme extends Obra {
    constructor(id: number, name: string, overview: string, nota: number, equipe: Array<Participacao>, genres: Array<string>, imgLink?: string, release_date?: string ) {
        super(id, name, overview, nota, equipe, genres, imgLink, release_date);
    }   

    get tipoObra(): tipoObra {
        return 'movie';
    }


    get diretor(): Array<Diretor> {
        return [...this.equipe.filter(equipe => equipe instanceof Diretor)];
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