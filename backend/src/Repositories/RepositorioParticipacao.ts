
import dotenv from "dotenv";
import { tipoObra } from "../Controllers/tipoObra";
import { Ator } from "../Models/Ator";
import { Diretor } from "../Models/Diretor";
dotenv.config();
const API_KEY = process.env.TMDB_API_KEY;

export class RepositorioParticipacao {
    private atores: Ator[] = [];
    private diretores: Diretor[] = [];

    async getAtoresEDiretores(tipoObra: tipoObra, obraId: number): Promise<{ atores: any[], diretores: any[] }> {
        const url = `https://api.themoviedb.org/3/${tipoObra}/${obraId}/credits?api_key=${API_KEY}`;
        const response: Response = await fetch(url);
        const data = await response.json();

        data.cast.forEach((ator: any) => {
            this.atores.push(ator);
        });

        data.crew.forEach((tecnico: any) => {
            if (tecnico.job === "Director") {
                this.diretores.push(tecnico);
            }
        });

        return { atores: this.atores, diretores: this.diretores };
    }
}