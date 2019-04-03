var express = require('express');
var app = express();
var port = process.env.PORT || 3099;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var configDBurl = require('./configuration/database.js').url;
const mongoooseOptions = {
  useMongoClient: true,
  socketTimeoutMS: 0,
  keepAlive: true,
  reconnectTries: 30
};

// configuration ===============================================================
mongoose.connect(configDBurl, mongoooseOptions);

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//app.use(express.static('live'));
app.use(express.static('public'));

//to use API to fetch user data
var authCheckMiddleware = require('./configuration/auth-check');
const apiRoutes = require('./app/api')(express);
app.use('/api', authCheckMiddleware, apiRoutes);

//auth for login and signup
var authRoutes = require('./app/auth')(express);
app.use('/auth', authRoutes);

require('./app/routes.js')(app); // crypto, asyncx, nodemailer, express

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
