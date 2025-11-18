const { userSpotifyGet, userSpotifyPut, userSpotifyDelete } = require('../api/spotifyApi');
const UserRepository = require('../repositories/UserRepository');

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getSavedUserAlbums(userToken, { limit = 20, offset = 0 } = {}) {
    const data = await userSpotifyGet('https://api.spotify.com/v1/me/albums', userToken, { limit, offset });
    return data.items;
  }

  async getUserTopArtists(userToken, { limit = 20, time_range = 'medium_term' } = {}) {
    const data = await userSpotifyGet('https://api.spotify.com/v1/me/top/artists', userToken, { limit, time_range });
    return data.items;
  }

  async getUserTopTracks(userToken, { limit = 20, time_range = 'medium_term' } = {}) {
    const data = await userSpotifyGet('https://api.spotify.com/v1/me/top/tracks', userToken, { limit, time_range });
    return data.items;
  }

  async getUserSavedTracks(userToken, { limit = 20, offset = 0 } = {}) {
    const data = await userSpotifyGet('https://api.spotify.com/v1/me/tracks', userToken, { limit, offset });
    return data.items;
  }

  async checkUserSavedTracks(userToken, trackIds = []) {
    if (trackIds.length === 0) return [];
    const ids = trackIds.join(',');
    return await userSpotifyGet(`https://api.spotify.com/v1/me/tracks/contains`, userToken, { ids });
  }

  async getFollowedArtists(userToken, limit = 20) {
    const data = await userSpotifyGet('https://api.spotify.com/v1/me/following', userToken, { type: 'artist', limit });
    console.log('Artistas seguidos pelo usuário Spotify:', data);
    return data?.artists?.items || [];
  }

  async getRecentlyPlayed(userToken, { limit = 10 } = {}) {
    const data = await userSpotifyGet('https://api.spotify.com/v1/me/player/recently-played', userToken, { limit });
    return data.items;
  }

  async findOrCreateUser(userDTO) {
    const user = await this.userRepository.findBySpotifyId(userDTO.spotifyId);

    const userDataForDb = {
      nome: userDTO.nome,
      email: userDTO.email,
      spotifyId: userDTO.spotifyId,
      accessToken: userDTO.accessToken,
      refreshToken: userDTO.refreshToken,
      expiresIn: userDTO.expiresIn,
    };

    if (user) {
      return await this.userRepository.updateUser(user._id, userDataForDb);
    }
    return await this.userRepository.create(userDataForDb);
  }

  async getCurrentUserProfile(userToken) {
    const userProfile = await userSpotifyGet('https://api.spotify.com/v1/me', userToken);
    console.log('Perfil do usuário Spotify:', userProfile);
    return userProfile;
  }

  async followArtists(userToken, artistIds = []) {
    if (artistIds.length === 0) return;
    const ids = artistIds.join(',');
    return await userSpotifyPut('https://api.spotify.com/v1/me/following', userToken, { ids }, { type: 'artist' });
  }

  async unfollowArtists(userToken, artistIds = []) {
    if (artistIds.length === 0) return;
    const ids = artistIds.join(',');
    return await userSpotifyDelete('https://api.spotify.com/v1/me/following', userToken, { ids }, { type: 'artist' });
  }

  // Methods using UserRepository
  async findUserByEmail(email) {
    return await this.userRepository.findByEmail(email);
  }

  async findUserBySpotifyId(spotifyId) {
    return await this.userRepository.findBySpotifyId(spotifyId);
  }

  async createNewUser(userData) {
    return await this.userRepository.create(userData);
  }

  async updateUser(id, userData) {
    return await this.userRepository.updateUser(id, userData);
  }
}

module.exports = new UserService(UserRepository);
