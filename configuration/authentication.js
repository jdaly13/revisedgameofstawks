var User = require('../app/models/user');
var config = require('./configauth');
var jwt = require('jsonwebtoken');
function login(body, res, next) {
  User.findOne({ 'local.email': body.email }, function(err, user) {
    // if there are any errors, return the error before anything else
    if (err) {
      throw err;
    }

    // if no user is found, return the message
    if (!user) {
      return res.json({
        success: false,
        message: 'Authentication failed. User not found.'
      });
    }

    // if the user is found but the password is wrong
    if (!user.validPassword(body.password)) {
      return res.json({
        success: false,
        message: 'Invalid user name and or password'
      });
    }

    // all is well, return successful user
    var payload = {
        sub: user._id
      },
      token = jwt.sign(payload, config.jwtSecret);

    if (!user.local.startAmount) {
      user.local.startAmount = 100000.0;
    }
    user.local.availableBalance = !user.local.availableBalance
      ? user.local.startAmount
      : user.local.availableBalance;
    user.local.totalInvestedAmount = !user.local.totalInvestedAmount
      ? 0
      : user.local.totalInvestedAmount;
    user.save(function(err) {
      if (err) {
        throw err;
      }
      return res.json({
        success: true,
        message: 'You have successfully logged in!',
        token,
        data: user
      });
    });
  });
}

function signup(body, res, next) {
  User.findOne(
    { $or: [{ 'local.email': body.email }, { 'local.userName': body.name }] },
    function(err, user) {
      // if there are any errors, return the error
      if (err) {
        console.log(err);
      }
      console.log(user, body.email);
      // check to see if theres already a user with that email
      if (user) {
        return res.json({
          success: false,
          message: 'Authentication failed. Email already used'
        });
      } else {
        // if there is no user with that email
        // create the user
        var newUser = new User();

        // set the user's local credentials
        newUser.local.email = body.email;
        newUser.local.password = newUser.generateHash(body.password);
        newUser.local.startAmount = 100000.0;
        newUser.local.availableBalance = newUser.local.startAmount;
        newUser.local.totalInvestedAmount = 0;
        newUser.local.gainOrLoss = 0;
        newUser.local.portfolioValue = newUser.local.startAmount;
        var payload = {
          sub: newUser._id
        },
        token = jwt.sign(payload, config.jwtSecret);

        // save the user
        newUser.save(function(err) {
          if (err) {
            throw err;
          }
          return res.json({
            success: true,
            message: 'You have successfully signed up! Now you should be able to log in.',
            token
          });
        });
      }
    }
  );
}

module.exports = { login, signup };
