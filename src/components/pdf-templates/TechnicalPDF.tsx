// src/components/pdf-templates/TechnicalPDF.tsx - DEFINITIVELY FIXED

import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { ResumeData } from '@/types/resume';

// All styles now use the guaranteed-to-work 'Helvetica' font.
const styles = StyleSheet.create({
    page: { padding: 30, fontFamily: 'Helvetica', fontSize: 10 },
    // =================================================================
    // THE FIX: The header is now structured with two explicit Views
    // to create the space-between effect without using the invalid property.
    // =================================================================
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        borderBottomWidth: 2, 
        borderBottomColor: '#eee', 
        paddingBottom: 10 
    },
    headerLeft: { flex: 1 }, // This View will take up the available space on the left
    headerRight: { textAlign: 'right', fontSize: 9, flexShrink: 1 }, // This View will shrink to fit its content
    name: { fontSize: 28, fontWeight: 'bold' },
    section: { marginTop: 15 },
    sectionTitle: { fontSize: 10, fontWeight: 'bold', color: '#555', marginBottom: 8 },
    summaryText: { lineHeight: 1.4 },
    skillsContainer: { backgroundColor: '#f5f5f5', padding: 8, borderRadius: 3 },
    skillsText: { fontSize: 9, color: '#333', lineHeight: 1.5 },
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
                    {(exp.points || []).map((point, pIndex) => (
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