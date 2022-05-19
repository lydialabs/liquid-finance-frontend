import React from "react";

import { Flex } from "rebass/styled-components";
import styled, { css } from "styled-components";

import FailureIcon from "assets/icons/failure.svg";
import PendingIcon from "assets/icons/pending.svg";
import SuccessIcon from "assets/icons/success.svg";
import { Typography } from "components/theme";
import { TypeNotification } from "store";

type NotificationProps = {
  closeToast?: () => void;
  summary?: string;
  type?: TypeNotification;
  show: boolean;
};

export const SHOWING_TIME = 5000;

const NotificationContainer = styled(Flex)<{ show: boolean }>`
  position: fixed;
  right: 40px;
  bottom: 40px;
  z-index: 99999;
  box-sizing: border-box;
  border-radius: 10px;
  background: rgba(255, 255, 255, 1);
  overflow-x: hidden;
  visibility: ${({ show }) => (show ? "visible" : "hidden")};
  box-shadow: 0px 1px 15px rgba(0, 0, 0, 20%);

  ${({ show }) =>
    show &&
    css`
      width: 320px;
      padding: 24px 16px 20px;
      box-shadow: 0px 1px 15px rgba(0, 0, 0, 20%);
    `}

  & .timeBar {
    position: absolute;
    bottom: 0;
    left: 0;
    content: "";
    width: 100%;
    height: 3px;
    background: rgba(153, 195, 239);

    &.showing {
      transition: all ${() => `${SHOWING_TIME}ms`} linear;
      width: 0;
    }
  }
`;

const TransactionStatus = styled(Flex)`
  margin-right: 10px;
`;

const TransactionInfo = styled(Flex)``;

const TransactionInfoBody = styled.div``;

const Notification = ({ summary, type, show }: NotificationProps) => {
  return (
    <NotificationContainer show={show}>
      <div
        className={`timeBar ${
          show && type && type !== "pending" ? "showing" : ""
        }`}
      ></div>
      {type ? (
        <TransactionStatus alignItems="center" flexShrink={0}>
          {type === "pending" ? (
            <PendingIcon width={20} height={20} />
          ) : type === "success" ? (
            <SuccessIcon width={20} height={20} />
          ) : (
            <FailureIcon width={20} height={20} />
          )}
        </TransactionStatus>
      ) : null}
      {type === "error" ? (
        <TransactionInfo flexDirection="column">
          <TransactionInfoBody>
            <Typography variant="p" fontWeight={500}>
              Couldn't complete your transaction.
            </Typography>
          </TransactionInfoBody>
          <TransactionInfoBody>
            <Typography variant="p" fontWeight={500} color="alert">
              {summary}
            </Typography>
          </TransactionInfoBody>
        </TransactionInfo>
      ) : (
        <TransactionInfo>
          <Typography variant="p" fontWeight={500}>
            {summary}
          </Typography>
        </TransactionInfo>
      )}
    </NotificationContainer>
  );
};

export default Notification;
