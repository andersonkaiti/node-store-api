'use strict';

// process.loadEnvFile(".env");
require("dotenv").config();
const azure = require("azure-storage");
const { randomUUID } = require("node:crypto");

exports.send = async(image) => {
    // cria o blob service
    const blobSvc = azure.createBlobService(process.env.containerConnectionString);

    let filename = randomUUID() + ".jpg";
    let rawdata = image;
    let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let type = matches[1];
    let buffer = new Buffer.from(matches[2], "base64");

    // salva a imagem
    // createBlockBlobFromText, ou seja, um arquivo está sendo criado com base em um texto
    await blobSvc.createBlockBlobFromText("product-images", filename, buffer, {
        contentType: type
    }, (error, result, response) => {
        if(error) {
            filename = "default-product.png"
        }
    });
    
    return filename;
}