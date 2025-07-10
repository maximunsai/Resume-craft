// src/components/PDFDownloader.tsx - THE BULLETPROOF FIX

'use client';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { ReactNode } from 'react'; // Import ReactNode for clarity

// Define the shape of our resume data. This can be shared.
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

// ... (keep the Font.register and styles objects exactly as they were)
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/helveticaneue@2.0.0/dist/Helvetica.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/helveticaneue@2.0.0/dist/Helvetica-Bold.ttf', fontWeight: 'bold' },
    { src: 'https://cdn.jsdelivr.net/npm/helveticaneue@2.0.0/dist/Helvetica-Oblique.ttf', fontStyle: 'italic' },
  ],
});
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.4,
    },
    header: { textAlign: 'center', marginBottom: 20 },
    name: { fontSize: 24, fontWeight: 'bold' },
    jobTitle: { fontSize: 12, fontWeight: 'bold', marginTop: 10 },
    companyName: { fontSize: 10, fontStyle: 'italic', marginBottom: 5 },
    contact: { fontSize: 10 },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', marginTop: 15, marginBottom: 5, borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 2, textTransform: 'uppercase' },
    bulletPoint: { marginBottom: 3, flexDirection: 'row' },
    bullet: { width: 10 },
    bulletText: { flex: 1 },
});

// ... (keep the MyResumeDocument component exactly as it was)
const MyResumeDocument = ({ data }: { data: ResumeData }) => (
    <Document author="ResumeCraft AI" title={`${data.name} Resume`}>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.name}>{data.name.toUpperCase()}</Text>
                <Text style={styles.contact}>{`${data.email} • ${data.phone} • ${data.linkedin} • ${data.github}`}</Text>
            </View>
            <View>
                <Text style={styles.sectionTitle}>Professional Summary</Text>
                <Text>{data.professionalSummary}</Text>
                <Text style={styles.sectionTitle}>Technical Skills</Text>
                <Text>{data.technicalSkills.join(' • ')}</Text>
                <Text style={styles.sectionTitle}>Professional Experience</Text>
                {data.detailedExperience.map((exp) => (
                    <View key={exp.id} wrap={false}>
                        <Text style={styles.jobTitle}>{exp.title}</Text>
                        <Text style={styles.companyName}>{exp.company}</Text>
                        {exp.points.map((point, pIndex) => (
                            <View key={pIndex} style={styles.bulletPoint}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}>{point}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

// ==================================================================
// FIXED: Proper typing for PDFDownloadLink render prop
// ==================================================================
interface BlobProviderParams {
  loading: boolean;
  error?: Error | null;
  url?: string | null;
  blob?: Blob | null;
}

const PDFDownloaderComponent = ({ resumeData }: { resumeData: ResumeData }) => (
    <PDFDownloadLink
      document={<MyResumeDocument data={resumeData} />}
      fileName={`${resumeData.name.replace(' ', '_')}_Resume.pdf`}
      className="block text-center py-3 px-5 bg-[#205295] text-white no-underline rounded-lg font-bold hover:bg-[#143F6B] transition-colors"
    >
      {({ loading, error }: BlobProviderParams) => {
        if (error) {
          return <span>Error generating PDF</span>;
        }
        return <span>{loading ? 'Generating PDF...' : 'Download PDF'}</span>;
      }}
    </PDFDownloadLink>
);

export default PDFDownloaderComponent;