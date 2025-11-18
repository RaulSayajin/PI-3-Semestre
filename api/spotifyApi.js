const axios = require('axios');
const { getAppAccessToken } = require('./spotifyAuth');

/**
 * Realiza uma requisição GET para a API do Spotify usando o token da aplicação.
 * @param {string} url A URL do endpoint da API.
 * @param {object} params Os parâmetros da requisição.
 * @returns {Promise<any>} Os dados da resposta.
 */
async function spotifyGet(url, params = {}) {
  try {
    const token = await getAppAccessToken();
    console.log(`🔄 Requisição GET para: ${url}`);
    console.log(`📋 Parâmetros:`, params);
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    console.log(`✅ Resposta bem-sucedida de: ${url}`);
    return res.data;
  } catch (err) {
    console.error(`❌ ERRO DETALHADO no spotifyGet para URL: ${url}`);
    console.error(`📌 Status do erro:`, err.response?.status);
    console.error(`📋 Dados do erro:`, err.response?.data || err.message);
    console.error(`🔗 Headers enviados:`, err.config?.headers);
    console.error(`📊 Parâmetros enviados:`, err.config?.params);
    throw err;
  }
}

/**
 * Realiza uma requisição para a API do Spotify usando o token de um usuário.
 * @param {string} method O método HTTP ('GET', 'PUT', 'POST', 'DELETE').
 * @param {string} url A URL do endpoint da API.
 * @param {string} userToken O token de autorização do usuário (ex: "Bearer ...").
 * @param {object} params Os parâmetros da URL da requisição.
 * @param {object} data O corpo da requisição.
 * @returns {Promise<any>} Os dados da resposta.
 */
async function userSpotifyRequest(method, url, userToken, params = {}, data = null) {
  if (!userToken || !userToken.startsWith('Bearer ')) {
    throw new Error('Token de autorização do usuário inválido ou ausente.');
  }
  try {
    const config = {
      method,
      url,
      headers: { Authorization: userToken, 'Content-Type': 'application/json' },
      params,
    };
    if (data) {
      config.data = data;
    }
    const res = await axios(config);
    // PUT e DELETE bem-sucedidos podem não retornar corpo, mas o status 204 indica sucesso.
    return res.data || { status: res.status };
  } catch (err) {
    console.error(`Erro no userSpotifyRequest (${method}) para URL: ${url}`, err.response?.data || err.message);
    throw err;
  }
}

/**
 * Realiza uma requisição GET para a API do Spotify usando o token de um usuário.
 * @param {string} url A URL do endpoint da API.
 * @param {string} userToken O token de autorização do usuário (ex: "Bearer ...").
 * @param {object} params Os parâmetros da requisição.
 * @returns {Promise<any>} Os dados da resposta.
 */
function userSpotifyGet(url, userToken, params = {}) {
  return userSpotifyRequest('GET', url, userToken, params);
}

/**
 * Realiza uma requisição PUT para a API do Spotify usando o token de um usuário.
 * @param {string} url A URL do endpoint da API.
 * @param {string} userToken O token de autorização do usuário.
 * @param {object} data O corpo da requisição.
 * @param {object} params Os parâmetros da URL.
 */
function userSpotifyPut(url, userToken, data = {}, params = {}) {
  return userSpotifyRequest('PUT', url, userToken, params, data);
}

/**
 * Realiza uma requisição DELETE para a API do Spotify usando o token de um usuário.
 * @param {string} url A URL do endpoint da API.
 * @param {string} userToken O token de autorização do usuário.
 * @param {object} data O corpo da requisição.
 * @param {object} params Os parâmetros da URL.
 */
function userSpotifyDelete(url, userToken, data = {}, params = {}) {
  return userSpotifyRequest('DELETE', url, userToken, params, data);
}


module.exports = { spotifyGet, userSpotifyGet, userSpotifyPut, userSpotifyDelete };
