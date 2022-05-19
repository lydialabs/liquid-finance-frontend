import React from "react";

import BigNumber from "bignumber.js";
import { Flex, Box } from "rebass/styled-components";
import { useTheme } from "styled-components";
import { Currency } from "types";
import AddressInputPanel from "components/molecules/addressinput";
import { Button, TextButton } from "components/atom/button";
import { Typography } from "components/theme";
import { shortenAddress, showMessageOnBeforeUnload } from "utils/common";
import CurrencyInputPanel from "../currencypanel";
import Modal from "../modal";
import ModalContent from "../modalcontent";
import { Grid, MaxButton } from "./util";
import { MINIMUM_ARCH_FOR_TX, ZERO } from "consts/currency";
import { Arch, arch } from "lib";
import { AppStoreInterface, useAppStore } from "store";

export default function SendPanel({ currency }: { currency: Currency }) {
  const [value, setValue] = React.useState("");

  const [
    { userAddress: account, archBalance, larchBalance, ...appStore },
    updateAppStore,
  ] = useAppStore();

  const handleCurrencyInput = (value: string) => {
    setValue(value);
  };

  const [address, setAddress] = React.useState("");

  const handleAddressInput = (value: string) => {
    setAddress(value);
  };

  const walletAmount =
    currency.symbol === "ARCH"
      ? archBalance?.amount || "0"
      : currency.symbol === "lARCH"
      ? larchBalance?.amount || "0"
      : "0";

  const maxAmount = Arch.utils.toFormat(walletAmount).dp(5);

  const handleMax = () => {
    setValue(maxAmount.toFixed());
  };

  // modal logic
  const [open, setOpen] = React.useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

  const beforeAmount = Arch.utils.toFormat(walletAmount).dp(5);

  const differenceAmount = isNaN(parseFloat(value))
    ? new BigNumber(0)
    : new BigNumber(value);

  const afterAmount = beforeAmount.minus(differenceAmount);

  const openNotification = (notify: any) => {
    updateAppStore((draf: AppStoreInterface) => {
      draf.notification = { ...notify, show: true };
    });
  };
  const resetForm = () => {
    setValue("");
    setAddress("");
  };
  const getContract = async (account: string) => {
    if (currency.symbol === "ARCH")
      return await arch.Native.sendNativeToken(
        appStore,
        account,
        address,
        value
      );
    else {
      return await arch.Larch.transfer(appStore, account, address, value);
    }
  };
  const handleSend = () => {
    if (account) {
      window.addEventListener("beforeunload", showMessageOnBeforeUnload);
      openNotification({
        type: "pending",
        message: `Sending ${currency.symbol}...`,
      });
      getContract(account)
        .then(res => {
          console.log(res);
          if (res.transactionHash) {
            openNotification({
              type: "success",
              message: `Sent ${value} ${currency.symbol} to ${shortenAddress(
                address
              )}.`,
            });
            updateAppStore((draft: AppStoreInterface) => {
              draft.refreshBalances = true;
            });
            resetForm();
            toggleOpen();
          }
        })
        .catch(e => {
          console.error("error", e);
          toggleOpen();
          resetForm();
          openNotification({
            type: "error",
            message: `Couldn't send ${value} ${
              currency.symbol
            } to ${shortenAddress(address)}. Try again`,
          });
        })
        .finally(() => {
          window.removeEventListener("beforeunload", showMessageOnBeforeUnload);
        });
    }
  };

  const isAddress = (address: string) => address.startsWith("archway");

  const isDisabled =
    !isAddress(address) ||
    differenceAmount.isLessThan(ZERO) ||
    differenceAmount.isEqualTo(ZERO) ||
    differenceAmount.isGreaterThan(maxAmount);

  const errorMessage =
    differenceAmount.isGreaterThan(maxAmount) &&
    `Insufficient ${currency?.symbol || "balance"}`;

  const balances = {
    ARCH: new BigNumber(2),
  };

  const hasEnoughARCH = balances["ARCH"].isGreaterThan(MINIMUM_ARCH_FOR_TX);
  const theme = useTheme();

  return (
    <>
      <Grid>
        <Flex alignItems="center" justifyContent="space-between">
          <Typography variant="h3">Send {currency.symbol}</Typography>
          <MaxButton onClick={handleMax}>Send max</MaxButton>
        </Flex>

        <CurrencyInputPanel
          value={value}
          currency={currency}
          onUserInput={handleCurrencyInput}
          disableCurrencySelect
        />

        <AddressInputPanel value={address} onUserInput={handleAddressInput} />
      </Grid>

      <Flex alignItems="center" justifyContent="center" mt={5}>
        <Button onClick={toggleOpen} disabled={isDisabled}>
          {`${errorMessage ? errorMessage : "Send"}`}
        </Button>
      </Flex>

      <Modal isOpen={open} onDismiss={toggleOpen}>
        <ModalContent>
          <Typography textAlign="center" mb="5px">
            Send asset?
          </Typography>

          <Typography
            variant="p"
            fontWeight="bold"
            textAlign="center"
            fontSize={20}
          >
            {`${differenceAmount.dp(5).toFormat()} ${currency?.symbol}`}
          </Typography>

          <Typography textAlign="center" mb="2px" mt="20px">
            Address
          </Typography>

          <Typography
            variant="p"
            textAlign="center"
            margin={"auto"}
            maxWidth={200}
            fontSize={16}
          >
            {shortenAddress(address)}
          </Typography>

          <Flex my={5}>
            <Box width={1 / 2} className="border-right">
              <Typography textAlign="center">Before</Typography>
              <Typography variant="p" textAlign="center">
                {`${beforeAmount.dp(5).toFormat()} ${currency?.symbol}`}
              </Typography>
            </Box>

            <Box width={1 / 2}>
              <Typography textAlign="center">After</Typography>
              <Typography variant="p" textAlign="center">
                {`${afterAmount.dp(5).toFormat()} ${currency?.symbol}`}
              </Typography>
            </Box>
          </Flex>
          {currency.symbol === larchBalance?.symbol && (
            <Typography
              variant="content"
              textAlign="center"
              color={theme.colors.alert}
            >
              Do not send lARCH to an exchange.
            </Typography>
          )}
          <Flex justifyContent="center" mt={4} pt={4} className="border-top">
            <TextButton onClick={toggleOpen} fontSize={14}>
              Cancel
            </TextButton>
            <Button
              onClick={handleSend}
              fontSize={14}
              disabled={!hasEnoughARCH}
            >
              Send
            </Button>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
}
