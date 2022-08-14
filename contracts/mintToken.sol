// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./exchangeRate.sol";


contract INRtoken is ERC20, Ownable{
    address public presenter;

    constructor(uint256 initialSupply) ERC20("Rupees", "INR") {

    }
    // function setPresenter(address _presenter) onlyOwner public {
    //     presenter = _presenter;
    // }
    

    // function mintINR(address minterAddress, uint256 mintINRAmount) public  {
    //     _mint(minterAddress, mintINRAmount);
    // }

    function mint(uint256 amount) public onlyOwner {
        uint256 _amount = amount/rate;
        _mint(msg.sender, _amount);
    }

    function burn( uint256 amount) public onlyOwner {
        _burn(msg.sender, amount);
    }

//     function burn(uint amount) override external {
//         require(presenter == _msgSender(), "N07Token: presenter only");
//         _burn(_msgSender(), amount);
//   }
}