import { coins } from "@cosmjs/stargate";
import { Arch } from "lib";
import { Contract } from "./contract";

export default class Swap extends Contract {
  statusInfo(appStore: any) {
    const entrypoint = {
      status_info: {},
    };
    return this.query(appStore, this.contractAddress, entrypoint);
  }
  orderInfoOf(appStore: any, account: string) {
    const entrypoint = {
      order_info_of: {
        address: account,
      },
    };
    return this.query(appStore, this.contractAddress, entrypoint);
  }
  add(appStore: any, account: string, amount: string) {
    const entrypoint = {
      add: {},
    };
    const funds = coins(Arch.utils.toLoop(amount).toFixed(), "uconst");
    console.log("funds", funds);
    return this.excute(
      appStore,
      account,
      this.contractAddress,
      entrypoint,
      funds
    );
  }
  remove(appStore: any, account: string) {
    const entrypoint = {
      remove: {},
    };
    return this.excute(appStore, account, this.contractAddress, entrypoint);
  }
  claim(appStore: any, account: string) {
    const entrypoint = {
      claim: {},
    };
    return this.excute(appStore, account, this.contractAddress, entrypoint);
  }
}
