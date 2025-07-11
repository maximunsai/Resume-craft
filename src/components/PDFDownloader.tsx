// src/components/PDFDownloader.tsx - THE FINAL, CORRECT FIX

'use client';

// =================================================================
// THE FIX: We need to import useCallback from React.
// =================================================================
import { useEffect, useState, useCallback } from 'react';
import { usePDF } from '@react-pdf/renderer';

// --- Keep these imports and the interface as they are ---
export interface ResumeData { 
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    professionalSummary: string;
    technicalSkills: string[];
    detailedExperience: {
        id: number;
        title: string; 
        company: string;
        points: string[];
    }[];
}
import { ModernistPDF } from './pdf-templates/ModernistPDF';
import { ClassicPDF } from './pdf-templates/ClassicPDF';
import { MinimalistPDF } from './pdf-templates/MinimalistPDF';
import { ExecutivePDF } from './pdf-templates/ExecutivePDF';



const pdfTemplateMap = {
    modernist: ModernistPDF,
    classic: ClassicPDF,
    minimalist: MinimalistPDF,
    executive: ExecutivePDF, 

};
// =======================================================


const PDFDownloaderComponent = ({ resumeData, templateId }: { resumeData: ResumeData, templateId: string }) => {
    
    const SelectedPDFComponent = pdfTemplateMap[templateId as keyof typeof pdfTemplateMap] || ModernistPDF;

    const [instance, updateInstance] = usePDF({ document: <SelectedPDFComponent data={resumeData} /> });
    const [downloading, setDownloading] = useState(false);

    // =================================================================
    // THE FIX: The dependency array for useEffect was causing an infinite loop.
    // By removing updateInstance from the dependency array, we break the loop.
    // The component will now correctly re-render the PDF only when the
    // actual data (resumeData, templateId) changes.
    // =================================================================
    useEffect(() => {
        // We call updateInstance() to regenerate the PDF in memory
        // whenever the underlying data or selected template changes.
        updateInstance(<SelectedPDFComponent data={resumeData} />); // Pass the new document
    }, [resumeData, templateId]); // We remove `updateInstance` from this array.

    const handleDownload = () => {
        if (!instance.loading && instance.url) {
            setDownloading(true);
            const link = document.createElement('a');
            link.href = instance.url;
            link.download = `${resumeData.name.replace(' ', '_')}_Resume.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // Add a small delay before resetting the downloading state for a better UX
            setTimeout(() => setDownloading(false), 300);
        }
    };

    const isLoading = instance.loading || downloading;

    return (
        <button
            onClick={handleDownload}
            disabled={isLoading || !!instance.error}
            className="block w-full text-center py-3 px-5 bg-green-600 text-white no-underline rounded-lg font-bold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            {instance.error ? 'Error generating PDF' : (isLoading ? 'Generating PDF...' : 'Download PDF')}
        </button>
    );
};

export default PDFDownloaderComponent;