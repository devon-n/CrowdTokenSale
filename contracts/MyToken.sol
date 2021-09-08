pragma solidity 0.6.1; // Using solidity 0.6.1

import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; // Import ERC20 token
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol"; // Import ERC20 Detailed token

contract MyToken is ERC20, ERC20Detailed { // inherit from the imported contracts above

    // constructor function is called on deployment of contract
    constructor(uint256 initialSupply) ERC20Detailed("StarDucks Cappucino Token", "CAPPU", 0) public {
        // Create initialSupply amount of coins using the inherited mint function
        _mint(msg.sender, initialSupply);
    }
}