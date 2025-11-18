# Reverb - Backend

Backend do app Reverb, uma rede social focada em avaliações de álbuns e músicas, com profunda integração com o Spotify para dados de usuários e conteúdo musical.

---

## 🛠️ Tecnologias Principais

*   **Linguagem:** `JavaScript`
*   **Framework:** `Express.js`
*   **Banco de Dados:** `MongoDB`
*   **ODM:** `Mongoose`
*   **Autenticação:** `OAuth 2.0 com Spotify`
*   **Testes:** `Não configurado`
*   **Containerização:** `Não configurado`

---

## ✨ Funcionalidades Principais (Módulos)

*   **Autenticação e Usuários:** Gerencia o fluxo de login via Spotify (OAuth 2.0), criando e atualizando perfis de usuários no banco de dados local (MongoDB).
*   **Avaliações e Interações Sociais:** Módulo central que permite aos usuários criar, editar e deletar avaliações de itens do Spotify. Inclui funcionalidades sociais como curtir, comentar e compartilhar avaliações.
*   **Feeds de Atividade:** Geração de feeds de avaliações, incluindo um feed global, um para usuários seguidos e um com as avaliações em alta (trending).
*   **Gerenciamento de Perfil:** Permite que os usuários visualizem e atualizem seus perfis, incluindo o upload de imagens de capa.
*   **Integração com Spotify:** Consumo extensivo da API do Spotify para buscar dados do usuário (top artistas/músicas, ouvidas recentemente) e informações sobre o catálogo musical.

---

## 🏁 Como Rodar o Projeto

### 1. Pré-requisitos

*   `Node.js (v16+ recomendado)`
*   `MongoDB (local ou em um serviço de nuvem como o Atlas)`
*   `Um gerenciador de pacotes (npm)`

### 2. Variáveis de Ambiente (`.env`)

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# URL de conexão com seu banco MongoDB
DATABASE_URL="mongodb://localhost:27017/reverb"

# Credenciais do seu App no Spotify Developer Dashboard
CLIENT_ID="SEU_CLIENT_ID_DO_SPOTIFY"
CLIENT_SECRET="SEU_CLIENT_SECRET_DO_SPOTIFY"

# URL de callback configurada no seu App Spotify
# Deve apontar para a rota /auth/callback do seu backend
REDIRECT_URI="http://localhost:3000/auth/callback"

# URL base do seu frontend para redirecionamento após o login
FRONTEND_URL="http://localhost:5173"
```

### 3. Instalação e Execução

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/seu-repositorio.git
cd backend

# 2. Instale as dependências
npm install

# 3. Execute o servidor
npm start
```

---

## 📁 Estrutura de Pastas (Visão Geral)

O projeto segue uma arquitetura baseada em camadas, separando responsabilidades para melhor organização e manutenção.

```
.
├── controllers/  # Camada de entrada: recebe requisições HTTP, valida e chama os serviços.
├── core/         # Lógicas de negócio mais complexas ou algoritmos (ex: RecommendationService).
├── middlewares/  # Funções que interceptam requisições (ex: autenticação).
├── models/       # Definição dos schemas do Mongoose para o MongoDB.
├── public/       # Arquivos estáticos, como imagens de upload.
├── routes/       # Definição das rotas da API e associação com os controllers.
├── services/     # Camada de serviço: contém as regras de negócio da aplicação.
├── utils/        # Utilitários compartilhados (ex: tratamento de erros, wrappers).
└── server.js     # Ponto de entrada da aplicação Express.
```

---

## 🗺️ Resumo da API (Principais Rotas)

### Autenticação (`/auth`)

*   `GET /auth/login`: Inicia o fluxo de login com Spotify, redirecionando o usuário.
*   `GET /auth/callback`: Callback para finalizar a autenticação após a aprovação do usuário no Spotify.

### Usuários (`/user`)

*   `GET /user/profile`: Retorna o perfil do usuário logado (dados do Spotify).
*   `PUT /user/profile`: Atualiza informações do perfil do usuário no banco local (ex: `capaUrl`).
*   `POST /user/profile/capa`: Faz upload de uma imagem de capa para o perfil.
*   `GET /user/top-artists`: Retorna os artistas mais ouvidos pelo usuário.
*   `GET /user/recently-played`: Retorna as músicas ouvidas recentemente.

### Avaliações e Feeds (`/ratings`, `/feed`)

*   `POST /ratings`: Cria uma nova avaliação para um item (álbum, música).
*   `PUT /ratings/:id`: Atualiza uma avaliação existente.
*   `POST /ratings/:id/like`: Curte ou descurte uma avaliação.
*   `POST /ratings/:id/comment`: Adiciona um comentário a uma avaliação.
*   `GET /feed/global`: Retorna o feed com as avaliações mais recentes de todos.
*   `GET /items/:itemId/ratings`: Lista todas as avaliações de um item específico.
