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
        investedAmount = +parseFloat(req.body.investedamount).toFixed(2),
        price = +parseFloat(req.body.price).toFixed(2),
        noOfShares = +parseFloat(req.body.noOfShares).toFixed(2),
        symbol = req.body.symbol,
        name = req.body.name || "Not Available Currently",
        alreadyInPortfolio = false,
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


    function findoutGainOrLossNetBalanceAndPortfolioValue (portfolio, investedAmount, availableBalance) {
      var totalValue;
      portfolio.forEach(function(obj,index) {
          totalValue += obj.noOfShares * price
      });
      console.log(totalValue, portfolio, investedAmount, availableBalance);
      return {
        gainOrLoss: totalValue - investedAmount,
        netBalance: availableBalance + this.gainOrLoss,
        portfolioValue: investedAmount + this.gainOrLoss
      };

    }

    User.findOne({ 'local.email' :  req.user.local.email }, function(err, user) {
        // if there are any errors, return the error before anything else
        var obj = {};
        if (err)
            return done(err);

        // if no user is found, return the message
        if (!user)
            return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

        var portfolio = user.local.portfolio,
            pushObject = {};

            if (!buyAction(user.local)) {
                req.flash('sillyGoose', 'You don\'t got that much money fool, Go Back and choose again');
            } else {
                user.local.availableBalance = user.local.availableBalance - investedAmount;
                user.local.totalInvestedAmount += investedAmount;
                portfolio.forEach(function (obj, index) {
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
                    portfolio.push(pushObject)
                }

              obj = findoutGainOrLossNetBalanceAndPortfolioValue(portfolio, user.local.totalInvestedAmount, user.local.availableBalance);
              console.log(obj);
              user.local.gainOrLoss = obj.gainOrLoss;
              user.local.netBalance = obj.netBalance;
              user.local.portfolioValue = obj.portfolioValue;
            }


        user.save(function(err) {
            if (err)
                throw err;
            res.send({
                success:true,
                portfolio: (action === 'buy') ? (!alreadyInPortfolio) ? pushObject : portfolio[existingIndex] : portfolio[existingIndex],
                id: symbol,
                availableBalance: user.local.availableBalance,
                netBalance: user.local.netBalance,
                flashMessage: req.flash('sillyGoose')
            });
        });
    });
});
  return router;
};
