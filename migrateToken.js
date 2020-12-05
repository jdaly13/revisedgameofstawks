require('dotenv').config({path: __dirname + '/.env'});
const fs = require('fs');

const fileToRead = process.env.CONTRACT || "GameOfStawksToken"

// let file = fs.readFileSync('./build/contracts/GameOfStawksToken.json', 'utf8');
let file = fs.readFileSync(`./build/contracts/${fileToRead}.json`, 'utf8');

let json = JSON.parse(file);
let key;
const token = {};

// const networks = Object.keys(json.networks) // all networks
token.abi = json.abi;
if (process.env.NETWORK === "ganache") {
    key = 5777
}
if (process.env.NETWORK === "ropsten") {
    key = 3;
}
token.networks = json.networks[key];

fs.writeFileSync('compiled-token.json', JSON.stringify(token));