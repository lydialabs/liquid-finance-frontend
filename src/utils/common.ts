import BigNumber from "bignumber.js";
import { ZERO } from "consts/currency";
import { LOOP } from "lib";

export function shortenAddress(address: string, chars = 7): string {
  return `${address.substring(0, chars + 2)}...${address.substring(
    42 - chars
  )}`;
}
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
export const showMessageOnBeforeUnload = function (e: any) {
  e.preventDefault();
  window.removeEventListener("beforeunload", showMessageOnBeforeUnload);
  return (e.returnValue =
    "Your transaction will be canceled, and you’ll need to sign in again.");
};

const MIN_NATIVE_CURRENCY_FOR_GAS = new BigNumber(2).times(LOOP); // 2 ARCH

export function maxAmountSpend(currencyAmount?: BigNumber) {
  if (!currencyAmount) return undefined;
  if (currencyAmount.isGreaterThan(MIN_NATIVE_CURRENCY_FOR_GAS)) {
    return currencyAmount.minus(MIN_NATIVE_CURRENCY_FOR_GAS);
  } else {
    return ZERO;
  }
}

export function getTrackerLink(
  data: string,
  type: "transaction" | "token" | "address" | "block"
): string {
  const prefix = "https://explorer.torii-1.archway.tech/";

  switch (type) {
    case "transaction": {
      return `${prefix}/transaction/${data}`;
    }
    case "token": {
      return `${prefix}/token/${data}`;
    }
    case "block": {
      return `${prefix}/block/${data}`;
    }
    case "address":
    default: {
      return `${prefix}/address/${data}`;
    }
  }
}
