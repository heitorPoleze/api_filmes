export class Pessoa {
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
}