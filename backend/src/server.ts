import express from "express";
import cors from "cors";
import { Filme } from "./Models/Filme.ts";
import { Serie } from "./Models/Serie.ts";
import { RepositorioObras } from "./Repositories/RepositorioObras.ts";
import { RepositorioParticipacao } from "./Repositories/RepositorioParticipacao.ts";

const app = express();
const PORT = 3000;


  const repFilmes = new RepositorioObras('movie');
  const repSeries = new RepositorioObras('tv');
  const repParticipacao = new RepositorioParticipacao();
app.use(cors());
(async () => {  try {
    app.get('/filmes/buscar-por-diretor', (req, res) => {
      const nomeDiretor = String(req.query.diretor || '');
      const filmes = repFilmes.buscarPorNomeDiretor(nomeDiretor);
      res.json(filmes);
    });

    app.get('/filmes/buscar-por-ator', (req, res) => {
      const nomeAtor = String(req.query.ator || '');
      const filmes = repFilmes.buscarPorNomeAtor(nomeAtor).filter(obra => obra instanceof Filme);
      res.json(filmes);
    })

    app.get('/series/buscar-por-ator', (req, res) => {
      const nomeAtor = String(req.query.ator || '');
      const series = repSeries.buscarPorNomeAtor(nomeAtor).filter(obra => obra instanceof Serie);
      res.json(series);
    });

    app.get('/filmes/buscar-por-genero', (req, res) => {
      const generos = req.query.generos;
      const listaGeneros = Array.isArray(generos)
        ? generos as string[] : [generos as string];
      const filmes = repFilmes.buscarPorGenero(listaGeneros).filter(obra => obra instanceof Filme);
      res.json(filmes);
    });

    app.get('/series/buscar-por-genero', (req, res) => {
      const generos = req.query.generos;
      const listaGeneros = Array.isArray(generos)
        ? generos as string[] : [generos as string];
      const series = repSeries.buscarPorGenero(listaGeneros)
      res.json(series);
    });

    app.get('/filmes/buscar-por-titulo', (req, res) => {
      const titulo = String(req.query.titulo || '');
      const filmes = repFilmes.buscarPorTitulo(titulo)
      res.json(filmes);
    });

    app.get('/series/buscar-por-titulo', (req, res) => {
      const titulo = String(req.query.titulo || '');
      const series = repSeries.buscarPorTitulo(titulo);
      res.json(series);
    })

    app.get('/filmes/buscar-por-personagem', (req, res) => {
      const nomePersonagem = String(req.query.character || '');
      const resultados = repFilmes.buscarPorNomePersonagem(nomePersonagem);
      res.json(resultados);
    });

    app.get('/series/buscar-por-personagem', (req, res) => {
      const nomePersonagem = String(req.query.character || '');
      const personagens = repSeries.buscarPorNomePersonagem(nomePersonagem);
      res.json(personagens);
    });

    app.get('/filmes', async (req, res) => {
      const pagina = Number(req.query.page) || 1;
      const filmes = await repFilmes.getMelhoresObras(pagina);
      for (const filme of filmes) {
        const generos = await repFilmes.getNomesDosGenerosDaObra('movie', filme.id);
        const participacaoData = await repParticipacao.getAtoresEDiretores('movie', filme.id);
        const participacao = [
          ...participacaoData.atores,
          ...participacaoData.diretores
        ];
        repFilmes.adicionar(new Filme(
          filme.id,
          filme.title,
          filme.overview,
          filme.poster_path,
          filme.vote_average,
          participacao,
          generos,
          filme.release_date
        ));
      }
      res.json(filmes);
    });

    app.get('/series', async (req, res) => {
      const pagina = Number(req.query.page) || 1;
      const series = await repSeries.getMelhoresObras(pagina);
      res.json(series);
    });

    app.get('/filmes/:id', async (req, res) => {
      const id = Number(req.params.id);
      const filme = repFilmes.listarFilmes().find((filme: Filme) => filme.id === id);
      if (filme) {
        res.json(filme.toJson());
      }
    });

    app.get('/series/:id', (req, res) => {
      const id = Number(req.params.id);
      const serie = repSeries.listarSeries().find((serie: Serie) => serie.id === id);
      if (serie) {
        res.json(serie.toJson());
      }
    });

    app.listen(PORT, () =>
      console.log(`Servidor rodando na porta ${PORT}`)
    );
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
  }
})();

