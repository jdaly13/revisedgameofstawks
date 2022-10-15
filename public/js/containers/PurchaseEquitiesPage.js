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
    this.state = {
      waitingForToken: false
    };
  }


  getStockPrice(amount, symbol, buyorsell) {
    let url = configuration.stockUrl + symbol;
    const makePurchaseOrMakeSale = buyorsell === "purchase" ? this.makePurchase : this.makeSale;
    return dataSource.getStockData(url).then((res) => {
      if (!res.length) {
        return Promise.reject({message: "NO DATA PROVIDED"});
      } 
      return makePurchaseOrMakeSale(res, amount);
    });
  }

  makePurchase(data, amount) {
      const resolution = data[0];
      const objToSend = {
        symbol: resolution.symbol.toLowerCase(), 
        price: resolution.price, 
        noOfShares: amount, 
        time: resolution.time
      };
      return dataSource.makePurchase(this.props.token, JSON.stringify(objToSend)).then((res)=>{
        console.log('response', res);
        this.props.update(res.data)
      });
  }


  estimateGas(data, amount) {
    const resolution = data[0]
    const objToSend = {
      symbol: resolution.symbol.toLowerCase(), 
      price: resolution.price, 
      noOfShares:amount, 
      time: resolution.time,
      address: this.props.address
    };
    return dataSource.estimateGas(this.props.token, JSON.stringify(objToSend))
  }

  makeSale(data, amount) {
    const resolution = data[0]
    const objToSend = {
      symbol: resolution.symbol.toLowerCase(), 
      price: resolution.price, 
      noOfShares:amount, 
      time: resolution.time,
      address: this.props.address
    };
    function checkTokenResponse(response) {
      if (response.success) {
        console.log('success')
        this.setState({
          waitingForToken: false,
        },this.props.update(response.data));
      } else { //sucess false;
        console.log('success false', response);
        return dataSource.checkTokenTransaction(this.props.token).then(checkTokenResponse.bind(this))
      }
    }
    return dataSource.makeSale(this.props.token, JSON.stringify(objToSend)).then((res)=>{
      this.setState({
        waitingForToken: true,
      });
      return dataSource.checkTokenTransaction(this.props.token).then(checkTokenResponse.bind(this));
    });
  }

  /**
   * Render the component.
   */
  render() {
    return (
      <ChooseEquities
        getStockPrice={this.getStockPrice}
        currentPurchase={this.state.currentPurchase}
        portfolio={this.props.portfolio}
        connectEthereum={this.props.connectEthereum}
        address={this.props.address}
        contractNetwork={this.props.contractNetwork}
        currentNetwork={this.props.currentNetwork}
        waitingForToken={this.state.waitingForToken}
      />
    );
  }
}

export default PurchaseEquitiesPage;
