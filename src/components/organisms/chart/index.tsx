import React, { useState, useEffect, useRef } from "react";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import {
  createChart,
  IChartApi,
  ChartOptions,
  DeepPartial,
  CrosshairMode,
  isBusinessDay,
  BusinessDay,
  UTCTimestamp,
} from "lightweight-charts";
import { usePrevious } from "react-use";
import styled from "styled-components";
import { HEIGHT, CHART_TYPES } from "./constant";

const Wrapper = styled.div`
  position: relative;
`;

const AreaOption: DeepPartial<ChartOptions> = {
  height: HEIGHT,
  layout: {
    backgroundColor: "rgba(250, 250, 250, 1)",
    textColor: "#697a8c",
  },
  grid: {
    vertLines: {
      visible: false,
    },
    horzLines: {
      visible: false,
    },
  },
  rightPriceScale: {
    borderColor: "#304a68",
  },
  timeScale: {
    borderColor: "#304a68",
  },
  crosshair: {
    mode: CrosshairMode.Magnet,
  },
  localization: {
    timeFormatter: (time: BusinessDay | UTCTimestamp) => {
      if (isBusinessDay(time)) {
        return "";
      }

      return dayjs(time * 1000).format("DD MMM YY hh:mma");
    },
    priceFormatter: (price: string) => new BigNumber(price).dp(4).toFormat(),
  },
};

const CandleOption: DeepPartial<ChartOptions> = {
  height: HEIGHT,
  layout: {
    backgroundColor: "rgba(250, 250, 250, 1)",
    textColor: "#697a8c",
  },
  grid: {
    vertLines: {
      color: "#304a68",
      visible: false,
    },
    horzLines: {
      color: "#304a68",
      visible: false,
    },
  },
  rightPriceScale: {
    borderColor: "#304a68",
  },
  timeScale: {
    borderColor: "#304a68",
  },
  crosshair: {
    mode: CrosshairMode.Normal,
  },
  localization: {
    timeFormatter: (time: BusinessDay | UTCTimestamp) => {
      if (isBusinessDay(time)) {
        return "";
      }

      return dayjs(time * 1000).format("DD MMM YY hh:mm a");
    },
    priceFormatter: (price: string) => new BigNumber(price).dp(4).toFormat(),
  },
};

interface TradingViewChartProps {
  type: string;
  data: any;
  volumeData: any;
  width: any;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({
  type = CHART_TYPES.AREA,
  data,
  volumeData,
  width,
}) => {
  // reference for DOM element to create with chart
  const ref = useRef<HTMLDivElement>(null);

  // pointer to the chart object
  const [chartCreated, setChartCreated] = useState<IChartApi | null>(null);

  const dataPrev = usePrevious(data);

  React.useEffect(() => {
    if (data !== dataPrev && chartCreated) {
      // remove the tooltip element
      chartCreated.resize(0, 0);
      chartCreated.remove();
      setChartCreated(null);
    }
  }, [chartCreated, data, dataPrev, type]);

  // adjust the scale based on the type of chart
  const topScale = type === CHART_TYPES.AREA ? 0.32 : 0.2;

  // if no chart created yet, create one with options and add to DOM manually
  useEffect(() => {
    if (!chartCreated && data && ref.current) {
      const chart = createChart(
        ref.current,
        type === CHART_TYPES.CANDLE
          ? { width: width, ...CandleOption }
          : { width: width, ...AreaOption }
      );

      if (type === CHART_TYPES.CANDLE) {
        const candleSeries = chart.addCandlestickSeries({
          upColor: "rgba(44, 169, 183, 1)",
          downColor: "#fb6a6a",
          borderDownColor: "#fb6a6a",
          borderUpColor: "rgba(44, 169, 183, 1)",
          wickDownColor: "#fb6a6a",
          wickUpColor: "rgba(44, 169, 183, 1)",
        });

        candleSeries.setData(data);

        const volumeSeries = chart.addHistogramSeries({
          color: "rgba(44, 169, 183, 0.5)",
          priceFormat: {
            type: "volume",
          },
          priceLineVisible: false,
          priceScaleId: "",
          scaleMargins: {
            top: 0.85,
            bottom: 0,
          },
        });

        volumeSeries.setData(volumeData);
      } else {
        const series = chart.addAreaSeries({
          topColor: "rgb(129,103,4,0.6)",
          bottomColor: "rgb(241,90,41,.1)",
          lineColor: "rgba(220, 76, 26, 1)",
          lineWidth: 2,
        });
        series.setData(data);
      }

      chart.timeScale().fitContent();

      setChartCreated(chart);
    }
  }, [chartCreated, data, topScale, type, width, volumeData]);

  // responsiveness
  useEffect(() => {
    if (width) {
      chartCreated && chartCreated.resize(width, HEIGHT);
      chartCreated && chartCreated.timeScale().scrollToPosition(0, true);
    }
  }, [chartCreated, width]);

  return (
    <Wrapper>
      <div ref={ref} id={"test-id" + type} />
    </Wrapper>
  );
};

export default TradingViewChart;
