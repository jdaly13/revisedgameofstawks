var User =    require('./models/user');
var sendToken = require('./token');

module.exports = function(express) {
  const router = new express.Router();
  let responseObj = {};
  router.get('/dashboard', (_req, res) => {
    const data = res.data;
    console.log('response.data.dashboard', data.availableBalance, data.sells);
    res.status(200).json({
      message: res.data.email,
      data
    });
  });

  router.get('/getTokenInfo', (req, res) => {
    res.status(200).json({
        network: process.env.NETWORK
    });
  });

  router.get('/tokenTransaction', (req, res) => {
      console.log('res.data', res.data);
    User.findOne({ 'local.email' :  res.data.email}, function(err, user) {
        if (err) {
            return res.status(500).json({
                message: "service unavailable",
                error: err
            })
        }
        // if no user is found, return the message
        if (!user) {
            //return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            return res.status(404).json({
                message: "user not found"
            });
        }
        // promise hasn't resolved yet 
        if (typeof(responseObj.tokenSendSuccess) !== 'boolean') {
            return res.status(200).json({
                success: false
            })
        }
        console.log('responseobj', responseObj)
        const arrayToPush = responseObj.tokenSendSuccess ? user.local.tokensGivenAndReceived : user.local.tokensGivenAndRejected;
        arrayToPush.push({
            symbol: responseObj.symbol,
            address: responseObj.address,
            amount: responseObj.amount
        });
        user.save(function(err) {
            if (err) {
                return res.status(500).json({
                    error:err
                })
            }
            responseObj = {};  
            return res.status(200).json({
                success:true,
                id: responseObj.symbol,
                data: user.local
            });

        });
    })
  });

  router.post('/purchaseequities', (req, res) => {
    var price = +parseFloat(req.body.price).toFixed(2),
    noOfShares = +parseFloat(req.body.noOfShares).toFixed(2),
    symbol = req.body.symbol,
    name = req.body.name || "Not Available Currently",
    alreadyInPortfolio = false,
    investedAmount = price * noOfShares;

    function buyAction (user) {
        var portfolioValue = user.availableBalance;
        if (investedAmount > portfolioValue) {
            return false;
        }
        user.purchases.push({
            symbol: symbol,
            name: name,
            noOfShares: noOfShares,
            purchaseprice: price,
            purchaseamount: investedAmount
        });
        return true;
    }
    // TODO Remove this not needed already did find in authCheck
    User.findOne({ 'local.email' :  res.data.email}, function(err, user) {
        // deep copy TODO use lodash or another deep coyp function
        const copied = JSON.parse(JSON.stringify(user.local));
        // if there are any errors, return the error before anything else
        if (err)
            return res.status(500).json({
                message: "service unavailable",
                error: err
            })

        // if no user is found, return the message
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            });
        }

        if (!buyAction(copied)) {
            return res.status(400).json({
                message: "You don't have enough funds"
            })
        } else {
            copied.availableBalance = copied.availableBalance - investedAmount;
            copied.totalInvestedAmount += investedAmount;
            copied.portfolio.forEach(function (obj) {
                if (obj.symbol === symbol) {
                    obj.noOfShares += noOfShares;
                    obj.investedamount += investedAmount;
                    obj.pershareavg = obj.investedamount / obj.noOfShares;
                    alreadyInPortfolio = true;
                }
            });

            if (!alreadyInPortfolio) {
                pushObject = {
                    symbol: symbol,
                    name: name,
                    noOfShares: noOfShares,
                    pershareavg: price,
                    investedamount: investedAmount
                }
                copied.portfolio.push(pushObject);
            }
            user.local = copied;
        }

        
        user.save(function(err) {
            if (err) {
                return res.status(500).json({
                    error:err
                })
            }
               
            return res.status(200).json({
                success:true,
                id: symbol,
                data: user.local
            });
        });
    });
  });

  router.post('/sellequities', (req, res) => {
    var price = +parseFloat(req.body.price).toFixed(2),
    noOfShares = +parseFloat(req.body.noOfShares).toFixed(2),
    symbol = req.body.symbol,
    name = req.body.name || "Not Available Currently",
    sellAmount = price * noOfShares,
    etherAddress = req.body.address,
    indexAndSellObj = false;

    
    function sellAction (user) {
        var message = false,
            match = false,
            portfolioIndex;
        const {portfolio} = user;
        for (var i=0; i<portfolio.length; i++) {
            if (portfolio[i].symbol === symbol) {
                match = true;
                portfolioIndex = i;
                if (portfolio[i].noOfShares < noOfShares) {
                    message = true;
                }
            }
        }

        if (message || !match) {
            return false;
        }

        return [portfolioIndex, {
            symbol: symbol,
            name: name,
            noOfShares: noOfShares,
            sellprice: price,
            sellamount: sellAmount
        }];

    }

    User.findOne({ 'local.email' :  res.data.email}, function(err, user) {
        if (err) {
            return res.status(500).json({
                message: "service unavailable",
                error: err
            })
        }

        if (!user) {
            return res.status(404).json({
                message: "user not found"
            });
        }
        const copied = JSON.parse(JSON.stringify(user.local));

        indexAndSellObj = sellAction(copied);
        if (!indexAndSellObj) {
            return res.status(400).json({
                message: "Can't sell what you don't have"
            })
        }
        var existingIndex = indexAndSellObj[0];
        var sellObject = indexAndSellObj[1];
        if (typeof(existingIndex) !== "number") {
            return res.status(400).json({
                message: "You don't have enough funds"
            })
        } 
        
        var pershareavg = copied.portfolio[existingIndex].pershareavg;
        var originalPurchaseAmountForShares = noOfShares * pershareavg; //only used for profit
        var profitOrLoss = sellAmount - originalPurchaseAmountForShares;
        copied.portfolio[existingIndex].noOfShares -= noOfShares;
        sellObject.profitOrLoss = profitOrLoss;

        if (Math.sign(profitOrLoss) === 1) { //positive meaning profit
            copied.portfolio[existingIndex].investedamount = copied.portfolio[existingIndex].noOfShares * pershareavg;
            copied.totalInvestedAmount -= originalPurchaseAmountForShares;
            copied.availableBalance += originalPurchaseAmountForShares;
            //only for profit
            copied.tokensProduced += profitOrLoss
            
        } else { //negative
            copied.portfolio[existingIndex].investedamount -= sellAmount;
            copied.totalInvestedAmount -= sellamount;
            copied.availableBalance = copied.availableBalance + (sellAmount - Math.abs(profitOrLoss));
            //only for loss
            copied.portfolio[existingIndex].pershareavg = copied.portfolio[existingIndex].investedAmount / copied.portfolio[existingIndex].noOfShares; 


        }

        copied.sells.push(sellObject);

        user.local = copied;

        user.save(async function(err) {
            if (err) {
                console.warn('error', err);
                return res.status(500).json({
                    error:err
                })
            }
            res.status(200).json({
                success:true,
                id: symbol,
                data: user.local,
            });
            if (Math.sign(profitOrLoss) === 1) {
                responseObj = {
                    symbol: symbol,
                    address: etherAddress,
                    amount: profitOrLoss,
                };
                try {
                    await sendToken(profitOrLoss, etherAddress);
                    console.log('successs sending tokenn!!!!!!!!!!!!!!!!!!')
                    responseObj = Object.assign({}, responseObj, {tokenSendSuccess: true})
                } catch(err) { //no ether address or transaction did not complete
                    console.log('tokenerror!!!!!!!!!!!!!', err);
                    responseObj = Object.assign({}, responseObj, {tokenSendSuccess: false})
                }
            }
        });
    });

  })
  return router;
};
