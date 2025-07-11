// src/components/pdf-templates/CorporatePDF.tsx

import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
import type { ResumeData } from '../PDFDownloader';

// Using a very standard and readable font like Arial/Helvetica
Font.register({ family: 'Helvetica', fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/helveticaneue@2.0.0/dist/Helvetica.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/helveticaneue@2.0.0/dist/Helvetica-Bold.ttf', fontWeight: 'bold' },
]});

const styles = StyleSheet.create({
    page: { padding: 35, fontFamily: 'Helvetica', fontSize: 10, color: '#1a202c' },
    header: { paddingBottom: 8, borderBottomWidth: 3, borderBottomColor: '#2d3748' },
    name: { fontSize: 26, fontWeight: 'bold' },
    contact: { fontSize: 9, marginTop: 4 },
    section: { marginBottom: 10 },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#4a5568'},
    hr: { borderBottomWidth: 1.5, borderBottomColor: '#cbd5e0', marginTop: 1, marginBottom: 6},
    sectionContent: { fontSize: 10, lineHeight: 1.4 },
    experienceItem: { marginTop: 8 },
    expHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    jobTitle: { fontSize: 10, fontWeight: 'bold' },
    companyName: { fontSize: 10, fontStyle: 'italic', marginBottom: 4},
    bulletPoint: { flexDirection: 'row', marginBottom: 3, marginLeft: 10},
    bullet: { width: 10, fontSize: 10 },
    bulletText: { flex: 1 },
});

export const CorporatePDF = ({ data }: { data: ResumeData }) => (
  <Document author="ResumeCraft AI" title={`${data.name} Resume - Corporate`}>
    <Page size="A4" style={styles.page}>
        <View style={styles.header}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.contact}>
                {data.phone} | <Link src={`mailto:${data.email}`}>{data.email}</Link> | <Link src={data.linkedin}>{data.linkedin}</Link>
            </Text>
        </View>

        <View style={styles.section} >
            <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
            <View style={styles.hr} />
            <Text style={styles.sectionContent}>{data.professionalSummary}</Text>
        </View>
        
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>CORE SKILLS</Text>
            <View style={styles.hr} />
            <Text style={{ fontSize: 9 }}>{data.technicalSkills.join(' • ')}</Text>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
            <View style={styles.hr} />
            {data.detailedExperience.map(exp => (
                <View key={exp.id} style={styles.experienceItem} wrap={false}>
                    <View style={styles.expHeader}>
                        <Text style={styles.jobTitle}>{exp.title}</Text>
                        {/* Dates would go on the right */}
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
