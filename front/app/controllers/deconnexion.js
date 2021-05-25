class DeconnexionController extends BaseFormController {
    constructor() {
        super(true)
        localStorage.clear();
        window.location.replace("login.html")
    }
}

window.deconnexionController = new DeconnexionController()