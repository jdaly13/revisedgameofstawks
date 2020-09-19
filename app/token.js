let fs = require('fs');
let Web3 = require('web3');

var token = require('../compiled-token.json');
//var port = process.env.PORT || 3099;
console.log('tokensdfsdfs', token)

module.exports = async function sendToken(amount, address) {

    var web3 = new Web3(`http://localhost:7545`);
    var contract = new web3.eth.Contract(token.abi, token.networks.address);

    const accounts = await web3.eth.getAccounts();
    return contract.methods.transfer(address, Math.floor(amount * 100)).send({
        from: accounts[0]
    }).then((res) => {
        console.log('res', res)
    }).catch((err) => {
        console.log(err)
    })


}