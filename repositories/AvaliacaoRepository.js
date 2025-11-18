const mongoose = require('mongoose');
const Avaliacao = require('../models/avaliacao');

class AvaliacaoRepository {

  async create(dadosAvaliacao) {
    return Avaliacao.create(dadosAvaliacao);
  }

  async update(ratingId, updateData) {
    const id = new mongoose.Types.ObjectId(ratingId);
    
    const rating = await Avaliacao.findByIdAndUpdate(
      id,
      { 
        ...updateData,
        updatedAt: new Date() 
      },
      { new: true, runValidators: true }
    ).populate('usuarioId', 'nome spotifyProfile.images');

    return rating;
  }

  async delete(ratingId) {
    const id = new mongoose.Types.ObjectId(ratingId);
    const result = await Avaliacao.findByIdAndDelete(id);
    return result;
  }

  async findById(ratingId) {
    const id = new mongoose.Types.ObjectId(ratingId);
    return Avaliacao.findById(id);
  }


  async findByIdAndUser(ratingId, usuarioId) {
    console.log('[REPO] findByIdAndUser - IDs recebidos:', { ratingId, usuarioId });
    
    try {
      const ratingIdObj = new mongoose.Types.ObjectId(ratingId);
      const usuarioIdObj = new mongoose.Types.ObjectId(usuarioId);
      
      console.log('[REPO] IDs convertidos:', { ratingIdObj, usuarioIdObj });
      
      const result = await Avaliacao.findOne({ 
        _id: ratingIdObj, 
        usuarioId: usuarioIdObj 
      });
      
      console.log('[REPO] Resultado da busca:', result ? 'Encontrado' : 'Não encontrado');
      return result;
    } catch (error) {
      console.error('[REPO] Erro na busca findByIdAndUser:', error);
      return null;
    }
  }

  // Busca se o usuário já avaliou o mesmo item
  async findByUsuarioEItem(usuarioId, itemSpotifyId) {
    const id = new mongoose.Types.ObjectId(usuarioId);
    return Avaliacao.findOne({ usuarioId: id, itemSpotifyId });
  }

  async findGlobalFeed() {
    return Avaliacao.find()
      .populate('usuarioId') // Popula o documento de usuário inteiro
      .populate('comentarios.usuarioId', 'nome spotifyProfile')
      .sort({ createdAt: -1 })
      .limit(50);
  }

  async findFollowingFeed(followingIds) {
    const ids = followingIds.map(id => new mongoose.Types.ObjectId(id));

    return Avaliacao.find({ usuarioId: { $in: ids } })
      .populate('usuarioId') // Popula o documento de usuário inteiro
      .populate('comentarios.usuarioId', 'nome spotifyProfile')
      .sort({ createdAt: -1 })
      .limit(50);
  }

  async findTrendingFeed() {
    // Lógica de "Em Alta": mais curtidas nos últimos 7 dias.
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    // Convertido para usar o Aggregation Framework, que é o correto para .addFields e $lookup
    return Avaliacao.aggregate([
      // 1. Filtrar avaliações dos últimos 7 dias
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      // 2. Adicionar campo com a contagem de likes
      //    Usamos $ifNull para evitar erro se o campo 'likes' não existir em algum documento.
      { 
        $addFields: { likesCount: { $size: { $ifNull: [ '$likes', [] ] } } } 
      },
      // 3. Ordenar por contagem de likes (maior primeiro) e depois por data (mais recente primeiro)
      { $sort: { likesCount: -1, createdAt: -1 } },
      // 4. Limitar o resultado
      { $limit: 20 },
      // 5. Popular o campo 'usuarioId' (equivalente ao .populate)
      {
        $lookup: {
          from: 'users', // O nome da coleção de usuários (geralmente é o plural do nome do modelo)
          localField: 'usuarioId',
          foreignField: '_id',
          as: 'usuarioInfo'
        }
      },
      // 6. O $lookup retorna um array, então usamos $unwind para desconstruí-lo
      //    Usamos 'preserveNullAndEmptyArrays' para não descartar a avaliação se o usuário não for encontrado.
      { 
        $unwind: { path: '$usuarioInfo', preserveNullAndEmptyArrays: true }
      },
      // 7. Substituir o campo usuarioId pelo objeto populado
      { $addFields: { usuarioId: '$usuarioInfo' } },
      // 8. Remover o campo temporário
      { $project: { usuarioInfo: 0 } }
    ]);
  }

