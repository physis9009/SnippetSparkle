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
  title: {
    template: "%s | Snippet Sparkle",
    default: "Snippet Sparkle",
  },
  description: "A secure personal snippet sharing app with login, favorites, and searchable collections.",
  keywords: ['code snippets', 'snippet sharing', 'personal library', 'favorites', 'search', 'authentication', 'login', 'Next.js', 'web app', 'productivity'],
  creator: 'Wynn Wang',
  openGraph: {
    title: "Snippet Sparkle",
    description: "A secure personal snippet sharing app with login, favorites, and searchable collections.",
    siteName: 'SnippetSparkle',
    type: 'website',
  },
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
