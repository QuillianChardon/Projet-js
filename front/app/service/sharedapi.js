class SharedApi extends BaseAPIService {
    constructor() {
        super("shared")
    }

    getAll(){
        return fetchJSON(this.url, this.token)
    }


    delete(id){
        this.headers.delete('Content-Type')
        return fetch(`${this.url}/${id}`,{ method: 'DELETE', headers: this.headers })
    }

    getShared(id){
        return fetchJSON(`${this.url}/${id}`, this.token)
    }

    getByIdListe(id){
        return fetchJSON(`${this.url}/liste/${id}`, this.token)
    }

    insert(shared) {
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch(this.url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(shared)
        })
    }

    update(shared) {
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch(this.url, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(shared)
        })
    }



}