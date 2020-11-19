// const { Test } = require("mocha");

// const Controller = artifacts.require("Controller");
// const BVault = artifacts.require("BVault");
// const StrategyDForceDAI = artifacts.require("StrategyDForceDAI");

// const RewardPool = artifacts.require("RewardPool");
const TestBull = artifacts.require("TestBull");

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
    testBull: "0xcAAe400881906384F4DDCBf13Ff8A06C5Df402f9"
  }
};


module.exports = async function (deployer, networks, accounts) {
    admin = accounts[4];

    console.log("Deploy TestBull");
    let testBull = await TestBull.new(admin, {from: admin});
    console.log(testBull);

    // controller = await Controller.at(addresses.controller);
    // daiVault = await BVault.at(addresses.vault.dai);
    
    // daiStrategy = await StrategyDForceDAI.new(addresses.controller, {from: admin});
    // daiStrategy = await StrategyDForceDAI.at(addresses.strategy.dai);

    // await controller.approveStrategy(addresses.dai, daiStrategy.address, {from: admin});
    // await controller.setStrategy(addresses.dai, daiStrategy.address, {from: admin});
};



