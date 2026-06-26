import { Avaliacao } from "../entities/domains/Avaliacao.ts";
import { AvaliacaoRepository } from "../repositories/aplication/AvaliacaoRepository.ts";
import { ObraRepository } from "../repositories/aplication/ObraRepository.ts";

export class AvaliacaoServices {
    private _avalicaoRepo: AvaliacaoRepository;
    private _obraRepo: ObraRepository;
    constructor() {
        this._avalicaoRepo = new AvaliacaoRepository();
        this._obraRepo = new ObraRepository();
    }

    private async atualizarMediaDaObra(idObra: string): Promise<void> {
        const novaMedia = await this._avalicaoRepo.calculaNotaObra(idObra);
        
        await this._avalicaoRepo.atualizarNota(idObra, novaMedia);
    }

    async criar(avaliacao: Avaliacao): Promise<Avaliacao> {
        return await this._avalicaoRepo.criar(avaliacao);
    }

    async buscarPorNomeObra(nomeObra: string): Promise<Avaliacao[]> {
        return await this._avalicaoRepo.buscarPorNomeObra(nomeObra);
    }

    async buscarPorId(id: string): Promise<Avaliacao> {
        return await this._avalicaoRepo.buscarPorId(id);
    }

    async buscarTodos(): Promise<Avaliacao[]> {
        return await this._avalicaoRepo.buscarTodos();
    }

    async atualizar(id: string, avaliacaoAtualizada: Avaliacao): Promise<Avaliacao> {
        return await this._avalicaoRepo.atualizar(id, avaliacaoAtualizada);
    }

    async deletar(id: string): Promise<boolean> {
        return await this._avalicaoRepo.deletar(id);
    }


}