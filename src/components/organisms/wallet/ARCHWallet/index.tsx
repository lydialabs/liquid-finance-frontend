import React from "react";

import { Tabs, TabPanels, TabPanel } from "@reach/tabs";
import BigNumber from "bignumber.js";

import UnstakePanel from "./UnstakePanel";
import { StyledTab, StyledTabList } from "../util";
import { Currency } from "types";
import Divider from "components/atom/divider";
import SendPanel from "../SendPanel";

interface ARCHWalletProps {
  currency: Currency;
  claimableARCH: BigNumber;
}

export default function ARCHWallet({
  currency,
  claimableARCH,
}: ARCHWalletProps) {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  return (
    <>
      <Tabs index={tabIndex} onChange={handleTabsChange}>
        <StyledTabList>
          <StyledTab>Send</StyledTab>
          <StyledTab hasNotification={claimableARCH.isGreaterThan(0)}>
            Unstaking
          </StyledTab>
        </StyledTabList>
        <Divider mb={3} />
        <TabPanels>
          <TabPanel>
            <SendPanel currency={currency} />
          </TabPanel>

          <TabPanel>
            <UnstakePanel claimableARCH={claimableARCH} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
