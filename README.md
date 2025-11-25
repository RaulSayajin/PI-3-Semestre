# Reverb Frontend

O frontend do Reverb, um aplicativo de avaliação musical.

## Features

- Autenticação de usuário com o Spotify.
- Visualização de músicas, artistas e álbuns.
- Avaliação de músicas.
- Feed de avaliações de outros usuários.
- Perfil de usuário com estatísticas e avaliações.

## Tecnologias Utilizadas

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ESLint](https://eslint.org/)

## Instalação e Setup

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

## Estrutura do Projeto

```
/src
|-- /api
|   |-- feedApi.jsx
|-- /assets
|   |-- ...
|-- /components
|   |-- /curtidas
|   |-- /feed
|   |-- /home
|   |-- /layout
|   |-- /perfil
|-- /hooks
|   |-- useSpotifyAuth.jsx
|   |-- useSpotifyProfile.js
|-- /pages
|   |-- AuthCallback.jsx
|   |-- Config.jsx
|   |-- Curtidas.jsx
|   |-- Feed.jsx
|   |-- login.jsx
|   |-- Perfil.jsx
|-- App.jsx
|-- index.css
|-- main.jsx
```

## Páginas

- **Login**: Página de autenticação do usuário.
- **Home**: Página inicial com banners, carrosséis de músicas e artistas.
- **Feed**: Feed com as avaliações mais recentes de outros usuários.
- **Curtidas**: Página com as avaliações do usuário.
- **Perfil**: Página de perfil do usuário com estatísticas e avaliações.
- **Config**: Página de configurações do aplicativo.
- **AuthCallback**: Página de redirecionamento para autenticação com o Spotify.

## Componentes

O projeto utiliza uma arquitetura de componentes reutilizáveis, organizados por funcionalidade.

- **curtidas**: Componentes relacionados à página de "Curtidas".
- **feed**: Componentes relacionados ao "Feed".
- **home**: Componentes da página "Home", como carrosséis e banners.
- **layout**: Componentes de layout, como a barra de navegação e o rodapé.
- **perfil**: Componentes da página de "Perfil".

## Hooks

- **useSpotifyAuth**: Hook para gerenciar a autenticação com o Spotify.
- **useSpotifyProfile**: Hook para buscar e gerenciar os dados do perfil do usuário no Spotify.

## Integração com a API

O frontend se comunica com a API do backend para buscar dados de músicas, artistas, avaliações e perfis de usuário. As chamadas à API são feitas utilizando a `feedApi.jsx` e os hooks personalizados.
