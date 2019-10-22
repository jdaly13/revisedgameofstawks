import React from 'react';
import Auth from '../modules/Auth';
import dataSource from '../services/dataSource';
import UserProfile from '../components/Dashboard.js';
import LoginPage from './LoginPage';
import PurchaseEquitiesContainer from './PurchaseEquitiesPage';

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
      auth:true
    };
    this.symbols = {};
    this.getCurrentPrices = this.getCurrentPrices.bind(this);
    this.request = this.request.bind(this);
  }

  request(url) {
    return new Promise((res, rej) => {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.open('GET', url);
      xhr.onload = () => {
        res(xhr.response);
      };
      xhr.onerror = rej;
      xhr.send();
    })

  }

  getCurrentPrices() {
    const url = "https://cloud.iexapis.com/stable/tops/last?token=pk_4d0cd52a44c5411494f5868302139b73&symbols="
    let str = ''
    const {currentPortfolio} = this.state;
    if (!currentPortfolio.length) return; // no need to make call if no portfolio
    currentPortfolio.forEach((obj, index, arr) => {
      var symbol = obj.symbol = (obj.symbol === 'ssri') ? 'ssrm' : obj.symbol;
      this.symbols[symbol] = Object.assign({}, obj);
      str += !arr[index + 1] ? symbol : (symbol + ',');
    });
    const finalUrl = url + str;
    console.log(finalUrl, str);

    return this.request(finalUrl).then((res) => {
      console.log(res);
      var notRegistered = false;
      res.forEach((obj) => {
        var currentPrice = obj.price;
        var currentValue;
        var gainOrLoss;
        var symbol = obj.symbol.toLowerCase();
        var noOfShares = this.symbols[symbol] && this.symbols[symbol].noOfShares;
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

  /**
   * This method will be executed after initial rendering.
   */
  async componentDidMount() {
    if (this.props.info) {
      this.setState({
        data: this.props.info,
        currentPortfolio: this.props.info.portfolio
      }, this.getCurrentPrices);

    } else {
      const token = Auth.getToken(); 
      if (token) {
        try {
          const response = await dataSource.getUserData(token);
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
          <PurchaseEquitiesContainer />
        </div>
      );
    } else {
      return <div>Loading ... </div>;
    }
  }
}

export default DashboardPage;
