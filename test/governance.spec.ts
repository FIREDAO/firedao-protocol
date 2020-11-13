require('module-alias/register');
require('openzeppelin-test-helpers/configure')({ environment: 'web3', provider: 'http://localhost:8545' });

import { contract, web3 } from '@openzeppelin/test-environment'; 
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

const [deployer, admin, guardian, rewardDistribution, holder, user1, user2] = ganacheAccounts;
const [deployerPw, adminPw, guardianPw, rewardDistributionPw, holderPw, user1Pw, user2Pw] = ganachePasswords;
const { BN } = require('@openzeppelin/test-helpers');

describe('Governance', function () {
    let rp: TestRewardPoolInstance;

    let lpToken: TestTokenInstance;
    let bull: BullInstance;

    let timelock: TimelockInstance;
    let governorAlpha: GovernorAlphaInstance;

    const bullTotalSupply = e18(1000000);

    const lpBalance = e18(1000);

    const duration = new BN(7*24*60*60); // 7 days

    const timelockDelay = new BN(3*24*60*60); // 3 days

    before(async function() {
        lpToken = await TestToken.new("LP test token", "LPT", 18, {from: deployer});
        // bull = await Bull.new(holder, {from: deployer});

        // timelock = await Timelock.new(admin, timelockDelay, {from: deployer});
        // governorAlpha = await GovernorAlpha.new(timelock.address, bull.address, guardian, {from: deployer});

        // rp = await RewardPool.new(
        //     bull.address,
        //     lpToken.address,
        //     duration,
        //     rewardDistribution,
        //     { from: deployer }
        // );
        // await bull.approve(rp.address, constants.MAX_UINT256, {from: admin});
        // await bull.approve(rp.address, constants.MAX_UINT256, {from: rewardDistribution});
    });

    it("temp", async function() {
        console.log(deployer);
        console.log(lpToken.address);
        // console.log(rp.address);
    });
});
