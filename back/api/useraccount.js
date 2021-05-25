module.exports=(app,service,jwt)=>{
    app.post("/useraccount/authentificate", async (req,res)=>{
        const  {login, password} = req.body
        if((login ===undefined) || (password === undefined)){
            res.status(400).end()
            return
        }
        if(await service.dao.getByLogin(login)==undefined){
            res.status(401).end()
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

    app.get("/useraccount/sendMail/:id", async (req,res)=>{
        let login= req.params.id
        await service.sendMail(login,jwt).then(res.status(200).end())
            .catch(e=>{
                console.log(e)
                res.status(400).end()
            })
    })

    app.get("/useraccount/One",jwt.validateJWT,async (req,res) => {
        try {
            console.log(req.user.id)
            const user = await service.dao.getById(req.user.id)
            if(user==undefined){
                return res.status(404).end()
            }
            return res.json(user)
        } catch (e) {
            console.log(e)
            res.status(500).end()
        }
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

    app.get("/useraccount/sendMailBylogin/:id",async (req,res)=>{
        try{
            let user = await service.dao.getByLogin(req.params.id)
            if(user!==undefined){
                await service.sendMailChangePassword(req.params.id,jwt)
                res.status(200).end()
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

    app.post("/useraccount/modificationPassword",jwt.validateLienPassword,async (req,res)=>{
        try{
            const  {token, password} = req.body
            if((token ===undefined) || (password === undefined)){
                res.status(400).end()
                return
            }

            console.log(req.user)

            req.user.challenge=service.hashPassword(password)
            if(await service.dao.update(req.user)){
                res.status(200).end()
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

    app.post("/useraccount/modif/email",jwt.validateJWT,async (req,res)=>{
        const email = req.body.login
        if(await service.dao.getByLogin(email)!=undefined){
            return res.status(401).end()
        }
        if(req.user==undefined){
            return res.status(500).end()
        }
        let userbdd = await service.dao.getByIdAllColonne(req.user.id)
        if(userbdd==undefined){
            return res.status(404).end()
        }

        userbdd.login=email
        service.dao.update(userbdd)
            .then(e=>{
                    res.json({'token': jwt.generateJWT(email)});
                    res.status(200).end();
            })
            .catch(err=>{
                console.log(err)
                return res.status(500).end()
            })
    })

    app.post("/useraccount/modif/password",jwt.validateJWT,async (req,res)=>{
        const password = req.body.password
        console.log("ici")
        console.log(password)

        if(req.user==undefined){
            return res.status(500).end()
        }
        let userbdd = await service.dao.getByIdAllColonne(req.user.id)
        if(userbdd==undefined){
            return res.status(404).end()
        }
        Hashpassword= await service.hashPassword(password)
        userbdd.challenge=Hashpassword
        service.dao.update(userbdd)
            .then(e=>{
                res.status(200).end();
            })
            .catch(err=>{
                console.log(err)
                return res.status(500).end()
            })
    })


}

