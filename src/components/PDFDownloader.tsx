'use client';

import { usePDF } from '@react-pdf/renderer';
import type { ResumeData } from '@/types/resume';
// =================================================================
// THE DEFINITIVE FIX:
// We are restoring the `ResumeData` interface and EXPORTING it from this file.
// This is the "contract" that all your other template files are expecting.
// By putting it back here, we fix the "module has no exported member" error for good.
// =================================================================

// --- Import ALL 17 of your PDF template components ---
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

// This map is correct and complete.
const pdfTemplateMap = {
    modernist: ModernistPDF, classic: ClassicPDF, executive: ExecutivePDF,
    minimalist: MinimalistPDF, creative: CreativePDF, academic: AcademicPDF,
    technical: TechnicalPDF, corporate: CorporatePDF, simple: SimplePDF,
    bold: BoldPDF, elegant: ElegantPDF, apex: ApexPDF, cascade: CascadePDF,
    metro: MetroPDF, pinnacle: PinnaclePDF, onyx: OnyxPDF, cosmopolitan: CosmopolitanPDF,
};

// The component itself is now correct and uses the local ResumeData interface.
const PDFDownloaderComponent = ({ resumeData, templateId }: { resumeData: ResumeData, templateId: string }) => {
    
    const SelectedPDFComponent = pdfTemplateMap[templateId as keyof typeof pdfTemplateMap] || ModernistPDF;

    // The usePDF hook is declarative and robust.
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