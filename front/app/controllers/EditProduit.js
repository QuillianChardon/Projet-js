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
        this.isAdmin()
        this.doNav("Index","index")
        this.doNav("Compte","compte")
        this.doNav("Ajouter une liste","edit")
        this.doNav("Deconnexion","deconnexion")
    }

    async save(){
        let nom=this.valideRequiredField("#fieldName",'nom')
        let quantite=this.valideRequiredField("#fieldQtt",'quantite')
        if(nom !=null && quantite !=null && indexController.idListe!=undefined){
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
                    this.produit.idliste=indexController.idListe
                    this.produit.idListe=indexController.idListe

                    if(await this.model.updateP(this.produit)===200){
                        this.toast("modif bien effectué")
                        this.produit=null
                        navigate("index",indexController.idListe)
                        return
                    }
                }
                else{
                    console.log(indexController.idListe)
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

