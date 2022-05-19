import React, { useState } from "react";

import styled from "styled-components";

import ArchwayLogo from "assets/icons/logo-archway.svg";
import { MouseoverTooltip } from "../../molecules/tooltip";
import Link from "next/link";

import { ImageProps } from "rebass";

const LogoImg = styled.div`
  width: 75px;
  cursor: pointer;

  ${({ theme }) => theme.mediaWidth.upSmall`
    width: 100px;
  `}
`;

export default function Logo(props: any) {
  return (
    <div {...props}>
      <Link href="/">
        <a>
          <MouseoverTooltip
            text="Back to the Home"
            placement="right"
            noArrowAndBorder
          >
            <LogoImg>
              <ArchwayLogo width="100%" />
            </LogoImg>
          </MouseoverTooltip>
        </a>
      </Link>
    </div>
  );
}

const BAD_SRCS: { [tokenAddress: string]: true } = {};

interface LogoProps extends Pick<ImageProps, "style" | "alt" | "className"> {
  srcs: string[];
}

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
export const NativeLogo = ({ srcs, alt, style, ...rest }: LogoProps) => {
  const [, refresh] = useState<number>(0);

  const src: string | undefined = srcs.find(src => !BAD_SRCS[src]);

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...rest}
        alt={alt}
        src={src}
        style={style}
        onError={() => {
          if (src) BAD_SRCS[src] = true;
          refresh(i => i + 1);
        }}
      />
    );
  }
};
