import { Pessoa } from "./Pessoa.ts";

export class Ator extends Pessoa {
  private _character: string;

  constructor(name: string, character?: string) {
    super(name);
    this._character = character || "Não creditado";
  }

  get character(): string {
    return this._character;
  }

  toJson(): object {
    return { ...super.toJson(), character: this.character };
  }

  static fromJSON(jsonTMDB: any): Ator {
    const nome = jsonTMDB.name || "Nome não informado";
    const personagem = jsonTMDB.character; 
    
    return new Ator(nome, personagem);
  }
}