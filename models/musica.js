const mongoose = require('mongoose');

const MusicaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    duracao: { type: Number, required: true },
    genero: { type: String },
    album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' }
});

module.exports = mongoose.model('Musica', MusicaSchema);
