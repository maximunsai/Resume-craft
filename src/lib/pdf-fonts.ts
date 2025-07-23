// src/lib/pdf-fonts.ts

import { Font } from '@react-pdf/renderer';

let fontsRegistered = false;

// This function will register all fonts needed for all PDF templates, but only once.
export const registerAllPdfFonts = () => {
    if (fontsRegistered) return;

    console.log("Registering all PDF fonts globally, once.");
    
    // An array of font registration calls. The library handles these asynchronously.
    Font.register({ family: 'Helvetica', fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/helveticaneue@2.0.0/dist/Helvetica.ttf' },
        { src: 'https://cdn.jsdelivr.net/npm/helveticaneue@2.0.0/dist/Helvetica-Bold.ttf', fontWeight: 'bold' },
    ]});
    Font.register({ family: 'Times New Roman', fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/times-new-roman@0.0.5/fonts/times-new-roman.ttf' },
        { src: 'https://cdn.jsdelivr.net/npm/times-new-roman@0.0.5/fonts/times-new-roman-bold.ttf', fontWeight: 'bold' },
        { src: 'https://cdn.jsdelivr.net/npm/times-new-roman@0.0.5/fonts/times-new-roman-italic.ttf', fontStyle: 'italic' },
    ]});
    Font.register({ family: 'Lato', fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/lato-font@3.0.0/fonts/lato-regular.ttf' },
        { src: 'https://cdn.jsdelivr.net/npm/lato-font@3.0.0/fonts/lato-bold.ttf', fontWeight: 'bold' },
        { src: 'https://cdn.jsdelivr.net/npm/lato-font@3.0.0/fonts/lato-black.ttf', fontWeight: 'heavy' },
    ]});
    Font.register({ family: 'Montserrat', fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/montserrat@0.0.1/fonts/montserrat/Montserrat-Regular.ttf' },
        { src: 'https://cdn.jsdelivr.net/npm/montserrat@0.0.1/fonts/montserrat/Montserrat-Bold.ttf', fontWeight: 'bold' },
        { src: 'https://cdn.jsdelivr.net/npm/montserrat@0.0.1/fonts/montserrat/SemiBold.ttf', fontWeight: 'semibold'},
    ]});
    Font.register({ family: 'CMU Serif', fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/cmu-serif@0.1.0/cmu-serif-roman.ttf' },
        { src: 'https://cdn.jsdelivr.net/npm/cmu-serif@0.1.0/cmu-serif-bold.ttf', fontWeight: 'bold' },
    ]});
    Font.register({ family: 'Roboto', fonts: [ { src: 'https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-regular-webfont.ttf' }, { src: 'https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' }]});
    Font.register({ family: 'Roboto Mono', src: 'https://cdn.jsdelivr.net/npm/roboto-mono-font@0.1.0/fonts/Roboto_Mono/robotomono-regular-webfont.ttf' });
    Font.register({ family: 'Oswald', src: 'https://cdn.jsdelivr.net/npm/oswald-font@0.1.0/fonts/oswald-regular.ttf' });
    Font.register({ family: 'Oswald-Bold', src: 'https://cdn.jsdelivr.net/npm/oswald-font@0.1.0/fonts/oswald-bold.ttf' });
    Font.register({ family: 'Playfair Display', fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/@fontsource/playfair-display@4.5.13/files/playfair-display-latin-400-normal.woff' },
        { src: 'https://cdn.jsdelivr.net/npm/@fontsource/playfair-display@4.5.13/files/playfair-display-latin-700-normal.woff', fontWeight: 'bold'},
        { src: 'https://cdn.jsdelivr.net/npm/@fontsource/playfair-display@4.5.13/files/playfair-display-latin-400-italic.woff', fontStyle: 'italic' },
    ]});
    Font.register({ family: 'Garamond', fonts: [ { src: 'https://cdn.jsdelivr.net/npm/eb-garamond@1.0.1/fonts/EBGaramond-Regular.ttf' }, { src: 'https://cdn.jsdelivr.net/npm/eb-garamond@1.0.1/fonts/EBGaramond-Bold.ttf', fontWeight: 'bold' }]});
    Font.register({ family: 'Inter', fonts: [ { src: 'https://cdn.jsdelivr.net/npm/inter-font@3.19.0/Inter-Regular.woff' }, { src: 'https://cdn.jsdelivr.net/npm/inter-font@3.19.0/Inter-Bold.woff', fontWeight: 'bold' }]});
    Font.register({ family: 'Raleway', fonts: [ { src: 'https://cdn.jsdelivr.net/npm/@fontsource/raleway@4.5.12/files/raleway-latin-400-normal.woff' }, { src: 'https://cdn.jsdelivr.net/npm/@fontsource/raleway@4.5.12/files/raleway-latin-700-normal.woff', fontWeight: 'bold' }, { src: 'https://cdn.jsdelivr.net/npm/@fontsource/raleway@4.5.12/files/raleway-latin-900-normal.woff', fontWeight: 'heavy' }]});

    fontsRegistered = true;
};