import { Types } from "mongoose";
import { Filme } from "../../entities/domains/Filme.ts";
import { Obra } from "../../entities/domains/Obra.ts";
import { Serie } from "../../entities/domains/Serie.ts";
import { FilmeModel, ObraModel, SerieModel } from "../../entities/models/ObraModel.ts";
import { FilmeDoc, SerieDoc } from "../../entities/types/ObraDoc.ts";

export class ObraRepository {
    async criar(obra: Obra): Promise<Obra> {
        try {
            if (obra instanceof Filme) {
                const userToDb = obra.createDoc();
                const userCreated = await FilmeModel.create(userToDb);

                return Filme.fromDatabase(userCreated);
            }

            if (obra instanceof Serie) {
                const userToDb = obra.createDoc();
                const userCreated = await SerieModel.create(userToDb);

                return Serie.fromDatabase(userCreated);
            }

            throw new Error("Tipo de obra inválida.");
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao criar obra no Banco de Dados.");
        }
    }

    async criarMuitos(obras: Obra[]): Promise<Obra[]> {
        try {
            const filmes = obras.filter(obra => obra instanceof Filme);
            const series = obras.filter(obra => obra instanceof Serie);

            const filmesToDb = filmes.map(filme => filme.createDoc());
            const seriesToDb = series.map(serie => serie.createDoc());

            const filmesCreated = await FilmeModel.insertMany(filmesToDb);
            const seriesCreated = await SerieModel.insertMany(seriesToDb);

            return [...filmesCreated.map(filme => Filme.fromDatabase(filme)), ...seriesCreated.map(serie => Serie.fromDatabase(serie))];
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao criar obras no Banco de Dados.");
        }
    }

    async buscarTodos(): Promise<Obra[]> {
        try {
            const filmes = await FilmeModel.find();
            const series = await SerieModel.find();

            return [...filmes.map(filme => Filme.fromDatabase(filme)), ...series.map(serie => Serie.fromDatabase(serie))];
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao buscar obras no Banco de Dados.");
        }
    }

    async buscarPorId(id: string): Promise<Obra | null> {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new Error("ID inválido.");
            }

            const obra = await ObraModel.findById(id);
            if (!obra) return null;

            const tipoDaObra = obra.get("tipo");

            if (tipoDaObra === "filme") {
                // unica forma do TS nao reclamar mesmo sabendo que vai chegar um filme
                return Filme.fromDatabase(obra as unknown as FilmeDoc);
            }

            if (tipoDaObra === "serie") {
                return Serie.fromDatabase(obra as unknown as SerieDoc);
            }
            throw new Error("Tipo de obra inválida.");
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao buscar obra no Banco de Dados.");
        }
    }

    async atualizar(id: string, obraAtualizada: Obra): Promise<Obra | null> {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new Error("ID inválido.");
            }

            const obraToDb = obraAtualizada.toDatabaseDocument();

            const obraUpdated = await ObraModel.findByIdAndUpdate(
                id,
                obraToDb,
                { new: true } //devolve os dados novos
            );

            if (!obraUpdated) return null;

            const tipoDaObra = obraUpdated.get("tipo");

            if (tipoDaObra === "filme") {
                // unica forma do TS nao reclamar mesmo sabendo que vai chegar um filme
                return Filme.fromDatabase(obraUpdated as unknown as FilmeDoc);
            }

            if (tipoDaObra === "serie") {
                return Serie.fromDatabase(obraUpdated as unknown as SerieDoc);
            }

            throw new Error("Tipo de obra inválida.");
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao atualizar obra no Banco de Dados.");
        }
    }

    async deletar(id: string): Promise<boolean> {
        try {
            return await ObraModel.findByIdAndDelete(id) !== null ? true : false;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao deletar obra no Banco de Dados.");
        }
    }
}