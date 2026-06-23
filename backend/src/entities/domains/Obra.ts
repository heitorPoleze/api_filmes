import { ObraDoc } from "../types/ObraDoc.ts";
import { tipoObra } from "../types/tipoObra.ts";
import { Ator } from "./Ator.ts";

export abstract class Obra {
    private _name: string;
    private _overview: string;
    private _genres: Array<string>;
    private _atores: Array<Ator>;
    
    private _idTmdb?: number;
    private _id?: string;
    private _nota?: number;
    private _imgLink?: string;
    private _release_date?: string;

    constructor(name: string, overview: string, atores: Array<Ator>, genres: Array<string>, imgLink?: string, release_date?: string, nota?: number, idTmdb?: number, id?: string) {
        this._idTmdb = idTmdb;
        this._id = id;
        this._name = name;
        this._overview = overview;
        this._genres = genres;
        this._nota = Number(nota?.toFixed(2));
        this._atores = atores;
        this._release_date = release_date;

        if (imgLink) {
            this._imgLink = imgLink.startsWith("http") ? imgLink : "https://image.tmdb.org/t/p/w500" + imgLink;
        }
    }

    abstract get tipoObra(): tipoObra;

    get idTmdb(): number | undefined {
        return this._idTmdb;
    }

    get id(): string | undefined {
        return this._id;
    }

    get name(): string {
        return this._name;
    }
    get overview(): string {
        return this._overview;
    }
    get imgLink(): string | undefined {
        return this._imgLink;
    }
    get nota(): number | undefined {
        return this._nota;
    }
    get atores(): Array<Ator> {
        return [...this._atores];
    }
    get genres(): Array<string> {
        return [...this._genres];
    }
    get release_date(): string | undefined {
        return this._release_date;
    }
    get atoresInfo(): string {
        return this.atores.map(ator => ator.name + " - " + ator.character).join(", ");
    }
    get genresInfo(): string {
        return this._genres.join(`, `);
    }
    get release_dateYear(): string {
        return this._release_date ? this._release_date.slice(0, 4) : "Data Indefinida";
    }

    toString(){
        const ano = this.release_dateYear;
        return `Título: ${this._name} (${ano}) \n\n Sinopse: ${this._overview} \n\n Gêneros: ${this._genres} \n\n Pôster: ${this.imgLink ? this.imgLink : undefined} \n\n Nota: ${this._nota} \n\n Atores: ${this.atoresInfo}`;
    }
    

    toJson(): object {
        return {
            id: this.id,
            idTmdb: this.idTmdb,
            name: this.name,
            overview: this.overview,  
            genres: this.genres,  
            imgLink: this.imgLink,
            nota: this.nota,
            atores: this.atores.map(ator => ator.toJson()),
            release_date: this.release_date,
            tipoObra: this.tipoObra
        }
    }

    toDatabaseDocument(): ObraDoc {
        return {
            idTmdb: this.idTmdb,
            name: this.name,
            overview: this.overview,
            genres: this.genres,
            imgLink: this.imgLink,
            nota: this.nota ?? 0,
            atores: this.atores.map(ator => ({ name: ator.name, character: ator.character })), 
            release_date: this.release_date
        }
    }

    createDoc(): ObraDoc {
        return {
            idTmdb: this.idTmdb,
            name: this.name,
            overview: this.overview,
            genres: this.genres,
            imgLink: this.imgLink,
            nota: 0,
            atores: this.atores,
            release_date: this.release_date,
        }
    }
}