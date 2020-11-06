const BigNumber = require('bignumber.js');

const { projectIdMainnet, mnemonicMainnet } = require('../secrets-mainnet.json');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const Web3 = require("web3");

const provider = new HDWalletProvider(
    mnemonicMainnet, 
    new Web3.providers.WebsocketProvider(`wss://mainnet.infura.io/ws/v3/${projectIdMainnet}`)
);
const web3 = new Web3(provider); 

const Controller = require('../build/contracts/Controller.json');
const CurveYCRVVoter = require('../build/contracts/CurveYCRVVoter.json');
const StrategyCurveYVoterProxy = require('../build/contracts/StrategyCurveYVoterProxy.json');
const StrategyProxy = require('../build/contracts/StrategyProxy.json');
const StrategyDForceUSDC = require('../build/contracts/StrategyDForceUSDC.json');
const StrategyDForceUSDT = require('../build/contracts/StrategyDForceUSDT.json');
const StrategyTUSDCurve = require('../build/contracts/StrategyTUSDCurve.json');
const StrategyDAICurve = require('../build/contracts/StrategyDAICurve.json');
const StrategyDForceDAI = require('../build/contracts/StrategyDForceDAI.json');
const ERC20 = require("../build/contracts/TestToken.json");
const BVault = require('../build/contracts/BVault.json');

const addresses = { major:
    { admin: '0x3F70DF1cE9bD813D4Df1036E8a5B4dc8c403757e',
      strategist: '0x3F70DF1cE9bD813D4Df1036E8a5B4dc8c403757e',
      rewarder: '0x3F70DF1cE9bD813D4Df1036E8a5B4dc8c403757e',
      governance: '0x3F70DF1cE9bD813D4Df1036E8a5B4dc8c403757e' },
   controller: '0x711dCE50E9fC484e19883d8632FC8970cd6DD3E8',
   dai: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
   tusd: '0x0000000000085d4780B73119b644AE5ecd22b376',
   usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
   usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
   ycrv: '0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8',
   vault:
    { dai: '0x453b218FDD50FE28350F38D4F77272aC815D5F0d',
      tusd: '0xD23B6992e23f8a36bCEc4Ce6cc54Be8c3a3f9498',
      usdt: '0x217dFe7d296611baCB57b95377316aab09FdF1B3',
      usdc: '0xC8327426290ab64C4C47ad35a7674B64657B7160',
      ycrv: '0x06dAC9B22ef8D44B23941d81D456887865582226' },
   strategy:
    { dep_dai: '0xc8323D3115453B4EfcaF5E744FC6c75cd07E43c0',
      dai: '0x1f6ca2bb589bfba3eb1672e9d87af56ed8bb0611',
      tusd: '0x72c9e560fecD8186DACB252fbD14729c14E366Fd',
      usdt: '0xE51DaC42A99D2923FcD877F9D2B465226Ec8a4dD',
      usdc: '0x1719aBCb599D9d0330eb563017A6513461A9862C',
      ycrv: '0xdB5f25bF9e8A4CB020460bC870298Aa6811e2bF2',
      proxy: '0x37F668fbF575194A37e023AFb761F44Ef8b1C119',
      voter: '0xEF54151BE4641239F89265083f4C6551A474a1E8' } }

const controller = new web3.eth.Contract(Controller.abi, addresses.controller);

const dai = new web3.eth.Contract(ERC20.abi, addresses.dai);
const tusd = new web3.eth.Contract(ERC20.abi, addresses.tusd);
const usdt = new web3.eth.Contract(ERC20.abi, addresses.usdt);
const usdc = new web3.eth.Contract(ERC20.abi, addresses.usdc);
const ycrv = new web3.eth.Contract(ERC20.abi, addresses.ycrv);

const daiVault = new web3.eth.Contract(BVault.abi, addresses.vault.dai);
const tusdVault = new web3.eth.Contract(BVault.abi, addresses.vault.tusd);
const usdtVault = new web3.eth.Contract(BVault.abi, addresses.vault.usdt);
const usdcVault = new web3.eth.Contract(BVault.abi, addresses.vault.usdc);
const ycrvVault = new web3.eth.Contract(BVault.abi, addresses.vault.ycrv);

const daiStrategy = new web3.eth.Contract(StrategyDForceDAI.abi, addresses.strategy.dai);
const tusdStrategy = new web3.eth.Contract(StrategyTUSDCurve.abi, addresses.strategy.tusd);
const usdtStrategy = new web3.eth.Contract(StrategyDForceUSDT.abi, addresses.strategy.usdt);
const usdcStrategy = new web3.eth.Contract(StrategyDForceUSDC.abi, addresses.strategy.usdc);
const ycrvStrategy = new web3.eth.Contract(StrategyCurveYVoterProxy.abi, addresses.strategy.ycrv);
const proxyStrategy = new web3.eth.Contract(StrategyProxy.abi, addresses.strategy.proxy);
const voterStrategy = new web3.eth.Contract(CurveYCRVVoter.abi, addresses.strategy.voter);

