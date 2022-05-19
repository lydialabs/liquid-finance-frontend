import React from "react";

import { isMobile } from "react-device-detect";
import { Flex, Box, Text } from "rebass/styled-components";
import styled from "styled-components";

import IconWalletIcon from "assets/icons/ARCH.svg";
import LedgerIcon from "assets/icons/ledger.svg";
import { VerticalDivider } from "components/atom/divider";
import { Typography } from "components/theme";
import { Link } from "components/atom/link";
import Modal, { ModalProps } from "../modal";

const WalletOption = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 5px 20px;
  margin: 0px 10px;
  border-radius: 10px;
  text-decoration: none;
  color: #1a334d;
  user-select: none;
  border: 2px solid #fff;

  @media (min-width: 360px) {
    width: 140px;
  }

  > *:first-child {
    margin-bottom: 10px;
  }

  background-color: ${({ theme }) => theme.colors.bg3};

  &[disabled] {
    background: rgba(255, 255, 255, 0.15);
    cursor: default;
    pointer-events: none;
  }

  :not([disabled]):hover {
    border: 2px solid #1a334d;
    opacity: 1;
  }
`;

const StyledModal = styled(
  ({ mobile, ...rest }: ModalProps & { mobile?: boolean }) => (
    <Modal {...rest} />
  )
).attrs({
  "aria-label": "dialog",
})`
  &[data-reach-dialog-content] {
    ${({ mobile, theme }) =>
      !mobile &&
      `
      width: 320px;

      @media (min-width: 360px) {
        width: 100%;
        max-width: 360px;
      }
    `}
  }
`;

const Wrapper = styled.div`
  width: 100%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-sizing: border-box;
`;

interface WalletModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  onConnectWallet?: (e?: React.MouseEvent<HTMLElement>) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onDismiss,
  onConnectWallet,
}) => {
  return (
    <StyledModal isOpen={isOpen} onDismiss={onDismiss} mobile={isMobile}>
      <Wrapper>
        <Flex alignItems="stretch" justifyContent="space-between">
          <WalletOption onClick={onConnectWallet}>
            <IconWalletIcon width="50" height="50" />
            <Text>ARCH</Text>
          </WalletOption>

          <VerticalDivider text="or"></VerticalDivider>

          <WalletOption disabled>
            <LedgerIcon width="50" height="50" />
            <Text>Ledger</Text>
          </WalletOption>
        </Flex>

        <Typography textAlign="center">
          Use at your own risk. Project contributors are not liable for any lost
          or stolen funds.
          <Link href="/" target="_blank">
            View disclaimer
          </Link>
        </Typography>
      </Wrapper>
    </StyledModal>
  );
};
export default WalletModal;
