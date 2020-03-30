import React from 'react';
import ChooseEquities from '../components/PurchaseEquities.js';
import configuration from '../services/constants';
import dataSource from '../services/dataSource.js';

var utilityFunctions = (function() {
  return {
    toFixed: function(num) {
      return +parseFloat(num).toFixed(2);
    }
  };
})();
class PurchaseEquitiesPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.fetchStocks = this.fetchStocks.bind(this);
    this.getStockPrice = this.getStockPrice.bind(this);
    this.state = {};
    this.state.equitiesToPurchase = [];
    this.state.currentPurchase = {};
  }

  fetchStocks(amount, symbol) {
    console.log(amount, symbol);
    var url = `https://api.intrinio.com/prices?identifier=${symbol.toUpperCase()}`;
    // return new Promise((resolve, reject) => {
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
      var data = xhr.response.data[0].close;
      this.setState({
        equitiesToPurchase: this.state.equitiesToPurchase.concat([
          { [symbol]: data }
        ]),
        currentPurchase: { [symbol]: data }
      });
    };
    xhr.onerror = () => {};
    xhr.setRequestHeader('Authorization', auth);
    xhr.send();
    // });
  }

  getStockPrice(amount, symbol) {
    let url = configuration.stockUrl + symbol;
    console.log(amount, this.props);
    const success = (data) => {
      const resolution = data[0]
      const objToSend = {symbol: resolution.symbol, price: resolution.price, noOfShares:amount, buyorsell:"buy", time: resolution.time};
      dataSource.makePurchase(this.props.token, JSON.stringify(objToSend)).then((res)=>{
        console.log('response', res);
      }).catch((err)=>{
        console.log('failure', err)
      })
    }
    dataSource.getStockData(url).then(success).catch((error) => {
      console.log(error)
    })
  }

  /**
   * Render the component.
   */
  render() {
    return (
      <ChooseEquities
        fetch={this.getStockPrice}
        toPurchase={this.state.equitiesToPurchase}
        currentPurchase={this.state.currentPurchase}
      />
    );
  }
}

export default PurchaseEquitiesPage;
