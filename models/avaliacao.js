const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  texto: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const avaliacaoSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'O ID do usuário é obrigatório.'],
      index: true,
      ref: 'User', 
    },
    itemSpotifyId: {
      type: String,
      required: [true, 'O ID do item no Spotify é obrigatório.'],
      index: true,
    },
    tipoItem: {
      type: String,
      required: [true, 'O tipo do item é obrigatório.'],
      enum: ['album', 'track', 'artist', 'playlist'],
    },
    nota: {
      type: Number,
      required: [true, 'A nota é obrigatória.'],
      min: [0.5, 'A nota mínima é 0.5.'],
      max: [5, 'A nota máxima é 5.'],
    },
    comentario: {
      type: String,
      trim: true,
      maxlength: [1000, 'O comentário não pode exceder 1000 caracteres.'],
    },
    itemName: {
      type: String,
      required: [true, 'O nome do item é obrigatório.'],
    },
    itemImageUrl: {
      type: String,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    comentarios: [comentarioSchema],
    shareCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  }
);

// Índice composto para garantir que um usuário só pode avaliar um item uma vez.
avaliacaoSchema.index({ usuarioId: 1, itemSpotifyId: 1 }, { unique: true });

const Avaliacao = mongoose.model('Avaliacao', avaliacaoSchema);

module.exports = Avaliacao;