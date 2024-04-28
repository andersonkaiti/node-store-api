# Node Store API

API criada durante a realização do curso `Criando APIs com Node` do `balta.io` para registro de produtos, clientes e pedidos em um banco de dados `MongoDB`.

# Inicializar a aplicação - npm init

Para começar a API, é essencial incializar a aplicação com npm init -y. Ao executar o comando npm init no terminal, diversas perguntas são feitas para popular o arquivo package.json, que é o arquivo de configuração do npm, mas a flag -y pula todas as perguntas.

```
npm init -y
```

O código não é compilado, mas sim interpretado.

# Instalação dos pacotes

É necessário instalar o framework Express.js e o módulo debug. Para criar o servidor, basta utilizar o módulo nativo do Node.js chamado http.

```
npm install express debug
```

Quando a instalação é realizada, um diretório chamado node_modules será criado e os módulos instalados ficarão registrados no par chave-valor "dependencies" do package.json como um objeto de dependências. Normalmente, ao enviar a aplicação para outro desenvolvedor, o diretório node_modules não é enviado por ser muito pesado, mas como as dependências estão registradas em "dependencies", basta executar o CLI npm install que tudo será instalado.

- O Express.js é um dos pacotes mais conhecidos e provê o padrão MVC (model, view e controller).
- o Debug serve para debuggar a aplicação.
- E o HTTP é o servidor http, onde o ouvinte será criado, ficará ouvindo uma porta e recebendo e respondendo às requisições.

# Criação do servidor

Uma boa prática é utilizar o 'use strict', pois ele força o JavaScript a ser muito mais criterioso, ou seja, se algumas diretrizes não forem seguidas, a compilação falhará.

Primeiro, é necessário importar os módulos instalados utilizando a função require (fornecida pelo CommonJS) sem o "./" (que é utilizado para importar módulos locais). Na importação do debug, é adicionado um namespace chamado de "nodestr:server".

```
const http = require("node:http");
const debug = require("debug")("nodestr:server");
const express = require("express");
```

Em seguida, é necessário instanciar a aplicação utilizando o Express.js, fixar uma porta (não é uma boa prática, o correta seria normalizá-la) e definir essa porta para a aplicação utilizando o método set.

```
const app = express();
const port = 3000;
app.set("port", port);
```

Com a aplicação instanciada, basta criar o servidor HTTP utilizando o método createServer e passando como argumento a aplicação criada. Além disso, deve-se criar a variável das rotas, também conhecido como "endpoint", que, a partir dela, e dada uma URL, o usuário conseguirá interagir com a aplicação.

```
const server = http.createServer(app);
const router = express.Router();
```

A partir disso, a rota raiz, cujo método é o GET e a URL é a "/", será criada e a função callback responderá com o status 200 e o seguinte conteúdo em json. Após a definição da rota, basta utilizar o método use da aplicação criada e adicionar a rota para argumento.

```
const route = router.get("/", (req, res, next) => {
    res.status(200).send({
        title: "Node Store API",
        version: "0.0.1"
    });
});

app.use("/", route);
```

Em seguida, o servidor deve ouvir a porta definida anteriormente utilizando o método listen.

```
server.listen(port);
```

# Normalizar porta

Não é interessante fixar uma porta, mas sim inserir uma porta disponível. Para isso, é necessário normalizar a porta. A função normalizePort recebe um valor, tenta convertê-lo para um inteiro na base decimal e aplica algumas condições e retornos, dependendo do valor recebido.

```
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
```

Em seguida, a variável port receberá o retorno da função normalizePort. Ou a porta será uma variável de ambiente, ou ela será a porta "3000", que será convertida para inteiro pela função.

```
const port = normalizePort(process.env.PORT || "3000");
```

# Gerenciamento de error do servidor

Para o tratamento de erros que ocorrem durante a tentativa de inicializar o servidor, é necessária a criação de um ouvinte de erros utilizando o método on. Caso ocorra algum erro durante a tentativa de iniciar o servidor ou durante a execução dele, a callback onError é executada. Ela verifica se o erro é relacionado à operação de escuta do servidor e, se não for, ele é considerado um erro inesperado e é lançado utilizando throw error. Em seguida, a estrutura switch é utilizada para exibir mensagens de erros relacionados ao uso da porta por algum outro processo no computador, a falta de privilégios elevados ou, caso não seja nenhum desses, o erro é lançado utilizando throw error.

```
server.on("error", onError);

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
```

# Inciando o Debug

O servidor utiliza o método on para criar um ouvinte para o evento de escuta e a callback onListening é executada. Quando o servidor é inicializado, a função debug do módulo debug é chamada.

```
server.on("listening", onListening);
function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string"
        ? "pipe " + addr
        : "port " + addr.port;
    console.log("Listening on " + bind);
    debug("Listening on " + bind);
}
```

# Separando o servidor

Não é interessante manter o servidor, a API e as rotas no mesmo arquivo. Uma boa prática é segmentar os arquivos. No seguinte exemplo, o servidor está separado do aplicativo.

