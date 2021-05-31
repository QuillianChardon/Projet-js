module.exports=(app,service,jwt)=> {
    app.get("/typepayment",jwt.validateJWT, async(req,res)=>{
        res.json(await service.dao.getAll())
    })
    app.get("/typepayment/:id",jwt.validateJWT, async(req,res)=>{
        let name=req.params.id
        let type=await service.dao.getByName(name)
        if(type===undefined){
            return res.status(404).end()
        }
        res.json(type)
    })
}