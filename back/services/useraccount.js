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

    async insert(displayname,login,password,verif,active,jwt){
        if(verif){
            return this.dao.insert(new UserAccount(displayname,login,this.hashPassword(password),verif,active))
        }
        else{
            if(this.dao.insert(new UserAccount(displayname,login,this.hashPassword(password),verif,active))){
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
        let constructHTML =""
        constructHTML+="<table cellpadding=\"0\" cellspacing=\"0\" class=\"force-width-80\" style=\"margin: 0 auto;\">\n" +
"                   <tbody>\n" +
"                        <tr class=\"\">\n" +
"                            <td class=\"\" style=\"text-align:left; color:#933f24;\"><br>\n" +
"                                     <center class=\"\" style=\"color:#999999; border-top:1px solid #FAFAFA;\"><br>Bonjour,<br> Voici votre lien de confirmation de l'inscription<br>cliquez  <a href='"+lien+"'>ici</a></center>\n" +
"                                            <br>\n" +
"                                            <br></td>\n" +
"                        </tr>\n" +
"                  </tbody>\n" +
"            </table>"

        let info = await transporter.sendMail({
            to: login,
            subject: "Inscription [ESIMED NODEJS]",
            html: mailTop+constructHTML+mailBottom,
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
        let constructHTML =""
        constructHTML+="<table cellpadding=\"0\" cellspacing=\"0\" class=\"force-width-80\" style=\"margin: 0 auto;\">\n" +
            "                   <tbody>\n" +
            "                        <tr class=\"\">\n" +
            "                            <td class=\"\" style=\"text-align:left; color:#933f24;\"><br>\n" +
            "                                     <center class=\"\" style=\"color:#999999; border-top:1px solid #FAFAFA;\"><br>Bonjour,<br> Voici votre lien de confirmation de changement de mot de passe<br>cliquez <a href='"+lien+"'>ici</a></center>\n" +
            "                                            <br>\n" +
            "                                            <br></td>\n" +
            "                        </tr>\n" +
            "                  </tbody>\n" +
            "            </table>"

        console.log("lien : "+lien)
        let info = await transporter.sendMail({
            to: login,
            subject: "Changement de mot de passe [ESIMED NODEJS]",
            html: mailTop+constructHTML+mailBottom,
        });
    }

    async sendMailAchat(login,type){
        console.log(type.nom)
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'projet.nodejs.esimed@gmail.com',
                pass: 'esimedqc'
            }
        });
        let constructHTML =""
        constructHTML+="<table cellpadding=\"0\" cellspacing=\"0\" class=\"force-width-80\" style=\"margin: 0 auto;\">\n" +
            "                   <tbody>\n" +
            "                        <tr class=\"\">\n" +
            "                            <td class=\"\" style=\"text-align:left; color:#933f24;\"><br>\n" +
            "                                     <center class=\"\" style=\"color:#999999; border-top:1px solid #FAFAFA;\"><br>Bonjour,<br> Voici votre récapitulatif : <br> Vous avez acheté notre premium pour 5€ par " +type.nom+"</center>\n" +
            "                                            <br>\n" +
            "                                            <br></td>\n" +
            "                        </tr>\n" +
            "                  </tbody>\n" +
            "            </table>"
        let info = await transporter.sendMail({
            to: login,
            subject: "[ESIMED NODEJS] Premium",
            html: mailTop+constructHTML+mailBottom,
        });
    }

    async sendMailChangePasswordFormAdmin(login,jwt){
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
        let constructHTML =""
        constructHTML+="<table cellpadding=\"0\" cellspacing=\"0\" class=\"force-width-80\" style=\"margin: 0 auto;\">\n" +
            "                   <tbody>\n" +
            "                        <tr class=\"\">\n" +
            "                            <td class=\"\" style=\"text-align:left; color:#933f24;\"><br>\n" +
            "                                     <center class=\"\" style=\"color:#999999; border-top:1px solid #FAFAFA;\"><br>Bonjour,<br> Voici votre lien de confirmation de changement de mot de passe car celui ci a était modifié par un admin <br>cliquez <a href='"+lien+"'>ici</a></center>\n" +
            "                                            <br>\n" +
            "                                            <br></td>\n" +
            "                        </tr>\n" +
            "                  </tbody>\n" +
            "            </table>"


        console.log("lien : "+lien)
        let info = await transporter.sendMail({
            to: login,
            subject: "Changement de mot de passe par un admin[ESIMED NODEJS]",
            html: mailTop+constructHTML+mailBottom,
        });
    }
}




