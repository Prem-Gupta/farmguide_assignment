const jwt = require('jsonwebtoken');
const User = require('../models/user')
const cookieConfig = require('../utils/cookieConfig');

const auth = async (req, res, next) => {
    try {

        const token = req.cookies.token.token
        const decodedToken = jwt.verify(token, process.env.JsonWebToken)
        const user = await User.findByToken(decodedToken._id)

        if (!user) {
            throw new Error()
        }
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: "Please authenticate" })
    }

}

module.exports = auth