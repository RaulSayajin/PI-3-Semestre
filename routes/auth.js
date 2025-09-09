const express = require('express');
const qs = require('qs');
const axios = require('axios');
const crypto = require('crypto');
const router = express.Router();

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const FRONTEND_URL = process.env.FRONTEND_URL;

function generateRandomString(length) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

// Login Spotify
router.get('/login', (req, res) => {
  const state = generateRandomString(16);
  const scope = 'user-read-private user-read-email user-library-read';

  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      qs.stringify({
        response_type: 'code',
        client_id,
        scope,
        redirect_uri,
        state,
      })
  );
});

// Callback
router.get('/callback', async (req, res) => {
  const code = req.query.code;
  console.log('Código recebido:', code);
  if (!code) return res.status(400).send('Código não encontrado');

  try {
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      qs.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
        },
      }
    );

    const { access_token } = tokenResponse.data;
    res.redirect(`${FRONTEND_URL}/?token=${access_token}`);
  } catch (err) {
    // É útil logar o erro completo, especialmente a resposta do Spotify
    if (err.response) {
      console.error('Erro do Spotify:', err.response.data);
      console.error('Status do Spotify:', err.response.status);
    } else {
      console.error('Erro ao fazer a requisição para o Spotify:', err.message);
    }

    // Redireciona para o frontend com uma mensagem de erro
    const query = qs.stringify({ error: 'auth_failed' });
    res.redirect(`${FRONTEND_URL}/?${query}`);
  }
});

module.exports = router;
