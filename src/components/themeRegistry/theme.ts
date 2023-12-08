import { Inter, Roboto_Slab, Cormorant, Roboto } from "next/font/google";

import { createTheme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

const roboto_slab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#50C878",
    },
    secondary: {
      main: "#226FF4",
    },
  },
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

export const getModePalette = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
          primary: {
            main: "#50C878",
          },
          secondary: {
            main: "#226FF4",
          },
        }
      : {
          // palette values for dark mode
          primary: {
            main: "#50C878",
          },
          secondary: {
            main: "#226FF4",
          },
          background: {
            paper: "#1c1c1c",
          },
        }),
  },
});
export default theme;
