const bcrypt = require('bcrypt')
const UserAccountDAO = require('../datamodel/useraccountdao')
const UserAccount = require('../datamodel/useraccount')
const nodemailer = require("nodemailer");

module.exports=class UserAccountService{
    constructor(db) {
        this.dao = new UserAccountDAO(db)
    }

    comparePassword(password,hash){
        return bcrypt.compareSync(password,hash)
    }

    async validatePassword(login,password){
        const user = await this.dao.getByLogin(login)
        return this.comparePassword(password,user.challenge)
    }

    async isValide(login){
        const user = await this.dao.getByLogin(login)
        console.log("verif")
        console.log(user.verif)
        return user.verif
    }

    hashPassword(password){
        return bcrypt.hashSync(password,10)
    }

    async insert(displayname,login,password,verif,jwt){
        if(verif){
            return this.dao.insert(new UserAccount(displayname,login,this.hashPassword(password),verif))
        }
        else{
            if(this.dao.insert(new UserAccount(displayname,login,this.hashPassword(password),verif))){
                await this.sendMail(login,jwt)
                return true
            }
        }
        return false
    }


    async sendMail(login,jwt){

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'projet.nodejs.esimed@gmail.com',
                pass: 'esimedqc'
            }
        });

        let lien="http://localhost:63342/front/verif.html?token="+jwt.generateLienValidation(login)

        let info = await transporter.sendMail({
            to: login,
            subject: "Inscription [ESIMED NODEJS]",
            html: "Bonjour,<br>voici votre lien de confirmation de l'inscription<br>cliquez ici : <a href='"+lien+"'>"+lien+"</a>",
        });
    }

    async sendMailChangePassword(login,jwt){
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'projet.nodejs.esimed@gmail.com',
                pass: 'esimedqc'
            }
        });

        let lien="http://localhost:63342/front/changeMDP.html?token="+jwt.generateLienChangePassword(login)
        console.log("lien : "+lien)
        let info = await transporter.sendMail({
            to: login,
            subject: "Changement de mot de passe [ESIMED NODEJS]",
            html: "Bonjour,<br>voici votre lien de confirmation de changement de mot de passe<br>cliquez ici : <a href='"+lien+"'>"+lien+"</a>",
        });
    }
}