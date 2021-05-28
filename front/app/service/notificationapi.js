class NotificationApi extends BaseAPIService {
    constructor() {
        super("notification")
    }
    getAllNotSeen() {
        return fetchJSON(this.url+"/notseen", this.token)
    }

    markAsReadNotif(id){
        this.headers.set( 'Content-Type', 'application/x-www-form-urlencoded' )
        return fetch(this.url+"/seen", {
            method: 'PUT',
            headers: this.headers,
            body:`id=${id}`
        })
    }

    saveNotif(id,texte,titre){
        this.headers.set( 'Content-Type', 'application/x-www-form-urlencoded' )
        return fetch(this.url, {
            method: 'POST',
            headers: this.headers,
            body:`id=${id}&texte=${texte}&titre=${titre}`
        })
    }
}