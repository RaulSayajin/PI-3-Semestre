const AvaliacaoService = require('../services/AvaliacaoService');
const UserService = require('../services/userService');
const User = require('../models/user'); 
const controllerWrapper = require('../utils/controllerWrapper');
const AppError = require('../utils/AppError');

const avaliacaoService = new AvaliacaoService();

/**
 * Cria uma nova avaliação
 */
const createRating = controllerWrapper(async (req, res) => {
  const spotifyToken = req.userToken;

  // 1. Buscar perfil no Spotify
  const userProfile = await UserService.getCurrentUserProfile(spotifyToken);

  // 2. Buscar usuário no nosso banco
  const usuarioLocal = await User.findOne({ spotifyId: userProfile.id });

  if (!usuarioLocal) {
    throw new AppError('Usuário não encontrado no sistema.', 404);
  }

  // 3. ID correto do nosso BD
  const usuarioId = usuarioLocal?._id;

  console.log('[DEBUG] createRating: ID do usuário recebido do token:', usuarioId);

  const createdRating = await avaliacaoService.createRating(req.body, usuarioId);

  res.status(201).json({
    status: 'success',
    data: createdRating,
  });
});

/**
 * Atualiza uma avaliação existente
 */
const updateRating = controllerWrapper(async (req, res) => {
  const { id } = req.params;
  const spotifyToken = req.userToken;

  // 1. Buscar perfil no Spotify
  const userProfile = await UserService.getCurrentUserProfile(spotifyToken);

  // 2. Buscar usuário no nosso banco
  const usuarioLocal = await User.findOne({ spotifyId: userProfile.id });

  if (!usuarioLocal) {
    throw new AppError('Usuário não encontrado no sistema.', 404);
  }

  // 3. ID correto do nosso BD
  const usuarioId = usuarioLocal?._id;

  console.log('[DEBUG] updateRating: Atualizando avaliação ID:', id, 'para usuário ID:', usuarioId);

  const updatedRating = await avaliacaoService.updateRating(id, req.body, usuarioId);

  res.status(200).json({
    status: 'success',
    data: updatedRating,
  });
});

/**
 * Deleta uma avaliação
 */
const deleteRating = controllerWrapper(async (req, res) => {
  const { id } = req.params;
  const spotifyToken = req.userToken;

  // 1. Buscar perfil no Spotify
  const userProfile = await UserService.getCurrentUserProfile(spotifyToken);

  // 2. Buscar usuário no nosso banco
  const usuarioLocal = await User.findOne({ spotifyId: userProfile.id });

  // 3. ID correto do nosso BD
  const usuarioId = usuarioLocal?._id;

  console.log('[DEBUG] deleteRating: Deletando avaliação ID:', id, 'para usuário ID:', usuarioId);

  await avaliacaoService.deleteRating(id, usuarioId);

  res.status(200).json({
    status: 'success',
    message: 'Avaliação deletada com sucesso',
    data: null,
  });
});

/**
 * Curte ou descurte uma avaliação
 */
const toggleLike = controllerWrapper(async (req, res) => {
  const { id } = req.params;
  const spotifyToken = req.userToken;

  const userProfile = await UserService.getCurrentUserProfile(spotifyToken);
  const usuarioLocal = await User.findOne({ spotifyId: userProfile.id });

  if (!usuarioLocal) {
    throw new AppError('Usuário não encontrado no sistema.', 404);
  }
  const usuarioId = usuarioLocal._id;

  const updatedRating = await avaliacaoService.toggleLike(id, usuarioId);

  res.status(200).json({
    status: 'success',
    data: updatedRating,
  });
});

/**
 * Adiciona um comentário a uma avaliação
 */
const addComment = controllerWrapper(async (req, res) => {
  const { id } = req.params;
  const { texto } = req.body;
  const spotifyToken = req.userToken;

  const userProfile = await UserService.getCurrentUserProfile(spotifyToken);
  const usuarioLocal = await User.findOne({ spotifyId: userProfile.id });

  if (!usuarioLocal) {
    throw new AppError('Usuário não encontrado no sistema.', 404);
  }
  const usuarioId = usuarioLocal._id;

  const updatedRating = await avaliacaoService.addComment(id, usuarioId, texto);

  res.status(200).json({
    status: 'success',
    data: updatedRating,
  });
});

