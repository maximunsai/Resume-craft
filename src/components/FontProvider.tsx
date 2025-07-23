// src/components/FontProvider.tsx
'use client';
import { registerAllPdfFonts } from "@/lib/pdf-fonts";
import { useEffect } from "react";

export const FontProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        registerAllPdfFonts();
    }, []); // The empty array ensures this runs only once.
    return <>{children}</>;
}