const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = new mongoose.Schema({

    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowerCase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid')
            }
        }
    },

    mobile: {
        type: Number,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error("Password should not contain word password ")
            }
        }
    },
    repeatpassword: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error("Password should not contain word password ")
            }
        }
    }
})

User.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    if (user.isModified('repeatpassword')) {
        user.repeatpassword = await bcrypt.hash(user.repeatpassword, 8)
    }
    next()
})

User.pre("save", function (next) {
    const self = this
    userDetails.findOne({ email: self.email }, function (err, results) {
        if (err) {
            next(err);
        } else if (results) {
            self.invalidate("email", "email must be unique");
            next(new Error("This email already registered"))

        } else {
            next();
        }
    });

});


User.pre("save", function (next) {
    const self = this
    userDetails.findOne({ mobile: self.mobile }, function (err, results) {
        if (err) {
            next(err);
        } else if (results) {
            self.invalidate("mobile", "mobile no must be unique");
            next(new Error("This mobile number already register"))

        } else {
            next();
        }
    });


});

User.statics.findByCredentials = async (email, password) => {

    const user = await userDetails.findOne({ email })
    if (!user) {
        throw "Your email is not registered. Please create your account"
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw "Your Password Is Wrong"
    }

    return user
}

User.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JsonWebToken)
    return token
}

User.statics.findByToken = async (_id) => {
    const user = await userDetails.findById({ _id })
    if (!user) {
        throw "Your mobile is not registered. Please create your account"
    }
    return user
}

User.statics.findMobile = async (mobile) => {
    const user = await userDetails.findOne({ mobile })
    if (!user) {
        throw "Your mobile is not registered. Please create your account"
    }

    return user

}

const userDetails = mongoose.model('userDetails', User)
module.exports = userDetails