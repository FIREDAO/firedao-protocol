// SPDX-License-Identifier: MIT
// COPIED FROM https://github.com/iearn-finance/yearn-protocol/blob/develop/interfaces/yearn/IConverter.sol

pragma solidity ^0.5.17;

interface IConverter {
    function convert(address) external returns (uint256);
}
