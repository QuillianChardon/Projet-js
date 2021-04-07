class InscriptionController extends BaseFormController {
    constructor() {
        super(false)
        this.svc = new UserAccountAPI()
    }
    inscription(){

        let login = this.valideRequiredField('#fieldLogin', 'Login')
        let password = this.valideRequiredField('#fieldPassword', 'Mot de passe')
        let passwordVerif = this.valideRequiredField('#fieldPassword2', 'Mot de passe verif')
        let pseudo = this.valideRequiredField('#fieldNom', 'pseudo')

        if(password==passwordVerif){
            if ((login != null) && (password != null) && (pseudo!= null)) {

                this.svc.inscription(login, password,pseudo)
                    .then(res => {
                        if(res==200){
                            this.toast("inscription réussi il faut valider le compte via le lien dans le mail")
                            $("#fieldLogin").value=""
                            $("#fieldPassword").value=""
                            $("#fieldPassword2").value=""
                            $("#fieldNom").value=""
                        }
                        else{
                            this.toast("Adresse e-mail deja prise")
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        this.displayServiceError()

                    })
            }
        }

    }
}

window.inscriptionController = new InscriptionController()
