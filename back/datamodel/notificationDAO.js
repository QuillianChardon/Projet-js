const BaseDAO = require("./basedao")
module.exports= class notificationDAO extends BaseDAO {
    constructor(db) {
        super(db, "notification");
    }

    insert(notification) {
        return new Promise(((resolve, reject) => {
            this.db.query("INSERT INTO notification(idUser,titre,texte,vue,date) VALUES ($1,$2,$3,$4,$5) RETURNING id",
                [notification.idUser,notification.titre,notification.texte,notification.vue,notification.date])
                .then(res => resolve(res.rows[0].id))
                .catch(err => reject(err))
        }))
    }
    getById(id) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM notification WHERE id=$1", [id])
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e)))
    }

    getAll(idUser){
        return new Promise(((resolve, reject) => {
            this.db.query("select * from notification where idUser=$1", [idUser])
                .then(res=>resolve(res.rows))
                .catch(err=>reject(err))
        }))
    }
    getAllNotSeen(idUser){
        return new Promise(((resolve, reject) => {
            this.db.query("select * from notification where idUser=$1 and vue=false order by id desc", [idUser])
                .then(res=>resolve(res.rows))
                .catch(err=>reject(err))
        }))
    }

    update(notification){
        return this.db.query("UPDATE notification SET idUser=$1,titre=$2,texte=$3,vue=$4,date=$5 where id=$6",
            [notification.idUser,notification.titre,notification.texte,notification.vue,notification.date,notification.id])
    }
}