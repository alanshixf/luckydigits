import { createContext, useContext } from "react";

type ThemeContextType = {
  mode: string;
  toggleColorMode: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  toggleColorMode: () => {},
});

export const useThemeContext = () => {
  return useContext(ThemeContext);
};
