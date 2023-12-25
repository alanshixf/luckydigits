import type { Metadata } from "next";
import { Roboto_Slab } from "next/font/google";
import "./globals.css";
import Header from "@/components/navbar/header";
import SessionProvider from "../SessionProvider";
import ThemeRegistry from "@/components/themeRegistry/ThemeRegistry";
import { Box, Container, Paper } from "@mui/material";
import { grey } from "@mui/material/colors";
import { cookies } from "next/headers";
import Footer from "@/components/footer/footer";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
const roboto_slab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
  weight: "400",
  display: "swap",
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
              <Container
                maxWidth={false}
                disableGutters
                sx={{
                  margin: "auto",
                  minWidth: "300px",
                  maxWidth: "1600px",
                  minHeight: {
                    xs: "calc(100vh - 80px)",
                    sm: "calc(100vh - 128px)",
                  },
                }}
              >
                <Header />
                <Box
                  display="flex"
                  flexDirection="column"
                  minHeight={{
                    xs: "calc(100vh - 80px)",
                    sm: "calc(100vh - 128px)",
                  }}
                  bgcolor="background.paper"
                >
                  <Box sx={{ flexGrow: 1 }}>{children}</Box>
                  <Footer
                    title="hello kitty"
                    description="Lucky Digits funny your life"
                  />
                </Box>
              </Container>
            </AppRouterCacheProvider>
          </SessionProvider>
        </body>
      </ThemeRegistry>
    </html>
  );
}
