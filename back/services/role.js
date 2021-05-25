const roleDAO = require("../datamodel/roleDAO")
module.exports=class RoleService{
    constructor(db) {
        this.dao = new roleDAO(db)
    }

    async isValid(role){
        console.log(role)
        if(role.nom==="")return false
        return true
    }
}