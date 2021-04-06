const BaseDAO = require("./basedao")
module.exports= class sharedDAO extends BaseDAO{
    constructor(db) {
        super(db,"shared");
    }

    insert(shared){
        return new Promise(((resolve, reject) => {
            this.db.query("INSERT INTO shared(idListe,idUser,droit) VALUES ($1,$2,$3)",
                [shared.idListe,shared.idUser,shared.droit])
                .then(res=> resolve(res.rows))
                .catch(err=>reject(err))
        }))
    }

    getAllByListe(id){
        return new Promise(((resolve, reject) => {
            this.db.query("select * from shared where idListe=$1 order by id",[id])
                .then(res => resolve(res.rows))
                .catch(e => reject(e))
        }))
    }

    getAllByUser(id){
        return new Promise(((resolve, reject) => {
            this.db.query("select * from shared where idUser=$1 order by id",[id])
                .then(res => resolve(res.rows))
                .catch(e => reject(e))
        }))
    }

    update(shared){
        return this.db.query("UPDATE shared SET droit=$1 where id=$2", [shared.droit,shared.id])
    }

    getAll(user){
        return new Promise(((resolve, reject) => {
            this.db.query("select * from shared where idUser=$1 order by id Desc", [user.id])
                .then(res=>resolve(res.rows))
                .catch(err=>reject(err))
        }))
    }
}