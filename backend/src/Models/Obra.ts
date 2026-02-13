import { Ator } from "./Ator.ts";
import { IPesquisavel } from "./IPesquisavel.ts";
import { Participacao } from "./Participacao.ts";
import { Pessoa } from "./Pessoa.ts";

export abstract class Obra implements IPesquisavel {
    private _id: number;
    private _name: string;
    private _overview: string;
    private _genres: Array<string>;
    private _imgLink: string;
    private _nota: number;
    private _equipe: Array<Participacao>;
    private _release_date: string;

    constructor(id: number, name: string, overview: string, imgLink: string, nota: number, equipe: Array<Participacao>, genres: Array<string>, release_date: string) {
        this._id = id;
        this._name = name;
        this._overview = overview;
        this._genres = genres;
        this._imgLink = "https://image.tmdb.org/t/p/w500" + imgLink;
        this._nota = Number(nota.toFixed(2));
        this._equipe = equipe;
        this._release_date = release_date;
    }

    get id(): number {
        return this._id;
    }
    get name(): string {
        return this._name;
    }
    get overview(): string {
        return this._overview;
    }
    get imgLink(): string {
        return this._imgLink;
    }
    get nota(): number {
        return this._nota;
    }
    get equipe(): Array<Pessoa> {
        return this._equipe.map(equipe => equipe.participante);
    }
    get atores(): Array<Ator> {
        return this.equipe.filter(equipe => equipe instanceof Ator);
    }
    get genres(): Array<string> {
        return [...this._genres];
    }
    get release_date(): string {
        return this._release_date;
    }
    get atoresInfo(): string {
        return this.atores.map(ator => ator.name + " - " + ator.character).join(", ");
    }
    get genresInfo(): string {
        return this._genres.join(`, `);
    }
    get release_dateYear(): string {
        return this._release_date.slice(0, 4);
    }
    toString(){
        return `Título: ${this._name} (${this.release_dateYear}) \n\n Sinopse: ${this._overview} \n\n Gêneros: ${this._genres} \n\n Pôster: ${this._imgLink} \n\n Nota: ${this._nota} \n\n Atores: ${this.atoresInfo}`;
    }
    toJson(): object{
        return {
            id: this.id,
            name: this.name,
            overview: this.overview,  
            genres: this.genres,  
            imgLink: this.imgLink,
            nota: this.nota,
            atores: this.atores.map(ator => ator.toJson()),
            release_date: this.release_date
        }
    }

    pesquisarPorCriterio(criterio: string): boolean {
        return this.name.toLowerCase().includes(criterio.toLowerCase());
    }

}