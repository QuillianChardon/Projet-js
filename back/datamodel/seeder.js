const liste = require('./liste')
const produit = require('./produit')
const useraccount = require('./useraccount')
const role = require('./role')
const userRole = require('./userRole')
const notification = require('./notification')

module.exports = (userAccountService,listeService,produitService,sharedService,roleService,userRoleService,notificationService) => {
    return new Promise(async (resolve, reject) => {
        try {
            await userAccountService.dao.db.query("CREATE TABLE useraccount(id SERIAL PRIMARY KEY, displayname TEXT NOT NULL, login TEXT NOT NULL, challenge TEXT NOT NULL,verif BOOLEAN NOT NULL,active BOOLEAN NOT NULL)")
            await listeService.dao.db.query("CREATE TABLE liste(id SERIAL PRIMARY KEY, nom TEXT NOT NULL,date DATE NOT NULL,done BOOLEAN NOT NULL, useraccount_id INTEGER REFERENCES useraccount(id))")//clé étrangére --> useraccount_id INTEGER REFERENCES useraccount(id)
            await produitService.dao.db.query("CREATE TABLE produit(id SERIAL PRIMARY KEY, idListe INTEGER, nom TEXT NOT NULL,quantite INTEGER NOT NULL,done BOOLEAN NOT NULL)")
            await sharedService.dao.db.query("CREATE TABLE shared(id SERIAL PRIMARY KEY,idListe INTEGER ,idUser INTEGER ,droit BOOLEAN NOT NULL)")
            await roleService.dao.db.query("CREATE TABLE role(id SERIAL PRIMARY KEY,nom TEXT NOT NULL)")
            await userRoleService.dao.db.query("CREATE TABLE userRole(id SERIAL PRIMARY KEY,idRole INTEGER ,idUser INTEGER ,date DATE NOT NULL)")
            await notificationService.dao.db.query("CREATE TABLE notification(id SERIAL PRIMARY KEY,idUser INTEGER ,titre TEXT NOT NULL,texte TEXT NOT NULL,vue BOOLEAN NOT NULL,date DATE NOT NULL)")
            // INSERTs
        } catch (e) {
            if (e.code === "42P07") { // TABLE ALREADY EXISTS https://www.postgresql.org/docs/8.2/errcodes-appendix.html
                resolve()
            } else {
                reject(e)
            }
            return
        }
        roleService.dao.insert("utilisateur")
        roleService.dao.insert("administrateur")
        userAccountService.insert("User1", "user1@example.com", "azerty",true,true)
            .then(_ => userAccountService.dao.getByLogin("user1@example.com"))
            .then(async user1 => {
                for(let i=0;i<3;i++){
                    let id= await listeService.dao.insert(new liste(`toto${i}`,new Date(),false,user1.id))
                    for(let j=0;j<5;j++) {
                        await produitService.dao.insert(new produit(id, `produit${j}`,i,false))
                    }
                }
                await userRoleService.daoUserRole.insert(new userRole(1,user1.id,new Date()))
                await userRoleService.daoUserRole.insert(new userRole(2,user1.id,new Date()))
                await notificationService.dao.insert(new notification(user1.id,"Bienvenue","vous venez de vous créer un compte",false,new Date()))
            })

        userAccountService.insert("User2", "user2@example.com", "azerty",true,true)
            .then(_ => userAccountService.dao.getByLogin("user2@example.com"))
            .then(async user2 => {
                for(let i=0;i<3;i++){
                    let id= await listeService.dao.insert(new liste(`tata${i}`,new Date(),false,user2.id))
                    for(let j=0;j<5;j++) {
                        await produitService.dao.insert(new produit(id, `produitV2${j}`,i,false))
                    }
                }
                await userRoleService.daoUserRole.insert(new userRole(1,user2.id,new Date()))
                await notificationService.dao.insert(new notification(user2.id,"Bienvenue","vous venez de vous créer un compte",false,new Date()))
            })
    })


}