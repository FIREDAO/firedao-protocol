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
    { dai: '0xc8323D3115453B4EfcaF5E744FC6c75cd07E43c0',
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

const daiStrategy = new web3.eth.Contract(StrategyDAICurve.abi, addresses.strategy.dai);
const tusdStrategy = new web3.eth.Contract(StrategyTUSDCurve.abi, addresses.strategy.tusd);
const usdtStrategy = new web3.eth.Contract(StrategyDForceUSDT.abi, addresses.strategy.usdt);
const usdcStrategy = new web3.eth.Contract(StrategyDForceUSDC.abi, addresses.strategy.usdc);
const ycrvStrategy = new web3.eth.Contract(StrategyCurveYVoterProxy.abi, addresses.strategy.ycrv);
const proxyStrategy = new web3.eth.Contract(StrategyProxy.abi, addresses.strategy.proxy);
const voterStrategy = new web3.eth.Contract(CurveYCRVVoter.abi, addresses.strategy.voter);

const tester = "0xDCE3E52e38b7f0819da554D159aA38FDD2a38eAd";
const LARGE = "115792089237316195423570985008687907853269984665640564039458"

async function approveToVaults() {
    // await dai.methods.approve(addresses.vault.dai, LARGE).send({from: tester});
    // console.log(await dai.methods.allowance(tester, addresses.vault.dai).call());
    await tusd.methods.approve(addresses.vault.tusd, LARGE).send({from: tester});
    console.log(await tusd.methods.allowance(tester, addresses.vault.tusd).call());
    await usdt.methods.approve(addresses.vault.usdt, LARGE).send({from: tester});
    console.log(await usdt.methods.allowance(tester, addresses.vault.usdt).call());
    await usdc.methods.approve(addresses.vault.usdc, LARGE).send({from: tester});
    console.log(await usdc.methods.allowance(tester, addresses.vault.usdc).call());
    await ycrv.methods.approve(addresses.vault.ycrv, LARGE).send({from: tester});
    console.log(await ycrv.methods.allowance(tester, addresses.vault.ycrv).call());
}

function e18(n) {
    return n * "1000000000000000000";
}

function e6(n) {
    return n * "1000000";
}

async function deposit(vault, balance) {
    let balanceA = await vault.methods.balanceOf(tester).call();
    await vault.methods.deposit(balance).send({from: tester});

    let balanceB = await vault.methods.balanceOf(tester).call();
    console.log("vault balanceOf:", balanceB);
    console.log("vault totalSupply:", await vault.methods.totalSupply().call());
    console.log("vault balance:", await vault.methods.balance().call());
    console.log("vault price:", await vault.methods.getPricePerFullShare().call());
    return balanceB - balanceA;
}

async function withdraw(vault, balance) {
    await vault.methods.withdraw(balance).send({from: tester});

    console.log("vault balanceOf:", await vault.methods.balanceOf(tester).call());
    console.log("vault totalSupply:", await vault.methods.totalSupply().call());
    console.log("vault balance:", await vault.methods.balance().call());
    console.log("vault price:", await vault.methods.getPricePerFullShare().call());
}


async function main() {
    // console.log(web3.eth.Contract);
    // const controller = new web3.eth.Contract(Controller.abi, addresses.controller);

    // await approveToVaults();
    let b = await deposit(daiVault, e18(1));
    console.log("deposit success", b);
    await withdraw(daiVault, b);
    console.log("withdraw success", b);
    console.log("done");
}

main();

