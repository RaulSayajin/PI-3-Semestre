const { spotifyGet } = require('../api/spotifyApi');

async function getAlbum(albumId) {
  return await spotifyGet(`https://api.spotify.com/v1/albums/${albumId}`);
}

async function getAlbumTracks(albumId, limit = 50) {
  const data = await spotifyGet(`https://api.spotify.com/v1/albums/${albumId}/tracks`, { limit });
  return data.items;
}

module.exports = { getAlbum, getAlbumTracks };