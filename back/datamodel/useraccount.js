module.exports= class UserAccount{
    constructor(displayName,login,challenge,verif,active) {
        this.displayName=displayName
        this.login=login
        this.challenge=challenge
        this.verif=verif
        this.active=active
    }
}