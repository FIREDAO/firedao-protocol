require('module-alias/register');

import { accounts, contract, web3 } from '@openzeppelin/test-environment'; 

// const Controller = artifacts.require("Controller");
// const CurveYCRVVoter = artifacts.require("CurveYCRVVoter");
// const StrategyCurveYVoterProxy = artifacts.require("StrategyCurveYVoterProxy");
// const StrategyProxy = artifacts.require("StrategyProxy");
// const StrategyDForceUSDC = artifacts.require("StrategyDForceUSDC");
// const StrategyDForceUSDT = artifacts.require("StrategyDForceUSDT");
// const StrategyTUSDCurve = artifacts.require("StrategyTUSDCurve");
// const StrategyDAICurve = artifacts.require("StrategyDAICurve");
// const TestToken = artifacts.require("TestToken");


import { expect } from 'chai';

import {
    ControllerContract,
    ControllerInstance,
    BVaultInstance,
} from '@gen/contracts';

import { e9, e18, e27 } from '@testUtils/units';
import { ZERO, ONE, TWO, THREE, TEN, ONE_HUNDRED, ZERO_ADDRESS } from '@testUtils/constants';

const Controller: ControllerContract  = contract.fromArtifact("Controller");
const CurveYCRVVoter = contract.fromArtifact("CurveYCRVVoter");
const StrategyCurveYVoterProxy = contract.fromArtifact("StrategyCurveYVoterProxy");
const StrategyProxy = contract.fromArtifact("StrategyProxy");
const StrategyDForceUSDC = contract.fromArtifact("StrategyDForceUSDC");
const StrategyDForceUSDT = contract.fromArtifact("StrategyDForceUSDT");
const StrategyTUSDCurve = contract.fromArtifact("StrategyTUSDCurve");
const StrategyDAICurve = contract.fromArtifact("StrategyDAICurve");
const TestToken = contract.fromArtifact("TestToken");


describe('Basic checking', function () {
    const controllerAddress: string = "0x3D3a4DE7257EB1A6a962a13CDD6b31a5AeAa961a";
    const daiAddress: string = "0x628e6Da6A0b3f0219EaBF3bABFF2c4CB9EDc2c2C";
    const tusdAddress: string = "";
    const usdtAddress: string = "";
    const usdcAddress: string = "";

    it("temp", async function() {
        await TestToken.new("test token", "tt", 18, { from: accounts[0] });
    });
    
    // it("1", async function() {
    //     const controller : ControllerInstance = await Controller.at("0x3D3a4DE7257EB1A6a962a13CDD6b31a5AeAa961a");
    //     console.log("constroller.address", await controller.vaults(daiAddress));
    // });
});