const tester = "0xDCE3E52e38b7f0819da554D159aA38FDD2a38eAd";
const admin = "0x3F70DF1cE9bD813D4Df1036E8a5B4dc8c403757e";
const rewarder = "0x8e1EFf81eFeED97D7966ae4155F5FAfD9CDA648f";

const LARGE = "115792089237316195423570985008687907853269984665640564039458"

async function approveCheck(u) {
    console.log(await dai.methods.allowance(u, addresses.vault.dai).call());
    console.log(await tusd.methods.allowance(u, addresses.vault.tusd).call());
    console.log(await usdt.methods.allowance(u, addresses.vault.usdt).call());
    console.log(await usdc.methods.allowance(u, addresses.vault.usdc).call());
    console.log(await ycrv.methods.allowance(u, addresses.vault.ycrv).call());
}

function now() {
    return (new Date(Date.now())).toString();
}

async function balanceCheck() {
    console.log("--------- balanceCheck ----------", now());
    console.log("--- admin ---");
    let b = await dai.methods.balanceOf(admin).call();
    if (b > 0) console.log("dai  ", fromDai(b));
    b = await tusd.methods.balanceOf(admin).call();
    if (b > 0) console.log("tusd ", fromTUSD(b));
    b = await usdt.methods.balanceOf(admin).call();
    if (b > 0) console.log("usdt ", fromUSDT(b));
    b = await usdc.methods.balanceOf(admin).call();
    if (b > 0) console.log("usdc ", fromUSDC(b));
    b = await ycrv.methods.balanceOf(admin).call();
    if (b > 0) console.log("ycrv ", fromYCRV(b));

    console.log("--- admin Vault ---");
    b = await daiVault.methods.balanceOf(admin).call();
    if (b > 0) console.log("bDai ", fromDai(b));
    b = await tusdVault.methods.balanceOf(admin).call();
    if (b > 0) console.log("bTUSD", fromTUSD(b));
    b = await usdtVault.methods.balanceOf(admin).call();
    if (b > 0) console.log("bUSDT", fromUSDT(b));
    b = await usdcVault.methods.balanceOf(admin).call();
    if (b > 0) console.log("bUSDC", fromUSDC(b));
    b = await ycrvVault.methods.balanceOf(admin).call();
    if (b > 0) console.log("bYCRV", fromYCRV(b));

    console.log("--- rewarder ---");
    b = await dai.methods.balanceOf(rewarder).call();
    if (b > 0) console.log("dai  ", fromDai(b));
    b = await tusd.methods.balanceOf(rewarder).call();
    if (b > 0) console.log("tusd ", fromTUSD(b));
    b = await usdt.methods.balanceOf(rewarder).call();
    if (b > 0) console.log("usdt ", fromUSDT(b));
    b = await usdc.methods.balanceOf(rewarder).call();
    if (b > 0) console.log("usdc ", fromUSDC(b));
    b = await ycrv.methods.balanceOf(rewarder).call();
    if (b > 0) console.log("ycrv ", fromYCRV(b));

    console.log("--- rewarder Vault ---");
    b = await daiVault.methods.balanceOf(rewarder).call();
    if (b > 0) console.log("bDai ", fromDai(b));
    b = await tusdVault.methods.balanceOf(rewarder).call();
    if (b > 0) console.log("bTUSD", fromTUSD(b));
    b = await usdtVault.methods.balanceOf(rewarder).call();
    if (b > 0) console.log("bUSDT", fromUSDT(b));
    b = await usdcVault.methods.balanceOf(rewarder).call();
    if (b > 0) console.log("bUSDC", fromUSDC(b));
    b = await ycrvVault.methods.balanceOf(rewarder).call();
    if (b > 0) console.log("bYCRV", fromYCRV(b));


    console.log("--- tester ---");
    b = await dai.methods.balanceOf(tester).call();
    console.log("dai  ", fromDai(b));
    b = await tusd.methods.balanceOf(tester).call();
    console.log("tusd ", fromTUSD(b));
    b = await usdt.methods.balanceOf(tester).call();
    console.log("usdt ", fromUSDT(b));
    b = await usdc.methods.balanceOf(tester).call();
    console.log("usdc ", fromUSDC(b));
    b = await ycrv.methods.balanceOf(tester).call();
    console.log("ycrv ", fromYCRV(b));

    console.log("--- tester Vault ---");
    b = await daiVault.methods.balanceOf(tester).call();
    console.log("bDai ", fromDai(b));
    b = await tusdVault.methods.balanceOf(tester).call();
    console.log("bTUSD", fromTUSD(b));
    b = await usdtVault.methods.balanceOf(tester).call();
    console.log("bUSDT", fromUSDT(b));
    b = await usdcVault.methods.balanceOf(tester).call();
    console.log("bUSDC", fromUSDC(b));
    b = await ycrvVault.methods.balanceOf(tester).call();
    console.log("bYCRV", fromYCRV(b));
}

