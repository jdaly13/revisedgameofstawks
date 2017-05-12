// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3099;
var mongoose = require('mongoose');
var bodyParser   = require('body-parser');
var bcrypt       = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var passport = require('passport');

var asyncx       = require('async');
var crypto       = require('crypto');

var configDBurl = require('./configuration/database.js').url;
//var config = require('./configuration/auth.js');

// configuration ===============================================================
mongoose.connect(configDBurl); // connect to our database
//app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

//passport
require('./configuration/passport')(passport, jwt)
//var localLoginStrategy = require('./server/passport/local-login');
//passport.use('local-signup', localSignupStrategy);
//passport.use('local-login', localLoginStrategy);

// pass the authenticaion checker middleware
var authCheckMiddleware = require('./configuration/auth-check');
app.use('/api', authCheckMiddleware);

//app.set('view engine', 'html'); // set up ejs for templating
app.use(express.static('public'))

//routes
var authRoutes = require('./app/auth.js');
app.use('/auth', authRoutes);
require('./app/routes.js')(app, jwt, crypto, asyncx, nodemailer, express);


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
