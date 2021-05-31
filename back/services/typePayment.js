const typePaymentDAO = require("../datamodel/typePaymentDAO")
module.exports=class TypePaymentService{
    constructor(db) {
        this.dao = new typePaymentDAO(db)
    }

    async isValid(typePayment){
        if(typePayment.nom==="")return false
        if(typePayment.icon==="")return false
        return true
    }
}