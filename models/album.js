const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    ano: { type: Number, required: true },
    capa_url: { type: String },
    artista: { type: mongoose.Schema.Types.ObjectId, ref: 'Artista' }
});

module.exports = mongoose.model('Album', AlbumSchema);
