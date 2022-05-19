import { Typography } from "components/theme";
import React from "react";

import { FlexProps, Flex, Box, BoxProps } from "rebass/styled-components";
import styled from "styled-components";

export function CurrencyBalanceErrorMessage(props: BoxProps) {
  const MINIMUM_ARCH_FOR_TX = 1;
  return (
    <Flex justifyContent="center" {...props}>
      <Typography maxWidth="320px" color="alert" textAlign="center">
        {`You need at least ${MINIMUM_ARCH_FOR_TX} ARCH in your wallet to complete this transaction.`}
      </Typography>
    </Flex>
  );
}

const MessageBox = styled(Box)`
  padding-top: 5px;
  text-align: center;
  color: white;
`;

export function LedgerConfirmMessage(props: BoxProps) {
  const shouldLedgerSign = false;

  return (
    <>
      {shouldLedgerSign && (
        <MessageBox {...props}>
          Confirm the transaction on your Ledger.
        </MessageBox>
      )}
    </>
  );
}

interface Props extends FlexProps {
  noCurrencyBalanceErrorMessage?: boolean;
  noMessages?: boolean;
}
const ModalContentWrapper = styled(Flex)`
  width: 100%;
  align-items: stretch;
  flex-direction: column;
  margin: 25px;
`;

export default function ModalContent(props: Props) {
  const hasEnoughARCH = true;

  return (
    <ModalContentWrapper {...props}>
      {props.children}
      {!props.noMessages && (
        <>
          <LedgerConfirmMessage />
          {!hasEnoughARCH && !props.noCurrencyBalanceErrorMessage && (
            <CurrencyBalanceErrorMessage mt={3} />
          )}
        </>
      )}
    </ModalContentWrapper>
  );
}
