var User =    require('./models/user');
var sendToken = require('./token');

module.exports = function(express) {
  const router = new express.Router();
  router.get('/dashboard', (_req, res) => {
    const data = res.data;
    res.status(200).json({
      message: res.data.email,
      data
    });
  });

  router.post('/purchaseequities', (req, res, done) => {
        var price = +parseFloat(req.body.price).toFixed(2),
        noOfShares = +parseFloat(req.body.noOfShares).toFixed(2),
        symbol = req.body.symbol,
        name = req.body.name || "Not Available Currently",
        alreadyInPortfolio = false,
        investedAmount = price * noOfShares,
        existingIndex = false;

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

    User.findOne({ 'local.email' :  res.data.email}, function(err, user) {
        // deep copy
        const copied = JSON.parse(JSON.stringify(user.local));
        // if there are any errors, return the error before anything else
        if (err)
            return res.status(500).json({
                message: "service unavailable",
                error: err
            })

        // if no user is found, return the message
        if (!user) {
            //return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            return res.status(404).json({
                message: "user not found"
            });
        }



            if (!buyAction(copied)) {
                //req.flash('sillyGoose', 'You don\'t got that much money fool, Go Back and choose again');
                return res.status(400).json({
                    message: "You don't have enough funds"
                })
            } else {
                copied.availableBalance = copied.availableBalance - investedAmount;
                copied.totalInvestedAmount += investedAmount;
                copied.portfolio.forEach(function (obj, index) {
                    if (obj.symbol === symbol) {
                        obj.noOfShares += noOfShares;
                        obj.investedamount += investedAmount;
                        obj.pershareavg = obj.investedamount / obj.noOfShares;
                        alreadyInPortfolio = true;
                        existingIndex = index;
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
            //   obj = findoutGainOrLossNetBalanceAndPortfolioValue(copied.portfolio, copied.totalInvestedAmount, copied.availableBalance);
            //   copied.gainOrLoss = obj.gainOrLoss;
            //   copied.netBalance = obj.netBalance;
            //   copied.portfolioValue = obj.portfolioValue;
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
    console.log('ether address', etherAddress);

    let tokenSendSuccess = false;
    
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

    User.findOne({ 'local.email' :  res.data.email}, async function(err, user) {
        if (err) {
            return res.status(500).json({
                message: "service unavailable",
                error: err
            })
        }

        // if no user is found, return the message
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

            try {
                const response = await sendToken(profitOrLoss, etherAddress);
                tokenSendSuccess = true;
            } catch(err) { //no ether address or transaction did not complete
                console.log(err);
            }
            const arrayToPush = tokenSendSuccess ? copied.tokensGivenAndReceived : copied.tokensGivenAndRejected;
            arrayToPush.push({
                symbol: symbol,
                address: etherAddress,
                amount: profitOrLoss
            });
            
        } else { //negative
            copied.portfolio[existingIndex].investedamount -= sellAmount;
            copied.totalInvestedAmount -= sellamount;
            copied.availableBalance = copied.availableBalance + (sellAmount - Math.abs(profitOrLoss));
            //only for loss
            copied.portfolio[existingIndex].pershareavg = copied.portfolio[existingIndex].investedAmount / copied.portfolio[existingIndex].noOfShares; 


        }

        copied.sells.push(sellObject);

        user.local = copied;

        user.save(function(err) {
            if (err) {
                console.warn('error', err);
                return res.status(500).json({
                    error:err
                })
            }
            return res.status(200).json({
                success:true,
                id: symbol,
                data: user.local,
                tokenSendSuccess: tokenSendSuccess
            });
        });
    });

  })
  return router;
};
