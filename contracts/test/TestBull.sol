pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "../governance/Bull.sol";

contract TestBull is Bull {
    /// @notice EIP-20 token name for this token
    string public constant name = "TestBull";

    /// @notice EIP-20 token symbol for this token
    string public constant symbol = "TestBULL";

    constructor(address account) public Bull(account) {
    }
}