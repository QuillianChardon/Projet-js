const BaseDAO = require('./basedao')

module.exports = class UserAccountDAO extends BaseDAO {
    constructor(db) {
        super(db, "useraccount")
    }
    insert(useraccount) {
        return this.db.query("INSERT INTO useraccount(displayname,login,challenge) VALUES ($1,$2,$3)",
            [useraccount.displayName, useraccount.login, useraccount.challenge])
    }
    getByLogin(login) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM useraccount WHERE login=$1", [ login ])
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e)))
    }

    getById(id) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM useraccount WHERE id=$1", [id])
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
    getAllShare(idUserLog,idListe){
        return new Promise(((resolve, reject) => {
            this.db.query("select id,login from useraccount where id<>$1 and id not in (select idUser from shared where idListe=$2) order by id Desc",[idUserLog,idListe])
                .then(res=>resolve(res.rows))
                .catch(err=>reject(err))
        }))
    }
}