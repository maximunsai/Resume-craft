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
  if (fontsRegistered) return;

  console.log("Registering all PDF fonts globally from their absolute paths...");

  try {
    // Helvetica (Modernist, Corporate, Simple)
    Font.register({
      family: 'Helvetica',
      fonts: [
        { src: getFontPath('Helvetica.ttf') },
        { src: getFontPath('Helvetica-Bold.ttf'), fontWeight: 'bold' },
      ],
    });

    // Times New Roman (Classic)
    Font.register({
      family: 'Times New Roman',
      fonts: [
        { src: getFontPath('times-new-roman.ttf') },
        { src: getFontPath('times-new-roman-bold.ttf'), fontWeight: 'bold' },
        { src: getFontPath('times-new-roman-italic.ttf'), fontStyle: 'italic' },
      ],
    });

    // Lato (Executive, Apex)
    Font.register({
      family: 'Lato',
      fonts: [
        { src: getFontPath('lato-regular.ttf')},
        { src: getFontPath('lato-bold.ttf'), fontWeight: 'bold' },
        // { src: getFontPath('lato-black.ttf'), fontWeight: '900' },
      ],
    });

    // Montserrat (Creative, Pinnacle)
    Font.register({
      family: 'Montserrat',
      fonts: [
        { src: getFontPath('montserrat-regular.ttf') },
        { src: getFontPath('montserrat-bold.ttf'), fontWeight: 'bold' },
        // { src: getFontPath('montserrat-semibold.ttf'), fontWeight: '600' }, // semibold numeric
      ],
    });

    // CMU Serif (Academic)
    Font.register({
      family: 'CMU Serif',
      fonts: [
        { src: getFontPath('cmu-serif-roman.ttf') },
        { src: getFontPath('cmu-serif-bold.ttf'), fontWeight: 'bold' },
      ],
    });

    // Roboto (Technical)
    Font.register({
      family: 'Roboto',
      fonts: [
        { src: getFontPath('roboto-regular-webfont.ttf') },
        { src: getFontPath('roboto-bold-webfont.ttf'), fontWeight: 'bold' },
      ],
    });

    Font.register({
      family: 'Roboto Mono',
      src: getFontPath('robotomono-regular-webfont.ttf'),
    //   fontWeight: '400',
    });

    // Oswald (Bold)
    Font.register({
      family: 'Oswald',
      src: getFontPath('oswald-regular.ttf'),
    //   fontWeight: '400',
    });
    Font.register({
      family: 'Oswald-Bold',
      src: getFontPath('oswald-bold.ttf'),
      fontWeight: 'bold',
    });

    // Playfair Display (Elegant)
    // Convert woff -> ttf if possible, using .ttf here is a must
    Font.register({
      family: 'Playfair Display',
      fonts: [
        { src: getFontPath('playfair-display-latin-400-normal.ttf') },
        { src: getFontPath('playfair-display-latin-700-normal.ttf'), fontWeight: 'bold' },
        { src: getFontPath('playfair-display-latin-400-italic.ttf'), fontStyle: 'italic' },
      ],
    });

    // Garamond (Cascade)
    Font.register({
      family: 'Garamond',
      fonts: [
        { src: getFontPath('EBGaramond-Regular.ttf')},
        { src: getFontPath('EBGaramond-Bold.ttf'), fontWeight: 'bold' },
      ],
    });

    // Inter (Metro)
    Font.register({
      family: 'Inter',
      fonts: [
        { src: getFontPath('inter-Regular.ttf') },
        { src: getFontPath('inter-Bold.ttf'), fontWeight: 'bold' },
      ],
    });

    // Raleway (Cosmopolitan)
    Font.register({
      family: 'Raleway',
      fonts: [
        { src: getFontPath('raleway-latin-400.woff') },
        { src: getFontPath('raleway-latin-900.woff'), fontWeight: 'bold' },
        // { src: getFontPath('raleway-black.ttf'), fontWeight: '900' },
      ],
    });

    fontsRegistered = true;
    console.log("All PDF fonts successfully registered!");
  } catch (error) {
    console.error("CRITICAL ERROR during PDF fonts registration:", error);
  }
};