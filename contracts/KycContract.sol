pragma solidity 0.6.1;

import "@openzeppelin/contracts/ownership/Ownable.sol";

contract KycContract is Ownable { // inherit from Ownable contract

    mapping(address => bool) allowed; // Mapping for address to boolean value

    function setKycCompleted(address _addr) public onlyOwner { // Function to set the Kyc status to true
        allowed[_addr] = true;
    }

    function setKycRevoked(address _addr) public onlyOwner { // function to set kyc status to false
        allowed[_addr] = false;
    }

    function kycCompleted(address _addr) public view returns(bool) { // Function to view the KYC status
        return allowed[_addr];
    }
}