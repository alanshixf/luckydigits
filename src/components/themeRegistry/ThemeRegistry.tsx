"use client";
import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import NextAppDirEmotionCacheProvider from "./EmotionCache";
import { ThemeContext } from "./themeContextProvider";
import { getModePalette } from "./theme";
import { Roboto, Roboto_Slab } from "next/font/google";
import { PaletteMode, useMediaQuery } from "@mui/material";
import { NextPageContext } from "next";

export async function getServerSideProps(context: NextPageContext) {
  const colorModeCookie = context.req?.headers.cookie
    ? context.req.headers.cookie
        .split("; ")
        .find((row) => row.startsWith("LKC_COLOR_MODE="))
    : null;

  const colorMode = colorModeCookie ? colorModeCookie.split("=")[1] : "light";

  return {
    props: {
      colorMode,
    },
  };
}

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const roboto_slab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export default function ThemeRegistry({
  children,
  colorMode,
}: {
  children: React.ReactNode;
  colorMode: string | undefined;
}) {
  const [mode, setMode] = React.useState<PaletteMode>(
    colorMode ? (colorMode as PaletteMode) : "light",
  );
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  React.useEffect(() => {
    let colorModeReal;
    if (!colorMode) {
      colorModeReal = prefersDarkMode ? "dark" : "light";
    } else colorModeReal = colorMode;

    setMode(colorModeReal as PaletteMode);
  }, [prefersDarkMode, colorMode]);

  const toggleColorMode = () => {
    document.cookie = `LKC_COLOR_MODE=${
      mode === "light" ? "dark" : "light"
    }; path=/`;
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = React.useMemo(() => {
    return createTheme({
      palette: getModePalette(mode).palette,
      typography: {
        fontFamily: roboto_slab.style.fontFamily,
      },
      components: {
        MuiAlert: {
          styleOverrides: {
            root: ({ ownerState }) => ({
              ...(ownerState.severity === "info" && {
                backgroundColor: "#60a5fa",
              }),
            }),
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              fontFamily: roboto.style.fontFamily,
            },
          },
        },
      },
    });
  }, [mode]);
  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <ThemeContext.Provider value={{ mode, toggleColorMode }}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {children}
        </ThemeContext.Provider>
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
