const axios = require('axios');
const qs = require('qs');

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

let appAccessToken = null;
let tokenExpiresAt = 0;

/**
 * Obtém um token de acesso para a aplicação (Client Credentials Flow).
 * O token é mantido em cache para evitar requisições desnecessárias.
 */
async function getAppAccessToken() {
  if (appAccessToken && Date.now() < tokenExpiresAt) {
    return appAccessToken;
  }

  try {
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      qs.stringify({ grant_type: 'client_credentials' }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
        },
      }
    );

    appAccessToken = tokenResponse.data.access_token;
    tokenExpiresAt = Date.now() + (tokenResponse.data.expires_in - 60) * 1000; // Subtrai 60s por segurança
    return appAccessToken;
  } catch (err) {
    console.error('ERRO DETALHADO ao obter token de acesso:', err.response?.data || err.message);
    throw new Error('Não foi possível obter o token de acesso do Spotify.');
  }
}

module.exports = { getAppAccessToken };
