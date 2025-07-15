'use client';

import { useEffect, useCallback, useState } from 'react';
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
// Import all PDF template components
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

const pdfTemplateMap = {
    modernist: ModernistPDF, classic: ClassicPDF, executive: ExecutivePDF,
    minimalist: MinimalistPDF, creative: CreativePDF, academic: AcademicPDF,
    technical: TechnicalPDF, corporate: CorporatePDF, simple: SimplePDF,
    bold: BoldPDF, elegant: ElegantPDF, apex: ApexPDF, cascade: CascadePDF,
    metro: MetroPDF, pinnacle: PinnaclePDF, onyx: OnyxPDF, cosmopolitan: CosmopolitanPDF,
};

const PDFDownloaderComponent = ({ resumeData, templateId }: { resumeData: ResumeData, templateId: string }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);
    
    const SelectedPDFComponent = pdfTemplateMap[templateId as keyof typeof pdfTemplateMap] || ModernistPDF;

    const [instance, updateInstance] = usePDF({ 
        document: <SelectedPDFComponent data={resumeData} /> 
    });

    // Memoize the update function to prevent unnecessary re-renders
    const updatePDFInstance = useCallback(() => {
        try {
            updateInstance(<SelectedPDFComponent data={resumeData} />);
            setDownloadError(null); // Clear any previous errors
        } catch (error) {
            console.error("PDF Update Error:", error);
            setDownloadError("Failed to update PDF template");
        }
    }, [resumeData, templateId, SelectedPDFComponent, updateInstance]);

    useEffect(() => {
        updatePDFInstance();
    }, [updatePDFInstance]);

    const handleDownload = async () => {
        setIsDownloading(true);
        setDownloadError(null);

        try {
            // Wait a bit if still loading
            if (instance.loading) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // Check if we have a valid URL for download
            if (!instance.url) {
                // Try to regenerate the PDF if no URL is available
                updatePDFInstance();
                
                // Wait for regeneration
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                if (!instance.url) {
                    throw new Error("PDF generation failed - no download URL available");
                }
            }

            // Only block download if there's a critical error AND no URL
            if (instance.error && !instance.url) {
                throw new Error(`PDF generation failed: ${instance.error}`);
            }

            // If we have a URL, proceed with download even if there are minor errors
            if (instance.url) {
                const link = document.createElement('a');
                link.href = instance.url;
                link.download = `${resumeData.name.replace(/\s+/g, '_')}_Resume_${templateId}.pdf`;
                link.style.display = 'none';
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Log any non-critical errors for debugging
                if (instance.error) {
                    console.warn("PDF generated with warnings:", instance.error);
                }
            }

        } catch (error) {
            console.error("Download Error:", error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown download error';
            setDownloadError(errorMessage);
            
            // Show user-friendly error message
            alert(`Download failed: ${errorMessage}. Please try again or select a different template.`);
        } finally {
            setIsDownloading(false);
        }
    };

    // Determine button state
    const isButtonDisabled = instance.loading || isDownloading;
    const buttonText = isDownloading ? 'Downloading...' : 
                      instance.loading ? 'Generating PDF...' : 
                      'Download PDF';

    return (
        <div className="w-full">
            <button
                onClick={handleDownload}
                disabled={isButtonDisabled}
                className="block w-full text-center py-3 px-5 bg-yellow-400 text-gray-900 no-underline rounded-lg font-bold hover:bg-yellow-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                {buttonText}
            </button>
            
            {/* Show error message if any */}
            {downloadError && (
                <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                    Error: {downloadError}
                </div>
            )}
            
            {/* Show warning if PDF has errors but URL exists */}
            {instance.error && instance.url && !downloadError && (
                <div className="mt-2 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-sm">
                    PDF generated with warnings. Download should still work.
                </div>
            )}
        </div>
    );
};

export default PDFDownloaderComponent;