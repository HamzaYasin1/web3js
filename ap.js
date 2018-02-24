//This module help to listen request
var express = require('express');
var app = express();
var task_code = '';
var ToAddress = '';
var FromAddress = '';
var OtherContractAddress = '';
var PrivateKey = '';
var NoToken = '';
var NoEther = '';
//This module standard library for Ethereum Network.
const Web3 = require("web3");
const web3 = new Web3();
//This module library for Ethereum Transaction.
const Tx = require("ethereumjs-tx");
//This module library for Ethereum Accounts.
var Web3EthAccounts = require('web3-eth-accounts');
//Set Provider to make able to perform task on ethereum ROPSTEN TEST network. https:
//web3.setProvider(new web3.providers.HttpProvider("https://ropsten.infura.io/metamask"));
web3.setProvider(new web3.providers.HttpProvider("https://mainnet.infura.io/metamask")); //For mainnet
//ABI of standard ERC20 token contract  from https://www.ethereum.org/token
var abi = [ { "constant": false, "inputs": [ { "name": "newSellPrice", "type": "uint256" }, { "name": "newBuyPrice", "type": "uint256" } ], "name": "setPrices", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string", "value": "Test Token" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256", "value": "100000000000000000000" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8", "value": "18" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_value", "type": "uint256" } ], "name": "burn", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "sellPrice", "outputs": [ { "name": "", "type": "uint256", "value": "2" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "target", "type": "address" }, { "name": "mintedAmount", "type": "uint256" } ], "name": "mintToken", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "burnFrom", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "buyPrice", "outputs": [ { "name": "", "type": "uint256", "value": "1" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address", "value": "0x124b2450c25a71ae602b941569116e58b6afdb32" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string", "value": "TT" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "buy", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "frozenAccount", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_extraData", "type": "bytes" } ], "name": "approveAndCall", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" }, { "name": "", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "amount", "type": "uint256" } ], "name": "sell", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "target", "type": "address" }, { "name": "freeze", "type": "bool" } ], "name": "freezeAccount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "name": "initialSupply", "type": "uint256", "index": 0, "typeShort": "uint", "bits": "256", "displayName": "initial Supply", "template": "elements_input_uint", "value": "100" }, { "name": "tokenName", "type": "string", "index": 1, "typeShort": "string", "bits": "", "displayName": "token Name", "template": "elements_input_string", "value": "Test Token" }, { "name": "tokenSymbol", "type": "string", "index": 2, "typeShort": "string", "bits": "", "displayName": "token Symbol", "template": "elements_input_string", "value": "TT" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "target", "type": "address" }, { "indexed": false, "name": "frozen", "type": "bool" } ], "name": "FrozenFunds", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Burn", "type": "event" } ] // redacted on purpose
var abiArray = abi;
//Deployed contract address on Ropsten testnet
var contractAddress = "0xe828061329014Af81791BB204F5F945a990a9E38"; //For mainnet have to deploy new one.
//Make a variable to access contract's function
var contract =  web3.eth.contract(abiArray).at(contractAddress);

app.get('/', function (req, res) {
//To specify what to do and run that function.
    task_code = req.query.task;
    ToAddress = req.query.ToAddress;
    FromAddress = req.query.FromAddress;
    OtherContractAddress = req.query.OtherContractAddress;
    PrivateKey = req.query.PrivateKey;
    NoToken = req.query.NoToken;
    NoEther = req.query.NoEther;

    if(task_code == "Create"){
        Create(res);
    }
    if(task_code == "TokenTransfer"){
        TokenTransfer(res,ToAddress,NoToken,FromAddress,PrivateKey);
    }
    if(task_code == "OtherTokenTransfer"){
        OtherTokenTransfer(res,ToAddress,NoToken,FromAddress,PrivateKey,OtherContractAddress);
    }
    if(task_code == "EtherTransfer"){
        EtherTransfer(res,ToAddress,NoEther,FromAddress,PrivateKey);
    }
    if(task_code == "getEther"){
        getEther(res,ToAddress);
    }
    if(task_code == "seeToken"){
        seeToken(res,OtherContractAddress);
    }
    if(task_code == "showToken"){
        showToken(res,ToAddress,OtherContractAddress);
    }
});
//Get token detials like Decimal, Name and Symbol.
function seeToken(res,OtherContractAddress){
    var abiArray = abi;
    var OtherContractAddress = OtherContractAddress;
    var token={};
    var tokenContract = web3.eth.contract(abiArray).at(OtherContractAddress);
    token.Decimal = tokenContract.decimals();
    console.log(token['Decimal']);
    token.Name = tokenContract.name();
    console.log(token['Name']);
    token.Symbol = tokenContract.symbol();
    console.log(token['Symbol']);
    res.contentType('application/json');
    res.end(JSON.stringify(token));
}
//Get number of token on this "ToAddress" for this "OtherContractAddress" token.
function showToken(res,ToAddress,OtherContractAddress){
    var abiArray = abi;
    var OtherContractAddress = OtherContractAddress;
    var address = ToAddress;
    var tokenContract = web3.eth.contract(abiArray).at(OtherContractAddress);
    var balance = tokenContract.balanceOf(address);
    console.log(balance);
    res.contentType('application/json');
    res.end(JSON.stringify(balance));
}
//Create a acount and return address and private-key.
function Create(res){
    var account = new Web3EthAccounts('http://ropsten.infura.io/t2utzUdkSyp5DgSxasQX');
    res.contentType('application/json');
    res.end(JSON.stringify(account.create()));
}
//Get balance(Ether) on this "ToAddress".
function getEther(res,ToAddress){
    var balance = web3.eth.getBalance(ToAddress);
    res.contentType('application/json');
    res.end(JSON.stringify((balance.toNumber())));
}

