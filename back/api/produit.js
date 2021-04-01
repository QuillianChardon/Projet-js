module.exports=(app,service,serviceListe)=>{
    //get all
    app.get("/produit", (req,res)=>{
        service.dao.getAll()
            .then(produits => {res.json(produits)})
    })


    //get one
    app.get("/produit/:id",async (req,res) =>{
        try {
            const produit = await service.dao.getById(req.params.id)
            if(produit==undefined){
                return res.status(404).end()
            }
            return res.json(produit)
        }
        catch (e){
            res.status(400).end()
        }
    })

    //get all by liste
    app.get("/produit/liste/:id", async (req,res)=>{
        try {
            // const liste = await serviceListe.dao.getById(req.params.id)
            // if(liste==undefined){
            //     return res.status(404).end()
            // }
            produit = await service.dao.getAllByListe(req.params.id)
            if(produit==undefined){
                return res.status(404).end()
            }
            return res.json(produit)
        }
        catch (e){
            res.status(400).end()
        }
    })

    //insert
    app.post("/produit",async (req,res)=>{
        const produit=req.body
        if(! await service.isValid(produit)){
            return res.status(400).end()
        }
        service.dao.insert(produit)
            .then(res.status(200).end())
            .catch(e=>{
                console.log(e)
                res.status(500).end()
            })
    })

    //delete
    app.delete("/produit/:id", async (req,res) => {
        try{
            const produit = await service.dao.getById(req.params.id)
            if(produit===undefined){
                return res.status(404).end()
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
    })

    //modification
    app.put("/produit",async (req,res) => {
        const produit = req.body
        if((produit.id===undefined)|| (produit.id==null)||(!service.isValid(produit))){
            return res.status(400).end()
        }
        if(await service.dao.getById(produit.id)===undefined){
            return res.status(404).end()
        }
        service.dao.update(produit)
            .then(res.status(200).end())
            .catch(err=>{
                console.log(err)
                res.status(500).end()
            })
    })
}