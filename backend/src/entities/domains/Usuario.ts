import { UsuarioDoc } from "../types/UsuarioDoc.ts";

export class Usuario {
    private _id?: string;
    private _nome: string;
    private _email: string;
    private _favoritos: string[];

    constructor(nome: string, email: string, favoritos: string[] = [], id?: string) {
        this._nome = nome;
        this._email = email;
        this._favoritos = favoritos;
        this._id = id;
    }

    get id(): string | undefined {
        return this._id;
    }

    get nome(): string {
        return this._nome;
    }

    get email(): string {
        return this._email;
    }

    get favoritos(): string[] {
        return [...this._favoritos];
    }

    adicionarFavorito(obraId: string): void {
        if (!this._favoritos.includes(obraId)) {
            this._favoritos.push(obraId);
        }
    }

    removerFavorito(obraId: string): void {
        this._favoritos = this._favoritos.filter(id => id !== obraId);
    }

    toJson(): object {
        return {
            id: this.id,
            nome: this.nome,
            email: this.email,
            favoritos: this.favoritos
        };
    }


    toDatabaseDocument(): UsuarioDoc {
        return {
            _id: this.id,
            nome: this.nome,
            email: this.email,
            favoritos: this.favoritos
        };
    }

    static fromJson(json: any): Usuario {
        if (!json.nome) {
            throw new Error("O nome é obrigatório na requisição.");
        }
        if (!json.email) {
            throw new Error("O email é obrigatório na requisição.");
        }

        const nome = String(json.nome);
        const email = String(json.email);
        
        let favoritos: string[] = [];
        if (Array.isArray(json.favoritos)) {
            favoritos = json.favoritos
                .map((fav: string) => fav);
        }

        const id = json.id || json._id ? String(json.id || json._id) : undefined;

        return new Usuario(nome, email, favoritos, id);
    }
}