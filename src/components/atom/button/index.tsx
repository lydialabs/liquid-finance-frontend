import { Button as RebassButton } from "rebass/styled-components";
import styled from "styled-components";

export const Button = styled(RebassButton)`
  display: inline-block;
  border-radius: 10px;
  padding: 5px 15px;
  color: #ffffff;
  text-decoration: none;
  background-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  transition: background-color 0.3s ease;
  user-select: none;
  line-height: 1.4;
  opacity: 1;

  &:hover {
    opacity: 0.8;
    transition: opacity 0.2s ease;
  }

  &:disabled {
    background: #c8d4e1;
    cursor: not-allowed;
    pointer-events: none;
  }

  ${({ theme }) => theme.mediaWidth.upExtraSmall`
    padding: 7px 25px;
  `}
`;

export const ButtonLink = styled.a`
  display: inline-block;
  border-radius: 10px;
  padding: 5px 15px;
  color: #ffffff;
  text-decoration: none;
  background-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  transition: background-color 0.3s ease;
  user-select: none;
  line-height: 1.4;
  opacity: 1;

  &:hover {
    opacity: 0.8;
    transition: opacity 0.2s ease;
  }
  &:focus {
    outline: none;
  }

  &:disabled {
    background: #c8d4e1;
    cursor: not-allowed;
    pointer-events: none;
  }

  ${({ theme }) => theme.mediaWidth.upExtraSmall`
  padding: 7px 25px;
`}
`;

export const TextButton = styled(RebassButton)`
  background: transparent;
  font-size: 14px;
  padding: 5px 15px;
  text-decoration: none;
  color: #697a8c;
  cursor: pointer;
  transition: color 0.3s ease;
  user-select: none;
  line-height: 1.4;

  &:hover {
    color: #9fb4c9;
    transition: color 0.2s ease;
  }

  &:disabled {
    cursor: default;
    pointer-events: none;
    color: rgba(255, 255, 255, 0.15);
  }

  ${({ theme }) => theme.mediaWidth.upExtraSmall`
    padding: 7px 25px;
  `}
`;

export const IconButton = styled(RebassButton)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background-color: rgba(220, 76, 26, 1);
  border-radius: 100px;
  color: ${({ theme }) => theme.colors.bg1};
  cursor: pointer;
  padding: 4px;
  outline: none;

  &:hover,
  &:focus {
    background-color: rgba(187, 69, 29, 1);
    transition: background-color 0.2s ease;
  }

  &:disabled {
    cursor: default;
    pointer-events: none;
    color: rgba(255, 255, 255, 0.15);
  }
`;

export const AlertButton = styled(RebassButton)`
  display: inline-block;
  border-radius: 10px;
  padding: 5px 15px;
  color: #ffffff;
  text-decoration: none;
  background-color: ${({ theme }) => theme.colors.alert};
  cursor: pointer;
  transition: background-color 0.3s ease;
  user-select: none;
  line-height: 1.4;

  &:hover {
    background-color: #f72c2c;
    transition: background-color 0.2s ease;
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.15);
    cursor: default;
    pointer-events: none;
  }

  ${({ theme }) => theme.mediaWidth.upExtraSmall`
    padding: 7px 25px;
  `}
`;
