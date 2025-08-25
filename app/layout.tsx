import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/molecules/Navbar";
import ConditionalFooter from "@/components/molecules/ConditionalFooter";
import QueryProvider from "@/app/QueryProvider";
import ToastProvider from "@/app/ToastProvider";
import NextProvider from "@/app/NextProvider";
import { ReviewFormProvider } from "@/app/context/RevievFormContext";
import AuthSyncProvider from "@/components/AuthSyncProvider";
import React from "react";
import { LocationProvider } from "./userLocationContext";

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
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`}
          async
          defer
          strategy="beforeInteractive"
        />
        {/* Tawk.to Live Chat Script */}
        <Script
          id="tawk-to-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/688398648beeee192b5d57d3/1j110mj0n';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-50 min-h-screen font-sans`}
      >
        <ReviewFormProvider>
          <NextProvider>
            <QueryProvider>
              <AuthSyncProvider />
              <LocationProvider>
                <Navbar />
                {children}
                <ConditionalFooter />
              </LocationProvider>
              <ToastProvider />
            </QueryProvider>
          </NextProvider>
        </ReviewFormProvider>
      </body>
    </html>
  );
}
