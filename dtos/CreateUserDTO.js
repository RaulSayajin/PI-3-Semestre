class CreateUserDTO {
    constructor({ nome, email, spotifyId, accessToken, refreshToken, expiresIn }) {
      this.nome = nome;
      this.email = email;
      this.spotifyId = spotifyId;
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.expiresIn = expiresIn;
    }
  }
  
  module.exports = CreateUserDTO;
  