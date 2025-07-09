// src/components/PDFDownloader.tsx
'use client';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Modernist } from './templates/Modernist'; // We can't reuse the component directly, must use react-pdf components

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
        fontWeight: 'bold',
    },
    contact: {
        fontSize: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 5,
        borderBottom: '1px solid #000',
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
        fontSize: 10,
    },
    bulletText: {
        flex: 1,
        fontSize: 10,
    },
});

// Create the PDF document component
const MyResumeDocument = ({ data }: { data: any }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.name}>{data.name}</Text>
                <Text style={styles.contact}>{`${data.email} | ${data.phone} | ${data.linkedin} | ${data.github}`}</Text>
            </View>

            <View>
                <Text style={styles.sectionTitle}>Professional Summary</Text>
                <Text style={styles.paragraph}>{data.professionalSummary}</Text>

                <Text style={styles.sectionTitle}>Technical Skills</Text>
                <Text style={styles.paragraph}>{data.technicalSkills.join(', ')}</Text>
                
                <Text style={styles.sectionTitle}>Professional Experience</Text>
                {data.detailedExperience.map((exp: any, index: number) => (
                    <View key={index}>
                        {/* You would need to pass company/title here too */}
                        {exp.points.map((point: string, pIndex: number) => (
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

const PDFDownloaderComponent = ({ resumeData }: { resumeData: any }) => (
    <PDFDownloadLink
      document={<MyResumeDocument data={resumeData} />}
      fileName={`${resumeData.name}_Resume.pdf`}
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
        {({ blob, url, loading, error }) =>
            loading ? 'Generating PDF...' : 'Download PDF'
        }
    </PDFDownloadLink>
);

export default PDFDownloaderComponent;