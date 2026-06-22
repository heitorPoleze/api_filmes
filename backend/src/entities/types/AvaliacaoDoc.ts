import { Types } from "mongoose";

export interface AvaliacaoDoc {
    _id?: Types.ObjectId | string;
    nota: number;
    comentario?: string;
    obraId: number;
    usuarioId: Types.ObjectId | string; 
}