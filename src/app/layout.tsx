import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white text-black`}
      >
        <main className="flex flex-col items-center justify-start min-h-screen w-full p-4">
          <Suspense fallback={<div>Loading page...</div>}>{children}</Suspense>
        </main>
      </body>
    </html>
  );
}
