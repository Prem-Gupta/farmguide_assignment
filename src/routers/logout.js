const auth = require('../middleware/auth')
const express = require('express')
const router = new express.Router()


router.get('/logout', auth, (req, res) => {

    const tokenCookie = req.cookies.token.token;
    if (tokenCookie) {
        res.clearCookie('token', { path: '/' });
        res.redirect("/");
    }
    else {
        res.clearCookie('token', { path: '/' });
        res.redirect("/");
    }

})

module.exports = router