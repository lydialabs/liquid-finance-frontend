import BigNumber from "bignumber.js";
import axios from "axios";
import { Button, TextButton } from "components/atom/button";
import Spinner from "components/atom/spiner";
import { BoxPanel } from "components/molecules/panel";
import QuestionHelper from "components/molecules/questionhelper";
import Modal from "components/organisms/modal";
import ModalContent from "components/organisms/modalcontent";
import { Typography } from "components/theme";
import { ZERO } from "consts/currency";
import React, { useEffect, useState } from "react";
import { AppStoreInterface, useAppStore } from "store";

import { Flex, Box } from "rebass/styled-components";
import { showMessageOnBeforeUnload } from "utils/common";
import { Arch, arch } from "lib";

const RewardSection = () => {
  const [
    {
      userAddress: account,
      archBalance,
      larchBalance,
      refreshBalances,
      ...appStore
    },
    updateAppStore,
  ] = useAppStore();
  const [claimableValue, setClaimableValue] =
    useState<{ staked_token: string; native_token: string }>();

  const [open, setOpen] = React.useState(false);
  const toggleOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    (async () => {
      if (account) {
        const claimableValue = await arch.Swap.claimableOf(appStore, account);
        setClaimableValue(claimableValue);
      }
    })();
  }, [account, refreshBalances]);

  const openNotification = (notify: any) => {
    updateAppStore((draf: AppStoreInterface) => {
      draf.notification = { ...notify, show: true };
    });
  };

  const handleRewardClaim = () => {
    window.addEventListener("beforeunload", showMessageOnBeforeUnload);
    if (account) {
      openNotification({
        type: "pending",
        message: "Claiming rewards...",
      });
      arch.Swap.claim(appStore, account)
        .then(res => {
          console.log(res);
          if (res.transactionHash) {
            openNotification({
              type: "success",
              message: `Claimed ${Arch.utils
                .toFormat(claimableValue?.staked_token || "0")
                .dp(5)
                .toFormat()} lARCH and ${Arch.utils
                .toFormat(claimableValue?.native_token || "0")
                .dp(5)
                .toFormat()} ARCH.`,
            });
            updateAppStore((draft: AppStoreInterface) => {
              draft.refreshBalances = true;
            });
            setOpen(false);
          }
        })
        .catch(e => {
          console.error("error", e);
          setOpen(false);
          openNotification({
            type: "error",
            message: `Couldn't claim lARCH and ARCH. Try again.`,
          });
        })
        .finally(() => {
          window.removeEventListener("beforeunload", showMessageOnBeforeUnload);
        });
    }
  };

  // const rewardQuery = useRewardQuery();

  // const [rewardTx, setRewardTx] = React.useState("");
  // const rewardTxStatus = useTransactionStatus(rewardTx);
  // React.useEffect(() => {
  //   if (rewardTxStatus === TransactionStatus.success) rewardQuery.refetch();
  // }, [rewardTxStatus, rewardQuery]);

  // const getRewardsUI = () => {
  //   if (!hasRewardable && reward?.isZero()) {
  //     return (
  //       <>
  //         <Typography variant="p" as="div">
  //           Ineligible
  //           <QuestionHelper
  //             text={`To earn Balanced rewards, take out a loan or supply liquidity on the Trade page.`}
  //           />
  //         </Typography>
  //       </>
  //     );
  //   } else if (reward?.isZero()) {
  //     return (
  //       <>
  //         <Typography variant="p" as="div">
  //           Pending
  //           <QuestionHelper
  //             text={`To earn Balanced rewards, take out a loan or supply liquidity on the Trade page.`}
  //           />
  //         </Typography>
  //       </>
  //     );
  //   } else {
  //     return (

  //     );
  //   }
  // };

  const beforeARCHAmount = Arch.utils.toFormat(archBalance?.amount || 0);

  const afterARCHAmount = beforeARCHAmount.plus(
    claimableValue?.native_token || ZERO
  );

  const beforelARCHAmount = Arch.utils.toFormat(larchBalance?.amount || 0);

  const afterlARCHAmount = beforelARCHAmount.plus(
    Arch.utils.toFormat(claimableValue?.staked_token || 0) || ZERO
  );

  return (
    <Flex
      flex={1}
      flexDirection="column"
      alignItems="center"
      className="border-right"
    >
      <Typography mb={2}>Claimable Tokens</Typography>
      {claimableValue ? (
        <>
          <Typography variant="p">
            {`${
              claimableValue
                ? Arch.utils
                    .toFormat(claimableValue.staked_token)
                    .dp(5)
                    .toFormat()
                : "-"
            } `}
            <Typography as="span">lARCH</Typography>
          </Typography>
          <Typography variant="p">
            {`${
              claimableValue
                ? Arch.utils
                    .toFormat(claimableValue.native_token)
                    .dp(5)
                    .toFormat()
                : "-"
            } `}
            <Typography as="span">ARCH</Typography>
          </Typography>
          <Button mt={2} onClick={toggleOpen}>
            Claim
          </Button>
        </>
      ) : (
        <>-</>
      )}

      <Modal isOpen={open} onDismiss={toggleOpen}>
        <ModalContent>
          <Typography textAlign="center" mb={1}>
            Claim Tokens?
          </Typography>

          <Typography
            variant="p"
            fontWeight="bold"
            textAlign="center"
            fontSize={20}
          >
            {`${
              claimableValue
                ? Arch.utils
                    .toFormat(claimableValue.staked_token)
                    .dp(5)
                    .toFormat()
                : "-"
            } lARCH`}
          </Typography>

          <Typography
            variant="p"
            fontWeight="bold"
            textAlign="center"
            fontSize={20}
          >
            {`${
              claimableValue
                ? Arch.utils
                    .toFormat(claimableValue.native_token)
                    .dp(5)
                    .toFormat()
                : "-"
            } ARCH`}
          </Typography>

          <Flex my={5}>
            <Box width={1 / 2} className="border-right">
              <Typography textAlign="center">Before</Typography>
              <Typography variant="p" textAlign="center">
                {beforelARCHAmount.dp(5).toFormat() + " lARCH"}
              </Typography>
              <Typography variant="p" textAlign="center">
                {beforeARCHAmount.dp(5).toFormat() + " ARCH"}
              </Typography>
            </Box>

            <Box width={1 / 2}>
              <Typography textAlign="center">After</Typography>
              <Typography variant="p" textAlign="center">
                {afterlARCHAmount.dp(5).toFormat() + " lARCH"}
              </Typography>
              <Typography variant="p" textAlign="center">
                {afterARCHAmount.dp(5).toFormat() + " lARCH"}
              </Typography>
            </Box>
          </Flex>

          <Flex justifyContent="center" mt={4} pt={4} className="border-top">
            <TextButton onClick={toggleOpen} fontSize={14}>
              Not now
            </TextButton>
            <Button onClick={handleRewardClaim} fontSize={14}>
              Claim
            </Button>
          </Flex>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

const NetworkFeeSection = () => {
  const account = "abc";
  const [feeTx, setFeeTx] = React.useState("");
  // const shouldLedgerSign = useShouldLedgerSign();

  // const changeShouldLedgerSign = useChangeShouldLedgerSign();
  // const addTransaction = useTransactionAdder();

  const handleFeeClaim = () => {
    window.addEventListener("beforeunload", showMessageOnBeforeUnload);

    // if (bnJs.contractSettings.ledgerSettings.actived) {
    //   changeShouldLedgerSign(true);
    // }
    // const end = platformDay - feesIndex * BATCH_SIZE;
    // const start = end - BATCH_SIZE > 0 ? end - BATCH_SIZE : 0;

    // bnJs
    //   .inject({ account })
    //   .Dividends.claim(start, end)
    //   .then(res => {
    //     addTransaction(
    //       { hash: res.result }, //
    //       {
    //         summary: `Claimed fees.`,
    //         pending: `Claiming fees...`,
    //       }
    //     );
    //     setFeeTx(res.result);
    //     toggleOpen();
    //   })
    //   .catch(e => {
    //     console.error("error", e);
    //   })
    //   .finally(() => {
    //     changeShouldLedgerSign(false);
    //     window.removeEventListener("beforeunload", showMessageOnBeforeUnload);
    //   });
  };

  // const feeTxStatus = useTransactionStatus(feeTx);
  // React.useEffect(() => {
  //   if (feeTxStatus === TransactionStatus.success) feesQuery.refetch();
  // });

  const hasNetworkFees = false;
  // const { data: platformDay = 0 } = usePlatformDayQuery();
  // const feesQuery = useUserCollectedFeesQuery(1, platformDay);
  // const feesArr = feesQuery.data;
  const fees = undefined;
  // const feesIndex = feesArr?.findIndex(fees => fees) || 0;
  const hasFee = !!fees;
  const count = 3;
  //  feesArr?.reduce((c, v) => (v ? ++c : c), 0);

  const [open, setOpen] = React.useState(false);
  const toggleOpen = () => {
    setOpen(!open);
  };

  const getNetworkFeesUI = () => {
    if (hasNetworkFees && !hasFee) {
      return (
        <Typography variant="p" as="div">
          Pending
          <QuestionHelper
            text={`To earn network fees, stake BALN from your wallet.`}
          />
        </Typography>
      );
    } else if (hasFee) {
      return (
        <>
          {fees &&
            Object.keys(fees)
              .filter(key => (fees[key] as BigNumber).isGreaterThan(0))
              .map(key => (
                <Typography key={key} variant="p">
                  {`${(fees[key] as BigNumber).toFixed(2)}`}{" "}
                  <Typography key={key} as="span" color="text1">
                    {/* {(fees[key] as BigNumber).currency.symbol} */}
                    ARCH
                  </Typography>
                </Typography>
              ))}

          <Button mt={2} onClick={toggleOpen}>
            {count && count > 1 ? `Claim (1 of ${count})` : `Claim`}
          </Button>
        </>
      );
    } else {
      return (
        <Typography variant="p" as="div">
          Ineligible
          <QuestionHelper
            text={`To earn network fees, stake BALN from your wallet.`}
          />
        </Typography>
      );
    }
  };

  return (
    <Flex flex={1} flexDirection="column" alignItems="center">
      <Typography variant="p" mb={2} as="div">
        Network fees
      </Typography>
      {getNetworkFeesUI()}

      <Modal isOpen={open} onDismiss={toggleOpen}>
        <ModalContent>
          <Typography textAlign="center" mb={1}>
            Claim network fees?
          </Typography>

          <Flex flexDirection="column" alignItems="center" mt={2}>
            {fees &&
              Object.keys(fees)
                .filter(key => (fees[key] as BigNumber).isGreaterThan(0))
                .map(key => (
                  <Typography key={key} variant="p">
                    {`${(fees[key] as BigNumber).toFixed(2)}`}{" "}
                    <Typography key={key} as="span" color="text1">
                      ARCH
                    </Typography>
                  </Typography>
                ))}
          </Flex>

          <Flex justifyContent="center" mt={4} pt={4} className="border-top">
            <TextButton onClick={toggleOpen} fontSize={14}>
              Not now
            </TextButton>
            <Button onClick={handleFeeClaim} fontSize={14}>
              Claim
            </Button>
          </Flex>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

const RewardsPanel = () => {
  const API_ENDPOINT = "https://torii-liquid-staking.techiast.com";
  const [Reward, setReward] = React.useState("");
  const [APY, setAPY] = React.useState("");
  const [{ userAddress: account }] = useAppStore();

  React.useEffect(() => {
    (async () => {
      if (account) {
        const { data: reward } = await axios.get(
          `${API_ENDPOINT}/swap/query-reward?address=${account}`
        );
        if (reward) {
          setReward(reward);
          console.log("Reward", reward);
        }
      }
      const { data: APY } = await axios.get(
        `${API_ENDPOINT}/swap/query-reward-ratio`
      );
      if (APY) {
        setAPY(APY);
        console.log("APY", APY);
      }
    })();
  });

  return (
    <div>
      <BoxPanel bg="bg2">
        <Flex alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h2">Rewards (24hr)</Typography>
        </Flex>
        <Flex my={5}>
          <Box width={1 / 2} className="border-right">
            <RewardSection />
          </Box>

          <Box width={1 / 2}>
            <Typography textAlign="center">APY</Typography>
            <Typography variant="p" textAlign="center">
              {APY === "" ? "-" : parseFloat(APY).toFixed(2)}%
            </Typography>
          </Box>
        </Flex>
      </BoxPanel>
    </div>
  );
};

export default RewardsPanel;
