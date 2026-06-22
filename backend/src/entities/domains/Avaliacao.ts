import { AvaliacaoDoc } from "../types/AvaliacaoDoc.ts";

export class Avaliacao {
    private _id?: string;
    private _nota: number;
    private _comentario?: string;
    private _obraId: number;
    private _usuarioId: string;

    constructor(nota: number, obraId: number, usuarioId: string, comentario?: string, id?: string) {
        this._nota = this.verificaNota(nota); 
        this._comentario = comentario;
        this._obraId = obraId;
        this._usuarioId = usuarioId;
        this._id = id;
    }

    get id(): string | undefined {
        return this._id;
    }

    get nota(): number {
        return this._nota;
    }

    get comentario(): string | undefined {
        return this._comentario;
    }

    get obraId(): number {
        return this._obraId;
    }

    get usuarioId(): string {
        return this._usuarioId;
    }

    set nota(novaNota: number) {
        this.verificaNota(novaNota);
        this._nota = novaNota;
    }

    private verificaNota(nota: number){
        if (!Number.isInteger(nota)){
            throw new Error ("A nota da avaliação deve ser um número inteiro.");
        }
        if(nota < 0 || nota > 10){
            throw new Error ("A nota da avaliação deve estar entre 0 e 10.");
        }
        return nota;
    }
    toJson(): object {
        return {
            id: this.id,
            nota: this.nota,
            comentario: this.comentario,
            obraId: this.obraId,
            usuarioId: this.usuarioId
        };
    }

    toDatabaseDocument(): AvaliacaoDoc {
        return {
            _id: this.id,
            nota: this.nota,
            comentario: this.comentario,
            obraId: this.obraId,
            usuarioId: this.usuarioId
        };
    }

    static fromJson(json: any): Avaliacao {
       if (json.nota === undefined || json.nota === null) {
            throw new Error("A nota é obrigatória na requisição.");
        }
        if (!json.obraId) {
            throw new Error("O ID da obra (obraId) é obrigatório na requisição.");
        }
        if (!json.usuarioId) {
            throw new Error("O ID do usuário (usuarioId) é obrigatório na requisição.");
        }

        const nota = Number(json.nota);
        const obraId = Number(json.obraId);
        const usuarioId = String(json.usuarioId);
        const comentario = json.comentario ? String(json.comentario) : undefined;
        
        // Aceita tanto id (do frontend) quanto _id (do banco de dados)
        const id = json.id || json._id ? String(json.id || json._id) : undefined;

        return new Avaliacao(nota, obraId, usuarioId, comentario, id);
    }
}