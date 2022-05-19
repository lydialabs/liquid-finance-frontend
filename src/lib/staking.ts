import { coins } from "@cosmjs/stargate";
import { Arch } from "lib";
import { Contract } from "./contract";

export default class Staking extends Contract {
  claimableOf(appStore: any, account: string) {
    const entrypoint = {
      claimable_of: {
        address: account,
      },
    };
    return this.query(appStore, this.contractAddress, entrypoint);
  }

  claim(appStore: any, account: string) {
    const entrypoint = {
      claim: {},
    };
    return this.excute(appStore, account, this.contractAddress, entrypoint);
  }
  stake(appStore: any, account: string, amount: string) {
    const entrypoint = {
      stake: {},
    };
    const funds = coins(Arch.utils.toLoop(amount).toFixed(), "uconst");
    return this.excute(
      appStore,
      account,
      this.contractAddress,
      entrypoint,
      funds
    );
  }
  statusStakingInfo(appStore: any) {
    const entrypoint = {
      status_info: {},
    };
    return this.query(appStore, this.contractAddress, entrypoint);
  }
}
