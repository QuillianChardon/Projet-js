const sharedDAO = require("../datamodel/sharedDAO")
const listeDAO = require("../datamodel/listeDAO")
const accountDAO = require("../datamodel/useraccountdao")
module.exports=class SharedService{
    constructor(db) {
        this.dao = new sharedDAO(db)
        this.daoListe = new listeDAO(db)
        this.daoAccount = new accountDAO(db)
    }

    async isValid(shared){
        console.log(shared)
        if(shared.idListe==="")return false
        if(shared.idUser==="")return false

        if(shared.idListe==undefined || shared.idUser==undefined){
            return false
        }

        if(await this.daoListe.getById(shared.idListe)==undefined){
            return false
        }

        if(await this.daoAccount.getById(shared.idUser)==undefined){
            return false
        }

        return true
    }
}