'use strict';

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    // _id
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: { // cadeira gamer = cadeira-gamer
        type: String,
        required: [true, "O slug é obrigatório"],
        trim: true,
        index: true,
        unique: true
    },
    description: {
        type: String,
        required: true
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

// {
//     "title": "título",
//     "description": "xpto",
//     "tags": [
//         "teste": "123", "pessoas"
//     ]
// }

module.exports = mongoose.model("Product", schema);