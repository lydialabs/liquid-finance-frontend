import { calculateFee, Coin } from "@cosmjs/stargate";

const GAS_LIMIT = 30000000000;

export class Contract {
  public contractAddress: string;
  protected userAddress: string | null;
  protected entrypoint: any;

  constructor(contractAddress: string, entrypoint?: any) {
    this.contractAddress = contractAddress;
    this.userAddress = null;
    this.entrypoint = entrypoint;
  }

  async query(appStore: any, contractAddress: string, entrypoint: any) {
    const { queryHandler } = appStore;
    if (!queryHandler) return;
    const queryResult = await queryHandler(contractAddress, entrypoint);
    return queryResult;
  }

  async excute(
    appStore: any,
    userAddress: string,
    contractAddress: string,
    entrypoint: any,
    funds?: Coin[]
  ) {
    const { CosmWasmClient, gasPrice } = appStore;
    const txFee = calculateFee(GAS_LIMIT, gasPrice);
    const tx = await CosmWasmClient.execute(
      userAddress,
      contractAddress,
      entrypoint,
      txFee,
      "",
      funds
    );
    return tx;
  }

  async sendTokens(
    appStore: any,
    senderAddress: string,
    recipientAddress: string,
    amount: Coin[]
  ) {
    const { CosmWasmClient, gasPrice } = appStore;
    const txFee = calculateFee(GAS_LIMIT, gasPrice);
    const tx = await CosmWasmClient.sendTokens(
      senderAddress,
      recipientAddress,
      amount,
      txFee
    );
    return tx;
  }
}
