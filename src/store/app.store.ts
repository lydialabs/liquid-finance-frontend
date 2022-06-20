import { Coin, GasPrice } from "@cosmjs/stargate";
import { LiquidSigningCosmWasmClient } from "lib/cosmwasm";
import { Currency } from "types";
import { createStore } from "./store";

export type TypeNotification = "success" | "error" | "pending";

export interface AppStoreInterface {
  offlineSigner?: any;
  CosmWasmClient?: LiquidSigningCosmWasmClient;
  accounts?: any;
  gasPrice?: GasPrice;
  queryHandler:
    | ((address: string, query: Record<string, unknown>) => Promise<any>)
    | undefined;
  userAddress: string | null;
  archBalance?: Currency;
  larchBalance?: Currency;
  refreshBalances: boolean;
  notification: {
    show: boolean;
    message: string;
    title: string;
    type?: TypeNotification;
  };
  statusInfo:
    | {
        issued: string;
        claims: string;
        balance: string;
        ratio: string;
      }
    | undefined;
  orderInfoOf:
    | {
        issued: string;
        native: string;
        height: string;
      }
    | undefined;
  statusStakingInfo:
    | {
        issued: string;
        native: Coin;
        unstakings: string;
        claims: string;
        bonded: string;
        balance: string;
        ratio: string;
      }
    | undefined;
}

export const AppStore = createStore<AppStoreInterface>({
  queryHandler: undefined,
  userAddress: "",
  refreshBalances: false,
  notification: {
    show: false,
    title: "",
    message: "",
  },
  statusInfo: undefined,
  orderInfoOf: undefined,
  statusStakingInfo: undefined,
});

export const useAppStore = AppStore.useStore;
