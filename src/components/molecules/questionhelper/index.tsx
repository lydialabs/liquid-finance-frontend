import React, { useCallback, useState } from "react";

import { Placement } from "@popperjs/core";
import { useMedia } from "react-use";
import styled from "styled-components";

import QuestionIcon from "assets/icons/question.svg";
import Tooltip from "../tooltip";

export const QuestionWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  outline: none;
  cursor: help;
  color: ${({ theme }) => theme.colors.text3};
`;

export default function QuestionHelper({
  text,
  placement = "top",
  containerStyle,
}: {
  text: React.ReactNode;
  placement?: Placement;
  containerStyle?: React.CSSProperties;
}) {
  const [show, setShow] = useState<boolean>(false);

  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);

  const smallSp = useMedia("(max-width: 360px)");

  return (
    <span style={{ marginLeft: 4, verticalAlign: "top" }}>
      <Tooltip
        text={text}
        show={show}
        placement={placement}
        containerStyle={containerStyle}
      >
        {!smallSp && (
          <QuestionWrapper
            onClick={open}
            onMouseEnter={open}
            onMouseLeave={close}
          >
            <QuestionIcon width={14} />
          </QuestionWrapper>
        )}
      </Tooltip>
    </span>
  );
}
