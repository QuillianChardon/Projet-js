class ChangeMDPController extends BaseFormController {
    constructor() {
        super(false)
        this.svc = new UserAccountAPI()
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if(urlParams.has('token')){
            const token = urlParams.get('token')
            $("#champs").innerHTML=` <div class="row">
            <form class="col s12" id="formLogin">
                <div class="row">
                    <div class="input-field col s12">
                        <input id="fieldPassword" type="password" class="validate" >
                        <label for="fieldPassword" class="active">Mot de passe</label>
                    </div>
                    <div class="input-field col s12">
                        <input id="fieldPassword2" type="password" class="validate">
                        <label for="fieldPassword2" class="active">Validation mot de passe</label>
                    </div>
                </div>
            </form>
        </div>
        <div class="row">
            <button class="waves-effect waves-light btn" onclick="changeMDPController.validate('${token}')"><i class="material-icons right">check</i>Modifier mot de passe</button>
        </div>`
        }
    }

    async sendMail(){
        let login = this.valideRequiredField("#fieldLogin",'login')
        if(login !=null){
            await this.svc.sendResetPasswordByLogin(login)
                .then(e=>{
                    if(e==200){
                        this.toast("Mail envoyé")
                        return
                    }
                })
                .catch(e=>{
                    if(e==404){
                        this.toast("Utilisateur pas trouvé")
                        return
                    }
                    else{
                        this.displayServiceError()
                    }
                })

        }
        else{
            this.displayServiceError()
        }
    }

    async validate(token){
        let password = this.valideRequiredField("#fieldPassword",'mot de passe')
        let password2 = this.valideRequiredField("#fieldPassword2",'mot de passe validation')
        if(password !=null && password2 != null){
            if (password==password2){
                if(await this.svc.getValidationChangePassword(token,password)){
                    this.toast("modification effectué")
                }
                else{
                    this.toast("mail expriré")
                }
            }
        }

    }



}
window.changeMDPController = new ChangeMDPController()