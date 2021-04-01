const BaseDAO = require("./basedao")
module.exports= class listeDAO extends BaseDAO{
    constructor(db) {
        super(db,"liste");
    }
    insert(liste){
        return new Promise(((resolve, reject) => {
            this.db.query("INSERT INTO liste(nom,date,done,useraccount_id) VALUES ($1,$2,$3,$4) RETURNING id",
                [liste.nom,liste.date,liste.done,liste.useraccount_id])
                .then(res=> resolve(res.rows[0].id))
                .catch(err=>reject(err))
        }))
    }

    getAll(user){
        return new Promise(((resolve, reject) => {
            this.db.query("select * from liste where useraccount_id=$1 order by id Desc", [user.id])
                .then(res=>resolve(res.rows))
                .catch(err=>reject(err))
        }))
    }


    update(liste){
        return this.db.query("UPDATE liste SET nom=$1, date=$2 ,done=$3 where id=$4", [liste.nom,liste.date,liste.done,liste.id])
    }
}