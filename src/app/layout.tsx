// src/app/layout.tsx - THE FINAL FIX

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResumeCraft AI",
  description: "Build your professional, ATS-friendly resume in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/*
          This is the traditional, stable way to load Google Fonts.
          It bypasses the entire next/font optimization system that is causing the error.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}