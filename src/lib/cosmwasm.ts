import {
  SigningCosmWasmClient,
  SigningCosmWasmClientOptions,
} from "@cosmjs/cosmwasm-stargate";
import { HttpEndpoint } from "@cosmjs/stargate";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";

export class LiquidSigningCosmWasmClient extends SigningCosmWasmClient {
  constructor(
    endpoint: Tendermint34Client,
    signer: OfflineSigner,
    options: SigningCosmWasmClientOptions
  ) {
    super(endpoint, signer, options);
  }
  public getQueryHandler() {
    return this.getQueryClient();
  }
  static async connectWithSigner(
    endpoint: string | HttpEndpoint,
    signer: OfflineSigner,
    options: SigningCosmWasmClientOptions = {}
  ) {
    const tmClient = await Tendermint34Client.connect(endpoint);
    return new LiquidSigningCosmWasmClient(tmClient, signer, options);
  }
}
