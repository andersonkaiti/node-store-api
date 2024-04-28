// process.loadEnvFile(".env");
require("dotenv").config();

const mongoose = require("mongoose");

mongoose.connect(process.env.connectionString);

mongoose.connection.on("connected", () => {
    console.log("Banco de dados conectado com sucesso!");
});

mongoose.connection.on("error", (error) => {
    console.error(error);
});

module.exports = mongoose.connection;