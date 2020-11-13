require('module-alias/register');

import { contract, web3 } from '@openzeppelin/test-environment'; 
import { expect } from 'chai';

import { 
    BullContract, 
    BullInstance, 
    BVaultContract, 
    GovernanceContract, 
    RewardPoolContract, 
    RewardPoolInstance, 
    TestRewardPoolContract, 
    TestRewardPoolInstance, 
    TestTokenContract, 
    TestTokenInstance, 
    TimelockContract 
} from '@gen/contracts';

import { e9, e18, e27 } from '@testUtils/units';
import { ZERO, ONE, TWO, THREE, TEN, ONE_HUNDRED, ZERO_ADDRESS } from '@testUtils/constants';
import { Blockchain } from '@testUtils/blockchain';

import { expectRevert, constants } from '@openzeppelin/test-helpers';

import {
    getDomainTypeHash,
    getDelegationTypeHash,
    getDomainSeparator,
    getStructHash,
    getDigest,
    nowInSeconds
} from '@testUtils/bullSigHelper';
import { ecsign, ECDSASignature } from 'ethereumjs-util';
import { hexlify, keccak256, toUtf8Bytes } from 'ethers/utils';

const ganacheAccounts = [
    "0x93393707fBC29FdbD74F90A3dC553078f2D65Cf0",
    "0x4db5Be7C512eC02c901FaF0B0Afb20a5f12C2299",
    "0x2429373793B51dB6da9C82E7aC9d2E2935c52BAa",
    "0xB4cB1B887DCD1BdfeB7D96a90089e5dBbDd9E18c",
    "0x9D54e532A072F84E405260c8A0BF6a8175B201C9",
    "0x0B14C5044d593Fa8c4E80cb82de245298886e117",
    "0xbc58151afFE5FEAa0Fae96da407AAc87E28c947a",
    "0xb70E57Be50c8F79f5BcCd7DC94fE8D85E99F65F3",
    "0x19712c1593ec6d3F85f5ca68c26EF0e07b19BD5e",
    "0x21B0A08b7112b761cF0CE721b4b47993f363ddE3"
];

const ganachePasswords = [
    "0xf1d1ccb988560dd2eeb0663061223debcf8ff667855bcd482d6399bf23d148e6",
    "0x52e03a0c88077ea517cc34c4bfddeca5e80fc67109ec2e4c84ba1493507526ff",
    "0xcaab7b051625ff27e87832e90494a001b1770af5bd8f2cf19c79cba9931cfef4",
    "0x218000b228506845ee804450bd5c92ff741975f4f7fd15e1c4da01c5b33ea9f0",
    "0x5e0b9b7f4a0528cbda347727fd7522660d83b20cc1385b1850fd4bdc80e6a9be",
    "0xc6b581598157ecc24f37869c54ea363b32117bf9622fe9c881395701284cbbda",
    "0x24b974a7940b54cb68b09623c25c8e83adacaaae96cfd79e392ab39295637251",
    "0x0688f9ff4127e70a1ee4245a73ce58e257879afdc8ed0700874c7e1a3a88edc8",
    "0xb5bf52145eb9b9e979f9d41d5d9dd14cdcf086cc5e5b3efa93414f0007626d0b",
    "0xf4b2fc7432fd79c32df1bcff616160c24a76f47c7285b087fc3b68c70b3707e7"
];

const { BN } = require('@openzeppelin/test-helpers');
const blockchain = new Blockchain(web3.currentProvider);

const Bull : BullContract = contract.fromArtifact("Bull");
const GovernorAlpha: GovernanceContract = contract.fromArtifact("GovernorAlpha");
const Timelock: TimelockContract = contract.fromArtifact("Timelock");
const RewardPool: TestRewardPoolContract = contract.fromArtifact("TestRewardPool");

const [admin, holder, user1, user2, user3] = ganacheAccounts;
const [adminPw, holderPw, user1Pw, user2Pw, user3Pw] = ganachePasswords;
const [FOUR, FIVE, SIX, SEVEN, EIGHT, NINE] = [new BN(4),new BN(5),new BN(6),new BN(7),new BN(8),new BN(9)];

