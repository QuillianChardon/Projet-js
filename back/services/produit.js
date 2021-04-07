const produitDAO = require("../datamodel/produitDAO")
const listeDAO = require("../datamodel/listeDAO")
module.exports=class ProduitService{
    constructor(db) {
        this.dao = new produitDAO(db)
        this.daoListe = new listeDAO(db)
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
}