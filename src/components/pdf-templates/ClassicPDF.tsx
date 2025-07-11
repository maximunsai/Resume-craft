// src/components/pdf-templates/ClassicPDF.tsx - CORRECTED VERSION

import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
import type { ResumeData } from '../PDFDownloader';

// =================================================================
// THE FIX IS HERE: We must register ALL fonts used in the styles.
// We need both 'Times New Roman' for the main text and 'Helvetica' for other parts.
// =================================================================
Font.register({
  family: 'Times New Roman',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/times-new-roman@0.0.5/fonts/times-new-roman.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/times-new-roman@0.0.5/fonts/times-new-roman-bold.ttf', fontWeight: 'bold' },
    { src: 'https://cdn.jsdelivr.net/npm/times-new-roman@0.0.5/fonts/times-new-roman-italic.ttf', fontStyle: 'italic' },
  ],
});

Font.register({ 
  family: 'Helvetica', 
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/helveticaneue@2.0.0/dist/Helvetica.ttf' },
  ]
});
// =================================================================

// The styles are correct, as they reference the fonts we just registered.
const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Times New Roman', fontSize: 11, lineHeight: 1.3 },
    header: { textAlign: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#333', paddingBottom: 10 },
    name: { fontSize: 26, fontWeight: 'bold' },
    contact: { fontSize: 9, fontFamily: 'Helvetica' },
    section: { marginBottom: 12 },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
    jobTitle: { fontSize: 12, fontWeight: 'bold' },
    companyName: { fontSize: 11, fontStyle: 'italic', marginBottom: 4 },
    bulletPoint: { flexDirection: 'row', marginBottom: 3, fontFamily: 'Helvetica', fontSize: 10 },
    bullet: { width: 10 },
    bulletText: { flex: 1 },
});

// The main component is correct. I've added <Link> for better functionality.
export const ClassicPDF = ({ data }: { data: ResumeData }) => (
  <Document author="ResumeCraft AI" title={`${data.name} Resume - Classic`}>
    <Page size="A4" style={styles.page}>
        <View style={styles.header}>
            <Text style={styles.name}>{data.name}</Text>
            <View style={styles.contact}>
                <Text>
                    <Link src={`mailto:${data.email}`}>{data.email}</Link> | {data.phone} | <Link src={data.linkedin}>{data.linkedin}</Link> | <Link src={data.github}>{data.github}</Link>
                </Text>
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text>{data.professionalSummary}</Text>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Core Competencies</Text>
            <Text style={{ fontFamily: 'Helvetica' }}>{data.technicalSkills.join(' / ')}</Text>
        </View>
        
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
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