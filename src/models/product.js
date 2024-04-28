'use strict';

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    // o schema criará automaticamente um par chave-valor chamado de _id
    title: {
        type: String,
        required: true,
        // ele é trim, então removerá os espaços antes e depois na string
        trim: true
    },
    slug: { // Cadeira Gamer = cadeira-gamer
        type: String,
        // também é possível adicionar mensagens de erro
        required: [true, "O slug é obrigatório"],
        trim: true,
        // é necessário ter um índice pois será realizada uma busca por ele
        index: true,
        // ele precisa ser único, pois não pode haver dois dele
        unique: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    tags: [{
        type: String,
        required: true
    }],
    image: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model("Product", schema);