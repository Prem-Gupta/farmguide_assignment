const express = require('express')
const router = new express.Router()
const User = require('../models/user')

router.get("/signup", (req, res) => {
    res.render("signUpDetails", { error: "" })
})

router.post("/userDetails", async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.render("signUpComplete")
    } catch (e) {
        res.render("signUpDetails", { error: e.message })
    }
})

module.exports = router