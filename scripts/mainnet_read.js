const { projectIdMainnet, mnemonicMainnet } = require('../secrets-mainnet.json');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const Web3 = require("web3");
const provider = new HDWalletProvider(
    mnemonicMainnet, 
    new Web3.providers.WebsocketProvider(`wss://mainnet.infura.io/ws/v3/${projectIdMainnet}`)
);
console.log("a");
const web3 = new Web3(provider); 
console.log("b");

const Controller = require('../build/contracts/Controller.json');
const CurveYCRVVoter = require('../build/contracts/CurveYCRVVoter.json');
const StrategyCurveYVoterProxy = require('../build/contracts/StrategyCurveYVoterProxy.json');
const StrategyProxy = require('../build/contracts/StrategyProxy.json');
const StrategyDForceUSDC = require('../build/contracts/StrategyDForceUSDC.json');
const StrategyDForceUSDT = require('../build/contracts/StrategyDForceUSDT.json');
const StrategyTUSDCurve = require('../build/contracts/StrategyTUSDCurve.json');
const StrategyDAICurve = require('../build/contracts/StrategyDAICurve.json');
const BVault = require('../build/contracts/BVault.json');
console.log("c");

const addresses = {
    "major": {
        "admin": "0x3F70DF1cE9bD813D4Df1036E8a5B4dc8c403757e",
        "strategist": "0x3F70DF1cE9bD813D4Df1036E8a5B4dc8c403757e",
        "rewarder": "0x3F70DF1cE9bD813D4Df1036E8a5B4dc8c403757e",
        "governance": "0x3F70DF1cE9bD813D4Df1036E8a5B4dc8c403757e"
    },
    "controller": "0x711dCE50E9fC484e19883d8632FC8970cd6DD3E8",
    "dai": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    "tusd": "0x0000000000085d4780B73119b644AE5ecd22b376",
    "usdt": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "usdc": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "ycrv": "0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8",
    "vault": {
        "dai": "",
        "tusd": "",
        "usdt": "",
        "usdc": "",
        "ycrv": ""
    },
    "strategy": {
        "dai": "",
        "tusd": "",
        "usdt": "",
        "usdc": "",
        "ycrv": "",
        "proxy": "",
        "voter": ""
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

const checkingMode = 'mainnet'; // 'mainnet'

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

    addresses.strategy.proxy = await strategy.methods.proxy().call();
    const proxyStrategy = new web3.eth.Contract(StrategyProxy.abi, addresses.strategy.proxy);
    addresses.strategy.voter = await proxyStrategy.methods.proxy().call();
    const voterStrategy = new web3.eth.Contract(CurveYCRVVoter.abi, addresses.strategy.voter);

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
    console.log("aa");
    const controller = new web3.eth.Contract(Controller.abi, addresses.controller);
    console.log("bb");
    console.log(await controller.methods.governance().call());
    console.log("cc");

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

    console.log(addresses);

    console.log("done");
}

main();

