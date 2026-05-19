import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./ui/navigation";

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
      className={`${geistSans.variable} ${geistMono.variable} h-screen antialiased`}
    >
      <body className="
        text-wht-md
        selection:text-blk
        bg-blk
        selection:bg-pnk-gr
        w-screen h-screen
        flex flex-col sm:flex-row
        custom-scrollbar
      ">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
