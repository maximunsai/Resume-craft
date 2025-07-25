'use client';

import { useState, useEffect } from 'react';
// We are switching to the more robust PDFViewer component for rendering
import { PDFViewer, BlobProvider } from '@react-pdf/renderer';
import type { ResumeData } from '@/types/resume';
import { registerAllPdfFonts } from '@/lib/pdf-fonts'; // Our global registry is still correct

// --- Import ALL 17 of your PDF template components ---
import { ModernistPDF } from './pdf-templates/ModernistPDF';
// ... import all the rest
import { CosmopolitanPDF } from './pdf-templates/CosmopolitanPDF';
import { AcademicPDF } from './pdf-templates/AcademicPDF';
import { ApexPDF } from './pdf-templates/ApexPDF';
import { BoldPDF } from './pdf-templates/BoldPDF';
import { CascadePDF } from './pdf-templates/CascadePDF';
import { ClassicPDF } from './pdf-templates/ClassicPDF';
import { CorporatePDF } from './pdf-templates/CorporatePDF';
import { CreativePDF } from './pdf-templates/CreativePDF';
import { ElegantPDF } from './pdf-templates/ElegantPDF';
import { ExecutivePDF } from './pdf-templates/ExecutivePDF';
import { MetroPDF } from './pdf-templates/MetroPDF';
import { MinimalistPDF } from './pdf-templates/MinimalistPDF';
import { OnyxPDF } from './pdf-templates/OnyxPDF';
import { PinnaclePDF } from './pdf-templates/PinnaclePDF';
import { SimplePDF } from './pdf-templates/SimplePDF';
import { TechnicalPDF } from './pdf-templates/TechnicalPDF';

const pdfTemplateMap = {
    modernist: ModernistPDF, classic: ClassicPDF, executive: ExecutivePDF,
    minimalist: MinimalistPDF, creative: CreativePDF, academic: AcademicPDF,
    technical: TechnicalPDF, corporate: CorporatePDF, simple: SimplePDF,
    bold: BoldPDF, elegant: ElegantPDF, apex: ApexPDF, cascade: CascadePDF,
    metro: MetroPDF, pinnacle: PinnaclePDF, onyx: OnyxPDF, cosmopolitan: CosmopolitanPDF,
};

// This is a one-time setup call.
registerAllPdfFonts();

const PDFDownloaderComponent = ({ resumeData, templateId }: { resumeData: ResumeData, templateId: string }) => {
    
    const SelectedPDFComponent = pdfTemplateMap[templateId as keyof typeof pdfTemplateMap] || ModernistPDF;

    const handleDownload = (blob: Blob | null, url: string | null) => {
        if (blob && url) {
            const link = document.createElement('a');
            link.href = url;
            link.download = `${resumeData.name.replace(/\s+/g, '_')}_Resume_${templateId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert("Sorry, there was an error generating the PDF. Please try again.");
        }
    };

    return (
        // =================================================================
        // THE DEFINITIVE, FINAL ARCHITECTURE
        // =================================================================
        // We use the BlobProvider component. It is the most reliable way to get
        // the PDF data. It provides a render prop with the blob, url, loading, and error states.
        <BlobProvider document={<SelectedPDFComponent data={resumeData} />}>
            {({ blob, url, loading, error }) => {
                
                if (error) {
                    console.error("PDF Generation Error:", error);
                    // You can log the error to a service like Sentry here
                }

                // The button's text and state are now driven by these reliable props.
                return (
                    <button
                        onClick={() => handleDownload(blob, url)}
                        disabled={loading || !!error}
                        className="block w-full text-center py-3 px-5 bg-yellow-400 text-gray-900 no-underline rounded-lg font-bold hover:bg-yellow-500 transition-colors disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Generating PDF...' 
                            : error ? 'Error: Click to Retry' 
                            : 'Download PDF'
                        }
                    </button>
                );
            }}
        </BlobProvider>
    );
};

export default PDFDownloaderComponent;