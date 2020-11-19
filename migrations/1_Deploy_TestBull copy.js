// const { Test } = require("mocha");

// const Controller = artifacts.require("Controller");
// const BVault = artifacts.require("BVault");
// const StrategyDForceDAI = artifacts.require("StrategyDForceDAI");

const RewardPool = artifacts.require("RewardPool");
const TestBull = artifacts.require("TestBull");
const BigNumber = require('bignumber.js');

const addresses = { major:
  { admin: "0x3F70DF1cE9bD813D4Df1036E8a5B4dc8c403757e",
   strategist: "0x3F70DF1cE9bD813D4Df1036E8a5B4dc8c403757e",
   rewarder: "0x8e1EFf81eFeED97D7966ae4155F5FAfD9CDA648f",
   governance: "0x3F70DF1cE9bD813D4Df1036E8a5B4dc8c403757e" },
 controller: "0x711dCE50E9fC484e19883d8632FC8970cd6DD3E8",
 dai: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
 usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
 usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
 vault:
  { dai: "0x453b218FDD50FE28350F38D4F77272aC815D5F0d",
   usdt: "0x217dFe7d296611baCB57b95377316aab09FdF1B3",
   usdc: "0xC8327426290ab64C4C47ad35a7674B64657B7160" },
 strategy:
  { dai: "0x1f6ca2BB589bFBA3Eb1672E9d87AF56ed8bb0611",
   usdt: "0xE51DaC42A99D2923FcD877F9D2B465226Ec8a4dD",
   usdc: "0x1719aBCb599D9d0330eb563017A6513461A9862C" },
test:
  {
    testBull: "0xcAAe400881906384F4DDCBf13Ff8A06C5Df402f9",
    balancerBPT: "0x1bbAf53Bab7893345b65976e8F67d64F7d3E3a33",
    bptRP: "0x001e0400fb6f54a27e41aff8e44a21e170af9151",
    bDaiRP: "0x948e4034ed425e629296c28eee3000ab6acf5ad6"
  }
};

function e18(n) {
  return (new BigNumber(n)).multipliedBy(new BigNumber("1000000000000000000"));
}

function fromE18(n) {
  return (new BigNumber(n)).dividedBy(new BigNumber("1000000000000000000"));
}

module.exports = async function (deployer, networks, accounts) {
    admin = accounts[4];
    let rewardDistribution = admin;

    let testBull = await TestBull.at(addresses.test.testBull);

    let aWeek = (60*60*24*7);

    console.log("let bptRP = await RewardPool.new(");
    let bptRP = await RewardPool.new(
      addresses.test.testBull,    // _rewardToken
      addresses.test.balancerBPT, // _lpToken
      aWeek,  // _duration
      admin,  // _rewardDistribution
      {from: admin}
    );

    console.log("let bDaiRP = await RewardPool.new(");
    let bDaiRP = await RewardPool.new(
      addresses.test.testBull,    // _rewardToken
      addresses.vault.dai, // _lpToken
      aWeek,  // _duration
      admin,  // _rewardDistribution
      {from: admin}
    );

    let bptRpRewardAmount = e18(5000);
    let bDaiRpRewardAmount = e18(1000);

    console.log("testBull.transfer(bptRP, bptRpRewardAmount, {from: rewardDistribution});");
    await testBull.transfer(bptRP.address, bptRpRewardAmount, {from: rewardDistribution});
    console.log("bptRP.notifyRewardAmount(bptRpRewardAmount, {from: rewardDistribution});");
    await bptRP.notifyRewardAmount(bptRpRewardAmount, {from: rewardDistribution});

    console.log("testBull.transfer(bDaiRP, bDaiRpRewardAmount, {from: rewardDistribution});");
    await testBull.transfer(bDaiRP.address, bDaiRpRewardAmount, {from: rewardDistribution});
    console.log("bDaiRP.notifyRewardAmount(bDaiRpRewardAmount, {from: rewardDistribution});");
    await bDaiRP.notifyRewardAmount(bDaiRpRewardAmount, {from: rewardDistribution});

    console.log(bptRP.address);
    console.log(bDaiRP.address);

    console.log(await testBull.balanceOf(bptRP.address));
    console.log(await testBull.balanceOf(bDaiRP.address));
};



