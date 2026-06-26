import { Types } from "mongoose";

export interface AvaliacaoDoc {
    _id?: Types.ObjectId | string;
    nota: number;
    comentario?: string;
    obraId: Types.ObjectId | string;
    usuarioId: Types.ObjectId | string; 
}