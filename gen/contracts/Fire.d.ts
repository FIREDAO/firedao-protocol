/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface FireContract extends Truffle.Contract<FireInstance> {
  "new"(
    account: string,
    _minter: string,
    meta?: Truffle.TransactionDetails
  ): Promise<FireInstance>;
}

export interface Approval {
  name: "Approval";
  args: {
    owner: string;
    spender: string;
    amount: BN;
    0: string;
    1: string;
    2: BN;
  };
}

export interface DelegateChanged {
  name: "DelegateChanged";
  args: {
    delegator: string;
    fromDelegate: string;
    toDelegate: string;
    0: string;
    1: string;
    2: string;
  };
}

export interface DelegateVotesChanged {
  name: "DelegateVotesChanged";
  args: {
    delegate: string;
    previousBalance: BN;
    newBalance: BN;
    0: string;
    1: BN;
    2: BN;
  };
}

export interface MinterChanged {
  name: "MinterChanged";
  args: {
    minter: string;
    newMinter: string;
    0: string;
    1: string;
  };
}

export interface Transfer {
  name: "Transfer";
  args: {
    from: string;
    to: string;
    amount: BN;
    0: string;
    1: string;
    2: BN;
  };
}

type AllEvents =
  | Approval
  | DelegateChanged
  | DelegateVotesChanged
  | MinterChanged
  | Transfer;

export interface FireInstance extends Truffle.ContractInstance {
  DELEGATION_TYPEHASH(txDetails?: Truffle.TransactionDetails): Promise<string>;

  DOMAIN_TYPEHASH(txDetails?: Truffle.TransactionDetails): Promise<string>;

  allowance(
    account: string,
    spender: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  approve: {
    (
      spender: string,
      rawAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      spender: string,
      rawAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;
    sendTransaction(
      spender: string,
      rawAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      spender: string,
      rawAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  balanceOf(
    account: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  cap(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  checkpoints(
    arg0: string,
    arg1: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<[BN, BN]>;

  decimals(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  delegate: {
    (delegatee: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      delegatee: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      delegatee: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      delegatee: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  delegateBySig: {
    (
      delegatee: string,
      nonce: number | BN | string,
      expiry: number | BN | string,
      v: number | BN | string,
      r: string,
      s: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      delegatee: string,
      nonce: number | BN | string,
      expiry: number | BN | string,
      v: number | BN | string,
      r: string,
      s: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      delegatee: string,
      nonce: number | BN | string,
      expiry: number | BN | string,
      v: number | BN | string,
      r: string,
      s: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      delegatee: string,
      nonce: number | BN | string,
      expiry: number | BN | string,
      v: number | BN | string,
      r: string,
      s: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  delegates(
    arg0: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  getCurrentVotes(
    account: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  getPriorVotes(
    account: string,
    blockNumber: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  mint: {
    (
      dst: string,
      rawAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      dst: string,
      rawAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      dst: string,
      rawAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      dst: string,
      rawAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  minter(txDetails?: Truffle.TransactionDetails): Promise<string>;

  name(txDetails?: Truffle.TransactionDetails): Promise<string>;

  nonces(arg0: string, txDetails?: Truffle.TransactionDetails): Promise<BN>;

  numCheckpoints(
    arg0: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  setMinter: {
    (_minter: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      _minter: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _minter: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _minter: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  symbol(txDetails?: Truffle.TransactionDetails): Promise<string>;

  totalSupply(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  transfer: {
    (
      dst: string,
      rawAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      dst: string,
      rawAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;
    sendTransaction(
      dst: string,
      rawAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      dst: string,
      rawAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  transferFrom: {
    (
      src: string,
      dst: string,
      rawAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      src: string,
      dst: string,
      rawAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;
    sendTransaction(
      src: string,
      dst: string,
      rawAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      src: string,
      dst: string,
      rawAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  methods: {
    DELEGATION_TYPEHASH(
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    DOMAIN_TYPEHASH(txDetails?: Truffle.TransactionDetails): Promise<string>;

    allowance(
      account: string,
      spender: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    approve: {
      (
        spender: string,
        rawAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        spender: string,
        rawAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<boolean>;
      sendTransaction(
        spender: string,
        rawAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        spender: string,
        rawAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    balanceOf(
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    cap(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    checkpoints(
      arg0: string,
      arg1: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<[BN, BN]>;

    decimals(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    delegate: {
      (delegatee: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        delegatee: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        delegatee: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        delegatee: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    delegateBySig: {
      (
        delegatee: string,
        nonce: number | BN | string,
        expiry: number | BN | string,
        v: number | BN | string,
        r: string,
        s: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        delegatee: string,
        nonce: number | BN | string,
        expiry: number | BN | string,
        v: number | BN | string,
        r: string,
        s: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        delegatee: string,
        nonce: number | BN | string,
        expiry: number | BN | string,
        v: number | BN | string,
        r: string,
        s: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        delegatee: string,
        nonce: number | BN | string,
        expiry: number | BN | string,
        v: number | BN | string,
        r: string,
        s: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    delegates(
      arg0: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    getCurrentVotes(
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    getPriorVotes(
      account: string,
      blockNumber: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    mint: {
      (
        dst: string,
        rawAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        dst: string,
        rawAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        dst: string,
        rawAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        dst: string,
        rawAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    minter(txDetails?: Truffle.TransactionDetails): Promise<string>;

    name(txDetails?: Truffle.TransactionDetails): Promise<string>;

    nonces(arg0: string, txDetails?: Truffle.TransactionDetails): Promise<BN>;

    numCheckpoints(
      arg0: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    setMinter: {
      (_minter: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        _minter: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _minter: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _minter: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    symbol(txDetails?: Truffle.TransactionDetails): Promise<string>;

    totalSupply(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    transfer: {
      (
        dst: string,
        rawAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        dst: string,
        rawAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<boolean>;
      sendTransaction(
        dst: string,
        rawAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        dst: string,
        rawAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    transferFrom: {
      (
        src: string,
        dst: string,
        rawAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        src: string,
        dst: string,
        rawAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<boolean>;
      sendTransaction(
        src: string,
        dst: string,
        rawAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        src: string,
        dst: string,
        rawAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };
  };

  getPastEvents(event: string): Promise<EventData[]>;
  getPastEvents(
    event: string,
    options: PastEventOptions,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
  getPastEvents(event: string, options: PastEventOptions): Promise<EventData[]>;
  getPastEvents(
    event: string,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
}