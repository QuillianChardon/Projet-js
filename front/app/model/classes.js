// Business classes definitions

class Liste{
    constructor(nom,date, done,product = []) {
        this.nom = nom
        this.date = date
        this.done = done
        this.product = product
    }

    toString(){
        return `${this.nom} du ${this.date}`
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
        return `${this.nom} ${this.quantite}`
    }
}

class Shared{
    constructor(idListe,idUser,droit) {
        this.idListe=idListe
        this.idUser=idUser
        this.droit=droit
    }
    toString(){
        return `${this.idUser} ${this.droit}`
    }
}

class User{
    constructor(id,login) {
        this.id=id
        this.login=login
    }
}