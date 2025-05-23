import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/molecules/Navbar";
import Footer from "@/components/molecules/Footer";
import QueryProvider from "@/app/QueryProvider";
import ToastProvider from "@/app/ToastProvider";



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
      <body className={`${geistSans.className} ${geistMono.className} bg-gray-50 min-h-screen font-[family-name:var(--font-geist-sans)]`}>
        <QueryProvider>
      <ToastProvider/>
        <Navbar />
        {children}
        <Footer/>
        </QueryProvider>
      </body>
    </html>
  );
}
