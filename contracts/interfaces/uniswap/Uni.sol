// SPDX-License-Identifier: MIT
// COPIED FROM https://github.com/iearn-finance/yearn-protocol/blob/develop/interfaces/uniswap/Uni.sol

pragma solidity ^0.5.17;

interface Uni {
    function swapExactTokensForTokens(
        uint256,
        uint256,
        address[] calldata,
        address,
        uint256
    ) external;
}