const MAX_UINT96:BN = (new BN(2)).pow(new BN(96)).sub(ONE);

async function getLatestBlockNumber(): Promise<BN> {
    return new BN((await web3.eth.getBlock('latest')).number);
}

describe('Bull', async function () {
    const name = "Bull";
    const symbol = "BULL";
    const decimals = new BN(18);

    let bull: BullInstance;
    const totalSupply = e18(1000000);

    // async function getBullDiff(fn: () => Promise<void>): Promise<Snapshot> {
    //     return await getDiff(bull, fn);
    // }

    let adminBalance: BN;
    let holderBalance: BN;
    let user1Balance: BN;
    let user2Balance: BN;
    let user3Balance: BN;

    before(async function() {
        console.log("before");
        bull = await Bull.new(holder, {from: admin});
    });

    beforeEach(async function() {
        adminBalance = await bull.balanceOf(admin);
        holderBalance = await bull.balanceOf(holder);
        user1Balance = await bull.balanceOf(user1);
        user2Balance = await bull.balanceOf(user2);
        user3Balance = await bull.balanceOf(user3);
    });

    describe("votes test", async function() {
        async function printCurrentVotes() {
            console.log("-------- printCurrentVotes ---------");
            console.log('holder', (await bull.getCurrentVotes(holder)).toString(), (await bull.balanceOf(holder)).toString());
            console.log('user1', (await bull.getCurrentVotes(user1)).toString(), (await bull.balanceOf(user1)).toString());
            console.log('user2', (await bull.getCurrentVotes(user2)).toString(), (await bull.balanceOf(user2)).toString());
            console.log('user3', (await bull.getCurrentVotes(user3)).toString(), (await bull.balanceOf(user3)).toString());
        }

        async function printPriorVotes(blockNumber: BN) {
            console.log("-------- getPriorVotes ---------");
            console.log('holder', (await bull.getPriorVotes(holder, blockNumber)).toString());
            console.log('user1', (await bull.getPriorVotes(user1, blockNumber)).toString());
            console.log('user2', (await bull.getPriorVotes(user2, blockNumber)).toString());
            console.log('user3', (await bull.getPriorVotes(user3, blockNumber)).toString());
        }

        before(async function() {
            await blockchain.saveSnapshotAsync();
            expect(await bull.getCurrentVotes(holder)).to.be.bignumber.eq(ZERO);
            expect(await bull.getCurrentVotes(user1)).to.be.bignumber.eq(ZERO);
            expect(await bull.getCurrentVotes(user2)).to.be.bignumber.eq(ZERO);
            expect(await bull.getCurrentVotes(user3)).to.be.bignumber.eq(ZERO);

            let blockNum = await getLatestBlockNumber();
            expect(await bull.getPriorVotes(holder, blockNum.sub(ONE))).to.be.bignumber.eq(ZERO);
            expect(await bull.getPriorVotes(user1, blockNum.sub(ONE))).to.be.bignumber.eq(ZERO);
            expect(await bull.getPriorVotes(user2, blockNum.sub(ONE))).to.be.bignumber.eq(ZERO);
            expect(await bull.getPriorVotes(user3, blockNum.sub(ONE))).to.be.bignumber.eq(ZERO);
        });

        after(async function() {
            await blockchain.revertAsync();
        });

        describe("delegateBySig", async function() {
            before(async function() {
                await blockchain.saveSnapshotAsync();
            });

            after(async function() {
                await blockchain.revertAsync();
            });


            let bullAddress: string;
            let bullName: string;
            let delegator: string;
            let delegatorPw: string;
            let delegatee: string;
            let nonce: string;
            let expiry: string;

            beforeEach(async function() {
                await blockchain.saveSnapshotAsync();

                bullAddress = bull.address;
                bullName = name;
                delegator = user1;
                delegatorPw = user1Pw;
                delegatee = user2;
                nonce = "0";
                expiry = nowInSeconds(10).toString();
            });

            afterEach(async function() {
                await blockchain.revertAsync();
            });

            async function delegateBySig() {
                const domainSeparator = getDomainSeparator(bullAddress, bullName);
                const structHash = getStructHash(delegatee, nonce, expiry);

                const digest = await getDigest(domainSeparator, structHash);

                const {v, r, s} = ecsign(
                    Buffer.from(digest.slice(2), 'hex'),
                    Buffer.from(delegatorPw.slice(2), 'hex')
                );

                return await bull.delegateBySig(delegatee, nonce, expiry, v, hexlify(r), hexlify(s), {from: delegator});
            }

            it("working", async function() {
                expect(await bull.delegates(delegator)).to.be.eq(ZERO_ADDRESS);
                await delegateBySig();
                expect(await bull.delegates(delegator)).to.be.eq(delegatee);
            });

            it("NOT working: wrong nonce", async function() {
                nonce = "100";

                expect(await bull.delegates(delegator)).to.be.eq(ZERO_ADDRESS);
                expectRevert(delegateBySig(), "Bull::delegateBySig: invalid nonce");
                expect(await bull.delegates(delegator)).to.be.eq(ZERO_ADDRESS);
            });

            it("NOT working: wrong name", async function() {
                bullName = "wrongName";

                expect(await bull.delegates(delegator)).to.be.eq(ZERO_ADDRESS);
                await delegateBySig();
                expect(await bull.delegates(delegator)).to.be.eq(ZERO_ADDRESS);
            });

            it("NOT working: wrong address", async function() {
                bullAddress = admin;

                expect(await bull.delegates(delegator)).to.be.eq(ZERO_ADDRESS);
                await delegateBySig();
                expect(await bull.delegates(delegator)).to.be.eq(ZERO_ADDRESS);
            });

            it("NOT working: wrong expiry", async function() {
                expiry = nowInSeconds(-10).toString();

                expect(await bull.delegates(delegator)).to.be.eq(ZERO_ADDRESS);
                expectRevert(delegateBySig(), "Bull::delegateBySig: signature expired");
                expect(await bull.delegates(delegator)).to.be.eq(ZERO_ADDRESS);
            });

            it("NOT working: wrong password", async function() {
                delegatorPw = adminPw;

                expect(await bull.delegates(delegator)).to.be.eq(ZERO_ADDRESS);
                await delegateBySig();
                expect(await bull.delegates(delegator)).to.be.eq(ZERO_ADDRESS);
            });

            it("NOT working: worng domainSeparator", async function() {
                const wrongAddress = admin;
                const domainSeparator = getDomainSeparator(wrongAddress, bullName);
                const structHash = getStructHash(delegatee, nonce, expiry);

                const digest = await getDigest(domainSeparator, structHash);

                const {v, r, s} = ecsign(
                    Buffer.from(digest.slice(2), 'hex'),
                    Buffer.from(delegatorPw.slice(2), 'hex')
                );

                expect(await bull.delegates(delegator)).to.be.eq(ZERO_ADDRESS);
                await bull.delegateBySig(delegatee, nonce, expiry, v, hexlify(r), hexlify(s), {from: delegator});
                expect(await bull.delegates(delegator)).to.be.eq(ZERO_ADDRESS);
            });

            it("NOT working: worng structHash", async function() {
                const wrongDelegatee = admin;
                const domainSeparator = getDomainSeparator(bullAddress, bullName);
                const structHash = getStructHash(wrongDelegatee, nonce, expiry);

                const digest = await getDigest(domainSeparator, structHash);

                const {v, r, s} = ecsign(
                    Buffer.from(digest.slice(2), 'hex'),
                    Buffer.from(delegatorPw.slice(2), 'hex')
                );

                expect(await bull.delegates(delegator)).to.be.eq(ZERO_ADDRESS);
                await bull.delegateBySig(delegatee, nonce, expiry, v, hexlify(r), hexlify(s), {from: delegator});
                expect(await bull.delegates(delegator)).to.be.eq(ZERO_ADDRESS);
            });

            it("NOT working: wrong parameter", async function() {
                const wrongDelegatee = admin;

                const domainSeparator = getDomainSeparator(bullAddress, bullName);
                const structHash = getStructHash(delegatee, nonce, expiry);

                const digest = await getDigest(domainSeparator, structHash);

                const {v, r, s} = ecsign(
                    Buffer.from(digest.slice(2), 'hex'),
                    Buffer.from(delegatorPw.slice(2), 'hex')
                );

                expect(await bull.delegates(delegator)).to.be.eq(ZERO_ADDRESS);
                await bull.delegateBySig(wrongDelegatee, nonce, expiry, v, hexlify(r), hexlify(s), {from: delegator});
                expect(await bull.delegates(delegator)).to.be.eq(ZERO_ADDRESS);
            });
        });

        describe("delegate", async function() {
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
                let v1 = await bull.balanceOf(holder);
                let v2 = await bull.getCurrentVotes(holder);
                if (!v2.isZero() && !v1.isZero()) expect(v1).to.be.bignumber.eq(v2);
                
                v1 = await bull.balanceOf(user1);
                v2 = await bull.getCurrentVotes(user1);
                if (!v2.isZero() && !v1.isZero()) expect(v1).to.be.bignumber.eq(v2);

                v1 = await bull.balanceOf(user2);
                v2 = await bull.getCurrentVotes(user2);
                if (!v2.isZero() && !v1.isZero()) expect(v1).to.be.bignumber.eq(v2);
                
                await blockchain.revertAsync();
            });

            describe("self delegate", async function() {
                const amount = TEN;
                it("after delegate", async function() {
                    expect(await bull.delegates(holder)).to.be.eq(ZERO_ADDRESS);
                    await bull.delegate(holder, {from: holder});
                    expect(await bull.delegates(holder)).to.be.eq(holder);
    
                    let blockNum = await getLatestBlockNumber();
                    expect(await bull.getCurrentVotes(holder)).to.be.bignumber.eq(holderBalance);
                    expect(await bull.getPriorVotes(holder, blockNum.sub(ONE))).to.be.bignumber.eq(ZERO);
    
                    await blockchain.mineBlockAsync();
                    
                    blockNum = await getLatestBlockNumber();
                    expect(await bull.getPriorVotes(holder, blockNum.sub(ONE))).to.be.bignumber.eq(holderBalance);
                    expect(await bull.getPriorVotes(holder, blockNum.sub(TWO))).to.be.bignumber.eq(ZERO);
                });
    
                it("transfer: undelegated => undelegated", async function() {
                    await bull.transfer(user1, amount, {from: holder});
    
                    expect(await bull.getCurrentVotes(holder)).to.be.bignumber.eq(ZERO);
                    expect(await bull.getCurrentVotes(user1)).to.be.bignumber.eq(ZERO);
                });
    
                it("transfer: delegated => undelegated", async function() {
                    await bull.delegate(holder, {from: holder});
    
                    await bull.transfer(user1, amount, {from: holder});
    
                    expect(await bull.getCurrentVotes(holder)).to.be.bignumber.eq(holderBalance.sub(amount));
                    expect(await bull.getCurrentVotes(user1)).to.be.bignumber.eq(ZERO);
                });
    
                it("transfer: delegated => delegated", async function() {
                    await bull.delegate(holder, {from: holder});
                    await bull.delegate(user1, {from: user1});
    
                    await bull.transfer(user1, amount, {from: holder});
    
                    expect(await bull.getCurrentVotes(holder)).to.be.bignumber.eq(holderBalance.sub(amount));
                    expect(await bull.getCurrentVotes(user1)).to.be.bignumber.eq(amount);
                });
    
                it("transfer: undelegated => delegated", async function() {
                    await bull.delegate(user1, {from: user1});
    
                    await bull.transfer(user1, TEN, {from: holder});
    
                    expect(await bull.getCurrentVotes(holder)).to.be.bignumber.eq(ZERO);
                    expect(await bull.getCurrentVotes(user1)).to.be.bignumber.eq(amount);
                });
            });

            describe("delegate to other", async function() {
                const amount = TEN;

                it("after delegate", async function() {
                    expect(await bull.delegates(holder)).to.be.bignumber.eq(ZERO_ADDRESS);
                    await bull.delegate(user3, {from: holder});
                    expect(await bull.delegates(holder)).to.be.bignumber.eq(user3);
    
                    let blockNum = await getLatestBlockNumber();
                    expect(await bull.getCurrentVotes(holder)).to.be.bignumber.eq(ZERO);
                    expect(await bull.getCurrentVotes(user3)).to.be.bignumber.eq(holderBalance);
                    expect(await bull.getPriorVotes(holder, blockNum.sub(ONE))).to.be.bignumber.eq(ZERO);
                    expect(await bull.getPriorVotes(user3, blockNum.sub(ONE))).to.be.bignumber.eq(ZERO);
    
                    await blockchain.mineBlockAsync();
                    
                    blockNum = await getLatestBlockNumber();
                    expect(await bull.getPriorVotes(holder, blockNum.sub(ONE))).to.be.bignumber.eq(ZERO);
                    expect(await bull.getPriorVotes(user3, blockNum.sub(ONE))).to.be.bignumber.eq(holderBalance);

                    await bull.delegate(holder, {from: holder});
                    expect(await bull.getCurrentVotes(holder)).to.be.bignumber.eq(holderBalance);
                    expect(await bull.getCurrentVotes(user3)).to.be.bignumber.eq(ZERO);
                });

                it("transfer: holder(delegated to user2) => user1(delegated to user3)", async function() {
                    const holderDelegate = user2;
                    const user1Delegate = user3;
                    await bull.delegate(holderDelegate, {from: holder});
                    await bull.delegate(user1Delegate, {from: user1});

                    await bull.transfer(user1, amount, {from: holder});
    
                    expect(await bull.getCurrentVotes(holderDelegate)).to.be.bignumber.eq(holderBalance.sub(amount));
                    expect(await bull.getCurrentVotes(user1Delegate)).to.be.bignumber.eq(amount);
                });

                it("transfer: holder(delegated to user2) => user1(delegated to user2)", async function() {
                    const holderDelegate = user2;
                    const user1Delegate = user2;
                    await bull.delegate(holderDelegate, {from: holder});
                    await bull.delegate(user1Delegate, {from: user1});

                    await bull.transfer(user1, amount, {from: holder});
    
                    expect(await bull.getCurrentVotes(user2)).to.be.bignumber.eq(holderBalance);

                    await bull.delegate(holder, {from: holder});

                    expect(await bull.getCurrentVotes(user2)).to.be.bignumber.eq(amount);

                    await bull.delegate(user1, {from: user1});

                    expect(await bull.getCurrentVotes(user2)).to.be.bignumber.eq(ZERO);
                });

                it("delegate to ZERO_ADDRESS", async function() {
                    await bull.delegate(ZERO_ADDRESS, {from: holder});
                    expect(await bull.getCurrentVotes(holder)).to.be.bignumber.eq(ZERO);
                    expect(await bull.getCurrentVotes(ZERO_ADDRESS)).to.be.bignumber.eq(ZERO);

                    await bull.delegate(holder, {from: holder});
                    expect(await bull.getCurrentVotes(holder)).to.be.bignumber.eq(holderBalance);
                });

                it("user1 delegate user2 (user2 delegate user3): getCurrentVotes", async function() {
                    await bull.delegate(user2, {from: user1});
                    await bull.delegate(user3, {from: user2});

                    await bull.transfer(user1, amount, {from: holder});

                    expect(await bull.getCurrentVotes(user1)).to.be.bignumber.eq(ZERO);
                    expect(await bull.getCurrentVotes(user2)).to.be.bignumber.eq(amount);
                    expect(await bull.getCurrentVotes(user3)).to.be.bignumber.eq(ZERO);

                    await bull.transfer(user2, amount, {from: holder});

                    expect(await bull.getCurrentVotes(user1)).to.be.bignumber.eq(ZERO);
                    expect(await bull.getCurrentVotes(user2)).to.be.bignumber.eq(amount);
                    expect(await bull.getCurrentVotes(user3)).to.be.bignumber.eq(amount);

                    await bull.transfer(user3, amount, {from: holder});

                    expect(await bull.getCurrentVotes(user1)).to.be.bignumber.eq(ZERO);
                    expect(await bull.getCurrentVotes(user2)).to.be.bignumber.eq(amount);
                    expect(await bull.getCurrentVotes(user3)).to.be.bignumber.eq(amount);

                    await bull.delegate(user3, {from: user3});

                    expect(await bull.getCurrentVotes(user1)).to.be.bignumber.eq(ZERO);
                    expect(await bull.getCurrentVotes(user2)).to.be.bignumber.eq(amount);
                    expect(await bull.getCurrentVotes(user3)).to.be.bignumber.eq(amount.mul(TWO));

                    await bull.delegate(user2, {from: user2});

                    expect(await bull.getCurrentVotes(user1)).to.be.bignumber.eq(ZERO);
                    expect(await bull.getCurrentVotes(user2)).to.be.bignumber.eq(amount.mul(TWO));
                    expect(await bull.getCurrentVotes(user3)).to.be.bignumber.eq(amount);

                    await bull.delegate(user1, {from: user1});

                    expect(await bull.getCurrentVotes(user1)).to.be.bignumber.eq(amount);
                    expect(await bull.getCurrentVotes(user2)).to.be.bignumber.eq(amount);
                    expect(await bull.getCurrentVotes(user3)).to.be.bignumber.eq(amount);
                });

                it("user1 delegate user2 (user2 delegate user3): getPriorVotes", async function() {
                    await bull.delegate(user2, {from: user1});
                    await bull.delegate(user3, {from: user2});

                    const b1 = await getLatestBlockNumber();
                    await bull.transfer(user1, amount, {from: holder});

                    const b2 = await getLatestBlockNumber();
                    await bull.transfer(user2, amount, {from: holder});

                    const b3 = await getLatestBlockNumber();
                    await bull.transfer(user3, amount, {from: holder});

                    const b4 = await getLatestBlockNumber();
                    await bull.delegate(user3, {from: user3});

                    const b5 = await getLatestBlockNumber();
                    await bull.delegate(user2, {from: user2});

                    const b6 = await getLatestBlockNumber();
                    await bull.delegate(user1, {from: user1});

                    const b7 = await getLatestBlockNumber();
                    await blockchain.mineBlockAsync();

                    expect(await bull.getPriorVotes(user1, b1)).to.be.bignumber.eq(ZERO);
                    expect(await bull.getPriorVotes(user2, b1)).to.be.bignumber.eq(ZERO);
                    expect(await bull.getPriorVotes(user3, b1)).to.be.bignumber.eq(ZERO);

                    expect(await bull.getPriorVotes(user1, b2)).to.be.bignumber.eq(ZERO);
                    expect(await bull.getPriorVotes(user2, b2)).to.be.bignumber.eq(amount);
                    expect(await bull.getPriorVotes(user3, b2)).to.be.bignumber.eq(ZERO);

                    expect(await bull.getPriorVotes(user1, b3)).to.be.bignumber.eq(ZERO);
                    expect(await bull.getPriorVotes(user2, b3)).to.be.bignumber.eq(amount);
                    expect(await bull.getPriorVotes(user3, b3)).to.be.bignumber.eq(amount);

                    expect(await bull.getPriorVotes(user1, b4)).to.be.bignumber.eq(ZERO);
                    expect(await bull.getPriorVotes(user2, b4)).to.be.bignumber.eq(amount);
                    expect(await bull.getPriorVotes(user3, b4)).to.be.bignumber.eq(amount);

                    expect(await bull.getPriorVotes(user1, b5)).to.be.bignumber.eq(ZERO);
                    expect(await bull.getPriorVotes(user2, b5)).to.be.bignumber.eq(amount);
                    expect(await bull.getPriorVotes(user3, b5)).to.be.bignumber.eq(amount.mul(TWO));

                    expect(await bull.getPriorVotes(user1, b6)).to.be.bignumber.eq(ZERO);
                    expect(await bull.getPriorVotes(user2, b6)).to.be.bignumber.eq(amount.mul(TWO));
                    expect(await bull.getPriorVotes(user3, b6)).to.be.bignumber.eq(amount);

                    expect(await bull.getPriorVotes(user1, b7)).to.be.bignumber.eq(amount);
                    expect(await bull.getPriorVotes(user2, b7)).to.be.bignumber.eq(amount);
                    expect(await bull.getPriorVotes(user3, b7)).to.be.bignumber.eq(amount);
                });
            });
        });
    });

    describe("ERC20 test", async function() {
        it("name, symbol, decimals, totalSupply, balanceOf", async function() {
            expect(await bull.name()).to.be.eq(name);
            expect(await bull.symbol()).to.be.eq(symbol);
            expect(await bull.decimals()).to.be.bignumber.eq(decimals);

            expect(await bull.totalSupply()).to.be.bignumber.eq(totalSupply);
            expect(await bull.balanceOf(admin)).to.be.bignumber.eq(ZERO);
            expect(await bull.balanceOf(holder)).to.be.bignumber.eq(totalSupply);
        });

        describe('transfer', async function() {
            let user1InitialBull = e18(100000);

            before(async function() {
                await blockchain.saveSnapshotAsync();
                await bull.transfer(user1, user1InitialBull, {from: holder});
            });

            after(async function() {
                await blockchain.revertAsync();
            });

            beforeEach(async function() {
                await blockchain.saveSnapshotAsync();
            });

            afterEach(async function() {
                expect(await bull.totalSupply()).to.be.bignumber.eq(totalSupply);
                await blockchain.revertAsync();
            });

            it ('should transfer token correctly', async function() {
                await bull.transfer(user2, ONE, {from: user1});
                expect(await bull.balanceOf(user1)).to.be.bignumber.eq(user1Balance.sub(ONE));
                expect(await bull.balanceOf(user2)).to.be.bignumber.eq(user2Balance.add(ONE));
            });

            it('transfer to ZERO address', async function() {
                await bull.transfer(ZERO_ADDRESS, ONE, {from: user1});

                expect(await bull.balanceOf(user1)).to.be.bignumber.eq(user1Balance.sub(ONE));
                expect(await bull.balanceOf(ZERO_ADDRESS)).to.be.bignumber.eq(ONE);
            });

            it ('should NOT transfer token more than balance', async function() {
                await expectRevert(
                    bull.transfer(user2, user1InitialBull.add(ONE), {from: user1}),
                    "Bull::_transferTokens: transfer amount exceeds balance"
                );

                await expectRevert(
                    bull.transfer(user2, constants.MAX_UINT256, {from: user1}),
                    "Bull::transfer: amount exceeds 96 bits"
                );
            });

            it('should transfer from approved user', async function() {
                await bull.approve(admin, ONE, {from: user1});
                expect(await bull.allowance(user1, admin)).to.be.bignumber.equal(ONE);

                await bull.transferFrom(user1, user2, ONE, {from: admin});
                
                expect(await bull.allowance(user1, admin)).to.be.bignumber.equal(ZERO);

                expect(await bull.balanceOf(user1)).to.be.bignumber.eq(user1Balance.sub(ONE));
                expect(await bull.balanceOf(user2)).to.be.bignumber.eq(user2Balance.add(ONE));
            });

            it('should NOT transfer from approved user more than allowances', async function() {
                await bull.approve(admin, ONE, {from: user1});
                expect(await bull.allowance(user1, admin)).to.be.bignumber.equal(ONE);

                await expectRevert(
                    bull.transferFrom(user1, user2, TWO, {from: admin}),
                    "Bull::transferFrom: transfer amount exceeds spender allowance"
                );

                await expectRevert(
                    bull.transferFrom(user1, user2, constants.MAX_UINT256, {from: admin}),
                    "Bull::approve: amount exceeds 96 bits"
                );
            });

            it('should transfer by MAX_UINT256 approved user', async function() {
                await bull.approve(admin, constants.MAX_UINT256, {from: user1});
                expect(await bull.allowance(user1, admin)).to.be.bignumber.equal(MAX_UINT96);

                await bull.transferFrom(user1, user2, ONE, {from: admin});

                expect(await bull.allowance(user1, admin)).to.be.bignumber.equal(MAX_UINT96);

                expect(await bull.balanceOf(user1)).to.be.bignumber.eq(user1Balance.sub(ONE));
                expect(await bull.balanceOf(user2)).to.be.bignumber.eq(user2Balance.add(ONE));
            });

            it('should NOT allow MAX_UINT256 - 1 approve', async function() {
                await expectRevert(
                    bull.approve(admin, constants.MAX_UINT256.sub(ONE), {from: user1}),
                    "Bull::approve: amount exceeds 96 bits"
                );
            });
        });
    });
});
