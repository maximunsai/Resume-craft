'use client';

import { usePDF } from '@react-pdf/renderer';
import type { ResumeData } from '@/types/resume'; // Assuming types are in `src/types/resume.ts`

import { ModernistPDF } from './pdf-templates/ModernistPDF';
import { ClassicPDF } from './pdf-templates/ClassicPDF';
import { CosmopolitanPDF } from './pdf-templates/CosmopolitanPDF';
import { AcademicPDF } from './pdf-templates/AcademicPDF';
import { ApexPDF } from './pdf-templates/ApexPDF';
import { BoldPDF } from './pdf-templates/BoldPDF';
import { CascadePDF } from './pdf-templates/CascadePDF';
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


// This map MUST have lowercase keys that match your template IDs
const pdfTemplateMap = {
    modernist: ModernistPDF, classic: ClassicPDF, executive: ExecutivePDF,
    minimalist: MinimalistPDF, creative: CreativePDF, academic: AcademicPDF,
    technical: TechnicalPDF, corporate: CorporatePDF, simple: SimplePDF,
    bold: BoldPDF, elegant: ElegantPDF, apex: ApexPDF, cascade: CascadePDF,
    metro: MetroPDF, pinnacle: PinnaclePDF, onyx: OnyxPDF, cosmopolitan: CosmopolitanPDF,
};


const PDFDownloaderComponent = ({ resumeData, templateId }: { resumeData: ResumeData, templateId: string }) => {
    
    // Select the component based on the current templateId passed via props.
    const SelectedPDFComponent = pdfTemplateMap[templateId as keyof typeof pdfTemplateMap] || ModernistPDF;

    // The usePDF hook is now simple and declarative. Because the parent component
    // uses a `key`, this entire component is re-created from scratch when the
    // templateId changes, ensuring a fresh, correct document every time.
    const [instance] = usePDF({ document: <SelectedPDFComponent data={resumeData} /> });

    const handleDownload = () => {
        if (instance.error) {
            console.error("PDF Generation Error:", instance.error);
            alert(`Sorry, an error occurred while generating the PDF. Please try again.`);
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
            disabled={instance.loading || !!instance.error}
            className="block w-full text-center py-3 px-5 bg-yellow-400 text-gray-900 no-underline rounded-lg font-bold hover:bg-yellow-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
            {instance.loading ? 'Generating PDF...' 
                : instance.error ? 'Error: Click to Retry' 
                : 'Download PDF'
            }
        </button>
    );
};

export default PDFDownloaderComponent;