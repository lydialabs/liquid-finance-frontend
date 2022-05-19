import BigNumber from "bignumber.js";
import { ChainInfo } from "consts/chain";
import { CONTRACT_ADDRESS } from "helpers/env";
import Larch from "./larch";
import Native from "./native";
import Staking from "./staking";
import Swap from "./swap";

const TEN = new BigNumber("10");
export const LOOP = new BigNumber("1000000");

export class Arch {
  Larch: Larch;
  Staking: Staking;
  Swap: Swap;
  Native: Native;

  static utils = {
    toLoop(value: BigNumber | number | string): BigNumber {
      return new BigNumber(value)
        .times(LOOP)
        .integerValue(BigNumber.ROUND_DOWN);
    },
    toFormat(
      value: BigNumber | number | string,
      decimals: number = ChainInfo.stakeCurrency.coinDecimals
    ) {
      return new BigNumber(value).div(TEN.pow(decimals));
    },
  };

  constructor() {
    this.Larch = new Larch(CONTRACT_ADDRESS.larch);
    this.Staking = new Staking(CONTRACT_ADDRESS.staking);
    this.Swap = new Swap(CONTRACT_ADDRESS.swap);
    this.Native = new Native(CONTRACT_ADDRESS.native);
  }
}

export const arch = new Arch();
