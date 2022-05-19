import BigNumber from "bignumber.js";

export declare class Currency {
  readonly amount: number | BigNumber | string;
  readonly symbol?: string;

  /**
   * Constructs an instance of the base class `Currency`. The only instance of the base class `Currency` is `Currency.ETHER`.
   * @param amount decimals of the currency
   * @param symbol symbol of the currency
   */
  protected constructor(amount: number, symbol?: string);
}
