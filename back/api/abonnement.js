const Abonnement = require('../datamodel/abonnement')
const userRole = require('../datamodel/userRole')
module.exports=(app,service,userService,typePaymentService,userRoleService,listeService,jwt)=> {
    app.post("/abonnement",jwt.validateJWT, async(req,res)=>{
        try{
            let Abo=await service.dao.getForUser(req.user.id)
            if(Abo[0]!==undefined){
                res.status(500).end()
            }
            service.dao.insert(new Abonnement(req.body.id,req.user.id,new Date()))
                .then(async e=>{
                    let userRoleTempo=new userRole(3,req.user.id,new Date())
                    console.log(userRoleTempo)
                   await userRoleService.daoUserRole.insert(userRoleTempo)
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
        } catch (e) {
            console.log(e)
            res.status(500).end()
        }
    })
    app.get("/abonnement",jwt.validateJWT, async(req,res)=>{
        try{
            let Abo=await service.dao.getForUser(req.user.id)
            if(Abo[0]!==undefined){
                res.status(404).end()
            }
            res.status(200).end()
        } catch (e) {
            console.log(e)
            res.status(500).end()
        }
    })

    app.get("/abonnement/all",jwt.validateJWT, async(req,res)=>{
        try{
            res.json(await service.dao.getAll())
        } catch (e) {
            console.log(e)
            res.status(500).end()
        }
    })


    app.get("/abonnement/Premium/Liste",jwt.validateJWT, async(req,res)=>{
        try{
            let nbListeOpen = await listeService.dao.countOpen(req.user)
            let Abo=await service.dao.getForUser(req.user.id)
            console.log(Abo[0])
            console.log(nbListeOpen[0])
            console.log("ici ---- 129 ---")
            if(Abo[0]==undefined && nbListeOpen[0]!==undefined){
                if(nbListeOpen[0].count>=1){
                    res.status(423).end()
                }
            }
            else{
                res.status(200).end()
            }
        } catch (e) {
            console.log(e)
            res.status(500).end()
        }
    })
}