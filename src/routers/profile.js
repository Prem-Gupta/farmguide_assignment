const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

router.get('/profile', auth, (req, res) => {
    const user = req.user
    res.render("profile", { user: user })
})

module.exports = router