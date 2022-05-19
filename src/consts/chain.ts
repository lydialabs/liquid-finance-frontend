export const ChainInfo = {
  chainId: "torii-1",
  chainName: "Torii Testnet",
  rpc: "https://rpc.torii-1.archway.tech",
  rest: "https://api.torii-1.archway.tech",
  stakeCurrency: {
    coinDenom: "TORII",
    coinMinimalDenom: "utorii",
    coinDecimals: 6,
  },
  bip44: { coinType: 118 },
  bech32Config: {
    bech32PrefixAccAddr: "archway",
    bech32PrefixAccPub: "archwaypub",
    bech32PrefixValAddr: "archwayvaloper",
    bech32PrefixValPub: "archwayvaloperpub",
    bech32PrefixConsAddr: "archwayvalcons",
    bech32PrefixConsPub: "archwayvalconspub",
  },
  currencies: [
    { coinDenom: "TORII", coinMinimalDenom: "utorii", coinDecimals: 6 },
  ],
  feeCurrencies: [
    { coinDenom: "TORII", coinMinimalDenom: "utorii", coinDecimals: 6 },
  ],
  coinType: 118,
  gasPriceStep: { low: 0, average: 0.1, high: 0.2 },
  features: ["cosmwasm"],
};
