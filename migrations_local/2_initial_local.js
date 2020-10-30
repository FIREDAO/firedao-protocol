// const { Test } = require("mocha");

const Controller = artifacts.require("Controller");
const BVault = artifacts.require("BVault");
const CurveYCRVVoter = artifacts.require("CurveYCRVVoter");
const StrategyCurveYVoterProxy = artifacts.require("StrategyCurveYVoterProxy");
const StrategyProxy = artifacts.require("StrategyProxy");
const StrategyDForceUSDC = artifacts.require("StrategyDForceUSDC");
const StrategyDForceUSDT = artifacts.require("StrategyDForceUSDT");
const StrategyTUSDCurve = artifacts.require("StrategyTUSDCurve");
const StrategyDAICurve = artifacts.require("StrategyDAICurve");
const TestToken = artifacts.require("TestToken");

let daiAddress;
let tusdAddress;
let usdcAddress;
let usdtAddress;
let yCrvAddress;

let daiVault;
let tusdVault;
let usdcVault;
let usdtVault;
let yCrvVault;

let daiStrategy;
let tusdStrategy;
let usdcStrategy;
let usdtStrategy;
let voterStrategy;
let strategyProxy;
let voterProxyStrategy;

let controller;

let admin;
let strategist;
let rewarder;
let governance;

async function setVaultStrategy(tokenAddress, vaultAddress, strategyAddress, controller) {
    await controller.setVault(tokenAddress, vaultAddress, {from: admin});
    await controller.approveStrategy(tokenAddress, strategyAddress, {from: admin});
    await controller.setStrategy(tokenAddress, strategyAddress, {from: admin});
}

/*
    "dai": {
        "name": "Dai Stablecoin", "symbol": "DAI", "decimals": 18
    },
    "tusd": {
        "name": "TrueUSD", "symbol": "TUSD", "decimals": 6
    },
    "usdt": {
        "name": "Tether USD", "symbol": "USDT", "decimals": 6
    },
    "usdc": {
        "name": "USD Coin", "symbol": "USDC", "decimals": 6
    },
    "ycrv": {
        "name": "Curve.fi yDAI/yUSDC/yUSDT/yTUSD", "symbol": "yDAI+yUSDC+yUSDT+yTUSD", "decimals": 18
    },
*/

