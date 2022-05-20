import React from "react";

import BigNumber from "bignumber.js";
// import lodash from "lodash";
// import Nouislider from "nouislider-react";
import ClickAwayListener from "react-click-away-listener";
import { useMedia } from "react-use";
import { Flex, Box } from "rebass/styled-components";
import styled from "styled-components";

import { Typography } from "components/theme";
import { BoxPanel } from "components/molecules/panel";
import { Button, TextButton } from "components/atom/button";
import CurrencyLogo from "components/atom/currencylogo";
import { DropdownPopper } from "components/molecules/popover";
// import { Pair } from "consts/currency";
import Modal from "../../../components/organisms/modal";
import { UnderlineTextWithArrow } from "components/molecules/dropdown";
import { showMessageOnBeforeUnload } from "utils/common";
import ModalContent from "components/organisms/modalcontent";
import { Currency } from "types";
import { ZERO } from "consts/currency";
import { AppStoreInterface, useAppStore } from "store";
import { arch, Arch } from "lib";
import { ONE } from "components/util/chart";

const TableWrapper = styled.div``;

const DashGrid = styled.div`
  display: grid;
  grid-template-columns: 4fr 5fr 3fr;
  gap: 10px;
  grid-template-areas: "name supply action";
  align-items: center;

  & > * {
    justify-content: flex-end;
    text-align: right;

    &:first-child {
      justify-content: flex-start;
      text-align: left;
    }
  }

  ${({ theme }) => theme.mediaWidth.upSmall`
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-areas: 'name supply share rewards action';
  `}
`;

const HeaderText = styled(Typography)`
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 3px;
`;

const DataText = styled(Box)`
  font-size: 16px;
`;

