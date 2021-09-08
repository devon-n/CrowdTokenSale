const Token = artifacts.require("MyToken"); // Import the contract to test

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect; // use expect function from chai

require("dotenv").config({path: "../.env"});

contract("Token Test", async (accounts) => { // Testing the contract

    beforeEach(async () => {
        this.myToken = await Token.new(process.env.INITIAL_TOKENS);
    })

    it("all tokens should be in my account", async () => { // Make sure the deployer of the contract receives all the tokens on init
        let instance = this.myToken; // deploy the token
        let totalSupply = await instance.totalSupply(); // get the total supply of coins
        return expect(await instance.balanceOf(accounts[0])).to.be.a.bignumber.equal(totalSupply); // check if total supply == balance of the deployer
    })

    it("is possible to send tokens between accounts", async () => { // Check if its possible to send tokens between accounts
        const sendTokens = 1; // Init amount to send
        let instance = this.myToken; // deploy token
        let totalSupply = await instance.totalSupply(); // get total supply
        await expect(instance.balanceOf(accounts[0])).to.eventually.be.a.bignumber.equal(totalSupply); // check if deployer has total supply of coins
        await expect(instance.transfer(accounts[1], sendTokens)).to.eventually.be.fulfilled; // send tokens to 2nd accounts
        await expect(instance.balanceOf(accounts[0])).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens))); // check if deployer as less coins
        return expect(instance.balanceOf(accounts[1])).to.eventually.be.a.bignumber.equal(new BN(sendTokens)); // check if 2nd account has more coins
    })

    it("is not possible to send more tokens than available in total", async () => { // Check if people can send more tokens than they have
        let instance = this.myToken; // deploy token (These double deploys can be done different before)
        let balanceOfDeployer = await instance.balanceOf(accounts[0]); // get balance of account that deployed the contract
        await expect(instance.transfer(accounts[1], new BN(balanceOfDeployer+1))).to.eventually.be.rejected; // send 2nd account the balance of the first + 1
        return expect(instance.balanceOf(accounts[0])).to.eventually.be.a.bignumber.equal(balanceOfDeployer); // Check if transaction went through. If deployer has same amount in account
    })

})