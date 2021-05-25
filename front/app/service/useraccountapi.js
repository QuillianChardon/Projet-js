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
}
