import { model, Schema } from "mongoose";
import { AvaliacaoDoc } from "../types/AvaliacaoDoc.ts";

const AvaliacaoSchema = new Schema({
    nota: { type: Number, required: true, min: 0, max: 10 },
    comentario: { type: String, required: false },
    
    obraId: { type: Schema.Types.ObjectId, required: true, ref: 'Obra' },
    usuarioId: { type: Schema.Types.ObjectId, required: true, ref: 'Usuario' }
}, { timestamps: true });

AvaliacaoSchema.index({ obraId: 1, usuarioId: 1 }, { unique: true });

export const AvaliacaoModel = model<AvaliacaoDoc>("Avaliacao", AvaliacaoSchema);