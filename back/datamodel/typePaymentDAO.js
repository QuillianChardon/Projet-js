const BaseDAO = require('./basedao')
module.exports = class TypePaymentDAO extends BaseDAO {
    constructor(db) {
        super(db, "typepayment")
    }
    getAll(){
        return new Promise(((resolve, reject) => {
            this.db.query("select * from typepayment order by id Desc")
                .then(res=>resolve(res.rows))
                .catch(err=>reject(err))
        }))
    }
    getById(id) {
        return new Promise((resolve, reject) =>
            this.db.query(`SELECT * FROM typepayment WHERE id=$1`, [ id ])
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e)))
    }
    getByName(nom) {
        return new Promise((resolve, reject) =>
            this.db.query(`SELECT * FROM typepayment WHERE nom=$1`, [ nom ])
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e)))
    }
    insert(typepayment) {
        return this.db.query("INSERT INTO typepayment(nom,icon) VALUES ($1,$2)",
            [typepayment.nom,typepayment.icon])
    }
    update(typepayment){
        return this.db.query("UPDATE typepayment SET nom=$1, icon=$2 where id=$3",
            [typepayment.nom,typepayment.icon,typepayment.id])
    }
}