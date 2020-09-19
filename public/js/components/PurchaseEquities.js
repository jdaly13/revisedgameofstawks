import React from 'react';
import Modal from '../partials/Modal';
import { handleToggleModal } from '../services/utils';

class PurchaseEquities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      error: null,
      buyorsell: null,
      shareAmount: null,
      shareSymbol: null
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
      widthdraw: 'withdraw'
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
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
    var obj = this.getShareAmountandShareSymbol(event.target.id);
    console.log(obj);
    this.setState({
      buyorsell: this.purchaseWithdraw[event.target.id],
      shareAmount: obj.shareAmount,
      shareSymbol: obj.shareSymbol
    })
    if (obj.shareAmount > 0 && Number(obj.shareAmount) && obj.shareSymbol) {
      this.handleToggleModal();
    } else {
      this.setState({
        error: "You need to put a valid sharesymbol and amount of shares"
      })
    }
  }

  getValuesandFetch() {
    this.props.fetch(this.state.shareAmount, this.state.shareSymbol, this.state.buyorsell);
    this.handleToggleModal();
  }

  render() {
    return (
      <section className="buysell">
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
          {this.state.error && <div style={{color:"red"}}>{this.state.error}</div>}
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
          {this.state.error && <div style={{color:"red"}}>{this.state.error}</div>}
            <button
              className="submit"
              onClick={this.checkValues}
              type="submit"
              id="widthdraw"
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
          <div><button onClick={this.getValuesandFetch}>confirm</button></div>
          <div><button onClick={this.handleToggleModal}>cancel</button></div>
        </Modal> 
        }
      </section>
    );
  }
}

export default PurchaseEquities;
