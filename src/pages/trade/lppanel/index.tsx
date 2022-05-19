import React, { useEffect, useState } from "react";

import Nouislider from "lib/nouislider-react";
import { Flex, Box } from "rebass/styled-components";
import styled from "styled-components";

import {
  SectionPanel,
  BrightPanel,
  supplyMessage,
} from "../../../components/util";
import { Typography } from "components/theme";
import CurrencyInputPanel from "../../../components/organisms/currencypanel";
import { Button } from "components/atom/button";
import SupplyLiquidityModal from "../../../components/organisms/supplyModal";
import LPDescription from "./chunk";
import { Currency } from "types";
import { arch, Arch } from "lib";
import { maxAmountSpend, showMessageOnBeforeUnload } from "utils/common";
import { AppStoreInterface, useAppStore } from "store";
import BigNumber from "bignumber.js";

const Slider = styled(Box)`
  margin-top: 40px;
  ${({ theme }) => theme.mediaWidth.upSmall`
     margin-top: 25px;
  `}
`;
const AutoColumn = styled(Box)<{
  gap?: "sm" | "md" | "lg" | string;
  justify?:
    | "stretch"
    | "center"
    | "start"
    | "end"
    | "flex-start"
    | "flex-end"
    | "space-between";
}>`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: ${({ gap }) =>
    (gap === "sm" && "10px") ||
    (gap === "md" && "15px") ||
    (gap === "lg" && "25px") ||
    gap};
  justify-items: ${({ justify }) => justify && justify};
`;

const PoolPriceBar = styled(Flex)`
  background-color: #32627d;
  margin-top: 25px;
  border-radius: 10px;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
`;

const VerticalDivider = styled.div`
  width: 1px;
  height: initial;
  background-color: ${({ theme }) => theme.colors.divider};
`;

const WalletSection: React.FC<{ currency: Currency | undefined }> = ({
  currency,
}) => {
  return (
    <Flex flexDirection="row" justifyContent="center" alignItems="center">
      <Typography>
        Wallet: {`${currency?.amount || "0"} ${currency?.symbol}`}
      </Typography>
    </Flex>
  );
};

interface LPPanelProps {
  currencyList?: (Currency | undefined)[];
}

