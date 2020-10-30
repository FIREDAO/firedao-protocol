import { web3 } from '@openzeppelin/test-environment'; 
const { BN } = require('@openzeppelin/test-helpers');

export function ether(_amount: number): BN {
  const weiString = web3.utils.toWei(_amount.toString(), 'ether');
  return new BN(weiString);
}

export function gWei(_amount: number): BN {
  const weiString = web3.utils.toWei(_amount.toString(), 'gwei');
  return new BN(weiString);
}

export function wei(_amount: number): BN {
  const weiString = web3.utils.toWei(_amount.toString(), 'wei');
  return new BN(weiString);
}

export function weiToEther(_weiAmount: BN | string): string {
  return web3.utils.fromWei(_weiAmount, "ether");
}

export function e27(_amount: number): BN {
  return e18(_amount).mul(e9(1));
}

export function e18(_amount: number): BN {
  return ether(_amount);
}

export function e9(_amount: number): BN {
  return gWei(_amount);
}

export function e1(_amount: number): BN {
  return wei(_amount);
}

export function toE18(_e1Amount: BN | string): string {
  return weiToEther(_e1Amount);
}

export function negative(_value: BN): BN {
  return _value.mul(new BN(-1));
}

export function positive(_value: BN): BN {
  return _value;
}

