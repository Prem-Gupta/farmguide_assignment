const cookieConfig = {
    HttpOnly: true,
    secure: false,
    resave: true,
    maxAge: 5000000,
    // signed: true, 
    rolling: true,
    saveUninitialized: false
};

module.exports = cookieConfig;
