require('module-alias/register');

import { accounts, contract, web3 } from '@openzeppelin/test-environment'; 
import { expect } from 'chai';

import { 
    BullContract, 
    BullInstance, 
    TestRewardPoolContract, 
    TestRewardPoolInstance, 
    TestTokenContract, 
    TestTokenInstance, 
} from '@gen/contracts';

import { e18 } from '@testUtils/units';
import { ZERO, ONE, TWO, THREE, TEN, ONE_HUNDRED } from '@testUtils/constants';
import { Blockchain } from '@testUtils/blockchain';

import { constants } from '@openzeppelin/test-helpers';
import { expectException } from '@testUtils/expectException';

const { BN } = require('@openzeppelin/test-helpers');
const blockchain = new Blockchain(web3.currentProvider);

const TestToken : TestTokenContract = contract.fromArtifact("TestToken");
const Bull : BullContract = contract.fromArtifact("Bull");
const RewardPool: TestRewardPoolContract = contract.fromArtifact("TestRewardPool");

const [admin, rewardDistribution, user1, user2] = accounts;
const [FOUR, FIVE, SIX, SEVEN, EIGHT, NINE] = [new BN(4),new BN(5),new BN(6),new BN(7),new BN(8),new BN(9)];


describe('RewardPool', function () {
    let rp: TestRewardPoolInstance;

    let lpToken: TestTokenInstance;
    let bull: BullInstance;
    const bullTotalSupply = e18(20000);

    let lpBalance = e18(1000);

    let duration = new BN(7*24*60*60); // 7 days

    before(async function() {
        lpToken = await TestToken.new("LP test token", "LPT", 18, {from: admin});
        bull = await Bull.new(rewardDistribution, admin, {from: admin});

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

        expect(await bull.totalSupply()).to.be.bignumber.eq(bullTotalSupply);
        expect(await bull.balanceOf(rewardDistribution)).to.be.bignumber.eq(bullTotalSupply);
        expect(await lpToken.balanceOf(admin)).to.be.bignumber.eq(lpBalance);
        expect(await lpToken.balanceOf(rewardDistribution)).to.be.bignumber.eq(lpBalance);
        expect(await lpToken.balanceOf(user1)).to.be.bignumber.eq(lpBalance);
        expect(await lpToken.balanceOf(user2)).to.be.bignumber.eq(lpBalance);
    });

    async function printRPVariables(user: string) {
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

        console.log("bull balanceOf(rp)", (await bull.balanceOf(rp.address)).toString());
    }

    function getErrors(reward: BN, duration: BN, num: BN) {

        const tolerance = TEN;
        const e = (reward.div(duration)).mul(tolerance);

        let low = num.sub(e);
        if (low.lt(ZERO)) {
            low = ZERO;
        }
        const high = num.add(e);

        return [low, high];
    }

    function nowBN(delta: BN) {
        return (new BN(Date.now()/1000)).add(delta);
    }

    async function updateRP() {
        await rp.update({from: rewardDistribution});
    }

    describe("LPTokenWrapper", async function() {
        const stakeAmount = e18(99);
        before(async function() {
            await blockchain.saveSnapshotAsync();
        });

        after(async function() {
            await blockchain.revertAsync();
        });

        async function shouldNotChanged() {
            expect(await rp.duration()).to.be.bignumber.eq(duration);

            expect(await rp.periodFinish()).to.be.bignumber.eq(ZERO);
            expect(await rp.rewardRate()).to.be.bignumber.eq(ZERO);
            expect(await rp.lastUpdateTime()).to.be.bignumber.eq(ZERO);
            expect(await rp.rewardPerTokenStored()).to.be.bignumber.eq(ZERO);

            expect(await rp.lastTimeRewardApplicable()).to.be.bignumber.eq(ZERO);
            expect(await rp.rewardPerToken()).to.be.bignumber.eq(ZERO);

            expect(await rp.userRewardPerTokenPaid(user1)).to.be.bignumber.eq(ZERO);
            expect(await rp.rewards(user1)).to.be.bignumber.eq(ZERO);

            expect(await rp.earned(user1)).to.be.bignumber.eq(ZERO);                
        }

        afterEach(async function() {
            await shouldNotChanged();
        });

        it("stake", async function() {
            await rp.stake(stakeAmount, {from: user1});

            expect(await lpToken.balanceOf(user1)).to.be.bignumber.eq(lpBalance.sub(stakeAmount));

            expect(await rp.totalSupply()).to.be.bignumber.eq(stakeAmount);
            expect(await rp.balanceOf(user1)).to.be.bignumber.eq(stakeAmount);
        });

        it("withdraw", async function () {
            expect(await lpToken.balanceOf(user1)).to.be.bignumber.eq(lpBalance.sub(stakeAmount));

            const withdrawAmount = stakeAmount.div(THREE);
            const leftAmount = stakeAmount.sub(withdrawAmount);
            await rp.withdraw(withdrawAmount, {from: user1});

            expect(await lpToken.balanceOf(user1)).to.be.bignumber.eq(lpBalance.sub(leftAmount));

            expect(await rp.totalSupply()).to.be.bignumber.eq(leftAmount);
            expect(await rp.balanceOf(user1)).to.be.bignumber.eq(leftAmount);

            await rp.withdraw(leftAmount, {from: user1});
            expect(await lpToken.balanceOf(user1)).to.be.bignumber.eq(lpBalance);

            expect(await rp.totalSupply()).to.be.bignumber.eq(ZERO);
            expect(await rp.balanceOf(user1)).to.be.bignumber.eq(ZERO);
        });

        it("withdraw when no staking", async function() {
            await rp.stake(stakeAmount, {from: user2});

            await expectException(
                rp.withdraw(ONE, {from: user1}),
                "SafeMath: subtraction overflow."
            );
        });
    });

    describe ("rewardDistribution", async function() {
        before(async function() {
            await blockchain.saveSnapshotAsync();
        });

        after(async function() {
            await blockchain.revertAsync();
        });

        it("rewardDistribution only function", async function() {
            await rp.notifyRewardAmount(ONE, {from: rewardDistribution});
            await expectException(
                rp.notifyRewardAmount(ONE, {from: admin}),
                "Caller is not reward distribution"
            );

            await rp.update({from: rewardDistribution});
            await expectException(
                rp.update({from: admin}),
                "Caller is not reward distribution"
            );
        });

        it("change rewardDistribution", async function() {
            await expectException(
                rp.setRewardDistribution(user1, {from: rewardDistribution}),
                "Ownable: caller is not the owner"
            );

            await rp.setRewardDistribution(user1, {from: admin});
            
            await expectException(
                rp.notifyRewardAmount(ONE, {from: rewardDistribution}),
                "Caller is not reward distribution"
            );

            await rp.notifyRewardAmount(ONE, {from: user1});
        });
    });

    describe("status variables", async function () {
        before(async function() {
            await blockchain.saveSnapshotAsync();
        });

        after(async function() {
            await blockchain.revertAsync();
        });

        it("initial variables", async function() {
            expect(await rp.lpToken()).to.be.eq(lpToken.address);
            expect(await rp.rewardToken()).to.be.eq(bull.address);
            
            expect(await rp.totalSupply()).to.be.bignumber.eq(ZERO);
            expect(await rp.balanceOf(user1)).to.be.bignumber.eq(ZERO);

            expect(await rp.duration()).to.be.bignumber.eq(duration);
            expect(await rp.periodFinish()).to.be.bignumber.eq(ZERO);
            expect(await rp.rewardRate()).to.be.bignumber.eq(ZERO);
            expect(await rp.lastUpdateTime()).to.be.bignumber.eq(ZERO);
            expect(await rp.rewardPerTokenStored()).to.be.bignumber.eq(ZERO);

            expect(await rp.lastTimeRewardApplicable()).to.be.bignumber.eq(ZERO);
            expect(await rp.rewardPerToken()).to.be.bignumber.eq(ZERO);
        });

        const rewardAmount = e18(1);

        describe("no stake", async function() {
            let periodFinish:BN;
            before(async function() {
                await blockchain.saveSnapshotAsync();
                await bull.transfer(rp.address, rewardAmount, {from: rewardDistribution});
                await rp.notifyRewardAmount(rewardAmount, {from: rewardDistribution});
                periodFinish = await rp.periodFinish();
    
                expect(await rp.totalSupply()).to.be.bignumber.eq(ZERO);
                expect(await rp.balanceOf(user1)).to.be.bignumber.eq(ZERO);
            });
    
            after(async function() {
                await blockchain.revertAsync();
            });

            async function shouldNotChanged() {
                expect(await rp.totalSupply()).to.be.bignumber.eq(ZERO);
                expect(await rp.balanceOf(user1)).to.be.bignumber.eq(ZERO);
    
                expect(await rp.duration()).to.be.bignumber.eq(duration);
                
                expect(await rp.lastTimeRewardApplicable()).to.be.bignumber.eq(await rp.lastUpdateTime());
                expect(await rp.periodFinish()).to.be.bignumber.eq(periodFinish);
    
                expect(await rp.rewardRate()).to.be.bignumber.eq(rewardAmount.div(duration));
                expect(await rp.rewardPerTokenStored()).to.be.bignumber.eq(ZERO);
    
                expect(await rp.rewardPerToken()).to.be.bignumber.eq(ZERO);
            }
    
            it("reward variables after notiryRewardAmount", async function() {
                await updateRP();
                await shouldNotChanged();
            });

            it("reward variables after duration/2 time passed", async function() {
                await blockchain.increaseTimeAsync(duration.div(TWO));
                await updateRP();

                const now = nowBN(duration.div(TWO));
                expect(await rp.lastUpdateTime()).to.be.bignumber.gte(now.sub(TEN)).lte(now);

                await shouldNotChanged();
            });

            it("reward variables after duration time passed", async function() {
                await blockchain.increaseTimeAsync(duration.div(TWO));
                await updateRP();

                const now = nowBN(duration);
                expect(await rp.lastUpdateTime()).to.be.bignumber.gte(now.sub(TEN)).lte(now);

                await shouldNotChanged();
            });
        });

        describe("stake before notifyRewardAmount", async function() {
            const stakeNumber = TWO;
            const unit = e18(1);
            let periodFinish:BN;
            before(async function() {
                await blockchain.saveSnapshotAsync();

                await rp.stake(unit.mul(stakeNumber), {from: user1});
                await bull.transfer(rp.address, rewardAmount, {from: rewardDistribution});
                await rp.notifyRewardAmount(rewardAmount, {from: rewardDistribution});
                periodFinish = await rp.periodFinish();
            });
    
            after(async function() {
                await blockchain.revertAsync();
            });

            async function shouldNotChanged() {
                expect(await rp.totalSupply()).to.be.bignumber.eq(unit.mul(stakeNumber));
                expect(await rp.balanceOf(user1)).to.be.bignumber.eq(unit.mul(stakeNumber));
    
                expect(await rp.duration()).to.be.bignumber.eq(duration);

                expect(await rp.lastTimeRewardApplicable()).to.be.bignumber.eq(await rp.lastUpdateTime());
                expect(await rp.periodFinish()).to.be.bignumber.eq(periodFinish);
    
                expect(await rp.rewardRate()).to.be.bignumber.eq(rewardAmount.div(duration));

                expect(await rp.userRewardPerTokenPaid(user1)).to.be.bignumber.eq(ZERO);
                expect(await rp.rewards(user1)).to.be.bignumber.eq(ZERO);
            }
    
            it("reward variables after notiryRewardAmount", async function() {
                await updateRP();
                await shouldNotChanged();

                const expectedRewardPerToken = ZERO;
                let [low, high] = getErrors(rewardAmount, duration, expectedRewardPerToken);

                let rewardPerToken = await rp.rewardPerTokenStored();
                expect(rewardPerToken).to.be.bignumber.gte(low).lte(high);
                expect(await rp.earned(user1)).to.be.bignumber.eq(rewardPerToken.mul(stakeNumber));
            });

            it("reward variables after duration/2 time passed", async function() {
                await blockchain.increaseTimeAsync(duration.div(TWO));
                await updateRP();

                await shouldNotChanged();

                const expectedRewardPerToken = rewardAmount.div(TWO.mul(stakeNumber));
                let [low, high] = getErrors(rewardAmount, duration, expectedRewardPerToken);

                let rewardPerToken = await rp.rewardPerTokenStored();
                expect(rewardPerToken).to.be.bignumber.gte(low).lte(high);
                expect(await rp.earned(user1)).to.be.bignumber.eq(rewardPerToken.mul(stakeNumber));
            });

            it("reward variables after duration time passed", async function() {
                await blockchain.increaseTimeAsync(duration.div(TWO));
                await updateRP();

                await shouldNotChanged();

                const expectedRewardPerToken = rewardAmount.div(ONE.mul(stakeNumber));
                let [low, high] = getErrors(rewardAmount, duration, expectedRewardPerToken);

                let rewardPerToken = await rp.rewardPerTokenStored();
                expect(rewardPerToken).to.be.bignumber.gte(low).lte(high);
                expect(await rp.earned(user1)).to.be.bignumber.eq(rewardPerToken.mul(stakeNumber));
            });
        });

        describe("stake after duration/2 time passed", async function() {
            const stakeAmount = e18(5);
            before(async function() {
                await blockchain.saveSnapshotAsync();

                await bull.transfer(rp.address, rewardAmount, {from: rewardDistribution});
                await rp.notifyRewardAmount(rewardAmount, {from: rewardDistribution});
                
                await blockchain.increaseTimeAsync(duration.div(TWO));
                await rp.stake(stakeAmount, {from: user1});

                expect(await rp.earned(user1)).to.be.bignumber.eq(ZERO);
            });
    
            after(async function() {
                await blockchain.revertAsync();
            });

            it("duration passed", async function() {
                await blockchain.increaseTimeAsync(duration.div(TWO));
                await updateRP();

                const expectedEarned = rewardAmount.div(TWO);
                let [low, high] = getErrors(rewardAmount, duration, expectedEarned);
                expect(await rp.earned(user1)).to.be.bignumber.gte(low).lte(high);
            });

            it("time passed after periodFinished", async function() {
                const earned = await rp.earned(user1);
                await blockchain.increaseTimeAsync(duration.div(TWO));
                await updateRP();
                
                expect(await rp.earned(user1)).to.be.bignumber.eq(earned);
            });

            it("reNotifyRewardAmount with leftAmount and duration passed", async function() {
                const earned = await rp.earned(user1);

                await rp.notifyRewardAmount(rewardAmount.sub(earned), {from: rewardDistribution});
                
                await blockchain.increaseTimeAsync(duration);
                await updateRP();

                const expectedEarned = rewardAmount;
                let [low, high] = getErrors(rewardAmount, duration, expectedEarned);
                expect(await rp.earned(user1)).to.be.bignumber.gte(low).lte(high);
            });
        });


        describe("reclaim after periodFinished", async function() {
            const stakeAmount = e18(5);
            let earned: BN;
            before(async function() {
                await blockchain.saveSnapshotAsync();

                await rp.stake(stakeAmount, {from: user1});
                await bull.transfer(rp.address, rewardAmount, {from: rewardDistribution});
                await rp.notifyRewardAmount(rewardAmount, {from: rewardDistribution});
                
                await blockchain.increaseTimeAsync(duration);
                await updateRP();

                earned = await rp.earned(user1);
                expect(await rp.totalSupply()).to.be.bignumber.eq(stakeAmount);
                expect(await rp.balanceOf(user1)).to.be.bignumber.eq(stakeAmount);
            });
    
            after(async function() {
                await blockchain.revertAsync();
            });

            beforeEach(async function() {
                await blockchain.saveSnapshotAsync();
            });
    
            afterEach(async function() {
                await blockchain.revertAsync();
            });

            it("exit", async function() {
                await rp.exit({from: user1});
                
                expect(await rp.totalSupply()).to.be.bignumber.eq(ZERO);
                expect(await rp.balanceOf(user1)).to.be.bignumber.eq(ZERO);
                expect(await rp.rewards(user1)).to.be.bignumber.eq(ZERO);
                expect(await rp.earned(user1)).to.be.bignumber.eq(ZERO);
                expect(await bull.balanceOf(rp.address)).to.be.bignumber.eq(rewardAmount.sub(earned));
            });

            it("withdraw 1/2", async function() { 
                await rp.withdraw(stakeAmount.div(TWO), {from: user1});

                expect(await rp.totalSupply()).to.be.bignumber.eq(stakeAmount.div(TWO));
                expect(await rp.balanceOf(user1)).to.be.bignumber.eq(stakeAmount.div(TWO));
                expect(await rp.rewards(user1)).to.be.bignumber.eq(earned);
                expect(await rp.earned(user1)).to.be.bignumber.eq(earned);
                expect(await bull.balanceOf(rp.address)).to.be.bignumber.eq(rewardAmount);
            });

            it("withdraw all", async function() {
                await rp.withdraw(stakeAmount, {from: user1});

                expect(await rp.totalSupply()).to.be.bignumber.eq(ZERO);
                expect(await rp.balanceOf(user1)).to.be.bignumber.eq(ZERO);
                expect(await rp.rewards(user1)).to.be.bignumber.eq(earned);
                expect(await rp.earned(user1)).to.be.bignumber.eq(earned);
                expect(await bull.balanceOf(rp.address)).to.be.bignumber.eq(rewardAmount);
            });

            it("getReward", async function() {
                await rp.getReward({from: user1});

                expect(await rp.totalSupply()).to.be.bignumber.eq(stakeAmount);
                expect(await rp.balanceOf(user1)).to.be.bignumber.eq(stakeAmount);
                expect(await rp.rewards(user1)).to.be.bignumber.eq(ZERO);
                expect(await rp.earned(user1)).to.be.bignumber.eq(ZERO);
                expect(await bull.balanceOf(rp.address)).to.be.bignumber.eq(rewardAmount.sub(earned));
            });
        });
    });

    describe("Multiuser and MultiNotifyReward", async function () {
        before(async function() {
            await blockchain.saveSnapshotAsync();
        });

        after(async function() {
            await blockchain.revertAsync();
        });

        beforeEach(async function() {
            await blockchain.saveSnapshotAsync();
        });

        afterEach(async function() {
            await blockchain.revertAsync();
        });

        async function bullBalanceOf() {
            console.log("----- bull balanceOf -----");
            console.log("rp   ", (await bull.balanceOf(rp.address)).toString());
            console.log("user1", (await bull.balanceOf(user1)).toString());
            console.log("user2", (await bull.balanceOf(user2)).toString());
            console.log("admin", (await bull.balanceOf(admin)).toString());
        }

        describe("StakeAmount ratio, single NotifyReward", async function() {
            const rewardAmount = e18(1);
            const rewardUnit = rewardAmount.div(TEN);
            const stakeUnit = e18(1);
    
            async function subject(user1Ratio:BN, user2Ratio:BN) {
                const stakeAmount1:BN = stakeUnit.mul(user1Ratio);
                const stakeAmount2:BN = stakeUnit.mul(user2Ratio);
                const expectedReward1:BN = rewardUnit.mul(user1Ratio);
                const expectedReward2:BN = rewardUnit.mul(user2Ratio);
                
                await rp.stake(stakeAmount1, {from: user1});
                await rp.stake(stakeAmount2, {from: user2});

                await bull.transfer(rp.address, rewardAmount, {from: rewardDistribution});
                await rp.notifyRewardAmount(rewardAmount, {from: rewardDistribution});

                await blockchain.increaseTimeAsync(duration);

                await rp.exit({from: user1});
                await rp.exit({from: user2});

                let [low, high] = getErrors(rewardAmount, duration, expectedReward1);
                expect(await bull.balanceOf(user1)).to.be.bignumber.gte(low).lte(high);
                [low, high] = getErrors(rewardAmount, duration, expectedReward2);
                expect(await bull.balanceOf(user2)).to.be.bignumber.gte(low).lte(high);

                [low, high] = getErrors(rewardAmount, duration, ZERO);
                expect(await bull.balanceOf(rp.address)).to.be.bignumber.gte(low).lte(high);
            }

            async function subject2(user1Ratio:BN, user2Ratio:BN) {
                const stakeAmount1:BN = stakeUnit.mul(user1Ratio);
                const stakeAmount2:BN = stakeUnit.mul(user2Ratio);
                
                await rp.stake(stakeAmount1, {from: user1});
                await rp.stake(stakeAmount2, {from: user2});

                await bull.transfer(rp.address, rewardAmount, {from: rewardDistribution});
                await rp.notifyRewardAmount(rewardAmount, {from: rewardDistribution});

                await blockchain.increaseTimeAsync(duration);

                await rp.exit({from: user2});
                await rp.exit({from: user1});
            }

            async function subject3(user1Ratio:BN, user2Ratio:BN) {
                const stakeAmount1:BN = stakeUnit.mul(user1Ratio);
                const stakeAmount2:BN = stakeUnit.mul(user2Ratio);
                
                await rp.stake(stakeAmount1, {from: user1});
                await rp.stake(stakeAmount2, {from: user2});

                await bull.transfer(rp.address, rewardAmount, {from: rewardDistribution});
                await rp.notifyRewardAmount(rewardAmount, {from: rewardDistribution});

                await blockchain.increaseTimeAsync(duration);

                await rp.withdraw(await rp.balanceOf(user1), {from: user1});
                await rp.withdraw(await rp.balanceOf(user2), {from: user2});

                await rp.getReward({from: user1});
                await rp.getReward({from: user2});
            }


            it("user1:user2 = 5:5", async function() {
                await subject(FIVE, FIVE);
            });

            it("user1:user2 = 5:5 subject2", async function() {
                await subject2(FIVE, FIVE);
            });

            it("user1:user2 = 5:5 subject3", async function() {
                await subject3(FIVE, FIVE);
            });

            it("user1:user2 = 1:9", async function() {
                await subject(ONE, NINE);
            });

            it("user1:user2 = 7:3", async function() {
                await subject(SEVEN, THREE);
            });
        });

        describe("StakeAmount ratio, TWO NotifyReward", async function() {
            const rewardAmount = e18(1);
            const rewardUnit = rewardAmount.div(TEN);
            const stakeUnit = e18(1);
    
            async function subject(user1Ratio:BN, user2Ratio:BN, elased: BN) {
                const stakeAmount1:BN = stakeUnit.mul(user1Ratio);
                const stakeAmount2:BN = stakeUnit.mul(user2Ratio);
                const expectedReward1:BN = rewardUnit.mul(user1Ratio).mul(TWO);
                const expectedReward2:BN = rewardUnit.mul(user2Ratio).mul(TWO);
                
                await rp.stake(stakeAmount1, {from: user1});
                await rp.stake(stakeAmount2, {from: user2});

                await bull.transfer(rp.address, rewardAmount, {from: rewardDistribution});
                await rp.notifyRewardAmount(rewardAmount, {from: rewardDistribution});

                await blockchain.increaseTimeAsync(elased);
                await bull.transfer(rp.address, rewardAmount, {from: rewardDistribution});
                await rp.notifyRewardAmount(rewardAmount, {from: rewardDistribution});

                await blockchain.increaseTimeAsync(duration);

                await rp.exit({from: user1});
                await rp.exit({from: user2});

                let [low, high] = getErrors(rewardAmount.mul(TWO), duration, expectedReward1);
                expect(await bull.balanceOf(user1)).to.be.bignumber.gte(low).lte(high);
                [low, high] = getErrors(rewardAmount.mul(TWO), duration, expectedReward2);
                expect(await bull.balanceOf(user2)).to.be.bignumber.gte(low).lte(high);

                [low, high] = getErrors(rewardAmount.mul(TWO), duration, ZERO);
                expect(await bull.balanceOf(rp.address)).to.be.bignumber.gte(low).lte(high);
            }

            it("user1:user2 = 5:5", async function() {
                await subject(FIVE, FIVE, duration);
            });

            it("user1:user2 = 5:5", async function() {
                await subject(FIVE, FIVE, duration.div(TWO));
            });

            it("user1:user2 = 5:5", async function() {
                await subject(FIVE, FIVE, duration.add(duration.div(TWO)));
            });

            it("user1:user2 = 1:9", async function() {
                await subject(ONE, NINE, duration);
            });

            it("user1:user2 = 1:9", async function() {
                await subject(ONE, NINE, duration.div(TWO));
            });

            it("user1:user2 = 1:9", async function() {
                await subject(ONE, NINE, duration.add(duration.div(TWO)));
            });
        });


        describe("2 User Staked Period, single NotifyReward", async function() {
            const rewardAmount = e18(1);
            const rewardUnit = rewardAmount.div(ONE_HUNDRED);
            const stakeAmount = e18(1);
            const elapsedUnit = duration.div(TEN);
    
            async function subject(elapsed1:BN, elapsed2:BN, expectedReward1:BN, expectedReward2:BN) {
                await rp.stake(stakeAmount, {from: user1});

                await bull.transfer(rp.address, rewardAmount, {from: rewardDistribution});
                await rp.notifyRewardAmount(rewardAmount, {from: rewardDistribution});

                await blockchain.increaseTimeAsync(elapsed1);
                await rp.stake(stakeAmount, {from: user2});

                await blockchain.increaseTimeAsync(elapsed2);
                await rp.exit({from: user2});

                await blockchain.increaseTimeAsync(duration.sub(elapsed1.add(elapsed2)));

                await rp.exit({from: user1});

                let [low, high] = getErrors(rewardAmount, duration, expectedReward1);
                expect(await bull.balanceOf(user1)).to.be.bignumber.gte(low).lte(high);
                [low, high] = getErrors(rewardAmount, duration, expectedReward2);
                expect(await bull.balanceOf(user2)).to.be.bignumber.gte(low).lte(high);

                [low, high] = getErrors(rewardAmount, duration, ZERO);
                expect(await bull.balanceOf(rp.address)).to.be.bignumber.gte(low).lte(high);
            }

            it("user2: 0~5", async function() {
                await subject(
                    ZERO, 
                    elapsedUnit.mul(FIVE), 
                    rewardUnit.mul(new BN(75)), 
                    rewardUnit.mul(new BN(25))
                );
            });

            it("user2: 5~10", async function() {
                await subject(
                    elapsedUnit.mul(FIVE), 
                    elapsedUnit.mul(FIVE), 
                    rewardUnit.mul(new BN(75)), 
                    rewardUnit.mul(new BN(25))
                );
            });

            it("user2: 1~6", async function() {
                await subject(
                    elapsedUnit.mul(ONE), 
                    elapsedUnit.mul(FIVE), 
                    rewardUnit.mul(new BN(75)), 
                    rewardUnit.mul(new BN(25))
                );
            });

            it("user2: 2~3", async function() {
                await subject(
                    elapsedUnit.mul(TWO), 
                    elapsedUnit.mul(ONE), 
                    rewardUnit.mul(new BN(95)), 
                    rewardUnit.mul(new BN(5))
                );
            });

            it("user2: 4~6", async function() {
                await subject(
                    elapsedUnit.mul(FOUR), 
                    elapsedUnit.mul(TWO), 
                    rewardUnit.mul(new BN(90)), 
                    rewardUnit.mul(new BN(10))
                );
            });

            it("user2: 1~9", async function() {
                await subject(
                    elapsedUnit.mul(ONE), 
                    elapsedUnit.mul(EIGHT), 
                    rewardUnit.mul(new BN(60)), 
                    rewardUnit.mul(new BN(40))
                );
            });
        });
    });
});
