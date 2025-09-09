const express = require('express');
const router = express.Router();

// --- Dados em memória para avaliações ---
const ratings = []; // cada item: { albumId, rating, userId?, timestamp }

// Rota para salvar avaliação
router.post('/', (req, res) => {
  const { albumId, rating } = req.body;

  if (!albumId || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Dados inválidos para avaliação' });
  }

  ratings.push({ albumId, rating, timestamp: Date.now() });
  res.status(201).json({ message: 'Avaliação salva com sucesso' });
});

// Rota para buscar avaliações de um álbum
router.get('/:albumId', (req, res) => {
  const albumId = req.params.albumId;
  const albumRatings = ratings.filter(r => r.albumId === albumId);

  const averageRating =
    albumRatings.reduce((acc, cur) => acc + cur.rating, 0) /
    (albumRatings.length || 1);

  res.json({ averageRating, ratings: albumRatings });
});

module.exports = router;
