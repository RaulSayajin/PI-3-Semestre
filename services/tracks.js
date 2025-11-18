const { spotifyGet, userSpotifyGet, userSpotifyPut, userSpotifyDelete } = require('../api/spotifyApi');

async function searchSpotify(query, types = ['artist', 'album', 'track', 'playlist'], limit = 10) {
  const data = await spotifyGet('https://api.spotify.com/v1/search', {
    q: query,
    type: types.join(','),
    limit,
  });
  return data;
}

async function getTrack(trackId) {
  return await spotifyGet(`https://api.spotify.com/v1/tracks/${trackId}`);
}

async function getSeveralTracks(trackIds = []) {
  const ids = trackIds.join(',');
  const data = await spotifyGet(`https://api.spotify.com/v1/tracks`, { ids });
  return data.tracks;
}

async function saveTracks(userToken, trackIds = []) {
  if (trackIds.length === 0) return;
  const ids = trackIds.join(',');
  return await userSpotifyPut('https://api.spotify.com/v1/me/tracks', userToken, { ids });
}

async function removeTracks(userToken, trackIds = []) {
  if (trackIds.length === 0) return;
  const ids = trackIds.join(',');
  return await userSpotifyDelete('https://api.spotify.com/v1/me/tracks', userToken, { ids });
}

module.exports = { searchSpotify, getTrack, getSeveralTracks, saveTracks, removeTracks };