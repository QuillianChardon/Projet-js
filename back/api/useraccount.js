const userRole = require('../datamodel/userRole')
module.exports=(app,service,UserRoleService,jwt)=>{
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
                let user =await service.dao.getByLogin(login)
                if(user.active==false){
                    res.status(423).end()
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
        service.insert(pseudo, login, password,false,true,jwt)
            .then(async e=>{
                let userTempo=await service.dao.getByLogin(login)
                let userRoleInscr=new userRole(1,userTempo.id,new Date())
                await UserRoleService.daoUserRole.insert(userRoleInscr)
                res.status(200).end()
            })
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

    app.get("/useraccount/modificationPassword",jwt.validateLienPassword,async (req,res)=>{
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

    app.put("/useraccount/modif/email",jwt.validateJWT,async (req,res)=>{
        const email = req.body.login
        if(await service.dao.getByLogin(email)!=undefined){
            return res.status(401).end()
        }
        if(req.user==undefined){
            return res.status(500).end()
        }
        console.log(req.user)
        let userbdd = await service.dao.getByIdAllColonne(req.user.id)
        if(userbdd===undefined){
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

    app.put("/useraccount/modif/password",jwt.validateJWT,async (req,res)=>{
        const password = req.body.password
        console.log("ici")
        console.log(password)

        if(req.user===undefined){
            return res.status(500).end()
        }
        let userbdd = await service.dao.getByIdAllColonne(req.user.id)
        if(userbdd===undefined){
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

    app.get("/useraccount/isAdmin",jwt.validateJWT,async (req,res)=> {

        let rolePourUser = await UserRoleService.daoUserRole.getAllByUser(req.user.id,"administrateur")
        console.log("----------")
        console.log(rolePourUser)
        if(rolePourUser[0]==undefined){
            res.status(401).end()
        }
        else{
            res.status(200).end();
        }
    })

    app.get("/useraccount/one/:id",jwt.validateJWT,async (req,res) => {
        try {
            let rolePourUser = await UserRoleService.daoUserRole.getAllByUser(req.user.id,"administrateur")
            if(rolePourUser[0]==undefined){
                res.status(401).end()
            }
            else {
                console.log(req.user.id)
                const user = await service.dao.getByIdForAdmin(req.params.id)
                if(user==undefined){
                    return res.status(404).end()
                }
                console.log(user)
                return res.json(user)
            }
        } catch (e) {
            console.log(e)
            res.status(500).end()
        }
    })



    app.put("/useraccount/modif/emailAdmin",jwt.validateJWT,async (req,res)=>{
        const email = req.body.login
        const id =req.body.id

        if(await service.dao.getByLogin(email)!=undefined){
            return res.status(401).end()
        }

        let rolePourUser = await UserRoleService.daoUserRole.getAllByUser(req.user.id,"administrateur")
        if(rolePourUser[0]==undefined){
            res.status(401).end()
        }
        else {
            if (req.user == undefined) {
                return res.status(500).end()
            }
            let userbdd = await service.dao.getByIdAllColonne(id)
            if (userbdd == undefined) {
                return res.status(404).end()
            }
            userbdd.login=email
            service.dao.update(userbdd)
                .then(e => {
                    res.status(200).end();
                })
                .catch(err => {
                    console.log(err)
                    return res.status(500).end()
                })
        }
    })


    app.put("/useraccount/modif/passwordAdmin",jwt.validateJWT,async (req,res)=>{
        const password = req.body.password
        const id =req.body.id

        let rolePourUser = await UserRoleService.daoUserRole.getAllByUser(req.user.id,"administrateur")
        if(rolePourUser[0]==undefined){
            res.status(401).end()
        }
        else {
            if (req.user == undefined) {
                return res.status(500).end()
            }
            let userbdd = await service.dao.getByIdAllColonne(id)
            if (userbdd == undefined) {
                return res.status(404).end()
            }
            console.log(userbdd)
            console.log(password)
            Hashpassword = await service.hashPassword(password)
            userbdd.challenge = Hashpassword
            service.dao.update(userbdd)
                .then(e => {
                    res.status(200).end();
                })
                .catch(err => {
                    console.log(err)
                    return res.status(500).end()
                })
        }
    })

    app.post("/useraccount/allRoleForAdmin",jwt.validateJWT,async (req,res)=>{
        const id =req.body.id
        console.log(id)
        res.json(await UserRoleService.daoUserRole.getAllByUserForAdmin(id))
    })
    app.post("/useraccount/allRoleNotInUserForAdmin/",jwt.validateJWT,async (req,res)=>{

        const id =req.body.id
        console.log(id)
        res.json(await UserRoleService.daoUserRole.getAllByUserNoInForAdmin(id))
    })
    app.put("/useraccount/modifRolePourUnUtilisateurDonne/",jwt.validateJWT,async (req,res)=>{

        const roleId =req.body.roleId
        const idUser =req.body.idUser
        let tempo =await UserRoleService.daoUserRole.getAllByUserForAdminOnlyId(idUser,roleId)
        if(tempo[0]!==undefined){
            //delet
            UserRoleService.daoUserRole.deletebyidUser(idUser,roleId).then(e => {
                console.log("ici1-1")
                res.status(200).end();
            })
                .catch(err => {
                    console.log("ici1-2")
                    console.log(err)
                    return res.status(500).end()
                })
        }
        else{
            //insert
            let oneUserRole = new userRole(roleId,idUser,new Date())
            console.log(oneUserRole)
            UserRoleService.daoUserRole.insert(oneUserRole  ).then(e => {
                console.log("ici2-1")
                    res.status(200).end();
                })
                .catch(err => {
                    console.log("ici2-2")
                    console.log(err)
                    return res.status(500).end()
                })
        }
    })


    app.put("/useraccount/modif/actifAdmin",jwt.validateJWT,async (req,res)=>{

        const id =req.body.id
        let User = await service.dao.getByIdAllColonne(id)
        if(User.active){
            User.active=false
        }
        else{
            User.active=true
        }
        service.dao.update(User)
            .then(e => {
                res.status(200).end();
            })
            .catch(err => {
                console.log(err)
                return res.status(500).end()
            })
    })

    app.get("/useraccount/isActive",jwt.validateJWT,async (req,res)=>{
        const user = await service.dao.getByIdAllColonne(req.user.id)
        if(user.active===true){
            res.status(200).end();
        }
        else{
            res.status(423).end();
        }
    })
}

