class AdminController extends BaseFormController {
    constructor() {
        super(true)
        this.svc = new UserAccountAPI()
        this.isAdmin(true)
        this.doNav("Index","index")
        this.doNav("Compte","compte")
        this.doNav("Ajouter une liste","edit")
        this.doNav("Deconnexion","deconnexion")
        this.chargeValue()
    }

    async chargeValue() {
        let usersHTMl = ""
        for (let user of await this.model.getAllUserByAdmin()) {
            usersHTMl = `<tr onclick="adminController.chargeInfoUser(${user.id},true)"><td>${user.id}</td><td>${user.login}</td></tr>` + usersHTMl
        }
        $("#tableBodyUser").innerHTML = usersHTMl
    }

    async chargeInfoUser(id,click){
        let user=await this.model.GetOneByIdForAdmin(id)
        $("#fieldEmail").value=user.login
        $("#fieldName").value=user.displayname
        $("#fieldCheck").checked=user.active
        $("#idUserSuperCache").value=user.id

        $("#userInfo").style.display="block"
        if(click){
            if($("#clickButtonInfoUser").classList.contains("collapsed")){
                $("#clickButtonInfoUser").click()
            }

        }
        let roleActif=""
        for (let role of await this.svc.getAllRolesUser(id)) {
            roleActif+=`<label>
                        <input type="checkbox"  id="fieldCheck" class="" checked onclick="adminController.changeValueRole(${role.id},${id})">
                        <span class="x2paddingLeft">${role.nom}</span>
                    </label><br>`
        }

        for (let role of await this.svc.getAllRolesNotUser(id)) {
            roleActif+=`<label>
                        <input type="checkbox"  id="fieldCheck" class="" onclick="adminController.changeValueRole(${role.id},${id})">
                        <span class="x2paddingLeft">${role.nom}</span>
                    </label><br>`
        }
        $("#rolesUser").innerHTML=roleActif;

    }
    async changeValueRole(roleId,idUser){
        if(await this.svc.changeUserRoleByAdmin(roleId,idUser)===200){
            this.toast("modif bien effectué")
        }
        else{
            this.toast("modif non effectué")
        }

    }

    async saveAll(){
        let id=$("#idUserSuperCache").value
        let user=await this.model.GetOneByIdForAdmin(id)
        if(user.login!=$("#fieldEmail").value){
            //save email
            await this.svc.modifEmailByAdmin($("#fieldEmail").value,id)
                .then(res => this.toast("Modification réussi"))
                .catch(err => {
                    console.log(err)
                    if (err == 401) {
                        this.toast("Adresse e-mail deja prise")
                    }
                    else {
                        this.displayServiceError()
                    }
                })
        }
        if($("#fieldPassword").value.trim()!=""){
            //save passorwd
             await this.svc.modifPasswordByAdmin($("#fieldPassword").value.trim(),id)
                 .then(res => this.toast("Modification réussi"))
                 .catch(err => {
                     console.log(err)
                     this.displayServiceError()

                 })
        }
        /*if(user.active!=$("#fieldCheck").checked){
            //save check
            await this.svc.modifPasswordByAdmin($("#fieldPassword").checked,id)
                 .then(res => this.toast("Modification réussi"))
                  .catch(err => {
                      console.log(err)
                      this.displayServiceError()
                  })
        }*/
        this.chargeInfoUser(id,false)
        this.chargeValue()
    }

    filterUser(){
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("fieldSearch");
        filter = input.value.toUpperCase();
        table = document.getElementById("tableBodyUser");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[1];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }

}
window.adminController = new AdminController()