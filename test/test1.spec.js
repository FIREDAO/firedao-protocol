require('module-alias/register');

const Controller = artifacts.require("Controller");
const CurveYCRVVoter = artifacts.require("CurveYCRVVoter");
const StrategyCurveYVoterProxy = artifacts.require("StrategyCurveYVoterProxy");
const StrategyProxy = artifacts.require("StrategyProxy");
const StrategyDForceUSDC = artifacts.require("StrategyDForceUSDC");
const StrategyDForceUSDT = artifacts.require("StrategyDForceUSDT");
const StrategyTUSDCurve = artifacts.require("StrategyTUSDCurve");
const StrategyDAICurve = artifacts.require("StrategyDAICurve");
const TestToken = artifacts.require("TestToken");


describe('Basic checking', function () {
    // const controllerAddress = "0x3D3a4DE7257EB1A6a962a13CDD6b31a5AeAa961a";
    // const daiAddress = "0x628e6Da6A0b3f0219EaBF3bABFF2c4CB9EDc2c2C";
    // const tusdAddress = "";
    // const usdtAddress = "";
    // const usdcAddress = "";

    it("temp", async function() {
        // let tt = await TestToken.new("test token", "tt", 18, { from: accounts[0] });
        // const controller = await Controller.deployed();
        const controller = new Controller.at("0x3425a8aFE4925E5d828f2E7C2ACCE9786dBaAcBa");
        console.log(controller.address);
    });
    
    // it("1", async function() {
    //     const controller : ControllerInstance = await Controller.at("0x3D3a4DE7257EB1A6a962a13CDD6b31a5AeAa961a");
    //     console.log("constroller.address", await controller.vaults(daiAddress));
    // });
});
