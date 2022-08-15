// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

import "./exchangeRate.sol";
import "./safeMath.sol";

contract INRtoken is ERC20, USDtoINR{
    using SafeMath for uint256;
    IERC20 usdt = IERC20(0x07865c6E87B9F70255377e024ace6630C1Eaa37F);
    uint256 swapFEE = uint256(995).div(1000);
    address public presenter;
    // USDtoINR public exchangeRate = new USDtoINR();

    constructor(uint256 initialSupply) ERC20("Rupees", "INR") {

    }
    // function setPresenter(address _presenter) onlyOwner public {
    //     presenter = _presenter;
    // }
    

    // function mintINR(address minterAddress, uint256 mintINRAmount) public  {
    //     _mint(minterAddress, mintINRAmount);
    // }

    function mint(uint256 amount) public {
        usdt.transferFrom(msg.sender, address(this), amount);
        uint256 _amount = amount.mul(rate);
        _mint(msg.sender, _amount.mul(swapFEE));
    }

    function burn( uint256 amount) public {
        uint256 _amount = amount.div(rate);
        _burn(msg.sender, _amount);
        usdt.transferFrom(address(this), msg.sender, _amount.mul(swapFEE));
    }

//     function burn(uint amount) override external {
//         require(presenter == _msgSender(), "N07Token: presenter only");
//         _burn(_msgSender(), amount);
//   }
}