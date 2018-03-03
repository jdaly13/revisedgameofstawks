import React, { PropTypes } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';

class PurchaseEquities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.sharesToPurchase = 0;
    this.shareSymbol = '';
    this.getValuesandFetch = this.getValuesandFetch.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    //this.portfolio = nextProps.portfolio;
  }

  getValuesandFetch() {
    var sharesToPurchase = this.sharesToPurchase.value;
    var shareSymbol = this.shareSymbol.value;
    if (sharesToPurchase > 0 && Number(sharesToPurchase) && shareSymbol) {
      this.props.fetch(sharesToPurchase, shareSymbol);
    }
  }

  render() {
    return (
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
            placeholder="200 must be a number"
          />
        </div>
        <div className="content">
          <button
            className="submit"
            onClick={this.getValuesandFetch}
            type="submit"
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default PurchaseEquities;
