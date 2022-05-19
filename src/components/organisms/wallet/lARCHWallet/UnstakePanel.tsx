import React from "react";

import BigNumber from "bignumber.js";
import Nouislider from "nouislider-react";
import { Box, Flex } from "rebass/styled-components";
import { showMessageOnBeforeUnload } from "utils/common";
import { Typography } from "components/theme";
import { SLIDER_RANGE_MAX_BOTTOM_THRESHOLD, ZERO } from "consts/currency";
import { Button, TextButton } from "components/atom/button";
import Modal from "components/organisms/modal";
import ModalContent from "components/organisms/modalcontent";
import { AppStoreInterface, useAppStore } from "store";
import { arch, Arch } from "lib";
import { CONTRACT_ADDRESS } from "helpers/env";

export default function UnstakePanel() {
  const [
    { userAddress: account, larchBalance, statusInfo, ...appStore },
    updateAppStore,
  ] = useAppStore();

  const [percent, setPercent] = React.useState<number>(0);

  const sliderInstance = React.useRef<any>(null);

  const handleSlider = (values: string[], handle: number) => {
    setPercent(parseFloat(values[handle]) / 100);
  };

  const ratio = new BigNumber(statusInfo?.ratio || "1");

  // modal logic
  const [open, setOpen] = React.useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

  const hasEnoughARCH = true;

  const maxAmount = Arch.utils.toFormat(larchBalance?.amount || "0");
  const isZeroCA = maxAmount.isEqualTo(ZERO);

  const beforeAmount = maxAmount;
  const differenceAmount = maxAmount.times(percent);
  const differenceAmountByARCH = differenceAmount.times(ratio);
  const afterAmount = beforeAmount.minus(differenceAmount);

  const resetForm = () => {
    setPercent(0);
    sliderInstance.current?.noUiSlider.set(0);
  };

  const openNotification = (notify: any) => {
    updateAppStore((draf: AppStoreInterface) => {
      draf.notification = { ...notify, show: true };
    });
  };

  const handleUnstake = () => {
    window.addEventListener("beforeunload", showMessageOnBeforeUnload);

    if (account) {
      openNotification({
        type: "pending",
        message: "Preparing to unstake lARCH...",
      });
      arch.Larch.send(
        appStore,
        CONTRACT_ADDRESS.staking,
        account,
        Arch.utils.toLoop(differenceAmount).toFixed()
      )
        .then(res => {
          console.log(res);
          if (res.transactionHash) {
            openNotification({
              type: "success",
              message: `Unstaking ${differenceAmount
                .dp(5)
                .toFormat()} lARCH. Check the ARCH entry in your wallet for details.`,
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
          openNotification({
            type: "error",
            message: `Couldn't unstaking ${differenceAmount
              .dp(5)
              .toFormat()} lARCH. Try again.`,
          });
        })
        .finally(() => {
          window.removeEventListener("beforeunload", showMessageOnBeforeUnload);
        });
    }
  };

  return (
    <>
      <Typography variant="h3">Unstake lARCH</Typography>

      <Box my={3}>
        <Nouislider
          disabled={isZeroCA}
          start={[0]}
          padding={[0]}
          connect={[true, false]}
          range={{
            min: [0],
            max: [isZeroCA ? SLIDER_RANGE_MAX_BOTTOM_THRESHOLD : 100],
          }}
          onSlide={handleSlider}
          instanceRef={instance => {
            if (instance && !sliderInstance.current) {
              sliderInstance.current = instance;
            }
          }}
        />
      </Box>

      <Flex my={1} alignItems="center" justifyContent="space-between">
        <Typography>
          {differenceAmount.dp(5).toFormat()} / {maxAmount.dp(5).toFormat()}{" "}
          lARCH
        </Typography>
        <Typography>
          ~ {differenceAmountByARCH.dp(5).toFormat()} ARCH
        </Typography>
      </Flex>

      <Flex alignItems="center" justifyContent="center" mt={5}>
        <Button onClick={toggleOpen}>Unstake lARCH</Button>
      </Flex>

      <Modal isOpen={open} onDismiss={toggleOpen}>
        <ModalContent>
          <Typography textAlign="center" mb="5px">
            Unstake lARCH?
          </Typography>

          <Typography
            variant="p"
            fontWeight="bold"
            textAlign="center"
            fontSize={20}
          >
            {differenceAmount.dp(5).toFormat() + " lARCH"}
          </Typography>

          <Typography textAlign="center" mb="5px">
            {differenceAmountByARCH.dp(5).toFormat()} ARCH
          </Typography>

          <Flex my={5}>
            <Box width={1 / 2} className="border-right">
              <Typography textAlign="center">Before</Typography>
              <Typography variant="p" textAlign="center">
                {beforeAmount.dp(5).toFormat() + " lARCH"}
              </Typography>
            </Box>

            <Box width={1 / 2}>
              <Typography textAlign="center">After</Typography>
              <Typography variant="p" textAlign="center">
                {afterAmount.dp(5).toFormat() + " lARCH"}
              </Typography>
            </Box>
          </Flex>

          <Typography textAlign="center">
            Takes up to 21 days. When it's ready, go to ARCH {">"} Unstaking in
            the Wallet section to claim it.
          </Typography>

          <Flex justifyContent="center" mt={4} pt={4} className="border-top">
            <TextButton onClick={toggleOpen} fontSize={14}>
              Cancel
            </TextButton>

            <Button
              onClick={handleUnstake}
              fontSize={14}
              disabled={!hasEnoughARCH}
            >
              Unstake
            </Button>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
}
