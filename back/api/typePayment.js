module.exports=(app,service,jwt)=> {
    app.get("/typepayment",jwt.validateJWT, async(req,res)=>{
        res.json(await service.dao.getAll())
    })
    app.get("/typepayment/:id",jwt.validateJWT, async(req,res)=>{
        try{
            let name=req.params.id
            let type=await service.dao.getByName(name)
            if(type===undefined){
                return res.status(404).end()
            }
            res.json(type)
        }
        catch (err){
            console.log(err)
            res.status(400).end()
        }
    })
    app.get("/typepayment/id/:id",jwt.validateJWT, async(req,res)=>{
        try{
            let id=req.params.id
            let type=await service.dao.getById(id)
            if(type===undefined){
                return res.status(404).end()
            }
            res.json(type)
        }
        catch (err){
            console.log(err)
            res.status(400).end()
        }
    })
}