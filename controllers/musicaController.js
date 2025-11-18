
const { getTrack, getAlbumTracks } = require('../services');

// Buscar uma música específica
async function getMusica(req, res) {
  try {
    const track = await getTrack(req.params.id);
    res.json(track);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar música', details: err.message });
  }
}

// Buscar faixas de um álbum
async function getMusicasPorAlbum(req, res) {
  try {
    const tracks = await getAlbumTracks(req.params.albumId);
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar faixas do álbum', details: err.message });
  }
}

module.exports = { getMusica, getMusicasPorAlbum };
