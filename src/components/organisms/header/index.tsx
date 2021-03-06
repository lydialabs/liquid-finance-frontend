import React, { useEffect, useState } from "react";

import ClickAwayListener from "react-click-away-listener";
import { useMedia } from "react-use";
import { Flex, Box } from "rebass/styled-components";
import styled from "styled-components";

import WalletIcon from "assets/icons/wallet.svg";
import Logo from "components/atom/logo";
import { Button, IconButton } from "components/atom/button";
import { Link } from "components/atom/link";
import { Typography } from "components/theme";
import { MouseoverTooltip } from "components/molecules/tooltip";
import { DropdownPopper } from "components/molecules/popover";
import { shortenAddress } from "utils/common";
import WalletModal from "../walletmodal";
import { ChainInfo } from "consts/chain";
import { AppStoreInterface, useAppStore } from "store";
import {
  getAccountStorage,
  removeAccountStorage,
  setAccountStorage,
} from "helpers/storage";
import { LiquidSigningCosmWasmClient } from "lib/cosmwasm";
import { GasPrice } from "@cosmjs/stargate";
import { Currency } from "types";
import { arch } from "lib";

const StyledLogo = styled(Logo)`
  margin-right: 15px;

  ${({ theme }) => theme.mediaWidth.upSmall`
    margin-right: 50px;
  `}
`;

const WalletInfo = styled(Box)`
  text-align: right;
  margin-right: 15px;
  min-height: 42px;
`;

const WalletButtonWrapper = styled.div``;

const WalletMenu = styled.div`
  max-width: 192px;
  font-size: 14px;
  padding: 25px;
  display: grid;
  grid-template-rows: auto;
  justify-items: center;
  grid-gap: 20px;
`;

const WalletMenuButton = styled(Button)`
  padding: 7px 25px;
`;

const ChangeWalletButton = styled(Link)`
  cursor: pointer;
`;

const StyledAddress = styled(Typography)`
  :hover {
    color: rgba(220, 76, 26, 1);
    cursor: pointer;
  }
`;

