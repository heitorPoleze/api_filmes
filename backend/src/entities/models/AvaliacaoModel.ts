import { model, Schema } from "mongoose";

const AvaliacaoSchema = new Schema({
    nota: { type: Number, required: true, min: 0, max: 10 },
    comentario: { type: String, required: false },
    
    obraId: { type: Number, required: true, ref: 'Obra' },
    usuarioId: { type: Schema.Types.ObjectId, required: true, ref: 'Usuario' }
}, { timestamps: true });

AvaliacaoSchema.index({ obraId: 1 });

export const AvaliacaoModel = model("Avaliacao", AvaliacaoSchema);