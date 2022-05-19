import React, { useEffect, useState } from "react";

import { Flex, Box } from "rebass/styled-components";
import styled from "styled-components";
// import { Button } from "components/atom/button";
import { Typography } from "components/theme";
import {
  CHART_PERIODS,
  CHART_TYPES,
  HEIGHT,
} from "../../../components/organisms/chart/constant";
import Spinner from "components/atom/spiner";
import { generateChartData, LineType, ONE } from "components/util/chart";
import BigNumber from "bignumber.js";
import dynamic from "next/dynamic";
import { useAppStore } from "store";
import { useSwapStore } from "store/swap.store";
const TradingViewChart = dynamic(
  () => import("../../../components/organisms/chart"),
  { ssr: false }
);

// const ChartControlButton = styled(Button)<{ active: boolean }>`
//   padding: 1px 12px;
//   border-radius: 100px;
//   color: #ffffff;
//   font-size: 14px;
//   background-color: ${({ theme, active }) =>
//     active ? theme.colors.primary : theme.colors.bg3};
//   transition: background-color 0.3s ease;

//   :hover {
//     background-color: ${({ theme }) => theme.colors.primary};
//   }

//   ${({ theme }) => theme.mediaWidth.upExtraSmall`
//     padding: 1px 12px;
//   `}
// `;

// const ChartControlGroup = styled(Box)`
//   text-align: left;

//   ${({ theme }) => theme.mediaWidth.upSmall`
//     text-align: right;
//   `}

//   & button {
//     margin-right: 5px;
//   }

//   & button:last-child {
//     margin-right: 0;
//   }
// `;

const ChartContainer = styled(Box)`
  position: relative;
  height: ${HEIGHT}px;
`;

// const CHART_TYPES_LABELS = {
//   [CHART_TYPES.AREA]: "Line",
//   [CHART_TYPES.CANDLE]: "Candles",
// };

// const CHART_PERIODS_LABELS = {
//   [CHART_PERIODS["15m"]]: "15m",
//   [CHART_PERIODS["1H"]]: "1H",
//   [CHART_PERIODS["4H"]]: "4H",
//   [CHART_PERIODS["1D"]]: "1D",
//   [CHART_PERIODS["1W"]]: "1W",
// };

export default function SwapDescription() {
  // const [chartOption, setChartOption] = React.useState<{
  //   type: CHART_TYPES;
  //   period: CHART_PERIODS;
  // }>({
  //   type: CHART_TYPES.AREA,
  //   period: CHART_PERIODS["1H"],
  // });

  const [
    { userAddress: account, statusStakingInfo, ...appStore },
    updateAppStore,
  ] = useAppStore();
  const [{ pairSelected }, updateSwapStore] = useSwapStore();

  const data = {};
  const loading = false;

  const ref = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(ref?.current?.clientWidth);
  React.useEffect(() => {
    function handleResize() {
      setWidth(ref?.current?.clientWidth ?? width);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  // const handleChartPeriodChange = (
  //   event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  // ) => {
  //   setChartOption({
  //     ...chartOption,
  //     period: event.currentTarget.value as CHART_PERIODS,
  //   });
  // };

  // const handleChartTypeChange = (
  //   event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  // ) => {
  //   setChartOption({
  //     ...chartOption,
  //     type: event.currentTarget.value as CHART_TYPES,
  //   });
  // };

  // const haslARCH = true;
  // const halARCH = true;

  const pair = pairSelected.INPUT?.symbol !== "";
  const ratio =
    pairSelected.INPUT?.symbol === "ARCH" &&
    pairSelected.OUTPUT?.symbol === "lARCH"
      ? ONE.div(new BigNumber(statusStakingInfo?.ratio || "1"))
      : new BigNumber(statusStakingInfo?.ratio || "1");
  const pairName = `${pairSelected.INPUT?.symbol || "..."} / ${
    pairSelected.OUTPUT?.symbol || "..."
  }`;
  const price = new BigNumber(1);

  // const queueData: any = React.useMemo(
  //   () => generateChartData(ratio, pairSelected),

  //   [ratio, pairSelected.INPUT, pairSelected.OUTPUT]
  // );
  const [queueData, setQueueData] = useState<LineType[]>([]);

  useEffect(() => {
    (async () => {
      const data: LineType[] = await generateChartData(pairSelected);
      setQueueData(data);
    })();
  }, [pairSelected.INPUT?.symbol, pairSelected.OUTPUT?.symbol]);

  console.log("queueData", queueData);

  return (
    <Box bg="bg2" flex={1} p={[5, 7]}>
      <Flex mb={5} flexWrap="wrap">
        <Box width={[1, 1 / 2]}>
          <Typography variant="h3" mb={2}>
            {pairName}
          </Typography>

          <Typography variant="p">
            {`${ratio?.toFixed(4) || "..."}
                    ${pairSelected.OUTPUT?.symbol || "..."} per ${
              pairSelected.INPUT?.symbol || "..."
            } `}
          </Typography>
        </Box>
      </Flex>

      <ChartContainer ref={ref}>
        {pair ? (
          <>
            {loading ? (
              <Spinner size={75} centered />
            ) : (
              <>
                {/* {chartOption.type === CHART_TYPES.AREA && ( */}
                <TradingViewChart
                  data={queueData}
                  volumeData={queueData}
                  width={width}
                  type={CHART_TYPES.AREA}
                />
                {/* )} */}

                {/* {chartOption.type === CHART_TYPES.CANDLE && (
                  <TradingViewChart
                    data={data}
                    volumeData={data}
                    width={width}
                    type={CHART_TYPES.CANDLE}
                  />
                )} */}
              </>
            )}
          </>
        ) : (
          <Flex justifyContent="center" alignItems="center" height="100%">
            <Typography>No price chart available for this pair.</Typography>
          </Flex>
        )}
      </ChartContainer>
    </Box>
  );
}
