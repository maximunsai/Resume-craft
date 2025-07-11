// src/app/(util)/thumbnail-gen/[templateId]/page.tsx - CORRECTED

import { Modernist } from "@/components/templates/Modernist";
import { Classic } from "@/components/templates/Classic";
import { Minimalist } from "@/components/templates/Minimalist";
import { Executive } from "@/components/templates/Executive";
import { Creative } from "@/components/templates/Creative"; 
import { Technical } from "@/components/templates/Technical"; 
import { Academic } from "@/components/templates/Academic"; 
import { Corporate } from "@/components/templates/Corporate"; 
import { Bold } from "@/components/templates/Bold"; 
import { Elegant } from "@/components/templates/Elegant"; 
import { Simple } from "@/components/templates/Simple"; 
import { Cascade } from "@/components/templates/Cascade";  
import { Apex } from "@/components/templates/Apex";  
import { Metro } from "@/components/templates/Metro";
import { Pinnacle } from "@/components/templates/Pinnacle";  
import { Onyx } from "@/components/templates/Onyx";  
import { Cosmopolitan } from "@/components/templates/Cosmopolitan";
import { placeholderResumeData } from "@/lib/placeholder-data";

// All keys are lowercase to match the URL parameters.
const templateMap = {
    modernist: Modernist,
    classic: Classic,
    minimalist: Minimalist,
    executive: Executive,
    creative: Creative,
    technical: Technical, 
    academic: Academic, 
    corporate: Corporate, 
    simple: Simple, 
    elegant: Elegant, 
    bold: Bold,
    cascade: Cascade,
    apex: Apex,
    metro: Metro,
    pinnacle: Pinnacle,
    onyx: Onyx,
    cosmopolitan: Cosmopolitan, 
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