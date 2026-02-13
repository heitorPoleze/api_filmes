import { IPesquisavel } from "./IPesquisavel.ts";

export class Pessoa implements IPesquisavel{
    private _name: string;
    
    constructor(name: string){
        this._name = name;
    }
    get name(): string{
        return this._name;
    }
    toJson(): object{
        return {name: this.name};
    }

    pesquisarPorCriterio(criterio: string): boolean {
        return this.name.toLowerCase().includes(criterio.toLowerCase()); 
    }
}