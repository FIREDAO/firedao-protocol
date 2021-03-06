/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface GovernorAlphaContract
  extends Truffle.Contract<GovernorAlphaInstance> {
  "new"(
    timelock_: string,
    fire_: string,
    guardian_: string,
    meta?: Truffle.TransactionDetails
  ): Promise<GovernorAlphaInstance>;
}

export interface ProposalCanceled {
  name: "ProposalCanceled";
  args: {
    id: BN;
    0: BN;
  };
}

export interface ProposalCreated {
  name: "ProposalCreated";
  args: {
    id: BN;
    proposer: string;
    targets: string[];
    values: BN[];
    signatures: string[];
    calldatas: string[];
    startBlock: BN;
    endBlock: BN;
    description: string;
    0: BN;
    1: string;
    2: string[];
    3: BN[];
    4: string[];
    5: string[];
    6: BN;
    7: BN;
    8: string;
  };
}

export interface ProposalExecuted {
  name: "ProposalExecuted";
  args: {
    id: BN;
    0: BN;
  };
}

export interface ProposalQueued {
  name: "ProposalQueued";
  args: {
    id: BN;
    eta: BN;
    0: BN;
    1: BN;
  };
}

export interface VoteCast {
  name: "VoteCast";
  args: {
    voter: string;
    proposalId: BN;
    support: boolean;
    votes: BN;
    0: string;
    1: BN;
    2: boolean;
    3: BN;
  };
}

type AllEvents =
  | ProposalCanceled
  | ProposalCreated
  | ProposalExecuted
  | ProposalQueued
  | VoteCast;

export interface GovernorAlphaInstance extends Truffle.ContractInstance {
  BALLOT_TYPEHASH(txDetails?: Truffle.TransactionDetails): Promise<string>;

  DOMAIN_TYPEHASH(txDetails?: Truffle.TransactionDetails): Promise<string>;

