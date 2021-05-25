class Model {
    constructor() {
        this.api = new ListeApi()
        this.apiProduct = new ProduitApi()
        this.apiShared = new SharedApi()
        this.apiUser = new UserAccountAPI()
    }
    async getAllListes(){
        let listes=[]
        for(let liste of await this.api.getAll()){
            liste.date=new Date (liste.date)
            listes.push(Object.assign(new Liste(), liste))
        }
        return listes
    }

    async getListe(id){
        let liste = await this.api.getListe(id)
        liste.date=new Date(liste.date)
        return Object.assign(new Liste(),liste)
    }

    delete(id) {
        return this.api.delete(id)
    }

    insert(liste) {
        return this.api.insert(liste).then(res => res.json())
    }


    update(liste) {
        return this.api.update(liste).then(res => res.status)
    }

    async getProduitByListe(idListe){
        let produits=[]
        for(let produit of await this.apiProduct.getByIdListe(idListe)){
            produits.push(Object.assign(new Produits(), produit))
        }
        return produits
    }

    deleteP(id) {
        return this.apiProduct.delete(id).then(res => res.status)
    }

    async insertP(produit) {
        return this.apiProduct.insert(produit).then(res => res.status)
    }

    updateP(produit) {
        return this.apiProduct.update(produit).then(res => res.status)
    }

    async getProduit(id){
        let produit = await this.apiProduct.getProduit(id)
        return Object.assign(new Produits(),produit)
    }

    //shared
    async insertShared(shared){
        return await this.apiShared.insert(shared).then(res => res.status)
    }

    async getShared(id){
        let shared = await this.apiShared.getShared(id)
        return Object.assign(new Shared(),shared)
    }

    async getSharedByListe(idListe){
        let shareds=[]
        for(let shared of await this.apiShared.getByIdListe(idListe)){
            shareds.push(Object.assign(new Shared(), shared))
        }
        return shareds
    }

    updateShared(shared) {
        return this.apiShared.update(shared).then(res => res.status)
    }

    async getSharedByListe(idListe){
        let shareds=[]
        for(let shared of await this.apiShared.getByIdListe(idListe)){
            shareds.push(Object.assign(new Shared(), shared))
        }
        return shareds
    }

    deleteShared(id) {
        return this.apiShared.delete(id).then(res => res.status)
    }

   async getShareByUser(){
        let sharedListe=[]
        for(let share of await this.apiShared.getAll()) {
            sharedListe.push(Object.assign(new Shared(), share))
        }
        return sharedListe
    }

    async getAllUserNotInShared(idliste){
        let users=[]
        for(let user of await this.apiUser.getAllshared(idliste)){
            users.push(Object.assign(new User(), user))
        }
        return users
    }
    async getAllUser(id){
        let userCache
        for(let user of await this.apiUser.getAll()) {
            if(user.id==id){
                userCache=Object.assign(new User(), user)
            }
        }
        return userCache
    }

    async GetOneByToken(){
        let user=await this.apiUser.GetOneByToken()
        console.log(user)
        let userCache=Object.assign(new User(), user)
        return userCache
    }

}