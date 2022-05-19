import React from "react";

import BigNumber from "bignumber.js";
import { Box, Flex } from "rebass/styled-components";

import { ZERO } from "consts/currency";
import { Button, TextButton } from "components/atom/button";
import Modal from "components/organisms/modal";
import ModalContent from "components/organisms/modalcontent";
import { Typography } from "components/theme";
import { AppStoreInterface, useAppStore } from "store";
import { Arch, arch } from "lib";
import { showMessageOnBeforeUnload } from "utils/common";

interface UnstakePanelProps {
  claimableARCH: BigNumber;
}

export default function UnstakePanel({ claimableARCH }: UnstakePanelProps) {
  const [
    { userAddress: account, archBalance, queryHandler, ...appStore },
    updateAppStore,
  ] = useAppStore();

  // modal logic
  const [open, setOpen] = React.useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };
  const openNotification = (notify: any) => {
    updateAppStore((draf: AppStoreInterface) => {
      draf.notification = { ...notify, show: true };
    });
  };

  const handleUnstake = async () => {
    window.addEventListener("beforeunload", showMessageOnBeforeUnload);
    if (account) {
      openNotification({
        type: "pending",
        message: "Claiming ARCH...",
      });
      arch.Staking.claim(appStore, account)
        .then(res => {
          console.log(res);
          if (res.transactionHash) {
            openNotification({
              type: "success",
              message: `Claimed ${claimableARCH.dp(5).toFormat()} ARCH.`,
            });
            updateAppStore((draft: AppStoreInterface) => {
              draft.refreshBalances = true;
            });
            toggleOpen();
          }
        })
        .catch(e => {
          console.error("error", e);
          toggleOpen();
          openNotification({
            type: "error",
            message: `Couldn't claim ${claimableARCH.dp(5).toFormat()} ARCH.`,
          });
        })
        .finally(() => {
          window.removeEventListener("beforeunload", showMessageOnBeforeUnload);
        });
    }
  };

  const archBalanceValue = Arch.utils.toFormat(archBalance?.amount || 0);

  const [unstakingAmount, setUnstakingAmount] = React.useState<BigNumber>(ZERO);

  React.useEffect(() => {
    (async () => {
      const result = await arch.Staking.statusStakingInfo({ queryHandler });
      console.log("unstakingAmount", result);
      setUnstakingAmount(Arch.utils.toFormat(result.unstakings));
    })();
  }, [account]);

  return (
    <>
      <Typography mb="3" variant="h3">
        Unstaking
      </Typography>

      {!unstakingAmount?.isZero() ? (
        <>
          <Typography mb="1">
            Your ARCH will be unstaked as more collateral is deposited into
            Balanced.
          </Typography>

          <Typography variant="p">
            {unstakingAmount?.dp(5).toFormat()} ARCH unstaking
          </Typography>
        </>
      ) : (
        <Typography>There's no ARCH unstaking.</Typography>
      )}

      {claimableARCH.isGreaterThan(0) && (
        <>
          <Typography mt="1" fontSize={16} color="#1a334d" fontWeight={"bold"}>
            {claimableARCH.dp(5).toFixed()} ARCH is ready to claim
          </Typography>
          <Flex mt={5}>
            <Button onClick={toggleOpen}>Claim ARCH</Button>
          </Flex>
        </>
      )}

      <Modal isOpen={open} onDismiss={toggleOpen}>
        <ModalContent noCurrencyBalanceErrorMessage>
          <Typography textAlign="center" mb="5px">
            Claim ARCH?
          </Typography>

          <Typography
            variant="p"
            fontWeight="bold"
            textAlign="center"
            fontSize={20}
          >
            {`${claimableARCH.dp(5).toFormat()} ARCH`}
          </Typography>

          <Flex my={5}>
            <Box width={1 / 2} className="border-right">
              <Typography textAlign="center">Before</Typography>
              <Typography variant="p" textAlign="center">
                {`${archBalanceValue.dp(5).toFormat()} ARCH`}
              </Typography>
            </Box>

            <Box width={1 / 2}>
              <Typography textAlign="center">After</Typography>
              <Typography variant="p" textAlign="center">
                {`${archBalanceValue
                  .plus(claimableARCH)
                  .dp(5)
                  .toFormat()} ARCH`}
              </Typography>
            </Box>
          </Flex>

          <Flex justifyContent="center" mt={4} pt={4} className="border-top">
            <TextButton onClick={toggleOpen} fontSize={14}>
              Not now
            </TextButton>
            <Button onClick={handleUnstake} fontSize={14}>
              Claim ARCH
            </Button>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
}
