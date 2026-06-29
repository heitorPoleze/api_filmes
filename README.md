# 50_melhores_filmes
https://50-melhores-filmes-5lzt.vercel.app

A partir da API do TMDB, busco os "top rated" filmes e séries e traduzo-os para mongodb, permitindo que usuários façam crud das obras e as avaliem a partir do crud de usuarios;

## Como rodar a aplicação:

### 1. Pré-requisitos
Certifique-se de ter instalado em sua máquina:
* **Node.js** (versão 18 ou superior recomendada).
* **npm** (geralmente instalado junto com o Node.js).
* **MongoDB** (Comunitário ou Atlas).

### 2. Instalação do Banco de Dados (MongoDB)
* **Local:** [Baixe e instale o MongoDB Community Server](https://www.mongodb.com/try/download/community). Certifique-se de que o serviço `mongod` esteja rodando (geralmente na porta `27017`).

### 3. Configuração do Ambiente
1. Clone este repositório em sua máquina.
2. Acesse a pasta do projeto: `cd backend`.
3. Crie um arquivo chamado `.env` na raiz da pasta `backend`.
4. Obtenha sua chave de API do TMDB (The Movie Database):
    * Acesse [TMDB API](https://www.themoviedb.org/settings/api).
    * Após criar uma conta e solicitar a API Key (v3), cole-a no seu `.env`.
5. Preencha o seu arquivo `.env` seguindo este modelo:
    ```env
    PORT=3333
    MONGO_URI=mongodb://localhost:27017/nome_do_seu_banco
    TMDB_API_KEY=sua_chave_aqui
    ```

### 4. Executando a API
1. Instale as dependências necessárias (na pasta `backend`):
    ```bash
    npm install
    ```
2. Inicie o servidor em modo de desenvolvimento (na pasta `backend`):
    ```bash
    npx nodemon
    ```
3. A aplicação estará rodando em: `http://localhost:3333`.

---

## Estrutura do Projeto:


---

## Endpoints:

### Obras (`/api/v2/obras`)
* `POST /`: Cria uma nova obra.
* `POST /muitos`: Cria várias obras simultaneamente.
* `GET /`: Lista todas as obras.
* `GET /:id`: Busca uma obra pelo ID.
* `GET /nome/:nome`: Busca uma obra pelo nome.
* `PUT /:id`: Atualiza dados de uma obra.
* `DELETE /:id`: Remove uma obra pelo ID.
* `DELETE /nome/:nome`: Remove uma obra pelo nome.

### Usuários (`/api/v2/usuarios`)
* `POST /`: Cria um novo usuário.
* `POST /muitos`: Cria vários usuários simultaneamente.
* `GET /`: Lista todos os usuários (aceita query `?nome=nomeDoUsuario&email=emailDoUsuario@` ou qualquer 1 dos 2 parâmetros).
* `GET /:id`: Busca um usuário pelo ID.
* `PUT /:id`: Atualiza dados de um usuário.
* `DELETE /:id`: Remove um usuário pelo ID.
* `POST /:idUser/favoritos/:idObra`: Adiciona uma obra aos favoritos do usuário.
* `DELETE /:idUser/favoritos/:idObra`: Remove uma obra dos favoritos do usuário.

### Avaliações (`/api/v2/avaliacoes`)
* `POST /`: Cria uma nova avaliação.
* `GET /`: Lista todas as avaliações (aceita query `?name=NomeDaObra`).
* `GET /:id`: Busca uma avaliação pelo ID.
* `GET /ranking/usuarios`: Retorna o Top 5 usuários mais ativos.
* `GET /ranking/obras`: Retorna as melhores obras por data (aceita query `?data=YYYY-MM-DD`).
* `PUT /:id`: Atualiza uma avaliação.
* `DELETE /:id`: Remove uma avaliação pelo ID.