const ListItem = styled(DashGrid)<{ border?: boolean }>`
  padding: 20px 0;
  border-bottom: ${({ border = true }) =>
    border ? "1px solid rgba(255, 255, 255, 0.15)" : "none"};
  color: #1a334d;
`;
const OptionButton = styled(Box)`
  width: 96px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 10px;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text3};
  user-select: none;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.bg3};
  border: 2px solid ${({ theme }) => theme.colors.bg3};
  transition: border 0.3s ease;
  padding: 10px;
  transition: border 0.3s ease;

  &[disabled] {
    background: rgba(255, 255, 255, 0.15);
    cursor: default;
    pointer-events: none;
  }

  :hover {
    border: 2px solid ${({ theme }) => theme.colors.primary};
    transition: border 0.2s ease;
  }

  > svg {
    margin-bottom: 10px;
  }
`;
const WithdrawModalQ = ({
  onClose,
  balance,
  pair,
}: {
  pair?: any;
  balance?: any;
  onClose: () => void;
}) => {
  // const account = "abc";
  const [
    { userAddress: account, orderInfoOf, statusStakingInfo, ...appStore },
    updateAppStore,
  ] = useAppStore();

  const [open1, setOpen1] = React.useState(false);
  const toggleOpen1 = () => {
    setOpen1(!open1);
  };
  const handleOption1 = () => {
    toggleOpen1();
    onClose();
  };

  const [open2, setOpen2] = React.useState(false);
  const toggleOpen2 = () => {
    setOpen2(!open2);
  };
  const handleOption2 = () => {
    toggleOpen2();
    onClose();
  };

  const openNotification = (notify: any) => {
    updateAppStore((draf: AppStoreInterface) => {
      draf.notification = { ...notify, show: true };
    });
  };

  const hasEnoughARCH = true;
  const quotient1 = new BigNumber(0);
  const quotient2 = new BigNumber(1);

  const yourSupplyARCH = Arch.utils.toFormat(orderInfoOf?.native || 0).dp(5);
  const lARCH = statusStakingInfo
    ? yourSupplyARCH
        .times(ONE.div(new BigNumber(statusStakingInfo.ratio)))
        .dp(5)
        .toFormat()
    : "...";

  const currency1: Currency = {
    amount: yourSupplyARCH.toFormat(),
    symbol: "ARCH",
  };
  const currency2: Currency = {
    amount: lARCH,
    symbol: "lARCH",
  };

  const handleCancelOrder = () => {
    window.addEventListener("beforeunload", showMessageOnBeforeUnload);
    if (account) {
      openNotification({
        type: "pending",
        message: "Withdrawing ARCH...",
      });
      arch.Swap.remove(appStore, account)
        .then(res => {
          console.log(res);
          if (res.transactionHash) {
            openNotification({
              type: "success",
              message: `${currency1.amount} ARCH added to your wallet.`,
            });
            updateAppStore((draft: AppStoreInterface) => {
              draft.refreshBalances = true;
            });
            setOpen1(false);
          }
        })
        .catch(e => {
          console.error("error", e);
          setOpen1(false);
          openNotification({
            type: "error",
            message: "Couldn't withdraw ARCH. Try again.",
          });
        })
        .finally(() => {
          window.removeEventListener("beforeunload", showMessageOnBeforeUnload);
        });
    }
  };

  const handleWithdrawEarnings = () => {
    window.addEventListener("beforeunload", showMessageOnBeforeUnload);
    if (account) {
      openNotification({
        type: "pending",
        message: "Withdrawing lARCH...",
      });
      arch.Swap.claim(appStore, account)
        .then(res => {
          console.log(res);
          if (res.transactionHash) {
            openNotification({
              type: "success",
              message: `${currency1.amount} lARCH added to your wallet.`,
            });
            updateAppStore((draft: AppStoreInterface) => {
              draft.refreshBalances = true;
            });
            setOpen2(false);
          }
        })
        .catch(e => {
          console.error("error", e);
          setOpen2(false);
          openNotification({
            type: "error",
            message: "Couldn't withdraw lARCH. Try again.",
          });
        })
        .finally(() => {
          window.removeEventListener("beforeunload", showMessageOnBeforeUnload);
        });
    }
  };

  return (
    <>
      <Flex padding={5} bg="bg4" maxWidth={320} flexDirection="column">
        <Typography variant="h3" mb={3}>
          Withdraw:&nbsp;
          <Typography as="span">{`${"ARCH" || "..."} / ${
            "lARCH" || "..."
          }`}</Typography>
        </Typography>

        <Flex justifyContent="space-between">
          <OptionButton
            disabled={quotient1.isEqualTo(ZERO)}
            onClick={handleOption2}
            mr={2}
          >
            <CurrencyLogo currency={currency2} size={"35px"} />
            <Typography>
              {"0" || "..."} {currency2.symbol || "..."}
            </Typography>
          </OptionButton>

          <OptionButton
            disabled={quotient2.isEqualTo(ZERO)}
            onClick={handleOption1}
          >
            <CurrencyLogo currency={currency1} size={"35px"} />
            <Typography>
              {currency1.amount || "..."} {currency1.symbol || "..."}
            </Typography>
          </OptionButton>
        </Flex>
      </Flex>

      <Modal isOpen={open1} onDismiss={toggleOpen1}>
        <ModalContent>
          <Typography textAlign="center" mb={3} as="h3" fontWeight="normal">
            Withdraw liquidity?
          </Typography>

          <Typography variant="p" fontWeight="bold" textAlign="center">
            {currency1.amount || "..."} {currency1.symbol || "..."}
          </Typography>

          <Flex justifyContent="center" mt={4} pt={4} className="border-top">
            <TextButton onClick={toggleOpen1}>Cancel</TextButton>
            <Button onClick={handleCancelOrder} disabled={!hasEnoughARCH}>
              Withdraw
            </Button>
          </Flex>
        </ModalContent>
      </Modal>

      <Modal isOpen={open2} onDismiss={toggleOpen2}>
        <ModalContent>
          <Typography textAlign="center" mb={3} as="h3" fontWeight="normal">
            Withdraw lARCH?
          </Typography>

          <Typography variant="p" fontWeight="bold" textAlign="center">
            {currency2.amount || "..."} {currency2.symbol || "..."}
          </Typography>

          <Flex justifyContent="center" mt={4} pt={4} className="border-top">
            <TextButton onClick={toggleOpen2}>Cancel</TextButton>
            <Button onClick={handleWithdrawEarnings} disabled={!hasEnoughARCH}>
              Withdraw
            </Button>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};
const WithdrawText = ({
  pair,
  balance,
  poolId,
}: {
  pair: any;
  balance: any;
  poolId: number;
}) => {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);

  const arrowRef = React.useRef(null);
  console.log("arrowRef", arrowRef?.current);

  const toggle = () => {
    setAnchor(anchor ? null : arrowRef.current);
  };

  const close = () => {
    setAnchor(null);
  };

  return (
    <ClickAwayListener onClickAway={close}>
      <div>
        <UnderlineTextWithArrow
          onClick={toggle}
          text={`Withdraw`}
          ref={arrowRef}
        />
        <DropdownPopper show={!!anchor} anchorEl={anchor}>
          <WithdrawModalQ onClose={close} />
        </DropdownPopper>
      </div>
    </ClickAwayListener>
  );
};

