const { getAlbum, getAlbumTracks } = require('../services');

const getAlbumById = async (req, res) => {
  try {
    const album = await getAlbum(req.params.id);
    res.json(album);
  } catch (err) {
    console.error('Erro ao buscar álbum:', err.response?.data || err.message);
    res.status(500).json({
      error: 'Erro ao buscar álbum',
      details: err.response?.data || err.message
    });
  }
};

const getAlbumTracksById = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 50;
    const tracks = await getAlbumTracks(req.params.id, limit);
    res.json(tracks);
  } catch (err) {
    console.error('Erro ao buscar faixas do álbum:', err.response?.data || err.message);
    res.status(500).json({
      error: 'Erro ao buscar faixas do álbum',
      details: err.response?.data || err.message
    });
  }
};

module.exports = {
  getAlbumById,
  getAlbumTracksById
};
