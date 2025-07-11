// src/components/pdf-templates/CreativePDF.tsx

import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import type { ResumeData } from '../PDFDownloader';

Font.register({
  family: 'Montserrat',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/montserrat@0.0.1/fonts/montserrat/Montserrat-Regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/montserrat@0.0.1/fonts/montserrat/Montserrat-Bold.ttf', fontWeight: 'bold' },
  ]
});

const styles = StyleSheet.create({
    page: { flexDirection: 'row', fontFamily: 'Montserrat', fontSize: 10 },
    leftColumn: { width: '33%', backgroundColor: '#319795', color: 'white', padding: 20 },
    rightColumn: { width: '67%', padding: 20 },
    name: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#4fd1c5', paddingBottom: 3, marginBottom: 8 },
    text: { lineHeight: 1.5, color: '#4A5568' },
    experienceItem: { marginBottom: 15 },
    jobTitle: { fontSize: 14, fontWeight: 'bold', color: '#2D3748' },
    companyName: { fontSize: 11, color: '#718096', marginBottom: 5 },
    bulletPoint: { flexDirection: 'row', marginBottom: 3 },
    bullet: { width: 10 },
    bulletText: { flex: 1, color: '#4A5568'},
    contactText: { fontSize: 9, lineHeight: 1.4 },
    skillTag: { backgroundColor: '#4fd1c5', color: '#1a202c', borderRadius: 8, padding: '3px 6px', fontSize: 8, marginRight: 4, marginBottom: 4},
    skillContainer: { flexDirection: 'row', flexWrap: 'wrap' }
});

export const CreativePDF = ({ data }: { data: ResumeData }) => (
  <Document author="ResumeCraft AI" title={`${data.name} Resume - Creative`}>
    <Page size="A4" style={styles.page}>
        <View style={styles.leftColumn}>
            <Text style={styles.name}>{data.name}</Text>
            {/* Image placeholder is omitted in PDF for simplicity, can be added with <Image> tag */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact</Text>
                <Text style={styles.contactText}>{data.phone}</Text>
                <Text style={styles.contactText}>{data.email}</Text>
                <Text style={styles.contactText}>{data.linkedin}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <View style={styles.skillContainer}>
                    {data.technicalSkills.map(skill => (
                        <Text key={skill} style={styles.skillTag}>{skill}</Text>
                    ))}
                </View>
            </View>
        </View>
        <View style={styles.rightColumn}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Profile</Text>
                <Text style={styles.text}>{data.professionalSummary}</Text>
            </View>
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
    </Page>
  </Document>
);