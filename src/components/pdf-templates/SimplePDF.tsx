// src/components/pdf-templates/SimplePDF.tsx

import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
import type { ResumeData } from '../PDFDownloader';

Font.register({ family: 'Helvetica', fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/helveticaneue@2.0.0/dist/Helvetica.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/helveticaneue@2.0.0/dist/Helvetica-Bold.ttf', fontWeight: 'bold' },
]});

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, lineHeight: 1.5 },
    header: { textAlign: 'center', marginBottom: 24 },
    name: { fontSize: 26, fontWeight: 'bold' },
    contact: { fontSize: 9, color: '#555', marginTop: 4 },
    section: { marginBottom: 16 },
    sectionTitle: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', color: '#444' },
    hr: { borderBottomWidth: 0.5, borderBottomColor: '#ccc', marginTop: 2, marginBottom: 8 },
    experienceItem: { marginTop: 12 },
    expHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    jobTitle: { fontSize: 12, fontWeight: 'bold' },
    companyName: { fontSize: 10, color: '#555', fontStyle: 'italic' },
    bulletPoint: { flexDirection: 'row', marginTop: 4, marginLeft: 10 },
    bullet: { width: 10 },
    bulletText: { flex: 1 },
});

export const SimplePDF = ({ data }: { data: ResumeData }) => (
  <Document author="ResumeCraft AI" title={`${data.name} Resume`}>
    <Page size="A4" style={styles.page}>
        <View style={styles.header}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.contact}>
                {data.phone} | <Link src={`mailto:${data.email}`}>{data.email}</Link> | <Link src={data.linkedin}>{data.linkedin}</Link>
            </Text>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <View style={styles.hr} />
            <Text>{data.professionalSummary}</Text>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.hr} />
            <Text>{data.technicalSkills.join(' | ')}</Text>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            <View style={styles.hr} />
            {data.detailedExperience.map(exp => (
                <View key={exp.id} style={styles.experienceItem} wrap={false}>
                    <View style={styles.expHeader}>
                        <Text style={styles.jobTitle}>{exp.title}</Text>
                    </View>
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