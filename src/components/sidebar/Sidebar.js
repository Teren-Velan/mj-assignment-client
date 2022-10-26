import {
  Flex,
  Popover,
  Link,
  Text,
  Icon,
  Avatar,
  PopoverArrow,
  PopoverTrigger,
  PopoverBody,
  Portal,
  PopoverContent,
} from "@chakra-ui/react";
import { MdLogout } from "react-icons/md";
import { ShellUIContext } from "../layout/ShellContext";

export const Sidebar = (props) => {
  return (
    <ShellUIContext.Consumer>
      {({ isDesktopMode }) => {
        if (isDesktopMode === true) {
          return <DesktopSidebar {...props} />;
        } else {
          return <MobileSidebar {...props} />;
        }
      }}
    </ShellUIContext.Consumer>
  );
};

export const SidebarHeader = (props) => {
  let { title, variant = "logo", avatarUri, ...rest } = props;

  return (
    <ShellUIContext.Consumer>
      {({ isDesktopMode, showSidebarVariant }) => {
        let isMobile = !isDesktopMode;
        return (
          <>
            <Avatar
              size={showSidebarVariant && isDesktopMode ? "sm" : "xl"}
              src={avatarUri}
            />

            {(isDesktopMode && showSidebarVariant === false) ||
            (isMobile && showSidebarVariant === true) ? (
              <Flex mt="xs" flexDir="column" alignItems="flex-start" w="100%">
                <Text
                  fontWeight="800"
                  fontSize="md"
                  color="#fff"
                  w="100%"
                  isTruncated
                >
                  {title}
                </Text>
              </Flex>
            ) : null}
          </>
        );
      }}
    </ShellUIContext.Consumer>
  );
};

export const SidebarItem = (props) => {
  let {
    isSelected = false,
    isDisabled = false,
    title = "",
    icon = MdLogout,
    ...rest
  } = props;
  let selectedProps = {
    color: isSelected ? "secondary.100" : "#fff",
    cursor: isSelected ? "default" : "pointer",
  };
  let disabledProps = {
    cursor: isDisabled ? "not-allowed" : "pointer",
    _hover: {
      color: isDisabled ? "none" : "brand1.primary.400",
    },
  };

  return (
    <ShellUIContext.Consumer>
      {({ isDesktopMode, showSidebarVariant, setShowSidebarVariant }) => {
        return isDesktopMode && showSidebarVariant ? (
          <Popover trigger="hover" placement="right" {...rest}>
            <PopoverTrigger>
              <Flex w="100%">
                <Flex my="xs" align="center" {...rest}>
                  <Link {...selectedProps} {...disabledProps}>
                    <Icon as={icon} boxSize="icon.md" />
                  </Link>
                </Flex>
              </Flex>
            </PopoverTrigger>
            <Portal>
              <PopoverContent
                ml="sm"
                outline="none"
                w="fit-content"
                backgroundColor="primary.100"
              >
                <PopoverArrow backgroundColor="primary.100" />
                <PopoverBody color={isSelected ? "secondary.100" : "#fff"}>
                  <Text>{title}</Text>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        ) : (
          // />
          <Flex my="xs" align="center" direction="row" {...rest}>
            <Link
              {...selectedProps}
              {...disabledProps}
              onClick={() => {
                if (isDisabled) {
                  return null;
                } else {
                  setShowSidebarVariant(false);
                }
              }}
            >
              <Flex pointerEvents="auto" direction="row" align="center">
                <Icon as={icon} boxSize="icon.md" />
                <Text mx="xs">{title}</Text>
              </Flex>
            </Link>
          </Flex>
        );
      }}
    </ShellUIContext.Consumer>
  );
};

