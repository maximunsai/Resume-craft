// src/components/pdf-templates/BoldPDF.tsx - DEFINITIVELY FIXED

import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { ResumeData } from '@/types/resume';

const styles = StyleSheet.create({
    // =================================================================
    // THE FIX: All fontFamily properties now correctly reference 'Helvetica'.
    // =================================================================
    page: { flexDirection: 'row', fontFamily: 'Helvetica', fontSize: 10 },
    leftColumn: { width: '35%', backgroundColor: '#1a202c', color: 'white', padding: 25 },
    rightColumn: { width: '65%', padding: 25 },
    name: { fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: 28, textTransform: 'uppercase', marginBottom: 20 },
    section: { marginBottom: 16 },
    leftSectionTitle: { fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: 11, textTransform: 'uppercase', color: '#a0aec0', marginBottom: 6 },
    leftText: { fontSize: 9, lineHeight: 1.5, color: '#e2e8f0' },
    rightSectionTitle: { fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase', color: '#2d3748', marginBottom: 10 },
    experienceItem: { borderLeftWidth: 2, borderLeftColor: '#1a202c', paddingLeft: 10, marginBottom: 12},
    jobTitle: { fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: 12 },
    companyName: { fontStyle: 'italic', color: '#4a5568', marginBottom: 4 },
    bulletPoint: { flexDirection: 'row', marginBottom: 3 },
    bullet: { width: 10 },
    bulletText: { flex: 1 },
    skillContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    skillTag: { backgroundColor: '#edf2f7', color: '#2d3748', fontSize: 8, padding: '3px 5px', marginRight: 4, marginBottom: 4, borderRadius: 3 },
});

export const BoldPDF = ({ data }: { data: ResumeData }) => (
  <Document author="ResumeCraft AI" title={`${data.name} Resume - Bold`}>
    <Page size="A4" style={styles.page}>
        <View style={styles.leftColumn}>
            <Text style={styles.name}>{data.name}</Text>
            <View style={styles.section}>
                <Text style={styles.leftSectionTitle}>About Me</Text>
                <Text style={styles.leftText}>{data.professionalSummary}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.leftSectionTitle}>Contact</Text>
                <Link src={`mailto:${data.email}`} style={styles.leftText}>{data.email}</Link>
                <Text style={styles.leftText}>{data.phone}</Text>
                <Link src={data.linkedin} style={styles.leftText}>{data.linkedin}</Link>
            </View>
        </View>
        <View style={styles.rightColumn}>
            <View style={styles.section}>
                <Text style={styles.rightSectionTitle}>Experience</Text>
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