```
├───bin
│       server.js
└───src
        app.js
```

# Configuração do npm start

No arquivo package.json existe um par chave-valor chamado "scripts" que contém um objeto com scripts. O script padrão que vem ao inicializar a aplicação chama-se "test". Além dele, o script "start", que executará o comando "node ./bin/server.js", será adicionado para simplificar a execução do servidor, bastando executar o comando "npm start" no terminal.

```
"scripts": {
    "start": "node ./bin/server.js"
},
```

# Nodemon

Na biblioteca npm existe um módulo chamado nodemon que ouve os arquivos JavaScript da aplicação e reseta o servidor automaticamente a cada alteração dos arquivos. Ao contrário dos outros módulos baixados, utiliza-se a flag --save-dev ao instalar a dependência e ela é registrada no par chave-valor "devDependencies".

```
npm install nodemon --save-dev
```

```
"devDependencies": {
    "nodemon": "^3.1.0"
}
```

Após a instalação dele, é recomendável alterar o script "start".

```
"scripts": {
    "start": "nodemon ./bin/server.js"
},
```

# CRUD REST

Em toda rota criada, existem as opções GET (receber informações), POST (enviar informações), PUT (atualizar informações), DELETE (excluir informações), PATCH etc.

```
const route = router.get("/", (req, res, next) => {
    res.status(200).send({
        title: "Node Store API",
        version: "0.0.1"
    });
});
```

```
const create = router.post("/", (req, res, next) => {
    res.status(201).send(req.body);
});
```

```
const put = router.put("/:id", (req, res, next) => {
    const id = req.params.id;
    res.status(201).send({
        id: id,
        item: req.body
    });
});
```

```
const del = router.delete("/", (req, res, next) => {
    res.status(200).send(req.body);
});
```

Em seguida, é necessário utilizar o método use da aplicação em todas as rotas criadas.

```
app.use("/", route);
app.use("/products", create);
app.use("/products", put);
app.use("/products", del);
```

- Podemos ter duas rotas para duas operações distintas, ou seja, podemos ter a mesma rota para GET e para POST.
- Nos parâmetros da callback, temos o request, o response e o next.
- Toda vez que o endereço a uma URL é digitado, uma request está sendo realizada.
- Para recuperar o corpo da requisição, basta utilizar o req.body.
- Para recuperar dados da URL, ou seja, do query params, basta utilizar a propriedade req.params.
- Toda requisição tem um cabeçalho e um corpo.


# Status

- 200: ok.
- 201: created.
- 400: error bad request.
- 401: não autenticado.
- 403: acesso negado.
- 500: internal server error.

# Body parser

Para converter o corpo da requisição para JSON, basta instalar o módulo body-parser e utilizar o método use da aplicação antes da declaração das rotas. Todo request que chegar no servidor o body-parser converterá o corpo para JSON e deixará os dados prontos para uso. Também existe a opção urlencoded, para codificar a URL.

```
npm install body-parser
```

```
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
```

# Recuperar parâmetro

Para recuperar dados do da URL, basta utilizar a propriedade req.params.

```
const put = router.put("/:id", (req, res, next) => {
    const id = req.params.id;
    res.status(201).send(req.body);
});
```

# Rotas

Novamente, uma boa prática é segmentar a aplicação. Então, dentro do diretório /src, um novo diretório chamada routes será criada.

```
│
├───bin
│       server.js
└───src
    │   app.js
    └───routes
            index.js
```

E as rotas de /products serão realocadas para o arquvio product-route.js no diretório routes e exportada.

```
'use strict';

const router = require("express").Router();

router.post("/", (req, res, next) => {
    res.status(201).send(req.body);
});

router.put("/:id", (req, res, next) => {
    const id = req.params.id;
    res.status(201).send({
        id: id,
        item: req.body
    });
});

router.delete("/", (req, res, next) => {
    res.status(200).send(req.body);
});

module.exports = router;
```

# Controllers

Cada rota pode conter um código extenso, então é possível subdividi-lo delegando a responsabilidade do que vai ser executado por uma rota para um controller, que é o que o padrão MVC faz. A view seria o HTML, mas, neste caso, estamos trabalhando com API, então não existe, os models não foram criados ainda e os controllers respondem pelas requisições do usuário. Dado um controller, ele vai interagir com um model e responder algo para o usuário.

Nos controllers, basta escrever o código da seguinte forma.

```
'use strict';

exports.post = (req, res, next) => {
    res.status(201).send(req.body);
}

exports.put = (req, res, next) => {
    const id = req.params.id;
    res.status(201).send({
        id: id,
        item: req.body
    });
}

exports.delete = (req, res, next) => {
    res.status(200).send(req.body);
}
```

E importar o controller utilizando as propriedades exportadas.

```
'use strict';

const router = require("express").Router();
const controller = require("../controllers/product-controller");

router.post("/", controller.post);
router.put("/:id", controller.put);
router.delete("/", controller.delete);

module.exports = router;
```

# Mongoose

