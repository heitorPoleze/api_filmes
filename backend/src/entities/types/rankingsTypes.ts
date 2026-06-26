export type RankingUsuarioDTO = {
    _id: string;
    nome: string;
    email: string;
    totalAvaliacoesFeitas: number;
}

export type RankingObraPorDataDTO =  {
    idObra: string;
    nomeDaObra: string;
    tipo: string;
    notaMedia: number;
    maiorNotaRecebida: number;
    totalAvaliacoes: number;
}