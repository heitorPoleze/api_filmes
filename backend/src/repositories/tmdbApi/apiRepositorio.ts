import { Obra } from "../../entities/domains/Obra.ts";
import { tipoObra } from "../../entities/types/tipoObra.ts";

export abstract class ApiRepositorioObra{
    protected _url: string;
    protected _api_key: string;
    private _tipoObra: tipoObra;
    constructor(tipoObra: tipoObra){
        this._tipoObra = tipoObra;
        this._api_key = process.env.TMDB_API_KEY as string;
        this._url = `https://api.themoviedb.org/3/${this._tipoObra}/top_rated?api_key=${this._api_key}`
    }
    get tipoObra(){
        return this._tipoObra
    }

    abstract getObras(quantidadeObras: number): Promise<Obra[]>
    abstract getGeneros(obra: Obra): Promise<Obra>
    abstract getAtores(obra: Obra): Promise<Obra>
    protected abstract mapToObra(jsonTMDB: any): Obra
}