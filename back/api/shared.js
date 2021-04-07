module.exports=(app,service,listeService,jwt)=> {

    app.get("/shared",jwt.validateJWT, (req,res)=>{
        service.dao.getAll(req.user.id)
            .then(shared => {
                res.json(shared)
            })
    })


    app.get("/shared",jwt.validateJWT, (req,res)=>{
        service.dao.getAll(req.user.id)
            .then(shared => {res.json(shared)})
    })

    //get all by liste
    app.get("/shared/liste/:id",jwt.validateJWT, async (req,res)=>{
        try {
            const shared = await service.dao.getAllByListe(req.params.id)
            if(shared==undefined){
                return res.status(404).end()
            }
            console.log(shared)
            return res.json(shared)
        }
        catch (e){
            res.status(400).end()
            console.log(e)
        }
    })

    //insert
    app.post("/shared",jwt.validateJWT, async (req,res)=>{
        const shared=req.body
        console.log(shared)
        if(!service.isValid(shared)){
            return res.status(400).end()
        }
        const obj = await listeService.dao.getById(shared.idListe)
        console.log(obj)
        if(obj.useraccount_id = req.user.id){
            service.dao.insert(shared)
                .then(res.status(200).end())
                .catch(e=>{
                    console.log(e)
                    res.status(500).end()
                })
        }
        else{
            res.status(403).end()
        }

    })

    app.get("/shared/:id",jwt.validateJWT, async (req,res)=>{
        try{
            const shared = await service.dao.getById(req.params.id)
            if(shared==undefined){
                return res.status(404).end()
            }
            return res.json(shared)
        }
        catch (e){
            console.log("ici")
            console.log(e)
            console.log("la")
            res.status(400).end()
        }
    })

    //modification
    app.put("/shared", jwt.validateJWT,async (req,res) => {
        const shared = req.body
        if((shared.id===undefined)|| (shared.id==null)||(!service.isValid(shared))){
            return res.status(400).end()
        }

        const liste = await listeService.dao.getById(shared.idliste)
        if(liste===undefined){
            return res.status(404).end()
        }

        let flag=false
        for(const shared of await service.dao.getAll(req.user.id)){
            if(liste.id==shared.idliste){
                flag=true
            }
        }
        if ((liste.useraccount_id !== req.user.id) && (flag==false)){
            return res.status(403).end()
        }

        service.dao.update(shared)
            .then(res.status(200).end())
            .catch(err=>{
                console.log(err)
                res.status(500).end()
            })
    })






}