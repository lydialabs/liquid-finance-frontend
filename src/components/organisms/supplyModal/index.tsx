import React from "react";

import { Box, Flex } from "rebass/styled-components";

import { Button, TextButton } from "components/atom/button";
import { Typography } from "components/theme";
import Modal from "../modal";
import ModalContent from "../modalcontent";

// const SupplyButton = styled(Button)`
//   padding: 5px 10px;
//   font-size: 12px;
// `;

// const RemoveButton = styled(SupplyButton)`
//   background-color: transparent;
//   font-size: 14px;
//   color: #fb6a6a;
//   padding-top: 4px;
//   padding-bottom: 4px;
//   margin-top: 6px;
//   margin-bottom: 4px;

//   &:hover {
//     background-color: transparent;
//   }

//   &:disabled {
//     color: #fb6a6a;
//     background-color: transparent;
//   }
// `;

// const StyledDL = styled.dl`
//   margin: 15px 0 15px 0;
//   text-align: center;
// `;

// const StyledEmpty = styled.dl`
//   padding: 18px 0 18px 0;
//   text-align: center;
// `;

// const CheckIconWrapper = styled.div`
//   padding-top: 16px;
//   padding-bottom: 16px;
//   display: block;
//   margin: auto;
//   width: 25px;
// `;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  parsedAmounts: any;
  currencies: any;
  onSupplyConfirm: () => void;
}
export default function SupplyLiquidityModal({
  isOpen,
  onClose,
  parsedAmounts,
  currencies,
  onSupplyConfirm,
}: ModalProps) {
  const isQueue = true;
  const pair = true;
  const hasErrorMessage = false;
  const isEnabled = true;
  const hasEnoughARCH = true;
  const handleSupplyConfirm = () => console.log("confirm");
  const handleCancelSupply = () => console.log("cancel");
  const confirmTx = true;
  return (
    <Modal isOpen={isOpen} onDismiss={onClose}>
      <ModalContent>
        <Typography textAlign="center" mb={2} as="h3" fontWeight="normal">
          Supply liquidity?
        </Typography>
        <Flex alignItems="center" hidden={!isQueue}>
          <Box width={1}>
            <Typography variant="p" fontWeight="bold" textAlign={"center"}>
              {`${parsedAmounts} ${currencies}`}
            </Typography>

            <Typography mt={2} textAlign="center">
              Your ARCH will be locked for 24 hours.
            </Typography>
          </Box>
        </Flex>
        <Flex justifyContent="center" mt={4} pt={4} className="border-top">
          <TextButton onClick={onClose}>Cancel</TextButton>

          <Button
            disabled={!isEnabled || !hasEnoughARCH}
            onClick={onSupplyConfirm}
          >
            {confirmTx ? `Supplying` : `Supply`}
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
