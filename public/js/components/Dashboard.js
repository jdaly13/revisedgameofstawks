import React from 'react';
import Header from '../partials/Header';

class UserProfile extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.data = props.data;
    this.secretData = props.secretData;
    this.portfolio = props.portfolio;
  }

  componentWillReceiveProps(nextProps) {
    this.portfolio = nextProps.portfolio;
    this.data = nextProps.data;
  }

  getDashBoard() {
    return (
      <main className="container">
        {this.secretData && (
          <section style={{ fontSize: '16px', color: 'green' }}>
            {this.secretData}
          </section>
        )}
      </main>
    );
  }

  getHeadings() {
    return (
      <div>
        <strong>Your Start Amount: {this.data.startAmount}</strong>
        <h1>
          Your Net Balance:&nbsp; (Your available balance plus gainorloss)
          {this.data.netBalance ? this.data.netBalance : this.data.startAmount}
        </h1>
        <h2>
          Your Portfolio Value (investedamount plus gainorloss):&nbsp; 
          {this.data.portfolioValue
            ? this.data.portfolioValue
            : this.data.startAmount}{' '}
        </h2>
        <h3> Your Total Invested Amount: {this.data.totalInvestedAmount} </h3>
      </div>
    );
  }

  getTitle() {
    return (
      <div>
        <h3> Your available balance to spend {this.data.availableBalance} </h3>
        <h3>
          Your gain loss: <span>{this.data.gainOrLoss} </span> 
        </h3>
      </div>
    );
  }

  tokenInformation() {
    return (
      <div>
        <h3>Token information</h3>
        <h4> Tokens that have been produced {this.data.tokensProduced}</h4>
        <h4> Tokens Received {this.data.tokensGivenAndReceived.length && this.getTokensReceived()} </h4>
      </div>
    )
  }

  getTokensReceived() {
    const tokenReceivedString = "Total amount of tokens received "
    let total= 0;
    this.data.tokensGivenAndReceived.forEach((obj) => {
      console.log(obj)
      total += obj.amount;
    });
    return tokenReceivedString + total;
  }

  getPortfolio() {
    const outputPortfolio = () => {
      return this.portfolio.map((obj, index) => (
        <div className="portfolio" key={obj._id} id={obj.symbol}>
          <span>
            You have {obj.noOfShares} shares of {obj.name === "Not Available Currently" ? obj.symbol : obj.name}
          </span>
          <span>
            The average price paid per share is {obj.pershareavg} and your total
            invested amount is {obj.investedamount + ' '}{' '}
          </span>
          <span>
            The Current Price of {obj.name === "Not Available Currently" ? obj.symbol : obj.name} is {obj.currentPrice}
          </span>
          <span> The current value of your stock is {obj.currentValue} </span>
          <span> Your current gain or loss is {obj.gainOrLoss} </span>
        </div>
      ));
    }
    return (
      <React.Fragment>
      <h3>Your stock portfolio</h3>
      {outputPortfolio()}
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className="container">
        <Header/>
        {this.getDashBoard()}
        {this.getHeadings()}
        {!!this.portfolio.length && (
          <div>
            {this.getTitle()}
            {this.data && !!this.data.tokensProduced && this.tokenInformation()}
            {this.getPortfolio()}
          </div>
        )}
      </div>
    );
  }
}

export default UserProfile;
