class Abonnementapi extends BaseAPIService {
    constructor() {
        super("abonnement")
    }
   insertAbonnement(id){
       this.headers.set( 'Content-Type', 'application/x-www-form-urlencoded')
       return fetch(this.url, {
           method: 'POST',
           headers: this.headers,
           body: `id=${id}`
       })
   }
    isPremium(){
        return fetchJSONChange(`${this.url}`, this.token)
    }
}