class EditController extends BaseFormController{
    constructor() {
        super(true)
        if(indexController.selectListe){
            this.liste=indexController.selectListe
            $("#editTitle").innerText=this.liste.toString()
            $("#fieldName").value=this.liste.nom
            $("#fieldDate").value=this.liste.date.toISOString().substr(0,10)
            indexController.selectListe=null
        }
        this.isAdmin()
        this.isPremium()
        this.doNav("Index","index")
        this.doNav("Compte","compte")
        this.doNav("Ajouter une liste","edit",true)
        this.doNav("Deconnexion","deconnexion")
    }

    async save(){
        this.isActive()
        let nom=this.valideRequiredField("#fieldName",'nom')
        let date=this.valideRequiredField("#fieldDate",'date')
        if(nom !=null && date !=null){
            //gestion numeric
            // price = parseInt(price)
            // if(price < 0){
            //     this.toast("le prix doit être positif")
            //     return
            // }

            date=new Date(date)

            try{
                if(this.liste){
                    this.liste.nom=nom.trim()
                    this.liste.date=new Date(date)
                    this.liste.done=false
                    if(await this.model.update(this.liste)===200){
                        this.toast("modif bien effectué")
                        this.liste=null
                        navigate("index")
                        return
                    }
                }
                else{
                    let flag=false
                    await this.model.isNotPremiumAndOneListe()
                        .then(async e=>{
                            if(e==200){
                                if(await this.model.insert(new Liste(nom,date,false))!==undefined){
                                    this.toast("ajout bien effectué")
                                    navigate("index")
                                    return
                                }
                            }
                        })
                        .catch(err => {
                            this.toast("Qu'une seule liste active en même temps pour les non premium")
                            return
                        })
                    return
                }
                this.displayServiceError()
            }
            catch (e) {
                console.log(e)
                this.displayServiceError()
            }

        }
    }
}
window.editController = new EditController()