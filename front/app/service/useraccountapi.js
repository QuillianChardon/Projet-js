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

    reSendMailValidation(login){
        return fetchJSON(`${this.url}/sendMail/${login}`)
    }
}
