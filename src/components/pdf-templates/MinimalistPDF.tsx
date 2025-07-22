// src/components/pdf-templates/MinimalistPDF.tsx

import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
// import type { ResumeData } from '../PDFDownloader';
import type { ResumeData } from '@/types/resume';

// Register fonts - We'll use Helvetica for a clean, minimalist feel
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/helveticaneue@2.0.0/dist/Helvetica.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/helveticaneue@2.0.0/dist/Helvetica-Bold.ttf', fontWeight: 'bold' },
    { src: 'https://cdn.jsdelivr.net/npm/helveticaneue@2.0.0/dist/Helvetica-Light.ttf', fontWeight: 'light' },
  ]
});

// Create styles
const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#333' },
    header: { marginBottom: 30 },
    name: { fontSize: 32, fontWeight: 'light', letterSpacing: -1 },
    contact: { fontSize: 9, color: '#666', letterSpacing: 1, textTransform: 'uppercase', marginTop: 8 },
    summary: { marginBottom: 24, fontSize: 11, lineHeight: 1.4 },
    mainContent: { flexDirection: 'row' },
    leftColumn: { flex: 2.5, paddingRight: 20 },
    rightColumn: { flex: 1 },
    sectionTitle: { fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', color: '#888', letterSpacing: 1, marginBottom: 12 },
    experienceItem: { marginBottom: 16 },
    jobTitle: { fontSize: 12, fontWeight: 'bold' },
    companyName: { fontSize: 10, color: '#555', marginBottom: 6 },
    bulletPoint: { flexDirection: 'row', marginBottom: 3 },
    bullet: { width: 10, fontSize: 10, color: '#888' },
    bulletText: { flex: 1 },
    skill: { marginBottom: 4 }
});

// Create document component
export const MinimalistPDF = ({ data }: { data: ResumeData }) => (
  <Document author="ResumeCraft AI" title={`${data.name} Resume`}>
    <Page size="A4" style={styles.page}>
        <View style={styles.header}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.contact}>{`${data.email} // ${data.phone} // ${data.linkedin}`}</Text>
        </View>

        <Text style={styles.summary}>{data.professionalSummary}</Text>
        
        <View style={styles.mainContent}>
            <View style={styles.leftColumn}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {data.detailedExperience.map(exp => (
                    <View key={exp.id} style={styles.experienceItem} wrap={false}>
                        <Text style={styles.jobTitle}>{exp.title}</Text>
                        <Text style={styles.companyName}>{exp.company}</Text>
                        {exp.points.map((point, pIndex) => (
                            <View key={pIndex} style={styles.bulletPoint}>
                                <Text style={styles.bullet}>–</Text>
                                <Text style={styles.bulletText}>{point}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
            <View style={styles.rightColumn}>
                <Text style={styles.sectionTitle}>Skills</Text>
                {data.technicalSkills.map(skill => (
                    <Text key={skill} style={styles.skill}>{skill}</Text>
                ))}
            </View>
        </View>
    </Page>
  </Document>
);