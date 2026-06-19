import { Pessoa } from "./Pessoa.ts";

export class Participacao{
    private _participante: Pessoa;
    constructor(participante: Pessoa){
        this._participante = participante;
    }

    get participante(): Pessoa{
        return this._participante;
    }
}