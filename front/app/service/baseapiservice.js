const serviceBaseUrl = "http://localhost:3333"

class BaseAPIService {
    constructor(url) {
        this.url = `${serviceBaseUrl}/${url}`
        this.token = localStorage.getItem("token")
        this.headers = new Headers()
        if (this.token !== undefined) {
            this.headers.append("Authorization", `Bearer ${this.token}`)
        }
    }
}