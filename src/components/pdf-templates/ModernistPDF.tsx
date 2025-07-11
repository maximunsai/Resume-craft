// src/components/pdf-templates/ModernistPDF.tsx

import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { ResumeData } from '../PDFDownloader'; // Import the shared type

// Register fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/helveticaneue@2.0.0/dist/Helvetica.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/helveticaneue@2.0.0/dist/Helvetica-Bold.ttf', fontWeight: 'bold' },
  ],
});

// Create styles
const styles = StyleSheet.create({
    page: { padding: 30, fontFamily: 'Helvetica', fontSize: 10, lineHeight: 1.4, color: '#333' },
    header: { textAlign: 'left', marginBottom: 20 },
    name: { fontSize: 28, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 },
    contact: { fontSize: 9, color: '#555' },
    section: { marginBottom: 15 },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', borderBottomWidth: 2, borderBottomColor: '#333', paddingBottom: 2, marginBottom: 8 },
    jobTitle: { fontSize: 11, fontWeight: 'bold' },
    companyName: { fontSize: 10, marginBottom: 4 },
    bulletPoint: { flexDirection: 'row', marginBottom: 3 },
    bullet: { width: 10, fontSize: 10 },
    bulletText: { flex: 1 },
});

// Create document component
export const ModernistPDF = ({ data }: { data: ResumeData }) => (
  <Document author="ResumeCraft AI" title={`${data.name} Resume`}>
    <Page size="A4" style={styles.page}>
        <View style={styles.header}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.contact}>{`${data.email} • ${data.phone} • ${data.linkedin} • ${data.github}`}</Text>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text>{data.professionalSummary}</Text>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text>{data.technicalSkills.join(' • ')}</Text>
        </View>
        
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.detailedExperience.map(exp => (
                <View key={exp.id} wrap={false} style={{ marginBottom: 10 }}>
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