/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface ControllerContract
  extends Truffle.Contract<ControllerInstance> {
  "new"(
    _rewards: string,
    meta?: Truffle.TransactionDetails
  ): Promise<ControllerInstance>;
}

type AllEvents = never;

export interface ControllerInstance extends Truffle.ContractInstance {
  approveStrategy: {
    (
      _token: string,
      _strategy: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _token: string,
      _strategy: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _token: string,
      _strategy: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _token: string,
      _strategy: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  approvedStrategies(
    arg0: string,
    arg1: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  balanceOf(
    _token: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  converters(
    arg0: string,
    arg1: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  earn: {
    (_token: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(_token: string, txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(
      _token: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _token: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  getExpectedReturn(
    _strategy: string,
    _token: string,
    parts: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  governance(txDetails?: Truffle.TransactionDetails): Promise<string>;

  inCaseStrategyTokenGetStuck: {
    (
      _strategy: string,
      _token: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _strategy: string,
      _token: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _strategy: string,
      _token: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _strategy: string,
      _token: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  inCaseTokensGetStuck: {
    (
      _token: string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _token: string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _token: string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _token: string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  max(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  onesplit(txDetails?: Truffle.TransactionDetails): Promise<string>;

  revokeStrategy: {
    (
      _token: string,
      _strategy: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _token: string,
      _strategy: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _token: string,
      _strategy: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _token: string,
      _strategy: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  rewards(txDetails?: Truffle.TransactionDetails): Promise<string>;

  setConverter: {
    (
      _input: string,
      _output: string,
      _converter: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _input: string,
      _output: string,
      _converter: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _input: string,
      _output: string,
      _converter: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _input: string,
      _output: string,
      _converter: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  setGovernance: {
    (_governance: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      _governance: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _governance: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _governance: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  setOneSplit: {
    (_onesplit: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      _onesplit: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _onesplit: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _onesplit: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  setRewards: {
    (_rewards: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      _rewards: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _rewards: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _rewards: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  setSplit: {
    (
      _split: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _split: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _split: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _split: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  setStrategist: {
    (_strategist: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      _strategist: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _strategist: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _strategist: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  setStrategy: {
    (
      _token: string,
      _strategy: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _token: string,
      _strategy: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _token: string,
      _strategy: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _token: string,
      _strategy: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  setVault: {
    (
      _token: string,
      _vault: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _token: string,
      _vault: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _token: string,
      _vault: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _token: string,
      _vault: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  split(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  strategies(
    arg0: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  strategist(txDetails?: Truffle.TransactionDetails): Promise<string>;

  vaults(arg0: string, txDetails?: Truffle.TransactionDetails): Promise<string>;

  withdraw: {
    (
      _token: string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _token: string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _token: string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _token: string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  withdrawAll: {
    (_token: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(_token: string, txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(
      _token: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _token: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  yearn: {
    (
      _strategy: string,
      _token: string,
      parts: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _strategy: string,
      _token: string,
      parts: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _strategy: string,
      _token: string,
      parts: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _strategy: string,
      _token: string,
      parts: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  methods: {
    approveStrategy: {
      (
        _token: string,
        _strategy: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _token: string,
        _strategy: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _token: string,
        _strategy: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _token: string,
        _strategy: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    approvedStrategies(
      arg0: string,
      arg1: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    balanceOf(
      _token: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    converters(
      arg0: string,
      arg1: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    earn: {
      (_token: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        _token: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _token: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _token: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    getExpectedReturn(
      _strategy: string,
      _token: string,
      parts: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    governance(txDetails?: Truffle.TransactionDetails): Promise<string>;

    inCaseStrategyTokenGetStuck: {
      (
        _strategy: string,
        _token: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _strategy: string,
        _token: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _strategy: string,
        _token: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _strategy: string,
        _token: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    inCaseTokensGetStuck: {
      (
        _token: string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _token: string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _token: string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _token: string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    max(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    onesplit(txDetails?: Truffle.TransactionDetails): Promise<string>;

    revokeStrategy: {
      (
        _token: string,
        _strategy: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _token: string,
        _strategy: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _token: string,
        _strategy: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _token: string,
        _strategy: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    rewards(txDetails?: Truffle.TransactionDetails): Promise<string>;

    setConverter: {
      (
        _input: string,
        _output: string,
        _converter: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _input: string,
        _output: string,
        _converter: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _input: string,
        _output: string,
        _converter: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _input: string,
        _output: string,
        _converter: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    setGovernance: {
      (_governance: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        _governance: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _governance: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _governance: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    setOneSplit: {
      (_onesplit: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        _onesplit: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _onesplit: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _onesplit: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    setRewards: {
      (_rewards: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        _rewards: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _rewards: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _rewards: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    setSplit: {
      (
        _split: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _split: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _split: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _split: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    setStrategist: {
      (_strategist: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        _strategist: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _strategist: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _strategist: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    setStrategy: {
      (
        _token: string,
        _strategy: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _token: string,
        _strategy: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _token: string,
        _strategy: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _token: string,
        _strategy: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    setVault: {
      (
        _token: string,
        _vault: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _token: string,
        _vault: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _token: string,
        _vault: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _token: string,
        _vault: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    split(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    strategies(
      arg0: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    strategist(txDetails?: Truffle.TransactionDetails): Promise<string>;

    vaults(
      arg0: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    withdraw: {
      (
        _token: string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _token: string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _token: string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _token: string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    withdrawAll: {
      (_token: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        _token: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _token: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _token: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    yearn: {
      (
        _strategy: string,
        _token: string,
        parts: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _strategy: string,
        _token: string,
        parts: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _strategy: string,
        _token: string,
        parts: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _strategy: string,
        _token: string,
        parts: number | BN | string,
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
