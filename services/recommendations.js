const { spotifyGet, userSpotifyGet } = require('../api/spotifyApi');

/**
 * Obtém recomendações do Spotify com base em artistas, gêneros ou faixas semente.
 * @param {object} seeds - As sementes para as recomendações.
 * @param {string[]} [seeds.seed_artists=[]] - IDs de artistas.
 * @param {string[]} [seeds.seed_genres=[]] - Nomes de gêneros.
 * @param {string[]} [seeds.seed_tracks=[]] - IDs de faixas.
 * @param {number} [seeds.limit=12] - O número de recomendações a serem retornadas.
 * @param {string} [seeds.userToken=null] - Token de autorização do usuário (opcional).
 * @returns {Promise<object[]>} Uma promessa que resolve para uma lista de faixas recomendadas.
 */
async function getRecommendations({ seed_artists = [], seed_genres = [], seed_tracks = [], limit = 12, userToken = null }) {
  if (seed_artists.length === 0 && seed_genres.length === 0 && seed_tracks.length === 0) {
    throw new Error('At least one seed (artist, genre, or track) must be provided for recommendations.');
  }

  const params = { limit };
  if (seed_artists.length > 0) params.seed_artists = seed_artists.join(',');
  if (seed_genres.length > 0) params.seed_genres = seed_genres.join(',');
  if (seed_tracks.length > 0) params.seed_tracks = seed_tracks.join(',');

  const url = 'https://api.spotify.com/v1/recommendations';
  const data = userToken
    ? await userSpotifyGet(url, userToken, params)
    : await spotifyGet(url, params);
  return data.tracks;
}

/**
 * Obtém a lista de gêneros disponíveis para usar como sementes de recomendação.
 * @param {string} [userToken=null] - Token de autorização do usuário (opcional).
 * @returns {Promise<string[]>} Uma promessa que resolve para uma lista de strings de gênero.
 */
async function getAvailableGenreSeeds(userToken = null) {
  const url = 'https://api.spotify.com/v1/recommendations/available-genre-seeds';
  const data = userToken
    ? await userSpotifyGet(url, userToken)
    : await spotifyGet(url);
  return data.genres;
}

module.exports = { getRecommendations, getAvailableGenreSeeds };