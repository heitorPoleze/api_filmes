const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function getObras(type: "filmes" | "series", page?: number): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/${type}?page=${page}`);
  return res.json();
}

export async function getDetalhesObra(type: "filmes" | "series", id: number): Promise<any> {
  const res = await fetch(`${BASE_URL}/${type}/${id}`);
  return res.json();
}

export async function buscarPorPersonagem(type: "filmes" | "series", character: string): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/${type}/buscar-por-personagem?character=${character}`);
  return res.json();
}

export async function buscarPorTitulo(type: "filmes" | "series", titulo: string): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/${type}/buscar-por-titulo?titulo=${titulo}`);  
  return res.json();
}

export async function buscarPorDiretor(diretor: string): Promise<any[]>{
  const res = await fetch(`${BASE_URL}/filmes/buscar-por-diretor?diretor=${diretor}`);  
  return res.json();
}

export async function buscarPorAtor(type: "filmes" | "series", ator: string): Promise<any[]>{
  const res = await fetch(`${BASE_URL}/${type}/buscar-por-ator?ator=${ator}`);  
  return res.json();
}

export async function buscarPorGenero(type: "filmes" | "series", generos: string[]): Promise<any[]>{
  if(generos.length > 1){
    const get = generos.map(genero => `generos=${genero}`).join("&");
    const res = await fetch(`${BASE_URL}/${type}/buscar-por-genero?${get}`);  
    return res.json();
  }else{
    const res = await fetch(`${BASE_URL}/${type}/buscar-por-genero?generos=${generos}`);  
    return res.json();
  }
}