let mailTop = "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n" +
    "\n" +
    "<head>\n" +
    "    <meta content=\"text/html; charset=utf-8\" http-equiv=\"Content-Type\">\n" +
    "    <style type=\"text/css\"></style>\n" +
    "    <meta content=\"width=device-width, initial-scale=1\" name=\"viewport\">\n" +
    "    <title>Neopolitan Invoice Email</title>\n" +
    "    <!-- Designed by https://github.com/kaytcat -->\n" +
    "    <!-- Robot header image designed by Freepik.com -->\n" +
    "    <style type=\"text/css\">\n" +
    "        @import url(https://fonts.googleapis.com/css?family=Droid+Sans);\n" +
    "        /* Take care of image borders and formatting */\n" +
    "        \n" +
    "        img {\n" +
    "            max-width: 600px;\n" +
    "            outline: none;\n" +
    "            text-decoration: none;\n" +
    "            -ms-interpolation-mode: bicubic;\n" +
    "        }\n" +
    "        \n" +
    "        a {\n" +
    "            text-decoration: none;\n" +
    "            border: 0;\n" +
    "            outline: none;\n" +
    "            color: #bbbbbb;\n" +
    "        }\n" +
    "        \n" +
    "        a img {\n" +
    "            border: none;\n" +
    "        }\n" +
    "        /* General styling */\n" +
    "        \n" +
    "        td,\n" +
    "        h1,\n" +
    "        h2,\n" +
    "        h3 {\n" +
    "            font-family: Helvetica, Arial, sans-serif;\n" +
    "            font-weight: 400;\n" +
    "        }\n" +
    "        \n" +
    "        td {\n" +
    "            text-align: center;\n" +
    "        }\n" +
    "        \n" +
    "        body {\n" +
    "            -webkit-font-smoothing: antialiased;\n" +
    "            -webkit-text-size-adjust: none;\n" +
    "            width: 100%;\n" +
    "            height: 100%;\n" +
    "            color: #37302d;\n" +
    "            background: #ffffff;\n" +
    "            font-size: 16px;\n" +
    "        }\n" +
    "        \n" +
    "        table {\n" +
    "            border-collapse: collapse !important;\n" +
    "        }\n" +
    "        \n" +
    "        .headline {\n" +
    "            color: #ffffff;\n" +
    "            font-size: 30px;\n" +
    "        }\n" +
    "        \n" +
    "        .force-full-width {\n" +
    "            width: 100% !important;\n" +
    "           margin-top: 100px;\n" +
    "           margin-bottom: 100px;" +
    "        }\n" +
    "        \n" +
    "        .force-width-80 {\n" +
    "            width: 80% !important;\n" +
    "        }\n" +
    "    </style>\n" +
    "    <style media=\"screen\" type=\"text/css\">\n" +
    "        @media screen {\n" +
    "            /*Thanks Outlook 2013! https://goo.gl/XLxpyl*/\n" +
    "            td,\n" +
    "            h1,\n" +
    "            h2,\n" +
    "            h3 {\n" +
    "                font-family: 'Droid Sans', 'Helvetica Neue', 'Arial', 'sans-serif' !important;\n" +
    "            }\n" +
    "        }\n" +
    "    </style>\n" +
    "    <style media=\"only screen and (max-width: 480px)\" type=\"text/css\">\n" +
    "        /* Mobile styles */\n" +
    "        \n" +
    "        @media only screen and (max-width: 480px) {\n" +
    "            table[class=\"w320\"] {\n" +
    "                width: 320px !important;\n" +
    "            }\n" +
    "            td[class=\"mobile-block\"] {\n" +
    "                width: 100% !important;\n" +
    "                display: block !important;\n" +
    "            }\n" +
    "        }\n" +
    "    </style>\n" +
    "</head>\n" +
    "\n" +
    "<body bgcolor=\"#2b313c\" class=\"body\" style=\"padding:0;margin:0;display:block;background: #2b313c;-webkit-text-size-adjust:none;padding-top: 100px;padding-bottom: 100px;\">\n" +
    "    <table align=\"center\" cellpadding=\"0\" cellspacing=\"0\" class=\"force-full-width\" height=\"100%\">\n" +
    "        <tbody>\n" +
    "            <tr>\n" +
    "                <td align=\"center\" bgcolor=\"#2b313c\" class=\"\" valign=\"top\" width=\"100%\">\n" +
    "                    <center class=\"\">\n" +
    "                        <table cellpadding=\"0\" cellspacing=\"0\" class=\"w320\" style=\"margin: 0 auto;\" width=\"600\">\n" +
    "                            <tbody>\n" +
    "                                <tr>\n" +
    "                                    <td align=\"center\" class=\"\" valign=\"top\">\n" +
    "                                        <table cellpadding=\"0\" cellspacing=\"0\" class=\"force-full-width\" style=\"margin: 0 auto;\">\n" +
    "                                            <tbody>\n" +
    "                                                <tr>\n" +
    "                                                    <td class=\"\" style=\"font-size: 30px; text-align:center;\"></td>\n" +
    "                                                </tr>\n" +
    "                                            </tbody>\n" +
    "                                        </table>\n" +
    "                                        <table bgcolor=\"#fc3754\" cellpadding=\"0\" cellspacing=\"0\" class=\"force-full-width\" style=\"margin: 0 auto;\">\n" +
    "                                            <tbody class=\"\">\n" +
    "                                                <tr class=\"\">\n" +
    "                                                    <td class=\"\"><br>\n" +
    "                                                        <br>\n" +
    "                                                        <a class=\"\" data-click-track-id=\"8768\" href=\"#\"><img class=\"\" height=\"70\" src=\"https://cdn.discordapp.com/attachments/845280382316576819/850306952160215050/icon.png\" width=\"70\"></a>\n" +
    "                                                        <br>\n" +
    "                                                        <br></td>\n" +
    "                                                </tr>\n" +
    "                                                <tr class=\"\">\n" +
    "                                                    <td class=\"headline\"><b class=\"headline\">Note'Tout</b>\n" +
    "                                                    </td>\n" +
    "                                                </tr>\n" +
    "                                                <tr>\n" +
    "                                                    <td>\n" +
    "                                                        <center class=\"\">\n" +
    "                                                            <table cellpadding=\"0\" cellspacing=\"0\" style=\"margin: 0 auto;\" width=\"70%\">\n" +
    "                                                                <tbody>\n" +
    "                                                                    <tr>\n" +
    "                                                                        <td class=\"\" style=\"color: #fcfcfc;\"><br> Vous avez recu un email de la part de l'équipe Note'Tout !\n" +
    "                                                                            <br>\n" +
    "                                                                            <br></td>\n" +
    "                                                                    </tr>\n" +
    "                                                                </tbody>\n" +
    "                                                            </table>\n" +
    "                                                        </center>\n" +
    "                                                    </td>\n" +
    "                                                </tr>\n" +
    "                                                <tr>\n" +
    "                                                    <td class=\"\"></td>\n" +
    "                                                </tr>\n" +
    "                                            </tbody>\n" +
    "                                        </table>\n" +
    "                                        <table bgcolor=\"#FFF\" cellpadding=\"0\" cellspacing=\"0\" class=\"force-full-width\" style=\"margin: 0 auto;\">\n" +
    "                                            <tbody>\n" +
    "                                                <tr class=\"\">\n" +
    "                                                    <td class=\"\" style=\"background-color:#ffffff;border-left:solid;border-right:solid;border-color: #FFF;color: #ffffff;\">\n" +
    "                                                        <center class=\"\"><br><br>"

