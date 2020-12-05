require('dotenv').config({path: __dirname + '../.env'});
const HDWalletProvider = require('@truffle/hdwallet-provider');
let Web3 = require('web3');

var token = require('../compiled-token.json');

let host;
let port;
let web3address;

if (process.env.NETWORK === 'ganache') {
    host = process.env.HOST;
    port = process.env.GANACHEPORT;
    web3address = host + port;
}

if (process.env.NETWORK === "ropsten") {
    web3address = new HDWalletProvider(process.env.MNEMONIC, `https://ropsten.infura.io/v3/5a327d7e11d1415e99866d9a3f203ae2`)
}

module.exports = async function sendToken(amount, address) {
    if (!address) return Promise.reject(new Error('no address'));
    var web3 = new Web3(web3address);
    var contract = new web3.eth.Contract(token.abi, token.networks.address);

    const accounts = await web3.eth.getAccounts();
    return contract.methods.transfer(address, Math.floor(amount * 100)).send({
        from: accounts[0]
    }).then((res) => {
        return amount;
    });
}