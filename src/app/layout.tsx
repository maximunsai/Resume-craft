import type { Metadata } from "next";
// This font setup might be from an older `create-next-app` template.
// I'll provide a more modern alternative below, but this one is not incorrect.
import { Inter } from "next/font/google"; 
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ResumeCraft AI", // Let's give it a proper title
  description: "Build your professional, ATS-friendly resume in minutes.", // And a good description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 
        This applies the 'Inter' font to the entire application.
        The theme colors we want are applied via Tailwind CSS in `globals.css`
        and on a per-page basis, so this is correct.
      */}
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}