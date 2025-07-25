// src/components/pdf-templates/ApexPDF.tsx

import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
// import type { ResumeData } from '../PDFDownloader';
import type { ResumeData } from '@/types/resume';

Font.register({ family: 'Roboto', fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-regular-webfont.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
    { src: 'https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-black-webfont.ttf', fontWeight: 'heavy' },
]});

const styles = StyleSheet.create({
    page: { fontFamily: 'Roboto', fontSize: 10, color: '#2d3748' },
    header: { backgroundColor: '#475569', color: 'white', padding: '25px 35px' },
    name: { fontSize: 32, fontWeight: 'heavy' },
    hr: { borderBottomWidth: 1, borderBottomColor: '#64748b', margin: '10px 0' },
    contactContainer: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 9, color: '#cbd5e0' },
    main: { padding: '20px 35px' },
    section: { marginBottom: 15 },
    sectionTitle: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b', marginBottom: 8, letterSpacing: 1 },
    experienceItem: { marginBottom: 12 },
    jobTitle: { fontSize: 12, fontWeight: 'bold' },
    companyName: { fontSize: 10, color: '#475569', marginBottom: 5 },
    bulletPoint: { flexDirection: 'row', marginBottom: 3 },
    bullet: { width: 10 },
    bulletText: { flex: 1 },
    skillsContainer: { backgroundColor: '#f1f5f9', padding: 8, borderRadius: 3, fontSize: 9},
});

export const ApexPDF = ({ data }: { data: ResumeData }) => (
  <Document author="ResumeCraft AI" title={`${data.name} Resume - Apex`}>
    <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
            <Text style={styles.name}>{data.name}</Text>
            <View style={styles.hr} />
            <View style={styles.contactContainer}>
                <Text>{data.phone}</Text>
                <Link src={`mailto:${data.email}`}>{data.email}</Link>
                <Link src={data.linkedin}>{data.linkedin}</Link>
                <Link src={data.github}>{data.github}</Link>
            </View>
        </View>

        <View style={styles.main}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Executive Summary</Text>
                <Text>{data.professionalSummary}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Professional Experience</Text>
                {data.detailedExperience.map(exp => (
                    <View key={exp.id} style={styles.experienceItem} wrap={false}>
                        <Text style={styles.jobTitle}>{exp.title}</Text>
                        <Text style={styles.companyName}>{exp.company}</Text>
                        {(exp.points || []).map((point, pIndex) => (
                            <View key={pIndex} style={styles.bulletPoint}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}>{point}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Technical Proficiencies</Text>
                <View style={styles.skillsContainer}>
                    <Text>{data.technicalSkills.join(' | ')}</Text>
                </View>
            </View>
        </View>
    </Page>
  </Document>
);