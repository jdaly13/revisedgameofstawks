// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
// load up the user model
var User            = require('../app/models/user');
var config          = require('./configauth');

module.exports = function (passport, jwt) {

  passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      session: false,
      passReqToCallback : true // allows us to pass back the entire request to the callback
  }, function(req, email, password, done) {

      // asynchronous
      // User.findOne wont fire unless data is sent back
      process.nextTick(function() {

          // find a user whose email is the same as the forms email
          // we are checking to see if the user trying to login already exists
          User.findOne({ 'local.email' :  email }, function(err, user) {
              // if there are any errors, return the error
              if (err)
                  return done(err);

              // check to see if theres already a user with that email
              if (user) {
                  return done(null, false);
              } else {

                  // if there is no user with that email
                  // create the user
                  var newUser            = new User();

                  // set the user's local credentials
                  newUser.local.email    = email;
                  newUser.local.password = newUser.generateHash(password);
                  newUser.local.startAmount = 100,000;
                  newUser.local.total = 0;

                  // save the user
                  newUser.save(function(err) {
                      if (err)
                          throw err;
                      return done(null, newUser);
                  });
              }

          });

      });

  }));

  passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true, // allows us to pass back the entire request to the callback
				session: false 
    },
    function(req, email, password, done) { // callback with email and password from our form
				console.log(email);
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(new Error('invalid username or password')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(new Error('invalid username or password')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            var payload = {
              sub: user._id
            },
            token = jwt.sign(payload, config.jwtSecret);

            if (!user.local.startAmount) {
                user.local.startAmount = 100000.00;
            }
            user.local.availableBalance = (!user.local.availableBalance) ? user.local.startAmount : user.local.availableBalance;
            user.local.totalInvestedAmount = (!user.local.totalInvestedAmount) ? 0 : user.local.totalInvestedAmount;
            user.save(function(err) {
                if (err)
                    throw err;
                return done(null, token, user);
            });
        });

    }));

}
