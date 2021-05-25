class CompteController extends BaseFormController {
    constructor() {
        super(true)
        this.displayCompte()
        this.svc = new UserAccountAPI()
        this.doNav("Index", "index")
        this.doNav("Ajouter une liste", "edit")
        this.doNav("Deconnexion", "??")
    }
}