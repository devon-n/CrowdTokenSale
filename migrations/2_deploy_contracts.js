var MyToken = artifacts.require("MyToken.sol"); // Require the contract
var MyTokenSale = artifacts.require('MyTokenSale.sol');
var MyKycContract = artifacts.require('KycContract.sol');
require("dotenv").config({path: "../.env"});

module.exports = async function(deployer) { // Upload the smart contract
    let addr = await web3.eth.getAccounts();
    await deployer.deploy(MyToken, process.env.INITIAL_TOKENS); // deploy the contract and mint 1 000 000 tokens
    await deployer.deploy(MyKycContract); // deploy KYC contract
    await deployer.deploy(MyTokenSale, 1, addr[0], MyToken.address, MyKycContract.address); // deploy tokensale contract
    let instance = await MyToken.deployed(); // deploy my token contract
    await instance.transfer(MyTokenSale.address, process.env.INITIAL_TOKENS); // transfer tokens
}