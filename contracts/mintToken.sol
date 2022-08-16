// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

import "./exchangeRate.sol";
import "./safeMath.sol";

contract INRtoken is ERC20, USDtoINR{
    using SafeMath for uint256;
    IERC20 usdt = IERC20(address(0x07865c6E87B9F70255377e024ace6630C1Eaa37F));
    address public presenter;
    // USDtoINR public exchangeRate = new USDtoINR();

    constructor(uint256 initialSupply) ERC20("Rupees", "INR") {
        _mint(msg.sender, initialSupply);
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
    // function setPresenter(address _presenter) onlyOwner public {
    //     presenter = _presenter;
    // }
    

    // function mintINR(address minterAddress, uint256 mintINRAmount) public  {
    //     _mint(minterAddress, mintINRAmount);
    // }

    function mint(uint256 amount) public {
        (bool sent) = usdt.transferFrom(msg.sender, address(this), amount);
        require(sent, "Failed to transfer USDC from user to vendor");
        uint256 _rate = getRate();
        uint256 _amount = amount.mul(_rate.div(10**18)).mul(995).div(1000);
        require(_amount > 0, "Pool: Amount is too small");
        _mint(msg.sender, _amount);
        // _mint(msg.sender, amount);
    }

    function burn( uint256 amount) public {
        // _burn(msg.sender, amount);
        require(amount > 0, "Pool: Amount is too small");
        uint256 _rate = getRate();
        uint256 _amount = amount.div(_rate.div(10**18)).mul(995).div(1000); // inr -> usdc
        require(_amount > 0, "Pool: USDC Amount is too small");
        (bool sent) = usdt.transfer(msg.sender, _amount);
        require(sent, "Failed to transfer USDC from vendor to user");
        _burn(msg.sender, amount);
    }

    function withdrawALL() public onlyOwner {
        require(usdt.transfer(msg.sender, usdt.balanceOf(address(this))), 'Unable to transfer');
        withdrawLink();
    }
}