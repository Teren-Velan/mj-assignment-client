import { useState, useRef, useEffect } from "react";
import {
  Flex,
  Slide,
  useMediaQuery,
  useOutsideClick,
  Icon,
  Heading,
  Progress,
} from "@chakra-ui/react";
import { MdMenu } from "react-icons/md";

import { ShellUIContext } from "./ShellContext";
import { useIsomorphicLayoutEffect } from "../../utils/hooks/useIsomorphicLayoutEffect";
import { usePrevious } from "../../utils/hooks/usePrevious";

const isFunction = (obj) => typeof obj === "function";

export const Shell = (props) => {
  let {
    renderLeft,
    renderRight,
    focus = "left",
    isUADesktop,
    wide = false,
    sidebarVariantInitialState,
    onStateChange = () => {},
  } = props;

  /** Refs */
  let leftRef = useRef();
  useOutsideClick({
    ref: leftRef,
    handler: () =>
      !isDesktopMode && showSidebarVariant && toggleSidebarVariant(),
  });

  /** DesktopMode State */
  const [isDesktopMode, setIsDesktopMode] = useState(false);
  useEffect(() => {
    setShowSidebarVariant(false);
  }, [isDesktopMode]);

  useIsomorphicLayoutEffect(() => {
    if (isUADesktop) {
      setIsDesktopMode(isUADesktop);
    }
  }, []);
  //   control viewport state based on media query
  const [isMediaQueryGT1280] = useMediaQuery("(min-width: 1280px)");
  useIsomorphicLayoutEffect(() => {
    setIsDesktopMode(isMediaQueryGT1280);
  }, [isMediaQueryGT1280]);

  /** SidebarVariant State*/
  const [showSidebarVariant, setShowSidebarVariant] = useState(null);
  useEffect(() => {
    onStateChange(showSidebarVariant);
  }, [showSidebarVariant]);

  const sidebarVariantPrevState = usePrevious(sidebarVariantInitialState);

  useEffect(() => {
    if (
      sidebarVariantInitialState !== undefined &&
      sidebarVariantInitialState !== null
    ) {
      if (
        sidebarVariantPrevState === undefined ||
        sidebarVariantPrevState === null
      ) {
        setShowSidebarVariant(sidebarVariantInitialState);
      }
    }
  }, [sidebarVariantInitialState, sidebarVariantPrevState]);

  let toggleSidebarVariant = () => setShowSidebarVariant(!showSidebarVariant);

  /** Packaged State */
  let uiState = {
    isDesktopMode,
    showSidebarVariant,
    setShowSidebarVariant,
    toggleSidebarVariant,
  };
  let sidebarSizing = {
    w: "sidebar.md",
  };

  if (wide) {
    sidebarSizing = {
      w: "sidebar.lg",
    };
  }

  if (showSidebarVariant) {
    sidebarSizing = {
      w: "sidebar.sm",
    };
  }

  return (
    <ShellUIContext.Provider value={uiState}>
      {isDesktopMode === true ? (
        <Flex w="100vw" overflowX="hidden">
          {renderLeft && (
            <Flex {...sidebarSizing} h="100vh">
              {isFunction(renderLeft) ? renderLeft(uiState) : renderLeft}
            </Flex>
          )}
          <Flex
            flexBasis="60rem"
            flexGrow={focus === "right" ? "3" : "2"}
            bg="#fafafa"
            h="100vh"
            w="100%"
            flexDir="column"
            maxH="100vh"
            overflowY="auto"
            zIndex="10"
          >
            {isFunction(renderRight) ? renderRight(uiState) : renderRight}
          </Flex>
        </Flex>
      ) : isDesktopMode === false && focus === "right" ? (
        <Flex w="100vw" overflow="auto">
          {renderLeft && (
            <Slide
              direction={focus === "left" ? "right" : "left"}
              in={showSidebarVariant}
              style={{
                zIndex: 10,
                width: "80vw",
                height: "100vh",
              }}
              ref={leftRef}
            >
              <Flex
                pointerEvents="auto"
                zIndex="2"
                bg="rgba(0, 0, 0, 0.48)"
                h="100%"
                justify="space-between"
              >
                {isFunction(renderLeft) ? renderLeft(uiState) : renderLeft}
              </Flex>
            </Slide>
          )}
          <Flex bg="#fafafa" w="100%" h="100vh" flexDir="column">
            {isFunction(renderRight) ? renderRight(uiState) : renderRight}
          </Flex>
        </Flex>
      ) : isDesktopMode === false && focus === "left" ? (
        <Flex w="100vw">
          <Flex bg="white" w="100%" h="100vh">
            {isFunction(renderLeft) ? renderLeft(uiState) : renderLeft}
          </Flex>

          <Flex bg="white" w="100%" h="100vh" display="none">
            {isFunction(renderRight) ? renderRight(uiState) : renderRight}
          </Flex>
        </Flex>
      ) : null}
    </ShellUIContext.Provider>
  );
};

export const ShellHeader = (props) => {
  let {
    title = "",
    leftIcon = MdMenu,
    rightIcon,
    iconOnClick = () => {},
    renderRightHeader = false,
    loading,
    ...rest
  } = props;

  return (
    <ShellUIContext.Consumer>
      {({ isDesktopMode, toggleSidebarVariant }) => {
        return (
          <>
            <Flex
              py="sm"
              px="md"
              alignItems="center"
              justifyContent={isDesktopMode ? "flex-start" : "space-between"}
              {...rest}
            >
              <Flex align="flex-start">
                <Icon
                  cursor="pointer"
                  as={leftIcon}
                  w={27}
                  h={27}
                  color="brand1.secondary.400"
                  onClick={() => {
                    iconOnClick();
                    toggleSidebarVariant();
                  }}
                />
              </Flex>
              <Flex
                align="center"
                justify={isDesktopMode ? "flex-start" : "center"}
              >
                <Heading
                  mx={!isDesktopMode ? "xs" : "sm"}
                  fontSize="3xl"
                  fontWeight="900"
                  color="brand1.secondary.400"
                >
                  {title}
                </Heading>
              </Flex>

              <Flex
                visibility={rightIcon ? "visible" : "hidden"}
                align="flex-end"
                marginLeft={isDesktopMode ? "auto" : "0"}
              >
                <Icon
                  cursor="pointer"
                  as={rightIcon}
                  w={27}
                  h={27}
                  color="brand1.secondary.400"
                />
              </Flex>
            </Flex>
            <Progress isIndeterminate={loading} />
          </>
        );
      }}
    </ShellUIContext.Consumer>
  );
};
