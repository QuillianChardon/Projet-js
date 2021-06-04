const notification = require('../datamodel/notification')
module.exports=(app,service,serviceUser,userRoleService,jwt)=>{
    app.get("/notification/notseen",jwt.validateJWT, async(req,res)=>{
        try {
            let notif = await service.dao.getAllNotSeen(req.user.id)
            if(notif==undefined){
                return res.status(404).end()
            }
            console.log(notif)
            res.json(notif)
        }
        catch (e) {
            console.log(e)
            return res.status(500).end()
        }
    })

    app.put("/notification/seen",jwt.validateJWT, async(req,res)=>{
        try {
            let id=req.body.id
            let notif = await service.dao.getById(id)
            if(notif==undefined){
                return res.status(404).end()
            }

            console.log(notif)
            notif.vue=true
            service.dao.update(notif)
                .then(res.status(200).end())
                .catch(err=>{
                    console.log(err)
                    res.status(500).end()
                })
        }
        catch (e) {
            console.log(e)
            return res.status(500).end()
        }
    })

    app.post("/notification",jwt.validateJWT, async(req,res)=>{
        try {
            let rolePourUser = await userRoleService.daoUserRole.getAllByUser(req.user.id,"administrateur")
            if(rolePourUser[0]==undefined){
                res.status(401).end()
            }
            else {
                let idUser= req.body.id
                let texte=req.body.texte
                let titre=req.body.titre

                if(await serviceUser.dao.getById(idUser)===undefined){
                    res.status(404).end()
                }
                if(idUser!==undefined && texte!==undefined && idUser!==undefined){
                    service.dao.insert(new notification(idUser,titre,texte,false,new Date()))
                        .then(res.status(200).end())
                        .catch(err=>{
                            console.log(err)
                            res.status(500).end()
                        })
                }
                else{
                    res.status(404).end()
                }
            }
        }
        catch (e) {
            console.log(e)
            return res.status(500).end()
        }
    })
}