// const { Test } = require("mocha");

const Controller = artifacts.require("Controller");
const BVault = artifacts.require("BVault");
const StrategyDForceDAI = artifacts.require("StrategyDForceDAI");

let daiAddress;

let daiVault;

// let daiStrategy1;
let daiStrategy;

let controller;

let admin;

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

module.exports = async function (deployer, networks, accounts) {
    admin = accounts[4];

    controller = await Controller.at(addresses.controller);
    daiVault = await BVault.at(addresses.vault.dai);
    
    // daiStrategy = await StrategyDForceDAI.new(addresses.controller, {from: admin});
    daiStrategy = await StrategyDForceDAI.at(addresses.strategy.dai);

    // await controller.approveStrategy(addresses.dai, daiStrategy.address, {from: admin});
    await controller.setStrategy(addresses.dai, daiStrategy.address, {from: admin});
};



