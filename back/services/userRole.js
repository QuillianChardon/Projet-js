const roleDAO = require("../datamodel/roleDAO")
const userRoleDAO = require("../datamodel/userRoleDAO")
const userDAO = require("../datamodel/useraccountdao")
module.exports=class userRoleService{
    constructor(db) {
        this.dao = new roleDAO(db)
        this.daoUserRole = new userRoleDAO(db)
        this.daoUser = new userDAO(db)
    }

    async isValid(userRole){
        console.log(userRole)
        if(await this.daoUser.getById(userRole.idUser)==undefined){
            return false
        }
        if(await this.dao.getById(userRole.idRole)==undefined){
            return false
        }
        if(userRole.idRole==undefined){
            return false
        }
        return true
    }
}