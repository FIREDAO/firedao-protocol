require('module-alias/register');

import { contract, web3 } from '@openzeppelin/test-environment'; 
import { expect } from 'chai';

import { 
    BullContract, 
    BullInstance, 
    GovernanceContract, 
    TestTokenContract, 
    TestTokenInstance, 
    TimelockContract, 
    TimelockInstance
} from '@gen/contracts';

import { e9, e18, e27 } from '@testUtils/units';
import { ZERO, ONE, TWO, THREE, TEN, ONE_HUNDRED, ZERO_ADDRESS } from '@testUtils/constants';
import { Blockchain } from '@testUtils/blockchain';
import { expectException } from '@testUtils/expectException';
import { constants, time } from '@openzeppelin/test-helpers';

import {
    getDomainSeparator,
    getStructHash,
    getDigest,
    nowInSeconds
} from '@testUtils/bullSigHelper';
import { ecsign } from 'ethereumjs-util';
import { hexlify } from 'ethers/utils';
const ethers = require('ethers');

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
const Timelock: TimelockContract = contract.fromArtifact("Timelock");
const TestToken: TestTokenContract = contract.fromArtifact("TestToken");

const [admin, holder, user1, user2, user3] = ganacheAccounts;
const [adminPw, holderPw, user1Pw, user2Pw, user3Pw] = ganachePasswords;

const MAX_UINT96:BN = (new BN(2)).pow(new BN(96)).sub(ONE);
import { getContractLogs, Log } from '@testUtils/printLogs';

const abi = new ethers.utils.AbiCoder();

async function getLatestBlockNumber(): Promise<number> {
    return (await web3.eth.getBlock('latest')).number;
}

async function getLatestBlockTimestamp(): Promise<number> {
    return Number((await web3.eth.getBlock('latest')).timestamp);
}

