module.exports=(app,service,serviceShared,jwt)=>{
    //get all
    app.get("/liste",jwt.validateJWT, async(req,res)=>{
        res.json(await service.dao.getAll(req.user))
    })

    //get one
    app.get("/liste/:id",jwt.validateJWT,async (req,res) =>{
        try {
            const liste = await service.dao.getById(req.params.id)
            if(liste==undefined){
                return res.status(404).end()
            }
            let flag=false
            for(const shared of await serviceShared.dao.getAll(req.user.id)){
                if(liste.id==shared.idliste){
                    flag=true
                }
            }
            if ((liste.useraccount_id !== req.user.id) && (flag==false)){
                return res.status(403).end()
            }


            return res.json(liste)
        }
        catch (e){
            res.status(400).end()
        }
    })

    //insert
    app.post("/liste",jwt.validateJWT,(req,res)=>{
        const liste=req.body
        console.log(liste)
        if(!service.isValid(liste)){
            return res.status(400).end()
        }

        console.log(liste)
        if(liste.useraccount_id==undefined){
            liste.useraccount_id = req.user.id
        }

        service.dao.insert(liste)
            .then(id=>{
                res.json(id)
                res.status(200).end()
            })
            .catch(e=>{
                console.log(e)
                res.status(500).end()
            })
    })

    //delete
    app.delete("/liste/:id" ,jwt.validateJWT, async (req,res) => {
        try{
            console.log("ici")
            const liste = await service.dao.getById(req.params.id)
            if(liste===undefined){
                return res.status(404).end()
            }

            let flag=false
            for(const shared of await serviceShared.dao.getAll(req.user.id)){
                if(liste.id==shared.idliste){
                    flag=true
                }
            }
            if ((liste.useraccount_id !== req.user.id) && (flag==false)){
                return res.status(403).end()
            }

            for(let shared of await serviceShared.dao.getAllByListe(liste.id)){
                serviceShared.dao.delete(shared.id)
            }

            service.dao.delete(req.params.id)
                .then(res.status(200).end())
                .catch(err =>{
                    console.log(err)
                    res.status(500).end()
                })
        }
        catch (err){
            console.log(err)
            res.status(400).end()
        }
    })//delete


    //modification
    app.put("/liste", jwt.validateJWT,async (req,res) => {
        const liste = req.body

        if((liste.id===undefined)|| (liste.id==null)||(!service.isValid(liste))){
            console.log(liste)
            return res.status(400).end()
        }
        const prevListe=await service.dao.getById(liste.id)
        if(prevListe===undefined){
            return res.status(404).end()
        }

        let flag=false
        for(const shared of await serviceShared.dao.getAll(req.user.id)){
            if(prevListe.id==shared.idliste){
                flag=true
            }
        }
        if ((prevListe.useraccount_id !== req.user.id) && (flag==false)){
            return res.status(403).end()
        }

        service.dao.update(liste)
            .then(res.status(200).end())
            .catch(err=>{
                console.log(err)
                res.status(500).end()
            })
    })
}