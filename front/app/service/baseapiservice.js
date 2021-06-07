const serviceBaseUrl = "http://ec2-18-208-186-244.compute-1.amazonaws.com:3333"

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