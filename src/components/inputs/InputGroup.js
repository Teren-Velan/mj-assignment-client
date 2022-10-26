import { Box, InputGroup, FormLabel } from "@chakra-ui/react";

export const InputWrapper = (props) => {
  let {
    __DEBUG,
    __TYPE,
    children,
    invalid = false,
    invalidText = "",
    label = "",
    helperText = "",
    color,
    size = "md",
    ...rest
  } = props;

  return (
    <Box {...rest}>
      {label ? (
        <FormLabel
          color={color ? color : "#fff"}
          fontSize="sm"
          m="0"
          px="xs"
          pb={helperText ? "0" : "2xs"}
          fontWeight={600}
        >
          {label}
        </FormLabel>
      ) : null}
      {helperText ? (
        <FormLabel
          color={color ? color : "#fff"}
          fontSize="xs"
          m="0"
          px="xs"
          pb="2xs"
        >
          {helperText}
        </FormLabel>
      ) : null}
      <InputGroup display="flex" flexDir="column">
        {children}
      </InputGroup>
    </Box>
  );
};
