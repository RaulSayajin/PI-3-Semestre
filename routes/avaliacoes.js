const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/avaliacaoController');
const spotifyAuthMiddleware = require('../middlewares/spotifyAuthMiddleware');

// Rotas de avaliações
router.post('/', spotifyAuthMiddleware, ratingController.createRating);
router.put('/:id', spotifyAuthMiddleware, ratingController.updateRating);
router.delete('/:id', spotifyAuthMiddleware, ratingController.deleteRating);

// Rotas de interação
router.post('/:id/like', spotifyAuthMiddleware, ratingController.toggleLike);
router.post('/:id/comment', spotifyAuthMiddleware, ratingController.addComment);
router.post('/:id/share', ratingController.shareReview);

router.get('/user/me', spotifyAuthMiddleware, ratingController.getUserReviews);
router.get('/user/top-artists', spotifyAuthMiddleware, ratingController.getUserTopArtists);
router.get('/user/top-tracks', spotifyAuthMiddleware, ratingController.getUserTopTracks);

// Rotas de feed
router.get('/feed/global', ratingController.getGlobalFeed);
router.get('/feed/following', spotifyAuthMiddleware, ratingController.getFollowingFeed);
router.get('/feed/trending', ratingController.getTrendingFeed);
router.get('/item/:itemId', ratingController.getRatingsForItem);

module.exports = router;