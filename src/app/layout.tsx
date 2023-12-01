import type { Metadata } from "next";
import { Inter, Roboto_Slab, Cormorant } from "next/font/google";
import "./globals.css";
import { NextUIProviders } from "./providers";
import Header from "../components/navbar/header";
import SessionProvider from "./SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
  return (
    <html lang="en" className="lkc-light">
      <body className={roboto_slab.className}>
        <SessionProvider>
          <NextUIProviders>
            <Header />
            <main className=" m-auto min-w-[300px] max-w-[1600px] bg-[#e6ffff] p-4">
              {children}
            </main>
          </NextUIProviders>
        </SessionProvider>
      </body>
    </html>
  );
}
