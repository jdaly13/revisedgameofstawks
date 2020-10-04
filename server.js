var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
require('dotenv').config({path: __dirname + '/.env'});

var port = process.env.PORT || 3099;
var configDBurl = require('./configuration/database.js').url;
const mongoooseOptions = {
  socketTimeoutMS: 0,
  keepAlive: true,
  //reconnectTries: 30,
  useNewUrlParser: true,
  useUnifiedTopology: true
};


// configuration ===============================================================
mongoose.connect(configDBurl, mongoooseOptions);

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//to use API to fetch user data
var authCheckMiddleware = require('./configuration/auth-check');
const apiRoutes = require('./app/api')(express);
app.use('/api', authCheckMiddleware, apiRoutes);

//auth for login and signup
var authRoutes = require('./app/auth')(express);
app.use('/auth', authRoutes);



//require('./app/routes.js')(app); // crypto, asyncx, nodemailer, express

if (process.env.NODE_ENV === 'development' ) {
  const webpack = require('webpack');
  const config = require('./webpack.dev.config');
  const wpMiddleWare = require('webpack-dev-middleware');
  const wpHotMiddleWare = require('webpack-hot-middleware');
  const compiler = webpack(config);
  const midWare = wpMiddleWare(compiler, {
    stats: {
      colors: true,
      chunks: false,
    },
    publicPath: config.output.publicPath
  });
  app.use(midWare);
  app.use(wpHotMiddleWare(compiler));
} else { // production
  app.use(express.static('dist'));
}

app.get('*', function(req, res, next) {
  res.sendFile(path.resolve(__dirname, "./dist/index.html"))

});

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
