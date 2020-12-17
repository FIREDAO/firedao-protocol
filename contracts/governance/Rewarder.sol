pragma solidity ^0.5.17;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../interfaces/fire/IRewardPool.sol";

contract Rewarder is Ownable {

    function reward(IERC20 token, address[] calldata recipients, uint256[] calldata values) external onlyOwner {
        uint256 total = 0;
        for (uint256 i = 0; i < recipients.length; i++) {
            total += values[i];
        }
        require(token.transferFrom(msg.sender, address(this), total));
        for (uint256 i = 0; i < recipients.length; i++) {
            require(token.transfer(recipients[i], values[i]));
            IRewardPool(recipients[i]).notifyRewardAmount(values[i]);
        }
    }
}