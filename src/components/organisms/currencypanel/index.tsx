import React from "react";

import ClickAwayListener from "react-click-away-listener";
import { Flex } from "rebass/styled-components";
import styled from "styled-components";

import DropDown from "assets/icons/arrow-down.svg";
import {
  getFilteredCurrencies,
  CurrencyKey,
  COMMON_PERCENTS,
} from "consts/currency";
import { Currency } from "/types/";
import {
  PopperWithoutArrow,
  SelectorPopover,
} from "components/molecules/popover";
import {
  DashGrid,
  DataText,
  HeaderText,
  HorizontalList,
  List,
  ListItem,
  Option,
} from "components/molecules/list";
import CurrencyLogo from "components/atom/currencylogo";
import { Arch } from "lib";

const InputContainer = styled.div`
  display: inline-flex;
  width: 100%;
`;

const CurrencySelect = styled.button`
  border: ${({ theme }) => `2px solid ${theme.colors.bg2}`};
  background-color: ${({ theme }) => `${theme.colors.bg2}`};
  border-right: 1px solid rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  width: 128px;
  height: 43px;
  padding: 4px 15px;
  border-radius: 10px 0 0 10px;
  transition: border 0.3s ease, background-color 0.3s ease, color 0.3s ease;
  cursor: pointer;
  color: #1a334d;

  :hover,
  :focus {
    &:not(:disabled) {
      border: 2px solid #1a334d;
    }
  }
`;

const StyledTokenName = styled.span`
  line-height: 1.5;
  margin-right: 8px;
  font-size: 14px;
  font-weight: bold;
`;

const NumberInput = styled.input<{ active?: boolean }>`
  flex: 1;
  width: 100%;
  height: 43px;
  text-align: right;
  border-radius: 0 10px 10px 0;
  border: ${({ theme }) => `2px solid ${theme.colors.bg2}`};
  background-color: ${({ theme }) => `${theme.colors.bg2}`};
  padding: 7px 20px;
  outline: none;
  transition: border 0.3s ease;
  overflow: visible;
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
  box-sizing: border-box;
  color: #1a334d;
  :hover,
  :focus {
    border: 2px solid #1a334d;
  }
  ${props => props.active && "border-bottom-right-radius: 0;"}
`;

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  width: 10px;
`;

const ItemList = styled(Option)<{ selected: boolean }>`
  ${props => props.selected && " background-color: rgba(220, 76, 26, 1);"}
`;

interface CurrencyInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  onMax?: () => void;
  showMaxButton?: boolean;
  label?: string;
  onCurrencySelect?: (currency: Currency | undefined) => void;
  currency?: Currency | null;
  disableCurrencySelect?: boolean;
  hideBalance?: boolean;
  hideInput?: boolean;
  otherCurrency?: CurrencyKey | null;
  currencyList?: (Currency | undefined)[];
  showCommonBases?: boolean;
  customBalanceText?: string;
  onPercentSelect?: (percent: number) => void;
  percent?: number;
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  otherCurrency,
  currencyList,
  onPercentSelect,
  percent,
}: CurrencyInputPanelProps) {
  const [open, setOpen] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

  // update the width on a window resize
  const ref = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(ref?.current?.clientWidth);
  React.useEffect(() => {
    function handleResize() {
      setWidth(ref?.current?.clientWidth ?? width);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  //
  const handleCurrencySelect =
    (ccy: Currency | undefined) => (e: React.MouseEvent) => {
      onCurrencySelect && onCurrencySelect(ccy);
      setOpen(false);
    };

  const availableCurrencies = React.useMemo(
    () => (otherCurrency ? getFilteredCurrencies(otherCurrency) : currencyList),
    [otherCurrency, currencyList]
  );
  const handlePercentSelect = (instant: number) => (e: React.MouseEvent) => {
    onPercentSelect && onPercentSelect(instant);
  };

  // React.useEffect(() => {
  //   const t = otherCurrency
  //     ? getFilteredCurrencies(otherCurrency)
  //     : currencyList;
  //   onCurrencySelect &&
  //     onCurrencySelect(
  //       CURRENCYLIST[t[0].toLowerCase() as "empty" | "ARCH" | "lARCH"]
  //     );
  // }, [otherCurrency, onCurrencySelect, currencyList]);

  return (
    <InputContainer ref={ref}>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <CurrencySelect onClick={toggleOpen} disabled={disableCurrencySelect}>
          {currency ? (
            <CurrencyLogo currency={currency} style={{ marginRight: 8 }} />
          ) : null}
          {currency ? (
            <StyledTokenName className="token-symbol-container">
              {currency.symbol}
            </StyledTokenName>
          ) : null}
          {!disableCurrencySelect && <StyledDropDown selected={!!currency} />}

          {onCurrencySelect && (
            <PopperWithoutArrow
              show={open}
              anchorEl={ref.current}
              placement="bottom"
              offset={[0, 4]}
            >
              <List style={{ width: width }}>
                <DashGrid>
                  <HeaderText>Asset</HeaderText>
                  <HeaderText textAlign="right">Wallet</HeaderText>
                </DashGrid>
                {currencyList?.map(currency => (
                  <ListItem
                    key={currency?.symbol}
                    onClick={handleCurrencySelect(currency)}
                  >
                    <Flex>
                      <CurrencyLogo
                        currency={currency}
                        style={{ marginRight: "8px" }}
                      />
                      <DataText variant="p" fontWeight="bold">
                        {currency?.symbol}
                      </DataText>
                    </Flex>
                    <DataText variant="p" textAlign="right">
                      {Arch.utils
                        .toFormat(currency?.amount || "0")
                        .dp(5)
                        .toFormat()}
                    </DataText>
                  </ListItem>
                ))}
              </List>
            </PopperWithoutArrow>
          )}
        </CurrencySelect>
      </ClickAwayListener>

      <NumberInput
        value={value}
        onChange={event => onUserInput(event.target.value)}
        inputMode="decimal"
        title="Token Amount"
        autoComplete="off"
        autoCorrect="off"
        onClick={() => setIsActive(!isActive)}
        onBlur={() => setIsActive(false)}
        type="text"
        pattern="^[0-9]*[.,]?[0-9]*$"
        minLength={1}
        maxLength={79}
        spellCheck="false"
        active={onPercentSelect && isActive}
      />
      {onPercentSelect && (
        <SelectorPopover
          show={isActive}
          anchorEl={ref.current}
          placement="bottom-end"
        >
          <HorizontalList justifyContent="center" alignItems="center">
            {COMMON_PERCENTS.map(value => (
              <ItemList
                key={value}
                onClick={handlePercentSelect(value)}
                selected={value === percent}
              >{`${value}%`}</ItemList>
            ))}
          </HorizontalList>
        </SelectorPopover>
      )}
    </InputContainer>
  );
}
