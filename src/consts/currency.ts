import BigNumber from "bignumber.js";
import keyBy from "lodash/keyBy";

export const ZERO = new BigNumber(0);
export const MINIMUM_ARCH_FOR_TX = 1;

export const CURRENCYLIST = {
  empty: { symbol: "", decimals: 0, name: "empty" },
  ARCH: { symbol: "ARCH", decimals: 6, name: "ARCH" },
  lARCH: { symbol: "lARCH", decimals: 6, name: "Staked ARCH" },
};

export const CURRENCY = ["ARCH", "lARCH"];

export const CURRENCY_MAP = keyBy(CURRENCY);

export type CurrencyKey = string;

const ARCH_ADDRESS = "cx0000000000000000000000000000000000000000";

export const toMarketPair = (
  baseCurrencyKey: CurrencyKey,
  quoteCurrencyKey: string
) => `${baseCurrencyKey} / ${quoteCurrencyKey}`;

export interface Pair {
  baseCurrencyKey: CurrencyKey;
  quoteCurrencyKey: CurrencyKey;
  pair: string;
}

export const SupportedPairs: Array<Pair> = [
  {
    baseCurrencyKey: CURRENCY_MAP["ARCH"],
    quoteCurrencyKey: CURRENCY_MAP["lARCH"],
    pair: toMarketPair(CURRENCY_MAP["ARCH"], CURRENCY_MAP["lARCH"]),
  },
];

export const getFilteredCurrencies = (
  baseCurrencyKey: CurrencyKey
): CurrencyKey[] => {
  return SupportedPairs.filter(
    pair => pair.baseCurrencyKey === baseCurrencyKey
  ).map(pair => pair.quoteCurrencyKey);
};

export const SupportedBaseCurrencies = SupportedPairs.map(
  pair => pair.baseCurrencyKey
);
export const COMMON_PERCENTS = [25, 50, 75, 100];
export const SLIDER_RANGE_MAX_BOTTOM_THRESHOLD = 0.001;
