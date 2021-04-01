class BaseController {
    constructor(secured) {
        if(secured) this.checkAuthentification()
        M.AutoInit();
        this.setBackButtonView('index')
        this.model = new Model()
    }
    toast(msg) {
        M.toast({html: msg, classes: 'rounded'})
    }
    displayServiceError() {
        this.toast('Service injoignable ou problème réseau')
    }
    displayNotFoundError(type){
        this.toast(type+' non trouvé')
    }
    getModal(selector) {
        return M.Modal.getInstance($(selector))
    }
    setBackButtonView(view) {
        window.onpopstate = function() {
            navigate(view)
        }; history.pushState({}, '');
    }
    displayConfirmDelete(object,onclick){
        if(object===undefined){
            this.displayServiceError()
            return
        }
        if(object ===null){
            this.displayNotFoundError(typeof object)
            return;
        }

        $("#objectDelet").innerHTML=object.toString()
        $("#btnDelet").onclick=onclick
        this.getModal("#modalConformDelet").open()
    }
    displayDeletedMessage(onUndo){
        this.toast( `<span>Supression effectuée</span><button class="btn-flat toast-action" onclick="${onUndo}">Annuler</button>`)
    }
    displayUndoDone() {
        this.toast('Opération annulée')
    }

    checkAuthentification(){
        if (localStorage.getItem("token") === null) {
            window.location.replace("login.html")
        }
    }
}
