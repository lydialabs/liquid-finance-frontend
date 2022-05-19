import React from "react";

import styled from "styled-components";

import { Currency } from "types";
import ArchIcon from "assets/icons/ARCH.png";
import lArchIcon from "assets/icons/lARCH.png";

const LOGOS = {
  ARCH: ArchIcon,
  lARCH: lArchIcon,
};

const getTokenLogoURL = (symbol?: string) => {
  return symbol && LOGOS[symbol as "ARCH" | "lARCH"].src;
};

const StyledLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  /* border-radius: ${({ size }) => size}; */
`;

export default function CurrencyLogo({
  currency,
  size = "20px",
  style,
}: {
  currency?: Currency | null;
  size?: string;
  style?: React.CSSProperties;
}) {
  return (
    <StyledLogo
      alt={currency?.symbol}
      size={size}
      style={style}
      src={getTokenLogoURL(currency?.symbol)}
    />
  );
}
