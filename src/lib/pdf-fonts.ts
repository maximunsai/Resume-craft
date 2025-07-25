// src/lib/pdf-fonts.ts - THE SIMPLIFIED, BULLETPROOF VERSION

import { Font } from '@react-pdf/renderer';

let fontsRegistered = false;

export const registerAllPdfFonts = () => {
    if (fontsRegistered) return;

    console.log("Registering ONE master font (Helvetica) for all PDFs to ensure stability...");
    
    try {
        // We will only register one, ultra-reliable font family.
        Font.register({
            family: 'Helvetica', 
            fonts: [
                { src: 'https://cdn.jsdelivr.net/npm/helveticaneue@2.0.0/dist/Helvetica.ttf' },
                { src: 'https://cdn.jsdelivr.net/npm/helveticaneue@2.0.0/dist/Helvetica-Bold.ttf', fontWeight: 'bold' },
            ]
        });

        fontsRegistered = true;
        console.log("Master font (Helvetica) has been registered.");

    } catch (error) {
        console.error("CRITICAL: FONT REGISTRATION FAILED.", error);
    }
};