//Transfer "NoEther" ether form "FromAddress" to "ToAddress" .
function EtherTransfer(res,ToAddress,NoEther,FromAddress,PrivateKey){
    web3.eth.defaultAccount = FromAddress;
    var count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
    console.log(ToAddress);
    console.log(NoEther);
    console.log(FromAddress);
    console.log(PrivateKey);
    var data = contract.transfer.getData(ToAddress, NoEther);
    var gasPrice = web3.eth.gasPrice;
    var gasLimit = 90000;

    var rawTransaction = {
        "from": FromAddress,
        "nonce": web3.toHex(count),
        "gasPrice": web3.toHex(gasPrice),
        "gasLimit": web3.toHex(gasLimit),
        "to": ToAddress,
        "value": web3.toHex(NoEther),
        "data": data,
        "chainId": 0x03
    };

    var privKey = new Buffer(PrivateKey, 'hex');
    var tx = new Tx(rawTransaction);

    tx.sign(privKey);
    var serializedTx = tx.serialize();

    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
        if (!err){
            console.log(hash);
            res.contentType('application/json');
            res.end(JSON.stringify(hash));
        }
        else
            console.log(err);
        }
    );
}

if (module === require.main) {
    // Start the server
    var server = app.listen(process.env.PORT || 8085, function () {
        var port = server.address().port;
        console.log('App listening on port %s', port);
    });
}
//Transfer "NoToken" token of the contract address provided above form "FromAddress" to "ToAddress" .
function TokenTransfer(res,ToAddress,NoToken,FromAddress,PrivateKey){
    web3.eth.defaultAccount = FromAddress;
    var count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
    var data = contract.transfer.getData(ToAddress, NoToken);
    var gasPrice = web3.eth.gasPrice;
    var gasLimit = 90000;
    var rawTransaction = {
        "from": FromAddress,
        "nonce": web3.toHex(count),
        "gasPrice": web3.toHex(gasPrice),
        "gasLimit": web3.toHex(gasLimit),
        "to": contractAddress,
        "data": data,
        "chainId": 0x03
    };
    var privKey = new Buffer(PrivateKey, 'hex');
    var tx = new Tx(rawTransaction);

    tx.sign(privKey);
    var serializedTx = tx.serialize();

    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
        if (!err){
            console.log(hash);
            res.contentType('application/json');
            res.end(JSON.stringify(hash));
        }
        else
            console.log(err);
        }
    );
}

//Transfer "NoToken" token of the contract address provided above form "FromAddress" to "ToAddress" .
function OtherTokenTransfer(res,ToAddress,NoToken,FromAddress,PrivateKey,OtherContractAddress){
    web3.eth.defaultAccount = FromAddress;
    var abiArray = abi;
    var OtherContractAddress = OtherContractAddress;
    var tokenContract = web3.eth.contract(abiArray).at(OtherContractAddress);
    var count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
    var data = tokenContract.transfer.getData(ToAddress, NoToken);
    var gasPrice = web3.eth.gasPrice;
    var gasLimit = 90000;
    var rawTransaction = {
        "from": FromAddress,
        "nonce": web3.toHex(count),
        "gasPrice": web3.toHex(gasPrice),
        "gasLimit": web3.toHex(gasLimit),
        "to": OtherContractAddress,
        "data": data,
        "chainId": 0x03
    };
    var privKey = new Buffer(PrivateKey, 'hex');
    var tx = new Tx(rawTransaction);

    tx.sign(privKey);
    var serializedTx = tx.serialize();

    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
        if (!err){
            console.log(hash);
            res.contentType('application/json');
            res.end(JSON.stringify(hash));
        }
        else
            console.log(err);
        }
    );
}
module.exports = app;