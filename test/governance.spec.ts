require('module-alias/register');

import { accounts, contract, web3 } from '@openzeppelin/test-environment'; 

import { expect } from 'chai';

import { BullContract, BVaultContract, GovernanceContract, TestTokenContract, TimelockContract } from '@gen/contracts';

import { e9, e18, e27 } from '@testUtils/units';
import { ZERO, ONE, TWO, THREE, TEN, ONE_HUNDRED, ZERO_ADDRESS } from '@testUtils/constants';

const TestToken : TestTokenContract = contract.fromArtifact("TestToken");
const BVault : BVaultContract = contract.fromArtifact("BVault");
const Bull : BullContract = contract.fromArtifact("Bull");
const GovernorAlpha: GovernanceContract = contract.fromArtifact("GovernorAlpha");
const Timelock: TimelockContract = contract.fromArtifact("Timelock");


describe('Basic checking', function () {
    it("temp", async function() {
    });
});
