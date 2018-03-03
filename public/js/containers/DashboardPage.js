import React from 'react';
import Auth from '../modules/Auth';
import UserProfile from '../components/Dashboard.js';
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
    this.getCurrentPrices = this.getCurrentPrices.bind(this);
    this.request = this.request.bind(this);
    this.state = {
      secretData: '',
      data: '',
      currentPortfolio: null,
      currentPrice: null
    };
  }

  request(arr) {
    let loadIt = (url, symbol) => {
      return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        var auth =
          'Basic ' +
          new Buffer(
            '85e8eba855c48add3015f6b7b571bdb4' +
              ':' +
              '1bd790ac89607fc5996edbbb00c23be9'
          ).toString('base64');
        xhr.responseType = 'json';
        xhr.open('GET', url);
        xhr.onload = () => {
          resolve({ xhr: xhr.response, symbol: symbol });
        };
        xhr.onerror = reject;
        xhr.setRequestHeader('Authorization', auth);
        xhr.send();
      });
    };
    return arr.map(obj => {
      return loadIt(obj.url, obj.stockTicker);
    });
  }

  getCurrentPrices() {
    let x = [];
    var currentPortfolioCopy = this.state.currentPortfolio.map(val =>
      Object.assign({}, val)
    );
    this.state.currentPortfolio.forEach(obj => {
      var symbol = obj.symbol === 'ssri' ? 'ssrm' : obj.symbol;
      // x.push(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=15min&apikey=O63CRR81WH26FIEQ`);
      x.push({
        url: `https://api.intrinio.com/prices?identifier=${symbol.toUpperCase()}`,
        stockTicker: symbol
      });
    });
    return Promise.all(this.request(x)).then(array => {
      array.forEach((e, index) => {
        var data = e.xhr.data;
        var currentPrice = data[0].close;
        var currentValue = utilityFunctions.toFixed(
          currentPrice * currentPortfolioCopy[index].noOfShares
        );
        // var key = e.target.response['Meta Data']['3. Last Refreshed'];
        // var symbol = e.target.response['Meta Data']['2. Symbol'];
        //var currentPrice =
        //  e.target.response['Time Series (1min)'][key]['1. open'];

        var clonedUpdated = Object.assign({}, currentPortfolioCopy[index], {
          currentPrice,
          currentValue,
          gainOrLoss: utilityFunctions.toFixed(
            currentValue - currentPortfolioCopy[index].investedamount
          )
        });
        currentPortfolioCopy[index] = clonedUpdated;
      });
      this.setState(prevState => {
        return {
          currentPortfolio: currentPortfolioCopy
        };
      });
    });
  }

  /**
   * This method will be executed after initial rendering.
   */
  componentDidMount() {
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/api/dashboard');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        this.setState({
          secretData: xhr.response.message,
          data: xhr.response.data,
          currentPortfolio: xhr.response.data.portfolio
        });
        this.getCurrentPrices();
      }
    });
    xhr.send();
  }

  /**
   * Render the component.
   */
  render() {
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
