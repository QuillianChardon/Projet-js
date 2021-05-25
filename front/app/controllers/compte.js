class CompteController extends BaseFormController{
    constructor() {
        super(true)
        this.displayCompte()
        this.svc = new UserAccountAPI()
    }
    async displayCompte(){
       let user=  await this.model.GetOneByToken()
        console.log(user.login)
        $("#fieldEmail").value=user.login
    }

    saveEmail(){
        let email=this.valideRequiredField("#email",'email')
        this.svc.modifEmail(email)
            .then(res => {
                localStorage.setItem("token", res.token)
                this.toast("Modification réussi")
            })
            .catch(err => {
                console.log(err)
                if (err == 401) {
                    this.toast("Adresse e-mail deja prise")
                }
                else {
                    this.displayServiceError()
                }
            })
    }

    savePassword(){
        let password=this.valideRequiredField("#fieldPassword",'password')
        let repeatPassword=this.valideRequiredField("#fieldPassword1",'Repeter le password')
        if(password!=repeatPassword){
            this.toast("Mot de passe différent")
        }
        this.svc.modifPassword(password)
            .then(res => {
                if(res== 200){
                    this.toast("Modification réussi")
                }
                else{
                    this.displayServiceError()
                }

            })
            .catch(err => {
                console.log(err)

            })
    }
}

window.compteController = new CompteController()