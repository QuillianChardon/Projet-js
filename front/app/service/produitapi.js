class ProduitApi extends BaseAPIService{
    constructor() {
        super("produit")
    }

    getAll(){
        return fetchJSON(this.url, this.token)
    }

    delete(id){
        this.headers.delete('Content-Type')
        return fetch(`${this.url}/${id}`,{ method: 'DELETE', headers: this.headers })
    }

    getProduit(id){
        return fetchJSON(`${this.url}/${id}`, this.token)
    }

    getByIdListe(id){
        return fetchJSON(`${this.url}/liste/${id}`, this.token)
    }

    insert(produit) {
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch(this.url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(produit)
        })
    }

    update(produit) {
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch(this.url, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(produit)
        })
    }
}