  async findRatingsForItem(itemId) {
    return Avaliacao.find({ itemSpotifyId: itemId })
      .populate('usuarioId', 'nome spotifyProfile.images')
      .sort({ createdAt: -1 });
  }

  // Todas as avaliações feitas por um usuário
  async findRatingsByUserId(usuarioId) {
    const id = new mongoose.Types.ObjectId(usuarioId);

    return Avaliacao.find({ usuarioId: id })
      .populate('usuarioId', 'nome spotifyProfile.images')
      .sort({ createdAt: -1 })
      .limit(100);
  }

  // -----------------------------
  // TOP ARTISTAS
  // -----------------------------
  async findTopArtistsByUser(usuarioId, limit = 5) {
    const id = new mongoose.Types.ObjectId(usuarioId);

    return Avaliacao.aggregate([
      { $match: { usuarioId: id, tipoItem: 'artist' } },
      {
        $group: {
          _id: '$itemSpotifyId',
          avgNota: { $avg: '$nota' },
          itemName: { $first: '$itemName' },
          itemImageUrl: { $first: '$itemImageUrl' },
        },
      },
      { $sort: { avgNota: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          artistId: '$_id',
          itemName: 1,
          itemImageUrl: 1,
          avgNota: { $round: ['$avgNota', 2] },
        },
      },
    ]);
  }

  // -----------------------------
  // TOP FAIXAS
  // -----------------------------
  async findTopTracksByUser(usuarioId, limit = 5) {
    const id = new mongoose.Types.ObjectId(usuarioId);

    return Avaliacao.aggregate([
      { $match: { usuarioId: id, tipoItem: 'track' } },
      {
        $group: {
          _id: '$itemSpotifyId',
          avgNota: { $avg: '$nota' },
          itemName: { $first: '$itemName' },
          itemImageUrl: { $first: '$itemImageUrl' },
        },
      },
      { $sort: { avgNota: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          trackId: '$_id',
          itemName: 1,
          itemImageUrl: 1,
          avgNota: { $round: ['$avgNota', 2] },
        },
      },
    ]);
  }

  // -----------------------------
  // TOP ÁLBUNS
  // -----------------------------
  async findTopAlbumsByUser(usuarioId, limit = 5) {
    const id = new mongoose.Types.ObjectId(usuarioId);

    return Avaliacao.aggregate([
      { $match: { usuarioId: id, tipoItem: 'album' } },
      {
        $group: {
          _id: '$itemSpotifyId',
          avgNota: { $avg: '$nota' },
          itemName: { $first: '$itemName' },
          itemImageUrl: { $first: '$itemImageUrl' },
        },
      },
      { $sort: { avgNota: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          albumId: '$_id',
          itemName: 1,
          itemImageUrl: 1,
          avgNota: { $round: ['$avgNota', 2] },
        },
      },
    ]);
  }

  // Contagem de avaliações de um usuário
  async countRatingsByUser(usuarioId) {
    const id = new mongoose.Types.ObjectId(usuarioId);
    return Avaliacao.countDocuments({ usuarioId: id });
  }

  // --- Interações ---
  async like(ratingId, usuarioId) {
    const ratingIdObj = new mongoose.Types.ObjectId(ratingId);
    const usuarioIdObj = new mongoose.Types.ObjectId(usuarioId);
    return Avaliacao.findByIdAndUpdate(
      ratingIdObj,
      { $addToSet: { likes: usuarioIdObj } }, // $addToSet previne duplicados
      { new: true }
    ).populate('usuarioId');
  }

  async unlike(ratingId, usuarioId) {
    const ratingIdObj = new mongoose.Types.ObjectId(ratingId);
    const usuarioIdObj = new mongoose.Types.ObjectId(usuarioId);
    return Avaliacao.findByIdAndUpdate(
      ratingIdObj,
      { $pull: { likes: usuarioIdObj } }, // $pull remove da lista
      { new: true }
    ).populate('usuarioId');
  }

  async addComment(ratingId, comentario) {
    const ratingIdObj = new mongoose.Types.ObjectId(ratingId);
    return Avaliacao.findByIdAndUpdate(
      ratingIdObj,
      { $push: { comentarios: comentario } },
      { new: true }
    ).populate('comentarios.usuarioId', 'nome spotifyProfile');
  }

  async incrementShare(ratingId) {
    return Avaliacao.findByIdAndUpdate(ratingId, { $inc: { shareCount: 1 } });
  }
}

module.exports = new AvaliacaoRepository();