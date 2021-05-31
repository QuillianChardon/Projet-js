const Abonnement = require('../datamodel/abonnement')
module.exports=(app,service,userService,typePaymentService,jwt)=> {
    app.post("/abonnement",jwt.validateJWT, async(req,res)=>{
        let Abo=await service.dao.getForUser(req.user.id)
        if(Abo[0]!==undefined){
            res.status(500).end()
        }
        service.dao.insert(new Abonnement(req.body.id,req.user.id,new Date()))
            .then(async e=>{
                let name=await typePaymentService.dao.getById(req.body.id)
                userService.sendMailAchat(req.user.login,name)
                    .then(res.status(200).end())
                    .catch(e=>{
                        console.log(e)
                        res.status(500).end()
                    })

            })
            .catch(e=>{
                console.log(e)
                res.status(500).end()
            })
    })
    app.get("/abonnement",jwt.validateJWT, async(req,res)=>{
        let Abo=await service.dao.getForUser(req.user.id)
        if(Abo[0]!==undefined){
            res.status(404).end()
        }
        res.status(200).end()
    })

}