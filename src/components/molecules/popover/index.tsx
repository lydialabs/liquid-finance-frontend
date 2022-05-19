import React, { useCallback, useEffect, useState } from "react";

import { Placement } from "@popperjs/core";
import Portal from "@reach/portal";
import { usePopper } from "react-popper";
import styled from "styled-components";

const PopoverContainer = styled.div<{ show: boolean; zIndex?: number }>`
  z-index: ${({ zIndex, theme }) => zIndex || theme.zIndices.tooltip};
  visibility: ${props => (props.show ? "visible" : "hidden")};
  opacity: ${props => (props.show ? 1 : 0)};
  transition: visibility 150ms linear, opacity 150ms linear;
`;

const SelectorPopoverWrapper = styled.div`
  background: ${({ theme }) => theme.colors.bg4};
  color: ${({ theme }) => theme.colors.text1};
  border-radius: 0px 0px 10px 10px;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  background: ${({ theme }) => theme.colors.bg4};
  color: ${({ theme }) => theme.colors.text1};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 20%);
`;

const ReferenceElement = styled.div`
  display: inline-block;
  line-height: 0;
`;

const Arrow = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  z-index: -1;

  ::before {
    position: absolute;
    width: 12px;
    height: 12px;
    z-index: -1;

    content: "";
    transform: rotate(45deg);
    background: ${({ theme }) => theme.colors.bg3};
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 20%);
  }

  &.arrow-top,
  &.arrow-top-start,
  &.arrow-top-end {
    bottom: -6px;
  }

  &.arrow-bottom,
  &.arrow-bottom-start,
  &.arrow-bottom-end {
    top: -6px;
  }

  &.arrow-left,
  &.arrow-left-start,
  &.arrow-left-end {
    right: -6px;
  }

  &.arrow-right,
  &.arrow-right-start,
  &.arrow-right-end {
    left: -6px;
  }
`;

export interface PopoverProps {
  content: React.ReactNode;
  show: boolean;
  children: React.ReactNode;
  placement?: Placement;
  forcePlacement?: boolean;
  style?: React.CSSProperties;
  refStyle?: React.CSSProperties;
}

export default function Popover({
  style = {},
  refStyle = {},
  content,
  show,
  children,
  placement = "auto",
  forcePlacement,
}: PopoverProps) {
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
  const { styles, update, attributes } = usePopper(
    referenceElement,
    popperElement,
    {
      placement,
      strategy: "fixed",
      modifiers: [
        {
          name: "offset",
          options: { offset: [placement === "top-end" ? 8 : 0, 12] },
        },
        { name: "arrow", options: { element: arrowElement } },
        {
          name: "flip",
          options: { fallbackPlacements: forcePlacement ? [] : undefined },
        },
      ],
    }
  );
  const updateCallback = useCallback(() => {
    update && update();
  }, [update]);

  // useEffect(() => updateCallback(), []);

  return (
    <>
      <ReferenceElement ref={setReferenceElement as any} style={refStyle}>
        {children}
      </ReferenceElement>
      <Portal>
        <PopoverContainer
          show={show}
          ref={setPopperElement as any}
          style={{ ...style, ...styles.popper }}
          {...attributes.popper}
        >
          <ContentWrapper>{content}</ContentWrapper>
          <Arrow
            className={`arrow-${
              attributes.popper?.["data-popper-placement"] ?? ""
            }`}
            ref={setArrowElement as any}
            style={styles.arrow}
            {...attributes.arrow}
          />
        </PopoverContainer>
      </Portal>
    </>
  );
}

type OffsetModifier = [number, number];

export interface PopperProps {
  anchorEl: HTMLElement | null;
  show: boolean;
  children: React.ReactNode;
  placement?: Placement;
  offset?: OffsetModifier;
}

export function PopperWithoutArrow({
  show,
  children,
  placement = "auto",
  anchorEl,
  offset,
}: PopperProps) {
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );

  const { styles, update, attributes } = usePopper(anchorEl, popperElement, {
    placement,
    strategy: "fixed",
    modifiers: [{ name: "offset", options: { offset: offset } }],
  });

  const updateCallback = useCallback(() => {
    update && update();
  }, [update]);

  return (
    <Portal>
      <PopoverContainer
        show={show}
        ref={setPopperElement as any}
        style={{ ...styles.popper }}
        {...attributes.popper}
      >
        <ContentWrapper>{children}</ContentWrapper>
      </PopoverContainer>
    </Portal>
  );
}

export function DropdownPopper({
  show,
  children,
  placement = "auto",
  anchorEl,
  zIndex,
}: PopperProps) {
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  const customModifier = React.useMemo(
    () => [
      { name: "offset", options: { offset: [20, 12] } },
      {
        name: "arrow",
        options: {
          element: arrowElement,
        },
      },
    ],
    [arrowElement]
  );

  const { styles, update, attributes } = usePopper(anchorEl, popperElement, {
    placement,
    strategy: "fixed",
    modifiers: customModifier,
  });

  const updateCallback = useCallback(() => {
    update && update();
  }, [update]);

  return (
    <Portal>
      <PopoverContainer
        show={show}
        ref={setPopperElement as any}
        zIndex={zIndex}
        style={styles.popper}
        {...attributes.popper}
      >
        <ContentWrapper>{children}</ContentWrapper>
        <Arrow
          className={`arrow-${
            attributes.popper?.["data-popper-placement"] ?? ""
          }`}
          ref={setArrowElement as any}
          style={styles.arrow}
          {...attributes.arrow}
        />
      </PopoverContainer>
    </Portal>
  );
}

export interface PopperProps {
  anchorEl: HTMLElement | null;
  show: boolean;
  children: React.ReactNode;
  placement?: Placement;
  zIndex?: number;
}

export function SelectorPopover({
  show,
  children,
  placement = "auto",
  anchorEl,
}: PopperProps) {
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );

  const { styles, update, attributes } = usePopper(anchorEl, popperElement, {
    placement,
    strategy: "fixed",
    modifiers: [{ name: "offset", options: { offset: [0, 1] } }],
  });
  const updateCallback = useCallback(() => {
    update && update();
  }, [update]);
  return (
    <Portal>
      <PopoverContainer
        show={show}
        ref={setPopperElement as any}
        style={styles.popper}
        {...attributes.popper}
      >
        <SelectorPopoverWrapper>{children}</SelectorPopoverWrapper>
      </PopoverContainer>
    </Portal>
  );
}
export interface Props {
  show: boolean;
  children: React.ReactNode;
  placement?: Placement;
  content: React.ReactNode;
}

export function PopperWithoutArrowAndBorder({
  content,
  show,
  children,
  placement = "auto",
}: Props) {
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);

  const { styles, update, attributes } = usePopper(
    referenceElement,
    popperElement,
    {
      placement,
      strategy: "fixed",
      modifiers: [{ name: "offset", options: { offset: [0, 12] } }],
    }
  );
  const updateCallback = useCallback(() => {
    update && update();
  }, [update]);

  return (
    <>
      <ReferenceElement ref={setReferenceElement as any}>
        {children}
      </ReferenceElement>
      <Portal>
        <PopoverContainer
          show={show}
          ref={setPopperElement as any}
          style={styles.popper}
          {...attributes.popper}
        >
          <ContentWrapper style={{ border: "none" }}>{content}</ContentWrapper>
        </PopoverContainer>
      </Portal>
    </>
  );
}
