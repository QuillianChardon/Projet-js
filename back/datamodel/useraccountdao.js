const BaseDAO = require('./basedao')


module.exports = class UserAccountDAO extends BaseDAO {
    constructor(db) {
        super(db, "useraccount")
    }

    getByLogin(login) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM useraccount WHERE login=$1", [ login ])
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e)))
    }

    getByIdAllColonne(id) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM useraccount WHERE id=$1", [id])
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e)))
    }

    getById(id) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT id,login FROM useraccount WHERE id=$1", [id])
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e)))
    }


    getAll(idUserLog){
        return new Promise(((resolve, reject) => {
            this.db.query("select id,login from useraccount where id<>$1 order by id Desc",[idUserLog])
                .then(res=>resolve(res.rows))
                .catch(err=>reject(err))
        }))
    }

    getAllAdmin(){
        return new Promise(((resolve, reject) => {
            this.db.query("select id,login from useraccount  order by id Desc")
                .then(res=>resolve(res.rows))
                .catch(err=>reject(err))
        }))
    }
    getAllShare(idUserLog,idListe){
        return new Promise(((resolve, reject) => {
            this.db.query("select id,login from useraccount where id<>$1 and id not in (select idUser from shared where idListe=$2) order by id Desc",[idUserLog,idListe])
                .then(res=>resolve(res.rows))
                .catch(err=>reject(err))
        }))
    }
    insert(useraccount) {
        return this.db.query("INSERT INTO useraccount(displayname,login,challenge,verif,active) VALUES ($1,$2,$3,$4,$5)",
            [useraccount.displayName, useraccount.login, useraccount.challenge,useraccount.verif,useraccount.active])
    }
    update(useraccount){
        return this.db.query("UPDATE useraccount SET displayname=$1,login=$2,challenge=$3,verif=$4,active=$5 where id=$6",
            [useraccount.displayname, useraccount.login, useraccount.challenge,useraccount.verif,useraccount.active,useraccount.id])
    }


    getByIdForAdmin(id) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT id,login,displayname,active FROM useraccount WHERE id=$1", [id])
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e)))
    }

}