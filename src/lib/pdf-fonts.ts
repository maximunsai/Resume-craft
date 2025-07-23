// src/lib/pdf-fonts.ts

import { Font } from '@react-pdf/renderer';

let fontsRegistered = false;

// This function now returns a Promise that resolves when all fonts are registered.
export const registerAllPdfFonts = async (): Promise<void> => {
    if (fontsRegistered) {
        return Promise.resolve();
    }

    console.log("Registering all PDF fonts globally...");
    
    // An array of all font registration calls
    const fontPromises = [
        Font.register({ family: 'Helvetica', fonts: [/*...*/] }),
        Font.register({ family: 'Times New Roman', fonts: [/*...*/] }),
        Font.register({ family: 'Lato', fonts: [/*...*/] }),
        Font.register({ family: 'Montserrat', fonts: [/*...*/] }),
        Font.register({ family: 'CMU Serif', fonts: [/*...*/] }),
        Font.register({ family: 'Roboto', fonts: [/*...*/] }),
        Font.register({ family: 'Roboto Mono', src: '...' }),
        Font.register({ family: 'Oswald', src: '...' }),
        Font.register({ family: 'Oswald-Bold', src: '...' }),
        Font.register({ family: 'Playfair Display', fonts: [/*...*/] }),
        Font.register({ family: 'Garamond', fonts: [/*...*/] }),
        Font.register({ family: 'Inter', fonts: [/*...*/] }),
        Font.register({ family: 'Raleway', fonts: [/*...*/] }),
    ];
    
    try {
        // We wait for ALL font registration promises to complete.
        await Promise.all(fontPromises);
        fontsRegistered = true;
        console.log("All PDF fonts have been successfully registered.");
    } catch (error) {
        console.error("A critical error occurred during font registration:", error);
        // We re-throw the error so the calling component knows something went wrong.
        throw error;
    }
};