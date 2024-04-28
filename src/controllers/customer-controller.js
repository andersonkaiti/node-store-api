'use strict';

// process.loadEnvFile(".env");
require("dotenv").config();
const ValidationContract = require("../validators/fluent-validator");
const repository = require("../repositories/customer-repository");
const md5 = require("md5");
const authService = require("../services/auth-service");

const emailService = require("../services/email-service");

exports.post = async(req, res, next) => {
    let contract = new ValidationContract();
    const { name, email, password } = req.body;
    contract.hasMinLen(name, 3, "O nome deve conter no mínimo 3 caracteres");
    contract.isEmail(email, "E-mail inválido");
    contract.hasMinLen(password, 6, "A senha deve conter no mínimo 6 caracteres");

    // se os dados forem inválidos
    if(!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }
    
    try {
        await repository.create({
            name: name,
            email: email,
            password: md5(password + process.env.SALT_KEY),
            roles: ["user"]
        });

        // como não haverá tratamento de erros, não utilizamos o await
        emailService.send(
            email,
            "Bem-vindo à Node Store",
            process.env.EMAIL_TMPL.replace("{0}", name)
        );

        res.status(201).send({
            message: "Cliente cadastrado com sucesso!"
        });
    } catch(error) {
        console.error(error.message);
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
}

exports.authenticate = async(req, res, next) => {
    try {
        const { email, password } = req.body;
        // os dados serão inseridos como um objeto pois no repository eles serão desestruturados
        const customer = await repository.authenticate({
            email: email,
            password: md5(password + process.env.SALT_KEY)
        });

        if(!customer) {
            // 404: not found
            res.status(404).send({
                message: "Usuário ou senha inválidos"
            });
            return;
        }

        const token = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        });

        res.status(201).send({
            token: token,
            data: {
                email: customer.email,
                name: customer.name,
                roles: customer.roles
            }
        });
    } catch(error) {
        console.error(error.message);
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
}

exports.refreshToken = async(req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        const data = await authService.decodeToken(token);
        
        const customer = await repository.getById(data.id);

        if(!customer) {
            res.status(404).send({
                message: "Cliente não encontrado"
            });
            return;
        }

        const tokenData = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        });

        res.status(201).send({
            token: tokenData,
            data: {
                email: customer.email,
                name: customer.name
            }
        });
    } catch(error) {
        console.error(error.message);
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
}