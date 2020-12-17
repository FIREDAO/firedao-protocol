require('module-alias/register');

import { accounts, contract, web3 } from '@openzeppelin/test-environment'; 
import { expect } from 'chai';

import { 
    FireContract, 
    FireInstance, 
    TestRewardPoolContract, 
    TestRewardPoolInstance, 
    TestTokenContract, 
    TestTokenInstance, 
    RewarderContract,
    RewarderInstance
} from '@gen/contracts';

import { e18 } from '@testUtils/units';
import { ZERO } from '@testUtils/constants';
import { Blockchain } from '@testUtils/blockchain';

import { constants } from '@openzeppelin/test-helpers';

const { BN, expectRevert } = require('@openzeppelin/test-helpers');
const blockchain = new Blockchain(web3.currentProvider);

const TestToken : TestTokenContract = contract.fromArtifact("TestToken");
const FIRE : FireContract = contract.fromArtifact("FIRE");
const RewardPool: TestRewardPoolContract = contract.fromArtifact("TestRewardPool");

const Rewarder : RewarderContract = contract.fromArtifact("Rewarder");


const [admin, rewardDistribution, user1, user2] = accounts;


describe('RewardPool', function () {
    let rp1: TestRewardPoolInstance;
    let rp2: TestRewardPoolInstance;

    let lpToken: TestTokenInstance;
    let fire: FireInstance;
    const fireTotalSupply = e18(20000);

    let duration = new BN(7*24*60*60); // 7 days

    let rewarder: RewarderInstance;

    before(async function() {
        lpToken = await TestToken.new("LP test token", "LPT", 18, {from: admin});
        fire = await FIRE.new(rewardDistribution, admin, {from: admin});

        rp1 = await RewardPool.new(
            fire.address,
            lpToken.address,
            duration,
            rewardDistribution,
            { from: admin }
        );

        rp2 = await RewardPool.new(
            fire.address,
            lpToken.address,
            duration,
            rewardDistribution,
            { from: admin }
        );

        rewarder = await Rewarder.new(
            {from: rewardDistribution}
        )

        expect(await fire.totalSupply()).to.be.bignumber.eq(fireTotalSupply);
        expect(await fire.balanceOf(rewardDistribution)).to.be.bignumber.eq(fireTotalSupply);
    });

    async function printRPVariables(rp: TestRewardPoolInstance, user: string) {
        console.log("------ printRPVariables ------");
        console.log("totalSupply()", (await rp.totalSupply()).toString());
        console.log("balanceOf", (await rp.balanceOf(user)).toString());

        console.log("duration", (await rp.duration()).toString());
        console.log("periodFinish", (await rp.periodFinish()).toString());
        console.log("rewardRate", (await rp.rewardRate()).toString());
        console.log("lastUpdateTime", (await rp.lastUpdateTime()).toString());
        console.log("rewardPerTokenStored", (await rp.rewardPerTokenStored()).toString());

        console.log("lastTimeRewardApplicable", (await rp.lastTimeRewardApplicable()).toString());
        console.log("rewardPerToken", (await rp.rewardPerToken()).toString());

        console.log("userRewardPerTokenPaid", (await rp.userRewardPerTokenPaid(user)).toString());
        console.log("rewards", (await rp.rewards(user)).toString());

        console.log("earned", (await rp.earned(user)).toString());

        console.log("fire balanceOf(rp)", (await fire.balanceOf(rp.address)).toString());
    }

    function nowBN(delta: BN) {
        return (new BN(Date.now()/1000)).add(delta);
    }

    beforeEach(async function() {
        await blockchain.saveSnapshotAsync();
    });

    afterEach(async function() {
        await blockchain.revertAsync();
    });

    async function reward(user: string) {
        const now = nowBN(ZERO);
        await rp1.setRewardDistribution(rewarder.address, { from: admin });
        await rp2.setRewardDistribution(rewarder.address, { from: admin });

        await fire.approve(rewarder.address, constants.MAX_UINT256, {from: user});

        expect(await rp1.lastUpdateTime()).to.be.bignumber.eq(ZERO);
        expect(await rp2.lastUpdateTime()).to.be.bignumber.eq(ZERO);

        expect(await rp1.periodFinish()).to.be.bignumber.eq(ZERO);
        expect(await rp2.periodFinish()).to.be.bignumber.eq(ZERO);

        expect(await fire.balanceOf(rp1.address)).to.be.bignumber.eq(ZERO);
        expect(await fire.balanceOf(rp2.address)).to.be.bignumber.eq(ZERO);

        const rp1Reward = e18(10);
        const rp2Reward = e18(20);

        await rewarder.reward(
            fire.address, 
            [rp1.address, rp2.address], 
            [rp1Reward, rp2Reward], 
            { from: user }
        );

        expect(await rp1.lastUpdateTime()).to.be.bignumber.gte(now);
        expect(await rp2.lastUpdateTime()).to.be.bignumber.gte(now);

        expect(await rp1.periodFinish()).to.be.bignumber.gte(now.add(duration));
        expect(await rp2.periodFinish()).to.be.bignumber.gte(now.add(duration));

        expect(await fire.balanceOf(rp1.address)).to.be.bignumber.eq(rp1Reward);
        expect(await fire.balanceOf(rp2.address)).to.be.bignumber.eq(rp2Reward);
    }

    it("reward", async function() {
        await reward(rewardDistribution);
    });

    it("onlyOwner", async function() {
        await expectRevert(reward(user1), "Ownable: caller is not the owner");
    });

    it("transferOwnership", async function() {
        let owner = await rewarder.owner();
        expect(owner).to.be.eq(rewardDistribution);
        await rewarder.transferOwnership(user1, {from: owner});
        expect(await rewarder.owner()).to.be.eq(user1);

        await fire.transfer(user1, e18(100), {from: rewardDistribution});

        await reward(user1);
    });
});
