const liste = require('./liste')
const produit = require('./produit')
const useraccount = require('./useraccount')

module.exports = (userAccountService,listeService,produitService,sharedService) => {
    return new Promise(async (resolve, reject) => {
        try {
            await userAccountService.dao.db.query("CREATE TABLE useraccount(id SERIAL PRIMARY KEY, displayname TEXT NOT NULL, login TEXT NOT NULL, challenge TEXT NOT NULL,verif BOOLEAN NOT NULL)")
            await listeService.dao.db.query("CREATE TABLE liste(id SERIAL PRIMARY KEY, nom TEXT NOT NULL,date DATE NOT NULL,done BOOLEAN NOT NULL, useraccount_id INTEGER REFERENCES useraccount(id))")//clé étrangére --> useraccount_id INTEGER REFERENCES useraccount(id)
            await produitService.dao.db.query("CREATE TABLE produit(id SERIAL PRIMARY KEY, idListe INTEGER, nom TEXT NOT NULL,quantite INTEGER NOT NULL,done BOOLEAN NOT NULL)")
            await sharedService.dao.db.query("CREATE TABLE shared(id SERIAL PRIMARY KEY,idListe INTEGER ,idUser INTEGER ,droit BOOLEAN NOT NULL)")
            // INSERTs
        } catch (e) {
            if (e.code === "42P07") { // TABLE ALREADY EXISTS https://www.postgresql.org/docs/8.2/errcodes-appendix.html
                resolve()
            } else {
                reject(e)
            }
            return
        }

        userAccountService.insert("User1", "user1@example.com", "azerty",true)
            .then(_ => userAccountService.dao.getByLogin("user1@example.com"))
            .then(async user1 => {
                for(let i=0;i<3;i++){
                    let id= await listeService.dao.insert(new liste(`toto${i}`,new Date(),false,user1.id))
                    for(let j=0;j<5;j++) {
                        await produitService.dao.insert(new produit(id, `produit${j}`,i,false))
                    }
                }
            })

        userAccountService.insert("User2", "user2@example.com", "azerty",true)
            .then(_ => userAccountService.dao.getByLogin("user2@example.com"))
            .then(async user2 => {
                for(let i=0;i<3;i++){
                    let id= await listeService.dao.insert(new liste(`tata${i}`,new Date(),false,user2.id))
                    for(let j=0;j<5;j++) {
                        await produitService.dao.insert(new produit(id, `produitV2${j}`,i,false))
                    }
                }
            })
    })


}