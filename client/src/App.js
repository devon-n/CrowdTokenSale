// Import dependencies
import React, { Component } from "react";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component { // Create class for the app
  state = { loaded: false, kycAddress: "0x123...", tokenSaleAddress: null, userTokens: 0 }; // Set state variables

  componentDidMount = async () => { // Function to load the smart contracts
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();

      // Get contracts
      this.tokenInstance = new this.web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[this.networkId] && MyToken.networks[this.networkId].address,
      );

      this.tokenSaleInstance = new this.web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address,
      );

      this.kycInstance = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listenTokTokenTransfer();
      this.setState({ loaded:true, tokenSaleAddress: MyTokenSale.networks[this.networkId].address }, this.updateUserTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  updateUserTokens = async () => {
    let userTokens = await this.tokenInstance.methods.balanceOf(this.accounts[0]).call();
    this.setState({userTokens: userTokens});
  }

  listenTokTokenTransfer = () => {
    this.tokenInstance.events.Transfer({to: this.accounts[0]}).on("data",this.updateUserTokens);
  }

  handleBuyTokens = async() => {
    await this.tokenSaleInstance.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0], value: this.web3.utils.toWei("1", "wei")});
  }

  // Function to handle changes in the input box
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value; // if checkbox set checkbox else set to value of the field
    const name = target.name; // Get name of input box
    this.setState({
      [name]: value // Set input box value
    });
  }

  // Handle clicking buttong
  handleKycWhitelisting = async () => {
    await this.kycInstance.methods.setKycCompleted(this.state.kycAddress).send({from: this.accounts[0]}); // Call the contract from accounts[0] (deployed user)
    alert("KYC for " + this.state.kycAddress + " is completed"); // Create alert
  }
  
  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Starducks Cappucino Token Sale</h1>
        <p>Get your Tokens today!</p>
        <h2>Kyc Whitelisting</h2>
        Address to allow: <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange}/> 
        <button type="button" onClick={this.handleKycWhitelisting}>Add to Whitelist</button>
        <h2>Buy Tokens</h2>
        <p>Buy tokens by sending wei to this address: {this.state.tokenSaleAddress}</p>
        <p>You currently have: {this.state.userTokens} CAPPU Tokens</p>
        <button type="button" onClick={this.handleBuyTokens}>Buy more tokens</button>
      </div>
    );
  }
}

export default App;
