const { spotifyGet, userSpotifyGet } = require('../api/spotifyApi');

async function getNewReleases(limit = 12, country = 'BR') {
  const data = await spotifyGet('https://api.spotify.com/v1/browse/new-releases', { limit, country });
  return data.albums.items;
}

async function getFeaturedPlaylists(userToken, limit = 12, country = 'US') {
  console.log('🔑 Token usado:', userToken);
  const url = 'https://api.spotify.com/v1/browse/featured-playlists';
  const params = { limit, country, locale: 'pt_BR' };
  const data = await userSpotifyGet(url, userToken, params);
  return data.playlists.items;
}

async function getCategories(limit = 20, country = 'BR') {
  const data = await spotifyGet('https://api.spotify.com/v1/browse/categories', { limit, country });
  return data.categories.items;
}

async function getCategoryPlaylists(categoryId, limit = 10, country = 'BR') {
  const url = `https://api.spotify.com/v1/browse/categories/${categoryId}/playlists`;
  const data = await spotifyGet(url, { limit, country });
  return data.playlists.items;
}

module.exports = { getNewReleases, getFeaturedPlaylists, getCategories, getCategoryPlaylists };