class TypePaymentapi extends BaseAPIService {
    constructor() {
        super("typepayment")
    }
    getAll(){
        return fetchJSON(this.url, this.token)
    }

    getIdType(name){
        return fetchJSON(this.url+"/"+name, this.token)
    }

    getType(id){
        return fetchJSON(this.url+"/id/"+id, this.token)
    }
}