/*
local migration:   truffle migrate --network development
testnet migration: 


*/
module.exports = async function (deployer, networks, accounts) {
    admin = accounts[0];
    strategist = accounts[1];
    rewarder = accounts[2];
    governance = accounts[3];

    /* only for test  >>>>>>>>>>>> */
    const dai = await TestToken.new("Dai Stablecoin", "DAI", 18, { from: admin });
    const tusd = await TestToken.new("TrueUSD", "TUSD", 18, { from: admin });
    const usdc = await TestToken.new("USD Coin", "USDC", 6, { from: admin });
    const usdt = await TestToken.new("Tether USD", "USDT", 6, { from: admin });
    const yCrv = await TestToken.new("Curve.fi yDAI/yUSDC/yUSDT/yTUSD", "yDAI+yUSDC+yUSDT+yTUSD", 18, { from: admin });
    /* <<<<<<<<<<<< only for test */

    daiAddress = dai.address;
    tusdAddress = tusd.address;
    usdcAddress = usdc.address;
    usdtAddress = usdt.address;
    yCrvAddress = yCrv.address;

    controller = await Controller.new(rewarder, {from: admin});
    // governance : admin
    // strategist: admin
    // onesplit
    //     1split.eth        : 0xC586BeF4a0992C495Cf22e1aeEE4E446CECDee0E
    //     1proto.eth (beta) : 0x50FDA034C0Ce7a8f7EFDAebDA7Aa7cA21CC1267e <= default
    //   onesplit은 둘다 사용되지 않기를 권장한다. 일단 onesplit이 잘 사용되지 않기 때문에, 일단은 그냥 두고, 나중에 필요하면, 
    //   onesplit을 wrapper를 사용한 다른 버전으로 만들고 교체할 수 있다.
    // rewards: admin
    // controller의 converter는 strategy.want와 vault token 이 다른 경우에 사용되는데,
    // 현재의 예제에서는 필요하지 않다.
    await controller.setStrategist(strategist, {from: admin});
    // strategist have auth for: setVault, setConverter, setStrategy, withdrawAll, 
    //                           inCaseTokensGetStuck, inCaseStrategyTokenGetStuck, yearn

    daiVault = await BVault.new(daiAddress, controller.address, {from: admin});
    tusdVault = await BVault.new(tusdAddress, controller.address, {from: admin});
    usdcVault = await BVault.new(usdcAddress, controller.address, {from: admin});
    usdtVault = await BVault.new(usdtAddress, controller.address, {from: admin});
    yCrvVault = await BVault.new(yCrvAddress, controller.address, {from: admin});

    daiStrategy = await StrategyDAICurve.new(controller.address, yCrvVault.address, {from: admin});
    // no strategist
    // controller have auth for: withdraw, withdrawAll, 
    tusdStrategy = await StrategyTUSDCurve.new(controller.address, yCrvVault.address, {from: admin});
    // no strategist
    // controller have auth for: withdraw, withdrawAll, 
    usdcStrategy = await StrategyDForceUSDC.new(controller.address, {from: admin});
    await usdcStrategy.setStrategist(strategist, {from: admin});
    // strategist have auth for: harvest
    // controller have auth for: withdraw, withdrawAll, 
    usdtStrategy = await StrategyDForceUSDT.new(controller.address, {from: admin});
    await usdtStrategy.setStrategist(strategist, {from: admin});
    // strategist have auth for: harvest
    // controller have auth for: withdraw, withdrawAll, 
    
    voterStrategy = await CurveYCRVVoter.new({from: admin});
    strategyProxy = await StrategyProxy.new(voterStrategy.address, {from: admin});
    voterProxyStrategy = await StrategyCurveYVoterProxy.new(controller.address, {from: admin});

    await voterStrategy.setStrategy(strategyProxy.address, {from: admin});
    await strategyProxy.approveStrategy(voterProxyStrategy.address, {from: admin});
    await voterProxyStrategy.setProxy(strategyProxy.address, {from: admin});
    await voterProxyStrategy.setStrategist(strategist, {from: admin});
    // strategist have auth for: harvest
    // controller have auth for: withdraw, withdrawAll, 

    await setVaultStrategy(daiAddress, daiVault.address, daiStrategy.address, controller);
    await setVaultStrategy(tusdAddress, tusdVault.address, tusdStrategy.address, controller);
    await setVaultStrategy(usdcAddress, usdcVault.address, usdcStrategy.address, controller);
    await setVaultStrategy(usdtAddress, usdtVault.address, usdtStrategy.address, controller);
    await setVaultStrategy(yCrvAddress, yCrvVault.address, voterProxyStrategy.address, controller);

    // change governance after deployed all
    await daiVault.setGovernance(governance, {from: admin});
    await tusdVault.setGovernance(governance, {from: admin});
    await usdcVault.setGovernance(governance, {from: admin});
    await usdtVault.setGovernance(governance, {from: admin});
    await yCrvVault.setGovernance(governance, {from: admin});

    await daiStrategy.setGovernance(governance, {from: admin});
    await tusdStrategy.setGovernance(governance, {from: admin});
    await usdcStrategy.setGovernance(governance, {from: admin});
    await usdtStrategy.setGovernance(governance, {from: admin});
    await voterStrategy.setGovernance(governance, {from: admin});
    await strategyProxy.setGovernance(governance, {from: admin});
    await voterProxyStrategy.setGovernance(governance, {from: admin});

    await controller.setGovernance(governance, {from: admin});

    console.log("controller", controller.address);
    console.log("dai", dai.address);
    console.log("tusd", tusd.address);
    console.log("usdt", usdt.address);
    console.log("usdc", usdc.address);
    console.log("yCrv", yCrv.address);

    /*
    deploy 전략: 
        1. local에 먼저, 해본다. 
        2. local에서 테스트 해본다. (여러가지 view 체킹.. 제대로 deploy되었는지를 점검, 기본 operation 테스트)
        3. testnet에 deploy 한다. ()
        4. testnet에서 테스트 해본다. ()
    */
};



