module.exports=(app,service,jwt)=>{
    app.post("/useraccount/authentificate",(req,res)=>{
        const  {login, password} = req.body
        if((login ===undefined) || (password === undefined)){
            res.status(400).end()
            return
        }
        service.validatePassword(login,password)
            .then(authenticated=>{
                if(!authenticated){
                    res.status(401).end()
                    return
                }
                res.json({'token': jwt.generateJWT(login)})

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
        console.log("laaaa")
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
        service.insert(pseudo, login, password)
            .then(res.status(200).end())
            .catch(e=>{
                console.log(e)
                res.status(400).end()
            })
    })
}