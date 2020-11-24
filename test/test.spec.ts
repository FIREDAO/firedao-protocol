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
    TestVaultContract, 
    TestVaultInstance, 
    ControllerContract,
    ControllerInstance,
    TestStrategyInstance,
    TestStrategyContract,
    BVaultInstance,
    BVaultContract,
    TestBullContract,
    TestBullInstance
} from '@gen/contracts';

import { e9, e18, e27 } from '@testUtils/units';
import { ZERO, ONE, TWO, THREE, TEN, ONE_HUNDRED, ZERO_ADDRESS } from '@testUtils/constants';
import { Blockchain } from '@testUtils/blockchain';

import { constants } from '@openzeppelin/test-helpers';

const { BN } = require('@openzeppelin/test-helpers');
const blockchain = new Blockchain(web3.currentProvider);

const TestToken : TestTokenContract = contract.fromArtifact("TestToken");
const TestVault : TestVaultContract = contract.fromArtifact("TestVault");
const BVault: BVaultContract = contract.fromArtifact("BVault");
const RewardPool: TestRewardPoolContract = contract.fromArtifact("TestRewardPool");
const TestStrategy: TestStrategyContract = contract.fromArtifact("TestStrategy");
const Controller: ControllerContract = contract.fromArtifact("Controller");

const TestBull: TestBullContract = contract.fromArtifact("TestBull");

const [admin, rewardDistribution, user1, user2, rewarder] = accounts;

describe('Test', function () {
    let rp: TestRewardPoolInstance;

    let token: TestTokenInstance;
    let vault: TestVaultInstance;

    let balance = e18(1000);

    let aYear = new BN(365*24*60*60);


    before(async function() {
        token = await TestToken.new("test token", "Tok", 18, {from: admin});

        rp = await RewardPool.new(
            token.address,
            token.address,
            aYear,
            rewardDistribution,
            { from: admin }
        );

        await token.approve(rp.address, constants.MAX_UINT256, {from: admin});
        await token.approve(rp.address, constants.MAX_UINT256, {from: rewardDistribution});
        await token.approve(rp.address, constants.MAX_UINT256, {from: user1});
        await token.approve(rp.address, constants.MAX_UINT256, {from: user2});

        await token.mint(admin, balance, {from: admin});
        await token.mint(rewardDistribution, balance, {from: admin});
        await token.mint(user1, balance, {from: admin});
        await token.mint(user2, balance, {from: admin});

        await token.transfer(rp.address, balance, {from: rewardDistribution});
        await rp.notifyRewardAmount(balance, {from: rewardDistribution});

        vault = await TestVault.new(token.address, rp.address, {from: admin});
    });

    it("testBull", async function() {
        let tb = await TestBull.new(admin, admin, {from: admin});

        console.log(await tb.name());
        console.log(await tb.symbol());
    });

    after(async function() {
    });

    async function printVaultStats(user:string) {
        console.log("----- printStats -----");
        try{
            console.log("getPricePerFullShare", (await vault.getPricePerFullShare()).toString());
        } catch(e) {

        }
        console.log("balanceOf", (await vault.balanceOf(user)).toString());
        console.log("balance", (await vault.balance()).toString());
    }


    describe('TestVault', async function() {
        before(async function() {
            await blockchain.saveSnapshotAsync();
        });
    
        after(async function() {
            await blockchain.revertAsync();
        });

        it("TestVault", async function() {
            const amount = e18(1);
            expect(await vault.totalSupply()).to.be.bignumber.eq(ZERO);
    
            await token.approve(vault.address, amount, {from: user1});
            await vault.deposit(amount, {from: user1});
            expect(await vault.totalSupply()).to.be.bignumber.eq(amount);
            expect(await vault.balanceOf(user1)).to.be.bignumber.eq(amount);
            expect(await vault.balance()).to.be.bignumber.eq(amount);
            expect(await vault.getPricePerFullShare()).to.be.bignumber.eq(amount);
    
            await blockchain.increaseTimeAsync(aYear.div(TWO));
    
            await rp.update({from: rewardDistribution});
            expect(await vault.totalSupply()).to.be.bignumber.eq(amount);
            expect(await vault.balanceOf(user1)).to.be.bignumber.eq(amount);
            const increased = new BN(500);
            expect(await vault.balance()).to.be.bignumber.gte(amount.mul(increased));
            expect(await vault.getPricePerFullShare()).to.be.bignumber.gte(amount.mul(increased));
    
            await vault.withdraw(e18(1).sub(ONE), {from: user1});
            expect(await vault.totalSupply()).to.be.bignumber.eq(ONE);
            expect(await vault.balanceOf(user1)).to.be.bignumber.eq(ONE);
            expect(await vault.balance()).to.be.bignumber.gte(ONE.mul(increased));
            expect(await vault.getPricePerFullShare()).to.be.bignumber.gte(ONE.mul(increased));
    
            await vault.withdraw(ONE, {from: user1});
            expect(await vault.totalSupply()).to.be.bignumber.eq(ZERO);
            expect(await vault.balanceOf(user1)).to.be.bignumber.eq(ZERO);
            expect(await vault.balance()).to.be.bignumber.gte(ZERO);

            await token.approve(vault.address, amount, {from: user1});
            await vault.deposit(amount, {from: user1});
            expect(await vault.totalSupply()).to.be.bignumber.eq(amount);
            expect(await vault.balanceOf(user1)).to.be.bignumber.eq(amount);
            expect(await vault.balance()).to.be.bignumber.eq(amount);
            expect(await vault.getPricePerFullShare()).to.be.bignumber.eq(amount);
        });
    });
});
