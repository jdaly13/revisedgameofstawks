import React, { PropTypes } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';


function loopit (arr) {
	var x = [];
	console.log(arr);
	
	arr.forEach(function (obj, index) {
					x.push(
					<p key={obj._id} id={obj.symbol} > 
					You have {obj.noOfShares} shares of {obj.name}.   
					The average price paid per share is {obj.pershareavg} and your total invested amount is {obj.investedamount}
					</p>
					);
	}); 
	
	return x;
}

function Profile (props) {

	let data = props.data;
	const Dashboard = (
		<Card className="container">
			<CardTitle
				title="Dashboard"
				subtitle="You should get access to this page only after authentication."
			/>

			{props.secretData && <CardText style={{ fontSize: '16px', color: 'green' }}>{props.secretData}</CardText>}
		</Card>
	);
	
	const content = (
						<div>
		            <strong>Your Start Amount: {data.startAmount}</strong>
								<h1> Your Net Balance: {data.netBalance}</h1>
								<h2> Your Portfolio Value: {data.portfolioValue} </h2>
								<h3> Your Total Invested Amount: {data.totalInvestedAmount} </h3>
						</div>
	);
	
	const title = (
	        <div>
            <h3> {data.availableBalance} </h3>
            <h3>Your gain loss: <span>{data.gainOrLoss} </span> </h3>
             <h3>Your net balance: <span>{data.netBalance}</span> </h3>
            <h3> Your portfolio Value: <span> {data.portfolioValue} </span></h3>
						{console.log(data.portfolio)}
        </div>
	);
	
	const portfolio = (
									<div>
										{loopit(data.portfolio)}
										
									</div>
	
	); 
																 
	
	return (
		<div>
		{Dashboard}
		
		{content}
		
		{title}
		{portfolio}
		
		</div>
	);
	
}

Profile.propTypes = {
  secretData: PropTypes.string.isRequired
};

export default Profile;
