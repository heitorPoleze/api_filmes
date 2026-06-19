export interface ObraDoc  {
  _id?: number; 
  name: string;
  overview: string;
  genres: string[];
  imgLink?: string;
  nota: number;
  release_date?: string;
  atores: { name: string; character: string }[];
  tipo?: "filme" | "serie";
}


export interface FilmeDoc extends ObraDoc {
  diretor: string[];
}

export interface SerieDoc extends ObraDoc {
  number_of_episodes: number;
  number_of_seasons: number;
}

