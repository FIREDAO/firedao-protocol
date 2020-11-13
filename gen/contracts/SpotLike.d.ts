/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface SpotLikeContract extends Truffle.Contract<SpotLikeInstance> {
  "new"(meta?: Truffle.TransactionDetails): Promise<SpotLikeInstance>;
}

type AllEvents = never;

export interface SpotLikeInstance extends Truffle.ContractInstance {
  ilks(
    arg0: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<[string, BN]>;

  methods: {
    ilks(
      arg0: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<[string, BN]>;
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