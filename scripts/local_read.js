const Web3 = require("web3");
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));  

const Controller = require('../build/contracts/Controller.json');
const CurveYCRVVoter = require('../build/contracts/CurveYCRVVoter.json');
const StrategyCurveYVoterProxy = require('../build/contracts/StrategyCurveYVoterProxy.json');
const StrategyProxy = require('../build/contracts/StrategyProxy.json');
const StrategyDForceUSDC = require('../build/contracts/StrategyDForceUSDC.json');
const StrategyDForceUSDT = require('../build/contracts/StrategyDForceUSDT.json');
const StrategyTUSDCurve = require('../build/contracts/StrategyTUSDCurve.json');
const StrategyDAICurve = require('../build/contracts/StrategyDAICurve.json');
const BVault = require('../build/contracts/BVault.json');

const addresses = {
    "major": {
        "admin": "0x2FeD7973a46cf3109348300d7Aa856c07C973831",
        "strategist": "0xBA39Eb1F07C4bF3999dbe2e429cd6223eB38058e",
        "rewarder": "0x396d9dAa596A43814267a137Cc21ef05aC4300E7",
        "governance": "0x69db69785018B1b6cDA22bCDD4DcCe7E2bFb64Cd"
    },
    "controller": "0x3425a8aFE4925E5d828f2E7C2ACCE9786dBaAcBa",
    "dai": "0xeCd92AFca542Bbfbe2fF029B3aCF696431754A07",
    "tusd": "0x6Bf75A3056E7647a34799E29025B9109Af2D0a80",
    "usdt": "0x3D3a4DE7257EB1A6a962a13CDD6b31a5AeAa961a",
    "usdc": "0x53dC6fDfAdB69156455fD10724856a4A84d4d43f",
    "ycrv": "0x00119B0025d89ceDf1B6c0f83Dc2e4d951F2F359",
    "vault": {
        "dai":"",
        "tusd":"",
        "usdt":"",
        "usdc":"",
        "ycrv":""
    },
    "strategy": {
        "dai":"",
        "tusd":"",
        "usdt":"",
        "usdc":"",
        "ycrv":""
    }
};

