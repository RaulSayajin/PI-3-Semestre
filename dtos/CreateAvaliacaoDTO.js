const AppError = require('../utils/AppError');

/**
 * DTO para a criação de uma nova avaliação.
 * Responsável por validar e estruturar os dados de entrada.
 */
class CreateAvaliacaoDTO {
  constructor({ nota, comentario, itemSpotifyId, tipoItem, itemName, itemImageUrl }) {
    this.nota = nota;
    this.comentario = comentario;
    this.itemSpotifyId = itemSpotifyId;
    this.tipoItem = tipoItem;
    this.itemName = itemName;
    this.itemImageUrl = itemImageUrl;

    this.validate();
  }

  validate() {
    if (!this.nota || typeof this.nota !== 'number' || this.nota < 0.5 || this.nota > 5) {
      throw new AppError('Nota inválida. Deve ser um número entre 0.5 e 5.', 400);
    }
    if (!this.itemSpotifyId || typeof this.itemSpotifyId !== 'string') {
      throw new AppError('O ID do item do Spotify é obrigatório.', 400);
    }
    if (!this.tipoItem || !['album', 'track', 'artist', 'playlist'].includes(this.tipoItem)) {
      throw new AppError('Tipo de item inválido.', 400);
    }
    if (!this.itemName || typeof this.itemName !== 'string') {
      throw new AppError('O nome do item é obrigatório.', 400);
    }
  }
}

module.exports = CreateAvaliacaoDTO;