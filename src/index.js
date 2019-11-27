const express = require('express')
const app = express()
var path = require("path");
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

require('./db/mongoose')

const userRouter = require('./routers/signUp')
const loginRouter = require('./routers/login')
const profileRouter = require('./routers/profile')
const logoutRouter = require('./routers/logout')

const port = process.env.PORT
BaseUrl = process.env.BaseUrl;

app.use(express.json())
app.use(bodyParser.json());
app.use(cookieParser())


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
// set path for static assets
app.use(express.static(path.join(__dirname, "public")));

app.use(userRouter)
app.use(loginRouter)
app.use(profileRouter)
app.use(logoutRouter)

app.listen(port, () => {
    console.log("Server is connected on port " + port)
})

