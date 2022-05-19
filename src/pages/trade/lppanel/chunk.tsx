import BigNumber from "bignumber.js";
import { Typography } from "components/theme";
import { Arch } from "lib";
import React from "react";

import { useMedia } from "react-use";
import { Flex, Box } from "rebass/styled-components";
import { useAppStore } from "store";

export default function LPDescription() {
  const [{ userAddress: account, statusInfo, orderInfoOf }, updateAppStore] =
    useAppStore();

  const upSmall = useMedia("(min-width: 600px)");
  const poolRewards = false;
  const pairState = 1;

  const PairState = {
    EXISTS: 1,
  };
  const apy = new BigNumber(3000);
  const pair = {
    poolId: 1,
  };
  const userRewards = false;

  return (
    <>
      {pairState === PairState.EXISTS && (
        <Box bg="bg2" flex={1} padding={[5, 7]}>
          {poolRewards && account ? (
            <Typography variant="h3" mb={2}>
              ARCH liquidity pool:
              <Typography
                fontWeight="normal"
                fontSize={16}
                as={upSmall ? "span" : "p"}
              >
                20.08% APY
                {/* {apy?.times(100).dp(5).toFixed() ?? "-"}% APY */}
              </Typography>
            </Typography>
          ) : (
            <Typography variant="h3" mb={2}>
              {`ARCH liquidity pool`}
            </Typography>
          )}

          <Flex flexWrap="wrap">
            <Box
              width={[1, 1 / 2]} //
              sx={{
                borderBottom: ["1px solid rgba(255, 255, 255, 0.15)", 0], //
                borderRight: [0, "1px solid rgba(255, 255, 255, 0.15)"],
              }}
            >
              {pair && !account && (
                <Flex alignItems="center" justifyContent="center" height="100%">
                  <Typography
                    textAlign="center"
                    marginBottom="5px"
                    color="text1"
                  >
                    Sign in to view your liquidity details.
                  </Typography>
                </Flex>
              )}

              {pair && account && (
                <>
                  <Box sx={{ margin: "15px 0 25px 0" }}>
                    <Typography
                      textAlign="center"
                      marginBottom="5px"
                      color="text1"
                    >
                      Your supply
                    </Typography>

                    <Typography textAlign="center" variant="p">
                      {`${Arch.utils.toFormat(orderInfoOf?.native || 0)} ARCH`}
                    </Typography>
                  </Box>

                  {userRewards && (
                    <Box sx={{ margin: "15px 0 25px 0" }}>
                      <Typography
                        textAlign="center"
                        marginBottom="5px"
                        color="text1"
                      >
                        Your daily rewards
                      </Typography>
                      <Typography textAlign="center" variant="p">
                        {/* ~ {userRewards.toFixed(4)} BALN */}
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </Box>

            <Box width={[1, 1 / 2]}>
              <Box sx={{ margin: "15px 0 25px 0" }}>
                <Typography textAlign="center" marginBottom="5px" color="text1">
                  Total supply
                </Typography>
                {pair && (
                  <Typography textAlign="center" variant="p">
                    {`${Arch.utils.toFormat(statusInfo?.balance || "0")} ARCH`}
                  </Typography>
                )}
              </Box>

              {poolRewards && (
                <Box sx={{ margin: "15px 0 25px 0" }}>
                  <Typography
                    textAlign="center"
                    marginBottom="5px"
                    color="text1"
                  >
                    Total daily rewards
                  </Typography>
                  <Typography textAlign="center" variant="p">
                    {/* {poolRewards.toFixed(4)} BALN */}
                  </Typography>
                </Box>
              )}
            </Box>
          </Flex>
        </Box>
      )}
    </>
  );
}
