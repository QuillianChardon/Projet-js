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
                if (res.status === 401) {
                    reject(res.status)
                    localStorage.clear();
                    window.location.replace("login.html")
                }
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
            if (res.status === 200) {
                resolve(res.status)
            } else {
                if (res.status === 401) {
                    reject(res.status)
                    localStorage.clear();
                    window.location.replace("login.html")
                }
                reject(res.status)
            }
        }).catch(err => reject(err)))
    }



    getValidation(token){
        return fetchJSON(`${this.url}/token/${token}`)
    }

    getValidationChangePassword(token,password){
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${this.url}/modificationPassword`, {
            method: "PUT",
            headers: this.headers,
            body: `token=${token}&password=${password}`
        }).then(res => {
            if (res.status === 200) {
                resolve(res.status)
            } else {
                if (res.status === 401) {
                    reject(res.status)
                    localStorage.clear();
                    window.location.replace("login.html")
                }
                reject(res.status)
            }
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
            method: "PUT",
            headers: this.headers,
            body: `login=${login}`
        }).then(res => {
            if (res.status === 200) {
                resolve(res.json())
            } else {
                if (res.status === 401) {
                    reject(res.status)
                    localStorage.clear();
                    window.location.replace("login.html")
                }
                reject(res.status)
            }
        }).catch(err => reject(err)))
    }

    modifPassword(password){
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${this.url}/modif/password`, {
            method: "PUT",
            headers: this.headers,
            body: `password=${password}`
        }).then(res => {
            if (res.status === 200) {
                resolve(res.status)
            } else {
                if (res.status === 401) {
                    reject(res.status)
                    localStorage.clear();
                    window.location.replace("login.html")
                }
                reject(res.status)
            }
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
            method: "PUT",
            headers: this.headers,
            body: `login=${login}&id=${id}`
        }).then(res => {
            if (res.status === 200) {
                resolve(res.status)
            } else {
                if (res.status === 401) {
                    reject(res.status)
                    localStorage.clear();
                    window.location.replace("login.html")
                }
                reject(res.status)
            }
        }).catch(err => reject(err)))
    }
    modifPasswordByAdmin(password,id){
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${this.url}/modif/passwordAdmin`, {
            method: "PUT",
            headers: this.headers,
            body: `password=${password}&id=${id}`
        }).then(res => {
            if (res.status === 200) {
                resolve(res.status)
            } else {
                if (res.status === 401) {
                    reject(res.status)
                    localStorage.clear();
                    window.location.replace("login.html")
                }
                reject(res.status)
            }
        }).catch(err => reject(err)))
    }

    getAllRolesUser(id){
        return fetchJSON(`${this.url+"/allRoleForAdmin/"+id}`, this.token)
    }
    getAllRolesNotUser(id){
        return fetchJSON(`${this.url+"/allRoleNotInUserForAdmin/"+id}`, this.token)
    }


    changeUserRoleByAdmin(roleId,idUser){
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${this.url}/modifRolePourUnUtilisateurDonne`, {
            method: "PUT",
            headers: this.headers,
            body: `roleId=${roleId}&idUser=${idUser}`
        }).then(res => {
            if (res.status === 200) {
                resolve(res.status)
            } else {
                if (res.status === 401) {
                    reject(res.status)
                    localStorage.clear();
                    window.location.replace("login.html")
                }
                reject(res.status)
            }
        }).catch(err => reject(err)))
    }



    ActiveUser(id){
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${this.url}/modif/actifAdmin`, {
            method: "PUT",
            headers: this.headers,
            body: `id=${id}`
        }).then(res => {
            if (res.status === 200) {
                resolve(res.status)
            } else {
                if (res.status === 401) {
                    reject(res.status)
                    localStorage.clear();
                    window.location.replace("login.html")
                }
                reject(res.status)
            }
        }).catch(err => reject(err)))
    }


    isActive(){
        return fetchJSONChange(`${this.url}/isActive`, this.token)
    }

    getById(id){
        return fetchJSON(`${this.url}/idUser/${id}`, this.token)
    }

    changeMDPByAdminMail(id){
        return fetchJSONChange(`${this.url}/changeMDPByAdminMail/`+id, this.token)
    }

}
