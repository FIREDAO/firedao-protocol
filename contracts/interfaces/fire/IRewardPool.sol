pragma solidity ^0.5.17;

interface IRewardPool {
    function totalSupply() external view returns (uint256);
    
    function balanceOf(address account) external view returns (uint256);

    function stake(uint256 amount) external ;

    function withdraw(uint256 amount) external ;

    function earned(address account) external view returns (uint256);

    function exit() external;

    function getReward() external ;

    function notifyRewardAmount(uint256 reward) external;
}