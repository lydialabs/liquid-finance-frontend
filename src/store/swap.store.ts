import { Field } from "components/util/chart";
import { Currency } from "types";
import { createStore } from "./store";

export interface SwapStoreInterface {
  pairSelected: { [field in Field]?: Currency };
}

export const SwapStore = createStore<SwapStoreInterface>({
  pairSelected: {
    [Field.INPUT]: undefined,
    [Field.OUTPUT]: undefined,
  },
});

export const useSwapStore = SwapStore.useStore;
