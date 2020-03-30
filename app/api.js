var User =    require('./models/user');
module.exports = function(express) {
  const router = new express.Router();
  router.get('/dashboard', (_req, res) => {
    const data = res.data;
    res.status(200).json({
      message: res.data.email,
      data: res.data
    });
  });

  router.post('/purchaseequities', (req, res, done) => {
    var action = req.body.buyorsell,
        price = +parseFloat(req.body.price).toFixed(2),
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


    function findoutGainOrLossNetBalanceAndPortfolioValue (portfolio, totalinvestedamount, availableBalance) {
      var totalValue = 0;

      portfolio.forEach(function(obj,index) {
          totalValue += obj.investedamount;
      });
      console.log('totalValue', totalValue, 'totalinvestedamount', totalinvestedamount, 'availablebalance', availableBalance);
      const gainOrLoss = totalValue - totalinvestedamount;
      return {
        gainOrLoss: gainOrLoss,
        netBalance: availableBalance + gainOrLoss,
        portfolioValue: totalinvestedamount + gainOrLoss
      };

    }

    User.findOne({ 'local.email' :  res.data.email}, function(err, user) {
        // if there are any errors, return the error before anything else
        var obj = {};

        const copied = JSON.parse(JSON.stringify(user.local));
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
                console.log('copied obj', copied);
              obj = findoutGainOrLossNetBalanceAndPortfolioValue(copied.portfolio, copied.totalInvestedAmount, copied.availableBalance);
              copied.gainOrLoss = obj.gainOrLoss;
              copied.netBalance = obj.netBalance;
              copied.portfolioValue = obj.portfolioValue;
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
                portfolio: (action === 'buy') ? (!alreadyInPortfolio) ? pushObject : user.local.portfolio[existingIndex] : user.local.portfolio[existingIndex],
                id: symbol,
                availableBalance: user.local.availableBalance,
                netBalance: user.local.netBalance,
            });
        });
    });
});
  return router;
};
