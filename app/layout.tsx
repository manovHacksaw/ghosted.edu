import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import OCConnectWrapper from "@/components/oc-connect-wrapper";
import "./globals.css";
import Navbar from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ghosted",
  description: "Never Get Ghosted Again",
};

const opts = {
  redirectUri: 'http://localhost:3000/redirect', // Adjust this URL
  referralCode: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         
        <OCConnectWrapper opts={opts} sandboxMode={true}>
        <Navbar />
          {children} </OCConnectWrapper>

      </body>
    </html>
  );
}
