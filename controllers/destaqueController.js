// controllers/destaqueController.js
const {
  getFeaturedPlaylists,
  getNewReleases,
  getRecommendations,
  getCategories
} = require('../services');
const controllerWrapper = require('../utils/controllerWrapper');
const getBearerToken = require('../utils/getBearerToken');

const featuredPlaylists = controllerWrapper(async (req, res) => {
  const limit = Number(req.query.limit) || 12;
  const country = req.query.country || 'BR';
  const userToken = getBearerToken(req);
  if (!userToken) {
    return res.status(401).json({ error: 'Token de usuário ausente ou inválido.' });
  }
  const playlists = await getFeaturedPlaylists(userToken, limit, country);
  res.json(playlists);
});

const newReleases = controllerWrapper(async (req, res) => {
  const limit = Number(req.query.limit) || 12;
  const country = req.query.country || 'BR';
  const releases = await getNewReleases(limit, country);
  res.json(releases);
});

const categories = controllerWrapper(async (req, res) => {
  const limit = Number(req.query.limit) || 20;
  const country = req.query.country || 'BR';
  const result = await getCategories(limit, country);
  res.json(result);
});

const recommendations = controllerWrapper(async (req, res) => {
  const { seed_artists = '', seed_genres = '', seed_tracks = '', limit = 12 } = req.query;
  const userToken = getBearerToken(req);
  if (!seed_artists && !seed_genres && !seed_tracks) {
    return res.status(400).json({
      error: 'Pelo menos um seed deve ser fornecido (artist, genre ou track).'
    });
  }
  const recs = await getRecommendations({
    seed_artists: seed_artists.split(',').filter(Boolean),
    seed_genres: seed_genres.split(',').filter(Boolean),
    seed_tracks: seed_tracks.split(',').filter(Boolean),
    limit: Number(limit),
    userToken
  });
  res.json(recs);
});

module.exports = {
  featuredPlaylists,
  newReleases,
  categories,
  recommendations
};
