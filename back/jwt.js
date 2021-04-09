const jwt = require('jsonwebtoken')
const jwtKey = 'exemple_cours_secret_key'
const jwtExpirySeconds = 3600
const jwtExpiry1Day = 86400
const jwtExpiry30Min = 1800

module.exports = (userAccountService) => {
    return {
        validateJWT(req, res, next) {
            if (req.headers.authorization === undefined) {
                res.status(401).end()
                return
            }
            const token = req.headers.authorization.split(" ")[1];
            jwt.verify(token, jwtKey, {algorithm: "HS256"},  async (err, user) => {
                if (err) {
                    res.status(401).end()
                    return
                }
                console.log(user)
                try {
                    req.user = await userAccountService.dao.getByLogin(user.login)
                    return next()
                } catch(e) {
                    console.log(e)
                    res.status(401).end()
                }
            })
        },
        generateJWT(login) {
            return jwt.sign({login}, jwtKey, {
                algorithm: 'HS256',
                expiresIn: jwtExpirySeconds
            })
        },

        generateLienValidation(id) {
            return jwt.sign({id}, jwtKey, {
                algorithm: 'HS256',
                expiresIn: jwtExpiry1Day
            })
        },



        async validateLienInscription(req, res,next) {
            let token= req.params.id
            jwt.verify(token, jwtKey, {algorithm: "HS256"},  async (err, user) => {
                if (err) {
                    res.status(401).end()
                    return
                }
                try {
                    req.user = await userAccountService.dao.getByLogin(user.id)
                    return next()
                } catch(e) {
                    console.log(e)
                    res.status(401).end()
                }
            })
        },

        generateLienChangePassword(id) {
            return jwt.sign({id}, jwtKey, {
                algorithm: 'HS256',
                expiresIn: jwtExpiry30Min
            })
        },

        async validateLienPassword(req, res,next) {
            const  {token, password} = req.body
            if((token ===undefined) || (password === undefined)){
                res.status(400).end()
                return
            }
            jwt.verify(token, jwtKey, {algorithm: "HS256"},  async (err, user) => {
                if (err) {
                    console.log(err)
                    res.status(401).end()
                    return
                }
                try {
                    req.user = await userAccountService.dao.getByLogin(user.id)
                    return next()
                } catch(e) {
                    console.log(e)
                    res.status(401).end()
                }
            })
        }
    }
}
