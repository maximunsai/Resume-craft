// src/components/FontProvider.tsx

'use client';

import { registerAllPdfFonts } from "@/lib/pdf-fonts";
import { useEffect } from "react";

// This is a "bootstrap" component. It runs code once and then does nothing else.
export const FontProvider = ({ children }: { children: React.ReactNode }) => {
    
    // This useEffect hook runs exactly once when the application first loads
    // on the client-side.
    useEffect(() => {
        // We call our global font registration function here.
        // This ensures all fonts are loaded eagerly, before any PDF is ever rendered.
        registerAllPdfFonts();
    }, []); // The empty dependency array is the key to running only once.

    // This component doesn't render any UI of its own; it just passes through its children.
    return <>{children}</>;
}