// src/components/pdf-templates/OnyxPDF.tsx

import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
import type { ResumeData } from '../PDFDownloader';

Font.register({ 
    family: 'Inter', 
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/inter-font@3.19.0/Inter-Regular.woff' },
        { src: 'https://cdn.jsdelivr.net/npm/inter-font@3.19.0/Inter-Bold.woff', fontWeight: 'bold' },
    ]
});

const styles = StyleSheet.create({
    page: { 
        flexDirection: 'row', 
        fontFamily: 'Inter' 
    },
    leftColumn: { 
        width: '33%', 
        backgroundColor: '#111827', 
        color: 'white', 
        padding: 25 
    },
    rightColumn: { 
        width: '67%', 
        padding: '25px 30px' 
    },
    name: { 
        fontSize: 24, 
        fontWeight: 'bold' 
    },
    professionalTitle: {
        fontSize: 12, 
        color: '#9ca3af', 
        marginBottom: 25
    },
    section: { 
        marginBottom: 20 
    },
    leftSectionTitle: { 
        fontSize: 10, 
        fontWeight: 'bold', 
        color: '#9ca3af', 
        textTransform: 'uppercase', 
        letterSpacing: 1, 
        marginBottom: 8 
    },
    leftText: { 
        fontSize: 9, 
        color: '#d1d5db', 
        lineHeight: 1.5,
        marginBottom: 2
    },
    rightSectionTitle: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#1f2937', 
        marginBottom: 12 
    },
    summaryText: {
        fontSize: 10, 
        lineHeight: 1.4, 
        color: '#374151'
    },
    experienceItem: { 
        marginBottom: 16, 
        paddingLeft: 15, 
        position: 'relative' 
    },
    timelineDot: { 
        position: 'absolute', 
        left: 0, 
        top: 4, 
        width: 6, 
        height: 6, 
        backgroundColor: '#111827', 
        borderRadius: 3 
    },
    jobTitle: { 
        fontSize: 12, 
        fontWeight: 'bold' 
    },
    companyName: { 
        fontStyle: 'italic', 
        color: '#4b5563', 
        marginBottom: 4, 
        fontSize: 10 
    },
    bulletPoint: { 
        flexDirection: 'row', 
        marginBottom: 3 
    },
    bullet: { 
        width: 10 
    },
    bulletText: { 
        fontSize: 9, 
        lineHeight: 1.4, 
        color: '#374151',
        flex: 1
    },
});

export const OnyxPDF = ({ data }: { data: ResumeData }) => (
    <Document author="ResumeCraft AI" title={`${data.name} Resume - Onyx`}>
        <Page size="A4" style={styles.page}>
            <View style={styles.leftColumn}>
                <Text style={styles.name}>{data.name}</Text>
                <Text style={styles.professionalTitle}>Professional</Text>

                <View style={styles.section}>
                    <Text style={styles.leftSectionTitle}>Contact</Text>
                    <Link src={`mailto:${data.email}`} style={styles.leftText}>{data.email}</Link>
                    <Text style={styles.leftText}>{data.phone}</Text>
                    <Link src={data.linkedin} style={styles.leftText}>{data.linkedin}</Link>
                </View>

                <View style={styles.section}>
                    <Text style={styles.leftSectionTitle}>Skills</Text>
                    {data.technicalSkills.map(skill => (
                        <Text key={skill} style={styles.leftText}>{skill}</Text>
                    ))}
                </View>
            </View>

            <View style={styles.rightColumn}>
                <View style={styles.section}>
                    <Text style={styles.rightSectionTitle}>Summary</Text>
                    <Text style={styles.summaryText}>{data.professionalSummary}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.rightSectionTitle}>Experience</Text>
                    {data.detailedExperience.map(exp => (
                        <View key={exp.id} style={styles.experienceItem} wrap={false}>
                            <View style={styles.timelineDot} />
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