/**
 * Incrementa a contagem de compartilhamento
 */
const shareReview = controllerWrapper(async (req, res) => {
  const { id } = req.params;

  // Não precisa de autenticação, pois é uma ação simples de contagem
  await avaliacaoService.incrementShare(id);

  res.status(200).json({
    status: 'success',
    message: 'Compartilhado com sucesso.',
  });
});

/**
 * Feed global de avaliações
 */
const getGlobalFeed = controllerWrapper(async (req, res) => {
  const feed = await avaliacaoService.getGlobalFeed();

  res.status(200).json({
    status: 'success',
    results: feed.length,
    data: feed,
  });
});

/**
 * Feed dos usuários seguidos
 */
const getFollowingFeed = controllerWrapper(async (req, res) => {
  const spotifyToken = req.userToken;
  const userProfile = await UserService.getCurrentUserProfile(spotifyToken);
  const usuarioLocal = await User.findOne({ spotifyId: userProfile.id });

  if (!usuarioLocal) {
    throw new AppError('Usuário não encontrado no sistema.', 404);
  }

  // A lógica para buscar os IDs que o usuário segue precisaria ser implementada.
  // Supondo que o modelo de usuário tenha um campo 'following'.
  const feed = await avaliacaoService.getFollowingFeed(usuarioLocal.following || []);

  res.status(200).json({
    status: 'success',
    results: feed.length,
    data: feed,
  });
});

/**
 * Avaliações em alta
 */
const getTrendingFeed = controllerWrapper(async (req, res) => {
  const feed = await avaliacaoService.getTrendingFeed();

  res.status(200).json({
    status: 'success',
    results: feed.length,
    data: feed,
  });
});

/**
 * Avaliações de um item específico
 */
const getRatingsForItem = controllerWrapper(async (req, res) => {
  const { itemId } = req.params;

  const ratings = await avaliacaoService.getRatingsForItem(itemId);

  res.status(200).json({
    status: 'success',
    results: ratings.length,
    data: ratings,
  });
});

/**
 * Top artistas do usuário
 */
const getUserTopArtists = controllerWrapper(async (req, res) => {
  const spotifyToken = req.userToken;
  const userProfile = await UserService.getCurrentUserProfile(spotifyToken);
  const usuarioLocal = await User.findOne({ spotifyId: userProfile.id });
  const usuarioId = usuarioLocal?._id;

  console.log('[DEBUG] getUserTopArtists: Buscando para o usuário ID:', usuarioId);

  const topArtists = await avaliacaoService.getUserTopArtists(usuarioId);

  res.status(200).json({
    status: 'success',
    results: topArtists.length,
    data: topArtists,
  });
});

/**
 * Top músicas do usuário
 */
const getUserTopTracks = controllerWrapper(async (req, res) => {
  const spotifyToken = req.userToken;
  const userProfile = await UserService.getCurrentUserProfile(spotifyToken);
  const usuarioLocal = await User.findOne({ spotifyId: userProfile.id });
  const usuarioId = usuarioLocal?._id;

  console.log('[DEBUG] getUserTopTracks: Buscando para o usuário ID:', usuarioId);

  const topTracks = await avaliacaoService.getUserTopTracks(usuarioId);

  res.status(200).json({
    status: 'success',
    results: topTracks.length,
    data: topTracks,
  });
});

/**
 * Avaliações do usuário logado
 */
const getUserReviews = controllerWrapper(async (req, res) => {
  const spotifyToken = req.userToken;
  const userProfile = await UserService.getCurrentUserProfile(spotifyToken);
  const usuarioLocal = await User.findOne({ spotifyId: userProfile.id });
  const usuarioId = usuarioLocal?._id;

  console.log('[DEBUG] getUserReviews: Buscando para o usuário ID:', usuarioId);

  const reviews = await avaliacaoService.getRatingsByUserId(usuarioId);

  res.status(200).json({
    status: 'success',
    data: reviews,
  });
});

module.exports = {
  createRating,
  updateRating, 
  deleteRating,
  toggleLike,
  addComment,
  shareReview,
  getGlobalFeed,
  getFollowingFeed,
  getTrendingFeed,
  getRatingsForItem,
  getUserTopArtists,
  getUserTopTracks,
  getUserReviews,
};