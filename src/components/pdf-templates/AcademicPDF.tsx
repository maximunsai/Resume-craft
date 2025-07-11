// src/components/pdf-templates/AcademicPDF.tsx

import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
import type { ResumeData } from '../PDFDownloader';

// Using a scholarly font like CMU Serif (a Computer Modern clone)
Font.register({
  family: 'CMU Serif',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/cmu-serif@0.1.0/cmu-serif-roman.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/cmu-serif@0.1.0/cmu-serif-bold.ttf', fontWeight: 'bold' },
  ],
});
Font.register({ family: 'Helvetica', src: 'https://cdn.jsdelivr.net/npm/helveticaneue@2.0.0/dist/Helvetica.ttf' });


const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'CMU Serif', fontSize: 10, lineHeight: 1.4 },
    header: { textAlign: 'center', marginBottom: 24 },
    name: { fontSize: 24, fontWeight: 'bold' },
    contact: { fontSize: 9, fontFamily: 'Helvetica', marginTop: 4 },
    section: { marginBottom: 12 },
    sectionTitle: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, borderBottomWidth: 0.5, borderBottomColor: '#333', paddingBottom: 2, marginBottom: 8 },
    experienceItem: { marginBottom: 10 },
    jobTitle: { fontSize: 11, fontWeight: 'bold' },
    companyName: { fontSize: 10, color: '#444', marginBottom: 4 },
    bulletPoint: { flexDirection: 'row', marginBottom: 3, fontFamily: 'Helvetica' },
    bullet: { width: 12, textAlign: 'center' },
    bulletText: { flex: 1 },
});


export const AcademicPDF = ({ data }: { data: ResumeData }) => (
  <Document author="ResumeCraft AI" title={`${data.name} CV`}>
    <Page size="A4" style={styles.page}>
        <View style={styles.header}>
            <Text style={styles.name}>{data.name}</Text>
            <Link src={`mailto:${data.email}`} style={styles.contact}>
                {`${data.email} │ ${data.phone} │ ${data.linkedin}`}
            </Link>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Abstract</Text>
            <Text>{data.professionalSummary}</Text>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Research & Professional Experience</Text>
            {data.detailedExperience.map(exp => (
                <View key={exp.id} style={styles.experienceItem} wrap={false}>
                    <Text style={styles.jobTitle}>{exp.title}</Text>
                    <Text style={styles.companyName}>{exp.company}</Text>
                    {exp.points.map((point, pIndex) => (
                        <View key={pIndex} style={styles.bulletPoint}>
                            <Text style={styles.bullet}>▪</Text>
                            <Text style={styles.bulletText}>{point}</Text>
                        </View>
                    ))}
                </View>
            ))}
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Proficiencies</Text>
            <Text style={{ fontFamily: 'Helvetica', fontSize: 9 }}>{data.technicalSkills.join(', ')}</Text>
        </View>
    </Page>
  </Document>
);