import { extendTheme } from "@chakra-ui/react";

let brand = {
  primary: {
    100: "#1b2d54",
    200: "#83BCFF",
  },
  secondary: {
    100: "#fbb81b",
    200: "#476A6F",
  },
};

// for margins and paddings
let spacing = {
  "2xs": "0.25rem",
  xs: "0.5rem",
  sm: "1rem",
  md: "2.5rem",
  lg: "4rem",
  xl: "8rem",
};

// for widths and heights
export const sizing = {
  icon: {
    xs: "0.75rem",
    sm: "1rem",
    md: "1.75rem",
    lg: "2.5rem",
    xl: "4rem",
  },
  input: {
    sm: "2rem", //chakra-8
    md: "2.5rem", //chakra-10
    lg: "3rem", //chakra-12
  },
};

let borderRadius = {
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
};

let responsiveSizing = {
  xs: "325px",
  sm: "480px",
  md: "768px",
  lg: "960px",
  xl: "1200px",
};

export const boxShadow = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 3px 10px rgb(0 0 0 / 0.15)",
};

export const theme = extendTheme({
  colors: {
    ...brand,
  },
  sizes: {
    ...sizing,
  },
  fonts: {
    primary: "Nunito Sans",
  },
  space: {
    ...spacing,
  },
  radii: {
    ...borderRadius,
  },
  breakpoints: {
    ...responsiveSizing,
  },
});
