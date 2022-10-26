import { FormLabel } from "@chakra-ui/react";

export const InputError = (props) => {
  let {
    invalid = "",
    children,
    fontFamily = "primary",
    fontSize = "xs",
    color = "#ff0033",
    __TYPE,
    ...rest
  } = props;

  return (
    <FormLabel
      pt="2xs"
      px="2xs"
      ps="xs"
      mb="0"
      display={!!invalid ? "unset" : "none"}
      fontSize={fontSize}
      fontFamily={fontFamily}
      color={color}
      {...rest}
    >
      {invalid + ""}
    </FormLabel>
  );
};
