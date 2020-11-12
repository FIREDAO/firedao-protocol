require('module-alias/register');

import { accounts, contract, web3 } from '@openzeppelin/test-environment'; 
import { expectRevert, constants } from '@openzeppelin/test-helpers';

import { expect } from 'chai';

import { 
    BullContract, 
    BullInstance,
    TestTokenContract, 
    TestTokenInstance,
    TimelockContract,
    TimelockInstance,
    GovernorAlphaContract,
    GovernorAlphaInstance,
    TestRewardPoolContract,
    TestRewardPoolInstance
} from '@gen/contracts';

import { e9, e18, e27 } from '@testUtils/units';
import { ZERO, ONE, TWO, THREE, TEN, ONE_HUNDRED, ZERO_ADDRESS } from '@testUtils/constants';

const TestToken : TestTokenContract = contract.fromArtifact("TestToken");
const Bull : BullContract = contract.fromArtifact("Bull");
const GovernorAlpha: GovernorAlphaContract = contract.fromArtifact("GovernorAlpha");
const Timelock: TimelockContract = contract.fromArtifact("Timelock");
const RewardPool: TestRewardPoolContract = contract.fromArtifact("TestRewardPool");

const [admin, rewardDistribution, user1, user2] = accounts;

const { BN } = require('@openzeppelin/test-helpers');

describe('Governance', function () {
    let rp: TestRewardPoolInstance;

    let lpToken: TestTokenInstance;
    let bull: BullInstance;
    const bullTotalSupply = e18(1000000);

    let lpBalance = e18(1000);

    let duration = new BN(7*24*60*60); // 7 days

    before(async function() {
        lpToken = await TestToken.new("LP test token", "LPT", 18, {from: admin});
        bull = await Bull.new(rewardDistribution, {from: admin});

        rp = await RewardPool.new(
            bull.address,
            lpToken.address,
            duration,
            rewardDistribution,
            { from: admin }
        );

        await lpToken.approve(rp.address, constants.MAX_UINT256, {from: admin});
        await bull.approve(rp.address, constants.MAX_UINT256, {from: admin});
        await lpToken.approve(rp.address, constants.MAX_UINT256, {from: rewardDistribution});
        await bull.approve(rp.address, constants.MAX_UINT256, {from: rewardDistribution});
        await lpToken.approve(rp.address, constants.MAX_UINT256, {from: user1});
        await lpToken.approve(rp.address, constants.MAX_UINT256, {from: user2});

        await lpToken.mint(admin, lpBalance, {from: admin});
        await lpToken.mint(rewardDistribution, lpBalance, {from: admin});
        await lpToken.mint(user1, lpBalance, {from: admin});
        await lpToken.mint(user2, lpBalance, {from: admin});
    });

    it("temp", async function() {
    });
});
