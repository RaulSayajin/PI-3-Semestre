const express = require('express');
const router = express.Router();
const { getSavedUserAlbums } = require('../services/spotfyservice');

router.get('/saved-albums', async (req, res) => {
  try {
    const userToken = req.headers.authorization;
    if (!userToken || !userToken.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token is missing or invalid.' });
    }

    const { limit, offset } = req.query;
    const albums = await getSavedUserAlbums(userToken, { limit, offset });
    res.json(albums);

  } catch (err) {
    console.error(err.response?.data || err.message); // log real do Spotify
    res.status(500).json({ 
      error: "Error fetching user's saved albums.", 
      details: err.response?.data || err.message 
    });
  }
});

module.exports = router;
