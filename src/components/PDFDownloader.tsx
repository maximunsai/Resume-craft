'use client';

import { useEffect, useState } from 'react';
import { usePDF } from '@react-pdf/renderer';

// --- Interface and Imports ---
export interface ResumeData { 
    name: string; email: string; phone: string; linkedin: string; github: string;
    professionalSummary: string; technicalSkills: string[];
    detailedExperience: {
        id: number; title: string; company: string; points: string[];
    }[];
}
// Import all of your PDF components
import { ModernistPDF } from './pdf-templates/ModernistPDF';
import { ClassicPDF } from './pdf-templates/ClassicPDF';
import { MinimalistPDF } from './pdf-templates/MinimalistPDF';
import { ExecutivePDF } from './pdf-templates/ExecutivePDF';
import { CreativePDF } from './pdf-templates/CreativePDF';
import { TechnicalPDF } from './pdf-templates/TechnicalPDF';
import { AcademicPDF } from './pdf-templates/AcademicPDF';
import { CorporatePDF } from './pdf-templates/CorporatePDF';
import { SimplePDF } from './pdf-templates/SimplePDF';
import { BoldPDF } from './pdf-templates/BoldPDF';
import { ElegantPDF } from './pdf-templates/ElegantPDF';
import { ApexPDF } from './pdf-templates/ApexPDF';
import { CascadePDF } from './pdf-templates/CascadePDF';
import { MetroPDF } from './pdf-templates/MetroPDF';
import { PinnaclePDF } from './pdf-templates/PinnaclePDF';
import { OnyxPDF } from './pdf-templates/OnyxPDF';
import { CosmopolitanPDF } from './pdf-templates/CosmopolitanPDF';

// The complete map of all templates
const pdfTemplateMap = {
    modernist: ModernistPDF, classic: ClassicPDF, executive: ExecutivePDF,
    minimalist: MinimalistPDF, creative: CreativePDF, academic: AcademicPDF,
    technical: TechnicalPDF, corporate: CorporatePDF, simple: SimplePDF,
    bold: BoldPDF, elegant: ElegantPDF, apex: ApexPDF, cascade: CascadePDF,
    metro: MetroPDF, pinnacle: PinnaclePDF, onyx: OnyxPDF, cosmopolitan: CosmopolitanPDF,
};

const PDFDownloaderComponent = ({ resumeData, templateId }: { resumeData: ResumeData, templateId: string }) => {
    
    // Select the component based on the current templateId
    const SelectedPDFComponent = pdfTemplateMap[templateId as keyof typeof pdfTemplateMap] || ModernistPDF;

    // We initialize usePDF, but the document will be updated in the effect.
    const [instance, updateInstance] = usePDF({ document: <SelectedPDFComponent data={resumeData} /> });
    const [downloading, setDownloading] = useState(false);

    // =================================================================
    // THE CRITICAL FIX IS HERE
    // =================================================================
    useEffect(() => {
        // This function will now run whenever `resumeData` OR `templateId` changes.
        // It creates a new instance of the currently selected PDF component
        // and tells the `usePDF` hook to re-render the PDF in memory with it.
        const newDocument = <SelectedPDFComponent data={resumeData} />;
        updateInstance(newDocument);
    }, [resumeData, templateId, SelectedPDFComponent, updateInstance]); // Added dependencies for correctness

    const handleDownload = () => {
        if (instance.error) {
            console.error("PDF Generation Error:", instance.error);
            alert("Sorry, there was an error generating the PDF for this template. Please try another one.");
            return;
        }
        if (!instance.loading && instance.url) {
            setDownloading(true);
            const link = document.createElement('a');
            link.href = instance.url;
            link.download = `${resumeData.name.replace(' ', '_')}_Resume.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => setDownloading(false), 300);
        }
    };

    const isLoading = instance.loading || downloading;

    return (
        <button
            onClick={handleDownload}
            disabled={isLoading}
            className="block w-full text-center py-3 px-5 bg-yellow-400 text-gray-900 no-underline rounded-lg font-bold hover:bg-yellow-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
            {instance.error ? 'Error Generating PDF' : (isLoading ? 'Generating PDF...' : 'Download PDF')}
        </button>
    );
};

export default PDFDownloaderComponent;