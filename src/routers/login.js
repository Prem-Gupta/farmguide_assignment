const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const cookieConfig = require('../utils/cookieConfig');
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
    apiKey: process.env.apiKey,
    apiSecret: process.env.apiSecret,
});
router.get('/', (req, res) => {
    res.render("login")
})

router.get('/emaillogin', (req, res) => {
    res.render("loginWithEmail", { error: "" })
})

router.get('/mobilelogin', (req, res) => {
    res.render("loginWithMobile", { error: "" })
})

router.post("/loginEmailAccount", async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        var cookieInfo = {
            token: token,
        };
        res.cookie("token", cookieInfo, cookieConfig);
        res.render("welcome", { error: "" })
    } catch (e) {
        res.render("loginWithEmail", { error: e })
    }
})


router.post("/loginMobileAccount", async (req, res) => {

    try {
        const user = await User.findMobile(req.body.mobile)
        let mobile = ""
        if (user) {

            mobile = "91" + user.mobile
            nexmo.verify.request({
                number: mobile,
                pin_expiry: '60',
                next_event_wait: '60',
                brand: 'NEXMO',
                code_length: '6'
            }, (e, result) => {
                console.log(e)
                if (e) {
                    res.render("loginWithMobile", { error: e })
                } else {
                    res.render("otpMobile", { error: "", id: result.request_id, mobile: mobile })
                }
            });
        }
    } catch (e) {
        res.render("loginWithMobile", { error: e })
    }
})


router.post("/otpLogin", async (req, res) => {
    const id = req.body.id
    const mobile = req.body.mobile
    let mobileNumber = mobile.toString()
    mobileNumber = parseInt(mobileNumber.substring(2))
    const user = await User.findMobile(mobileNumber)
    console.log(user);
    const token = await user.generateAuthToken()
    console.log(token)
    var cookieInfo = {
        token: token,
    };
    res.cookie("token", cookieInfo, cookieConfig);

    try {
        nexmo.verify.check({
            request_id: id,
            code: 'CODE'
        }, (e, result) => {
            if (e) {
                res.render("otpMobile", { error: e.error_text, id: id, mobile: mobile })
            } else {


                res.render("welcome", { error: "" })
            }
        });
    } catch (e) {
        res.render("otpMobile", { error: e, id: id, mobile: mobile })
    }
})


router.post("/resendOtp", async (req, res) => {
    const id = req.body.id
    const mobile = req.body.mobile

    try {
        nexmo.verify.control({
            request_id: id,
            cmd: 'cancel'
        }, (e, result) => {
            if (e) {
                res.render("otpMobile", { error: "", id: "", mobile: mobile })
            } else {
                nexmo.verify.request({
                    number: mobile,
                    pin_expiry: '60',
                    next_event_wait: '60',
                    brand: 'NEXMO',
                    code_length: '6'
                }, (e, result) => {
                    if (e) {
                        console.log(e)
                    }
                });
            }
        });
    } catch (e) {
        res.render("otpMobile", { error: e, id: id, mobile: mobile })
    }
})


module.exports = router