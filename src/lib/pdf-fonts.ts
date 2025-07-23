// src/lib/pdf-fonts.ts

import { Font } from '@react-pdf/renderer';

let fontsRegistered = false;

// This helper function now uses our single, reliable environment variable.
const getFontPath = (fontFile: string) => {
    // process.env.NEXT_PUBLIC_APP_URL will be http://localhost:3000 on your machine,
    // and https://your-project.vercel.app in production.
    return `https://resume-craft-git-feature-3-sais-projects-89d35e11.vercel.app//fonts/${fontFile}`;
};

// This function will register all fonts needed for all PDF templates, but only once.
export const registerAllPdfFonts = () => {
    if (fontsRegistered) {
        return;
    }

    console.log("Registering all PDF fonts globally from their absolute paths...");
    
    try {
        // --- This list contains all the fonts we have used so far ---
        Font.register({
            family: 'Helvetica', fonts: [
                { src: getFontPath('Helvetica.ttf') },
                { src: getFontPath('Helvetica-Bold.ttf'), fontWeight: 'bold' },
            ]
        });
        Font.register({
            family: 'Times New Roman', fonts: [
                { src: getFontPath('times-new-roman.ttf') },
                { src: getFontPath('times-new-roman-bold.ttf'), fontWeight: 'bold' },
                { src: getFontPath('times-new-roman-italic.ttf'), fontStyle: 'italic' },
            ]
        });
        Font.register({
            family: 'Lato', fonts: [
                { src: getFontPath('lato-regular.ttf') },
                { src: getFontPath('lato-bold.ttf'), fontWeight: 'bold' },
                { src: getFontPath('lato-black.ttf'), fontWeight: 'heavy' },
            ]
        });
        Font.register({
            family: 'Montserrat', fonts: [
                { src: getFontPath('montserrat-regular.ttf') },
                { src: getFontPath('montserrat-bold.ttf'), fontWeight: 'bold' },
                { src: getFontPath('montserrat-semibold.ttf'), fontWeight: 'semibold' },
            ]
        });
        Font.register({
            family: 'CMU Serif', fonts: [
                { src: getFontPath('cmu-serif-roman.ttf') },
                { src: getFontPath('cmu-serif-bold.ttf'), fontWeight: 'bold' },
            ]
        });
        Font.register({
            family: 'Roboto', fonts: [
                { src: getFontPath('roboto-regular-webfont.ttf') },
                { src: getFontPath('roboto-bold-webfont.ttf'), fontWeight: 'bold' }
            ]
        });
        Font.register({ family: 'Roboto Mono', src: getFontPath('robotomono-regular-webfont.ttf') });
        Font.register({ family: 'Oswald', src: getFontPath('oswald-regular.ttf') });
        Font.register({ family: 'Oswald-Bold', src: getFontPath('oswald-bold.ttf') });
        Font.register({
            family: 'Playfair Display', fonts: [
                { src: getFontPath('playfair-display-latin-400-normal.woff') },
                { src: getFontPath('playfair-display-latin-700-normal.woff'), fontWeight: 'bold' },
                { src: getFontPath('playfair-display-latin-400-italic.woff'), fontStyle: 'italic' },
            ]
        });
        Font.register({
            family: 'Garamond', fonts: [
                { src: getFontPath('EBGaramond-Regular.ttf') },
                { src: getFontPath('EBGaramond-Bold.ttf'), fontWeight: 'bold' }
            ]
        });
        Font.register({
            family: 'Inter', fonts: [
                { src: getFontPath('Inter-Regular.woff') },
                { src: getFontPath('Inter-Bold.woff'), fontWeight: 'bold' }
            ]
        });
        Font.register({
            family: 'Raleway', fonts: [
                { src: getFontPath('raleway-latin-400-normal.woff') },
                { src: getFontPath('raleway-latin-700-normal.woff'), fontWeight: 'bold' },
                { src: getFontPath('raleway-latin-900-normal.woff'), fontWeight: 'heavy' }
            ]
        });

        fontsRegistered = true;
        console.log("All local PDF fonts successfully registered.");

    } catch (error) {
        console.error("CRITICAL: FONT REGISTRATION FAILED.", error);
    }
};