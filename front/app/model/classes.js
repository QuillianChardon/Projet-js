// Business classes definitions

class Liste{
    constructor(nom,date, done,product = []) {
        this.nom = nom
        this.date = date
        this.done = done
        this.product = product
    }

    toString(){
        const date= this.date.toLocaleDateString()
        return `${this.nom} du ${date}`
    }
}


class Produits {
    constructor(idListe,nom,quantite,done) {
        this.idListe = idListe
        this.nom = nom
        this.quantite = quantite
        this.done=done
    }
    toString(){
        return `${this.nom} x ${this.quantite}`
    }
}

class Shared{
    constructor(idListe,idUser,droit) {
        this.idListe=idListe
        this.idUser=idUser
        this.droit=droit
    }
    toString(){
        return `${this.idUser}`
    }
}

class User{
    constructor(id,login) {
        this.id=id
        this.login=login
    }
}

class UserInfo{
    constructor(id,login,displayname,active) {
        this.id=id
        this.login=login
        this.displayname=displayname
        this.active=active
    }
}

class Role{
    constructor(id,name) {
        this.id=id
        this.name=name
    }
}

class Notification{
    constructor(id,idUser,titre,texte,vue,date) {
        this.id=id
        this.idUser=idUser
        this.titre=titre
        this.texte=texte
        this.vue=vue
        this.date=date
    }
}

class TypePayment{
    constructor(id,nom,icon) {
        this.id=id
        this.nom=nom
        this.icon=icon
    }
}

class Abonnement{
    constructor(id,idTypePayment,idUser,date) {
        this.id=id
        this.idTypePayment=idTypePayment
        this.idUser=idUser
        this.date=date
    }
}
