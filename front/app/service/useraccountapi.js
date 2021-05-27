class UserAccountAPI extends BaseAPIService {
    constructor() {
        super("useraccount")
    }
    authenticate(login, password) {
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')

        return new Promise((resolve, reject) => fetch(`${this.url}/authentificate`, {
            method: "POST",
            headers: this.headers,
            body: `login=${login}&password=${password}`
        }).then(res => {
            if (res.status === 200) {
                resolve(res.json())
            } else {
                reject(res.status)
            }
        }).catch(err => reject(err)))
    }

    getAllshared(idliste){
        return fetchJSON(`${this.url}/share/${idliste}`, this.token)
    }
    getAll(){
        return fetchJSON(`${this.url}`, this.token)
    }

    GetOneByToken(){
        return fetchJSON(`${this.url+"/one"}`, this.token)
    }

    inscription(login,password,pseudo){
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${this.url}/inscription`, {
            method: "POST",
            headers: this.headers,
            body: `login=${login}&password=${password}&pseudo=${pseudo}`
        }).then(res => {
            resolve(res.status)
        }).catch(err => reject(err)))
    }



    getValidation(token){
        return fetchJSON(`${this.url}/token/${token}`)
    }

    getValidationChangePassword(token,password){
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${this.url}/modificationPassword`, {
            method: "POST",
            headers: this.headers,
            body: `token=${token}&password=${password}`
        }).then(res => {
            resolve(res.status)
        }).catch(err => reject(err)))
    }

    reSendMailValidation(login){
        return fetchJSON(`${this.url}/sendMail/${login}`)
    }

    sendResetPasswordByLogin(login){
        return fetchJSONChange(`${this.url}/sendMailBylogin/${login}`)
    }


    modifEmail(login){
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${this.url}/modif/email`, {
            method: "POST",
            headers: this.headers,
            body: `login=${login}`
        }).then(res => {
            if (res.status === 200) {
                resolve(res.json())
            } else {
                reject(res.status)
            }
        }).catch(err => reject(err)))
    }

    modifPassword(password){
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${this.url}/modif/password`, {
            method: "POST",
            headers: this.headers,
            body: `password=${password}`
        }).then(res => {
            resolve(res.status)
        }).catch(err => reject(err)))
    }

    isAdmin(){
        return fetchJSONChange(`${this.url}/isAdmin`, this.token)
    }

    GetOneByIdForAdmin(id){
        return fetchJSON(`${this.url+"/one/"+id}`, this.token)
    }

    modifEmailByAdmin(login,id){
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${this.url}/modif/emailAdmin`, {
            method: "POST",
            headers: this.headers,
            body: `login=${login}&id=${id}`
        }).then(res => {
            resolve(res.status)
        }).catch(err => reject(err)))
    }
    modifPasswordByAdmin(password,id){
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${this.url}/modif/passwordAdmin`, {
            method: "POST",
            headers: this.headers,
            body: `password=${password}&id=${id}`
        }).then(res => {
            resolve(res.status)
        }).catch(err => reject(err)))
    }

    getAllRolesUser(id){
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${this.url}/allRoleForAdmin`, {
            method: "POST",
            headers: this.headers,
            body: `id=${id}`
        }).then(res => {
            if (res.status === 200) {
                resolve(res.json())
            } else {
                reject(res.status)
            }
        }).catch(err => reject(err)))
    }

    getAllRolesNotUser(id){
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${this.url}/allRoleNotInUserForAdmin`, {
            method: "POST",
            headers: this.headers,
            body: `id=${id}`
        }).then(res => {
            if (res.status === 200) {
                resolve(res.json())
            } else {
                reject(res.status)
            }
        }).catch(err => reject(err)))
    }

    changeUserRoleByAdmin(roleId,idUser){
        return new Promise((resolve, reject) => fetch(`${this.url}/modifRolePourUnUtilisateurDonne`, {
            method: "POST",
            headers: this.headers,
            body: `roleId=${roleId}&idUser=${idUser}`
        }).then(res => {
            resolve(res.status)
        }).catch(err => reject(err)))
    }

    modifActifByAdmin(actif,id){
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${this.url}/modif/actifAdmin`, {
            method: "POST",
            headers: this.headers,
            body: `actif=${actif}&id=${id}`
        }).then(res => {
            resolve(res.status)
        }).catch(err => reject(err)))
    }

}
