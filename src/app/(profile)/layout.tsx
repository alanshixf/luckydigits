import type { Metadata } from "next";
import { Roboto_Slab, Cormorant } from "next/font/google";
import "./globals.css";
import Header from "@/components/navbar/header";
import SessionProvider from "../SessionProvider";
import ThemeRegistry from "@/components/themeRegistry/ThemeRegistry";
import { Box, Container, Paper } from "@mui/material";
import { grey } from "@mui/material/colors";
import { cookies } from "next/headers";
import Footer from "@/components/footer/footer";
import SideBar from "@/components/navbar/sideBar";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
const roboto_slab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
  weight: "400",
  display: "swap",
});

const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: "700",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://luckydigits.life"),
  title: "LKC -- Lucky Digits Weekly",
  description: "lucky digits, blogs, fortune games, lucky digits coins, nft",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const colorMode = cookies().get("LKC_COLOR_MODE")?.value;
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <ThemeRegistry colorMode={colorMode}>
        <body
          className={roboto_slab.className}
          // style={{ background: colorMode === "dark" ? "#121212" : grey[200] }}
        >
          <SessionProvider>
            <AppRouterCacheProvider>
              <Box
                sx={{
                  margin: "auto",
                  minWidth: "300px",
                  maxWidth: "1600px",
                  minHeight: "500px",
                }}
              >
                <Header />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    margin: "auto",
                    minHeight: "500px",
                  }}
                >
                  <SideBar />
                  <Box
                    display="flex"
                    flexDirection="column"
                    ml={{ xs: "57px", sm: "240px" }}
                    maxWidth={{
                      xs: "calc(100% - 57px)",
                      sm: "calc(100% - 240px)",
                    }}
                    minHeight={{
                      xs: "calc(100vh - 80px)",
                      sm: "calc(100vh - 128px)",
                    }}
                    flexGrow={1}
                    bgcolor="background.paper"
                  >
                    <Box
                      maxWidth={"100%"}
                      sx={{
                        flexGrow: 1,
                        bgcolor: "background.paper",
                      }}
                    >
                      {children}
                    </Box>
                    <Footer
                      title="hello kitty"
                      description="Lucky Digits funny your life"
                    />
                  </Box>
                </Box>
              </Box>
            </AppRouterCacheProvider>
          </SessionProvider>
        </body>
      </ThemeRegistry>
    </html>
  );
}
