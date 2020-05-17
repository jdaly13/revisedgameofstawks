import React from 'react';
import Modal from '../partials/Modal';
import { handleToggleModal } from '../services/utils';

class PurchaseEquities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      error: null
    };
    this.sharesToPurchase = 0;
    this.shareSymbol = '';
    this.getValuesandFetch = this.getValuesandFetch.bind(this);
    this.handleToggleModal = handleToggleModal.bind(this);
    this.checkValues = this.checkValues.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    //this.portfolio = nextProps.portfolio;
  }

  checkValues() {
    var sharesToPurchase = this.sharesToPurchase.value;
    var shareSymbol = this.shareSymbol.value;
    if (sharesToPurchase > 0 && Number(sharesToPurchase) && shareSymbol) {
      this.handleToggleModal();
    } else {
      this.setState({
        error: "You need to put a valid sharesymbol and amount of shares"
      })
    }
  }

  getValuesandFetch() {
    var sharesToPurchase = this.sharesToPurchase.value;
    var shareSymbol = this.shareSymbol.value;
    this.props.fetch(sharesToPurchase, shareSymbol);
    this.handleToggleModal();
  }

  render() {
    return (
      <React.Fragment>
      <div className="container">
        <h4>Time to choose some stawks</h4>
        <div className="content">
          <label>Choose stock symbol</label>
          <input
            type="text"
            ref={input => {
              this.shareSymbol = input;
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
          >
            Submit
          </button>
        </div>
      </div>
      {this.state.showModal &&
      <Modal onCloseRequest={this.handleToggleModal}>
        <h1>Confirmation Of purchase</h1>
        <p>You are about to purchase {this.sharesToPurchase.value} shares of {this.shareSymbol.value} </p>
        <div><button onClick={this.getValuesandFetch}>confirm</button></div>
        <div><button onClick={this.handleToggleModal}>cancel</button></div>
      </Modal> 
      }
      </React.Fragment>
    );
  }
}

export default PurchaseEquities;
