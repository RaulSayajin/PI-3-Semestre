const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const spotifyAuthMiddleware = require('../middlewares/spotifyAuthMiddleware');
const multer = require('multer');
const path = require('path');

// Configuração do Multer para armazenamento de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Garanta que o diretório 'public/uploads/capas' exista
    cb(null, 'public/uploads/capas/');
  },
  filename: function (req, file, cb) {
    // Cria um nome de arquivo único para evitar sobreposição
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'capa-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Apply spotifyAuthMiddleware to all routes in this file
router.use(spotifyAuthMiddleware);

router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateUserProfile); // Nova rota para atualizar o perfil
router.post('/profile/capa', upload.single('capaImage'), userController.uploadCapa); // Rota para upload de imagem
router.get('/top-artists', userController.getTopArtists);
router.get('/top-tracks', userController.getTopTracks);
router.get('/saved-albums', userController.getSavedAlbums);
router.get('/saved-tracks', userController.getSavedTracks);
router.get('/followed-artists', userController.getFollowed);
router.get('/recently-played', userController.getRecentlyPlayed);
router.get('/recommendations', userController.getRecommendations);

module.exports = router;
