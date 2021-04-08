class LoginController extends BaseFormController {
    constructor() {
        super(false)
        this.svc = new UserAccountAPI()
    }
    async authenticate() {
        let login = this.valideRequiredField('#fieldLogin', 'Adresse e-mail')
        let password = this.valideRequiredField('#fieldPassword', 'Mot de passe')
        if ((login != null) && (password != null)) {
            this.svc.authenticate(login, password)
                .then(res => {
                    localStorage.setItem("token", res.token)
                    window.location.replace("index.html")
                })
                .catch(err => {
                    console.log(err)
                    if (err == 401) {
                        this.toast("Adresse e-mail ou mot de passe incorrect")
                    }
                    else if(err == 406){
                        this.toast(`Compte non verifié <button class=\"waves-effect waves-light btn\" onclick='loginController.resendMe("${login}")'>redemander le lien</button>`)
                    }
                    else {
                        this.displayServiceError()
                    }
                })
        }
    }

    resendMe(login) {
        console.log("ici")
        this.svc.reSendMailValidation(login)
    }
}

window.loginController = new LoginController()
