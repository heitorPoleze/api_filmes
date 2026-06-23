import { Types } from "mongoose";

export interface UsuarioDoc {
    _id?: Types.ObjectId | string;
    nome: string;
    email: string;
    favoritos: Types.ObjectId[] | string[] | any[]; 
}