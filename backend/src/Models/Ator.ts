import { Pessoa } from "./Pessoa.ts";

export class Ator extends Pessoa {
  private _character: string;

  constructor(name: string, character: string) {
    super(name);
    this._character = character;
  }

  get character(): string {
    return this._character;
  }

  toJson(): object {
    return { ...super.toJson(), character: this.character };
  }
  
}
