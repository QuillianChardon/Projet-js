class CompteController extends BaseFormController{
    constructor() {
        super(true)
        this.displayCompte()
        this.svc = new UserAccountAPI()
        this.isAdmin()
        this.doNav("Index","index")
        this.doNav("Compte","compte",true)
        this.doNav("Ajouter une liste","edit")

        this.doNav("Deconnexion","deconnexion")
    }
    async displayCompte(){
       let user=  await this.model.GetOneByToken()
        console.log(user.login)
        $("#fieldEmail").value=user.login
    }

    saveEmail(){
        this.isActive()
        let email=this.valideRequiredField("#fieldEmail",'email')
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
        this.isActive()
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