const infos = {
    "dai": {
        "name": "Dai Stablecoin", "symbol": "DAI", "decimals": 18
    },
    "tusd": {
        "name": "TrueUSD", "symbol": "TUSD", "decimals": 18
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
    "bToken": {
        "bdai": {
            "name": "bull Dai Stablecoin", "symbol": "bDAI", "decimals": 18
        },
        "btusd": {
            "name": "bull TrueUSD", "symbol": "bTUSD", "decimals": 18
        },
        "busdt": {
            "name": "bull Tether USD", "symbol": "bUSDT", "decimals": 6
        },
        "busdc": {
            "name": "bull USD Coin", "symbol": "bUSDC", "decimals": 6
        },
        "bycrv": {
            "name": "bull Curve.fi yDAI/yUSDC/yUSDT/yTUSD", "symbol": "byDAI+yUSDC+yUSDT+yTUSD", "decimals": 18
        }
    }
}

function shouldEq(actual, expected) {
    if (actual != expected) {
        console.error(actual, " != ", expected, new Error().stack);
    }
}

const checkingMode = 'local'; // 'mainnet'

async function vaultChecking(address, tokenAddress, info) {
    async function mainnet() {
        const vault = new web3.eth.Contract(BVault.abi, address);
        await local();
    
        shouldEq(await vault.methods.balance().call(), 0);
        // shouldEq(await vault.methods.getPricePerFullShare().call(), 0); <-- div by zero exception
    }
    
    async function local() {
        console.log("vaultChecking", address);
        const vault = new web3.eth.Contract(BVault.abi, address);
        shouldEq(await vault.methods.token().call(), tokenAddress);
        shouldEq(await vault.methods.min().call(), 9500);
        shouldEq(await vault.methods.max().call(), 10000);
        shouldEq(await vault.methods.governance().call(), addresses.major.governance);
        shouldEq(await vault.methods.controller().call(), addresses.controller);
        shouldEq(await vault.methods.totalSupply().call(), 0);
    
        shouldEq(await vault.methods.name().call(), info.name);
        shouldEq(await vault.methods.symbol().call(), info.symbol);
        shouldEq(await vault.methods.decimals().call(), info.decimals);
    
        shouldEq(await vault.methods.available().call(), 0);
    }
        
    if (checkingMode == 'local') {
        await local();
    } else {
        await mainnet();
    }
}

async function daiStrategyChecking() {
    console.log("daiStrategyChecking");
    const strategy = new web3.eth.Contract(StrategyDAICurve.abi, addresses.strategy.dai);

    async function local() {
        shouldEq(await strategy.methods.yycrv().call(), addresses.vault.ycrv);
        shouldEq(await strategy.methods.governance().call(), addresses.major.governance);
        shouldEq(await strategy.methods.controller().call(), addresses.controller);
    }
    
    async function mainnet() {
        await local();
    }

    if (checkingMode == 'local') {
        await local();
    } else {
        await mainnet();
    }
}

async function tusdStrategyChecking() {
    console.log("tusdStrategyChecking");
    const strategy = new web3.eth.Contract(StrategyTUSDCurve.abi, addresses.strategy.tusd);

    async function local() {
        shouldEq(await strategy.methods.yycrv().call(), addresses.vault.ycrv);
        shouldEq(await strategy.methods.governance().call(), addresses.major.governance);
        shouldEq(await strategy.methods.controller().call(), addresses.controller);
    }
    
    async function mainnet() {
        await local();
    }

    if (checkingMode == 'local') {
        await local();
    } else {
        await mainnet();
    }
}

async function usdtStrategyChecking() {
    console.log("usdtStrategyChecking");

    const strategy = new web3.eth.Contract(StrategyDForceUSDT.abi, addresses.strategy.usdt);

    async function local() {
        shouldEq(await strategy.methods.governance().call(), addresses.major.governance);
        shouldEq(await strategy.methods.controller().call(), addresses.controller);
        shouldEq(await strategy.methods.strategist().call(), addresses.major.strategist);
        shouldEq(await strategy.methods.performanceFee().call(), 500);
        shouldEq(await strategy.methods.withdrawalFee().call(), 50);
    }
    
    async function mainnet() {
        await local();
    }

    if (checkingMode == 'local') {
        await local();
    } else {
        await mainnet();
    }
}

async function usdcStrategyChecking() {
    console.log("usdcStrategyChecking");

    const strategy = new web3.eth.Contract(StrategyDForceUSDC.abi, addresses.strategy.usdc);

    async function local() {
        shouldEq(await strategy.methods.governance().call(), addresses.major.governance);
        shouldEq(await strategy.methods.controller().call(), addresses.controller);
        shouldEq(await strategy.methods.strategist().call(), addresses.major.strategist);
        shouldEq(await strategy.methods.performanceFee().call(), 500);
        shouldEq(await strategy.methods.withdrawalFee().call(), 50);
    }

    async function mainnet() {
        await local();
    }

    if (checkingMode == 'local') {
        await local();
    } else {
        await mainnet();
    }
}

async function ycrvStrategyChecking() {
    console.log("ycrvStrategyChecking");

    const strategy = new web3.eth.Contract(StrategyCurveYVoterProxy.abi, addresses.strategy.ycrv);
    const proxyStrategy = new web3.eth.Contract(StrategyProxy.abi, await strategy.methods.proxy().call());
    const voterStrategy = new web3.eth.Contract(CurveYCRVVoter.abi, await proxyStrategy.methods.proxy().call());

    async function local() {
        shouldEq(await strategy.methods.governance().call(), addresses.major.governance);
        shouldEq(await strategy.methods.controller().call(), addresses.controller);
        shouldEq(await strategy.methods.strategist().call(), addresses.major.strategist);
        shouldEq(await strategy.methods.keepCRV().call(), 1000);
        shouldEq(await strategy.methods.performanceFee().call(), 500);
        shouldEq(await strategy.methods.withdrawalFee().call(), 50);

        shouldEq(await proxyStrategy.methods.governance().call(), addresses.major.governance);
        shouldEq(await proxyStrategy.methods.strategies(addresses.strategy.ycrv).call(), true);

        shouldEq(await voterStrategy.methods.governance().call(), addresses.major.governance);
        shouldEq(await voterStrategy.methods.strategy().call(), await strategy.methods.proxy().call());
    }

    async function mainnet() {
        await local();

    }

    if (checkingMode == 'local') {
        await local();
    } else {
        await mainnet();
    }
}

async function controllerChecking() {
    console.log("controllerChecking");
    const controller = new web3.eth.Contract(Controller.abi, addresses.controller);

    async function local() {
        shouldEq(await controller.methods.governance().call(), addresses.major.governance);
        shouldEq(await controller.methods.rewards().call(), addresses.major.rewarder);
        shouldEq(await controller.methods.split().call(), 500);
        shouldEq(await controller.methods.max().call(), 10000);
    }
    
    async function mainnet() {
        await local();
        console.log(await controller.methods.balanceOf(addresses.dai).call());
        console.log(await controller.methods.balanceOf(addresses.usdt).call());
        console.log(await controller.methods.balanceOf(addresses.tusd).call());
        console.log(await controller.methods.balanceOf(addresses.usdc).call());
    }
    
    if (checkingMode == 'local') {
        await local();
    } else {
        await mainnet();
    }
}


async function main() {
    // console.log(web3.eth.Contract);
    const controller = new web3.eth.Contract(Controller.abi, addresses.controller);
    console.log(await controller.methods.governance().call());

    addresses.vault.dai = await controller.methods.vaults(addresses.dai).call();
    addresses.vault.tusd = await controller.methods.vaults(addresses.tusd).call();
    addresses.vault.usdt = await controller.methods.vaults(addresses.usdt).call();
    addresses.vault.usdc = await controller.methods.vaults(addresses.usdc).call();
    addresses.vault.ycrv = await controller.methods.vaults(addresses.ycrv).call();

    addresses.strategy.dai = await controller.methods.strategies(addresses.dai).call();
    addresses.strategy.tusd = await controller.methods.strategies(addresses.tusd).call();
    addresses.strategy.usdt = await controller.methods.strategies(addresses.usdt).call();
    addresses.strategy.usdc = await controller.methods.strategies(addresses.usdc).call();
    addresses.strategy.ycrv = await controller.methods.strategies(addresses.ycrv).call();

    console.log(addresses);

    await vaultChecking(addresses.vault.dai, addresses.dai, infos.bToken.bdai);
    await vaultChecking(addresses.vault.tusd, addresses.tusd, infos.bToken.btusd);
    await vaultChecking(addresses.vault.usdt, addresses.usdt, infos.bToken.busdt);
    await vaultChecking(addresses.vault.usdc, addresses.usdc, infos.bToken.busdc);
    await vaultChecking(addresses.vault.ycrv, addresses.ycrv, infos.bToken.bycrv);
    
    await controllerChecking();

    await daiStrategyChecking();
    await tusdStrategyChecking();
    await usdtStrategyChecking();
    await usdcStrategyChecking();
    await ycrvStrategyChecking();
}

main();

