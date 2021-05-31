const abonnementDAO = require("../datamodel/abonnementDAO")
const typePaymentDAO = require("../datamodel/typePaymentDAO")
const useraccountDAO = require("../datamodel/useraccountdao")
module.exports=class AbonnementService{
    constructor(db) {
        this.dao = new abonnementDAO(db)
        this.daoPayment = new typePaymentDAO(db)
        this.daoUser = new useraccountDAO(db)
    }

    async isValid(abonnement){
        if(await this.daoPayment.getById(abonnement.idTypePayment)===undefined){
            return false
        }
        if(await this.daoUser.getById(abonnement.idUser)===undefined){
            return false
        }
        return true
    }
}