Para armazenar os dados, o DBMS NoSQL MongoDB será utilizado. Ele é um banco schemaless, então o que for enviado como JSON, ele salvará como documento de uma coleção. Uma coleção contém vários documentos, assim como uma tabela contém várias linhas. Em um DBMS relacional existe uma série de validações antes de persistir uma informação, como not null, chave primária etc., mas em um não relacional, ao enviar um JSON, os dados serão persistidos, o que torna a leitura e escrita de um NoSQL muito mais rápido que no de um relacional, pois não há validação, ele apenas dá input das informações no banco.

```
npm install mongoose
```

Diferente do SQL Server, em que uma conexão é estabelecida a cada request, o mongoose fica conectado constantemente ao banco. Para utilizá-lo, basta importar o módulo mongoose, utilizar o método connect, passando como argumento a connection string (neste caso, o MongoDB está na máquina local, mas ao realizar o deploy o correto é ele ser uma URL para o Mongo Atlas, por exemplo). Em seguida, algumas verificações, como se a conexão foi efetuada ou ocorreu algum erro, com o método on são criadas e a conexão é exportada para o arquivo da aplicação.

```
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017");

mongoose.connection.on("connected", () => {
    console.log("Database connected");
});

mongoose.connection.on("error", (error) => {
    console.error(error);
});

module.exports = mongoose.connection;
```

# Models

Mesmo que o MongoDB seja schemaless, o mongoose permite a criação de schemas e, inclusive, com validações.

- O schema criará automaticamente um par chave-valor chamado de _id.
- O trim remove os espaços antes e depois na string.
- slug: Cadeira Gamer = cadeira-gamer.
- É necessário que o slug tenha um índice pois será realizada uma busca por ele.
- É necessário que o slug seja único, pois não pode haver dois dele.
- No caso das tags, em um banco de dados relacional, seria necessário uma tabela apenas para as tags do produto.
- É possível adicionar uma mensagem de erro com required: [true, "O slug é obrigatório"].

```
'use strict';

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: [true, "O slug é obrigatório"],
        trim: true,
        index: true,
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
    }]
});

module.exports = mongoose.model("Product", schema);
```

# Criando um produto

Após a definição do schema, o controller realiza a comunicação com ele para armazenar os dados no banco de dados. Basta chamar o model, adicionar as propriedades nele manualmente ou simplesmente adicionando req.body ao método construtor e utilizar o método save, que é uma promise. Para exibir possíveis erros ao registrar um produto, é possível utilizar promises, then e catch a partir de callbacks. Caso haja algum erro, a resposta será com status 400 (bad request) e com o erro no corpo dela.

```
const mongoose = require("mongoose");
const Product = mongoose.model("Product");

exports.post = (req, res, next) => {
    let product = new Product(req.body);
    product
        .save()
        .then(() => {
            res.status(201).send({
                message: "Produto cadastrado com sucesso!"
            });
        }).catch(error => {
            res.status(400).send({
                message: "Falha ao cadastrar o produto",
                data: error
            })
        });
}
```

```
Corpo da requisição:
{
    "title": "Mouse Gamer",
    "description": "Mouse Gamer",
    "slug": "mouse-gamer",
    "price": "299",
    "active": true,
    "tags": ["informatica", "mouse", "games"]
}

Resposta da API:
{
    "message": "Produto cadastrado com sucesso!"
}

Schema no banco de dados:
{
    "_id" : ObjectId("6608eebc11f58e89fea8c82f"),
    "title" : "Mouse Gamer",
    "slug" : "mouse-gamer",
    "description" : "Mouse Gamer",
    "price" : NumberInt(299),
    "active" : true,
    "tags" : [
        "informatica",
        "mouse",
        "games"
    ],
    "__v" : NumberInt(0)
}
```

# Listando os produtos

Para listar todos os produtos, basta utilizar o método find com um objeto vazio (isso significa que ele buscará todos os dados, sem filtrar nada). Caso haja necessidade de realizar uma filtragem e limpa de dados, basta adicionar o objeto e uma string contendo os campos da seguinte forma.

```
const mongoose = require("mongoose");
const Product = mongoose.model("Product");

exports.get = (req, res, next) => {
    Product
        .find({
            active: true
        }, "title price slug")
        .then(data => {
            res.status(201).send(data);
        })
        .catch(error => {
            res.status(400).send(error);
        });
}
```

```
router.get("/", controller.get);
```

# Listando os produtos pelo slug

Para listar o produto com base no slug, basta, por exemplo, recuperar o parâmetro slug da URL e adicioná-lo ao objeto de filtragem. No entanto, ao consultar os dados com o método find, a consulta será respondida com um array. Para que as resposta seja apenas do objeto filtrado, basta utilizar o método findOne

```
exports.getBySlug = (req, res, next) => {
    Product
        .findOne({
            slug: req.params.slug,
            active: true
        }, "title price slug tags")
        .then(data => {
            res.status(201).send(data);
        })
        .catch(error => {
            res.status(400).send(error);
        });
}
```

```
router.get("/:slug", controller.getBySlug);
```

