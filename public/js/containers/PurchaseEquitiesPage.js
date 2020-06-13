import React from 'react';
import ChooseEquities from '../components/PurchaseEquities.js';
import configuration from '../services/constants';
import dataSource from '../services/dataSource.js';

class PurchaseEquitiesPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    // this.fetchStocks = this.fetchStocks.bind(this);
    this.getStockPrice = this.getStockPrice.bind(this);
    this.makePurchase = this.makePurchase.bind(this);
    this.makeSale = this.makeSale.bind(this);
    this.state = {};
    this.state.equitiesToPurchase = [];
    this.state.currentPurchase = {};
  }

  // fetchStocks(amount, symbol) {
  //   console.log(amount, symbol);
  //   var url = `https://api.intrinio.com/prices?identifier=${symbol.toUpperCase()}`;
  //   // return new Promise((resolve, reject) => {
  //   var xhr = new XMLHttpRequest();
  //   var auth =
  //     'Basic ' +
  //     new Buffer(
  //       '85e8eba855c48add3015f6b7b571bdb4' +
  //         ':' +
  //         '1bd790ac89607fc5996edbbb00c23be9'
  //     ).toString('base64');
  //   xhr.responseType = 'json';
  //   xhr.open('GET', url);
  //   xhr.onload = () => {
  //     var data = xhr.response.data[0].close;
  //     this.setState({
  //       equitiesToPurchase: this.state.equitiesToPurchase.concat([
  //         { [symbol]: data }
  //       ]),
  //       currentPurchase: { [symbol]: data }
  //     });
  //   };
  //   xhr.onerror = () => {};
  //   xhr.setRequestHeader('Authorization', auth);
  //   xhr.send();
  //   // });
  // }

  getStockPrice(amount, symbol, buyorsell) {
    let url = configuration.stockUrl + symbol;
    console.log(amount, symbol, buyorsell, this.props);
    const makePurchaseOrMakeSale = buyorsell === "purchase" ? this.makePurchase : this.makeSale;
    dataSource.getStockData(url).then((res) => {
      console.log('get stock price', res)
      makePurchaseOrMakeSale(res, amount)
    }).catch((error) => {
      console.log(error)
    })
  }

  makePurchase(data, amount) {
      const resolution = data[0]
      const objToSend = {
        symbol: resolution.symbol.toLowerCase(), 
        price: resolution.price, 
        noOfShares: amount, 
        buyorsell:"buy", 
        time: resolution.time
      };
      console.log(this.props, 'whatever');
      dataSource.makePurchase(this.props.token, JSON.stringify(objToSend)).then((res)=>{
        console.log('response', res);
      }).catch((err)=>{
        console.log('failure', err)
      })
  }

  makeSale(data, amount) {
    console.log(data);
    const resolution = data[0]
    const objToSend = {
      symbol: resolution.symbol.toLowerCase(), 
      price: resolution.price, 
      noOfShares:amount, 
      buyorsell:"sell", 
      time: resolution.time
    };
    dataSource.makeSale(this.props.token, JSON.stringify(objToSend)).then((res)=>{
      console.log('response', res);
    }).catch((err)=>{
      console.log('failure', err)
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
        portfolio={this.props.portfolio}
      />
    );
  }
}

export default PurchaseEquitiesPage;
