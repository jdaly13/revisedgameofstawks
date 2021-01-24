import React from 'react';
import Modal from '../partials/Modal';
import { handleToggleModal } from '../services/utils';

class PurchaseEquities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      purchaseError:'',
      withdrawError:'',
      buyorsell: null,
      shareAmount: null,
      shareSymbol: null,
      purchaseOrSaleSuccess: '',
      loading:false,
    };
    this.sharesToPurchase = 0;
    this.sharesToSell = 0;
    this.shareSymbolToPurchase = '';
    this.shareSymbolToSell = '';

    this.getValuesandFetch = this.getValuesandFetch.bind(this);
    this.handleToggleModal = handleToggleModal.bind(this);
    this.checkValues = this.checkValues.bind(this);
    this.getShareAmountandShareSymbol = this.getShareAmountandShareSymbol.bind(this);

    this.portfolioExists = !!this.props.portfolio.length;
    this.purchaseWithdraw = {
      purchase: 'purchase',
      withdraw: 'withdraw'
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log('nextprops' , nextProps);
    //this.portfolio = nextProps.portfolio;
  }

  getShareAmountandShareSymbol(purchaseOrWithdrawel) {
    var obj = {};
    if (purchaseOrWithdrawel === this.purchaseWithdraw.purchase ) { //purchase
      obj.shareAmount = this.sharesToPurchase.value;
      obj.shareSymbol = this.shareSymbolToPurchase.value
    } else { // withdrawel
      obj.shareAmount = this.sharesToSell.value;
      obj.shareSymbol = this.shareSymbolToSell.value
    }
    return obj;
  }

  checkValues(event) {
    this.setState({purchaseError:'', withdrawError: ''})
    var object = this.getShareAmountandShareSymbol(event.target.id);
    if (this.purchaseWithdraw.withdrawError === event.target.id ) {
      const inPortfolio = this.props.portfolio.some((obj)=> {
        return obj.symbol === object.shareSymbol
      });
      if (!inPortfolio) {
        this.setState({
          withdrawError: "You can't sell equities you don't own"
        })
        return false;
      }
    }
    this.setState({
      buyorsell: this.purchaseWithdraw[event.target.id],
      shareAmount: object.shareAmount,
      shareSymbol: object.shareSymbol
    })
    if (object.shareAmount > 0 && Number(object.shareAmount) && object.shareSymbol) {
      this.handleToggleModal();
    } else {
      this.setState({
        purchaseError: "You need to put a valid sharesymbol and amount of shares"
      })
    }
  }

  getValuesandFetch() {
    this.setState({
      loading:true
    })
    return this.props.getStockPrice(this.state.shareAmount, this.state.shareSymbol, this.state.buyorsell).then((res)=> {
      this.setState({
        purchaseOrSaleSuccess: true,
        message: "Congratulations",
        loading: false,
      });
    }).catch((err) => {
      this.setState({
        purchaseOrSaleSuccess: false,
        message: err.message,
        loading: false,
      })
    });
  }

  networksDontMatch() {
    if (!this.props.currentNetwork) return true;
    return this.props.currentNetwork !== this.props.contractNetwork;
  }

  render() {
    return (
      <section className="buysell">
        <button className="enableEthereumButton" onClick={this.props.connectEthereum}>ENABLE ETHEREUM TO RECEIVE TOKENS WHEN YOU SELL</button>
        {this.props.address && <h4 style={{color:"blue"}}>You are connnected with address {this.props.address} and to the {this.props.currentNetwork} network </h4>}
        {this.networksDontMatch() && <h4 style={{color:"blue"}}> Make sure you are connected to {this.props.contractNetwork} network </h4>}
        <h4>Time to Buy {this.portfolioExists && 'or sell'} some stawks</h4>
        <div className="container buy">
          <h6>Purchase</h6>
          <div className="content">
            <label>Choose stock symbol</label>
            <input
              type="text"
              ref={input => {
                this.shareSymbolToPurchase = input;
              }}
              placeholder="e.g. aapl Apple"
            />
          </div>
          <div className="content">
            <label>Choose Amount of Shares</label>
            <input
              type="text"
              ref={input => {
                this.sharesToPurchase = input;
              }}
              placeholder="must be a number"
            />
          </div>
          <div className="content">
          {this.state.purchaseError && <div style={{color:"red"}}>{this.state.purchaseError}</div>}
            <button
              className="submit"
              onClick={this.checkValues}
              type="submit"
              id="purchase"
            >
              Submit
            </button>
          </div>
        </div>
        {this.props.portfolio.length &&
        <div className="container sell">     
          <h6>Sell</h6>
          <div className="content">
            <label>Choose stock symbol</label>
            <input
              type="text"
              ref={input => {
                this.shareSymbolToSell = input;
              }}
              placeholder={`e.g. ${this.props.portfolio[0].symbol}`}
            />
          </div>
          <div className="content">
            <label>Choose Amount of Shares</label>
            <input
              type="text"
              ref={input => {
                this.sharesToSell = input;
              }}
              placeholder="must be a number"
            />
          </div>
          <div className="content">
          {this.state.withdrawError && <div style={{color:"red"}}>{this.state.withdrawError}</div>}
            <button
              className="submit"
              onClick={this.checkValues}
              type="submit"
              id="withdraw"
              disabled={this.networksDontMatch()}
            >
              Submit
            </button>
          </div>
        </div>
        }
        {this.state.showModal &&
        <Modal onCloseRequest={this.handleToggleModal}>
          <h1>Confirmation of {this.state.buyorsell}</h1>
          <p>You are about to {this.state.buyorsell} {this.state.shareAmount} shares of {this.state.shareSymbol} </p>
          {typeof this.state.purchaseOrSaleSuccess !== "boolean" && (
          <>
            <div><button onClick={this.getValuesandFetch}>confirm</button></div>
            <div><button onClick={this.handleToggleModal}>cancel</button></div>
          </>
          )}
          {this.state.loading && <div>LOADING ... Please wait</div>}
          {typeof this.state.purchaseOrSaleSuccess === "boolean" && (
            <div>
              <h4>
                Your {this.state.buyorsell} was a {this.state.purchaseOrSaleSuccess ? "Success" : "Failure"}
              </h4>
              <p>{this.state.message}</p>
            </div>
          )}
        </Modal> 
        }
      </section>
    );
  }
}

export default PurchaseEquities;
