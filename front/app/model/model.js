class Model {
    constructor() {
        this.api = new ListeApi()
        this.apiProduct = new ProduitApi()
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

    insertP(produit) {
        return this.apiProduct.insert(produit).then(res => res.status)
    }

    updateP(produit) {
        return this.apiProduct.update(produit).then(res => res.status)
    }

    async getProduit(id){
        let produit = await this.apiProduct.getProduit(id)
        return Object.assign(new Produits(),produit)
    }


}