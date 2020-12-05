### Revised version of Game of Stawks  
Live version - https://game-of-stawks.herokuapp.com/  
Built using React and React Router  
React, MongoDB, Mongoose, Express/Node stack  

## DESCRIPTION  
Purpase to build a fake portfolio using a stock market API and get benefits based on how well
your fake portfolio is doing  

```
npm install
npm run buildDev
```  

See local build on localhost:3099  

sign up form and then purcahse stocks

/* TO DO */  
do research on material UI implement on other parts
clean up webpack 
create prod configuration  
do research on IEX cloud for stock api  

## STOCK API currently being used
https://cloud.iexapis.com11  

## DEPLOY TO HEROKU  
https://devcenter.heroku.com/changelog-items/1557  - will run build script automatically   

if deploying another branch  
```
git push heroku startRefactor:master
``` 
 if deploying master   

```
git push heroku master
```
more info here https://devcenter.heroku.com/articles/git#creating-a-heroku-remote  

### DEPLOYING A NODE JS APP TO HEROKU  
https://devcenter.heroku.com/articles/deploying-nodejs  
heroku uses the procfile - if no procfile will use start script in package.json

## RUN A HEROKU APP Locally  
```
heroku local web
```  

## MORE RESOURCES  
https://devcenter.heroku.com/articles/preparing-a-codebase-for-heroku-deployment  

https://git.heroku.com/game-of-stawks.git


### BUGS  
fix error of not pinging database on page refresh on dashboard
also fix bug of posting content of share symbols to lowercase e.g. IAG - iag right not posting in uppercase

# Integration with Ethereum  

### PREREQUISITES 
Truffle  (DEVELOPMENT ENVIRONMENT)  
```npm install -g truffle```  

Ganache (GUI)  
https://www.trufflesuite.com/ganache  

MetaMask  (Browser Plugin for Chrome, Firefox, Brave)  
https://metamask.io/  


STEPS For creating a development environment for GOS Token    
STEPS For creating a development environment  
1. make sure you have a network available! Start ganache application with quickstart ethereum network, go to account and copy an address into clipboard (best to copy 3rd or 4th)  
2. make sure you have truffle cli installed and make sure ganache is configured in config file, now it is time to compile and deploy our solidity contracts to abi  
```truffle migrate --network ganache --reset```
3. when compiling and deployment is complete
check in ganache that contract was deployed you should see
the address of the contract under transactions tab look for contract created - check addresss and copy it to an empty document you'll need this later to paste into UI  

4. Go to metamask and make sure you're logged out   
go to ganache copy mneomonic phrase  
back to meta mask  
choose rinkeby test account  
click import using account seed phrase  
paste in seed phrase   
create a new password  
click restore  
then make sure you create custom network under settings  
choose a name and add new rpc url which is displayed in ganache click save  
also add http://localhost to connections  
change network dropdown to new custom name you created with ganache url   
also notice the account that was used to deploy which is first one listed in ganache has less ether as it costs (gas/ether) to deploy  contracts    

5. the abi array that was created during compilation is needed for the front end  
run  ```node migrateToken```  
this will take the json from the build file strip out what's not needed and copy it to a separate json file which our back end will consume to award tokens  

`npm run buildDev`


TO DO Keep track of balances in smart contract for each user (in progress)
before making sale warn them about connecting to ethereum

deploy to heroku
deploy to goerli using geth


alert user if tokenSendSuccess is true to see if user received gost tokens when they sold stonks - alert on each sale/withdraw
ask question on ethere stack exchannge in order to use infura I need to provide nmenmonic to 

`npx truffle console --network ropsten`  
then  
`await web3.eth.getAccounts()`
 `await web3.eth.getBalance('0xa1bf66d393F5CbecC66368ED28BB11715b94F1F7')`





