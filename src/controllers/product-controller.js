'use strict';

// process.loadEnvFile(".env");
require("dotenv").config();
const ValidationContract = require("../validators/fluent-validator");
const repository = require("../repositories/product-repository");
const azureContainer = require("../services/azure-container-service");

exports.get = async(req, res, next) => {
    try {
        let data = await repository.get();
        res.status(200).send(data);
    } catch(error) {
        console.error(error.message);
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
}

exports.getBySlug = async(req, res, next) => {
    try {
        let data = await repository.getBySlug(req.params.slug);
        res.status(200).send(data);
    } catch(error) {
        console.error(error.message);
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
}

exports.getById = async(req, res, next) => {
    try {
        let data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch(error) {
        console.error(error.message);
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
}

exports.getByTag = async(req, res, next) => {
    try {
        let data = await repository.getByTag(req.params.tag);
        res.status(200).send(data);
    } catch(error) {
        console.error(error.message);
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
}

exports.post = async(req, res, next) => {
    let contract = new ValidationContract();
    const { title, slug, description } = req.body;
    contract.hasMinLen(title, 3, "O título deve conter no mínimo 3 caracteres");
    contract.hasMinLen(slug, 3, "O slug deve conter no mínimo 3 caracteres");
    contract.hasMinLen(description, 3, "A descrição deve conter no mínimo 3 caracteres");

    // se os dados forem inválidos
    if(!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }
    
    try {
        const filename = await azureContainer.send(req.body.image);
        const { price, tags } = req.body;
        await repository.create({
            title: title,
            slug: slug,
            description: description,
            price: price,
            active: true,
            tags: tags,
            image: "https://nodestoreapi.blob.core.windows.net/product-images/" + filename
        });
        res.status(201).send({
            message: "Produto cadastrado com sucesso!"
        });
    } catch(error) {
        console.error(error.message);
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
}

exports.put = async(req, res, next) => {
    try {
        await repository.update(req.params.id, req.body);
        res.status(200).send({
            message: "Produto atualizado com sucesso!"
        });
    } catch(error) {
        console.error(error.message);
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
}

exports.delete = async(req, res, next) => {
    try {
        await repository.delete(req.body.id);
        res.status(200).send({
            message: "Produto removido com sucesso!"
        });
    } catch(error) {
        console.error(error.message);
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
}