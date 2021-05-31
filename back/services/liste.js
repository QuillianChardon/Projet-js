const listeDAO = require("../datamodel/listeDAO")
const notificationDAO = require("../datamodel/notificationDAO")
const useraccountDAO = require("../datamodel/useraccountdao")
const notification = require('../datamodel/notification')
module.exports=class ListeService{
    constructor(db) {
        this.dao = new listeDAO(db)
        this.daoNotif = new notificationDAO(db)
        this.daoUser = new useraccountDAO(db)
    }
    isValid(liste){
        if(liste.nom==="")return false
        if(liste.date==="")return false
        liste.nom=liste.nom.trim()
        liste.date=liste.date.trim()
        if(liste.date!=null){
            if(liste.date instanceof String){
                liste.date=new Date(liste.date)
            }
        }
        return true
    }

    async checkNotif(user){
        let nameListe=[]
        let premier = true
        let allListe = await this.dao.getAllOpen(user)
        let cpt=0
        for(let liste of allListe){
            console.log("--- ici ---"+liste.id)

            let dateNow = new Date();
            let dateListe = new Date(liste.date);
            let Diff_temps = dateListe.getTime() - dateNow.getTime();
            let Diff_jours = Diff_temps / (1000 * 3600 * 24);
            console.log(Math.round(Diff_jours))
            console.log(Math.round(Diff_jours)<-7)
            if(Math.round(Diff_jours)<-7)
            {
                cpt++
                if(premier){
                    nameListe+="<b>"+liste.nom
                    premier=false
                }
                else{
                    nameListe+=" / "+liste.nom
                }
            }
        }
        console.log( "size : " +cpt)
        if(cpt>0){
            nameListe+="</b>"
            let haveListe=await this.daoNotif.checkNotif(user.id,"Liste expiré")
            if(haveListe[0]===undefined){
                this.daoNotif.insert(new notification(user.id,"Liste expiré","vos listes "+nameListe+" sont perimé de plus de 7j vous pouvez la cloturer ou la supprimer",false,new Date()))
            }
            else{
                console.log(haveListe[0])
                haveListe[0].vue=true
                this.daoNotif.update(haveListe[0])
                this.daoNotif.insert(new notification(user.id,"Liste expiré","vos listes "+nameListe+" sont perimé de plus de 7j vous pouvez la cloturer ou la supprimer",false,new Date()))
            }
        }

    }

    async checkNotifForModifPartageListe(listeId,idUser,idUserModif){
        let haveNotif = await this.daoNotif.checkNotifModifListePartage(idUser,"Modification de la liste #"+listeId)
        let user =  await this.daoUser.getById(idUserModif)
        if(haveNotif[0]===undefined){
            this.daoNotif.insert(new notification(idUser,`Modification de la liste #${listeId}`,`la liste a était modifié par l'utilisateur :&nbsp;<b>${user.login}</b>`,false,new Date()))
        }
    }
}