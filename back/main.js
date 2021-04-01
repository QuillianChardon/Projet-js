const pg = require('pg')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

const ListeService = require("./services/liste")
const ProduitService = require("./services/produit")
const UserAccountService = require("./services/useraccount")


const app = express()
app.use(bodyParser.urlencoded({ extended: false })) // URLEncoded form data
app.use(bodyParser.json()) // application/json
app.use(cors())
app.use(morgan('dev')); // toutes les requêtes HTTP dans le log du serveur
app.use(cookieParser()) // read cookies (obligatoire pour l'authentification)

//const connectionString = "postgres://user:password@192.168.56.101/instance"
const connectionString = "postgres://qc:qc@localhost/tpnode"
const db = new pg.Pool({ connectionString: connectionString })
const listeService = new ListeService(db)
const produitService = new ProduitService(db)
const userAccountService = new UserAccountService(db)

const jwt = require('./jwt')(userAccountService)
require('./api/useraccount')(app, userAccountService,jwt)
require('./api/liste')(app, listeService,jwt)
require('./api/produit')(app, produitService,listeService)

require('./datamodel/seeder')(userAccountService,listeService,produitService)
     .then(app.listen(3333))


