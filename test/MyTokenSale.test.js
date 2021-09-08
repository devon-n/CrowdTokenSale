const TokenSale = artifacts.require("MyTokenSale");
const Token = artifacts.require("MyToken"); // Import the contract to test
const KycContract = artifacts.require('KycContract');

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect; // use expect function from chai

require("dotenv").config({path: "../.env"}); // Where INITIAL_TOKENS is stored

contract("TokenSale Test", async (accounts) => { // Testing the contract

    // const [deployerAccount, recipient, anotherAccount] = accounts;

    it('should not have any tokens in my deployerAccount', async () => {
        let instance = await Token.deployed(); // deploy contract
        return expect(instance.balanceOf(accounts[0])).to.eventually.be.a.bignumber.equal(new BN(0)); // balance of accounts[0] == 0
    });

    it('all tokens should be in the TokenSale contract by default', async () => {
        let instance = await Token.deployed(); // deploy contract
        let balanceOfTokenSaleSmartContract =  await instance.balanceOf(TokenSale.address); // get balance of contract
        let totalSupply = await instance.totalSupply(); // get total supply of contract
        expect(balanceOfTokenSaleSmartContract).to.be.a.bignumber.equal(totalSupply); // contract balance == total supply
    })

    it('should be possible to buy tokens', async () => {
        let tokenInstance = await Token.deployed(); // deploy token contract
        let tokenSaleInstance = await TokenSale.deployed(); // deploy tokensale contract
        let kycInstance = await KycContract.deployed(); // deploy KYC contract
        let balanceBefore = await tokenInstance.balanceOf(accounts[0]); // get balance of accounts[0]
        await kycInstance.setKycCompleted(accounts[0], {from:accounts[0]}); // set kyc of account[0] to true by account[0]
        await expect(tokenSaleInstance.sendTransaction({from: accounts[0], value: web3.utils.toWei("1", "wei")})).to.be.fulfilled; // Send one wei to contract
        return expect(tokenInstance.balanceOf(accounts[0])).to.eventually.be.a.bignumber.equal(balanceBefore.add(new BN(1))); // check balance of sending account
    })

})