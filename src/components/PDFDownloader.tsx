'use client';

import { useEffect } from 'react';
import { usePDF } from '@react-pdf/renderer';

// --- The ResumeData interface remains the same ---
export interface ResumeData { 
    name: string; email: string; phone: string; linkedin: string; github: string;
    professionalSummary: string; technicalSkills: string[];
    detailedExperience: {
        id: number; title: string; company: string; points: string[];
    }[];
}

// =================================================================
// THE FIX IS HERE: We must import every component used in the map below.
// =================================================================
import { ModernistPDF } from './pdf-templates/ModernistPDF';
import { ClassicPDF } from './pdf-templates/ClassicPDF';
import { ExecutivePDF } from './pdf-templates/ExecutivePDF';
import { MinimalistPDF } from './pdf-templates/MinimalistPDF';
import { CreativePDF } from './pdf-templates/CreativePDF';
import { AcademicPDF } from './pdf-templates/AcademicPDF';
import { TechnicalPDF } from './pdf-templates/TechnicalPDF';
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
// =================================================================


// This map is now valid because all components have been imported.
const pdfTemplateMap = {
    modernist: ModernistPDF, classic: ClassicPDF, executive: ExecutivePDF,
    minimalist: MinimalistPDF, creative: CreativePDF, academic: AcademicPDF,
    technical: TechnicalPDF, corporate: CorporatePDF, simple: SimplePDF,
    bold: BoldPDF, elegant: ElegantPDF, apex: ApexPDF, cascade: CascadePDF,
    metro: MetroPDF, pinnacle: PinnaclePDF, onyx: OnyxPDF, cosmopolitan: CosmopolitanPDF,
};


const PDFDownloaderComponent = ({ resumeData, templateId }: { resumeData: ResumeData, templateId: string }) => {
    
    const SelectedPDFComponent = pdfTemplateMap[templateId as keyof typeof pdfTemplateMap] || ModernistPDF;

    const [instance, updateInstance] = usePDF({ document: <SelectedPDFComponent data={resumeData} /> });

    useEffect(() => {
        // This effect re-renders the PDF in memory whenever the data or template changes.
        updateInstance(<SelectedPDFComponent data={resumeData} />);
    }, [resumeData, templateId, SelectedPDFComponent, updateInstance]);


    const handleDownload = () => {
        if (instance.error) {
            console.error("PDF Generation Error:", instance.error);
            alert(`Sorry, an error occurred with the "${templateId}" template. This is often due to a font loading issue. Please try again or select another template.`);
            return;
        }
        
        if (!instance.loading && instance.url) {
            const link = document.createElement('a');
            link.href = instance.url;
            link.download = `${resumeData.name.replace(/\s+/g, '_')}_Resume_${templateId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={instance.loading}
            className="block w-full text-center py-3 px-5 bg-yellow-400 text-gray-900 no-underline rounded-lg font-bold hover:bg-yellow-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
            {instance.loading ? 'Generating PDF...' : (instance.error ? 'Error Generating PDF' : 'Download PDF')}
        </button>
    );
};

export default PDFDownloaderComponent;