```
{
    "_id": "6608eebc11f58e89fea8c82f",
    "title": "Mouse Gamer",
    "slug": "mouse-gamer",
    "price": 299,
    "tags": [
        "informatica",
        "mouse",
        "games"
    ]
}
```

# Listando os produtos pelo id

Existe um método específico para filtrar por id, que se chama findById. Uma coisa importante a se notar é que é necessário criar uma rota diferente da getBySlug, então, no exemplo utilizado, a rota para utilizar o id é "/products/admin/id".

```
exports.getById = (req, res, next) => {
    Product
        .findById(req.params.id)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(error => {
            res.status(400).send(error);
        });
}
```

```
router.get("/admin/:id", controller.getById);
```

```
{
    "_id": "6608eebc11f58e89fea8c82f",
    "title": "Mouse Gamer",
    "slug": "mouse-gamer",
    "description": "Mouse Gamer",
    "price": 299,
    "active": true,
    "tags": [
        "informatica",
        "mouse",
        "games"
    ],
    "__v": 0
}
```

# Listando os produtos pela tag

Durante a definição do schema, a tag é apresentada como um array, no entanto, ao utilizar o método find e passar apenas uma tag, a filtragem no array é realizada de forma automática, sem a necessidade de um forEach, por exemplo. Em um banco de dados relacional, haveria a necessidade de fazer um inner join, por exemplo, para resolver o problema.

```
exports.getByTag = (req, res, next) => {
    Product
        .find({
            tags: req.params.tag,
            active: true
        }, "title description price slug tags")
        .then(data => {
            res.status(200).send(data);
        })
        .catch(error => {
            res.status(400).send(error);
        });
}
```

```
router.get("/tags/:tag", controller.getByTag);
```

```
[
    {
        "_id": "6608eebc11f58e89fea8c82f",
        "title": "Mouse Gamer",
        "slug": "mouse-gamer",
        "description": "Mouse Gamer",
        "price": 299,
        "tags": [
            "informatica",
            "mouse",
            "games"
        ]
    }
]
```

# Atualizando o produto pelo id

Existem várias maneiras de atualizar um produto, um exemplo é utilizar o método find e depois o save, mas o mongoose fornece o método findByIdAndUpdate. No seguinte caso, o id é recuperado pela URL e o operador $set recebe um objeto com os valores, recuperados a partir do body da requisição, a serem atualizados.

```
exports.put = (req, res, next) => {
    Product
        .findByIdAndUpdate(req.params.id, {
            $set: {
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                slug: req.body.slug
            }
        }).then(() => {
            res.status(200).send({
                message: "Produto atualizado com sucesso!"
            });
        }).catch(error => {
            res.status(400).send({
                message: "Falha ao atualizar o produto",
                data: error
            });
        });
}
```

```
router.put("/:id", controller.put);
```

# Excluindo um produto

Para excluir o produto, basta utilizar o método findOneAndDelete.

```
exports.delete = (req, res, next) => {
    Product
        .findOneAndDelete(req.body.id)
        .then(() => {
            res.status(200).send({
                message: "Produto removido com sucesso!"
            });
        }).catch(error => {
            res.status(400).send({
                message: "Falha ao remover o produto",
                data: error
            });
        });
}
```

# Validações

Todas as validações estão presentes no model criado no diretório models, no entanto, em alguns cenários como em uma aplicação de grande escala, essas validação não vão passar. Para isso, é necessário criar validações sem o uso do mongoose.

```
if(req.body.title.length > 0) {

}
```

