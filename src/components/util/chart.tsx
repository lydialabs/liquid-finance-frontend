import BigNumber from "bignumber.js";
import { LOOP } from "lib";

const LAUNCH_DAY = 1619366400000;
const ONE_DAY_DURATION = 86400000;

export const ONE = new BigNumber(1);

const toLoop = (value: BigNumber | number | string): BigNumber => {
  return new BigNumber(value).times(LOOP).integerValue(BigNumber.ROUND_DOWN);
};

const toARCH = (value: BigNumber | number | string): BigNumber => {
  return new BigNumber(value).div(LOOP);
};

export const generateChartData = (rate: BigNumber) => {
  const today = new Date().valueOf();
  const platformDays = Math.floor((today - LAUNCH_DAY) / ONE_DAY_DURATION) + 1;
  const stop = toLoop(rate);
  const start = toLoop(ONE);
  const step = stop.minus(start).div(platformDays - 1);

  const _data = Array(platformDays)
    .fill(start)
    .map((x, index) => ({
      time: (LAUNCH_DAY + ONE_DAY_DURATION * index) / 1_000,
      value: toARCH(x.plus(step.times(index))).toNumber(),
    }));

  return _data;
};
