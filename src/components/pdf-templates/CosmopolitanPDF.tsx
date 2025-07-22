// src/components/pdf-templates/CosmopolitanPDF.tsx

import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
// import type { ResumeData } from '../PDFDownloader';
import type { ResumeData } from '@/types/resume';

Font.register({ family: 'Raleway', fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@fontsource/raleway@4.5.12/files/raleway-latin-400-normal.woff' },
    { src: 'https://cdn.jsdelivr.net/npm/@fontsource/raleway@4.5.12/files/raleway-latin-700-normal.woff', fontWeight: 'bold' },
    { src: 'https://cdn.jsdelivr.net/npm/@fontsource/raleway@4.5.12/files/raleway-latin-900-normal.woff', fontWeight: 'heavy' },
]});

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Raleway', fontSize: 10 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderColor: '#eee', paddingBottom: 15 },
    name: { fontSize: 34, fontWeight: 'heavy', color: '#111' },
    contact: { textAlign: 'right', fontSize: 9, color: '#444' },
    main: { flexDirection: 'row' },
    leftColumn: { width: '33%', paddingRight: 15 },
    rightColumn: { width: '67%', paddingLeft: 15 },
    section: { marginBottom: 18 },
    sectionTitle: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, color: '#333' },
    text: { lineHeight: 1.5 },
    experienceItem: { marginBottom: 12 },
    jobTitle: { fontSize: 12, fontWeight: 'bold' },
    companyName: { fontSize: 10, fontStyle: 'italic', color: '#555', marginBottom: 5 },
    bulletPoint: { flexDirection: 'row', marginBottom: 3 },
    bullet: { width: 10 },
    bulletText: { flex: 1 },
});

export const CosmopolitanPDF = ({ data }: { data: ResumeData }) => (
  <Document author="ResumeCraft AI" title={`${data.name} Resume - Cosmopolitan`}>
    <Page size="A4" style={styles.page}>
        <View style={styles.header}>
            <Text style={styles.name}>{data.name}</Text>
            <View style={styles.contact}>
                <Text>{data.phone}</Text>
                <Link src={`mailto:${data.email}`}>{data.email}</Link>
                <Link src={data.linkedin}>{data.linkedin}</Link>
            </View>
        </View>

        <View style={styles.main}>
            <View style={styles.leftColumn}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Profile</Text>
                    <Text style={styles.text}>{data.professionalSummary}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Skills</Text>
                    {data.technicalSkills.map(skill => <Text key={skill} style={{marginBottom: 3}}>{skill}</Text>)}
                </View>
            </View>
            <View style={styles.rightColumn}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Experience</Text>
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
            </View>
        </View>
    </Page>
  </Document>
);