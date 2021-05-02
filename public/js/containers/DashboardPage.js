import React from 'react';
import Auth from '../modules/Auth';
import dataSource from '../services/dataSource';
import UserProfile from '../components/Dashboard.js';
import LoginPage from './LoginPage';
import PurchaseEquitiesContainer from './PurchaseEquitiesPage';
import configuration from '../services/constants';
import { utilityFunctions } from '../modules/utilities';
// import { web3 } from '../ethereum/web3';

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secretData: '',
      data: '',
      currentPortfolio: null,
      currentPrice: null,
      auth:true,
      token: Auth.getToken(),
      etherAddress: null,
      ethereumNetwork: null,
    };
    this.symbols = {};
    this.getCurrentPrices = this.getCurrentPrices.bind(this);
    this.update = this.update.bind(this);
    this.connectEthereum = this.connectEthereum.bind(this);
    this.ethereumNetworks = {
      '0x3': 'ropsten',
      '0x5': 'goerlie',
      '0x4': 'rinkeby',
      '0x1': 'main'
    }

  }

  getCurrentPrices() {
    const url = configuration.stockUrl;
    let str = ''
    const {currentPortfolio} = this.state;
    if (!currentPortfolio.length) return; // no need to make call if no portfolio
    currentPortfolio.forEach((obj, index, arr) => {
      var symbol = obj.symbol = (obj.symbol === 'ssri') ? 'ssrm' : obj.symbol; //remove this hack
      this.symbols[symbol] = Object.assign({}, obj);
      str += !arr[index + 1] ? symbol : (symbol + ',');
    });
    const finalUrl = url + str;

    return dataSource.getStockData(finalUrl).then((res) => {
      var totalGainOrLoss = 0;
      res.forEach((obj) => {
        var currentPrice = obj.price;
        var currentValue;
        var gainOrLoss;
        var symbol = obj.symbol.toLowerCase();
        var noOfShares = this.symbols[symbol] && this.symbols[symbol].noOfShares;
        console.log('noofshares', this.symbols[symbol])
        if (!noOfShares) {
          console.log(symbol);
        } else {
          currentValue = utilityFunctions.toFixed(currentPrice * noOfShares);
          gainOrLoss = utilityFunctions.toFixed(
            currentValue - this.symbols[symbol].investedamount
          )
          let portfolioCopy = [...this.state.currentPortfolio];
          let index = portfolioCopy.findIndex((copy) => {
            return copy.symbol === symbol;
          });
          totalGainOrLoss += gainOrLoss;
          portfolioCopy[index] = Object.assign({}, portfolioCopy[index], {currentPrice, currentValue, gainOrLoss})
          this.setState({
            currentPortfolio: portfolioCopy
          })
        }
      });

      var portfolioVal = this.state.data.totalInvestedAmount + totalGainOrLoss;
      var netBlnce = this.state.data.availableBalance + totalGainOrLoss;
      this.setState({
        data: Object.assign({}, this.state.data, {gainOrLoss: totalGainOrLoss, portfolioValue: portfolioVal, netBalance: netBlnce})
      })
    }).catch((err) => {
      console.warn(err);
    })
  }

  async connectEthereum() {
    if (window.ethereum) {
      const currentNetwork = this.ethereumNetworks[window.ethereum.chainId];
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log('accoutns', accounts);
      const ethereumNetwork = await dataSource.checkGOSTtoken(this.state.token);
      console.log('network', ethereumNetwork);
      this.setState({
        etherAddress: accounts[0] || null,
        contractNetwork: ethereumNetwork.network,
        currentNetwork: currentNetwork
      })
    } else {
      window.alert('Please install metamask extension so you can earn tokens');
    }
 } 

  update(updatedData) {
    this.setState({
      data: updatedData,
      currentPortfolio: updatedData.portfolio
    }, this.getCurrentPrices);
  }
  
  async componentDidMount() {
    if (this.props.location.state) {
      console.log('login', this.props.location.state);
      this.setState({
        data: this.props.location.state,
        currentPortfolio: this.props.location.state.portfolio,
        secretData: this.props.location.state.email
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
          <PurchaseEquitiesContainer address={this.state.etherAddress} 
            portfolio={this.state.currentPortfolio} 
            token={this.state.token}
            update={this.update}
            connectEthereum={this.connectEthereum}
            currentNetwork={this.state.currentNetwork}
            contractNetwork={this.state.contractNetwork}
          />
        </div>
      );
    } else {
      return !this.state.errors ? <div>Loading ... </div> : <div> Something bad happened return to homepage</div>;
    }
  }
}

export default DashboardPage;
