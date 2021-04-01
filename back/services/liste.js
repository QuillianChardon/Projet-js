const listeDAO = require("../datamodel/listeDAO")
module.exports=class ListeService{
    constructor(db) {
        this.dao = new listeDAO(db)
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
}