import BigNumber from "bignumber.js";
import { LOOP } from "lib";
import { Currency } from "types";
import axios from "axios";
import dayjs from "dayjs";

const LAUNCH_DAY = 1652767200000;
const ONE_DAY_DURATION = 86400000;

export const ONE = new BigNumber(1);

const toLoop = (value: BigNumber | number | string): BigNumber => {
  return new BigNumber(value).times(LOOP).integerValue(BigNumber.ROUND_DOWN);
};

const toARCH = (value: BigNumber | number | string): BigNumber => {
  return new BigNumber(value).div(LOOP);
};

const API_ENDPOINT = "https://torii-liquid-staking.techiast.com";

export enum Field {
  INPUT = "INPUT",
  OUTPUT = "OUTPUT",
}

export type LineType = {
  time: number;
  value: number;
};

export const generateChartData = async (pairSelected: {
  [field in Field]?: Currency;
}) => {
  const day = new Date().valueOf();
  const { data: result } = await axios.get(
    `${API_ENDPOINT}/staking/query-status?startTime=${LAUNCH_DAY}&endTime=${day}`
  );
  const _data: LineType[] = result.map(({ createdAt, ratio }: any) => ({
    time: createdAt / 1_000,
    value:
      pairSelected.INPUT?.symbol === "ARCH" &&
      pairSelected.OUTPUT?.symbol === "lARCH"
        ? Number(ratio)
        : ONE.div(Number(ratio)).toNumber(),
  }));
  return _data;
};

// export const generateChartData = (
//   rate: BigNumber,
//   currencies: { [field in Field]?: Currency }
// ) => {
//   const today = new Date().valueOf();
//   const platformDays = Math.floor((today - LAUNCH_DAY) / ONE_DAY_DURATION) + 1;
//   const stop = toLoop(rate);
//   const start = toLoop(ONE);
//   const step = stop.minus(start).div(platformDays - 1);

//   let _data;

//   if (
//     currencies[Field.INPUT]?.symbol === "lARCH" &&
//     currencies[Field.OUTPUT]?.symbol === "ARCH"
//   ) {
//     _data = Array(platformDays)
//       .fill(start)
//       .map((x, index) => ({
//         time: (LAUNCH_DAY + ONE_DAY_DURATION * index) / 1_000,
//         value: toARCH(x.plus(step.times(index))).toNumber(),
//       }));
//   } else {
//     _data = Array(platformDays)
//       .fill(start)
//       .map((x, index) => ({
//         time: (LAUNCH_DAY + ONE_DAY_DURATION * index) / 1_000,
//         value: ONE.div(toARCH(x.plus(step.times(index)))).toNumber(),
//       }));
//   }
//   console.log("_data", _data);

//   return _data;
// };
