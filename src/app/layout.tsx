import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextUIProviders } from "./providers";
import Header from "./navbar/header";
import SessionProvider from "./SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LKC -- Lucky Digits Weekly",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="lkc-light">
      <body className={inter.className}>
        <SessionProvider>
          <NextUIProviders>
            <Header />
            <main className=" m-auto min-w-[300px] max-w-7xl p-4">
              {children}
            </main>
          </NextUIProviders>
        </SessionProvider>
      </body>
    </html>
  );
}
