const BaseDAO = require("./basedao")
module.exports= class produitDAO extends BaseDAO{
    constructor(db) {
        super(db,"produit");
    }
    insert(produit){

        return new Promise(((resolve, reject) => {
            this.db.query("INSERT INTO produit(idListe,nom,quantite,done) VALUES ($1,$2,$3,$4) RETURNING id",
                [produit.idListe,produit.nom,produit.quantite,produit.done])
                .then(res=> resolve(res.rows[0].id))
                .catch(err=>reject(err))
        }))
    }

    getAll(user){
        return new Promise(((resolve, reject) => {
            this.db.query("select * from produit,liste where idListe=liste.id and liste.useraccount_id=$1 order by id", [user.id])
                .then(res=>resolve(res.rows))
                .catch(err=>reject(err))
        }))
    }

    getAllByListe(id){
        return new Promise(((resolve, reject) => {
            this.db.query("select * from produit where idliste=$1 order by id",[id])
                .then(res => resolve(res.rows))
                .catch(e => reject(e))
        }))
    }

    update(produit){
        return this.db.query("UPDATE produit SET nom=$1, quantite=$2, done=$3 where id=$4", [produit.nom,produit.quantite,produit.done,produit.id])
    }
}