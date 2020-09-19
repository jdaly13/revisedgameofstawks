const fs = require('fs');


let file = fs.readFileSync('./build/contracts/GOStoken.json', 'utf8');
let json = JSON.parse(file);
const token = {};

token.abi = json.abi;
token.networks = json.networks[Object.keys(json.networks)[0]];

fs.writeFileSync('compiled-token.json', JSON.stringify(token));