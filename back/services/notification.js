const notificationDAO = require("../datamodel/notificationDAO")
module.exports=class NotificationService{
    constructor(db) {
        this.dao = new notificationDAO(db)
    }
    isValid(notification){
        if(notification.texte==="")return false
        if(notification.titre==="")return false
        if(notification.date!=null){
            if(notification.date instanceof String){
                notification.date=new Date(notification.date)
            }
        }
        return true
    }
}