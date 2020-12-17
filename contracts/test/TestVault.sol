pragma solidity ^0.5.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

import "../interfaces/fire/IRewardPool.sol";

contract TestVault is ERC20, ERC20Detailed {
    using SafeERC20 for IERC20;
    using Address for address;
    using SafeMath for uint256;

    IERC20 public token;
    IRewardPool public rp;

    constructor(address _token, address _rp)
        public
        ERC20Detailed(
            string(abi.encodePacked("test", ERC20Detailed(_token).name())),
            string(abi.encodePacked("t", ERC20Detailed(_token).symbol())),
            ERC20Detailed(_token).decimals()
        )
    {
        token = IERC20(_token);
        rp = IRewardPool(_rp);
        token.approve(address(rp), uint(-1));
    }

    function balance() public view returns (uint256) {
        return token.balanceOf(address(this)).add(rp.balanceOf(address(this))).add(rp.earned(address(this)));
    }

    function deposit(uint256 _amount) public {
        uint256 _pool = balance();
        uint256 _before = token.balanceOf(address(this));
        token.safeTransferFrom(msg.sender, address(this), _amount);
        uint256 _after = token.balanceOf(address(this));
        _amount = _after.sub(_before); // Additional check for deflationary tokens
        uint256 shares = 0;
        if (totalSupply() == 0) {
            shares = _amount;
        } else {
            shares = (_amount.mul(totalSupply())).div(_pool);
        }
        _mint(msg.sender, shares);

        rp.stake(_amount);
    }

    function withdrawAll() external {
        withdraw(balanceOf(msg.sender));
    }

    // No rebalance implementation for lower fees and faster swaps
    function withdraw(uint256 _shares) public {
        uint256 r = (balance().mul(_shares)).div(totalSupply());
        _burn(msg.sender, _shares);

        rp.exit();
        token.safeTransfer(msg.sender, r);
        
        uint256 b = token.balanceOf(address(this));
        if (b > 0) {
            rp.stake(b);
        }
    }

    function getPricePerFullShare() public view returns (uint256) {
        return balance().mul(1e18).div(totalSupply());
    }
}
