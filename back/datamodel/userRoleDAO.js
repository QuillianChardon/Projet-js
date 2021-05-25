const BaseDAO = require("./basedao")
module.exports= class userRoleDAO extends BaseDAO {
    constructor(db) {
        super(db, "userrole");
    }

    insert(userRole) {
        console.log("ici--")
        console.log(userRole)
        return new Promise(((resolve, reject) => {
            this.db.query("INSERT INTO userrole(idUser,idRole,Date) VALUES ($1,$2,$3) RETURNING id",
                [userRole.idUser,userRole.idRole,userRole.date])
                .then(res => resolve(res.rows[0].id))
                .catch(err => reject(err))
        }))
    }
    getAllByUser(idUser,nom){
        return new Promise(((resolve, reject) => {
            this.db.query("select * from userrole,role where role.id=userrole.idRole and idUser=$1 and role.nom=$2",
                [idUser,nom])
                .then(res=>resolve(res.rows))
                .catch(err=>reject(err))
        }))
    }

    update(userRole){
        return this.db.query("UPDATE userrole SET idUser=$1, idRole=$2,Date=$3 where id=$4", [userRole.idUser,userRole.idRole,userRole.Date,userRole.id])
    }
}