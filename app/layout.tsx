import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./ui/navigation";
import { SessionProvider } from "next-auth/react";

const spaceMono = Space_Mono({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ['latin'],
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
      className={`h-screen antialiased`}
    >
      <body className={`
        ${spaceMono.className} 
        text-wht-md
        selection:text-blk
        bg-blk
        selection:bg-pnk-gr
        w-screen h-screen
        flex flex-col sm:flex-row
        custom-scrollbar`}
      >
        <SessionProvider>
          <Navigation />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
