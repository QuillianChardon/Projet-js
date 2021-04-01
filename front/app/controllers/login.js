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
                    } else {
                        this.displayServiceError()
                    }
                })
        }
    }
}

window.loginController = new LoginController()
