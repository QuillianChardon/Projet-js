class PremiumController extends BaseFormController {
    constructor() {
        super(true)
        this.isAdmin()
        this.isPremium(true)
        this.doNav("Index", "index")
        this.doNav("Compte", "compte")
        this.doNav("Ajouter une liste", "edit")

        this.doNav("Deconnexion", "deconnexion")
        this.displayForm()
    }

    async displayForm(){
        for(const liste of await this.model.getAllPaymentType()){
            $("#allPaymentType").innerHTML+=`<span onclick='premiumController.changeActive("${liste.nom}")'>${liste.icon}</span>`
        }
    }

    changeActive(id){
        console.log(id)
        var forms = document.querySelectorAll('.form'), i;

        for (i = 0; i < forms.length; ++i) {
            forms[i].classList.remove("d_show");
        }
        console.log(document.getElementById(id))
        document.getElementById(id).classList.add("d_show");
        document.getElementById(id).classList.remove("d_none");
    }
    async savePremium(){

        let flag=false
        let name=$(".d_show").attributes.id.value
        let object = await this.model.getIdType(name)
        let id=object.id
        //paypal
        if(id==1){
            if($("#FieldPaypalMail").value=="" || $("#FieldPaypalPassword").value==""){
                flag=true
                this.toast("Les champs sont mal remplis")
            }
        }
        //cb
        else if(id==2){

            if($("#FieldName").value=="" || $("#FieldCB").value=="" || $("#FieldMonth").value=="" || $("#FieldCVS").value==""){
                flag=true
                this.toast("Les champs sont mal remplis")
            }
            else if($("#FieldCB").value.length!=16){
                flag=true
                this.toast("Le champs code de la carte n'est pas au normes")
            }
            else if($("#FieldCVS").value.length!=3){
                flag=true
                this.toast("Le champs code secrét de la carte n'est pas au normes")
            }
        }
        //stripe
        else{
            if($("#FieldStripeMail")=="" || $("#FieldStripePassword")==""){
                flag=true
                this.toast("Les champs sont mal remplis")
            }
        }

        if(!flag){
            switch (await this.model.savePayment(id)){
                case 200:
                    navigate("index","","Votre premium est maintenant actif")
                    break;
                case 500:
                    this.toast("Error lors du payment vous n'allez pas être débité")
                    break;
            }
        }
    }
}
window.premiumController = new PremiumController()