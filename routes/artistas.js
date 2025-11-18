const express = require('express');
const router = express.Router();
const artistaController = require('../controllers/artistaController');

router.get('/:id', artistaController.getArtistById);
router.get('/:id/albums', artistaController.getAlbumsByArtist);
router.get('/:id/top-tracks', artistaController.getTopTracksByArtist);
router.get('/:id/related', artistaController.getRelatedArtists);

module.exports = router;
