import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SWRegisterer } from "@/components/pwa/sw-registerer";
import StoreProvider from "./StoreProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TruckXpress - Sales Management Dashboard",
  description: "TruckXpress - Manage shipments, track trucks, and streamline freight operations efficiently.",
  manifest: "/manifest.json",
  themeColor: "#0D6EFD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0D6EFD" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <StoreProvider>
          <SWRegisterer />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