export default function Header(props: { title?: string; className?: string }) {
  const { className, title } = props;

  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const walletButtonRef = React.useRef<HTMLElement>(null);

  const [isCopied, updateCopyState] = React.useState(false);

  const toggleWalletMenu = () => {
    setAnchor(anchor ? null : walletButtonRef.current);
  };
  const closeWalletMenu = () => setAnchor(null);

  const [toggleWalletModal, setToggleWalletModal] = useState(false);
  const [
    { userAddress: account, refreshBalances, queryHandler, CosmWasmClient },
    updateAppStore,
  ] = useAppStore();

  async function connectWallet() {
    console.log("Connecting wallet...");
    try {
      if (window) {
        if (window["keplr"]) {
          if (window.keplr["experimentalSuggestChain"]) {
            await window.keplr.experimentalSuggestChain(ChainInfo);
            await window.keplr.enable(ChainInfo.chainId);
            const offlineSigner = await window.getOfflineSigner(
              ChainInfo.chainId
            );
            console.log("offlineSigner", offlineSigner);
            const cwClient =
              await LiquidSigningCosmWasmClient.connectWithSigner(
                {
                  url: ChainInfo.rpc,
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                },
                offlineSigner
              );
            const accounts = await offlineSigner.getAccounts();
            const gasPrice = GasPrice.fromString("0.002uconst");
            const userAddress = accounts[0].address;

            const queryHandler =
              cwClient.getQueryHandler()?.wasm.queryContractSmart;

            const walletInfo = {
              offlineSigner: offlineSigner,
              CosmWasmClient: cwClient,
              accounts: accounts,
              gasPrice: gasPrice,
              queryHandler: queryHandler,
              userAddress: userAddress,
              refreshBalances: true,
            };

            console.log("walletInfo", walletInfo);

            updateAppStore((draft: AppStoreInterface) => ({
              ...draft,
              ...walletInfo,
            }));
            setAccountStorage(userAddress);
          } else {
            console.warn(
              "Error accessing experimental features, please update Keplr"
            );
          }
        } else {
          window.open(
            "https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap",
            "_blank"
          );
        }
      } else {
        console.warn("Error parsing window object");
      }
    } catch (e) {
      console.error("Error connecting to wallet", e);
    }
  }

  useEffect(() => {
    const accountStorage = getAccountStorage();
    if (!accountStorage || account) return;
    connectWallet();
  }, []);

  useEffect(() => {
    if (refreshBalances) {
      (async () => {
        if (!account || !queryHandler) return;
        const lBalance = await arch.Larch.balance({ queryHandler }, account);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const balance = await CosmWasmClient!.getBalance(
          account,
          ChainInfo.stakeCurrency.coinMinimalDenom
        );
        const statusInforResult = await arch.Swap.statusInfo({ queryHandler });
        const orderInfoOfResult = await arch.Swap.orderInfoOf(
          { queryHandler },
          account
        );
        const statusStakingInfoResult = await arch.Staking.statusStakingInfo({
          queryHandler,
        });

        updateAppStore((draft: AppStoreInterface) => {
          draft.archBalance = {
            amount: balance.amount,
            symbol: "ARCH",
          };
          draft.larchBalance = {
            amount: lBalance?.balance,
            symbol: "lARCH",
          };
          draft.statusInfo = statusInforResult;
          draft.orderInfoOf = orderInfoOfResult;
          draft.statusStakingInfo = statusStakingInfoResult;
          draft.refreshBalances = false;
        });
      })();
    }
  }, [refreshBalances, account, queryHandler]);

  const disconnect = React.useCallback(() => {
    updateAppStore((draft: AppStoreInterface) => {
      draft.userAddress = null;
    });
    removeAccountStorage();
  }, []);

  const handleChangeWallet = () => {
    closeWalletMenu();
    setToggleWalletModal(false);
  };

  const handleDisconnectWallet = async () => {
    closeWalletMenu();
    setToggleWalletModal(false);
    disconnect();
  };

  const copyAddress = React.useCallback(async (account: string) => {
    await navigator.clipboard.writeText(account);
    updateCopyState(true);
  }, []);

  const upSmall = useMedia("(min-width: 800px)");

  return (
    <header className={className}>
      <Flex justifyContent="space-between">
        <Flex alignItems="center">
          <StyledLogo />
          <Typography variant="h1">{title}</Typography>
        </Flex>
        {!account && (
          <Flex alignItems="center">
            <Button onClick={() => setToggleWalletModal(true)}>Sign in</Button>
          </Flex>
        )}

        <WalletModal
          isOpen={toggleWalletModal}
          onDismiss={() => {
            setToggleWalletModal(!toggleWalletModal);
          }}
          onConnectWallet={() => {
            closeWalletMenu();
            setToggleWalletModal(!toggleWalletModal);
            connectWallet();
          }}
        />

        {account && upSmall && (
          <Flex alignItems="center">
            <WalletInfo>
              <Typography variant="p" textAlign="right">
                Wallet
              </Typography>

              <MouseoverTooltip
                text={isCopied ? "Copied" : "Copy address"}
                placement="left"
                noArrowAndBorder
              >
                <StyledAddress
                  onMouseLeave={() => {
                    setTimeout(() => updateCopyState(false), 250);
                  }}
                  onClick={() => copyAddress(account)}
                >
                  {shortenAddress(account)}
                </StyledAddress>
              </MouseoverTooltip>
            </WalletInfo>

            <WalletButtonWrapper>
              <ClickAwayListener onClickAway={closeWalletMenu}>
                <div>
                  <IconButton ref={walletButtonRef} onClick={toggleWalletMenu}>
                    <WalletIcon />
                  </IconButton>

                  <DropdownPopper
                    show={Boolean(anchor)}
                    anchorEl={anchor}
                    placement="bottom-end"
                  >
                    <WalletMenu>
                      <ChangeWalletButton onClick={handleChangeWallet}>
                        Change wallet
                      </ChangeWalletButton>
                      <WalletMenuButton onClick={handleDisconnectWallet}>
                        Sign out
                      </WalletMenuButton>
                    </WalletMenu>
                  </DropdownPopper>
                </div>
              </ClickAwayListener>
            </WalletButtonWrapper>
          </Flex>
        )}
      </Flex>
    </header>
  );
}