const DesktopSidebar = (props) => {
  let {
    renderContent = null,
    renderFooter = null,
    renderHeader = null,
    showWire = false,
    ...rest
  } = props;
  const isFunction = (obj) => typeof obj === "function";

  return (
    <ShellUIContext.Consumer>
      {({ isDesktopMode, showSidebarVariant }) => {
        return (
          <Flex
            p={showSidebarVariant ? "sm" : "md"}
            bg="primary.100"
            zIndex="docked"
            minH="100%"
            h="100%"
            flexDir="column"
            direction="column"
            w="100%"
            overflowY="scroll"
            css={{
              "&::-webkit-scrollbar": {
                width: "0",
              },
              "&::-webkit-scrollbar-track": {
                width: "0",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "brand1.secondary.400",
              },
            }}
            {...rest}
          >
            {renderHeader && (
              <Flex
                py="xs"
                px={showSidebarVariant ? "0" : "sm"}
                mb={showSidebarVariant ? "sm" : "0"}
                flexDir="column"
                justifyContent={showSidebarVariant ? "flex-start" : "center"}
                alignItems={showSidebarVariant ? "center" : "flex-start"}
                flexGrow={showSidebarVariant ? "0" : "1"}
                w="100%"
                maxHeight="15%"
              >
                {isFunction(renderHeader) ? renderHeader() : renderHeader}
              </Flex>
            )}

            <Flex
              p={showSidebarVariant ? "" : "sm"}
              flexDir="column"
              justifyContent="flex-start"
              alignItems={showSidebarVariant ? "center" : "flex-start"}
              flexGrow="10"
              flexShrink="1"
              w="100%"
            >
              {showWire && (
                <Flex
                  height="100%"
                  maxW="25%"
                  position="fixed"
                  bottom="-12rem"
                  left="0"
                  zIndex="-1"
                  filter="contrast(10%) brightness(0.6)"
                ></Flex>
              )}
              {isFunction(renderContent) ? renderContent() : renderContent}
            </Flex>
            {isDesktopMode && !showSidebarVariant && renderFooter ? (
              <Flex
                justify="center"
                alignItems={showSidebarVariant ? "center" : "flex-start"}
                flexDir="column"
                p="sm"
                flexGrow="1"
                w="100%"
                maxHeight="20%"
              >
                {isFunction(renderFooter) ? renderFooter() : renderFooter}
              </Flex>
            ) : null}
          </Flex>
        );
      }}
    </ShellUIContext.Consumer>
  );
};

const MobileSidebar = (props) => {
  let {
    renderContent = null,
    renderFooter = null,
    renderHeader = null,
    showWire = false,
    ...rest
  } = props;

  const isFunction = (obj) => typeof obj === "function";

  return (
    <ShellUIContext.Consumer>
      {({ isDesktopMode, showSidebarVariant, setShowSidebarVariant }) => {
        return (
          <>
            <Flex
              boxShadow={showSidebarVariant ? "1px 0px 10px 3px #000" : "none"}
              bg="primary.100"
              p={{ base: "sm", xs: "md", sm: "md", md: "lg" }}
              maxH="100vh"
              minW="100%"
              flexDir="column"
              direction="column"
              overflowY="scroll"
              css={{
                "&::-webkit-scrollbar": {
                  width: "0",
                },
                "&::-webkit-scrollbar-track": {
                  width: "0",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "brand1.secondary.400",
                },
              }}
              {...rest}
            >
              {renderHeader && (
                <Flex
                  p="sm"
                  flexDir="column"
                  justify="center"
                  align={isDesktopMode ? "flex-start" : "center"}
                  textAlign="center"
                  flexBasis="1"
                  flexGrow="1"
                  w="100%"
                >
                  {isFunction(renderHeader) ? renderHeader() : renderHeader}
                </Flex>
              )}

              <Flex
                p="sm"
                flexDir="column"
                justify="flex-start"
                align="center"
                flexBasis="2"
                flexGrow="3"
                w="100%"
              >
                {isFunction(renderContent) ? renderContent() : renderContent}
              </Flex>

              {renderFooter && (
                <Flex
                  justify="center"
                  align="center"
                  flexDir="column"
                  p="sm"
                  flexBasis="1"
                  flexGrow="1"
                  w="100%"
                >
                  {isFunction(renderFooter) ? renderFooter() : renderFooter}
                </Flex>
              )}
            </Flex>
            <Flex
              position="absolute"
              top="0"
              left="0"
              display={showSidebarVariant ? "block" : "none"}
              bg="rgba(0, 0, 0, 0.20)"
              minW="180vw"
              minH="100vh"
              pointerEvents="auto"
              zIndex="-1"
              onClick={(e) => {
                e.stopPropagation();
                setShowSidebarVariant(false);
              }}
            ></Flex>
          </>
        );
      }}
    </ShellUIContext.Consumer>
  );
};
