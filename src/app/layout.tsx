import Header from "@/components/Header";
import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import Image from "next/image";
import {Suspense} from "react";
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
  title: "SCARDULE",
  description: "SCHEDULING APP FOR SCAR-TECH",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const viewport =
    "width=1440, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
  return (
    <html lang="en">
      {" "}
      <head>
        <meta name="viewport" content={viewport} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white text-black min-w-[90rem] mx-auto`}
      >
        <Suspense
          fallback={
            <div className="w-screen h-screen flex justify-center items-center">
              <Image
                src="/scardule.png"
                width={400}
                height={200}
                alt="SCARDULE LOGO"
              />
            </div>
          }
        >
          <Header />
          <main className="flex flex-col items-center justify-start min-h-screen w-full p-4">
            <div className="h-[100]"></div>
            {children}
          </main>
        </Suspense>
      </body>
    </html>
  );
}
