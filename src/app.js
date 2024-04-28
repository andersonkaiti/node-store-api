'use strict';

const express = require("express");

const app = express();
const router = express.Router();

// conecta ao banco
const db = require("../config/database");

// carrega os models
const Product = require("./models/product");
const Customer = require("./models/customer");
const Order = require("./models/order");

// carrega as rotas
const indexRoute = require("./routes/index-route");
const productRoute = require("./routes/product-route");
const customerRoute = require("./routes/customer-route");
const orderRoute = require("./routes/order-route");

// o limit estabelece o limite para o envio de imagens em base64, por exemplo
app.use(express.json({
    limit: "5mb"
}));
app.use(express.urlencoded({ extended: false }));

// habilita o cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

app.use("/", indexRoute);
app.use("/products", productRoute);
app.use("/customers", customerRoute);
app.use("/orders", orderRoute);

module.exports = app;