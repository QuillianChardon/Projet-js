const produitServiceBaseUrl ="http://localhost:3333/produit"

class ProduitApi{
    getAll(){
        return fetchJSON(produitServiceBaseUrl)
    }
    delete(id){
        return fetch(`${produitServiceBaseUrl}/${id}`,{method:'DELETE'})
    }
    getProduit(id){
        return fetchJSON(`${produitServiceBaseUrl}/${id}`)
    }
    getByIdListe(id){
        return fetchJSON(`${produitServiceBaseUrl}/liste/${id}`)
    }
    insert(produit) {
        return fetch(produitServiceBaseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(produit)
        })
    }


    update(produit) {
        return fetch(produitServiceBaseUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(produit)
        })
    }
}