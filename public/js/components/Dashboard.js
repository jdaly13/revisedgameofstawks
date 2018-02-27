import React, { PropTypes } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';


class UserProfile extends React.Component { 
	constructor(props, context) {
		super(props, context);
		this.data = props.data;
		this.secretData = props.secretData;
	}

	getDashBoard() {
		return (
			<Card className="container">
			<CardTitle
				title="Dashboard"
				subtitle="You should get access to this page only after authentication."
			/>
			{this.secretData && <CardText style={{ fontSize: '16px', color: 'green' }}>{this.secretData}</CardText>}
			</Card>
		)
	}

	getHeadings() {
		return (
			<div>
				<strong>Your Start Amount: {this.data.startAmount}</strong>
				<h1> Your Net Balance: {this.data.netBalance}</h1>
				<h2> Your Portfolio Value: {this.data.portfolioValue} </h2>
				<h3> Your Total Invested Amount: {this.data.totalInvestedAmount} </h3>
			</div>
		)
	}

	getTitle() {
		return (
			<div>
				<h3> {this.data.availableBalance} </h3>
				<h3>Your gain loss: <span>{this.data.gainOrLoss} </span> </h3>
				<h3>Your net balance: <span>{this.data.netBalance}</span> </h3>
				<h3> Your portfolio Value: <span> {this.data.portfolioValue} </span></h3>
			</div>
		)
	}

	getPortfolio() {
		return (
			this.data.portfolio.map((obj, index) => 
				<p key={obj._id} id={obj.symbol} > 
				You have {obj.noOfShares} shares of {obj.name}.   
				The average price paid per share is {obj.pershareavg} and your total invested amount is {obj.investedamount}
				</p>
			)
		)
	}

	render () {
		return (
		<div>
			{this.getDashBoard()}
			{this.getHeadings()}
			{this.getTitle()}
			{this.getPortfolio()}

		</div>
		);
	}

}


export default UserProfile;
