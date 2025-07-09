// src/components/PDFDownloader.tsx - FINAL, CORRECTED VERSION

'use client';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// This interface defines the shape of our final resume data
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

// These are the styles for the PDF document itself
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        textAlign: 'center',
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
    },
    contact: {
        fontSize: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        marginTop: 15,
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingBottom: 2,
        textTransform: 'uppercase',
    },
    jobTitle: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        marginTop: 10,
    },
    companyName: {
        fontSize: 10,
        fontFamily: 'Helvetica-Oblique',
        marginBottom: 5,
    },
    paragraph: {
        fontSize: 10,
        marginBottom: 5,
        lineHeight: 1.4,
    },
     bulletPoint: {
        fontSize: 10,
        marginBottom: 3,
        lineHeight: 1.4,
        flexDirection: 'row',
    },
    bullet: {
        width: 10,
        fontFamily: 'Helvetica',
    },
    bulletText: {
        flex: 1,
        fontFamily: 'Helvetica',
    },
});

// This is the component that defines the structure of our PDF
const MyResumeDocument = ({ data }: { data: ResumeData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.name}>{data.name}</Text>
                <Text style={styles.contact}>{`${data.email} • ${data.phone} • ${data.linkedin} • ${data.github}`}</Text>
            </View>

            <View>
                <Text style={styles.sectionTitle}>Professional Summary</Text>
                <Text style={styles.paragraph}>{data.professionalSummary}</Text>

                <Text style={styles.sectionTitle}>Technical Skills</Text>
                <Text style={styles.paragraph}>{data.technicalSkills.join(' • ')}</Text>
                
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

// THIS IS THE COMPONENT WITH THE FIX
const PDFDownloaderComponent = ({ resumeData }: { resumeData: ResumeData }) => (
    <PDFDownloadLink
      document={<MyResumeDocument data={resumeData} />}
      fileName={`${resumeData.name.replace(' ', '_')}_Resume.pdf`}
      style={{
          display: 'block',
          textAlign: 'center',
          padding: '12px 20px',
          backgroundColor: '#205295',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
      }}
    >
      {/* 
        THE FIX IS HERE: We simplify the child function. 
        It receives the `loading` state and returns a string, which is a valid ReactNode.
        This simplified version is easily understood by TypeScript.
      */}
      {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
    </PDFDownloadLink>
);

export default PDFDownloaderComponent;