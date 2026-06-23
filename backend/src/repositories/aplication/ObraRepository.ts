import { Types } from "mongoose";
import { Filme } from "../../entities/domains/Filme.ts";
import { Obra } from "../../entities/domains/Obra.ts";
import { Serie } from "../../entities/domains/Serie.ts";
import { FilmeModel, ObraModel, SerieModel } from "../../entities/models/ObraModel.ts";
import { FilmeDoc, SerieDoc } from "../../entities/types/ObraDoc.ts";
import { ObraFactory } from "../../entities/domains/factories/ObraFactory.ts";

export class ObraRepository {
    async criar(obra: Obra): Promise<Obra> {
        try {
            const obraExistente = await ObraModel.findOne({ name: obra.name });

            if (obraExistente) {
                throw new Error(`Já existe uma obra cadastrada com o nome '${obra.name}'.`);
            }

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
            //filtra duplicatas do payload
            const nomesVistos = new Set<string>();
            const payloadSemDuplicatas = obras.filter(obra => {
                if (nomesVistos.has(obra.name)) return false; 
                nomesVistos.add(obra.name);
                return true;
            });
            if (payloadSemDuplicatas.length === 0) throw new Error("O payload contém apenas obras duplicadas.");

            //2. verifica duplicatas no banco de dados 
            const nomesParaVerificar = payloadSemDuplicatas.map(obra => obra.name);
            const obrasNoBanco = await ObraModel.find({ name: { $in: nomesParaVerificar } });

            const nomesDuplicados = new Set(obrasNoBanco.map(obra => obra.name));
            const obrasUnicas = payloadSemDuplicatas.filter(obra => !nomesDuplicados.has(obra.name));
            if(obrasUnicas.length === 0) throw new Error("O payload contém obras duplicadas com o banco de dados.");
            const filmes = obrasUnicas.filter(obra => obra instanceof Filme);
            const series = obrasUnicas.filter(obra => obra instanceof Serie);

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

            return ObraFactory.fromDatabase(obra);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao buscar obra no Banco de Dados.");
        }
    }

    async buscarPorNome(nome: string): Promise<Obra | null> {
        try {
            const obra = await ObraModel.findOne({ name: nome });
            if (!obra) return null;

            return ObraFactory.fromDatabase(obra);
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

            return ObraFactory.fromDatabase(obraUpdated);
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

    async deletarPorNome(nome: string): Promise<boolean> {
        try {
            return await ObraModel.deleteOne({ name: nome }) !== null ? true : false;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao deletar obra no Banco de Dados.");
        }
    }
}