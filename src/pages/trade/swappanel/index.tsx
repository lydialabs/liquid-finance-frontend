import React, { FC, useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import { Flex, Box } from "rebass/styled-components";
import styled from "styled-components";

import FlipIcon from "assets/icons/flip.svg";

import { BrightPanel, swapMessage } from "../../../components/util";
import { Currency } from "types";
import { Button, TextButton } from "components/atom/button";
import { Typography } from "components/theme";
import { maxAmountSpend, showMessageOnBeforeUnload } from "utils/common";
import CurrencyInputPanel from "../../../components/organisms/currencypanel";
import Modal from "../../../components/organisms/modal";
import ModalContent from "../../../components/organisms/modalcontent";
import { AppStoreInterface, useAppStore } from "store";
import { Arch, arch } from "lib";
import { ZERO } from "consts/currency";
import { CONTRACT_ADDRESS } from "helpers/env";

const FlipButton = styled(Box)`
  cursor: pointer;
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

interface SwapPanelProps {
  currencyList?: (Currency | undefined)[];
}
const FEE = new BigNumber(99 / 100);
export const SwapPanel: FC<SwapPanelProps> = ({ currencyList }) => {
  const [{ userAddress: account, ...appStore }, updateAppStore] = useAppStore();

  const [init, setInit] = useState<boolean>(true);

  const [swapValue, setSwapValue] = useState<Currency | undefined>(undefined);
  const [forValue, setForValue] = useState<Currency | undefined>();

  const [swapInputValue, setSwapInputValue] = useState<string>("");
  const [forInputValue, setForInputValue] = useState<string>("");
  const [fieldInput, setFieldInput] = useState<string>("");

  useEffect(() => {
    if (init && currencyList?.length) {
      setSwapValue(currencyList[0]);
      setForValue(currencyList[1]);
      setInit(false);
    }
  }, [currencyList]);

  const handleTypeInput = React.useCallback(
    (value: string) => {
      const forValue = value
        ? new BigNumber(value).times(FEE).dp(5).toFormat()
        : "";
      console.log("forValue", forValue);
      setSwapInputValue(value);
      setForInputValue(forValue);
      setFieldInput("SWAP");
    },
    [swapValue?.symbol, forValue?.symbol]
  );
  const handleTypeOutput = React.useCallback(
    (value: string) => {
      const swapValue = value
        ? new BigNumber(value).times(FEE).dp(5).toFormat()
        : "";
      setForInputValue(value);
      setSwapInputValue(swapValue);
      setFieldInput("FOR");
    },
    [swapValue?.symbol, forValue?.symbol]
  );

  const maxInputAmount = maxAmountSpend(
    new BigNumber(swapValue?.amount || "0")
  );

  const handleInputSelect = React.useCallback(
    (inputCurrency: Currency | undefined) => {
      if (inputCurrency?.symbol === forValue?.symbol) {
        setForValue(swapValue);
      }
      setSwapValue(inputCurrency);
    },
    [forValue]
  );

  const handleOutputSelect = React.useCallback(
    (outputCurrency: Currency | undefined) => {
      if (outputCurrency?.symbol === swapValue?.symbol) {
        setSwapValue(forValue);
      }
      setForValue(outputCurrency);
    },
    [swapValue]
  );

  const handleInputPercentSelect = React.useCallback(
    (percent: number) => {
      const value = Arch.utils
        .toFormat(
          currencyList?.find(currency => currency?.symbol === swapValue?.symbol)
            ?.amount || "0"
        )
        .times(percent)
        .div(100)
        .dp(5);

      setSwapInputValue(value.toFormat());
      const forValue = value
        ? new BigNumber(value).times(FEE).dp(5).toFormat()
        : "";
      setForInputValue(forValue);
      setFieldInput("SWAP");
      console.log("percent", percent);
    },
    [swapValue?.symbol]
  );

  const onSwitchTokens = () => {
    setSwapValue(forValue);
    setForValue(swapValue);
    const parseValue = new BigNumber(
      fieldInput === "SWAP" ? swapInputValue : forInputValue
    );
    const value = !parseValue.isNaN()
      ? fieldInput === "SWAP"
        ? parseValue.div(FEE).dp(5).toFormat()
        : parseValue.times(FEE).dp(5).toFormat()
      : "";

    setSwapInputValue(fieldInput === "SWAP" ? value : forInputValue);
    setForInputValue(fieldInput === "FOR" ? value : swapInputValue);
    setFieldInput(fieldInput === "SWAP" ? "FOR" : "SWAP");
  };

  // const [showInverted, setShowInverted] = React.useState<boolean>(false);

  const [showSwapConfirm, setShowSwapConfirm] = React.useState(false);

  const handleSwapConfirmDismiss = () => {
    setShowSwapConfirm(false);
  };

  const [executionTrade, setExecutionTrade] = useState({
    swapValue: {
      value: ZERO,
      currency: "ARCH",
    },
    forValue: {
      value: ZERO,
      currency: "lARCH",
    },
  });
  const handleSwap = () => {
    if (swapValue?.symbol && forValue?.symbol) {
      setShowSwapConfirm(true);
      setExecutionTrade({
        swapValue: {
          value: new BigNumber(swapInputValue),
          currency: swapValue?.symbol,
        },
        forValue: {
          value: new BigNumber(forInputValue),
          currency: forValue?.symbol,
        },
      });
    }
  };

  // const minimumToReceive = new BigNumber(1000);
  const priceImpact = "0%";

  const resetForm = () => {
    handleTypeInput("");
    handleTypeOutput("");
  };

  const [nativeTokenAmountOfSwapContract, setNativeTokenAmountOfSwapContract] =
    useState("");

  useEffect(() => {
    (async () => {
      const result = await arch.Swap.statusInfo(appStore);
      if (result) {
        setNativeTokenAmountOfSwapContract(
          Arch.utils.toFormat(result.balance).toFixed()
        );
        console.log("nativeTokenAmountOfSwapContract", result.balance);
      }
    })();
  }, [appStore]);
  console.log("currencyList", currencyList);
  console.log("executionTrade", executionTrade);

  const handleSwapConfirm = async () => {
    if (!executionTrade || !account) return;
    window.addEventListener("beforeunload", showMessageOnBeforeUnload);

    const message = swapMessage(
      executionTrade.swapValue.value.toFixed(5),
      executionTrade.swapValue.currency || "IN",
      executionTrade.forValue.value.toFixed(5),
      executionTrade.forValue.currency || "OUT"
    );

    const openNotification = (notify: any) => {
      updateAppStore((draf: AppStoreInterface) => {
        draf.notification = { ...notify, show: true };
      });
    };

    const minReceived = new BigNumber(1000);
    //call swapARCH
    if (swapValue?.symbol === "ARCH") {
      openNotification({
        type: "pending",
        message: message.pendingMessage,
      });
      arch.Staking.stake(appStore, account, swapInputValue)
        .then((res: any) => {
          console.log(res);
          if (res.transactionHash) {
            openNotification({
              type: "success",
              message: message.successMessage,
            });
            updateAppStore((draft: AppStoreInterface) => {
              draft.refreshBalances = true;
            });
            resetForm();
            setShowSwapConfirm(false);
          }
        })
        .catch(e => {
          console.error("error", e);
          setShowSwapConfirm(false);
          openNotification({
            type: "error",
            message: message.failureMessage,
          });
        })
        .finally(() => {
          window.removeEventListener("beforeunload", showMessageOnBeforeUnload);
        });
    } else {
      openNotification({
        type: "pending",
        message: message.pendingMessage,
      });
      arch.Larch.send(
        appStore,
        CONTRACT_ADDRESS.swap,
        account,
        Arch.utils.toLoop(swapInputValue).toFixed()
      )
        .then((res: any) => {
          setShowSwapConfirm(false);
          console.log("res.result ", res.result);
          console.log(res);
          if (res.transactionHash) {
            openNotification({
              type: "success",
              message: message.successMessage,
            });
            updateAppStore((draft: AppStoreInterface) => {
              draft.refreshBalances = true;
            });
            resetForm();
            setShowSwapConfirm(false);
          }
          resetForm();
        })
        .catch(e => {
          console.error("error", e);
        })
        .finally(() => {
          window.removeEventListener("beforeunload", showMessageOnBeforeUnload);
        });
    }
  };

  //
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);

  const arrowRef = React.useRef(null);

  const handleToggleDropdown = (e: React.MouseEvent<HTMLElement>) => {
    setAnchor(anchor ? null : arrowRef.current);
  };

  const closeDropdown = () => {
    setAnchor(null);
  };

  const hasEnoughARCH =
    (swapValue?.symbol === "lARCH" &&
      new BigNumber(swapInputValue).isLessThan(
        new BigNumber(nativeTokenAmountOfSwapContract)
      )) ||
    swapValue?.symbol === "ARCH";

  const inputError =
    swapValue?.symbol === appStore?.archBalance?.symbol &&
    new BigNumber(swapInputValue).isGreaterThan(
      new BigNumber(Arch.utils.toFormat(appStore?.archBalance?.amount || "0"))
    )
      ? `Insufficient ${appStore?.archBalance?.symbol}`
      : swapValue?.symbol === appStore?.larchBalance?.symbol &&
        new BigNumber(swapInputValue).isGreaterThan(
          new BigNumber(
            Arch.utils.toFormat(appStore?.larchBalance?.amount || "0")
          )
        )
      ? `Insufficient ${appStore?.larchBalance?.symbol}`
      : false;

  return (
    <>
      <BrightPanel
        bg="bg3"
        p={[5, 7]}
        flexDirection="column"
        alignItems="stretch"
        flex={1}
      >
        <AutoColumn gap="md">
          <Flex alignItems="center" justifyContent="space-between">
            <Typography variant="h2">
              {swapValue?.symbol === "ARCH" ? `Stake` : `Swap`}
            </Typography>
            <Typography as="div" hidden={!account}>
              Wallet:{" "}
              {!swapValue
                ? "-"
                : `${Arch.utils
                    .toFormat(
                      currencyList?.find(
                        currency => currency?.symbol === swapValue.symbol
                      )?.amount || "0"
                    )
                    .dp(5)
                    .toFormat()} ${swapValue?.symbol}`}
            </Typography>
          </Flex>

          <Flex>
            <CurrencyInputPanel
              value={swapInputValue}
              currency={swapValue}
              onUserInput={handleTypeInput}
              onCurrencySelect={handleInputSelect}
              onPercentSelect={!!account ? handleInputPercentSelect : undefined}
              percent={0}
              currencyList={currencyList}
            />
          </Flex>

          <Flex
            alignItems="center"
            justifyContent="center"
            marginBottom={"-8px"}
            marginTop={"8px"}
          >
            <FlipButton onClick={onSwitchTokens}>
              <FlipIcon width={25} height={17} />
            </FlipButton>
          </Flex>

          <Flex alignItems="center" justifyContent="space-between">
            <Typography variant="h2">For</Typography>
            <Typography as="div" hidden={!account}>
              Wallet:{" "}
              {!forValue
                ? "-"
                : `${Arch.utils
                    .toFormat(
                      currencyList?.find(
                        currency => currency?.symbol === forValue.symbol
                      )?.amount || "0"
                    )
                    .dp(5)
                    .toFormat()} ${forValue?.symbol}`}
            </Typography>
          </Flex>

          <Flex>
            <CurrencyInputPanel
              value={forInputValue}
              currency={forValue}
              onUserInput={handleTypeOutput}
              onCurrencySelect={handleOutputSelect}
              currencyList={currencyList}
            />
          </Flex>
        </AutoColumn>

        <AutoColumn gap="5px" mt={5}>
          <Flex alignItems="center" justifyContent="space-between">
            <Typography>Price impact</Typography>

            <Typography>{priceImpact}</Typography>
          </Flex>

          <Flex justifyContent="center" mt={4}>
            {!inputError ? (
              <Button onClick={handleSwap}>Swap</Button>
            ) : (
              <Button disabled={!!account} color="primary" onClick={handleSwap}>
                {account ? inputError : `Swap`}
              </Button>
            )}
          </Flex>
        </AutoColumn>
      </BrightPanel>

      <Modal isOpen={showSwapConfirm} onDismiss={handleSwapConfirmDismiss}>
        <ModalContent>
          <Typography textAlign="center" mb="5px" as="h3" fontWeight="normal">
            {`Swap ${swapValue?.symbol || "-"} for ${forValue?.symbol || "-"}?`}
          </Typography>

          <Typography variant="p" fontWeight="bold" textAlign="center">
            {`${FEE} ${swapValue?.symbol || "-"} per ${
              forValue?.symbol || "-"
            }`}
          </Typography>

          <Flex my={5}>
            <Box width={1 / 2} className="border-right">
              <Typography textAlign="center">Pay</Typography>
              <Typography variant="p" textAlign="center">
                {`${swapInputValue} ${swapValue?.symbol}`}
              </Typography>
            </Box>

            <Box width={1 / 2}>
              <Typography textAlign="center">Receive</Typography>
              <Typography variant="p" textAlign="center">
                {`${forInputValue} ${forValue?.symbol}`}
              </Typography>
            </Box>
          </Flex>
          <Typography textAlign="center" hidden={false}>
            {forValue?.symbol == "ARCH"
              ? `Includes a fee of ${new BigNumber(swapInputValue)
                  .times(1 / 100)
                  .toFormat()} lARCH.`
              : ``}
          </Typography>

          <Flex justifyContent="center" mt={4} pt={4} className="border-top">
            <TextButton onClick={handleSwapConfirmDismiss}>Cancel</TextButton>
            <Button onClick={handleSwapConfirm} disabled={!hasEnoughARCH}>
              Swap
            </Button>
          </Flex>
          {!hasEnoughARCH && (
            <Flex justifyContent="center" marginTop="10px">
              <Typography maxWidth="320px" color="alert" textAlign="center">
                {`Please don't swap more than ${nativeTokenAmountOfSwapContract} lARCH to complete this transaction.`}
              </Typography>
            </Flex>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default SwapPanel;
