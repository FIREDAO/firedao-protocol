pragma solidity ^0.5.17;
pragma experimental ABIEncoderV2;

import "../governance/Fire.sol";

contract TestFire is Fire {
    /// @notice EIP-20 token name for this token
    string public constant name = "TestFire";

    /// @notice EIP-20 token symbol for this token
    string public constant symbol = "TestFIRE";

    constructor(address account, address _minter) public Fire(account, _minter) {
    }
}