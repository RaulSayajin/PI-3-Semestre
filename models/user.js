const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String },
  data_nascimento: { type: Date },
  assinatura: { type: Boolean, default: false },
  capaUrl: { type: String, default: null }, // Campo para a capa personalizável do perfil
  spotifyId: { type: String, unique: true, sparse: true },
  accessToken: { type: String },
  refreshToken: { type: String },
  expiresIn: { type: Number },
  spotifyProfile: { type: Object }, 
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);
