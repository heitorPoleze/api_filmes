export interface ObraDoc {
  _id?: string;
  idTmdb?: number;
  name: string;
  overview: string;
  genres: string[];
  imgLink?: string;
  nota: number;
  release_date?: string;
  atores: { name: string; character: string }[];
  tipo?: string;
}

export interface FilmeDoc extends ObraDoc {
  tipo: "filme";
  diretores: string[];
}

export interface SerieDoc extends ObraDoc {
  tipo: "serie";
  number_of_episodes: number;
  number_of_seasons: number;
}

export interface CriarObraDoc {
  name: string;
  overview: string;
  genres: string[];
  imgLink?: string;
  release_date?: string;
  atores: { name: string; character: string }[];
  tipo?: "filme" | "serie";
}

export interface CriarFilmeDoc extends CriarObraDoc {
  diretores: string[];
}

export interface CriarSerieDoc extends CriarObraDoc {
  number_of_episodes: number;
  number_of_seasons: number;
}