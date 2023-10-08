'use strict';

const mongoose = require("mongoose");
const Product = mongoose.model("Product");

exports.get = async() => {
    const res = await Product
        .find({ // o {} indica que eu vou buscar tudo
            active: true // executo o filtro
        }, "title price slug"); // separo os campos que eu quero exibir
    return res;
};

exports.getBySlug = async(slug) => {
    const res = await Product
        .findOne({ // o {} indica que eu vou buscar tudo
            slug: slug,
            active: true // executo o filtro
        }, "title description price slug tags"); // separo os campos que eu quero exibir
    return res;
};

exports.getById = async(id) => {
    const res = await Product.findById(id);
    return res;
};

exports.getByTag = async(tag) => {
    const res = await Product
        .find({
            tags: tag,
            active: true
        }, "title description price slug tags");
    return res;
};

exports.create = async(data) => {
    var product = new Product(data);
    await product.save();
}

exports.update = async(id, data) => {
    await Product
        .findByIdAndUpdate(id, {
            $set: {
                title: data.title,
                description: data.description,
                price: data.price,
                slug: data.slug
            }
        });
}

exports.delete = async(id) => {
    await Product.findByIdAndRemove(id);
}