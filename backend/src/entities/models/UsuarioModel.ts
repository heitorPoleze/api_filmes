import { model, Schema } from "mongoose";
import { UsuarioDoc } from "../types/UsuarioDoc.ts";

const UsuarioSchema = new Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true }, //cria índice de e-mail ao definir unique: true
    favoritos: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Obra'
    }]
}, { timestamps: true });

export const UsuarioModel = model<UsuarioDoc>("Usuario", UsuarioSchema);