export const LPPanel: React.FC<LPPanelProps> = ({ currencyList }) => {
  const [{ userAddress: account, ...appStore }, updateAppStore] = useAppStore();

  // modal
  const [showSupplyConfirm, setShowSupplyConfirm] = React.useState(false);

  const [init, setInit] = useState<boolean>(true);
  const [supplyValue, setSupplyValue] = useState<Currency | undefined>(
    undefined
  );

  const [supplyInputValue, setSupplyInputValue] = useState<string>("");

  useEffect(() => {
    if (init && currencyList?.length) {
      setSupplyValue(currencyList[0]);
      setInit(false);
    }
  }, [currencyList]);

  const handleSupplyConfirmDismiss = () => {
    setShowSupplyConfirm(false);
  };

  const handleConnectToWallet = () => {
    console.log("open wallet modal");
  };

  const sliderInstance = React.useRef<any>(null);
  const resetForm = () => {
    sliderInstance.current?.noUiSlider.set(0);
    setSupplyInputValue("");
  };

  const openNotification = (notify: any) => {
    updateAppStore((draf: AppStoreInterface) => {
      draf.notification = { ...notify, show: true };
    });
  };

  const handleSupplyConfirm = (account: string) => {
    window.addEventListener("beforeunload", showMessageOnBeforeUnload);
    openNotification({
      type: "pending",
      message: supplyMessage("ARCH/lARCH").pendingMessage,
    });
    arch.Swap.add(appStore, account, supplyInputValue)
      .then(res => {
        console.log(res);
        if (res.transactionHash) {
          openNotification({
            type: "success",
            message: supplyMessage("ARCH/lARCH").successMessage,
          });
          updateAppStore((draft: AppStoreInterface) => {
            draft.refreshBalances = true;
          });
          resetForm();
          setShowSupplyConfirm(false);
        }
      })
      .catch(e => {
        console.error("error", e);
        setShowSupplyConfirm(false);
        openNotification({
          type: "error",
          message: supplyMessage("ARCH/lARCH").failureMessage,
        });
      })
      .finally(() => {
        window.removeEventListener("beforeunload", showMessageOnBeforeUnload);
      });
  };

  const handleSupply = () => {
    setShowSupplyConfirm(true);
  };

  const handleSlider = (values: string[], handle: number) => {
    const value = Arch.utils.toFormat(values[handle]).dp(5).toFormat();
    setSupplyInputValue(value);
  };

  const handleSuppyInputValue = (value: string) => {
    setSupplyInputValue(value);
    const parseValue = Arch.utils.toLoop(value);
    const percent = supplyValue
      ? parseValue.div(Arch.utils.toLoop(supplyValue.amount))
      : 0;
    sliderInstance.current?.noUiSlider.set(
      Arch.utils.toLoop(parseValue.times(percent))
    );
  };

  const isValid = true;

  const handleCurrencySelect = React.useCallback(
    (currency: Currency | undefined) => setSupplyValue(currency),
    []
  );

  const handlePercentSelect = (percent: number) => {
    const value =
      supplyValue &&
      Arch.utils.toFormat(supplyValue.amount).times(percent).div(100);
    setSupplyInputValue(value ? value.dp(5).toFormat() : "");
    sliderInstance.current?.noUiSlider.set(
      new BigNumber(supplyValue?.amount || "0").times(percent).div(100)
    );
  };
  const error =
    new BigNumber(supplyInputValue).isGreaterThan(
      new BigNumber(Arch.utils.toFormat(supplyValue?.amount || 0)).dp(5)
    ) && "Insufficient ARCH";
  console.log("sliderInstance.current", sliderInstance.current);

  return (
    <>
      <SectionPanel bg="bg2">
        <BrightPanel
          bg="bg3"
          p={[5, 7]}
          flexDirection="column"
          alignItems="stretch"
          flex={1}
        >
          <AutoColumn gap="md">
            <AutoColumn gap="md">
              <Typography variant="h2">Supply liquidity</Typography>
            </AutoColumn>

            <AutoColumn gap="md">
              <Flex>
                <CurrencyInputPanel
                  value={supplyInputValue}
                  currency={supplyValue}
                  onUserInput={value => handleSuppyInputValue(value)}
                  onCurrencySelect={handleCurrencySelect}
                  currencyList={currencyList || []}
                  onPercentSelect={value => handlePercentSelect(value)}
                />
              </Flex>
            </AutoColumn>
          </AutoColumn>

          <Flex mt={3} justifyContent="flex-end">
            <WalletSection
              currency={{
                amount: Arch.utils
                  .toFormat(
                    currencyList?.find(
                      currency => currency?.symbol === supplyValue?.symbol
                    )?.amount || "0"
                  )
                  .dp(5)
                  .toFormat(),
                symbol: supplyValue?.symbol,
              }}
            />
          </Flex>

          <Slider mt={5}>
            <Nouislider
              start={[0]}
              padding={[0, 0]}
              connect={[true, false]}
              range={{
                min: [0],
                max: [Number(supplyValue?.amount) || 100],
              }}
              onSlide={handleSlider}
              step={0.01}
              instanceRef={(instance: any) => {
                if (instance) {
                  sliderInstance.current = instance;
                }
              }}
            />
          </Slider>

          <AutoColumn gap="5px" mt={5}>
            <Flex justifyContent="center">
              {!error ? (
                <Button color="primary" onClick={handleSupply}>
                  Supply
                </Button>
              ) : (
                <Button
                  disabled={!!account}
                  color="primary"
                  onClick={handleConnectToWallet}
                >
                  {account ? error : `Supply`}
                </Button>
              )}
            </Flex>
          </AutoColumn>
        </BrightPanel>

        <LPDescription />
      </SectionPanel>

      <SupplyLiquidityModal
        isOpen={showSupplyConfirm}
        onClose={handleSupplyConfirmDismiss}
        parsedAmounts={new BigNumber(supplyInputValue).dp(5).toFormat()}
        currencies={"ARCH"}
        onSupplyConfirm={() => account && handleSupplyConfirm(account)}
      />
    </>
  );
};

export default LPPanel;
