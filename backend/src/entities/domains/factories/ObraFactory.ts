import { FilmeDoc, SerieDoc } from "../../types/ObraDoc.ts";
import { Ator } from "../Ator.ts";
import { Diretor } from "../Diretor.ts";
import { Filme } from "../Filme.ts";
import { Obra } from "../Obra.ts";
import { Serie } from "../Serie.ts";

export class ObraFactory {
        static mapFromPayload(payload: any, id?: string): Obra {
            const atores = payload.atores.map((ator: any) => Ator.fromJSON(ator));
            if(payload.tipo == "filme") {
                const diretores = payload.diretores.map((diretor: any) => new Diretor(diretor));
                return new Filme(
                    payload.name,
                    payload.overview,
                    atores,
                    payload.genres,
                    diretores,
                    payload.imgLink,
                    payload.release_date,
                    payload.nota || 0,
                    payload.idTmdb,
                    id
                )
            }else if(payload.tipo == "serie") {
                return new Serie(
                    payload.name,
                    payload.overview,
                    atores,
                    payload.genres,
                    payload.imgLink,
                    payload.release_date,
                    payload.nota || 0,
                    payload.idTmdb,
                    payload.number_of_episodes,
                    payload.number_of_seasons,
                    id
                )
        }
    
        throw new Error("O campo 'tipo' deve ser 'filme' ou 'serie'.");
    }

    static fromDatabase(obraDb: any): Obra {
        const tipoDaObra = obraDb.get ? obraDb.get("tipo") : obraDb.tipo;

        if (tipoDaObra === "filme") {
            return Filme.fromDatabase(obraDb as unknown as FilmeDoc);
        }

        if (tipoDaObra === "serie") {
            return Serie.fromDatabase(obraDb as unknown as SerieDoc);
        }

        throw new Error("Tipo de obra inválida encontrada no Banco de Dados.");
    }
}