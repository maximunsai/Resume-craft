// src/app/(util)/thumbnail-gen/[templateId]/page.tsx - CORRECTED

import { Modernist } from "@/components/templates/Modernist";
import { Classic } from "@/components/templates/Classic";
import { Minimalist } from "@/components/templates/Minimalist";
import { Executive } from "@/components/templates/Executive";
import { Creative } from "@/components/templates/Creative"; // Import new
import { Technical } from "@/components/templates/Technical"; // Import new
import { placeholderResumeData } from "@/lib/placeholder-data";

// All keys are lowercase to match the URL parameters.
const templateMap = {
    modernist: Modernist,
    classic: Classic,
    minimalist: Minimalist,
    executive: Executive,
    creative: Creative,
    technical: Technical, // <-- Key is 'technical' (lowercase)
};

export default function ThumbnailGeneratorPage({ params }: { params: { templateId: string } }) {
    const { templateId } = params;
    
    const SelectedTemplate = templateMap[templateId as keyof typeof templateMap];

    if (!SelectedTemplate) {
        return <div>Template '{templateId}' not found. Please check component export and map key.</div>;
    }

    return (
        <div className="w-[850px] h-[1100px] bg-white p-12 mx-auto my-12 shadow-2xl">
            <SelectedTemplate data={placeholderResumeData} />
        </div>
    );
}