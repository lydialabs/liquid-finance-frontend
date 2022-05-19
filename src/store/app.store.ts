import { GasPrice } from "@cosmjs/stargate";
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
}

export const AppStore = createStore<AppStoreInterface>({
  queryHandler: undefined,
  userAddress: "",
  refreshBalances: false,
  notification: {
    show: false,
    message: "",
  },
  statusInfo: undefined,
  orderInfoOf: undefined,
});

export const useAppStore = AppStore.useStore;