const PoolRecordQ = ({
  border,
  balance,
  pair,
}: // totalReward,
{
  border: boolean;
  balance?: any;
  pair?: any;
  // totalReward: BigNumber;
}) => {
  const upSmall = useMedia("(min-width: 800px)");
  const [{ orderInfoOf, statusInfo }, updateAppStore] = useAppStore();

  // const { share, reward } = getShareReward(pair, balance, totalReward);
  const yourSupplyARCH = Arch.utils.toFormat(orderInfoOf?.native || 0);
  const lARCH = statusInfo
    ? yourSupplyARCH.times(new BigNumber(statusInfo.ratio)).dp(5).toFormat()
    : "...";

  return (
    <ListItem border={border}>
      <DataText>{`${"ARCH" || "..."} / ${"lARCH" || "..."}`}</DataText>
      <DataText>
        <Typography fontSize={16}>{`${
          orderInfoOf
            ? Arch.utils.toFormat(orderInfoOf.native).dp(5).toFormat()
            : "..."
        } ${"ARCH" || "..."}`}</Typography>
        <Typography color="text1">{`${0} ${"lARCH" || "..."}`}</Typography>
      </DataText>
      {upSmall && (
        <DataText>{`${
          statusInfo
            ? yourSupplyARCH
                .div(new BigNumber(Arch.utils.toFormat(statusInfo.balance)))
                .times(100)
                .dp(2)
                .toFormat()
            : "..."
        }%`}</DataText>
      )}
      {/* {upSmall && <DataText>{`~ ${"0.3163" || "---"} BALN`}</DataText>} */}
      <DataText>
        <WithdrawText pair={pair} balance={balance} poolId={1} />
      </DataText>
    </ListItem>
  );
};

export default function LiquidityDetails() {
  const upSmall = useMedia("(min-width: 800px)");

  // const account = "abc";

  // const trackedTokenPairs = "";

  // // fetch the reserves for all V2 pools
  // const pairs = true;

  // // fetch the user's balances of all tracked V2 LP tokens

  // const rewards = "0.3163";
  const userPools = [];

  return (
    <BoxPanel bg="bg2" mb={10}>
      <Typography variant="h2" mb={5}>
        Liquidity details
      </Typography>

      <TableWrapper>
        <DashGrid>
          <HeaderText>Pool</HeaderText>
          <HeaderText>Your supply</HeaderText>
          {upSmall && <HeaderText>Pool share</HeaderText>}
          {/* {upSmall && <HeaderText>Daily rewards</HeaderText>} */}
          <HeaderText></HeaderText>
        </DashGrid>

        <PoolRecordQ border={userPools.length !== 0} />
      </TableWrapper>
    </BoxPanel>
  );
}
