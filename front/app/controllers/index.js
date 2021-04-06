class IndexController extends BaseController {
    constructor() {
        super(true)
        this.tableListe=$('#tableListe')
        this.tablebody=$('#tableBody')
        this.tableBodyOff=$('#tableBodyOff')
        this.archive=$('#archive')
        this.displayAllListe()
        this.getlock()
    }

    async displayAllListe(){
        this.tableListe.style.display="none"
        try{
            let contentOn=''
            let contentOff=''
            for(const liste of await this.model.getAllListes()){
                const date= liste.date.toLocaleDateString()
                let cpt=0
                for(const Share of await this.model.getSharedByListe(liste.id)) {
                    cpt++

                }
                if(liste.done==true){
                    contentOn+="<tr onclick='indexController.AfficheProduit("+liste.id+")'><td>"+liste.nom+"<td>"+date+"<button onclick='indexController.shared("+liste.id+",event)' disabled class=\"waves-effect waves-light btn disabledQC\"><i class=\"fa fa-share-alt\"></i></button><button onclick='indexController.displayConfirmDelete("+liste.id+")' class=\"waves-effect waves-light btn\">suppr</button> <button onclick='indexController.edit("+liste.id+")' class=\"waves-effect waves-light btn disabledQC\" disabled '>modif</button> <button onclick='indexController.afficheShared("+liste.id+",event)' class=\"waves-effect waves-light btn \" '><i class=\"fa fa-user\">"+cpt+"</i></button>"
                }
                else{
                    contentOff+="<tr onclick='indexController.AfficheProduit("+liste.id+")'><td>"+liste.nom+"<td>"+date+"<button onclick='indexController.shared("+liste.id+",event)' class=\"waves-effect waves-light btn\"><i class=\"fa fa-share-alt\"></i></button> <button onclick='indexController.displayConfirmDelete("+liste.id+")' class=\"waves-effect waves-light btn\">suppr</button> <button onclick='indexController.edit("+liste.id+")' class=\"waves-effect waves-light btn\">modif</button> <button onclick='indexController.afficheShared("+liste.id+",event)' class=\"waves-effect waves-light btn \" '><i class=\"fa fa-user\">"+cpt+"</i></button>"
                }
            }
            this.refreshDisable()
            this.tablebody.innerHTML=contentOff
            this.tableListe.style.display="block"
            this.tableBodyOff.innerHTML=contentOn
            this.archive.style.display="block"
        }catch (e) {
            console.log(e)
            this.displayServiceError()
        }
    }



    async shared(id,event){
        //partage de la liste
        event.stopPropagation();
        this.getModal("#modalShared").open()
        let result="<table className=\"stripped responsive-table\" style=\"display: none\">"
        let userLogin = ""

        $("#addUserShared").setAttribute("onclick","indexController.addShared("+id+")")

        for(const user of await this.model.getAllUserNotInShared(id)){
            console.log(user)
            if(this.shared.idLogin==user.id){
                userLogin+="<option selected value='"+user.id+"'>"+user.login+"</option>"
            }
            else{
                userLogin+="<option value='"+user.id+"'>"+user.login+"</option>"
            }
        }
        $("#listeUser").innerHTML += userLogin

        M.FormSelect.init($("#listeUser"));
    }

    async addShared(idListe){

        let droit =$("#checkedDroit").checked
        let user=$("#listeUser").value

        console.log(droit)
        console.log(user)
        if(user==-1){
            return
        }

        if(await this.model.insertShared(new Shared(idListe,user,droit))===200){
            this.toast("ajout bien effectué")
            navigate("index",indexController.idListe)
            return
        }
        else{
            this.displayServiceError()
        }
    }

    async changeShard(id){
        let shared = await this.model.getShared(id)
        shared.droit =$("#checkedDroit"+id).checked
        if(await this.model.updateShared(shared)===200){
            this.toast("modif bien effectué")
            if($("#texteCheckboxChange").innerText=="modification"){
                $("#texteCheckboxChange").innerText = "visualisation"
            }
            else{
                $("#texteCheckboxChange").innerText = "modification"
            }
        }
        else{
            this.displayServiceError()
        }
    }

   async afficheShared(id,event){
        if(event!=null){
            event.stopPropagation();
        }
       let sharedResult=""
       let droit = ""
       let user
        for(const shared of await this.model.getSharedByListe(id)){
            if(shared.droit){
                droit=" <label > <input type='checkbox' checked id='checkedDroit"+shared.id+"' onclick='indexController.changeShard("+shared.id+")'> <span id='texteCheckboxChange'>modification</span></label>"
            }
            else{
                droit=" <label > <input type='checkbox' id='checkedDroit"+shared.id+"' onclick='indexController.changeShard("+shared.id+")'/> <span id='texteCheckboxChange'>visualisation</span></label>"
            }
            user = await this.model.getAllUser(shared.iduser)
            console.log(user)
            sharedResult+="<tr><td>"+user.login+"</td><td>"+droit+"<button onclick='indexController.displayConfirmDeleteShared("+shared.id+")' class=\"waves-effect waves-light btn\">suppr</button></td>"
        }
        $("#tableSharedcontent").innerHTML=sharedResult
       this.getModal("#modalSharedDisplay").open()
    }

    async edit(id){
        try{
            const object = await this.model.getListe(id)
            if(object === undefined){
                this.displayServiceError()
                return
            }
            if(object==null){
                this.displayNotFoundError()
                return
            }
            this.selectListe = object
            navigate("edit")
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

    async editProduit(id){
        try{
            const object = await this.model.getProduit(id)
            if(object === undefined){
                this.displayServiceError()
                return
            }
            if(object==null){
                this.displayNotFoundError()
                return
            }
            this.selectProduit = object
            navigate("editProduit")
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

   async checkItems(id){
        const object = await this.model.getProduit(id)
        if(object === undefined){
            this.displayServiceError()
            return
        }
        if(object==null){
            this.displayNotFoundError()
            return
        }
       console.log(object)
        if(object.done){
            object.done=false
        }
        else{
            object.done=true
        }
        console.log(object)
       if(await this.model.updateP(object)===200) {
           let flag = false
           const liste = await this.model.getListe(object.idliste)
           for (const produit of await this.model.getProduitByListe(object.idliste)) {
               if (produit.done == false) {
                   flag = true
               }
           }
           if (flag) {
               liste.done = false
           }
           else{
               liste.done = true
           }
           if (await this.model.update(liste) === 200) {
               this.toast("modif bien effectué")
           }
           else{
               this.displayServiceError()
           }
           this.displayAllListe()
           this.AfficheProduit(liste.id)
       }
        else{
           this.displayServiceError()
       }
    }

    async AfficheProduit(id){
        this.idListe=id
        try{
            const object = await this.model.getListe(id)
            let result=""
            let param=""
            let classAdd=""
            if(object.done){
                $("#addProduct").disabled = true;
                param="disabled"
                classAdd="disabledQC"
            }
            else{
                $("#addProduct").disabled = false;
                param=""
                classAdd=""
            }
            for(const produit of await this.model.getProduitByListe(id)){
                let doneStatus=""

                if(produit.done){
                     doneStatus = "<label><input type='checkbox' class='filled-in "+classAdd+"' checked onclick='indexController.checkItems("+produit.id+")' "+param+"/> <span>valider</span></label>"
                }
                else{
                     doneStatus = "<label><input type='checkbox' class='filled-in' onclick='indexController.checkItems("+produit.id+")'/> <span>valider</span></label>"
                }
                if(object.done==true){
                    result+="<a class='collection-item'>"+produit.nom+" x "+produit.quantite+" <button onclick='indexController.displayConfirmDeleteProduit("+produit.id+")' class='waves-effect waves-light btn "+classAdd+"' disabled>suppr</button> <button onclick='indexController.editProduit("+produit.id+")' class='waves-effect waves-light btn "+classAdd+"' disabled>modif</button>"+doneStatus+"</a>"
                }
                else{
                    result+="<a class='collection-item'>"+produit.nom+" x "+produit.quantite+" <button onclick='indexController.displayConfirmDeleteProduit("+produit.id+")' class='waves-effect waves-light btn'>suppr</button> <button onclick='indexController.editProduit("+produit.id+")' class='waves-effect waves-light btn'>modif</button>"+doneStatus+"</a>"
                }

            }

            $("#listeProduit").innerHTML=result
            document.querySelector("#divlisteProduit").classList.remove("d-none")
            document.querySelector("#afficheproduit").classList.remove("Novisiblee")
            this.refreshDisable()
        }
        catch (e) {
            document.querySelector("#afficheproduit").classList.add("Novisiblee")
            document.querySelector("#divlisteProduit").classList.add("d-none")
            console.log(e)
        }

    }

    async undoDelete() {
        if (this.deletedliste) {
           this.model.insert(this.deletedliste).then(id => {
               if (typeof id === "number"){
                    this.deletedliste = null
                    console.log(id)
                    console.log(this.deletedlisteProduit)
                    for(let produit of this.deletedlisteProduit){
                        produit.idListe=id
                        this.model.insertP(produit)
                    }
                    this.displayUndoDone()
                    this.displayAllListe()
                }
            }).catch(_ => this.displayServiceError())
        }
    }

    undoDeleteP() {
        if (this.deletedProduit) {
            this.model.insertP(this.deletedProduit).then(status => {
                if (status == 200) {
                    this.displayUndoDone()
                    this.displayAllListe()
                    this.AfficheProduit(this.deletedProduit.idliste)
                    this.deletedProduit = null
                }
            }).catch(_ => this.displayServiceError("liste"))
        }
    }

    undoDeleteShared() {
        if (this.deleteShared) {

            console.log(this.deleteShared)
            this.model.insertShared(this.deleteShared).then(status => {
                if (status == 200) {
                    this.displayUndoDone()
                    this.displayAllListe()
                    this.afficheShared(this.deleteShared.idliste)
                    this.deleteShared = null
                }
            }).catch(_ => this.displayServiceError("liste"))
        }
    }

    async displayConfirmDeleteProduit(id){
        try{
            const produit = await this.model.getProduit(id)
            let idliste=produit.idliste
            produit.idListe=produit.idliste
            super.displayConfirmDelete(produit,async ()=>{
                switch (await this.model.deleteP(id)){
                    case 200 :
                        this.deletedProduit = produit
                        this.displayDeletedMessage("indexController.undoDeleteP()");
                        break
                    case 404 :
                        this.displayNotFoundError("produit")
                        break
                    default:
                        this.displayServiceError()
                        break
                }
                this.displayAllListe()
                this.AfficheProduit(idliste)
            })
        }catch (e){
            console.log(e)
            this.displayServiceError()
        }
    }

    async displayConfirmDeleteShared(id){
        try{
            const shared = await this.model.getShared(id)
            let idliste=shared.idliste
            shared.idListe=shared.idliste
            shared.idUser=shared.iduser
            super.displayConfirmDelete(shared,async ()=>{
                switch (await this.model.deleteShared(id)){
                    case 200 :
                        this.deleteShared = shared
                        this.displayDeletedMessage("indexController.undoDeleteShared()");
                        break
                    case 404 :
                        this.displayNotFoundError("shared")
                        break
                    default:
                        this.displayServiceError()
                        break
                }
                this.displayAllListe()
               this.afficheShared(idliste)
            })
        }catch (e){
            console.log(e)
            this.displayServiceError()
        }
    }
    async displayConfirmDelete(id){
        try{
            const liste = await this.model.getListe(id)
            console.log(liste)
            super.displayConfirmDelete(liste,async ()=>{
                switch ((await this.model.delete(id)).status){
                    case 200 :
                        this.deletedliste = liste
                        this.deletedlisteProduit=[]
                        for(let ligne of await this.model.getProduitByListe(id)){
                            this.deletedlisteProduit.push(Object.assign(new Produits(), ligne))
                            this.model.deleteP(ligne.id)
                        }
                        this.displayDeletedMessage("indexController.undoDelete()");
                        break
                    case 404 :
                        this.displayNotFoundError("liste")
                        break
                    default:
                        this.displayServiceError()
                        break
                }
                this.displayAllListe()
            })
        }catch (e){
            console.log(e)
            this.displayServiceError()
        }
    }


    //other
    getlock(){
        let lock = this.getCookie("lock");
        let flag=false
        //si cookie existe
        if (lock!= "") {
            //si cookie est vrai
            if(lock=="true"){
                //si l'icone est verrouillé
                if($("#lock").innerText=="lock_outline"){
                    console.log("cas 1")
                    let r = confirm("En faisait oui vous rendez les listes archivé modifiable !");
                    if (r == true) {
                        $("#lock").innerText="lock_open"
                        this.setCookie("lock", false, 365);
                         flag=true
                    }
                }
                //icone fermé ou non existante
                else{
                    console.log("cas 2")
                    $("#lock").innerText="lock_outline"
                    this.setCookie("lock", true, 365);
                    flag=false
                }
            }
            //cookie faux
            else{
                //icone ouverte
                if($("#lock").innerText=="lock_open"){
                    console.log("cas 3")
                    $("#lock").innerText="lock_outline"
                    this.setCookie("lock", true, 365);
                    flag=false
                }
                //icone fermé ou inexistante
                else{
                    //icone ouverte
                    if($("#lock").innerText=="lock_outline") {
                        console.log("cas 4")
                        let r = confirm("En faisait oui vous rendez les listes archivé modifiable !");
                        if (r == true) {
                            $("#lock").innerText="lock_open"
                            this.setCookie("lock", false, 365);
                            flag=true
                        }
                    }
                    //icone non existante
                    else{
                        console.log("cas 5")
                        $("#lock").innerText="lock_open"
                        this.setCookie("lock", false, 365);
                        flag=false
                    }
                }
            }

        }//pas de cookie
        else {
            console.log("cas 6")
            $("#lock").innerText="lock_outline"
            this.setCookie("lock", true, 365);
            flag=false
        }
        this.refreshDisable()
    }

    refreshDisable(){
        let lock = this.getCookie("lock");
        var els = document.getElementsByClassName("disabledQC");
        for(var i = 0; i < els.length; i++)
        {
            if(lock=="true"){
                els[i].setAttribute("disabled",true);
            }
            else{
                els[i].removeAttribute("disabled");
            }
        }
    }


    setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
}

window.indexController = new IndexController()