async function totalEarned() {
    console.log("--------- totalEarned ----------", now());
    // let b = await dai.methods.totalSupply().call();
    // console.log("dai  totalSupply ", fromDai(b));
    // b = await tusd.methods.totalSupply().call();
    // console.log("tusd totalSupply ", fromTUSD(b));
    // b = await usdt.methods.totalSupply().call();
    // console.log("usdt totalSupply ", fromUSDT(b));
    // b = await usdc.methods.totalSupply().call();
    // console.log("usdc totalSupply ", fromUSDC(b));
    // b = await ycrv.methods.totalSupply().call();
    // console.log("ycrv totalSupply ", fromYCRV(b));

    console.log("bDai totalSupply ", fromDai(await daiVault.methods.totalSupply().call()));
    console.log("bDai balance     ", fromDai(await daiVault.methods.balance().call()));
    console.log("bTUSD totalSupply", fromTUSD(await tusdVault.methods.totalSupply().call()));
    console.log("bTUSD balance    ", fromTUSD(await tusdVault.methods.balance().call()));
    console.log("bUSDT totalSupply", fromUSDT(await usdtVault.methods.totalSupply().call()));
    console.log("bUSDT balance    ", fromUSDT(await usdtVault.methods.balance().call()));
    console.log("bUSDC totalSupply", fromUSDC(await usdcVault.methods.totalSupply().call()));
    console.log("bUSDC balance    ", fromUSDC(await usdcVault.methods.balance().call()));
    console.log("bYCRV totalSupply", fromYCRV(await ycrvVault.methods.totalSupply().call()));
    console.log("bYCRV balance    ", fromYCRV(await ycrvVault.methods.balance().call()));
}


async function approveToVaults(u) { 
    await dai.methods.approve(addresses.vault.dai, LARGE).send({from: u});
    console.log(await dai.methods.allowance(u, addresses.vault.dai).call());
    await tusd.methods.approve(addresses.vault.tusd, LARGE).send({from: u});
    console.log(await tusd.methods.allowance(u, addresses.vault.tusd).call());
    await usdt.methods.approve(addresses.vault.usdt, LARGE).send({from: u});
    console.log(await usdt.methods.allowance(u, addresses.vault.usdt).call());
    await usdc.methods.approve(addresses.vault.usdc, LARGE).send({from: u});
    console.log(await usdc.methods.allowance(u, addresses.vault.usdc).call());
    await ycrv.methods.approve(addresses.vault.ycrv, LARGE).send({from: u});
    console.log(await ycrv.methods.allowance(u, addresses.vault.ycrv).call());
}

function e18(n) {
    return (new BigNumber(n)).multipliedBy(new BigNumber("1000000000000000000")).toString();
}

function fromE18(n) {
    return (new BigNumber(n)).dividedBy(new BigNumber("1000000000000000000")).toString();
}

function e6(n) {
    return (new BigNumber(n)).multipliedBy(new BigNumber("1000000")).toString();
}

function fromE6(n) {
    return (new BigNumber(n)).dividedBy(new BigNumber("1000000")).toString();
}

const toYCRV = e18;
const toDai = e18;
const toTUSD = e18;
const toUSDT = e6;
const toUSDC = e6;

const fromYCRV = fromE18;
const fromDai = fromE18;
const fromTUSD = fromE18;
const fromUSDT = fromE6;
const fromUSDC = fromE6;

async function deposit(vault, balance) {
    let balanceA = await vault.methods.balanceOf(tester).call();
    await vault.methods.deposit(balance).send(txInfo(tester));
    let balanceB = await vault.methods.balanceOf(tester).call();
    return balanceB - balanceA;
}

