class VerifController extends BaseController {
    constructor() {
        super(false)
        this.svc = new UserAccountAPI()
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if(urlParams.has('token')){
            this.toast("validation en cours")
            const token = urlParams.get('token')
            this.veriftoken(token)

        }
        else{
            window.location.replace('login.html')
        }
    }

    async veriftoken(token){
        let result = await this.svc.getValidation(token)
        if(result.login!==undefined) {
            localStorage.setItem("token", result.login)
            window.location.replace("index.html")
        }
        else{
            this.toast("mail expriré")
        }
    }


}
window.verifController = new VerifController()