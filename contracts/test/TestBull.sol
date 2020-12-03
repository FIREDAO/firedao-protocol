pragma solidity ^0.5.17;
pragma experimental ABIEncoderV2;

import "../governance/FIRE.sol";

contract TestFIRE is FIRE {
    /// @notice EIP-20 token name for this token
    string public constant name = "TestFIRE";

    /// @notice EIP-20 token symbol for this token
    string public constant symbol = "TestFIRE";

    constructor(address account, address _minter) public FIRE(account, _minter) {
    }
}