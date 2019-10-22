// app/models/user.js
// load the things we need
'use strict';
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local : {
        email        : String,
        password     : String,
	    userName	 : String,
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        startAmount: Number,
        totalInvestedAmount: Number,
        netBalance: Number,
        gainOrLoss: Number,
        availableBalance: Number,
        portfolioValue: Number,
        portfolioCashValue: {type: Number, default: 0 },
        portfolio:[{
            symbol: String,
            name: String,
            noOfShares: Number,
            pershareavg: Number,
            investedamount: Number
        }],
        purchases:[{
            symbol: String,
            name: String,
            noOfShares: Number,
            purchaseprice: Number,
            purchaseamount: Number
        }],
        sells:[{
            symbol: String,
            name: String,
            noOfShares: Number,
            sellprice: Number,
            sellamount: Number
        }]
    }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.getBalance = function() {
     return this.startAmount - (this.total || 0);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
