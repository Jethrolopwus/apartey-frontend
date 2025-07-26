
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/molecules/Navbar";
import Footer from "@/components/molecules/Footer";
import QueryProvider from "@/app/QueryProvider";
import ToastProvider from "@/app/ToastProvider";
import NextProvider from "@/app/NextProvider";
import { ReviewFormProvider } from "@/app/context/RevievFormContext";
import AuthSyncProvider from "@/components/AuthSyncProvider";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Apartey",
  icons: {
    icon: "/favicon.png",
  },
  description: "make confident, awell-informed rental decision",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          async
          defer
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-50 min-h-screen font-sans`}
      >
        <ReviewFormProvider>
          <NextProvider>
            <QueryProvider>
              <AuthSyncProvider />
              <Navbar />
              {children}
              <Footer />
              <ToastProvider />
            </QueryProvider>
          </NextProvider>
        </ReviewFormProvider>
      </body>
    </html>
  );
}