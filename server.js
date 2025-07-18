require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const qs = require('qs');


const app = express();
app.use(cors());
app.use(express.json());

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

// Etapa 1: Redirecionar para login
app.get('/login', (req, res) => {
  const scope = 'user-read-private user-read-email';
  const authUrl =
    'https://accounts.spotify.com/authorize?' +
    qs.stringify({
      response_type: 'code',
      client_id,
      scope,
      redirect_uri,
    });

  res.redirect(authUrl);
});

// Etapa 2: Callback com o código
app.get('/callback', async (req, res) => {
  const code = req.query.code;
  console.log('Code recebido:', code);

  if (!code) {
    return res.status(400).send('Código de autorização não encontrado.');
  }

  try {
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      qs.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri, // tem que ser IGUAL ao da /login e cadastrado no painel
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
        },
      }
    );

    const { access_token } = tokenResponse.data;

    const userInfo = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    res.json(userInfo.data);
  } catch (err) {
    console.error('Erro ao buscar token ou perfil:', err.response?.data || err.message);
    res.status(500).send('Erro ao autenticar com Spotify.');
  }
});

// --- Dados em memória para avaliações ---
const ratings = []; // cada item: { albumId, rating, userId? (se quiser), timestamp }

// Rota para salvar avaliação
app.post('/ratings', (req, res) => {
  const { albumId, rating } = req.body;

  if (!albumId || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Dados inválidos para avaliação' });
  }

  ratings.push({ albumId, rating, timestamp: Date.now() });
  res.status(201).json({ message: 'Avaliação salva com sucesso' });
});

// Rota para buscar avaliações de um álbum
app.get('/ratings/:albumId', (req, res) => {
  const albumId = req.params.albumId;
  const albumRatings = ratings.filter(r => r.albumId === albumId);

  // Opcional: retornar média e avaliações
  const averageRating = albumRatings.reduce((acc, cur) => acc + cur.rating, 0) / (albumRatings.length || 1);

  res.json({ averageRating, ratings: albumRatings });
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://127.0.0.1:3000');
});

console.log('CLIENT_ID:', process.env.CLIENT_ID);
console.log('CLIENT_SECRET:', process.env.CLIENT_SECRET ? 'OK' : 'FALHOU');