import { model, Schema } from "mongoose";
import { FilmeDoc, ObraDoc, SerieDoc } from "../types/ObraDoc.ts";

const baseOptions = {
  discriminatorKey: "tipo", //"tipo" não está como um dos atributos da collection obra porque o discriminatorKey espera uma herança ditar o que preencherá o atributo "tipo". Pode instanciar a superclasse, mas ela não terá por padrão o tipo.
  collection: "obras",
  timestamps: true
};

const ObraBaseSchema = new Schema({
  _id: { type: Number, required: true },
  name: { type: String, required: true },
  overview: { type: String, required: true },
  genres: { type: [String], default: [] },
  imgLink: { type: String, required: false },
  nota: { type: Number, required: true },
  release_date: { type: String, required: false },
  atores: [
    {
      name: { type: String, required: true },
      character: { type: String, required: true },
      _id: false
    }
  ]
}, baseOptions);

// Model são as collections do banco de dados. No repositório, é para referenciar eles.
export const ObraModel = model<ObraDoc>("Obra", ObraBaseSchema);

//.discriminator clona a classe que chama (ObraModel) como se fosse uma herança. Pede obrigatoriamente a instanciação da discriminatoriKey e dos novos atributos
export const FilmeModel = ObraModel.discriminator<FilmeDoc>(
  "filme",
  new Schema({
    diretores: { type: [String], default: [] }
  })
);

export const SerieModel = ObraModel.discriminator<SerieDoc>(
  "serie",
  new Schema({
    number_of_episodes: { type: Number, required: false, default: 0},
    number_of_seasons: { type: Number, required: false, default: 0 }
  })
);