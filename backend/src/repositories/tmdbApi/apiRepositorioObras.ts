import { Obra } from "../../entities/domains/Obra.ts";
import { tipoObra } from "../../entities/types/tipoObra.ts";
import 'dotenv/config';

export abstract class ApiRepositorioObras{
    protected _topRatedUrl: string;
    protected _baseURL: string;
    protected _api_key: string;
    private _tipoObra: tipoObra;
    constructor(tipoObra: tipoObra){
        this._tipoObra = tipoObra;
        this._api_key = process.env.TMDB_API_KEY as string;
        this._baseURL = `https://api.themoviedb.org/3/${this._tipoObra}/`;
        this._topRatedUrl = `${this._baseURL}top_rated?api_key=${this._api_key}`;
    }
    get tipoObra(){
        return this._tipoObra
    }

    abstract getObras(quantidadeObras: number): Promise<Obra[]>
    abstract getGeneros(obra: Obra): Promise<Obra>
    abstract getAtores(obra: Obra): Promise<Obra>
    protected abstract mapToObra(jsonTMDB: any): Obra
}