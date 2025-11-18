const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');

router.get('/:id', albumController.getAlbumById);
router.get('/:id/tracks', albumController.getAlbumTracksById);

module.exports = router;
