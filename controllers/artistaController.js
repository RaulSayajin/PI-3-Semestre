const {
  getArtist,
  getArtistAlbums,
  getArtistTopTracks,
  getArtistRelatedArtists
} = require('../services');

// Buscar artista pelo ID (direto da API do Spotify)
const getArtistById = async (req, res) => {
  try {
    const artist = await getArtist(req.params.id);
    res.json(artist);
  } catch (err) {
    console.error('Erro ao buscar artista:', err.response?.data || err.message);
    res.status(500).json({ error: 'Erro ao buscar artista' });
  }
};

// Buscar álbuns de um artista
const getAlbumsByArtist = async (req, res) => {
  try {
    const albums = await getArtistAlbums(req.params.id, 20);
    res.json(albums);
  } catch (err) {
    console.error('Erro ao buscar álbuns do artista:', err.response?.data || err.message);
    res.status(500).json({ error: 'Erro ao buscar álbuns do artista' });
  }
};

// Buscar faixas mais populares de um artista
const getTopTracksByArtist = async (req, res) => {
  try {
    const tracks = await getArtistTopTracks(req.params.id);
    res.json(tracks);
  } catch (err) {
    console.error('Erro ao buscar top tracks do artista:', err.response?.data || err.message);
    res.status(500).json({ error: 'Erro ao buscar top tracks do artista' });
  }
};

// Buscar artistas relacionados
const getRelatedArtists = async (req, res) => {
  try {
    const related = await getArtistRelatedArtists(req.params.id);
    res.json(related);
  } catch (err) {
    console.error('Erro ao buscar artistas relacionados:', err.response?.data || err.message);
    res.status(500).json({ error: 'Erro ao buscar artistas relacionados' });
  }
};

module.exports = {
  getArtistById,
  getAlbumsByArtist,
  getTopTracksByArtist,
  getRelatedArtists
};