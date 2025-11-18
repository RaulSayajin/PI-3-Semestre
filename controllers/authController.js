const qs = require('qs');
const axios = require('axios');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/user');
const { getCurrentUserProfile } = require('../services/userService');

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const FRONTEND_URL = process.env.FRONTEND_URL;

function generateRandomString(length) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

// LOGIN
const loginSpotify = (req, res) => {
  const state = generateRandomString(16);
  req.session.spotify_auth_state = state;
  
  console.log('✅ [LOGIN] State gerado e armazenado na sessão:', state);
  console.log('✅ [LOGIN] Session ID:', req.sessionID);
  
  const scope =
    'user-read-private user-read-email user-library-read playlist-modify-private playlist-modify-public user-top-read playlist-read-private playlist-read-collaborative user-follow-read user-read-recently-played';

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
};

// CALLBACK
const callbackSpotify = async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;
  const storedState = req.session.spotify_auth_state;

  console.log('\n--- INÍCIO DO FLUXO DE CALLBACK ---');
  console.log('PASSO 1: Verificando o "state" de segurança...');
  console.log(`   - State recebido da URL: ${state}`);
  console.log(`   - State armazenado na sessão: ${storedState}`);
  console.log(`   - Session ID: ${req.sessionID}`);

  if (!state || state !== storedState) {
    console.error('❌ FALHA: O "state" não corresponde. A autenticação foi abortada por segurança.');
    console.error('❌ [CALLBACK] State mismatch detectado!');
    console.error('   Esperado:', storedState);
    console.error('   Recebido:', state);
    return res.redirect(`${FRONTEND_URL}/auth/callback?error=state_mismatch`);
  }

  req.session.spotify_auth_state = null;
  console.log('✅ SUCESSO: "state" verificado com sucesso.');

  if (!code) {
    console.error('❌ FALHA: Nenhum "code" de autorização recebido do Spotify.');
    return res.redirect(`${FRONTEND_URL}/auth/callback?error=missing_code`);
  }

  try {
    console.log('PASSO 2: Trocando o "code" pelo access_token do Spotify...');
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
          Authorization:
            'Basic ' +
            Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
        },
      }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    console.log('✅ SUCESSO: Tokens do Spotify recebidos.');
    console.log('PASSO 3: Buscando perfil do usuário no Spotify...');

    const userProfile = await getCurrentUserProfile(`Bearer ${access_token}`);
    console.log(`✅ SUCESSO: Perfil de "${userProfile.display_name}" (ID: ${userProfile.id}) obtido.`);
    console.log('PASSO 4: Procurando ou criando usuário no banco de dados local...');

    let usuario = await Usuario.findOne({ spotifyId: userProfile.id });

    const expiresAt = Date.now() + expires_in * 1000;

    if (usuario) {
      console.log(`   - Usuário encontrado no DB (ID: ${usuario._id}). Atualizando tokens...`);
      usuario.accessToken = access_token;
      usuario.refreshToken = refresh_token;
      usuario.expiresIn = expiresAt;
      usuario.spotifyProfile = userProfile; // Atualiza o perfil completo
      await usuario.save();
    } else {
      console.log('   - Usuário não encontrado. Criando novo registro no DB...');
      usuario = new Usuario({
        nome: userProfile.display_name,
        email: userProfile.email,
        spotifyId: userProfile.id,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expiresAt,
        spotifyProfile: userProfile,
      });
      await usuario.save();
    }
    console.log(`✅ SUCESSO: Usuário (ID: ${usuario._id}) está sincronizado no DB.`);

    // --- MUDANÇA: Não geramos mais o app_jwt_token. ---
    // O frontend usará o access_token do Spotify para todas as requisições.
    console.log('PASSO 5: Montando URL de redirecionamento para o frontend...');
    const queryParams = qs.stringify({
      access_token,
      refresh_token,
      expires_in,
    });
    const finalRedirectUrl = `${FRONTEND_URL}/auth/callback?${queryParams}`;
    console.log(`   - Redirecionando para: ${finalRedirectUrl.split('&app_jwt_token=')[0]}&app_jwt_token=...`); // Oculta o token no log
    console.log('--- FIM DO FLUXO DE CALLBACK ---');
    res.redirect(`${FRONTEND_URL}/auth/callback?${queryParams}`);
  } catch (err) {
    console.error('❌ Erro no callback Spotify:');
    console.error('   Mensagem:', err.message);
    console.error('   Status:', err.response?.status);
    console.error('   Dados:', err.response?.data);
    console.error('   Stack:', err.stack);
    res.redirect(`${FRONTEND_URL}/auth/callback?error=auth_failed`);
  }
};

// REFRESH TOKEN
const refreshSpotify = async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token)
    return res.status(400).json({ error: 'Missing refresh_token' });

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      qs.stringify({
        grant_type: 'refresh_token',
        refresh_token,
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

    res.json(response.data);
  } catch (err) {
    console.error('Erro no refresh token:', err.response?.data || err.message);
    res.status(500).json({ error: 'Erro ao atualizar token' });
  }
};

module.exports = { loginSpotify, callbackSpotify, refreshSpotify };
