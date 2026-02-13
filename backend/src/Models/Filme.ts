import { Diretor } from "./Diretor.ts";
import { Participacao } from "./Participacao.ts";
import { Obra } from "./Obra.ts";

export class Filme extends Obra {
    constructor(id: number, name: string, overview: string, imgLink: string, nota: number, equipe: Array<Participacao>, genres: Array<string>, release_date: string ) {
        super(id, name, overview, imgLink, nota, equipe, genres, release_date);
    }   

    get diretor(): Array<Diretor> {
        return [...this.equipe.filter(equipe => equipe instanceof Diretor)];
    }

    toString(): string {
        return super.toString() + ` \n\n ${this.diretor}`;
    }
    toJson(): object {
        return {... super.toJson(), diretor: this.diretor.map(diretor => diretor.name)};  
    }
}