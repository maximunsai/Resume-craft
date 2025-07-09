// src/components/PDFDownloader.tsx
'use client';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// --- THE SPECIFIC CHANGE IS HERE ---
// We are adding the word "export" before "interface".
// This makes the ResumeData type available to be imported by other files.
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

// Create styles for the PDF
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

// Create the PDF document component
const MyResumeDocument = ({ data }: { data: ResumeData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.name}>{data.name.toUpperCase()}</Text>
                <Text style={styles.contact}>{`${data.email} • ${data.phone} • ${data.linkedin} • ${data.github}`}</Text>
            </View>

            <View>
                <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
                <Text style={styles.paragraph}>{data.professionalSummary}</Text>

                <Text style={styles.sectionTitle}>TECHNICAL SKILLS</Text>
                <Text style={styles.paragraph}>{data.technicalSkills.join(' • ')}</Text>
                
                <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
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
        {({ loading }) =>
            loading ? 'Generating PDF...' : 'Download PDF'
        }
    </PDFDownloadLink>
);

export default PDFDownloaderComponent;