import React, { useEffect, useState } from "react";

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@reach/accordion";
import BigNumber from "bignumber.js";
import { useMedia } from "react-use";
import { Box } from "rebass/styled-components";
import styled, { css } from "styled-components";

import "@reach/tabs/styles.css";
import CurrencyLogo from "components/atom/currencylogo";
import { Typography } from "components/theme";
import { BoxPanel } from "components/molecules/panel";
import { notificationCSS } from "components/organisms/wallet/util";
import { ZERO } from "consts/currency";
import ARCHWallet from "components/organisms/wallet/ARCHWallet";
import lARCHWallet from "components/organisms/wallet/lARCHWallet";
import { Currency } from "types";
import { useAppStore } from "store";
import { Arch, arch } from "lib";
import { ONE } from "components/util/chart";

const AssetSymbol = styled.div`
  display: grid;
  grid-column-gap: 12px;
  grid-template-columns: auto 1fr;
  align-items: center;
`;

const DashGrid = styled.div`
  display: grid;
  grid-template-columns: 3fr 5fr;
  grid-template-areas: "asset balance&value";
  align-items: center;

  ${({ theme }) => theme.mediaWidth.up500`
    grid-template-columns: 1fr 3fr;
  `}

  & > * {
    justify-content: flex-end;
    text-align: right;

    &:first-child {
      justify-content: flex-start;
      text-align: left;
    }
  }
`;

const HeaderText = styled(Typography)`
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 3px;

  &:last-of-type {
    padding-right: 25px;
  }
`;

const DataText = styled(Typography)`
  font-size: 16px;
`;

const StyledDataText = styled(DataText)<{ hasNotification?: boolean }>`
  padding-right: 25px;
  position: relative;

  &:before,
  &:after {
    content: "";
    width: 2px;
    height: 10px;
    background: #697a8c;
    display: inline-block;
    position: absolute;
    top: -4px;
    transition: all ease 0.2s;

    ${({ theme }) => theme.mediaWidth.up500`
      top: 7px;
    `}
  }

  &:before {
    transform: rotate(45deg);
    right: 2px;
  }

  &:after {
    transform: rotate(-45deg);
    right: 8px;
  }

  ${({ hasNotification }) => hasNotification && notificationCSS}
  ${({ hasNotification }) =>
    hasNotification &&
    css`
      &:before,
      &:after {
        top: -4px;
        ${({ theme }) => theme.mediaWidth.up500`
          top: 7px;
        `}
      }
    `}
`;

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`;

const StyledAccordionPanel = styled(AccordionPanel)`
  overflow: hidden;
  max-height: 0;
  transition: all ease-in-out 0.5s;
  &[data-state="open"] {
    max-height: 400px;
  }
`;

const BalanceAndValueWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  ${DataText}, ${StyledDataText}, ${HeaderText} {
    width: 100%;

    ${({ theme }) => theme.mediaWidth.up500`
      flex: 1;
    `}
  }

  ${DataText} {
    padding-right: 25px;

    ${({ theme }) => theme.mediaWidth.up500`
      padding-right: 0;
    `}
  }

  ${StyledDataText} {
    color: #697a8c;
    font-size: 14px;
    padding-right: 25px;

    ${({ theme }) => theme.mediaWidth.up500`
      font-size: 16px;
      color: ${theme.colors.text};
    `}
  }
`;

const ListItem = styled(DashGrid)<{ border?: boolean }>`
  padding: 15px 0;
  cursor: pointer;
  border-bottom: ${({ border = true }) =>
    border ? "1px solid rgba(255, 255, 255, 0.15)" : "none"};

  ${({ theme }) => theme.mediaWidth.up500`
    padding: 20px 0;
  `}

  & > div,
  ${BalanceAndValueWrap} > div {
    transition: color 0.2s ease;
  }

  :hover {
    & > div,
    ${BalanceAndValueWrap} > div {
      color: ${({ theme }) => theme.colors.primary};

      &:before,
      &:after {
        background: ${({ theme }) => theme.colors.primary};
      }
    }
  }
`;

