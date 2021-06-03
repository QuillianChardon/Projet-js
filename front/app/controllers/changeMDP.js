class ChangeMDPController extends BaseFormController {
    constructor() {
        super(false)
        this.svc = new UserAccountAPI()
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if(urlParams.has('token')){
            const token = urlParams.get('token')
            $("#champs").innerHTML=` 
            
            <label id="marginBot">
                <span>Mot de passe</span>
                <input id="fieldPassword" type="password"  >
            </label>
            <label id="marginBot">
                <span>Validation mot de passe</span>
                <input id="fieldPassword2" type="password">
            </label>
            <span id="relatSpan">
                    <p class="forgot-pass" onclick="window.location.replace('login.html')">Connexion ?</p>
                </span>
            <div class="row">
                <button class="submit" onclick="changeMDPController.validate('${token}')"><i class="fas fa-check"></i>Changer le nom mdp</button>
            </div>`

            $("#ChampsReponsive").innerHTML=` 
            <label id="marginBot">
                <span>Mot de passe</span>
                <input id="fieldPasswordResponsive" type="password"  >
            </label>
            <label id="marginBot">
                <span>Validation mot de passe</span>
                <input id="fieldPassword2Responsive" type="password">
            </label>
            <span id="relatSpan">
                    <p class="forgot-pass" onclick="window.location.replace('login.html')">Connexion ?</p>
                </span>
            <div class="row">
                <button class="submit" onclick="changeMDPController.validate('${token}')"><i class="fas fa-check"></i>Changer le nom mdp</button>
            </div>`
            document.getElementById("fieldPassword2").addEventListener("change", function (){
                document.getElementById("fieldPassword2Responsive").value=this.value
            });
            document.getElementById("fieldPassword2Responsive").addEventListener("change", function (){
                document.getElementById("fieldPassword2").value=this.value
            });
            document.getElementById("fieldPassword").addEventListener("change", function (){
                document.getElementById("fieldPasswordResponsive").value=this.value
            });
            document.getElementById("fieldPasswordResponsive").addEventListener("change", function (){
                document.getElementById("fieldPassword").value=this.value
            });
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