const BaseDAO = require("./basedao")
module.exports= class roleDAO extends BaseDAO {
    constructor(db) {
        super(db, "role");
    }

    insert(role) {
        return new Promise(((resolve, reject) => {
            this.db.query("INSERT INTO role(nom) VALUES ($1) RETURNING id",
                [role])
                .then(res => resolve(res.rows[0].id))
                .catch(err => reject(err))
        }))
    }
    getById(id) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM role WHERE id=$1", [id])
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e)))
    }

    getAll(){
        return new Promise(((resolve, reject) => {
            this.db.query("select * from role")
                .then(res=>resolve(res.rows))
                .catch(err=>reject(err))
        }))
    }

    update(role){
        return this.db.query("UPDATE role SET nom=$1 where id=$2", [role.nom,role.id])
    }
}