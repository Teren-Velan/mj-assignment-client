import { createContext } from "react";

export const ShellUIContext = createContext({
  showSidebarVariant: false,
  isDesktopMode: false,
});
