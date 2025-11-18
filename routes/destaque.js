const express = require('express');
const router = express.Router();
const destaqueController = require('../controllers/destaqueController');

router.get('/featured-playlists', destaqueController.featuredPlaylists);
router.get('/new-releases', destaqueController.newReleases);
router.get('/categories', destaqueController.categories);
router.get('/recommendations', destaqueController.recommendations);

module.exports = router;