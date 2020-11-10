pragma solidity ^0.5.17;

import "../RewardPool.sol";

contract TestRewardPool is RewardPool {
    constructor(        
        address _rewardToken,
        address _lpToken,
        uint256 _duration,
        address _rewardDistribution
    )
        public
        RewardPool(_rewardToken, _lpToken, _duration, _rewardDistribution)
    {
    }

    function update() external onlyRewardDistribution updateReward(address(0)) {
    }
}
