import { DefaultLayout } from "components/organisms/layout";
import { Flex, Box } from "rebass/styled-components";

import { Tab, TabPanel, Tabs } from "components/organisms/tab";
import React from "react";
import LPPanel from "pages/trade/lppanel";
import { SectionPanel } from "components/util";
import SwapPanel from "pages/trade/swappanel";
import SwapDescription from "pages/trade/swapdescription";
import LiquidityDetails from "pages/trade/liquiddetail";
import RewardsPanel from "./trade/rewardpanel";
import WalletPanel from "./trade/walletpanel";
import { useAppStore } from "store";
import { useMedia } from "react-use";

const Trade = () => {
  const [
    { larchBalance, archBalance, userAddress: account, orderInfoOf },
    updateAppStore,
  ] = useAppStore();
  console.log("statusInfo?.balance", orderInfoOf?.native);

  const [value, setValue] = React.useState<number>(0);

  const handleTabClick = (event: React.MouseEvent, value: number) => {
    setValue(value);
  };

  const currencyList =
    larchBalance && archBalance ? [archBalance, larchBalance] : undefined;

  const isSmallScreen = useMedia(`(max-width: 768px)`);

  return (
    <DefaultLayout title="Liquid Finance">
      <Box flex={1}>
        <Flex mb={10} flexDirection="column">
          <Flex alignItems="center" justifyContent="space-between">
            <Tabs value={value} onChange={handleTabClick}>
              <Tab>Swap</Tab>
              <Tab>Supply liquidity</Tab>
            </Tabs>
          </Flex>

          <TabPanel value={value} index={0}>
            <SectionPanel bg="bg2">
              <SwapPanel currencyList={currencyList} />
              <SwapDescription />
            </SectionPanel>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <LPPanel currencyList={currencyList} />
          </TabPanel>
        </Flex>

        {value === 1 && account && orderInfoOf?.native !== "0" && (
          <LiquidityDetails />
        )}
      </Box>
      <Flex
        marginBottom={40}
        flexWrap={isSmallScreen ? "wrap-reverse" : "nowrap"}
      >
        <Box flex={"1 1 360px"} marginRight={!isSmallScreen ? 20 : 0}>
          <RewardsPanel />
        </Box>
        <Box flex={"1 1 55%"} marginBottom={isSmallScreen ? 20 : 0}>
          <WalletPanel />
        </Box>
      </Flex>
    </DefaultLayout>
  );
};
export default Trade;
