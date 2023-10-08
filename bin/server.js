'use strict'

// importação do http, para criar o servidor http que ficará ouvindo a porta, recebendo e respondendo às requisições
const http = require("http");
const debug = require("debug")("nodestr:server");
const app = require("../src/app");

// tudo o que for colocado, dentro do require, entre aspas e sem um caminho (./), ele buscará na pasta node_modules
// caso seja da minha aplicação, deve-se começar com um ./

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// criação do servidor http:
const server = http.createServer(app);

// o servidor ficará ouvindo a porta:
server.listen(port);
server.on("error", onError);
server.on("listening", onListening)

console.log("API rodando na porta " + port);

function normalizePort(val) {
    const port = parseInt(val, 10);

    if(isNaN(port)) {
        return val;
    }

    if(port >= 0) {
        return port;
    }
    
    return false;
}

function onError(error) {
    if(error.syscall !== "listen") {
        throw error;
    }

    const bind = typeof port === "string" ?
        "Pipe " + port :
        "Port " + port;
    
    switch(error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
            
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string"
        ? "pipe " + addr
        : "port " + addr.port;
    debug("Listening on " + bind);
}