async function strategyInfo(strategy) {
    async function dForceStrategyInfo() {
    }

    async function curveStrategyInfo() {

    }

    async function yCrvStrategyInfo() {

    }

    async function proxyStrategyInfo() {

    }

    async function voterStrategyInfo() {

    }

    if (strategy._address == addresses.strategy.dai) {
        await curveStrategyInfo();
    } else if (strategy._address == addresses.strategy.tusd) {
        await curveStrategyInfo();
    } else if (strategy._address == addresses.strategy.usdt) {
        await dForceStrategyInfo();
    } else if (strategy._address == addresses.strategy.usdc) {
        await dForceStrategyInfo();
    } else if (strategy._address == addresses.strategy.ycrv) {
        await yCrvStrategyInfo();
    } else if (strategy._address == addresses.strategy.proxy) {
        await proxyStrategyInfo();
    } else if (strategy._address == addresses.strategy.voter) {
        await voterStrategyInfo();
    } else {
        console.error("unknown strategy");
        process.exit(-1);
    }
}

async function vaultInfo(vault) {
    console.log("----------- vaultInfo ---------");
    console.log(vault._address, await vault.methods.name().call(),",", await vault.methods.symbol().call());
    // console.log("vault balanceOf:", await vault.methods.balanceOf(tester).call());
    
    // console.log("totalSupply:", await vault.methods.totalSupply().call());
    // console.log("balance:", await vault.methods.balance().call());
    console.log("vault price:", await vault.methods.getPricePerFullShare().call());
}

async function withdraw(vault, balance) {
    await vault.methods.withdraw(balance).send(txInfo(tester));
}

async function deposit2ToAll() {
    await deposit(daiVault, toDai(1));
}

async function earnAll() { // done
    // console.log("daiVault.methods.earn", await daiVault.methods.earn().send(txInfo(tester)));
    // console.log("tusdVault.methods.earn", await tusdVault.methods.earn().send(txInfo(tester)));
    // console.log("usdtVault.methods.earn", await usdtVault.methods.earn().send(txInfo(tester)));
    // console.log("usdcVault.methods.earn", await usdcVault.methods.earn().send(txInfo(tester)));
    // console.log("ycrvVault.methods.earn", await ycrvVault.methods.earn().send(txInfo(tester)));
}

async function harvestAll() {
    await usdcStrategy.methods.harvest().send(txInfo(admin));
    // await usdtStrategy.methods.harvest().send(txInfo(admin));
    // await ycrvStrategy.methods.harvest().send(txInfo(admin));
}

let gasPrice = 0;

function txInfo(acc = tester) {
    return {from: acc, gas: 2000000, gasPrice: 50e9 };
}

async function setRewards() {
    await controller.methods.setRewards(rewarder).send(txInfo(admin));
}

async function daiBalanceCheck() {
    console.log("-------- dai balance ---------");
    console.log("daiVault balance", await dai.methods.balanceOf(addresses.vault.dai).call());
    console.log("daiStrategy balance", await dai.methods.balanceOf(addresses.strategy.dai).call());
    console.log("controller balance", await dai.methods.balanceOf(addresses.controller).call());
}

async function migrationTest() {
    async function phase1() {
        await balanceCheck(); 
        await totalEarned();
        await daiBalanceCheck();

        // await controller.methods.
        await controller.methods.withdrawAll(addresses.dai).send(txInfo(admin));

        await balanceCheck(); 
        await totalEarned();
        await daiBalanceCheck();
    }

    async function phase2() {
        // daiVault.earn();        
        // balanceCheck(); totalEarned();
        // contract's DAI balance check: daiVault, daiStrategy, controller 

        await balanceCheck(); 
        await totalEarned();
        await daiBalanceCheck();

        // await controller.methods.
        await daiVault.methods.earn().send(txInfo(tester));

        await balanceCheck(); 
        await totalEarned();
        await daiBalanceCheck();
    }
    await phase2();
}

async function withdrawTest() {
    async function phase1() {
        let balance = await daiVault.methods.balanceOf(tester).call();
        await daiVault.methods.withdraw(balance).send(txInfo(tester));

        await balanceCheck(); 
        await totalEarned();
    }

    async function phase2() {
        let balance = await daiVault.methods.balanceOf(admin).call();
        await daiVault.methods.withdraw(balance).send(txInfo(admin));

        await balanceCheck(); 
        await totalEarned();
    }
    await phase2();
}

async function deployStrategy() {

    let daiStrategy2 = await StrategyDForceDAI.new(addresses.controller, {from: admin});
    console.log(daiStrategy2);
    console.log(daiStrategy2._address);
}

async function main() {
    await balanceCheck();
    await totalEarned();
    await daiBalanceCheck();

    await daiVault.methods.earn().send(txInfo(admin));

    await balanceCheck();
    await totalEarned();
    await daiBalanceCheck();

    process.exit(1);
}

main();



