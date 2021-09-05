let Web3 = require('web3');
var HDWalletProvider = require('@truffle/hdwallet-provider');

var token = require('../compiled-token.json');

let host;
let port;
let web3address;
let contractAddress = token.networks.address;
let account = 0;

if (process.env.NETWORK === 'ganache') {
    host = process.env.HOST;
    port = process.env.GANACHEPORT;
    web3address = host + port;
}

if (process.env.NETWORK === 'goerli') { 
    host = process.env.HOST;
    port = process.env.GOERLIPORT;
    web3address = host + port;
    contractAddress = process.env.GOERLICONTRACT;
    account = 2;
}

if (process.env.NETWORK === "ropsten") {
    web3address = new HDWalletProvider(process.env.MNEMONIC, `https://ropsten.infura.io/v3/5a327d7e11d1415e99866d9a3f203ae2`)
}

// TO DO same as above https://ethereumdev.io/waiting-for-a-transaction-to-be-mined-on-ethereum-with-js/
// REF - https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html#methods-mymethod-estimategas
module.exports = async function sendToken(amount, address) {
    if (!address) return Promise.reject(new Error('no address'));
    var web3 = new Web3(web3address);
    var contract = new web3.eth.Contract(token.abi, contractAddress);
    const accounts = await web3.eth.getAccounts();
    const gasEstimate = await contract.methods.transfer(address, Math.floor(amount * 100)).estimateGas(address, amount, {from: accounts[account]});
    const gasPrice = await web3.eth.getGasPrice();
    const totalGas = gasPrice * gasEstimate;
    console.log('totlaGas - ', totalGas);
    return contract.methods.transfer(address, Math.floor(amount * 100)).send({
        from: accounts[account]
    }).then((res) => {
        console.log('gas price -', gasPrice, 'gasEstimate', gasEstimate, totalGas);
        return amount;
    });
}