// src/app/(util)/thumbnail-gen/[templateId]/page.tsx

// VERIFY THIS IMPORT: We are correctly importing the "Minimalist" component.
import { Minimalist } from "@/components/templates/Minimalist"; 
import { Executive } from "@/components/templates/Executive";
import { Modernist } from "@/components/templates/Modernist";
import { Classic } from "@/components/templates/Classic";
import { placeholderResumeData } from "@/lib/placeholder-data";

// VERIFY THIS MAP: The key is "minimalist" (lowercase L).
const templateMap = {
    modernist: Modernist,
    classic: Classic,
    minimalist: Minimalist,
    executive: Executive,
};

export default function ThumbnailGeneratorPage({ params }: { params: { templateId: string } }) {
    const { templateId } = params; // This will be "minimalist" from the URL
    
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