const StyledAccordionButton = styled(AccordionButton)<{ currency?: string }>`
  width: 100%;
  appearance: none;
  background: 0;
  border: 0;
  box-shadow: none;
  padding: 0;
  position: relative;

  &:before {
    content: "";
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 12px solid rgba(255, 255, 255, 1);
    position: absolute;
    transition: all ease-in-out 200ms;
    transition-delay: 200ms;
    transform: translate3d(0, 20px, 0);
    opacity: 0;
    pointer-events: none;
    bottom: 0;
    ${({ currency = "ARCH" }) =>
      currency === "ARCH"
        ? "left: 37px"
        : currency === "lARCH"
        ? "left: 42px"
        : currency === "bnUSD"
        ? "left: 47px"
        : currency === "BALN"
        ? "left: 43px"
        : "left: 40px"}
  }

  &[aria-expanded="false"] {
    & > ${ListItem} {
      transition: border-bottom ease-out 50ms 480ms;
    }
  }

  &[aria-expanded="true"] {
    &:before {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
    & > ${ListItem} {
      border-bottom: 1px solid transparent;

      & > div,
      ${BalanceAndValueWrap} > div {
        color: ${({ theme }) => theme.colors.primary};

        &:before,
        &:after {
          background: ${({ theme }) => theme.colors.primary};
          width: 2px;
          height: 10px;
          border-radius: 0;
          animation: none;
        }

        &:before {
          transform: rotate(135deg);
          right: 2px;
        }

        &:after {
          transform: rotate(-135deg);
          right: 8px;
        }
      }
    }
  }
`;

const Wrapper = styled.div``;

const WalletUIs = {
  ARCH: ARCHWallet,
  lARCH: lARCHWallet,
};

