const BaseDAO = require('./basedao')
module.exports = class AbonnementDAO extends BaseDAO {
    constructor(db) {
        super(db, "abonnement")
    }
    getAll(){
        return new Promise(((resolve, reject) => {
            this.db.query("select * from abonnement order by id Desc")
                .then(res=>resolve(res.rows))
                .catch(err=>reject(err))
        }))
    }

    getForUser(idUser){
        return new Promise(((resolve, reject) => {
            this.db.query("select * from abonnement where idUser=$1 order by id Desc",[idUser])
                .then(res=>resolve(res.rows))
                .catch(err=>reject(err))
        }))
    }

    insert(abonnement) {
        return this.db.query("INSERT INTO abonnement(idTypePayment,idUser,date) VALUES ($1,$2,$3)",
            [abonnement.idTypePayment,abonnement.idUser,abonnement.date])
    }
    update(abonnement){
        return this.db.query("UPDATE abonnement SET idTypePayment=$1, idUser=$2, date=$3 where id=$4",
            [abonnement.idTypePayment,abonnement.idUser,abonnement.date,abonnement.id])
    }
}