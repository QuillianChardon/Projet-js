const pg = require('pg')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

const ListeService = require("./services/liste")
const ProduitService = require("./services/produit")
const UserAccountService = require("./services/useraccount")
const SharedService = require("./services/shared")
const RoleService = require("./services/role")
const UserRoleService = require("./services/userRole")
const NotificationService = require("./services/notification")
const TypePaymentService = require("./services/typePayment")
const AbonnementService = require("./services/abonnement")


const app = express()
app.use(bodyParser.urlencoded({ extended: false })) // URLEncoded form data
app.use(bodyParser.json()) // application/json
app.use(cors())
app.use(morgan('dev')); // toutes les requêtes HTTP dans le log du serveur
app.use(cookieParser()) // read cookies (obligatoire pour l'authentification)


const connectionString = "postgres://user1:default1@user1-final-snapshot.cwgcsbcholow.us-east-1.rds.amazonaws.com/user1-final-snapshot"
//const connectionString = "postgres://qc:qc@localhost/tpnode"
const db = new pg.Pool({ connectionString: connectionString })
const listeService = new ListeService(db)
const produitService = new ProduitService(db)
const userAccountService = new UserAccountService(db)
const sharedService = new SharedService(db)
const roleService = new RoleService(db)
const userRoleService = new UserRoleService(db)
const notificationService = new NotificationService(db)
const typePaymentService = new TypePaymentService(db)
const abonnementService = new AbonnementService(db)

const jwt = require('./jwt')(userAccountService)
require('./api/useraccount')(app, userAccountService,userRoleService,notificationService,abonnementService,typePaymentService,jwt)
require('./api/liste')(app, listeService,sharedService,notificationService,jwt)
require('./api/produit')(app, produitService,listeService,sharedService,jwt)

require('./api/shared')(app,sharedService,listeService,jwt)
require('./api/notification')(app,notificationService,userAccountService,userRoleService,jwt)

require('./api/typePayment')(app,typePaymentService,jwt)
require('./api/abonnement')(app,abonnementService,userAccountService,typePaymentService,userRoleService,listeService,jwt)


require('./datamodel/seeder')(userAccountService,listeService,produitService,sharedService,roleService,userRoleService,notificationService,typePaymentService,abonnementService)
     .then(app.listen(3333))


