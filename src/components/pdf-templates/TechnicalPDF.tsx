// src/components/pdf-templates/TechnicalPDF.tsx

import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
import type { ResumeData } from '../PDFDownloader';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-regular-webfont.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
  ]
});
Font.register({
  family: 'Roboto Mono',
  src: 'https://cdn.jsdelivr.net/npm/roboto-mono-font@0.1.0/fonts/Roboto_Mono/robotomono-regular-webfont.ttf'
});


const styles = StyleSheet.create({
    page: { padding: 30, fontFamily: 'Roboto', fontSize: 10 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#eee', paddingBottom: 10 },
    headerLeft: { },
    headerRight: { textAlign: 'right', fontSize: 9 },
    name: { fontSize: 28, fontWeight: 'bold' },
    section: { marginTop: 15 },
    sectionTitle: { fontFamily: 'Roboto Mono', fontSize: 10, fontWeight: 'bold', color: '#555', marginBottom: 8 },
    summaryText: { lineHeight: 1.4 },
    skillsContainer: { backgroundColor: '#f5f5f5', padding: 8, borderRadius: 3 },
    skillsText: { fontFamily: 'Roboto Mono', fontSize: 9, color: '#333', lineHeight: 1.5 },
    experienceItem: { marginBottom: 15 },
    jobTitle: { fontSize: 12, fontWeight: 'bold' },
    companyName: { fontSize: 10, fontWeight: 'bold', color: '#555', marginBottom: 6 },
    bulletPoint: { flexDirection: 'row', marginBottom: 3 },
    bullet: { width: 10, color: '#0052cc', fontWeight: 'bold'},
    bulletText: { flex: 1 },
});

export const TechnicalPDF = ({ data }: { data: ResumeData }) => (
  <Document author="ResumeCraft AI" title={`${data.name} Resume - Technical`}>
    <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
            <View style={styles.headerLeft}>
                <Text style={styles.name}>{data.name}</Text>
            </View>
            <View style={styles.headerRight}>
                <Text>{data.phone}</Text>
                <Link src={`mailto:${data.email}`}>{data.email}</Link>
                <Link src={data.linkedin}>{data.linkedin}</Link>
                <Link src={data.github}>{data.github}</Link>
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>// SUMMARY</Text>
            <Text style={styles.summaryText}>{data.professionalSummary}</Text>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>// TECHNICAL_SKILLS</Text>
            <View style={styles.skillsContainer}>
                <Text style={styles.skillsText}>{data.technicalSkills.join(' | ')}</Text>
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>// PROFESSIONAL_EXPERIENCE</Text>
            {data.detailedExperience.map(exp => (
                <View key={exp.id} style={styles.experienceItem} wrap={false}>
                    <Text style={styles.jobTitle}>{exp.title}</Text>
                    <Text style={styles.companyName}>{exp.company}</Text>
                    {exp.points.map((point, pIndex) => (
                        <View key={pIndex} style={styles.bulletPoint}>
                            <Text style={styles.bullet}>{'>'}</Text>
                            <Text style={styles.bulletText}>{point}</Text>
                        </View>
                    ))}
                </View>
            ))}
        </View>
    </Page>
  </Document>
);