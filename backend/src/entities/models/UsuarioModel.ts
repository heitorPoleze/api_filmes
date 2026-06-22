import { model, Schema } from "mongoose";

const UsuarioSchema = new Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    favoritos: { type: [Number], default: [] } // IDs das obras
}, { timestamps: true });

export const UsuarioModel = model("Usuario", UsuarioSchema);