const WalletPanel = () => {
  // const balances = useWalletBalances();
  // const transactions = useAllTransactions();
  const [claimableARCH, setClaimableARCH] = useState(ZERO);
  const [balanceValue, setBalanceValue] = useState(ZERO);
  const [balanceValuelARCH, setBalanceValuelARCH] = useState(ZERO);
  const [
    {
      userAddress: account,
      archBalance,
      larchBalance,
      statusInfo,
      ...appStore
    },
    updateAppStore,
  ] = useAppStore();

  useEffect(() => {
    (async () => {
      if (account) {
        setTimeout(async () => {
          if (archBalance) {
            const balances = Arch.utils.toFormat(archBalance.amount);
            setBalanceValue(new BigNumber(balances));
          }
          if (larchBalance) {
            const balances = Arch.utils.toFormat(larchBalance.amount);
            setBalanceValuelARCH(new BigNumber(balances));
          }
          const claimableValue = await arch.Staking.claimableOf(
            appStore,
            account
          );
          console.log("claimableValue", claimableValue);
          setClaimableARCH(Arch.utils.toFormat(claimableValue?.balance || "0"));
        }, 300);
      }
    })();
  }, [account, archBalance]);
  // const details = {
  //   "Staked balance": new BigNumber(123),
  //   "Unstaking balance": undefined,
  //   "Total balance": new BigNumber(123),
  // };
  // const stakedBALN: BigNumber = React.useMemo(
  //   () => details["Staked balance"] || ZERO,
  //   [details]
  // );
  // const unstakingBALN: BigNumber = React.useMemo(
  //   () => details["Unstaking balance"] || ZERO,
  //   [details]
  // );
  // const totalBALN: BigNumber = React.useMemo(
  //   () => details["Total balance"] || ZERO,
  //   [details]
  // );
  // const isAvailable =
  //   stakedBALN.isGreaterThan(ZERO) || unstakingBALN.isGreaterThan(ZERO);
  const isSmallScreen = useMedia(`(max-width: 499px)`);

  // const balnAddress = bnJs.BALN.address;
  const currency: Currency = {
    amount: 10,
    symbol: "ARCH",
  };

  const currencylARCH: Currency = {
    amount: 10,
    symbol: "lARCH",
  };

  // rates: using symbol as key?
  // const { data: rates } = useRatesQuery();
  // const rateFracs = React.useMemo(() => {
  //   if (rates) {
  //     return Object.keys(rates).reduce((acc, key) => {
  //       acc[key] = toFraction(rates[key]);
  //       return acc;
  //     }, {});
  //   }
  // }, [rates]);

  // useEffect(() => {
  //   (async () => {
  //     if (account) {
  //       const result = await bnJs.Staking.getClaimableARCH(account);
  //       setClaimableARCH(BalancedJs.utils.toARCH(result));
  //     }
  //   })();
  // }, [account, transactions]);

  // const availableBALN = balances && balances[balnAddress] && (
  //   <Typography color="rgba(255,255,255,0.75)">
  //     Available: {balances[balnAddress].toFixed(2, { groupSeparator: "," })}
  //   </Typography>
  // );
  const balances: { [key: string]: BigNumber } = {
    zcvv00xxxpppp: new BigNumber(123),
  };

  //TODO: update when mainnet is ready
  const dollarRate = ONE;
  return (
    <BoxPanel bg="bg2" minHeight={195} height={"100%"}>
      <Typography variant="h2" mb={5}>
        Wallet
      </Typography>

      {!account ? (
        <Wrapper>
          <Typography textAlign="center" paddingTop={"20px"}>
            Please sign in to use the Wallet section.
          </Typography>
        </Wrapper>
      ) : balances &&
        Object.keys(balances).filter(
          (address: string) => balances[address].toFixed(2) !== "0.00"
        ).length ? (
        <Wrapper>
          <DashGrid>
            <HeaderText>Asset</HeaderText>
            <BalanceAndValueWrap>
              <HeaderText>Balance</HeaderText>
              {isSmallScreen ? null : <HeaderText>Value</HeaderText>}
            </BalanceAndValueWrap>
          </DashGrid>

          <List>
            <Accordion collapsible>
              <AccordionItem key={"ARCH"}>
                <StyledAccordionButton currency={"ARCH"}>
                  <ListItem border={false}>
                    <AssetSymbol>
                      <CurrencyLogo
                        currency={currency}
                        style={{ marginTop: -2 }}
                      />
                      <Typography fontSize={16} fontWeight="bold">
                        ARCH
                      </Typography>
                    </AssetSymbol>

                    <BalanceAndValueWrap>
                      <DataText as="div">
                        {!account ? "-" : balanceValue.dp(5).toFormat()}
                      </DataText>

                      <StyledDataText
                        as="div"
                        hasNotification={
                          currency.symbol === "ARCH" &&
                          claimableARCH.isGreaterThan(0)
                        }
                      >
                        {!account
                          ? "-"
                          : `$ ${Arch.utils
                              .toFormat(archBalance?.amount || ZERO)
                              .times(dollarRate)
                              .dp(5)
                              .toFormat()}`}
                      </StyledDataText>
                    </BalanceAndValueWrap>
                  </ListItem>
                </StyledAccordionButton>

                <StyledAccordionPanel hidden={false}>
                  <BoxPanel bg="bg3">
                    <WalletUIs.ARCH
                      currency={currency}
                      claimableARCH={claimableARCH}
                    />
                  </BoxPanel>
                </StyledAccordionPanel>
              </AccordionItem>
              <AccordionItem key={"lARCH"}>
                <StyledAccordionButton currency={"lARCH"}>
                  <ListItem border={false}>
                    <AssetSymbol>
                      <CurrencyLogo
                        currency={currencylARCH}
                        style={{ marginTop: -2 }}
                      />
                      <Typography fontSize={16} fontWeight="bold">
                        lARCH
                      </Typography>
                    </AssetSymbol>

                    <BalanceAndValueWrap>
                      <DataText as="div">
                        {!account ? "-" : balanceValuelARCH.dp(5).toFormat()}
                      </DataText>

                      <StyledDataText as="div">
                        {!account
                          ? "-"
                          : `$ ${Arch.utils
                              .toFormat(larchBalance?.amount || ZERO)
                              .times(dollarRate)
                              .dp(5)
                              .toFormat()}`}
                      </StyledDataText>
                    </BalanceAndValueWrap>
                  </ListItem>
                </StyledAccordionButton>

                <StyledAccordionPanel hidden={false}>
                  <BoxPanel bg="bg3">
                    <WalletUIs.lARCH currency={currencylARCH} />
                  </BoxPanel>
                </StyledAccordionPanel>
              </AccordionItem>
            </Accordion>
          </List>
        </Wrapper>
      ) : (
        <Wrapper>
          <Typography textAlign="center" paddingTop={"20px"}>
            No assets available.
          </Typography>
        </Wrapper>
      )}
    </BoxPanel>
  );
};

export default WalletPanel;
