const { spotifyGet } = require('../api/spotifyApi');

async function getArtist(artistId) {
  return await spotifyGet(`https://api.spotify.com/v1/artists/${artistId}`);
}

async function getArtistAlbums(artistId, limit = 20, include_groups = 'album,single') {
  const data = await spotifyGet(`https://api.spotify.com/v1/artists/${artistId}/albums`, { limit, include_groups });
  return data.items;
}

async function getArtistTopTracks(artistId, market = 'BR') {
  const data = await spotifyGet(`https://api.spotify.com/v1/artists/${artistId}/top-tracks`, { market });
  return data.tracks;
}

async function getArtistRelatedArtists(artistId) {
  const data = await spotifyGet(`https://api.spotify.com/v1/artists/${artistId}/related-artists`);
  return data.artists;
}

module.exports = { getArtist, getArtistAlbums, getArtistTopTracks, getArtistRelatedArtists };