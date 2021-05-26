class AdminController extends BaseFormController {
    constructor() {
        super(true)
        this.isAdmin(true)
        this.doNav("Index","index")
        this.doNav("Compte","compte")
        this.doNav("Ajouter une liste","edit")
        this.doNav("Deconnexion","deconnexion")
    }
}
window.adminController = new AdminController()