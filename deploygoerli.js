let fs = require('fs');
let Web3 = require('web3');

require('dotenv').config({path: __dirname + '/.env'});
const fileToRead = process.env.CONTRACT || "GameOfStawksToken";
let file = fs.readFileSync(`./build/contracts/${fileToRead}.json`, 'utf8');
let contract = JSON.parse(file);
let web3 = createWeb3();

console.log(contract.abi, !!web3);


deployContract(web3, contract)
    .then(function () {
        console.log('Deployment finished')
    })
    .catch(function (error) {
        console.log(`Failed to deploy contract: ${error}`)
    })

// function compileContract() {
//     let compilerInput = {
//         language: 'Solidity',
//         sources: {
//             'WWTtoken.sol': {
//                 content: fs.readFileSync('WWTtoken.sol', 'utf8')
//             }
//         },
//         settings: {
//             outputSelection: {
//                 '*': {
//                     '*': [ '*' ]
//                 }
//             }
//         }
//     };

//     function findImports(path) {
//         console.log('path', path);
//         return {
//             contents: fs.readFileSync(`node_modules/${path}`, 'utf-8')
//         }
//     }

//     console.log('Compiling the contract')
//     // Compile the contract
//     let output = JSON.parse(
//         solc.compile(JSON.stringify(compilerInput), {import: findImports})
//     );
//     console.log('output', output)
//     // Get compiled contract
//     let contract = output.contracts['WWTtoken.sol']['WWTtoken']

//     // Save contract's ABI
//     // let abi = contract.abi;
//     fs.writeFileSync('token-abi.json', JSON.stringify(contract));
//     fs.writeFileSync('../survey-app/src/token-abi.json', JSON.stringify(contract))

//     return contract;
// }

function createWeb3() {
    return new Web3('http://localhost:8545') //port you are using in network
}

async function deployContract(web3, contract) {
    let Token = new web3.eth.Contract(contract.abi);
    let bytecode = contract.bytecode;
    //let gasEstimate = await web3.eth.estimateGas({data: bytecode});
    console.log('got bytecode')
    let accounts = await web3.eth.getAccounts();

    console.log('acccounts');

    console.log('accounts', accounts[2])

    /*["0x32a0888965c6ee1354df982a41ed4ec73e280db2", 
    "0x8e00b25c1db29347df8c6ca5fe44a07d45f6f043", 
    "0xa18cf86870b4d9dcfc088c30c4812dee4e687f7e"]
    */
    const contractInstance = await Token.deploy({
        data: bytecode,
        arguments: [99999999999999, 2]
    })
    .send({
        from: accounts[2],
        gas: '5500000'
    })
    .on('transactionHash', function(transactionHash) {
        console.log(`Transaction hash: ${transactionHash}`);
    })
    .on('confirmation', function(confirmationNumber, receipt) {
        console.log(`Confirmation number: ${confirmationNumber} plus ${receipt.blockNumber}`);
        
    })
    .on('receipt', function(receipt){
        console.log(receipt.contractAddress) // contains the new contract address
        const address = receipt.contractAddress;
        const data = JSON.stringify(address);
        fs.writeFileSync('private/contract-address-goerli.json', data);
     })
    .on('error', (error)=> {
        console.log('errrrjjjjj', error)
    })

    console.log(`Contract address: ${contractInstance.options.address}`);
}