describe('Bull', async function () {
    const name = "Bull";
    const symbol = "BULL";
    const decimals = new BN(18);

    let bull: BullInstance;
    const totalSupply = e18(20000);

    let adminBalance: BN;
    let holderBalance: BN;
    let user1Balance: BN;
    let user2Balance: BN;
    let user3Balance: BN;

    before(async function() {
        console.log("before");
        bull = await Bull.new(holder, admin, {from: admin});
    });

    beforeEach(async function() {
        adminBalance = await bull.balanceOf(admin);
        holderBalance = await bull.balanceOf(holder);
        user1Balance = await bull.balanceOf(user1);
        user2Balance = await bull.balanceOf(user2);
        user3Balance = await bull.balanceOf(user3);
    });


    describe("mint test", async function() {
        let timelock: TimelockInstance;
        let delay: BN = new BN(3*24*60*60); // 3days
        let activeDelay: BN = delay.add(new BN(60));

        before(async function() {
            await blockchain.saveSnapshotAsync();
            timelock = await Timelock.new(admin, delay, {from: admin});
        });

        after(async function() {
            await blockchain.revertAsync();
        });

        let elasedTime: BN = ZERO;
        beforeEach(async function() {
            elasedTime = ZERO;
        });

        function nowBN(delta: BN) {
            return (new BN(Date.now()/1000)).add(delta).add(elasedTime);
        }

        async function increaseTime(d: BN) {
            await blockchain.increaseTimeAsync(d);
            elasedTime = elasedTime.add(d);
        }

        describe("timelock", async function(){
            let testToken: TestTokenInstance;
            let ttAmount = e18(1000);

            before(async function() {
                await blockchain.saveSnapshotAsync();
                testToken = await TestToken.new("Testtoken", "TT", 18, {from: admin});
                testToken.mint(timelock.address, ttAmount, {from: admin});
            });
    
            after(async function() {
                await blockchain.revertAsync();
            });

            async function queueTransfer(to: string, amount: BN) {
                await timelock.queueTransaction(
                    testToken.address, 
                    '0', 
                    'transfer(address,uint256)',
                    abi.encode(['address', 'uint256'], [to, amount.toString()]),
                    nowBN(activeDelay),
                    { from: admin } 
                );

                let blockNum = await getLatestBlockNumber();
                let logs = await getContractLogs(timelock, ["QueueTransaction"], blockNum);

                expect(logs[0].event).to.be.eq('QueueTransaction');
                const txHash = logs[0].args['txHash'];
                const target = logs[0].args['target'];
                const value = logs[0].args['value'];
                const signature = logs[0].args['signature'];
                const data = logs[0].args['data'];
                const eta = logs[0].args['eta'];

                // console.log(logs[0]);
                
                return [txHash, target, value, signature, data, eta];
            }

            describe("queueTransaction => executeTransaction", async function() {
                beforeEach(async function() {
                    await blockchain.saveSnapshotAsync();
                });
        
                afterEach(async function() {
                    await blockchain.revertAsync();
                });

                it("queueTransaction => executeTransaction", async function() {
                    const amount = e18(1);
                    const [txHash, target, value, signature, data, eta] = await queueTransfer(user1, amount);
    
                    expect(await timelock.queuedTransactions(txHash)).to.be.true;
                    expect(await testToken.balanceOf(user1)).to.be.bignumber.eq(ZERO);
    
                    await increaseTime(activeDelay);
                    await timelock.executeTransaction(target, value, signature, data, eta, {from: admin});
    
                    expect(await timelock.queuedTransactions(txHash)).to.be.false;
                    expect(await testToken.balanceOf(user1)).to.be.bignumber.eq(amount);
                });

                it("fail: noAuth when queueTransaction", async function() {
                    const noAuthUser = user2;
                    const amount = e18(1);
                    await expectException(
                        timelock.queueTransaction(
                            testToken.address, 
                            '0', 
                            'transfer(address,uint256)',
                            abi.encode(['address', 'uint256'], [user1, amount.toString()]),
                            nowBN(activeDelay),
                            { from: noAuthUser } 
                        ),
                        "Timelock::queueTransaction: Call must come from admin."
                    );
                });
                
                it("fail: noAuth when executeTransaction", async function() {
                    const noAuthUser = user2;
                    const amount = e18(1);
                    const [txHash, target, value, signature, data, eta] = await queueTransfer(user1, amount);
    
                    expect(await timelock.queuedTransactions(txHash)).to.be.true;
                    expect(await testToken.balanceOf(user1)).to.be.bignumber.eq(ZERO);
    
                    await increaseTime(activeDelay);
                    await expectException(
                        timelock.executeTransaction(target, value, signature, data, eta, {from: noAuthUser}),
                        "Timelock::executeTransaction: Call must come from admin."
                    );
                });
                
                it("fail: queueTransaction => early executeTransaction", async function() {
                    const amount = e18(1);
                    const [txHash, target, value, signature, data, eta] = await queueTransfer(user1, amount);
    
                    expect(await timelock.queuedTransactions(txHash)).to.be.true;
                    expect(await testToken.balanceOf(user1)).to.be.bignumber.eq(ZERO);
    
                    await increaseTime(activeDelay.sub(TEN));
                    await expectException(
                        timelock.executeTransaction(target, value, signature, data, eta, {from: admin}),
                        "Timelock::executeTransaction: Transaction hasn't surpassed time lock."
                    );
    
                    expect(await timelock.queuedTransactions(txHash)).to.be.true;
                    expect(await testToken.balanceOf(user1)).to.be.bignumber.eq(ZERO);

                    await increaseTime(TEN);
                    await timelock.executeTransaction(target, value, signature, data, eta, {from: admin});
    
                    expect(await timelock.queuedTransactions(txHash)).to.be.false;
                    expect(await testToken.balanceOf(user1)).to.be.bignumber.eq(amount);
                });

                async function executionWith(
                    _target: string | null, 
                    _value: string | null, 
                    _signature: string | null, 
                    _data: string | null, 
                    _eta: string | null
                ) 
                {
                    const amount = e18(1);
                    const [txHash, target, value, signature, data, eta] = await queueTransfer(user1, amount);
    
                    expect(await timelock.queuedTransactions(txHash)).to.be.true;
                    expect(await testToken.balanceOf(user1)).to.be.bignumber.eq(ZERO);
    
                    await increaseTime(activeDelay);
                    await expectException(
                        timelock.executeTransaction(
                            (_target == null) ? target : _target,
                            (_value == null) ? value : _value,
                            (_signature == null) ? signature : _signature,
                            (_data == null) ? data : _data,
                            (_eta == null) ? eta : _eta,
                            { from: admin }
                        ),
                        "Timelock::executeTransaction: Transaction hasn't been queued."
                    );
    
                    expect(await timelock.queuedTransactions(txHash)).to.be.true;
                    expect(await testToken.balanceOf(user1)).to.be.bignumber.eq(ZERO);

                    await timelock.executeTransaction(target, value, signature, data, eta, {from: admin});
    
                    expect(await timelock.queuedTransactions(txHash)).to.be.false;
                    expect(await testToken.balanceOf(user1)).to.be.bignumber.eq(amount);
                }

                it("fail: queueTransaction => executeTransaction with wrong target", async function() {
                    const wrongTarget = user2;
                    await executionWith(wrongTarget, null, null, null, null);
                });

                it("fail: queueTransaction => executeTransaction with wrong vaule", async function() {
                    const wrongValue = '1';
                    await executionWith(null, wrongValue, null, null, null);
                });

                it("fail: queueTransaction => executeTransaction with wrong signature", async function() {
                    const wrongSignature = 'approve(address,uint256)';
                    await executionWith(null, null, wrongSignature, null, null);
                });

                it("fail: queueTransaction => executeTransaction with wrong data", async function() {
                    const wrongData = abi.encode(['address', 'uint256'], [admin, "1"]);
                    await executionWith(null, null, null, wrongData, null);
                });

                it("fail: queueTransaction => executeTransaction with wrong eta", async function() {
                    const wrongEta = nowBN(activeDelay.add(ONE_HUNDRED));
                    await executionWith(null, null, null, null, wrongEta);
                });
            });


            describe("queueTransaction => cancelTransaction", async function() {
                beforeEach(async function() {
                    await blockchain.saveSnapshotAsync();
                });
        
                afterEach(async function() {
                    await blockchain.revertAsync();
                });

                async function subject(elapsedTime: BN, sender: string) {
                    const amount = e18(1);
                    const [txHash, target, value, signature, data, eta] = await queueTransfer(user1, amount);
    
                    expect(await timelock.queuedTransactions(txHash)).to.be.true;
                    expect(await testToken.balanceOf(user1)).to.be.bignumber.eq(ZERO);
    
                    await increaseTime(elapsedTime);
                    await timelock.cancelTransaction(target, value, signature, data, eta, {from: sender});
    
                    expect(await timelock.queuedTransactions(txHash)).to.be.false;
                    expect(await testToken.balanceOf(user1)).to.be.bignumber.eq(ZERO);
                }
                
                it("queueTransaction => early cancelTransaction", async function() {
                    await subject(activeDelay.div(TWO), admin);
                });

                it("queueTransaction => late cancelTransaction", async function() {
                    await subject(activeDelay.mul(TWO), admin);
                });

                it("fail: noAuth when cancelTransaction", async function() {
                    await expectException(
                        subject(activeDelay, user1), 
                        "Timelock::cancelTransaction: Call must come from admin."
                    );
                });
            });

            describe("change admin", async function() {
                before(async function() {
                    await blockchain.saveSnapshotAsync();
                });

                after(async function() {
                    await blockchain.revertAsync();
                });

                async function queueSetPendingAdmin(newAdmin: string, sender: string) {
                    await timelock.queueTransaction(
                        timelock.address, 
                        '0', 
                        'setPendingAdmin(address)',
                        abi.encode(['address'], [newAdmin]),
                        nowBN(activeDelay),
                        { from: sender } 
                    );
    
                    let blockNum = await getLatestBlockNumber();
                    let logs = await getContractLogs(timelock, ["QueueTransaction"], blockNum);
    
                    expect(logs[0].event).to.be.eq('QueueTransaction');
                    const txHash = logs[0].args['txHash'];
                    const target = logs[0].args['target'];
                    const value = logs[0].args['value'];
                    const signature = logs[0].args['signature'];
                    const data = logs[0].args['data'];
                    const eta = logs[0].args['eta'];
    
                    return [txHash, target, value, signature, data, eta];
                }

                async function setPendingAdmin(newAdmin: string, sender: string) {
                    const [txHash, target, value, signature, data, eta] = await queueSetPendingAdmin(newAdmin, sender);
                    expect(await timelock.queuedTransactions(txHash)).to.be.true;
    
                    await increaseTime(activeDelay);

                    await timelock.executeTransaction(target, value, signature, data, eta, {from: sender});
                    expect(await timelock.queuedTransactions(txHash)).to.be.false;
                }

                it("change admin", async function() {
                    await setPendingAdmin(user1, admin);

                    await expectException(
                        timelock.acceptAdmin({from: user2}),
                        "Timelock::acceptAdmin: Call must come from pendingAdmin."
                    );
                    await timelock.acceptAdmin({from: user1});

                    await expectException(
                        setPendingAdmin(admin, admin),
                        "Timelock::queueTransaction: Call must come from admin."
                    );
                    await setPendingAdmin(admin, user1);
                    await timelock.acceptAdmin({from: admin});
                });
           });
        });

        describe("minter", async function() {
            beforeEach(async function() {
                await blockchain.saveSnapshotAsync();
            });
    
            afterEach(async function() {
                await blockchain.revertAsync();
            });

            const mintAmount = new BN(10000);
            it("mint", async function() {
                expect(await bull.minter()).to.be.eq(admin);
                expect(await bull.balanceOf(user1)).to.be.bignumber.eq(ZERO);
                await bull.mint(user1, mintAmount, {from: admin});
                expect(await bull.balanceOf(user1)).to.be.bignumber.eq(mintAmount);
            });

            it("setMinter", async function() {
                await bull.setMinter(timelock.address, {from: admin});
                
                let logs = await getContractLogs(bull, ["MinterChanged"], await getLatestBlockNumber());
                expect(logs[0].args['newMinter']).to.be.eq(timelock.address);

                expect(await bull.minter()).to.be.eq(timelock.address);

                await expectException(
                    bull.mint(user1, mintAmount, {from: admin}),
                    "Bull::mint: only the minter can mint"
                );

                await expectException(
                    bull.setMinter(user1, {from: admin}),
                    "Bull::setMinter: only the minter can change the minter address"
                );
            });

            describe("timelocked mint", async function() {
                before(async function() {
                    await bull.setMinter(timelock.address, {from: admin});
                });

                async function queueMint(dst: string, amount: BN) : Promise<[string, string, string, string, string, string]> {
                    await timelock.queueTransaction(
                        bull.address, 
                        '0', 
                        'mint(address,uint256)',
                        abi.encode(['address', 'uint256'], [dst, amount.toString()]),
                        nowBN(activeDelay),
                        { from: admin } 
                    );
    
                    let blockNum = await getLatestBlockNumber();
                    let logs = await getContractLogs(timelock, ["QueueTransaction"], blockNum);
    
                    expect(logs[0].event).to.be.eq('QueueTransaction');
                    const txHash = logs[0].args['txHash'];
                    const target = logs[0].args['target'];
                    const value = logs[0].args['value'];
                    const signature = logs[0].args['signature'];
                    const data = logs[0].args['data'];
                    const eta = logs[0].args['eta'];
    
                    return [txHash, target, value, signature, data, eta];
                }

                async function mint(dst: string, amount: BN) {
                    const [txHash, target, value, signature, data, eta] = await queueMint(dst, amount);
                    expect(await timelock.queuedTransactions(txHash)).to.be.true;
    
                    await increaseTime(activeDelay);

                    await timelock.executeTransaction(target, value, signature, data, eta, {from: admin});
                    expect(await timelock.queuedTransactions(txHash)).to.be.false;
                }

                it("mint by timelock", async function() {
                    expect(await bull.minter()).to.be.eq(timelock.address);
                    expect(await bull.balanceOf(user1)).to.be.bignumber.eq(ZERO);
                    await mint(user1, mintAmount);
                    expect(await bull.balanceOf(user1)).to.be.bignumber.eq(mintAmount);
                });
            });
        });
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

            let blockNum = new BN(await getLatestBlockNumber());
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
                expectException(delegateBySig(), "Bull::delegateBySig: invalid nonce");
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
                expectException(delegateBySig(), "Bull::delegateBySig: signature expired");
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

            describe("mint", async function() {
                const amount = e18(10);
                it("mint to undelegated", async function() {
                    await bull.mint(holder, amount, {from: admin});
                    const v = await bull.getCurrentVotes(holder);

                    expect(v).to.be.bignumber.eq(ZERO);
                });

                it("mint to delegated", async function() {
                    await bull.delegate(holder, {from: holder});
                    const v1 = await bull.getCurrentVotes(holder);

                    await bull.mint(holder, amount, {from: admin});
                    const v2 = await bull.getCurrentVotes(holder);

                    expect(v2.sub(v1)).to.be.bignumber.eq(amount);
                });
            });

            describe("self delegate", async function() {
                const amount = TEN;
                it("after delegate", async function() {
                    expect(await bull.delegates(holder)).to.be.eq(ZERO_ADDRESS);
                    await bull.delegate(holder, {from: holder});
                    expect(await bull.delegates(holder)).to.be.eq(holder);
    
                    let blockNum = new BN(await getLatestBlockNumber());
                    expect(await bull.getCurrentVotes(holder)).to.be.bignumber.eq(holderBalance);
                    expect(await bull.getPriorVotes(holder, blockNum.sub(ONE))).to.be.bignumber.eq(ZERO);
    
                    await blockchain.mineBlockAsync();
                    
                    blockNum = new BN(await getLatestBlockNumber());
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
    
                    let blockNum = new BN(await getLatestBlockNumber());
                    expect(await bull.getCurrentVotes(holder)).to.be.bignumber.eq(ZERO);
                    expect(await bull.getCurrentVotes(user3)).to.be.bignumber.eq(holderBalance);
                    expect(await bull.getPriorVotes(holder, blockNum.sub(ONE))).to.be.bignumber.eq(ZERO);
                    expect(await bull.getPriorVotes(user3, blockNum.sub(ONE))).to.be.bignumber.eq(ZERO);
    
                    await blockchain.mineBlockAsync();
                    
                    blockNum = new BN(await getLatestBlockNumber());
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
            let user1InitialBull = e18(100);

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

            it('should NOT transfer to ZERO address', async function() {
                await expectException(
                    bull.transfer(ZERO_ADDRESS, ONE, {from: user1}),
                    "Bull::_transferTokens: cannot transfer to the zero address"
                );
            });

            it ('should NOT transfer token more than balance', async function() {
                await expectException(
                    bull.transfer(user2, user1InitialBull.add(ONE), {from: user1}),
                    "Bull::_transferTokens: transfer amount exceeds balance"
                );

                await expectException(
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

                await expectException(
                    bull.transferFrom(user1, user2, TWO, {from: admin}),
                    "Bull::transferFrom: transfer amount exceeds spender allowance"
                );

                await expectException(
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
                await expectException(
                    bull.approve(admin, constants.MAX_UINT256.sub(ONE), {from: user1}),
                    "Bull::approve: amount exceeds 96 bits"
                );
            });
        });
    });
});
