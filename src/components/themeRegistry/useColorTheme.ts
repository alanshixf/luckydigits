"use client";
import { createTheme, PaletteMode, useMediaQuery } from "@mui/material";
import React, { useEffect } from "react";
import { getModePalette } from "./theme";
import { Roboto } from "next/font/google";

export const useColorTheme = () => {
  const [mode, setMode] = React.useState<PaletteMode>("light");

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    let colorMode = localStorage.getItem("LKC_COLOR_MODE");
    if (!colorMode) {
      colorMode = prefersDarkMode ? "dark" : "light";
    }

    setMode(colorMode as PaletteMode);
  }, [prefersDarkMode]);

  const toggleColorMode = () => {
    localStorage.setItem("LKC_COLOR_MODE", mode === "light" ? "dark" : "light");
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  // const modifiedTheme = React.useMemo(
  //   () =>
  //     createTheme({
  //       ...theme,
  //       palette: {
  //         ...theme.palette,
  //         mode,
  //       },
  //     }),
  //   [mode]
  // );

  return {
    mode,
    toggleColorMode,
  };
};
