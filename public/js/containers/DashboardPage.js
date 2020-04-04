import React from 'react';
import Auth from '../modules/Auth';
import dataSource from '../services/dataSource';
import UserProfile from '../components/Dashboard.js';
import LoginPage from './LoginPage';
import PurchaseEquitiesContainer from './PurchaseEquitiesPage';
import configuration from '../services/constants';

var utilityFunctions = (function() {
  return {
    toFixed: function(num) {
      return +parseFloat(num).toFixed(2);
    }
  };
})();
class DashboardPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      secretData: '',
      data: '',
      currentPortfolio: null,
      currentPrice: null,
      auth:true,
      token: Auth.getToken(),
    };
    this.symbols = {};
    this.getCurrentPrices = this.getCurrentPrices.bind(this);

  }

  getCurrentPrices() {
    const url = configuration.stockUrl;
    let str = ''
    const {currentPortfolio} = this.state;
    if (!currentPortfolio.length) return; // no need to make call if no portfolio
    currentPortfolio.forEach((obj, index, arr) => {
      console.log(obj)
      var symbol = obj.symbol = (obj.symbol === 'ssri') ? 'ssrm' : obj.symbol;
      this.symbols[symbol] = Object.assign({}, obj);
      str += !arr[index + 1] ? symbol : (symbol + ',');
    });
    const finalUrl = url + str;
    console.log(finalUrl, str);

    return dataSource.getStockData(finalUrl).then((res) => {
      console.log(res);
      var notRegistered = false;
      res.forEach((obj) => {
        var currentPrice = obj.price;
        var currentValue;
        var gainOrLoss;
        var symbol = obj.symbol.toLowerCase();
        var noOfShares = this.symbols[symbol] && this.symbols[symbol].noOfShares;
        console.log('noofshares', this.symbols[symbol])
        if (!noOfShares) {
          notRegistered = true;
          console.log(symbol);
        } else {
          currentValue = currentPrice * noOfShares;
          gainOrLoss = utilityFunctions.toFixed(
            currentValue - this.symbols[symbol].investedamount
          )
          let portfolioCopy = [...this.state.currentPortfolio];
          let index = portfolioCopy.findIndex((copy) => {
            return copy.symbol === symbol;
          });
          portfolioCopy[index] = Object.assign({}, portfolioCopy[index], {currentPrice, currentValue, gainOrLoss})
          this.setState({
            currentPortfolio: portfolioCopy
          })
        }
      })
    }).catch((err) => {
      console.warn(err);
    })
  }
  
  async componentDidMount() {
    console.log(this.props)
    if (this.props.location.state) {
      this.setState({
        data: this.props.location.state,
        currentPortfolio: this.props.location.state.portfolio
      }, this.getCurrentPrices);

    } else {
      const { token } = this.state
      if (token) {
        try {
          const response = await dataSource.getUserData(token);
          console.log(response);
          this.setState({
            data: response.data,
            secretData: response.message,
            currentPortfolio: response.data.portfolio
          });
          this.getCurrentPrices();
        } catch(err) {
          console.log(err)
          const errors = (typeof err === "object") ? err : {};
          errors.summary = "Something bad happened"
          this.setState({
            errors
          });
        }
      } else {
        this.setState({
          auth:false
        })
      }
    }
  }

  render() {
    if (!this.state.auth) {
      return <LoginPage />
    }
    if (this.state.data) {
      return (
        <div>
          <UserProfile
            secretData={this.state.secretData}
            data={this.state.data}
            portfolio={this.state.currentPortfolio}
          />
          <PurchaseEquitiesContainer token={this.state.token} />
        </div>
      );
    } else {
      return <div>Loading ... </div>;
    }
  }
}

export default DashboardPage;
