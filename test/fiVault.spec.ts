require('module-alias/register');

import { accounts, contract, web3 } from '@openzeppelin/test-environment'; 
import { expect } from 'chai';

import { 
    TestTokenContract, 
    TestTokenInstance, 
    ControllerContract,
    ControllerInstance,
    FiVaultInstance,
    FiVaultContract,
    DummyStrategyContract,
    DummyStrategyInstance
} from '@gen/contracts';

import { e18, toE18 } from '@testUtils/units';
import { ZERO, ONE, TWO } from '@testUtils/constants';
import { Blockchain } from '@testUtils/blockchain';
import { constants } from '@openzeppelin/test-helpers';

const { BN, expectRevert } = require('@openzeppelin/test-helpers');
const blockchain = new Blockchain(web3.currentProvider);

const TestToken : TestTokenContract = contract.fromArtifact("TestToken");
const DummyStrategy : DummyStrategyContract = contract.fromArtifact("DummyStrategy");
const fiVault: FiVaultContract = contract.fromArtifact("fiVault");
const Controller: ControllerContract = contract.fromArtifact("Controller");

const [admin, user1, user2, rewarder, strategist] = accounts;

describe('Test', function () {
    let token: TestTokenInstance;
    let vault: FiVaultInstance;
    let controller: ControllerInstance;
    let strategy: DummyStrategyInstance;

    let balance = e18(1000);

    before(async function() {
        token = await TestToken.new("test token", "Tok", 6, {from: admin});

        controller = await Controller.new(rewarder, {from: admin});
        vault = await fiVault.new(token.address, controller.address, "", constants.MAX_UINT256, {from: admin});
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

    it('basic', async function() {
        expect(await vault.name()).to.be.eq("FIRE test token");
        expect(await vault.symbol()).to.be.eq("fiTok");
        expect(await vault.decimals()).to.be.bignumber.eq(new BN(6));
    });

    it('suffix', async function() {
        const t1 = await fiVault.new(token.address, controller.address, "1", constants.MAX_UINT256, {from: admin});
        expect(await t1.name()).to.be.eq("FIRE test token1");
        expect(await t1.symbol()).to.be.eq("fiTok1");

        const t123 = await fiVault.new(token.address, controller.address, "123", constants.MAX_UINT256, {from: admin});
        expect(await t123.name()).to.be.eq("FIRE test token123");
        expect(await t123.symbol()).to.be.eq("fiTok123");
    });

    it('constructor: cap', async function() {
        const t1 = await fiVault.new(token.address, controller.address, "", constants.MAX_UINT256, {from: admin});
        expect(await t1.cap()).to.be.bignumber.eq(constants.MAX_UINT256);

        const t2 = await fiVault.new(token.address, controller.address, "", e18(123), {from: admin});
        expect(await t2.cap()).to.be.bignumber.eq(e18(123));
    });

    describe('cap', async function() {
        before(async function() {
            await blockchain.saveSnapshotAsync();
        });
    
        after(async function() {
            await blockchain.revertAsync();
        });

        it('setCap', async function() {
            expect(await vault.cap()).to.be.bignumber.eq(constants.MAX_UINT256);
            await expectRevert(vault.setCap(e18(1), {from: user1}), "!governance");

            expect(await vault.cap()).to.be.bignumber.eq(constants.MAX_UINT256);
            await vault.setCap(e18(1), {from: admin})
            expect(await vault.cap()).to.be.bignumber.eq(e18(1));
        });

        describe('deposit with 1e18 cap', async function (){
            const cap = e18(10);
            before (async function() {
                await blockchain.saveSnapshotAsync();
                await vault.setCap(cap, {from: admin});
            });

            after (async function() {
                await blockchain.revertAsync();
            });

            beforeEach(async function() {
                await blockchain.saveSnapshotAsync();
            });
        
            afterEach(async function() {
                await blockchain.revertAsync();
            });

            async function deposit(amount: BN, account: string) {
                const initBalance = await vault.balance();
                await token.approve(vault.address, amount, { from: account});
                await vault.deposit(amount, {from: account});
                expect(await vault.balance()).to.be.bignumber.eq(initBalance.add(amount));
            }

            describe('single account', async function() {
                it('success: cap amount', async function() {
                    await deposit(cap, user1);
                })
        
                it('success: less amount', async function() {
                    await deposit(cap.sub(ONE), user1);
                });
    
                it('success: deposit-withdraw-deposit in cap', async function() {
                    await deposit(cap, user1);
                    const b = await vault.balanceOf(user1);
                    await vault.withdraw(b.div(TWO), {from: user1});
                    await deposit(cap.div(TWO), user1);
                });
    
                it('fail: exceeding cap', async function() {
                    await expectRevert(deposit(cap.add(ONE), user1), "exceeding cap");
                });
    
                it('fail: exceeding cap', async function() {
                    await expectRevert(deposit(cap.add(ONE), user1), "exceeding cap");
                });
    
                it('fail: overflow', async function() {
                    await deposit(cap.sub(ONE), user1);
                    await expectRevert(deposit(constants.MAX_UINT256.sub(ONE), user1), "SafeMath: addition overflow");
                });

                it('fail: deposit-withdraw-deposit exceeding cap', async function() {
                    await deposit(cap, user1);
                    const b = await vault.balanceOf(user1);
                    await vault.withdraw(b.div(TWO), {from: user1});
                    await expectRevert(deposit(cap.div(TWO).add(ONE), user1), "exceeding cap");
                });
            });

            describe('two accounts', async function() {
                before (async function() {
                    await blockchain.saveSnapshotAsync();
                    await token.transfer(user2, cap, {from: user1});
                });
    
                after (async function() {
                    await blockchain.revertAsync();
                });

                it('success: deposits in cap', async function() {
                    await deposit(cap.sub(ONE), user1);
                    await deposit(ONE, user2);
                });

                it('success: deposit-withdraw-deposit in cap', async function() {
                    await deposit(cap, user1);
                    const b = await vault.balanceOf(user1);
                    await vault.withdraw(b.div(TWO), {from: user1});
                    await deposit(cap.div(TWO), user2);
                });

                it('fail: deposits exceeding cap', async function() {
                    await deposit(cap.sub(ONE), user1);
                    await expectRevert(deposit(TWO, user2), "exceeding cap");
                });
    
                it('fail: deposits overflow', async function() {
                    await deposit(cap, user1);
                    await expectRevert(deposit(constants.MAX_UINT256.sub(ONE), user2), "SafeMath: addition overflow");
                });
    
                it('fail: deposit-withdraw-deposit exceeding cap', async function() {
                    await deposit(cap, user1);
                    const b = await vault.balanceOf(user1);
                    await vault.withdraw(b.div(TWO), {from: user1});
                    await expectRevert(deposit(cap.div(TWO).add(ONE), user2), "exceeding cap");
                });
            });

            describe('depositAll', async function() {
                it('success: balance is cap', async function() {
                    const amount = cap;
                    await token.transfer(user2, amount, {from: user1});
                    expect(await token.balanceOf(user2)).to.be.bignumber.eq(amount);

                    await token.approve(vault.address, constants.MAX_UINT256, {from: user2});
                    await vault.depositAll({from: user2});
                    
                    expect(await vault.balance()).to.be.bignumber.eq(amount);
                });

                it('fail: balance is exceeding cap', async function() {
                    const amount = cap.add(ONE);
                    await token.transfer(user2, amount, {from: user1});
                    expect(await token.balanceOf(user2)).to.be.bignumber.eq(amount);

                    await token.approve(vault.address, constants.MAX_UINT256, {from: user2});
                    await expectRevert(vault.depositAll({from: user2}), "exceeding cap");
                });
            });

            describe('exceeding cap by profit', async function() {
                before (async function() {
                    await blockchain.saveSnapshotAsync();
                    await deposit(ONE, user1);
                    await token.transfer(strategy.address, cap, {from: user1});
                });
    
                after (async function() {
                    await blockchain.revertAsync();
                });

                it('deposit fail: exceeding cap by profit', async function() {
                    await expectRevert(deposit(ONE, user1), "exceeding cap");
                });
            });
        });
    });

    describe('fiVault', async function() {
        before(async function() {
            await blockchain.saveSnapshotAsync();
        });
    
        after(async function() {
            await blockchain.revertAsync();
        });

        describe("earn", async function() {
            it("vault's earn: unauthorized user can NOT call", async function() {
                await expectRevert(vault.earn({from: admin}), "!controller");
                await expectRevert(vault.earn({from: user1}), "!controller");
            });

            it("controller's earn: unauthorized user can NOT call", async function() {
                await expectRevert(controller.earn(token.address, {from: user1}), "!strategist");
            });

            it("controller's earn: wrong vault address", async function() {
                await expectRevert(controller.earn(user1, {from: admin}), "no vault");
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
