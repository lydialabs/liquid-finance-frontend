import { Arch } from "lib";
import { Contract } from "./contract";

export default class Larch extends Contract {
  balance(appStore: any, account: string) {
    const entrypoint = {
      balance: {
        address: account,
      },
    };
    return this.query(appStore, this.contractAddress, entrypoint);
  }
  send(
    appStore: any,
    contract: string,
    account: string,
    amount: string,
    msg?: string
  ) {
    const entrypoint = {
      send: {
        contract: contract,
        amount: amount,
        msg: msg || "",
      },
    };
    return this.excute(appStore, account, this.contractAddress, entrypoint);
  }
  transfer(appStore: any, account: string, recipient: string, amount: string) {
    const entrypoint = {
      transfer: {
        recipient: recipient,
        amount: Arch.utils.toLoop(amount).toFixed(),
      },
    };
    return this.excute(appStore, account, this.contractAddress, entrypoint);
  }
}
