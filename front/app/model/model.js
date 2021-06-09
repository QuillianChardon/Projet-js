class Model {
    constructor() {
        this.api = new ListeApi()
        this.apiProduct = new ProduitApi()
        this.apiShared = new SharedApi()
        this.apiUser = new UserAccountAPI()
        this.apiNotification = new NotificationApi()
        this.apiTypePayment = new TypePaymentapi()
        this.apiAbonnement = new Abonnementapi()
    }
    async getAllListes(){
        let listes=[]
        for(let liste of await this.api.getAll()){
            liste.date=new Date (liste.date)
            listes.push(Object.assign(new Liste(), liste))
        }
        return listes
    }

    async getListe(id){
        let liste = await this.api.getListe(id)
        liste.date=new Date(liste.date)
        return Object.assign(new Liste(),liste)
    }

    delete(id) {
        return this.api.delete(id)
    }

    insert(liste) {
        return this.api.insert(liste).then(res => res.json())
    }


    update(liste) {
        return this.api.update(liste).then(res => res.status)
    }

    async getProduitByListe(idListe){
        let produits=[]
        for(let produit of await this.apiProduct.getByIdListe(idListe)){
            produits.push(Object.assign(new Produits(), produit))
        }
        return produits
    }

    deleteP(id) {
        return this.apiProduct.delete(id).then(res => res.status)
    }

    async insertP(produit) {
        return this.apiProduct.insert(produit).then(res => res.status)
    }

    updateP(produit) {
        return this.apiProduct.update(produit).then(res => res.status)
    }

    async getProduit(id){
        let produit = await this.apiProduct.getProduit(id)
        return Object.assign(new Produits(),produit)
    }

    //shared
    async insertShared(shared){
        return await this.apiShared.insert(shared).then(res => res.status)
    }

    async getShared(id){
        let shared = await this.apiShared.getShared(id)
        return Object.assign(new Shared(),shared)
    }

    async getSharedByListe(idListe){
        let shareds=[]
        for(let shared of await this.apiShared.getByIdListe(idListe)){
            shareds.push(Object.assign(new Shared(), shared))
        }
        return shareds
    }

    updateShared(shared) {
        return this.apiShared.update(shared).then(res => res.status)
    }

    async getSharedByListe(idListe){
        let shareds=[]
        for(let shared of await this.apiShared.getByIdListe(idListe)){
            shareds.push(Object.assign(new Shared(), shared))
        }
        return shareds
    }

    deleteShared(id) {
        return this.apiShared.delete(id).then(res => res.status)
    }

   async getShareByUser(){
        let sharedListe=[]
        for(let share of await this.apiShared.getAll()) {
            sharedListe.push(Object.assign(new Shared(), share))
        }
        return sharedListe
    }

    async getAllUserNotInShared(idliste){
        let users=[]
        for(let user of await this.apiUser.getAllshared(idliste)){
            users.push(Object.assign(new User(), user))
        }
        return users
    }
    async getAllUser(id){
        let userCache
        for(let user of await this.apiUser.getAll()) {
            if(user.id==id){
                userCache=Object.assign(new User(), user)
            }
        }
        return userCache
    }

    async getAllUserByAdmin(){
        let users=[]
        for(let user of await this.apiUser.getAll()) {
            users.push(Object.assign(new User(), user))
        }
        return users
    }

    async GetOneByToken(){
        let user=await this.apiUser.GetOneByToken()
        console.log(user)
        let userCache=Object.assign(new User(), user)
        return userCache
    }

    async isAdmin(){
        return this.apiUser.isAdmin().then(res => res.status)
    }
    async isActive(){
        return this.apiUser.isActive().then(res => res.status)
    }


    async GetOneByIdForAdmin(id){
        let userInfo=await this.apiUser.GetOneByIdForAdmin(id)
        let userCache=Object.assign(new UserInfo(), userInfo)
        return userCache
    }

    async getAllRolesUser(id){
        let roles=[]
        for(let role of await this.apiUser.getAllRolesUser(id)) {
            roles.push(Object.assign(new Role(), role))
        }
        return roles
    }

    async getAllRolesNotUser(id){
        let roles=[]
        for(let role of await this.apiUser.getAllRolesNotUser(id)) {
            roles.push(Object.assign(new Role(), role))
        }
        return roles
    }


    async getAllUserForAdmin(){
        let users=[]
        for(let user of await this.apiUser.getAll()) {
            users.push(Object.assign(new User(), user))
        }
        return users
    }

    /**
     * NOTIFICATION
     */
    async getAllNotificationNotSeen(){
        let notifications=[]
        for(let notif of await this.apiNotification.getAllNotSeen()){
            notif.date=new Date (notif.date)
            notifications.push(Object.assign(new Notification(), notif))
        }
        return notifications
    }

    async markAsReadNotif(id){
        return this.apiNotification.markAsReadNotif(id).then(res => res.status)
    }

    async saveNotif(id,texte,titre){
        return this.apiNotification.saveNotif(id,texte,titre).then(res => res.status)
    }

    /**
     * USER
     */
    getUserById(id){
        return this.apiUser.getById(id)
    }
    isNotPremiumAndOneListe(){
        return this.apiAbonnement.isNotPremiumAndOneListe()
    }
    changeMDPByAdminMail(id){
        return this.apiUser.changeMDPByAdminMail(id)
    }


    /**
     * TYPE PAYMENT
     */
    async getAllPaymentType(){
        let typePayments=[]
        for(let oneTypePayment of await this.apiTypePayment.getAll()){
            typePayments.push(Object.assign(new TypePayment(), oneTypePayment))
        }
        return typePayments
    }

    getIdType(name) {
        return this.apiTypePayment.getIdType(name);
    }
    async getTypeAbo(id){
        return this.apiTypePayment.getType(id)
    }
    /**
     * ABONNEMENT
     */

    async savePayment(id){
        return this.apiAbonnement.insertAbonnement(id).then(res => res.status)
    }
    async isPremium(){
        return this.apiAbonnement.isPremium().then(res => res.status)
    }

    async getAllAbonnement(){
        let abonnements=[]
        for(let abo of await this.apiAbonnement.getAll()){
            abonnements.push(Object.assign(new Abonnement(), abo))
        }
        return abonnements
    }
}