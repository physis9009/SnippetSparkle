import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Practice Makes Perfect",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="
        text-blk-gr
        dark:text-wht-gr
        selection:text-wht
        selection:dark:text-blk
        bg-wht
        dark:bg-blk
        selection:bg-grn
        selection:dark:bg-pnk
        w-screen h-screen
      ">{children}</body>
    </html>
  );
}
