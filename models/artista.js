const mongoose = require('mongoose');

const ArtistaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    bio: { type: String },
    genero_principal: { type: String, required: true }
});

module.exports = mongoose.model('Artista', ArtistaSchema);
