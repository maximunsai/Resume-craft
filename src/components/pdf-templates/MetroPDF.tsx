// src/components/pdf-templates/MetroPDF.tsx

import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
// import type { ResumeData } from '../PDFDownloader';
import type { ResumeData } from '@/types/resume';

Font.register({ family: 'Inter', fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/inter-font@3.19.0/Inter-Regular.woff' },
    { src: 'https://cdn.jsdelivr.net/npm/inter-font@3.19.0/Inter-Bold.woff', fontWeight: 'bold' },
]});

const styles = StyleSheet.create({
    page: { flexDirection: 'row', fontFamily: 'Inter', fontSize: 10 },
    leftColumn: { width: '33%', padding: 25, backgroundColor: '#f9fafb' },
    rightColumn: { width: '67%', padding: 25 },
    name: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a' },
    summary: { marginTop: 12, lineHeight: 1.4, color: '#4b5563' },
    section: { marginBottom: 16 },
    leftSectionTitle: { fontSize: 9, fontWeight: 'bold', color: '#1e3a8a', textTransform: 'uppercase', marginBottom: 6 },
    contactItem: { fontSize: 9, marginBottom: 3 },
    rightSectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 10 },
    experienceItem: { marginBottom: 12 },
    jobTitle: { fontSize: 11, fontWeight: 'bold' },
    companyName: { fontSize: 10, color: '#6b7280', marginBottom: 4 },
    bulletPoint: { flexDirection: 'row', marginBottom: 3, fontSize: 9, color: '#4b5563'},
    bullet: { width: 10 },
    bulletText: { flex: 1 },
    skillContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    skillTag: { backgroundColor: '#dbeafe', color: '#1e40af', fontSize: 8, padding: '3px 6px', marginRight: 4, marginBottom: 4, borderRadius: 10 },
});

export const MetroPDF = ({ data }: { data: ResumeData }) => (
  <Document author="ResumeCraft AI" title={`${data.name} Resume - Metro`}>
    <Page size="A4" style={styles.page}>
        <View style={styles.leftColumn}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.summary}>{data.professionalSummary}</Text>
            <View style={{marginTop: 20}}>
                <Text style={styles.leftSectionTitle}>Contact</Text>
                <Text style={styles.contactItem}>{data.phone}</Text>
                <Link src={`mailto:${data.email}`} style={styles.contactItem}>{data.email}</Link>
                <Link src={data.linkedin} style={styles.contactItem}>{data.linkedin}</Link>
            </View>
        </View>

        <View style={styles.rightColumn}>
            <View style={styles.section}>
                <Text style={styles.rightSectionTitle}>Work Experience</Text>
                {data.detailedExperience.map(exp => (
                    <View key={exp.id} style={styles.experienceItem} wrap={false}>
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
            <View style={styles.section}>
                <Text style={styles.rightSectionTitle}>Skills</Text>
                <View style={styles.skillContainer}>
                    {data.technicalSkills.map(skill => (
                        <Text key={skill} style={styles.skillTag}>{skill}</Text>
                    ))}
                </View>
            </View>
        </View>
    </Page>
  </Document>
);