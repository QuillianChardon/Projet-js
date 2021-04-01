class EditProduitController extends BaseFormController{
    constructor() {
        super(true)
        if(indexController.selectProduit){
            this.produit=indexController.selectProduit
            $("#editTitle").innerText=this.produit.toString()
            $("#fieldName").value=this.produit.nom
            $("#fieldQtt").value=this.produit.quantite
            indexController.selectProduit=null
        }
    }

    async save(){
        let nom=this.valideRequiredField("#fieldName",'nom')
        let quantite=this.valideRequiredField("#fieldQtt",'quantite')
        if(nom !=null && quantite !=null){
            quantite = parseInt(quantite)
            console.log(quantite)
            if(quantite <= 0){
                this.toast("la quantite doit être positif")
                $("#fieldQtt").style.backgroundColor = 'antiquewhite'
                return
            }
            try{
                if(this.produit){
                    this.produit.nom=nom.trim()
                    this.produit.quantite=quantite
                    this.produit.done=false
                    if(await this.model.updateP(this.produit)===200){
                        this.toast("modif bien effectué")
                        this.produit=null
                        navigate("index",indexController.idListe)
                        return
                    }
                }
                else{
                    if(await this.model.insertP(new Produits(indexController.idListe,nom,quantite,false))===200){
                        this.toast("ajout bien effectué")
                        navigate("index",indexController.idListe)
                        return
                    }
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
window.editProduitController = new EditProduitController()

