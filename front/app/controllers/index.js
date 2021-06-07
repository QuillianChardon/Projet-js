class IndexController extends BaseController {
     constructor() {
        super(true)
        this.tableListe=$('#tableListe')
        this.tablebody=$('#tableBody')
        this.tableBodyPartage=$('#tableBodyPartage')
        this.tableBodyOff=$('#tableBodyOff')
        this.archive=$('#archive')
        this.partage=$('#partage')
        this.getlock()
        this.displayAllListe()



        //affichage nav
        this.isAdmin()
         this.isPremium()
         this.doNav("Index","index",true)
        this.doNav("Compte","compte")
        this.doNav("Ajouter une liste","edit")
        this.doNav("Deconnexion","deconnexion")
    }

    async displayAllListe(){
        this.tableListe.style.display="none"
        try{
            let contentOn=''
            let contentOff=''
            for(const liste of await this.model.getAllListes()){
                const date= liste.date.toLocaleDateString()
                let cpt=0
                //nb share sur la liste en cours
                for(const Share of await this.model.getSharedByListe(liste.id)) {
                    cpt++
                }

                if(liste.done==true){
                    contentOn+="<tr onclick='indexController.AfficheProduit("+liste.id+")'><td>"+liste.nom+"<td>"+date+"<button onclick='indexController.shared("+liste.id+",event)' disabled class=\"btn btn-primary borderRadus paddingLeft disabledQC\"><span class='responsivDisplayName'>partage&nbsp;</span><i class=\"fa fa-share-alt\"></i></button> <button  onclick='indexController.displayConfirmDelete("+liste.id+",event)' class=\"btn btn-primary borderRadus \"><span class='responsivDisplayName'>effacer&nbsp;</span><i class=\"fas fa-trash-alt\"></i></button> <button onclick='indexController.edit("+liste.id+")' class=\"btn btn-primary borderRadus disabledQC\" disabled '><span class='responsivDisplayName'>editer&nbsp;</span><i class=\"fas fa-pen\"></i></button> <button onclick='indexController.afficheShared("+liste.id+",event)' class=\"btn btn-primary borderRadus \" '><span class='responsivDisplayName'>"+cpt+"&nbsp;</span><i class=\"fa fa-user\"></i></button> <button onclick='indexController.ArchiveListe("+liste.id+",event)' class=\"btn btn-primary borderRadus  disabledQC\" disabled '><span class='responsivDisplayName'>Desarchiver&nbsp;</span><i class=\"fas fa-archive\"></i></button>"
                }
                else{
                    contentOff+="<tr onclick='indexController.AfficheProduit("+liste.id+")'><td>"+liste.nom+"<td>"+date+"<button onclick='indexController.shared("+liste.id+",event)' class=\"btn btn-primary borderRadus paddingLeft\"><span class='responsivDisplayName'>partage&nbsp;</span><i class=\"fa fa-share-alt\"></i></button> <button onclick='indexController.displayConfirmDelete("+liste.id+",event)' class=\"btn btn-primary borderRadus\"><span class='responsivDisplayName'>effacer&nbsp;</span><i class=\"fas fa-trash-alt\"></i></button> <button onclick='indexController.edit("+liste.id+")' class=\"btn btn-primary borderRadus\"><span class='responsivDisplayName'>editer&nbsp;</span><i class=\"fas fa-pen\"></i></button> <button onclick='indexController.afficheShared("+liste.id+",event)' class=\"btn btn-primary borderRadus\" '><span class='responsivDisplayName'>"+cpt+"&nbsp;</span><i class=\"fa fa-user\"> </i></button> <button onclick='indexController.ArchiveListe("+liste.id+",event)' class=\"btn btn-primary borderRadus \" '><span class='responsivDisplayName'>Archiver &nbsp;</span><i class=\"fas fa-archive\"></i></button>"
                }
            }
            let contentShared=""
            for (let shareListe of await this.model.getShareByUser()){
                console.log(shareListe)
                let obj = await this.model.getListe(shareListe.idliste)
                const date= obj.date.toLocaleDateString()
                if(shareListe.droit==true){
                    contentShared+="<tr onclick='indexController.AfficheProduit("+obj.id+")'><td>"+obj.nom+"<td>"+date+" <button onclick='indexController.displayConfirmDelete("+obj.id+")' class=\"btn btn-primary borderRadus paddingLeft\"><span class='responsivDisplayName'>effacer&nbsp;</span><i class=\"fas fa-trash-alt\"></i></button> <button onclick='indexController.edit("+obj.id+")' class=\"btn btn-primary borderRadus\"><span class='responsivDisplayName'>editer&nbsp;</span><i class=\"fas fa-pen\"></i></button> "
                }
                else{
                    contentShared+="<tr onclick='indexController.AfficheProduit("+obj.id+",false)'><td>"+obj.nom+"<td>"+date
                }
            }

            this.tablebody.innerHTML=contentOff
            this.tableListe.style.display="block"
            this.tableBodyOff.innerHTML=contentOn
            this.tableBodyPartage.innerHTML=contentShared
            this.archive.style.display="block"
            this.partage.style.display="block"
            this.refreshDisable()
            this.checknotif()
        }catch (e) {
            console.log(e)
            this.displayServiceError()

        }
    }



    async shared(id,event){
         this.isActive()
        //partage de la liste
        event.stopPropagation();

        let flag=true
        await this.model.isPremium()
            .then(flag=true)
            .catch(err => {
                console.log(err)
                flag=false
            })
        if(flag==false){
            this.getModal("#modalShared").open()
            let result="<table className=\"stripped responsive-table\" style=\"display: none\">"
            let userLogin = "<option value=\"-1\" disabled selected>Choose your option</option>"

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
            $("#listeUser").innerHTML = userLogin

            M.FormSelect.init($("#listeUser"));
        }
        else{
            this.toast("Pour partager une liste il faut être premium")
        }

    }

    async addShared(idListe){
        this.isActive()
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
        this.isActive()
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
       this.isActive()
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
            sharedResult+="<tr><td>"+user.login+"</td><td>"+droit+"<button onclick='indexController.displayConfirmDeleteShared("+shared.id+")' class=\"btn btn-primary borderRadus paddingGlobal\">suppr</button></td>"
        }
        $("#tableSharedcontent").innerHTML=sharedResult
       this.getModal("#modalSharedDisplay").open()
    }

    async edit(id){
        this.isActive()
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
        this.isActive()
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
       this.isActive()
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
           this.toast("modif bien effectué")
           this.displayAllListe()
           this.AfficheProduit(liste.id)
       }
        else{
           this.displayServiceError()
       }
    }
   async ArchiveListe(id,event){
       if(event!=null){
           event.stopPropagation();
       }
        const liste = await this.model.getListe(id)
       console.log(liste)
       if(liste.done==false){

           liste.done=true
           if (await this.model.update(liste) === 200) {
               this.toast("modif bien effectué")
               this.displayAllListe()
           }
           else{
               this.displayServiceError()
           }
       }
       else{
           await this.model.isNotPremiumAndOneListe()
               .then(async e=>{
                   if(e==200){
                       if(liste.done){
                           liste.done=false
                       }
                       else{
                           liste.done=true
                       }
                       if (await this.model.update(liste) === 200) {
                           this.toast("modif bien effectué")
                           this.displayAllListe()
                       }
                       else{
                           this.displayServiceError()
                       }
                   }
               })
               .catch(err => {
                   this.toast("Qu'une seule liste active en même temps pour les non premium")
                   return
               })
       }

    }
    async AfficheProduit(id,open=true){
        this.isActive()
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
            if(open){
                $("#addProduct").style.display="block"
                for(const produit of await this.model.getProduitByListe(id)){
                    let doneStatus=""

                    if(produit.done){

                        doneStatus = "<label><input type='checkbox' class=' "+classAdd+"' checked onclick='indexController.checkItems("+produit.id+")' "+param+"/> <span class=\"x2paddingLeft\">valider</span></label>"
                    }
                    else{
                        doneStatus = "<label><input type='checkbox' class=' "+classAdd+"'' onclick='indexController.checkItems("+produit.id+")'"+param+"/> <span class=\"x2paddingLeft\">valider</span></label>"
                    }


                    if(object.done==true){
                        result+="<a class='collection-item'>"+produit.nom+" x "+produit.quantite+" <button onclick='indexController.displayConfirmDeleteProduit("+produit.id+")' class='btn btn-primary borderRadus "+classAdd+"' disabled>effacer&nbsp;<i class=\"fas fa-trash-alt\"></i></button> <button onclick='indexController.editProduit("+produit.id+")' class='btn btn-primary borderRadus "+classAdd+"' disabled>editer&nbsp;<i class=\"fas fa-pen\"></i> </button>"+doneStatus+"</a>"
                    }
                    else{
                        result+="<a class='collection-item'>"+produit.nom+" x "+produit.quantite+" <button onclick='indexController.displayConfirmDeleteProduit("+produit.id+")' class='btn btn-primary borderRadus'>effacer&nbsp;<i class=\"fas fa-trash-alt\"></i></button> <button onclick='indexController.editProduit("+produit.id+")' class='btn btn-primary borderRadus'>editer&nbsp;<i class=\"fas fa-pen\"></i></button>"+doneStatus+"</a>"
                    }
                }
            }
            else{
                $("#addProduct").style.display="none"
                for(const produit of await this.model.getProduitByListe(id)){
                    let doneStatus=""
                    if(produit.done){
                        doneStatus = "<label><input type='checkbox' class=' "+classAdd+"' disabled checked/> <span class=\"x2paddingLeft\">valider</span></label>"
                    }
                    else{
                        doneStatus = "<label><input type='checkbox' class='' disabled /> <span class=\"x2paddingLeft\"> valider</span></label>"
                    }
                    if(object.done==true){
                        result+="<a class='collection-item'>"+produit.nom+" x "+produit.quantite+" "+doneStatus+"</a>"
                    }
                    else{
                        result+="<a class='collection-item'>"+produit.nom+" x "+produit.quantite+" "+doneStatus+"</a>"
                    }
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
           await this.model.insert(this.deletedliste).then(id => {
               if (typeof id === "number"){
                    this.deletedliste = null

                   for(let shared of this.deletedShareds){
                       shared.idListe=id
                       shared.idUser=shared.iduser
                        this.model.insertShared(shared);
                   }

                    console.log(this.deletedShareds)
                    console.log(this.deletedlisteProduit)

                    for(let produit of this.deletedlisteProduit){
                        produit.idListe=id
                         this.model.insertP(produit)
                    }

                    this.displayUndoDone()
                    this.displayAllListe()
                }
            }).catch(e => {
                console.log(e)
                this.displayServiceError()
           })
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
            }).catch(_ => this.displayServiceError("partage"))
        }
    }

    async displayConfirmDeleteProduit(id){
        this.isActive()
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
                this.getModal("#modalConformDelet").close();
                this.displayAllListe()
                this.AfficheProduit(idliste)
            })
        }catch (e){
            console.log(e)
            this.displayServiceError()
        }
    }

    async displayConfirmDeleteShared(id){
        this.isActive()
        try{
            const shared = await this.model.getShared(id)
            let idliste=shared.idliste
            shared.idListe=shared.idliste
            shared.idUser=shared.iduser
            console.log(shared)
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
                this.getModal("#modalConformDelet").close();
                this.displayAllListe()
               this.afficheShared(idliste)
            })
        }catch (e){
            console.log(e)
            this.displayServiceError()
        }
    }

    async displayConfirmDelete(id,event){
        this.isActive()
        if(event!=null){
            event.stopPropagation();
        }
        try{

            const liste = await this.model.getListe(id)
            super.displayConfirmDelete(liste,async ()=>{
                document.querySelector("#divlisteProduit").classList.add("d-none")
                document.querySelector("#afficheproduit").classList.add("Novisiblee")

                this.deletedlisteProduit=[]
                for(let ligne of await this.model.getProduitByListe(id)){
                    this.deletedlisteProduit.push(Object.assign(new Produits(), ligne))
                    await this.model.deleteP(ligne.id)
                }

                this.deletedShareds=[]
                for(let shared of await this.model.getSharedByListe(id)){
                    this.deletedShareds.push(Object.assign(new Shared(), shared))
                }

                switch ((await this.model.delete(id)).status){
                    case 200 :
                        this.deletedliste = liste
                        this.displayDeletedMessage("indexController.undoDelete()");
                        break
                    case 404 :
                        this.displayNotFoundError("liste")
                        break
                    default:
                        this.displayServiceError()
                        break
                }
                this.getModal("#modalConformDelet").close();
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
                if($("#lock").innerHTML=="<i class=\"fas fa-lock\"></i>"){
                    console.log("cas 1")
                    let r = confirm("En faisait oui vous rendez les listes archivé modifiable !");
                    if (r == true) {
                        $("#lock").innerHTML="<i class=\"fas fa-unlock\"></i>"
                        this.setCookie("lock", false, 365);
                         flag=true
                    }
                }
                //icone fermé ou non existante
                else{
                    console.log("cas 2")
                    $("#lock").innerHTML="<i class=\"fas fa-lock\"></i>"
                    this.setCookie("lock", true, 365);
                    flag=false
                }
            }
            //cookie faux
            else{
                //icone ouverte
                if($("#lock").innerHTML=="<i class=\"fas fa-unlock\"></i>"){
                    console.log("cas 3")
                    $("#lock").innerHTML="<i class=\"fas fa-lock\"></i>"
                    this.setCookie("lock", true, 365);
                    flag=false
                }
                //icone fermé ou inexistante
                else{
                    //icone ouverte
                    if($("#lock").innerText=="<i class=\"fas fa-lock\"></i>") {
                        console.log("cas 4")
                        let r = confirm("En faisait oui vous rendez les listes archivé modifiable !");
                        if (r == true) {
                            $("#lock").innerHTML="<i class=\"fas fa-unlock\"></i>"
                            this.setCookie("lock", false, 365);
                            flag=true
                        }
                    }
                    //icone non existante
                    else{
                        console.log("cas 5")
                        $("#lock").innerHTML="<i class=\"fas fa-unlock\"></i>"
                        this.setCookie("lock", false, 365);
                        flag=false
                    }
                }
            }

        }//pas de cookie
        else {
            console.log("cas 6")
            $("#lock").innerHTML="<i class=\"fas fa-lock\"></i>"
            this.setCookie("lock", true, 365);
            flag=false
        }
        this.refreshDisable()
    }

    refreshDisable(){
        this.isActive()
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
