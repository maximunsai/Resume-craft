// src/components/templates/Modernist.tsx - FIXED
import { ResumeData } from '@/components/PDFDownloader'; // Import the type

export const Modernist = ({ data }: { data: ResumeData }) => ( // Use the type
    <div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>{data.name}</h1>
        <p>{data.email} | {data.phone} | {data.linkedin}</p>
        <hr style={{ margin: '10px 0' }}/>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Professional Summary</h2>
        <p>{data.professionalSummary}</p>
        {/* Map over other sections like skills and experience */}
    </div>
);