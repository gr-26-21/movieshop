import { Geist_Mono, Outfit } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import MainNavbar from "@/components/main-navbar";
import { Toaster } from "@/components/ui/toast";
import { CartProvider } from "@/context/cart-context";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Movieshop",
    template: "%s | Movieshop",
  },
  description: "Browse movies and shop online at Movieshop.",
};

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        outfit.variable
      )}
    >
      <body>
        <ThemeProvider>
          <CartProvider>
            <MainNavbar />
            {children}
            <Toaster />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
