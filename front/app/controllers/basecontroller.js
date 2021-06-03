
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



    doNav(Elem,link,isActive,specialLink=""){
        if(specialLink!=""){
            $("#nav-mobile").innerHTML=`<li id="NotifForDelete"><a class="link_anim_hover" onclick='${specialLink}'>${Elem}</a></li>`+$("#nav-mobile").innerHTML
            $("#mobile-demo").innerHTML=`<li id="NotifForDeleteResponsive"><a  onclick='${specialLink}'>${Elem}</a></li>`+ $("#mobile-demo").innerHTML
        }
        else{
            if(isActive){
                $("#nav-mobile").innerHTML+=`<li><a class="link_anim" onclick='navigate("${link}")'>${Elem}</a></li>`
            }
            else{
                $("#nav-mobile").innerHTML+=`<li><a class="link_anim_hover" onclick='navigate("${link}")'>${Elem}</a></li>`
            }
            $("#mobile-demo").innerHTML+=`<li><a  onclick='navigate("${link}")'>${Elem}</a></li>`
        }

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

    async checkAuthentification(){
        if (localStorage.getItem("token") === null) {
            window.location.replace("login.html")
        }
        else{
            this.isActive()
            this.checknotif()
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
            clearInterval(this.Notification);
            localStorage.clear();
            window.location.replace("login.html")
        }
    }

    async  checknotif(){
        let notifHTML=""
        let cpt=0
        for(const notification of await this.model.getAllNotificationNotSeen()){
            console.log(notification)
            notification.texte=notification.texte.replaceAll('\n', '<br>')
            notifHTML+=`<div class="alert" role="alert">
              <span class="flexNotif">
                    <h4 class="alert-heading">${notification.titre}</h4>
                    <span>${notification.date.toLocaleDateString()}</span>
              </span>
              <hr class="separatorAlert">
              <p class="mb-0">${notification.texte}</p>
             <span class="flexNotifVue"> <span class="badge rounded-pill bg-secondColor" onclick="readNotif(${notification.id})">Vue</span></span>
            </div>`
            cpt++
        }
        if(cpt>0){
            if($("#NotifForDelete")!==null){
                $("#NotifForDelete").remove()
            }
            if($("#NotifForDeleteResponsive")!==null){
                $("#NotifForDeleteResponsive").remove()
            }
            $('#tableNotifscontent').innerHTML=notifHTML
            this.doNav("<i class=\"fas fa-bell\"></i>"+cpt, "",false,"openAllNotif()")
        }
        else{
            if($("#NotifForDelete")!==null){
                $("#NotifForDelete").remove()
            }
            if($("#NotifForDeleteResponsive")!==null){
                $("#NotifForDeleteResponsive").remove()
            }
        }
        return cpt
    }


    async isPremium(isActive=false){
        console.log("ici")
        let flag=false
        await this.model.isPremium()
            .then(flag=true)
            .catch(err => {
                console.log(err)
                flag=false
            })

        if(flag==true){
            if(isActive){
                this.doNav("Devenir premium", "premium",true)
            }
            else{
                this.doNav("Devenir premium", "premium")
            }
        }
    }

}

function openAllNotif(){
    baseC= new BaseController(true)
    baseC.getModal("#modalNotifDisplay").open()
}
async function readNotif(id){
    baseC= new BaseController(true)
    switch (await baseC.model.markAsReadNotif(id)){
        case 200 :
           baseC.toast("Notification bien lu")
            if(await baseC.checknotif()>0){
                openAllNotif()
            }
            break
        case 404 :
            baseC.displayNotFoundError("Notification")
            break
        default:
            baseC.displayServiceError()
            break
        }

}