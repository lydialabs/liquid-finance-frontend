import React from "react";

import { Box } from "rebass/styled-components";
import styled from "styled-components";

import Header from "../header";

const StyledHeader = styled(Header)`
  margin-top: 25px;
  margin-bottom: 25px;

  ${({ theme }) => theme.mediaWidth.upMedium`
    margin-top: 50px;
    margin-bottom: 50px;
  `}
`;

export const Container = styled(Box)`
  /* disable margin collapse */
  display: flex;
  flex-direction: column;
  max-width: 1280px;
  min-height: 100vh;
  margin-left: auto;
  margin-right: auto;
  padding-left: 16px;
  padding-right: 16px;

  ${({ theme }) => theme.mediaWidth.upMedium`
    padding-left: 40px;
    padding-right: 40px;
  `}
`;

export const DefaultLayout: React.FC<{ title?: string }> = props => {
  const { children, title = "Home" } = props;

  return (
    <>
      <Container>
        <StyledHeader title={title} />
        <Box>{children}</Box>
      </Container>
    </>
  );
};
