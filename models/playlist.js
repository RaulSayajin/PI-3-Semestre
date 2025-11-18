const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    data_criacao: { type: Date, default: Date.now },
    publica: { type: Boolean, default: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    musicas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Musica' }]
});

module.exports = mongoose.model('Playlist', PlaylistSchema);
