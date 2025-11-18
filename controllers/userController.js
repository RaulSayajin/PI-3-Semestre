const UserService = require('../services/userService');
const {
  RecommendationGenerator,
  TopArtistsStrategy,
} = require('../core/recommendationService');
const controllerWrapper = require('../utils/controllerWrapper');
const AppError = require('../utils/AppError');

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  getUserProfile = controllerWrapper(async (req, res) => {
    const userProfile = await this.userService.getCurrentUserProfile(req.userToken);
    res.json(userProfile);
  });

  updateUserProfile = controllerWrapper(async (req, res) => {
    const { capaUrl } = req.body;
    if (!capaUrl) {
      throw new AppError('A URL da capa (capaUrl) é obrigatória.', 400);
    }

    // Busca o usuário local para obter o ID do nosso banco
    const spotifyProfile = await this.userService.getCurrentUserProfile(req.userToken);
    const localUser = await this.userService.findUserBySpotifyId(spotifyProfile.id);
    if (!localUser) {
      throw new AppError('Usuário não encontrado no sistema.', 404);
    }

    const updatedUser = await this.userService.updateUser(localUser._id, { capaUrl });
    res.status(200).json({ status: 'success', data: updatedUser });
  });

  uploadCapa = controllerWrapper(async (req, res) => {
    if (!req.file) {
      throw new AppError('Nenhum arquivo de imagem foi enviado.', 400);
    }

    // Constrói a URL pública do arquivo salvo
    const capaUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, "/")}`;

    // Busca o usuário local para obter o ID do nosso banco
    const spotifyProfile = await this.userService.getCurrentUserProfile(req.userToken);
    const localUser = await this.userService.findUserBySpotifyId(spotifyProfile.id);
    if (!localUser) {
      // Opcional: remover o arquivo se o usuário não for encontrado
      // fs.unlinkSync(req.file.path);
      throw new AppError('Usuário não encontrado no sistema.', 404);
    }

    // Atualiza o usuário com a nova URL da capa
    const updatedUser = await this.userService.updateUser(localUser._id, { capaUrl });
    res.status(200).json({ status: 'success', data: updatedUser });
  });

  getTopTracks = controllerWrapper(async (req, res) => {
    const { limit, time_range } = req.query;
    const tracks = await this.userService.getUserTopTracks(req.userToken, { limit, time_range });
    res.json(tracks);
  });

  getSavedAlbums = controllerWrapper(async (req, res) => {
    const { limit, offset } = req.query;
    const albums = await this.userService.getSavedUserAlbums(req.userToken, { limit, offset });
    res.json(albums);
  });

  getTopArtists = controllerWrapper(async (req, res) => {
    const { limit, time_range } = req.query;
    const artists = await this.userService.getUserTopArtists(req.userToken, { limit, time_range });
    res.json(artists);
  });

  getSavedTracks = controllerWrapper(async (req, res) => {
    const { limit, offset } = req.query;
    const tracks = await this.userService.getUserSavedTracks(req.userToken, { limit, offset });
    res.json(tracks);
  });

  getFollowed = controllerWrapper(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 20;
    const artists = await this.userService.getFollowedArtists(req.userToken, limit);
    res.json(artists || []);
  });

  getRecommendations = controllerWrapper(async (req, res) => {
    const strategy = new TopArtistsStrategy(2);
    const generator = new RecommendationGenerator(strategy);
    const recommendations = await generator.generate(req.userToken);
    res.json(recommendations);
  });

  getRecentlyPlayed = controllerWrapper(async (req, res) => {
    const { limit } = req.query;
    const tracks = await this.userService.getRecentlyPlayed(req.userToken, { limit });
    res.json(tracks);
  });
}

module.exports = new UserController(UserService);