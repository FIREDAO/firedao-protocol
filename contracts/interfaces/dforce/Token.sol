// SPDX-License-Identifier: MIT
// COPIED FROM https://github.com/iearn-finance/yearn-protocol/blob/develop/interfaces/dforce/Token.sol

pragma solidity ^0.5.17;

interface dERC20 {
    function mint(address, uint256) external;

    function redeem(address, uint256) external;

    function getTokenBalance(address) external view returns (uint256);

    function getExchangeRate() external view returns (uint256);
}
