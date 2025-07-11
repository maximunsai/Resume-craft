// src/components/pdf-templates/CascadePDF.tsx

import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
import type { ResumeData } from '../PDFDownloader';

Font.register({ family: 'Garamond', fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/eb-garamond@1.0.1/fonts/EBGaramond-Regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/eb-garamond@1.0.1/fonts/EBGaramond-Bold.ttf', fontWeight: 'bold' },
]});

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Garamond', fontSize: 11 },
    header: { textAlign: 'center', paddingBottom: 12 },
    name: { fontSize: 24, fontWeight: 'bold' },
    contact: { fontSize: 10, marginTop: 4 },
    section: { paddingTop: 12, borderTopWidth: 1.5, borderTopColor: '#e5e7eb' },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 },
    experienceItem: { marginTop: 10 },
    expHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    jobTitle: { fontSize: 12, fontWeight: 'bold' },
    companyName: { fontSize: 11, color: '#374151' },
    bulletPoint: { flexDirection: 'row', marginTop: 4, marginLeft: 10 },
    bullet: { width: 10 },
    bulletText: { flex: 1 },
});

export const CascadePDF = ({ data }: { data: ResumeData }) => (
  <Document author="ResumeCraft AI" title={`${data.name} Resume - Cascade`}>
    <Page size="A4" style={styles.page}>
        <View style={styles.header}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.contact}>
                <Link src={`mailto:${data.email}`}>{data.email}</Link> | {data.phone} | <Link src={data.linkedin}>{data.linkedin}</Link>
            </Text>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text>{data.professionalSummary}</Text>
        </View>
        
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.detailedExperience.map(exp => (
                <View key={exp.id} style={styles.experienceItem} wrap={false}>
                    <View style={styles.expHeader}>
                        <Text style={styles.jobTitle}>{exp.title}</Text>
                        <Text style={styles.companyName}>{exp.company}</Text>
                    </View>
                    {exp.points.map((point, pIndex) => (
                        <View key={pIndex} style={styles.bulletPoint}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.bulletText}>{point}</Text>
                        </View>
                    ))}
                </View>
            ))}
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text>{data.technicalSkills.join(' • ')}</Text>
        </View>
    </Page>
  </Document>
);