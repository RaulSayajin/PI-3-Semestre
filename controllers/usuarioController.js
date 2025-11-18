const Usuario = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');

// Joi schema for user validation
const userSchema = Joi.object({
    nome: Joi.string().required(),
    email: Joi.string().email().required(),
    senha: Joi.string().min(6).required(),
    data_nascimento: Joi.date(),
    assinatura: Joi.boolean()
});

// Get all users
const getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create user
const createUsuario = async (req, res) => {
    try {
        // Validate request body
        const { error } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.senha, salt);

        const usuario = new Usuario({
            nome: req.body.nome,
            email: req.body.email,
            senha: hashedPassword,
            data_nascimento: req.body.data_nascimento,
            assinatura: req.body.assinatura
        });

        const newUsuario = await usuario.save();
        res.status(201).json(newUsuario);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    getAllUsuarios,
    createUsuario
};
