// SPDX-License-Identifier: MIT

pragma solidity ^0.5.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import "../interfaces/fire/IController.sol";

import "../interfaces/fire/IRewardPool.sol";
import "./TestVault.sol";

contract TestStrategy {
    using SafeERC20 for IERC20;
    using Address for address;
    using SafeMath for uint256;

    address public want;
    
    uint256 public performanceFee = 500;
    uint256 public constant performanceMax = 10000;

    address public governance;
    address public controller;
    address public strategist;

    address tv;
    IRewardPool pool;

    constructor(address _controller, address _want, address _tv, address _pool) public {
        governance = msg.sender;
        strategist = msg.sender;
        controller = _controller;

        want = _want;
        tv = _tv;
        pool = IRewardPool(_pool);
    }

    function getName() external pure returns (string memory) {
        return "TestStrategy";
    }

    function setStrategist(address _strategist) external {
        require(msg.sender == governance, "!governance");
        strategist = _strategist;
    }

    function setPerformanceFee(uint256 _performanceFee) external {
        require(msg.sender == governance, "!governance");
        performanceFee = _performanceFee;
    }

    function deposit() public {
        uint256 _want = IERC20(want).balanceOf(address(this));
        if (_want > 0) {
            IERC20(want).safeApprove(tv, 0);
            IERC20(want).safeApprove(tv, _want);
            TestVault(tv).deposit(_want);
        }

        uint256 _tv = IERC20(tv).balanceOf(address(this));
        if (_tv > 0) {
            IERC20(tv).safeApprove(address(pool), 0);
            IERC20(tv).safeApprove(address(pool), _tv);
            pool.stake(_tv);
        }
    }

    // Controller only function for creating additional rewards from dust
    function withdraw(IERC20 _asset) external returns (uint256 balance) {
        require(msg.sender == controller, "!controller");
        require(want != address(_asset), "want");
        require(tv != address(_asset), "testvault");
        balance = _asset.balanceOf(address(this));
        _asset.safeTransfer(controller, balance);
    }

    // Withdraw partial funds, normally used with a vault withdrawal
    function withdraw(uint256 _amount) external {
        require(msg.sender == controller, "!controller");
        uint256 _balance = IERC20(want).balanceOf(address(this));
        if (_balance < _amount) {
            // _amount = _withdrawSome(_amount.sub(_balance));
            // _amount = _amount.add(_balance);
            _withdrawAll();
        }

        address _vault = IController(controller).vaults(address(want));
        require(_vault != address(0), "!vault"); // additional protection so we don't burn the funds

        IERC20(want).safeTransfer(_vault, _amount);
        if (IERC20(want).balanceOf(address(this)) > 0) {
            deposit();
        }
    }

    // Withdraw all funds, normally used when migrating strategies
    function withdrawAll() external returns (uint256 balance) {
        require(msg.sender == controller, "!controller");
        _withdrawAll();

        balance = IERC20(want).balanceOf(address(this));

        address _vault = IController(controller).vaults(address(want));
        require(_vault != address(0), "!vault"); // additional protection so we don't burn the funds
        IERC20(want).safeTransfer(_vault, balance);
    }

    function _withdrawAll() internal {
        pool.exit();
        uint256 _tv = IERC20(tv).balanceOf(address(this));
        if (_tv > 0) {
            TestVault(tv).withdrawAll();
        }
    }

    function harvest() public {
        require(msg.sender == strategist || msg.sender == governance, "!authorized");
        pool.getReward();
        uint256 _want = IERC20(want).balanceOf(address(this));

        if (_want > 0) {
            uint256 _fee = _want.mul(performanceFee).div(performanceMax);
            IERC20(want).safeTransfer(IController(controller).rewards(), _fee);
            deposit();
        }
    }

    function balanceOfWant() public view returns (uint256) {
        return IERC20(want).balanceOf(address(this));
    }

    function balanceOfPool() public view returns (uint256) {
        if (IERC20(tv).totalSupply() > 0) {
            return pool.balanceOf(address(this)).mul(TestVault(tv).getPricePerFullShare()).div(1e18);
        } else {
            return pool.balanceOf(address(this));
        }
    }

    function getExchangeRate() public view returns (uint256) {
        return TestVault(tv).getPricePerFullShare();
    }

    function balanceOfTV() public view returns (uint256) {
        if (IERC20(tv).totalSupply() > 0) {
            return IERC20(tv).balanceOf(address(this)).mul(TestVault(tv).getPricePerFullShare()).div(1e18);
        } else {
            return IERC20(tv).balanceOf(address(this));
        }
    }

    function balanceOf() public view returns (uint256) {
        return balanceOfWant().add(balanceOfTV()).add(balanceOfPool());
    }

    function setGovernance(address _governance) external {
        require(msg.sender == governance, "!governance");
        governance = _governance;
    }

    function setController(address _controller) external {
        require(msg.sender == governance, "!governance");
        controller = _controller;
    }
}
