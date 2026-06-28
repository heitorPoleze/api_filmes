import { AvaliacaoModel } from "../../entities/models/AvaliacaoModel.ts";
import { ObraModel } from "../../entities/models/ObraModel.ts";
import { UsuarioModel } from "../../entities/models/UsuarioModel.ts";

export class SeedAvaliacoesService {
    private readonly mockComentarios = [
        "Sensacional! Emoção pura, parecia final de campeonato com o time do coração.",
        "Obra-prima! A atmosfera me lembrou muito a distorção e a melancolia do shoegaze.",
        "Achei a mecânica meio travada, parece servidor de League of Legends com lag.",
        "Decepcionante. Travou a imersão mais que The Sims 4 lotado de mods pesados.",
        "Nota máxima pela direção de arte e pela trilha sonora impecável.",
        "Uma experiência sólida. Fiquei muito preso do início ao fim."
    ]; //comentários gerados por IA kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk

    async executar() {
        try {
            const totalAvaliacoes = await AvaliacaoModel.countDocuments();
            if (totalAvaliacoes < 50) {
                const usuariosDb = await UsuarioModel.find({}, '_id');
                const obrasDb = await ObraModel.find({}, '_id');

                if (usuariosDb.length === 0) {
                    throw new Error("Nenhum usuário encontrado! Rode o seeder de Usuários primeiro.");
                }
                if (obrasDb.length === 0) {
                    throw new Error("Nenhuma obra encontrada! Rode o Seeder de Obras antes.");
                }

                await AvaliacaoModel.deleteMany({});
                
                const avaliacoesParaInserir = [];

            for (const usuario of usuariosDb) {
                const obrasEmbaralhadas = [...obrasDb].sort(() => 0.5 - Math.random()); //indexa as obras de forma aleatoria 
                
                const maxAvaliacoesPossiveis = Math.min(20, obrasDb.length); //determina que usuario avalia até 20 obras
                const quantidadeAvaliacoes = Math.floor(Math.random() * maxAvaliacoesPossiveis) + 1; //determina aleatoriamente a quantidade de avaliações do usuário
                
                const obrasSelecionadas = obrasEmbaralhadas.slice(0, quantidadeAvaliacoes); //recorta para a qtd de obras somente correspondente a qtd de avaliacoes

                for (const obra of obrasSelecionadas) {
                    const notaAleatoria = Math.floor(Math.random() * 11); // nota de 0 a 10
                    const comentarioAleatorio = this.mockComentarios[Math.floor(Math.random() * this.mockComentarios.length)]; // seleciona um comentario com base na aleatoriedade

                    avaliacoesParaInserir.push({
                        nota: notaAleatoria,
                        comentario: notaAleatoria < 4 ? "Não gostei muito." : comentarioAleatorio,
                        obraId: obra._id,
                        usuarioId: usuario._id
                    });
                }
            }

            await AvaliacaoModel.insertMany(avaliacoesParaInserir);

                console.log("Avaliações seedeadas com sucesso.")
            } else {
                console.log("Dados suficientes de avaliações no banco de dados.")
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Erro desconhecido ao Seedear avaliações no Banco de Dados.");
        }
    }
}