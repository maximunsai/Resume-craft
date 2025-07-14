// src/app/layout.tsx

import type { Metadata } from "next";
// Import the necessary fonts from Google Fonts
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

// Configure the fonts
const inter = Inter({ 
    subsets: ["latin"],
    variable: '--font-inter', // Create a CSS variable
});
const poppins = Poppins({ 
    subsets: ["latin"],
    weight: ['400', '600', '700', '800'],
    variable: '--font-poppins', // Create another CSS variable
});

export const metadata: Metadata = {
  title: "ResumeCraft AI | Forge Your Future with AI-Crafted Resumes",
  description: "Our master AI forge transforms your career raw materials into interview-winning masterpieces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply the font variables to the body */}
      <body className={`${inter.variable} ${poppins.variable}`}>
        {children}
      </body>
    </html>
  );
}