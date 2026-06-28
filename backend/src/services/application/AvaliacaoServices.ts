import { Avaliacao } from "../../entities/domains/Avaliacao.ts";
import { RankingObraPorDataDTO, RankingUsuarioDTO } from "../../entities/types/rankingsTypes.ts";
import { AvaliacaoRepository } from "../../repositories/application/AvaliacaoRepository.ts";
import { ObraRepository } from "../../repositories/application/ObraRepository.ts";

export class AvaliacaoServices {
    private _avalicaoRepo: AvaliacaoRepository;
    private _obraRepo: ObraRepository;
    constructor() {
        this._avalicaoRepo = new AvaliacaoRepository();
        this._obraRepo = new ObraRepository();
    }

    private async atualizarMediaDaObra(idObra: string): Promise<void> {
        const novaMedia = await this._avalicaoRepo.calculaNotaObra(idObra);
        
        await this._obraRepo.atualizarNota(idObra, novaMedia);
    }

    async criar(avaliacao: Avaliacao): Promise<Avaliacao> {
        const avaliacaoNova = await this._avalicaoRepo.criar(avaliacao);

        await this.atualizarMediaDaObra(avaliacao.obraId.toString());

        return avaliacaoNova;
    }

    async buscarPorNomeObra(nome: string): Promise<Avaliacao[]> {
        return await this._avalicaoRepo.buscarPorNomeObra(nome);
    }

    async buscarPorId(id: string): Promise<Avaliacao> {
        return await this._avalicaoRepo.buscarPorId(id);
    }

    async buscarTodos(): Promise<Avaliacao[]> {
        return await this._avalicaoRepo.buscarTodos();
    }

    async atualizar(id: string, avaliacaoAtualizada: Avaliacao): Promise<Avaliacao> {
        const novaAvaliacao = await this._avalicaoRepo.atualizar(id, avaliacaoAtualizada);
        await this.atualizarMediaDaObra(avaliacaoAtualizada.obraId.toString());
        return novaAvaliacao;
    }

    async deletar(id: string): Promise<boolean> {
        return await this._avalicaoRepo.deletar(id);
    }

    async obterUsuariosMaisAtivos(): Promise<RankingUsuarioDTO[]> {
        return await this._avalicaoRepo.usuariosMaisAtivos();
    }

    async obterMelhoresObrasPorData(dataInicio: string): Promise<RankingObraPorDataDTO[]> {
        const data = new Date(dataInicio);
        return await this._avalicaoRepo.melhoresObrasPorData(data);
    }    
}