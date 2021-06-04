module.exports=(app,service,serviceListe,sharedService,jwt)=>{
    //get all
    app.get("/produit",jwt.validateJWT, (req,res)=>{
        service.dao.getAll(req.user)
            .then(produits => {res.json(produits)})
    })


    //get one
    app.get("/produit/:id",jwt.validateJWT,async (req,res) =>{
        try {
            const produit = await service.dao.getById(req.params.id)
            if(produit==undefined){
                return res.status(404).end()
            }
            const liste = await serviceListe.dao.getById(produit.idliste)
            if(liste==undefined){
                return res.status(404).end()
            }

            let flag=false
            for(const shared of await sharedService.dao.getAll(req.user.id)){
                if(liste.id==shared.idliste){
                    flag=true
                }
            }
            if ((liste.useraccount_id !== req.user.id) && (flag==false)){
                return res.status(403).end()
            }

            return res.json(produit)
        }
        catch (e){
            res.status(400).end()
        }
    })

    //get all by liste
    app.get("/produit/liste/:id",jwt.validateJWT, async (req,res)=>{
        try {
           const produit = await service.dao.getAllByListe(req.params.id)
            if(produit==undefined){
                return res.status(404).end()
            }
            if(produit[0]==undefined){
                return res.json(produit)
            }
            const liste = await serviceListe.dao.getById(produit[0].idliste)


            if(liste==undefined){
                return res.status(404).end()
            }

            let flag=false
            for(const shared of await sharedService.dao.getAll(req.user.id)){
                console.log("icic :" + shared)
                if(liste.id==shared.idliste){
                    flag=true
                }
            }
            if ((liste.useraccount_id !== req.user.id) && (flag==false)){
                return res.status(403).end()
            }


            return res.json(produit)
        }
        catch (e){
            console.log(e)
            res.status(400).end()
        }
    })

    //insert
    app.post("/produit",jwt.validateJWT,async (req,res)=>{
        try {
            const produit=req.body
            if(! await service.isValid(produit)){
                return res.status(400).end()
            }
            const liste = await serviceListe.dao.getById(produit.idListe)
            if(liste==undefined){
                return res.status(404).end()
            }

            service.dao.insert(produit)
                .then(_=>{
                    if(liste.useraccount_id !== req.user.id){
                        service.checkNotifForModifPartageListe(liste.id,liste.useraccount_id,req.user.id)
                    }
                    res.status(200).end()
                })
                .catch(e=>{
                    console.log(e)
                    res.status(500).end()
                })
        }
        catch (e){
            console.log(e)
            res.status(400).end()
        }
    })

    //delete
    app.delete("/produit/:id",jwt.validateJWT, async (req,res) => {
        try{
            const produit = await service.dao.getById(req.params.id)
            if(produit===undefined){
                return res.status(404).end()
            }

            const liste = await serviceListe.dao.getById(produit.idliste)
            if(liste==undefined){
                return res.status(404).end()
            }

            let flag=false
            for(const shared of await sharedService.dao.getAll(req.user.id)){
                if(liste.id==shared.idliste){
                    flag=true
                }
            }
            if ((liste.useraccount_id !== req.user.id) && (flag==false)){
                return res.status(403).end()
            }


            service.dao.delete(req.params.id)
                .then(_=>{
                    if(liste.useraccount_id !== req.user.id){
                        service.checkNotifForModifPartageListe(liste.id,liste.useraccount_id,req.user.id)
                    }
                    res.status(200).end()
                })
                .catch(err =>{
                    console.log(err)
                    res.status(500).end()
                })
        }
        catch (err){
            console.log(err)
            res.status(400).end()
        }
    })

    //modification
    app.put("/produit",jwt.validateJWT,async (req,res) => {
        try {
            const produit = req.body
            if((produit.id===undefined)|| (produit.id==null)||(!service.isValid(produit))){
                return res.status(400).end()
            }
            if(await service.dao.getById(produit.id)===undefined){
                return res.status(404).end()
            }

            const liste = await serviceListe.dao.getById(produit.idliste)
            if(liste==undefined){
                return res.status(404).end()
            }

            let flag=false
            for(const shared of await sharedService.dao.getAll(req.user.id)){
                if((liste.id==shared.idliste) &&(shared.droit==true)){
                    flag=true
                }
            }
            if ((liste.useraccount_id !== req.user.id) && (flag==false)){
                return res.status(403).end()
            }

            service.dao.update(produit)
                .then(_=>{
                    if(liste.useraccount_id !== req.user.id){
                        service.checkNotifForModifPartageListe(liste.id,liste.useraccount_id,req.user.id)
                    }
                    res.status(200).end()
                })
                .catch(err=>{
                    console.log(err)
                    res.status(500).end()
                })
        }
        catch (err){
            console.log(err)
            res.status(400).end()
        }
    })
}