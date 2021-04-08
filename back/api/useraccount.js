module.exports=(app,service,jwt)=>{
    app.post("/useraccount/authentificate", async (req,res)=>{
        const  {login, password} = req.body
        if((login ===undefined) || (password === undefined)){
            res.status(400).end()
            return
        }
         service.validatePassword(login,password)
            .then(async authenticated=> {
                if(!authenticated){
                    res.status(401).end()
                    return
                }

                if(await service.isValide(login)){
                    res.json({'token': jwt.generateJWT(login)})
                }
                else{
                    res.status(406).end()
                    return
                }

            })
            .catch((e=>{
                console.log(e)
                res.status(500).end()
            }))
    })
    app.get("/useraccount",jwt.validateJWT, async(req,res)=>{
        res.json(await service.dao.getAll(req.user.id))
    })

    app.get("/useraccount/share/:id",jwt.validateJWT, async(req,res)=>{
        res.json(await service.dao.getAllShare(req.user.id, req.params.id))
    })

    app.post("/useraccount/inscription",async (req,res)=>{
        const  {login, password,pseudo} = req.body
        if((login ===undefined) || (password === undefined) || (pseudo===undefined)){
            res.status(400).end()
            return
        }

        let user = await service.dao.getByLogin(login)
        if(user!==undefined){
            res.status(401).end()
            return
        }
        service.insert(pseudo, login, password,false,jwt)
            .then(res.status(200).end())
            .catch(e=>{
                console.log(e)
                res.status(400).end()
            })
    })

    app.get("/useraccount/token/:id",jwt.validateLienInscription, async (req,res)=>{
        try{
            if(req.user!== undefined){
                req.user.verif=true
                console.log(req.user)
                if(await service.dao.update(req.user)){
                    if(await service.isValide(req.user.login)){

                        res.json({'login': jwt.generateJWT(req.user.login)})
                        res.status(200).end()
                    }
                    else{
                        res.status(404).end()
                    }
                }
                else{
                    res.status(401).end()
                }
            }
            else{
                res.status(404).end()
            }
        }
        catch (e) {
            console.log(e)
            res.status(500).end()
        }

    })
}