let mailBottom="<table cellpadding=\"0\" cellspacing=\"0\" class=\"force-width-80\" style=\"margin: 0 auto;\">\n" +
    "                                                                <tbody>\n" +
    "                                                                    <tr class=\"\">\n" +
    "                                                                        <td class=\"\" style=\"text-align:left; color:#933f24;\"><br>\n" +
    "                                                                            <center class=\"\" style=\"color:#999999; border-top:1px solid #FAFAFA;\"><br>En cas de soucis vous pouvez contacter le support<br><a class=\"\" color:=\"\" data-click-track-id=\"8537\" font-weight:lighter=\"\" href=\"mailto:btssio.quillianchardon@gmail.com\"\n" +
    "                                                                                    style=\"color:#008ACE;\">btssio.quillianchardon@gmail.com</a></center>\n" +
    "                                                                            <br>\n" +
    "                                                                            <br></td>\n" +
    "                                                                    </tr>\n" +
    "                                                                </tbody>\n" +
    "                                                            </table>\n" +
    "                                                        </center>\n" +
    "                                                    </td>\n" +
    "                                                </tr>\n" +
    "                                            </tbody>\n" +
    "                                        </table>\n" +
    "                                        <table bgcolor=\"#414141\" cellpadding=\"0\" cellspacing=\"0\" class=\"force-full-width\" style=\"margin: 0 auto;\">\n" +
    "                                            <tbody>\n" +
    "                                                <tr>\n" +
    "                                                    <td class=\"\" style=\"background-color:#414141;\"></td>\n" +
    "                                                </tr>\n" +
    "                                                <tr>\n" +
    "                                                    <td class=\"\" style=\"color:#bbbbbb; font-size:12px;\"></td>\n" +
    "                                                </tr>\n" +
    "                                                <tr>\n" +
    "                                                    <td class=\"\" style=\"color:#bbbbbb; font-size:12px;\"><br>\n" +
    "                                                        <br> © 2021&nbsp;<span class=\"\" style=\"font-weight:bold;\">Note'Tout</span>\n" +
    "                                                        <br>\n" +
    "                                                        <br></td>\n" +
    "                                                </tr>\n" +
    "                                            </tbody>\n" +
    "                                        </table>\n" +
    "                                    </td>\n" +
    "                                </tr>\n" +
    "                            </tbody>\n" +
    "                        </table>\n" +
    "                    </center>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "\n" +
    "\n" +
    "</body>\n" +
    "\n" +
    "</html>"