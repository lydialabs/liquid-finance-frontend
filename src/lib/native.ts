import { coins } from "@cosmjs/stargate";
import { Arch } from "lib";
import { Contract } from "./contract";

export default class Native extends Contract {
  sendNativeToken(
    appStore: any,
    account: string,
    recipient: string,
    amount: string
  ) {
    const currency = coins(Arch.utils.toLoop(amount).toFixed(), "uconst");
    return this.sendTokens(appStore, account, recipient, currency);
  }
}
