const CreateAvaliacaoDTO = require('../dtos/CreateAvaliacaoDTO');
const UpdateAvaliacaoDTO = require('../dtos/UpdateAvaliacaoDTO'); 
const avaliacaoRepository = require('../repositories/AvaliacaoRepository');
const AppError = require('../utils/AppError');
const Avaliacao = require('../models/avaliacao');

class AvaliacaoService {
  /**
   * Cria uma nova avaliação.
   * @param {object} dadosRequest - Dados brutos do request.
   * @param {string} usuarioId - ID do usuário que está fazendo a avaliação.
   * @returns {Promise<Document>} A avaliação criada.
   */
  async createRating(dadosRequest, usuarioId) {
    // 1. Validar e estruturar os dados de entrada usando o DTO
    const avaliacaoDTO = new CreateAvaliacaoDTO(dadosRequest);

    // 2. Regra de negócio: Verificar se o usuário já avaliou este item
    const avaliacaoExistente = await avaliacaoRepository.findByUsuarioEItem(
      usuarioId,
      avaliacaoDTO.itemSpotifyId
    );

    if (avaliacaoExistente) {
      throw new AppError('Você já avaliou este item.', 409); // 409 Conflict
    }

    // 3. Preparar os dados para salvar no banco, adicionando o ID do usuário
    const dadosParaSalvar = {
      ...avaliacaoDTO,
      usuarioId,
    };

    // 4. Chamar o repositório para criar a avaliação
    const novaAvaliacao = await avaliacaoRepository.create(dadosParaSalvar);

    return novaAvaliacao;
  }

  /**
   * Atualiza uma avaliação existente.
   * @param {string} ratingId - ID da avaliação a ser atualizada.
   * @param {object} updateData - Dados para atualização.
   * @param {string} usuarioId - ID do usuário que está atualizando.
   * @returns {Promise<Document>} A avaliação atualizada.
   */
  async updateRating(ratingId, updateData, usuarioId) {
    // 1. Validar dados de entrada
    const updateDTO = new UpdateAvaliacaoDTO(updateData);

    // 2. Verificar se a avaliação existe e pertence ao usuário
    const avaliacaoExistente = await avaliacaoRepository.findByIdAndUser(
      ratingId, 
      usuarioId
    );

    if (!avaliacaoExistente) {
      throw new AppError('Avaliação não encontrada ou você não tem permissão para editá-la.', 404);
    }

    // 3. Atualizar a avaliação
    const avaliacaoAtualizada = await avaliacaoRepository.update(
      ratingId, 
      updateDTO
    );

    return avaliacaoAtualizada;
  }

  /**
   * Deleta uma avaliação.
   * @param {string} ratingId - ID da avaliação a ser deletada.
   * @param {string} usuarioId - ID do usuário que está deletando.
   * @returns {Promise<object>} Resultado da operação.
   */
  async deleteRating(ratingId, usuarioId) {
    // 1. Verificar se a avaliação existe e pertence ao usuário
    const avaliacaoExistente = await avaliacaoRepository.findByIdAndUser(
      ratingId, 
      usuarioId
    );

    if (!avaliacaoExistente) {
      throw new AppError('Avaliação não encontrada ou você não tem permissão para deletá-la.', 404);
    }

    // 2. Deletar a avaliação
    const resultado = await avaliacaoRepository.delete(ratingId);

    return resultado;
  }

  /**
   * Adiciona ou remove um like de uma avaliação.
   * @param {string} ratingId - ID da avaliação.
   * @param {string} usuarioId - ID do usuário que está curtindo.
   * @returns {Promise<Document>} A avaliação atualizada.
   */
  async toggleLike(ratingId, usuarioId) {
    const avaliacao = await avaliacaoRepository.findById(ratingId);
    if (!avaliacao) {
      throw new AppError('Avaliação não encontrada.', 404);
    }

    // Verifica se o usuário já curtiu
    const jaCurtiu = avaliacao.likes.some(likeId => likeId.equals(usuarioId));

    if (jaCurtiu) {
      return avaliacaoRepository.unlike(ratingId, usuarioId);
    } else {
      return avaliacaoRepository.like(ratingId, usuarioId);
    }
  }

  /**
   * Adiciona um comentário a uma avaliação.
   * @param {string} ratingId - ID da avaliação.
   * @param {string} usuarioId - ID do usuário que está comentando.
   * @param {string} texto - O conteúdo do comentário.
   * @returns {Promise<Document>} A avaliação com o novo comentário.
   */
  async addComment(ratingId, usuarioId, texto) {
    if (!texto || texto.trim() === '') {
      throw new AppError('O comentário não pode estar vazio.', 400);
    }

    const comentario = {
      usuarioId,
      texto: texto.trim(),
    };

    const avaliacaoAtualizada = await avaliacaoRepository.addComment(ratingId, comentario);
    if (!avaliacaoAtualizada) {
      throw new AppError('Avaliação não encontrada.', 404);
    }
    return avaliacaoAtualizada;
  }

  /**
   * Incrementa a contagem de compartilhamentos.
   * @param {string} ratingId - ID da avaliação.
   */
  async incrementShare(ratingId) {
    await avaliacaoRepository.incrementShare(ratingId);
    return { message: 'Contagem de compartilhamento incrementada.' };
  }

  async getGlobalFeed() {
    return avaliacaoRepository.findGlobalFeed();
  }

  /**
   * Busca o feed de avaliações de usuários seguidos.
   * @param {Array<string>} followingIds - Lista de IDs de usuários que o usuário atual segue.
   */
  async getFollowingFeed(followingIds) {
    if (!followingIds || followingIds.length === 0) {
      return []; // Retorna vazio se o usuário não segue ninguém
    }
    return avaliacaoRepository.findFollowingFeed(followingIds);
  }

  async getTrendingFeed() {
    return avaliacaoRepository.findTrendingFeed();
  }

  async getRatingsForItem(itemId) {
    return avaliacaoRepository.findRatingsForItem(itemId);
  }

  /**
   * Busca os artistas mais avaliados por um usuário.
   * @param {string} usuarioId - ID do usuário.
   * @returns {Promise<Array<object>>} Lista dos artistas mais avaliados.
   */
  async getUserTopArtists(usuarioId) {
    if (!usuarioId) {
      throw new AppError('ID do usuário é obrigatório.', 400);
    }
    return avaliacaoRepository.findTopArtistsByUser(usuarioId);
  }

  /**
   * Busca as músicas mais avaliadas por um usuário.
   * @param {string} usuarioId - ID do usuário.
   * @returns {Promise<Array<object>>} Lista das músicas mais avaliadas.
   */
  async getUserTopTracks(usuarioId) {
    if (!usuarioId) {
      throw new AppError('ID do usuário é obrigatório.', 400);
    }
    return avaliacaoRepository.findTopTracksByUser(usuarioId);
  }

  /**
   * Busca todas as avaliações de um usuário específico.
   * @param {string} usuarioId - ID do usuário.
   * @returns {Promise<Array<object>>} Lista de avaliações do usuário.
   */
  async getRatingsByUserId(usuarioId) {
    if (!usuarioId) {
      return [];
    }
    return avaliacaoRepository.findRatingsByUserId(usuarioId);
  }
}

module.exports = AvaliacaoService;