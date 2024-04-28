'use strict';

// process.loadEnvFile(".env");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// gera o token
exports.generateToken = async(data) => {
    // gera o token assinado
    return jwt.sign(data, process.env.SALT_KEY, { expiresIn: "1d" });
}

// recebe um token e verifica ele
exports.decodeToken = async(token) => {
    let data = await jwt.verify(token, process.env.SALT_KEY);
    return data;
}

exports.authorize = (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers["x-access-token"];

    if(!token) {
        res.status(401).json({
            message: "Acesso Restrito"
        });
    } else {
        jwt.verify(token, process.env.SALT_KEY, (error, decoded) => {
            if(error) {
                res.status(401).json({
                    message: "Token inválido"
                });
            } else {
                next();
            }
        });
    }
}

exports.isAdmin = (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers["x-access-token"];

    if(!token) {
        res.status(401).json({
            message: "Token inválido"
        });
    } else {
        jwt.verify(token, process.env.SALT_KEY, (error, decoded) => {
            console.log(error, decoded);
            if(error) {
                res.status(401).json({
                    message: "Token inválido"
                });
            } else {
                if(decoded.roles.includes("admin")) {
                    next();
                } else {
                    res.status(403).json({
                        message: "Esta funcionalidade é restrita para administradores"
                    });
                }
            }
        });
    }
}