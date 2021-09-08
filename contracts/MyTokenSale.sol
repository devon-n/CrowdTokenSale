pragma solidity 0.6.1;

import "./CrowdSale.sol";
import "./KycContract.sol";

contract MyTokenSale is Crowdsale { // Inherit from crowdsale contract

    KycContract kyc; // Initialise kyc contract as var

    constructor(uint256 rate, address payable wallet, IERC20 token, KycContract _kyc) Crowdsale(rate, wallet, token) public {
        kyc = _kyc; // constructor function called once at deployment to set the KYC contract address
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(kyc.kycCompleted(msg.sender), 'KYC Not completed, purchase not allowed'); // Require the purchaser to have KYC == True
    }
}