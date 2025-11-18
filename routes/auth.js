const express = require('express');
const router = express.Router();
const {
  loginSpotify,
  callbackSpotify,
  refreshSpotify,
} = require('../controllers/authController');

router.get('/login', loginSpotify);

router.get('/callback', callbackSpotify);

router.post('/refresh', refreshSpotify);

module.exports = router;
