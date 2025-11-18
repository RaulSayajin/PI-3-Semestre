const express = require('express');
const router = express.Router();
const musicaController = require('../controllers/musicaController');

router.get('/:id', musicaController.getMusica);
router.get('/album/:albumId', musicaController.getMusicasPorAlbum);

module.exports = router;