  __abdicate: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  __acceptAdmin: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  __executeSetTimelockPendingAdmin: {
    (
      newPendingAdmin: string,
      eta: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      newPendingAdmin: string,
      eta: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      newPendingAdmin: string,
      eta: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      newPendingAdmin: string,
      eta: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  __queueSetTimelockPendingAdmin: {
    (
      newPendingAdmin: string,
      eta: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      newPendingAdmin: string,
      eta: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      newPendingAdmin: string,
      eta: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      newPendingAdmin: string,
      eta: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  cancel: {
    (
      proposalId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      proposalId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      proposalId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      proposalId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  castVote: {
    (
      proposalId: number | BN | string,
      support: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      proposalId: number | BN | string,
      support: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      proposalId: number | BN | string,
      support: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      proposalId: number | BN | string,
      support: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  castVoteBySig: {
    (
      proposalId: number | BN | string,
      support: boolean,
      v: number | BN | string,
      r: string,
      s: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      proposalId: number | BN | string,
      support: boolean,
      v: number | BN | string,
      r: string,
      s: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      proposalId: number | BN | string,
      support: boolean,
      v: number | BN | string,
      r: string,
      s: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      proposalId: number | BN | string,
      support: boolean,
      v: number | BN | string,
      r: string,
      s: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  execute: {
    (
      proposalId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      proposalId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      proposalId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      proposalId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  fire(txDetails?: Truffle.TransactionDetails): Promise<string>;

  getActions(
    proposalId: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<[string[], BN[], string[], string[]]>;

  getReceipt(
    proposalId: number | BN | string,
    voter: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<{ hasVoted: boolean; support: boolean; votes: BN }>;

  guardian(txDetails?: Truffle.TransactionDetails): Promise<string>;

  latestProposalIds(
    arg0: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  name(txDetails?: Truffle.TransactionDetails): Promise<string>;

  proposalCount(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  proposalMaxOperations(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  proposalThreshold(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  proposals(
    arg0: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<[BN, string, BN, BN, BN, BN, BN, boolean, boolean]>;

  propose: {
    (
      targets: string[],
      values: (number | BN | string)[],
      signatures: string[],
      calldatas: string[],
      description: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      targets: string[],
      values: (number | BN | string)[],
      signatures: string[],
      calldatas: string[],
      description: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;
    sendTransaction(
      targets: string[],
      values: (number | BN | string)[],
      signatures: string[],
      calldatas: string[],
      description: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      targets: string[],
      values: (number | BN | string)[],
      signatures: string[],
      calldatas: string[],
      description: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  queue: {
    (
      proposalId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      proposalId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      proposalId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      proposalId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  quorumVotes(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  state(
    proposalId: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  timelock(txDetails?: Truffle.TransactionDetails): Promise<string>;

  votingDelay(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  votingPeriod(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  methods: {
    BALLOT_TYPEHASH(txDetails?: Truffle.TransactionDetails): Promise<string>;

    DOMAIN_TYPEHASH(txDetails?: Truffle.TransactionDetails): Promise<string>;

    __abdicate: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    __acceptAdmin: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    __executeSetTimelockPendingAdmin: {
      (
        newPendingAdmin: string,
        eta: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        newPendingAdmin: string,
        eta: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        newPendingAdmin: string,
        eta: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        newPendingAdmin: string,
        eta: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    __queueSetTimelockPendingAdmin: {
      (
        newPendingAdmin: string,
        eta: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        newPendingAdmin: string,
        eta: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        newPendingAdmin: string,
        eta: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        newPendingAdmin: string,
        eta: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    cancel: {
      (
        proposalId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        proposalId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        proposalId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        proposalId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    castVote: {
      (
        proposalId: number | BN | string,
        support: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        proposalId: number | BN | string,
        support: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        proposalId: number | BN | string,
        support: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        proposalId: number | BN | string,
        support: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    castVoteBySig: {
      (
        proposalId: number | BN | string,
        support: boolean,
        v: number | BN | string,
        r: string,
        s: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        proposalId: number | BN | string,
        support: boolean,
        v: number | BN | string,
        r: string,
        s: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        proposalId: number | BN | string,
        support: boolean,
        v: number | BN | string,
        r: string,
        s: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        proposalId: number | BN | string,
        support: boolean,
        v: number | BN | string,
        r: string,
        s: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    execute: {
      (
        proposalId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        proposalId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        proposalId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        proposalId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    fire(txDetails?: Truffle.TransactionDetails): Promise<string>;

    getActions(
      proposalId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<[string[], BN[], string[], string[]]>;

    getReceipt(
      proposalId: number | BN | string,
      voter: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ hasVoted: boolean; support: boolean; votes: BN }>;

    guardian(txDetails?: Truffle.TransactionDetails): Promise<string>;

    latestProposalIds(
      arg0: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    name(txDetails?: Truffle.TransactionDetails): Promise<string>;

    proposalCount(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    proposalMaxOperations(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    proposalThreshold(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    proposals(
      arg0: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<[BN, string, BN, BN, BN, BN, BN, boolean, boolean]>;

    propose: {
      (
        targets: string[],
        values: (number | BN | string)[],
        signatures: string[],
        calldatas: string[],
        description: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        targets: string[],
        values: (number | BN | string)[],
        signatures: string[],
        calldatas: string[],
        description: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<BN>;
      sendTransaction(
        targets: string[],
        values: (number | BN | string)[],
        signatures: string[],
        calldatas: string[],
        description: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        targets: string[],
        values: (number | BN | string)[],
        signatures: string[],
        calldatas: string[],
        description: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    queue: {
      (
        proposalId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        proposalId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        proposalId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        proposalId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    quorumVotes(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    state(
      proposalId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    timelock(txDetails?: Truffle.TransactionDetails): Promise<string>;

    votingDelay(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    votingPeriod(txDetails?: Truffle.TransactionDetails): Promise<BN>;
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
