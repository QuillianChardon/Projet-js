const produitDAO = require("../datamodel/produitDAO")
const listeDAO = require("../datamodel/listeDAO")
const notificationDAO = require("../datamodel/notificationDAO")
const useraccountDAO = require("../datamodel/useraccountdao")
const notification = require('../datamodel/notification')
module.exports=class ProduitService{
    constructor(db) {
        this.dao = new produitDAO(db)
        this.daoListe = new listeDAO(db)
        this.daoNotif = new notificationDAO(db)
        this.daoUser = new useraccountDAO(db)
    }

    async isValid(produit){
        console.log(produit)
        if(produit.nom==="")return false
        produit.nom=produit.nom.trim()
        produit.quantite=produit.quantite
        if(produit.quantite==0)return false

        if(produit.idListe==undefined){
            console.log("iciliste manque")
            return false
        }
        console.log(produit.idListe)
        if(await this.daoListe.getById(produit.idListe)==undefined){
            return false
        }
        return true
    }

    async checkNotifForModifPartageListe(listeId,idUser,idUserModif){
        let haveNotif = await this.daoNotif.checkNotifModifListePartage(idUser,"Modification de la liste #"+listeId)
        let user =  await this.daoUser.getById(idUserModif)
        if(haveNotif[0]===undefined){
            this.daoNotif.insert(new notification(idUser,`Modification de la liste #${listeId}`,`la liste a était modifié par l'utilisateur :&nbsp;<b>${user.login}</b>`,false,new Date()))
        }
    }
}