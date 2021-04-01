class ListeApi extends BaseAPIService{
    constructor() {
        super("liste")
    }
    getAll() {
        return fetchJSON(this.url, this.token)
    }
    delete(id){
        this.headers.delete('Content-Type')
        return fetch(`${this.url}/${id}`,{ method: 'DELETE', headers: this.headers })
    }
    getListe(id) {
        return fetchJSON(`${this.url}/${id}`, this.token)
    }
    insert(liste) {
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch(this.url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(liste)
        })
    }
    update(liste) {
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch(this.url, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(liste)
        })
    }

}