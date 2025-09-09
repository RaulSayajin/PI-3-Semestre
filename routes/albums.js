const express = require('express');
const router = express.Router();
const { 
  getFeaturedPlaylists, 
  getNewReleases, 
  getRecommendations 
} = require('../services/spotfyservice');

// ----------------------------
// 🎵 Destaques / Novos lançamentos
// ----------------------------

// Playlists em destaque
router.get('/featured-playlists', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 12;
    const country = req.query.country || 'BR';

    const playlists = await getFeaturedPlaylists(limit, country);
    res.json(playlists);

  } catch (err) {
    console.error('Erro ao buscar playlists em destaque:', err.response?.data || err.message);
    res.status(500).json({
      error: 'Erro ao buscar playlists em destaque',
      details: err.response?.data || err.message
    });
  }
});

// Novos lançamentos
router.get('/new-releases', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 12;
    const country = req.query.country || 'BR';

    const releases = await getNewReleases(limit, country);
    res.json(releases);

  } catch (err) {
    console.error('Erro ao buscar novos lançamentos:', err.response?.data || err.message);
    res.status(500).json({
      error: 'Erro ao buscar novos lançamentos',
      details: err.response?.data || err.message
    });
  }
});

// ----------------------------
// 🔹 Recomendações
// ----------------------------
router.get('/recommendations', async (req, res) => {
  try {
    const { seed_artists = '', seed_genres = '', seed_tracks = '', limit = 12 } = req.query;

    if (!seed_artists && !seed_genres && !seed_tracks) {
      return res.status(400).json({ 
        error: 'Pelo menos um seed deve ser fornecido (artist, genre ou track).' 
      });
    }

    const recs = await getRecommendations({
      seed_artists: seed_artists.split(',').filter(Boolean),
      seed_genres: seed_genres.split(',').filter(Boolean),
      seed_tracks: seed_tracks.split(',').filter(Boolean),
      limit: Number(limit)
    });

    res.json(recs);

  } catch (err) {
    console.error('Erro ao buscar recomendações:', err.response?.data || err.message);
    res.status(500).json({
      error: 'Erro ao buscar recomendações',
      details: err.response?.data || err.message
    });
  }
});

module.exports = router;
