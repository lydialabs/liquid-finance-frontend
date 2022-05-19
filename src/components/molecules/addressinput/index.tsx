import React from "react";

import styled from "styled-components";

const InputContainer = styled.div`
  display: inline-flex;
  width: 100%;
`;

const AddressInputLabel = styled.button`
  border: 2px solid ${({ theme }) => `${theme.colors.bg2}`};
  border-right: 1px solid rgba(255, 255, 255, 0.5);
  background-color: ${({ theme }) => `${theme.colors.bg4}`};
  display: flex;
  align-items: center;
  width: 128px;
  height: 43px;
  padding: 4px 15px;
  color: #1a334d;
  border-radius: 10px 0 0 10px;
  transition: border 0.3s ease, background-color 0.3s ease, color 0.3s ease;
  font-size: 14px;
  font-weight: bold;
  justify-content: center;
`;

const AddressInput = styled.input<{ bg?: string }>`
  flex: 1;
  width: 100%;
  height: 43px;
  text-align: right;
  border-radius: 0 10px 10px 0;
  border: 2px solid ${({ theme }) => `${theme.colors.bg2}`};
  background-color: ${({ theme }) => `${theme.colors.bg2}`};
  color: #1a334d;
  padding: 7px 20px;
  outline: none;
  transition: border 0.3s ease;
  overflow: visible;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.15;
  margin: 0;
  box-sizing: border-box;

  ::placeholder {
    color: ${({ theme }) => `${theme.colors.text2}`};
  }

  :hover,
  :focus {
    border: 2px solid #1a334d;
  }
`;

interface AddressInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  className?: string;
}

export default function AddressInputPanel({
  value,
  onUserInput,
  className,
}: AddressInputPanelProps) {
  return (
    <InputContainer className={className}>
      <AddressInputLabel>Address</AddressInputLabel>

      <AddressInput
        placeholder="archway..."
        value={value}
        onChange={event => onUserInput(event.target.value)}
      />
    </InputContainer>
  );
}
