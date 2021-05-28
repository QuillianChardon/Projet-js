class BaseController {
    constructor(secured) {
        this.model = new Model()
        if(secured) this.checkAuthentification()
        M.AutoInit();
        this.setBackButtonView('index')

        this.msg=""
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

    async checkAuthentification(){
        if (localStorage.getItem("token") === null) {
            window.location.replace("login.html")
        }
        else{
            this.isActive()
        }
    }

    doNav(Elem,link,isActive){
        if(isActive){
            $("#nav-mobile").innerHTML+=`<li><a class="link_anim" onclick='navigate("${link}")'>${Elem}</a></li>`
        }
        else{
            $("#nav-mobile").innerHTML+=`<li><a class="link_anim_hover" onclick='navigate("${link}")'>${Elem}</a></li>`
        }
        $("#mobile-demo").innerHTML+=`<li><a  onclick='navigate("${link}")'>${Elem}</a></li>`
    }

    async isAdmin(isActive=false){
        let flag=false
        await this.model.isAdmin()
            .then(flag=true)
            .catch(err => {
                console.log(err)
                flag=false
            })

        if(flag==true){
            if(isActive){
                this.doNav("Administration", "admin",true)
            }
            else{
                this.doNav("Administration", "admin")
            }

        }
    }

    async isActive(){
        let flag=false
        await this.model.isActive()
            .then(flag=false)
            .catch(err => {
                console.log(err)
                flag=true
            })
        if(flag==true){
            localStorage.clear();
            window.location.replace("login.html")
        }
    }

}