Na presente API um sistema de validação presente no seguinte link [**Validator**](https://github.com/balta-io/1972/blob/master/src/validators/fluent-validator.js) foi utilizado a fim de remover as condições e simplificar o código. No controller de criação de produto, as seguintes validações foram realizadas.

```
let contract = new ValidationContract();
contract.hasMinLen(req.body.title, 3, "O título deve conter no mínimo 3 caracteres");
contract.hasMinLen(req.body.slug, 3, "O título deve conter no mínimo 3 caracteres");
contract.hasMinLen(req.body.description, 3, "O título deve conter no mínimo 3 caracteres");

// se os dados forem inválidos
if(!contract.isValid()) {
    res.status(400).send(contract.errors()).end();
    return;
}
```

```
Corpo da requisição:
{
    "description": "Mo",
    "price": "299",
    "active": true,
    "tags": ["informatica", "mouse", "games"]
}

Resposta da API:
[
    {
        "message": "O título deve conter no mínimo 3 caracteres"
    },
    {
        "message": "O título deve conter no mínimo 3 caracteres"
    },
    {
        "message": "O título deve conter no mínimo 3 caracteres"
    }
]
```

# Repositórios

Existe um padrão chamado de repository pattern que isola todo o acesso a dados da aplicação, ou seja, todo o acesso de dados é delegado para o repository. Um exemplo é uma função que tem acesso ao banco de dados, ou à fonte de dados, e retorna os dados necessários. Caso seja necessário ter uma lista de produtos, o repository será responsável por obter a lista de produtos e não o controller. É comum uma aplicação pequena e monolítica (que faz tudo), à medida que crescer, haver a necessidade de segmentar tudo em serviços, então a leitura do produto não é mais realizada no SQL Server ou no MongoDB, mas sim em um outro serviço. Ou seja, em um repository pattern, não importa onde está a lista de produtos, onde eles estão armazenados, onde eles serão armazenados, como é feito para armazená-los, o que importa é que seja possível inserir o produto, o repository salve ele em um banco de dados e também que seja feita a solicitação por uma lista de produtos e o repository retorne ela.

```
'use strict';

const mongoose = require("mongoose");
const Product = mongoose.model("Product");

exports.update = (id, data) => {
    return Product
        .findByIdAndUpdate(id, {
            $set: {
                title: data.title,
                description: data.description,
                price: data.price,
                slug: data.slug
            }
        });
}
```

```
const repository = require("../repositories/product-repository.js");

exports.put = (req, res, next) => {
    repository
        .update(req.params.id, req.body)
        .then(() => {
            res.status(200).send({
                message: "Produto atualizado com sucesso!"
            });
        }).catch(error => {
            res.status(400).send({
                message: "Falha ao atualizar o produto",
                data: error
            });
        });
}
```

# Async/Await

O modelo utilizado até o momento é problemático, pois os retornos são promises, então nunca há uma execução síncrona das funções. Caso hajam verificações, como verificar se o usuário já está cadastrado, por exemplo, é necessário utilizar promises com callbacks encadeadas, o que torna o código visualmente volumoso ([**artigo**](https://www.infoq.com/br/news/2017/03/node-76-async-await/)). Nas versões acima da 7.6 do Node.js, o async e await foram incluídos e, com ele, é possível utilizar blocos de código try e catch. Graças a eles, é possível substituir as promises com callbacks e escrever códigos mais legíveis como uma sequência de operações síncronas.

```
exports.get = async(req, res, next) => {
    try {
        let data = await repository.get();
        res.status(200).send(data);
    } catch(error) {
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
}
```

```
exports.get = async() => {
    const res = await Product.find({
        active: true
    }, "title price slug");
    return res;
}
```

# Models - Customer

A presente API é uma loja de produtos, onde haverão produtos, clientes e pedidos.

```
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Customer", schema);
```

# Models - Order

No model Order, para referenciar o customer, foi adicionado o type como sendo um objeto do schema além do ref como "Customer".

```
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    },
    number: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    status: {
        type: String,
        required: true,
        enum: ["created", "done"],
        default: "created"
    },
    items: [{
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        price: {
            type: Number,
            
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    }]
});

module.exports = mongoose.model("Order", schema);
```

# Cadastro de Order

```
const { randomUUID } = require("node:crypto");

exports.post = async(req, res, next) => {
    try {
        await repository.create({
            customer: req.body.customer,
            number: randomUUID().substring(0, 6),
            items: req.body.items
        });
        res.status(201).send({
            message: "Pedido cadastrado com sucesso!"
        });
    } catch(error) {
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
}
```

```
exports.create = async(data) => {
    let order = new Order(data);
    await order.save();
}
```

```
Corpo da requisição:
{
    "customer": "660b689bf33c7f01fc77c1f5",
    "items": [
        { "quantity": "1", "price": "1299", "product": "660b37944ac0539a4a41db0c" }
    ]
}
```

# Get do Order

Ao cadastrar o Order, o id do customer e do product foi utilizado. Ao utilizar o método find({}) os dados são exibidos, mas o customer e o product são exibidos com seus ids. Para não apenas exibir os ids, mas também todas as informações de cada um deles, basta utilizar no método find o método populate. Tanto o método find como o populate possui filtragem ao adicionar uma string como segundo argumento.

```
exports.get = async(req, res, next) => {
    try {
        let data = await repository.get();
        res.status(200).send(data);
    } catch(error) {
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
}
```

```
exports.get = async() => {
    let res = await Order
        .find({}, "number status")
        .populate("customer", "name")
        .populate("items.product", "title");
    return res;
}
```

```
[
    {
        "_id": "660b7eaa63073461ce1cd379",
        "customer": {
            "_id": "660b689bf33c7f01fc77c1f5",
            "name": "Anderson Kaiti"
        },
        "number": "f8bd1f",
        "status": "created",
        "items": [
            {
                "product": {
                    "_id": "660b7e3063073461ce1cd373",
                    "title": "Teste Gamer"
                }
            }
        ]
    }
]
```

# Arquivo de configuração

Para prevenir o hardcoded, é possível criar um arquivo de configuração que conterá os dados sensíveis da aplicação. Com a versão 21.7 do Node.js, é possível criar um arquivo chamado .env na raiz do projeto e chamar o dado da seguinte forma.

```
connectionString="mongodb://localhost:27017"
```

```
process.loadEnvFile(".env");

const mongoose = require("mongoose");

mongoose.connect(process.env.connectionString);
```

# Encriptando a senha

Caso o banco de dados seja invadido, todas as senhas estarão visíveis, por isso é necessário utilizar o módulo md5, por exemplo, para encriptar a senha. No entanto, para que seja mais difícil ainda de desencriptografar, uma boa prática é concatenar a senha com uma SALT_KEY privada antes de persistir a senha no banco de dados.

```
npm install md5
```

```
const md5 = require("md5");

await repository.create({
    name: req.body.name,
    email: req.body.email,
    password: md5(req.body.password + process.env.SALT_KEY)
});
```

# Enviando e-mail de boas-vindas

Ao enviar um e-mail, existem duas formas de realizar isso: a partir de um SMTP (hotmail, gmail etc.) ou um serviço, como o SendGrid. No entanto, não é recomendável realizar o envio mediante um SMTP pessoal pois corre o risco de os usuários marcarem a mensagem como spam e a conta cair em uma rede de spam, além disso, o próprio gmail bloqueará as mensagens dependendo da quantidade de mensagens e remetentes. Para segmentar a aplicação e permitir o reuso da funcionalidade, um novo diretório chamado services será criado e o código para chamar o serviço do SendGrid será alocado para o arquivo email-service.js.

```
EMAIL_TMPL="Olá, <strong>{0}</strong>, seja bem-vindo à Node Store!"
sendgridKey="TBD"
```

```
'use strict';

process.loadEnvFile(".env");
const sendgrid = require("sendgrid")(process.env.sendgridKey);

exports.send = async(to, subject, body) => {
    sendgrid.send({
        to: to,
        from: "hello@balta.io",
        subject: subject,
        html: body
    });
}
```

```
emailService.send(
    req.body.email,
    "Bem-vindo à Node Store",
    process.env.EMAIL_TMPL.replace("{0}", req.body.name)
);
```

# Upload da imagem do produto

Não é muito prático armazenar a imagem diretamente no banco de dados. Uma alternativa é registrar o caminho da imagem no banco de dados e hospedar a própria imagem em um serviço, como um container da Azure. Por conta disso, um novo campo no schema do model Product será criado e que conterá o caminho da imagem. Para utilizar os recursos da Azure, o módulo azure-storage será utilizado.

```
npm install azure-storage
```

```
image: {
    type: String,
    required: true,
    trim: true
}
```

O primeiro passo é criar uma instância do blob service da Azure utilizando o método createBlobService do módulo azure-storage e passar como argumento a connection string (presente no arquivo de configuração). Em seguida, é necessário criar um nome único para a imagem (neste caso, a função randomUUID() do módulo nativo crypto foi utilizada) e dados como o tipo da imagem e a imagem em si serão extraídos da imagem enviada para a API. Com todos esses dados em mãos, basta utilizar o método createBlockBlobFromText ("text" porque o texto, em base64, será transformado em uma imagem) da instância do serviço criada e passar os argumentos requeridos. Após o envio da imagem, o produto será registrado no banco de dados e referência da imagem será o caminho da imagem.

```
'use strict';

process.loadEnvFile(".env");
const azure = require("azure-storage");
const { randomUUID } = require("node:crypto");

exports.send = async(image) => {
    const blobSvc = azure.createBlobService(process.env.containerConnectionString);

    let filename = randomUUID() + ".jpg";
    let rawdata = image;
    let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let type = matches[1];
    let buffer = new Buffer.from(matches[2], "base64");

    await blobSvc.createBlockBlobFromText("product-images", filename, buffer, {
        contentType: type
    }, (error, result, response) => {
        if(error) {
            filename = "default-product.png"
        }
    });
    
    return filename;
}
```

```
try {
    const filename = await azureContainer.send(req.body.image);
    await repository.create({
        title: req.body.title,
        slug: req.body.slug,
        description: req.body.description,
        price: req.body.price,
        active: true,
        tags: req.body.tags,
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
```

# Autenticação

Para realizar a autenticação na API será utilizada a autenticação via token com JWT, que é o token no formato JSON. Neste caso, não existe necessidade de utilizar sessões, nem cache etc. Ele é basicamente um token encriptado com uma chave privada (armazenada no arquivo de configuração). Em toda requisição feita para aplicação o token é enviado. Com o token em mãos, a aplicação decodificará ele utilizando a chave privada e processará a requisição. Caso alguém consiga coletar o token, ele conseguirá fazer uma requisição, mas não poderá desencriptar ele por não ter a chave privada.

- A função generateToken recebe os dados, chama o método sign (do módulo jwt), que recebe os dados que serão inseridos no payload, a SALT_KEY e o tempo de expiração e gera um token assinado.
- A função decodeToken recebe o token, chama o método verify, que recebe o token e a SALT_KEY, e tenta verificá-lo. Caso e verificação seja bem-sucedida, os dados do payload são retornados.
- A função authorize servirá como um interceptador e será utilizada em toda rota que for necessário bloquear o usuário. Ele receberá os parâmetros request, response e next. No request, a função buscará o token no body, na query string e nos headers. Se o token não for encontrado, a função responderá com status 401 e a mensagem "Acesso Restrito", senão ele começará o processo de verificar o token praticamente da mesma forma como na função decodeToken. A diferença entre esta função e a anterior é que nesta o método verify contém uma callback que conterá o erro, caso tenha dado algo de errado, ou os dados do payload decodificados. Se houver algum erro, a função responderá com status 401 e a mensagem "Token inválido", senão a função next (um dos parâmetros da função authorize) será utilizada para avançar para a próxima etapa.

```
Query String:
localhost:3000/products?token=MEUTOKEN

Headers:
┌────────────────┬──────────┐
│ key            │ value    │
├────────────────┼──────────┤
│ x-access-token │ MEUTOKEN │
└────────────────┴──────────┘

Body:
{
    "token": "MEUTOKEN",
    "title": "Produto 1",
    "description": "Produto 1",
    "slug": "produto-1",
    "price": 299,
    "tags": ["tag1", "tag2"],
    "image": "..."
}
```

```
process.loadEnvFile(".env");
const jwt = require("jsonwebtoken");

exports.generateToken = async(data) => {
    return jwt.sign(data, process.env.SALT_KEY, { expiresIn: "1d" });
}

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
```

# Autenticação do customer

Antes de efetivamente gerar um token e entregá-lo como resposta, é necessário verificar se o customer existe no banco de dados, então ocorre uma busca por um registro com o email e senha inseridos no corpo da requisição. Caso o customer não exista, a função retorna status 404 e a mensagem "Usuário ou senha inválidos", caso ele exista, o token é gerado utilizando a função generateToken do authService e enviado como resposta junto com o email e nome do customer.

```
exports.authenticate = async(data) => {
    const res = await Customer.findOne({
        email: data.email,
        password: data.password
    });
    return res;
}
```

```
const authService = require("../services/auth-service");

exports.authenticate = async(req, res, next) => {
    try {
        const { email, password } = req.body;
        const customer = await repository.authenticate({
            email: email,
            password: md5(password + process.env.SALT_KEY)
        });

        if(!customer) {
            res.status(404).send({
                message: "Usuário ou senha inválidos"
            });
            return;
        }

        const token = await authService.generateToken({
            email: customer.email,
            name: customer.name
        });

        res.status(201).send({
            token: token,
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
```

```
Corpo da requisição:
{
    "title": "Produto 2",
    "description": "Produto 2",
    "slug": "produto-2",
    "price": 299,
    "tags": ["tag3", "tag4"],
    "image": "..."
}

Resposta da API:
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFuZGVya2FpdGlAZ21haWwuY29tIiwibmFtZSI6IkFuZGVyc29uIEthaXRpIiwiaWF0IjoxNzEyMTY5MDM4LCJleHAiOjE3MTIyNTU0Mzh9.0oQZ0OyDKhbN7ZsolvbvjdzBOzkqZVlf56c9FZruGHw",
    "data": {
        "email": "anderkaiti@gmail.com",
        "name": "Anderson Kaiti"
    }
}
```

# Recuperando dados do usuário logado para cadastro de Order

Durante o cadastro de um order, todas as rotas são interceptadas pela função authorize do authService, por isso que, ao chegar na função de cadastro do order, não é necessário verificar se o token existe ou não, pois isso já foi verificado. Em seguida, ocorre a decodificação do token com a função decodeToken e o order é criado no banco de dados. Como o token já contém os dados do usuário, não é necessário inseri-los no corpo da requisição.

```
router.post("/", authService.authorize, controller.post);
```

```
exports.post = async(req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        const data = await authService.decodeToken(token);

        await repository.create({
            customer: data.id,
            number: randomUUID().substring(0, 6),
            items: items
        });
        res.status(201).send({
            message: "Pedido cadastrado com sucesso!"
        });
    } catch(error) {
        console.error(error.message);
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
}
```

```
Headers:
┌────────────────┬──────────┐
│ key            │ value    │
├────────────────┼──────────┤
│ x-access-token │ eyJhb... │
└────────────────┴──────────┘

Corpo da requisição:
{
    "items": [
        {
            "product": "660c4128dbdc85073c28bb15",
            "price": 299,
            "quantity": 1
        }
    ]
}

Resposta da API:
{
    "message": "Pedido cadastrado com sucesso!"
}

Schema no banco de dados:
{
    "_id" : ObjectId("660db44a8ca5ca3c51eaac46"),
    "customer" : ObjectId("660c24a58aa417d46dc72292"),
    "number" : "0d895f",
    "createDate" : ISODate("2024-04-03T19:55:12.438+0000"),
    "status" : "created",
    "items" : [
        {
            "quantity" : NumberInt(1),
            "price" : NumberInt(299),
            "product" : ObjectId("660c4128dbdc85073c28bb15"),
            "_id" : ObjectId("660db44a8ca5ca3c51eaac47")
        }
    ],
    "__v" : NumberInt(0)
}
```

# Refresh Token

A função refreshToken vai gerar um novo token a partir de outro. A rota é interceptada por uma função que verifica se o token é válido ou não. Em seguida, caso ele seja válido, o token é decodificado e o valor do id é passado como argumento para a função getById, que irá obter os dados no registro do customer e adicioná-los ao novo token.

```
router.post("/refresh-token", authService.authorize, controller.refreshToken);
```

```
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
            name: customer.name
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
```

```
Headers:
┌────────────────┬──────────┐
│ key            │ value    │
├────────────────┼──────────┤
│ x-access-token │ eyJhb... │
└────────────────┴──────────┘

Resposta da API:
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MGMyNGE1OGFhNDE3ZDQ2ZGM3MjI5MiIsImVtYWlsIjoiYW5kZXJrYWl0aUBnbWFpbC5jb20iLCJuYW1lIjoiQW5kZXJzb24gS2FpdGkiLCJpYXQiOjE3MTIxNzUzNzEsImV4cCI6MTcxMjI2MTc3MX0.90TiR2nr2R6UzdxPLS8_OuoEl-2UDaAAzWbYsunt1Oo",
    "data": {
        "email": "anderkaiti@gmail.com",
        "name": "Anderson Kaiti"
    }
}
```

# Autorização

Apesar das funcionalidades de criação, atualização e exclusão de produtos já estarem funcionando, existe o problema de qualquer customer ter acesso a essas funcionalidades de forma irrestrita. Como solução, o model do customer será alterado para conter o campo "roles", que aceitará os valores "user" e "admin", e uma nova função interceptadora será criada para verificar se o usuário contém o role "admin". Os mesmos procedimentos da função authorize serão realizados, exceto pela parte que conterá uma verificação se o roles inclui o role "admin". Caso ele contenha, a função next será utilizada para avançar para a próxima etapa, senão a função isAdmin responderá com status 403 e a mensagem "Esta funcionalidade é restrita para administradores".

```
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
```

```
Corpo da requisição
{
    "email": "anderkaiti@gmail.com",
    "password": "andersonkaiti"
}

Resposta da API:
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MGRmYzkwMWYxN2MyMmYzNWY1ZDZjOSIsImVtYWlsIjoiYW5kZXJrYWl0aUBnbWFpbC5jb20iLCJuYW1lIjoiQW5kZXJzb24gS2FpdGkiLCJyb2xlcyI6WyJ1c2VyIl0sImlhdCI6MTcxMjE5NDEzMiwiZXhwIjoxNzEyMjgwNTMyfQ.-xDbqPAJeQuOkO1OSXbmf5q4L-0FruP_niSaLgrxHiQ",
    "data": {
        "email": "anderkaiti@gmail.com",
        "name": "Anderson Kaiti",
        "roles": [
            "user"
        ]
    }
}

Headers:
┌────────────────┬──────────┐
│ key            │ value    │
├────────────────┼──────────┤
│ x-access-token │ eyJhb... │
└────────────────┴──────────┘

Resposta da API:
{
    "message": "Esta funcionalidade é restrita para administradores"
}
```

Para que o customer possa cadastrar um produto, o role "admin" será adicionado no usuário dele pelo próprio banco de dados.

```
{
    "_id" : ObjectId("660dfc901f17c22f35f5d6c9"),
    "name" : "Anderson Kaiti",
    "email" : "anderkaiti@gmail.com",
    "password" : "572e79031af7ffb97f37e091dde99e9a",
    "roles" : [
        "user",
        "admin"
    ],
    "__v" : NumberInt(0)
}

Corpo da requisição:
{
    "email": "anderkaiti@gmail.com",
    "password": "andersonkaiti"
}

Resposta da API:
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MGRmYzkwMWYxN2MyMmYzNWY1ZDZjOSIsImVtYWlsIjoiYW5kZXJrYWl0aUBnbWFpbC5jb20iLCJuYW1lIjoiQW5kZXJzb24gS2FpdGkiLCJyb2xlcyI6WyJ1c2VyIiwiYWRtaW4iXSwiaWF0IjoxNzEyMTk0NDMyLCJleHAiOjE3MTIyODA4MzJ9._pF_tuPw2rAemc3_61Oi3ypgUlub4p7F8-JaREN8rxI",
    "data": {
        "email": "anderkaiti@gmail.com",
        "name": "Anderson Kaiti",
        "roles": [
            "user",
            "admin"
        ]
    }
}
```

E agora que o customer contém os privilégios necessários, o produto será cadastrado.

```
Headers:
┌────────────────┬──────────┐
│ key            │ value    │
├────────────────┼──────────┤
│ x-access-token │ eyJhb... │
└────────────────┴──────────┘

Corpo da requisição:
{
    "title": "Produto 3",
    "description": "Produto 3",
    "slug": "produto-3",
    "price": 299,
    "tags": ["tag5", "tag6"],
    "image": "..."
}

Resposta da API:
{
    "message": "Produto cadastrado com sucesso!"
}
```

# Limite do JSON no body-parser e o CORS

É possível estabelecer um limite de tamanho de envio de JSON.

```
app.use(express.json({
    limit: "5mb"
}));
```

Além disso, para permitir que a API receba, processe e responda às requisições de domínios diferentes do dela, é essencial habilitar o CORS (Cross Origin Resource Sharing) a partir dos headers.

```
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});
```