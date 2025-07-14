'use client';

import { useEffect, useState, useMemo } from 'react';
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
    modernist: ModernistPDF, 
    classic: ClassicPDF, 
    executive: ExecutivePDF,
    minimalist: MinimalistPDF, 
    creative: CreativePDF, 
    academic: AcademicPDF,
    technical: TechnicalPDF, 
    corporate: CorporatePDF, 
    simple: SimplePDF,
    bold: BoldPDF, 
    elegant: ElegantPDF, 
    apex: ApexPDF, 
    cascade: CascadePDF,
    metro: MetroPDF, 
    pinnacle: PinnaclePDF, 
    onyx: OnyxPDF, 
    cosmopolitan: CosmopolitanPDF,
};

const PDFDownloaderComponent = ({ resumeData, templateId }: { resumeData: ResumeData, templateId: string }) => {
    const [downloading, setDownloading] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(0);

    // CRITICAL FIX 1: Use useMemo to ensure component selection is memoized properly
    const SelectedPDFComponent = useMemo(() => {
        const component = pdfTemplateMap[templateId as keyof typeof pdfTemplateMap];
        if (!component) {
            console.warn(`Template "${templateId}" not found, falling back to ModernistPDF`);
            return ModernistPDF;
        }
        return component;
    }, [templateId]);

    // CRITICAL FIX 2: Create the document element with proper memoization
    const pdfDocument = useMemo(() => {
        return <SelectedPDFComponent data={resumeData} />;
    }, [SelectedPDFComponent, resumeData]);

    // CRITICAL FIX 3: Initialize usePDF with the memoized document
    const [instance, updateInstance] = usePDF({ document: pdfDocument });

    // CRITICAL FIX 4: Force re-initialization when template changes
    useEffect(() => {
        console.log(`Template changed to: ${templateId}`);
        
        // Force a complete re-initialization by updating the instance
        const newDocument = <SelectedPDFComponent data={resumeData} />;
        updateInstance(newDocument);
        
        // Force component re-render to ensure fresh state
        setForceUpdate(prev => prev + 1);
    }, [templateId, SelectedPDFComponent, resumeData, updateInstance]);

    // CRITICAL FIX 5: Add debugging to verify template selection
    useEffect(() => {
        console.log('Current template ID:', templateId);
        console.log('Selected component:', SelectedPDFComponent.name || 'Unknown');
        console.log('PDF instance loading:', instance.loading);
        console.log('PDF instance error:', instance.error);
    }, [templateId, SelectedPDFComponent, instance.loading, instance.error]);

    const handleDownload = () => {
        console.log(`Attempting to download PDF with template: ${templateId}`);
        
        if (instance.error) {
            console.error("PDF Generation Error:", instance.error);
            alert(`Sorry, there was an error generating the PDF for the "${templateId}" template. Please try another one.`);
            return;
        }
        
        if (!instance.loading && instance.url) {
            setDownloading(true);
            
            try {
                const link = document.createElement('a');
                link.href = instance.url;
                link.download = `${resumeData.name.replace(/\s+/g, '_')}_Resume_${templateId}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                console.log(`PDF downloaded successfully with template: ${templateId}`);
            } catch (error) {
                console.error('Download error:', error);
                alert('Failed to download PDF. Please try again.');
            } finally {
                setTimeout(() => setDownloading(false), 300);
            }
        } else {
            console.log('PDF not ready yet. Loading:', instance.loading, 'URL:', !!instance.url);
        }
    };

    const isLoading = instance.loading || downloading;

    return (
        <div>
            {/* Debug info - remove in production */}
            <div className="text-xs text-gray-500 mb-2">
                Template: {templateId} | Loading: {instance.loading ? 'Yes' : 'No'} | Error: {instance.error ? 'Yes' : 'No'}
            </div>
            
            <button
                onClick={handleDownload}
                disabled={isLoading}
                className="block w-full text-center py-3 px-5 bg-yellow-400 text-gray-900 no-underline rounded-lg font-bold hover:bg-yellow-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                {instance.error ? `Error with ${templateId} template` : (isLoading ? 'Generating PDF...' : `Download ${templateId} PDF`)}
            </button>
        </div>
    );
};

export default PDFDownloaderComponent;