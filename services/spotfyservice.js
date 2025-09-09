const axios = require('axios');
const qs = require('qs');

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

let appAccessToken = null;
let tokenExpiresAt = 0;

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
    tokenExpiresAt = Date.now() + (tokenResponse.data.expires_in - 60) * 1000;
    return appAccessToken;
  } catch (err) {
    console.error('Error getting Spotify app access token:', err.response?.data || err.message);
    throw new Error('Could not retrieve Spotify access token.');
  }
}

async function spotifyGet(url, params = {}) {
  try {
    const token = await getAppAccessToken();
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return res.data;
  } catch (err) {
    console.error(`Error in spotifyGet for URL: ${url}`, err.response?.data || err.message);
    throw err;
  }
}

async function getNewReleases(limit = 12, country = 'BR') {
  const data = await spotifyGet('https://api.spotify.com/v1/browse/new-releases', { limit, country });
  return data.albums.items;
}

async function getFeaturedPlaylists(limit = 12, country = 'BR') {
  // TEST: Using /browse/categories to debug the 404 on /featured-playlists
  const data = await spotifyGet('https://api.spotify.com/v1/browse/categories', { limit, country });
  // Transform category data to look like album/playlist data for the frontend
  return data.categories.items.map(category => ({
    id: category.id,
    name: category.name,
    images: category.icons, // The card uses images, categories have icons
    artists: [{ name: 'Spotify Category' }] // Add a placeholder artist
  }));
}

async function getRecommendations({ seed_artists = [], seed_genres = [], seed_tracks = [], limit = 12 }) {
  if (seed_artists.length === 0 && seed_genres.length === 0 && seed_tracks.length === 0) {
    throw new Error('At least one seed (artist, genre, or track) must be provided for recommendations.');
  }

  const params = { limit };
  if (seed_artists.length) params.seed_artists = seed_artists.join(',');
  if (seed_genres.length) params.seed_genres = seed_genres.join(',');
  if (seed_tracks.length) params.seed_tracks = seed_tracks.join(',');

  try {
    const data = await spotifyGet('https://api.spotify.com/v1/recommendations', params);
    return data.tracks;
  } catch (err) {
    console.error('Erro em getRecommendations:', err.response?.data || err.message);
    throw err;
  }
}

async function userSpotifyGet(url, userToken, params = {}) {
  if (!userToken || !userToken.startsWith('Bearer ')) {
    throw new Error('Invalid or missing user authorization token.');
  }
  try {
    const res = await axios.get(url, {
      headers: { Authorization: userToken },
      params,
    });
    return res.data;
  } catch (err) {
    console.error(`Error in userSpotifyGet for URL: ${url}`, err.response?.data || err.message);
    throw err;
  }
}

async function getSavedUserAlbums(userToken, { limit = 20, offset = 0 } = {}) {
    const data = await userSpotifyGet('https://api.spotify.com/v1/me/albums', userToken, { limit, offset });
    return data.items;
}

module.exports = { getNewReleases, getFeaturedPlaylists, getRecommendations, getSavedUserAlbums };
