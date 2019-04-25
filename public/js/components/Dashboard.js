import React from 'react';

class UserProfile extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.data = props.data;
    this.secretData = props.secretData;
    this.portfolio = props.portfolio;
  }

  componentWillReceiveProps(nextProps) {
    this.portfolio = nextProps.portfolio;
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
          {' '}
          Your Net Balance:{' '}
          {this.data.netBalance ? this.data.netBalance : this.data.startAmount}
        </h1>
        <h2>
          {' '}
          Your Portfolio Value:{' '}
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
        <h3> {this.data.availableBalance} </h3>
        <h3>
          Your gain loss: <span>{this.data.gainOrLoss} </span>{' '}
        </h3>
        <h3>
          Your net balance: <span>{this.data.netBalance}</span>{' '}
        </h3>
        <h3>
          {' '}
          Your portfolio Value: <span> {this.data.portfolioValue} </span>
        </h3>
      </div>
    );
  }

  getPortfolio() {
    return this.portfolio.map((obj, index) => (
      <div key={obj._id} id={obj.symbol}>
        <span>
          You have {obj.noOfShares} shares of {obj.name}.{' '}
        </span>
        <span>
          The average price paid per share is {obj.pershareavg} and your total
          invested amount is {obj.investedamount + ' '}{' '}
        </span>
        <span>
          {' '}
          The Current Price of {obj.name} is {obj.currentPrice}{' '}
        </span>
        <span> The current value of your stock is {obj.currentValue} </span>
        <span> Your current gain or loss is {obj.gainOrLoss} </span>
      </div>
    ));
  }

  render() {
    return (
      <div className="container">
        {this.getDashBoard()}
        {this.getHeadings()}
        {!!this.portfolio.length && (
          <div>
            {this.getTitle()}
            {this.getPortfolio()}
          </div>
        )}
      </div>
    );
  }
}

export default UserProfile;
