import { tipoObra } from "../Controllers/tipoObra";
import { RepositorioObras } from "./RepositorioObras";
import dotenv from "dotenv";
dotenv.config();
const API_KEY = process.env.TMDB_API_KEY;
export class RepositorioSeries extends RepositorioObras {
    constructor(tipoObra: tipoObra) {
        super(tipoObra);
    }

    async getNumeroDeEpisodiosETemporadas(obraId: number): Promise<{ number_of_episodes: number, number_of_seasons: number }> {
      const url = `https://api.themoviedb.org/3/tv/${obraId}?api_key=${API_KEY}`;
      const response: Response = await fetch(url);
      const data = await response.json();
      return { number_of_episodes: data.number_of_episodes, number_of_seasons: data.number_of_seasons };
    }
}