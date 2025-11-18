const axios = require('axios');
const qs = require('qs');
const crypto = require('crypto');
const UserService = require('./user'); 
const AppError = require('../utils/AppError');
const CreateUserDTO = require('../dtos/CreateUserDTO');

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

class AuthService {
  constructor(userService) {
    this.userService = userService;
  }

  generateRandomString(length) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
  }

  getSpotifyAuthURL(state) {
    const scope =
      'user-read-private user-read-email user-library-read playlist-modify-private playlist-modify-public user-top-read playlist-read-private playlist-read-collaborative user-follow-read user-read-recently-played';
    return (
      'https://accounts.spotify.com/authorize?' +
      qs.stringify({
        response_type: 'code',
        client_id,
        scope,
        redirect_uri,
        state,
      })
    );
  }

  async handleSpotifyCallback(code) {
    try {
      const tokenResponse = await axios.post(
        'https://accounts.spotify.com/api/token',
        qs.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization:
              'Basic ' +
              Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
          },
        }
      );

      const { access_token, refresh_token, expires_in } = tokenResponse.data;
      const userProfile = await this.userService.getCurrentUserProfile(`Bearer ${access_token}`);
      
      const expiresAt = Date.now() + expires_in * 1000;

      const userDTO = new CreateUserDTO({
        spotifyId: userProfile.id,
        nome: userProfile.display_name,
        email: userProfile.email,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expiresAt,
      });

      await this.userService.findOrCreateUser(userDTO);

      return { access_token, refresh_token, expires_in };
    } catch (err) {
      console.error('Error in handleSpotifyCallback:', err.response?.data || err.message);
      throw new AppError('Failed to authenticate with Spotify', 500);
    }
  }

  async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw new AppError('Missing refresh_token', 400);
    }

    try {
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        qs.stringify({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization:
              'Basic ' +
              Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error('Error refreshing token:', err.response?.data || err.message);
      throw new AppError('Failed to refresh token', 500);
    }
  }
}

module.exports = new AuthService(UserService);
