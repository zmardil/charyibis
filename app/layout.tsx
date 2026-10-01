import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Charybis | Find your next drive",
  description: "Discover vehicles and find your next drive on Charybis.",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  readonly children: ReactNode;
  readonly modal: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-foreground dark:bg-black">
        <SiteChrome>
          {children}
          {modal}
        </SiteChrome>
      </body>
    </html>
  );
}
