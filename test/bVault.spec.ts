require('module-alias/register');

import { accounts, contract, web3 } from '@openzeppelin/test-environment'; 
import { expect } from 'chai';

import { 
    TestTokenContract, 
    TestTokenInstance, 
    ControllerContract,
    ControllerInstance,
    BVaultInstance,
    BVaultContract,
    DummyStrategyContract,
    DummyStrategyInstance
} from '@gen/contracts';

import { e18 } from '@testUtils/units';
import { ZERO, ONE, TWO, THREE, TEN, ONE_HUNDRED, ZERO_ADDRESS } from '@testUtils/constants';
import { Blockchain } from '@testUtils/blockchain';

import { constants } from '@openzeppelin/test-helpers';
import { expectException } from '@testUtils/expectException';

const { BN } = require('@openzeppelin/test-helpers');
const blockchain = new Blockchain(web3.currentProvider);

const TestToken : TestTokenContract = contract.fromArtifact("TestToken");
const DummyStrategy : DummyStrategyContract = contract.fromArtifact("DummyStrategy");
const BVault: BVaultContract = contract.fromArtifact("BVault");
const Controller: ControllerContract = contract.fromArtifact("Controller");

const [admin, user1, user2, rewarder, strategist] = accounts;

describe('Test', function () {
    let token: TestTokenInstance;
    let vault: BVaultInstance;
    let controller: ControllerInstance;
    let strategy: DummyStrategyInstance;

    let balance = e18(1000);

    before(async function() {
        token = await TestToken.new("test token", "Tok", 18, {from: admin});

        controller = await Controller.new(rewarder, {from: admin});
        vault = await BVault.new(token.address, controller.address, {from: admin});
        strategy = await DummyStrategy.new(controller.address, token.address, {from: admin});

        await token.mint(user1, balance, {from: admin});
        await token.approve(vault.address, balance, {from: user1});


        await controller.setVault(token.address, vault.address, {from: admin});
        await controller.approveStrategy(token.address, strategy.address, {from: admin});
        await controller.setStrategy(token.address, strategy.address, {from: admin});

        await controller.setStrategist(strategist, {from: admin});
    });

    after(async function() {
    });

    describe('BVault', async function() {
        before(async function() {
            await blockchain.saveSnapshotAsync();
        });
    
        after(async function() {
            await blockchain.revertAsync();
        });

        describe("earn", async function() {
            it("vault's earn: unauthorized user can NOT call", async function() {
                await expectException(vault.earn({from: admin}), "!controller");
                await expectException(vault.earn({from: user1}), "!controller");
            });

            it("controller's earn: unauthorized user can NOT call", async function() {
                await expectException(controller.earn(token.address, {from: user1}), "!strategist");
            });

            it("controller's earn: wrong vault address", async function() {
                await expectException(controller.earn(user1, {from: admin}), "no vault");
            });

            it("controller's earn: admin can call", async function() {
                await controller.earn(token.address, {from: admin});
            });
    
            it("controller's earn: strategist can call", async function() {
                await controller.earn(token.address, {from: strategist});
            });
    
            describe("after deposit", async function() {
                const amount = e18(10);
                beforeEach(async function() {
                    await blockchain.saveSnapshotAsync();
                    
                    await vault.deposit(amount, {from: user1});
                });
            
                afterEach(async function() {
                    await blockchain.revertAsync();
                });
        
                it("min 9000, max 10000", async function() {
                    await vault.setMin(new BN(9000), {from: admin});
                    await controller.earn(token.address, {from: strategist});

                    expect(await token.balanceOf(vault.address)).to.be.bignumber.eq(e18(1));
                    expect(await token.balanceOf(strategy.address)).to.be.bignumber.eq(e18(9));
                });
    
                it("min 0, max 10000", async function() {
                    const amount = e18(10);

                    await vault.setMin(new BN(0), {from: admin});
                    await controller.earn(token.address, {from: strategist});

                    expect(await token.balanceOf(vault.address)).to.be.bignumber.eq(amount);
                    expect(await token.balanceOf(strategy.address)).to.be.bignumber.eq(ZERO);
                });
            });

            describe("after earn", async function() {
                const amount = e18(100);
                
                before(async function() {
                    await blockchain.saveSnapshotAsync();

                    await vault.deposit(amount, {from: user1});
                    await controller.earn(token.address, {from: strategist});
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

                it("initial checking", async function() {
                    expect(await token.balanceOf(vault.address)).to.be.bignumber.eq(e18(5));
                    expect(await token.balanceOf(strategy.address)).to.be.bignumber.eq(e18(95));
                });

                it("withdraw", async function() {
                    await vault.withdrawAll({from: user1});
                    expect(await token.balanceOf(vault.address)).to.be.bignumber.eq(ZERO);
                    expect(await token.balanceOf(strategy.address)).to.be.bignumber.eq(ZERO);
                });

                it("controller's withdrawAll", async function() {
                    await controller.withdrawAll(token.address, {from: strategist});
                    expect(await token.balanceOf(vault.address)).to.be.bignumber.eq(amount);
                    expect(await token.balanceOf(strategy.address)).to.be.bignumber.eq(ZERO);
                });

                it("change strategy", async function() {
                    await controller.withdrawAll(token.address, {from: strategist});

                    const strategy2 = await DummyStrategy.new(controller.address, token.address, {from: strategist});
                    await controller.approveStrategy(token.address, strategy2.address, {from: admin});
                    await controller.setStrategy(token.address, strategy2.address, {from: admin});

                    await controller.earn(token.address, {from: strategist});
             
                    expect(await token.balanceOf(vault.address)).to.be.bignumber.eq(e18(5));
                    expect(await token.balanceOf(strategy.address)).to.be.bignumber.eq(ZERO);
                    expect(await token.balanceOf(strategy2.address)).to.be.bignumber.eq(e18(95));
                });
            });
        });
    });
});
