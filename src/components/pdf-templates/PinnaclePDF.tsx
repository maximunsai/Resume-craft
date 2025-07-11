// src/components/pdf-templates/PinnaclePDF.tsx

import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
import type { ResumeData } from '../PDFDownloader';

Font.register({ 
    family: 'Montserrat', 
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/montserrat@0.0.1/fonts/montserrat/Montserrat-Regular.ttf' },
        { src: 'https://cdn.jsdelivr.net/npm/montserrat@0.0.1/fonts/montserrat/Montserrat-Bold.ttf', fontWeight: 'bold' },
        { src: 'https://cdn.jsdelivr.net/npm/montserrat@0.0.1/fonts/montserrat/Montserrat-SemiBold.ttf', fontWeight: 'semibold'},
    ]
});

const styles = StyleSheet.create({
    page: { 
        fontFamily: 'Montserrat', 
        fontSize: 10, 
        color: '#334155' 
    },
    header: { 
        padding: '25px 35px', 
        backgroundColor: '#f1f5f9', 
        borderBottomWidth: 3, 
        borderBottomColor: '#0891b2' 
    },
    name: { 
        fontSize: 32, 
        fontWeight: 'bold' 
    },
    contact: { 
        flexDirection: 'row', 
        gap: 12, 
        marginTop: 8, 
        fontSize: 9, 
        color: '#475569' 
    },
    skillsSection: { 
        padding: '15px 35px', 
        backgroundColor: '#f8fafc' 
    },
    skillsTitle: { 
        textAlign: 'center', 
        fontSize: 10, 
        fontWeight: 'bold', 
        textTransform: 'uppercase', 
        color: '#666', 
        marginBottom: 5 
    },
    skillsText: { 
        textAlign: 'center', 
        fontSize: 9 
    },
    summarySection: { 
        textAlign: 'center', 
        margin: '10px 35px' 
    },
    experienceSection: { 
        marginTop: 10, 
        padding: '0 35px' 
    },
    experienceTitle: { 
        textAlign: 'center', 
        fontSize: 10, 
        fontWeight: 'bold', 
        textTransform: 'uppercase', 
        color: '#666', 
        marginBottom: 10 
    },
    experienceItem: { 
        marginBottom: 12 
    },
    expHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    jobTitle: { 
        fontSize: 12, 
        fontWeight: 'bold' 
    },
    companyName: { 
        fontSize: 11, 
        color: '#555' 
    },
    bulletPoint: { 
        flexDirection: 'row', 
        marginTop: 4, 
        marginLeft: 10 
    },
    bullet: { 
        width: 10 
    },
    bulletText: { 
        flex: 1 
    },
});

export const PinnaclePDF = ({ data }: { data: ResumeData }) => (
    <Document author="ResumeCraft AI" title={`${data.name} Resume - Pinnacle`}>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.name}>{data.name}</Text>
                <Text style={styles.contact}>
                    {data.phone} │ <Link src={`mailto:${data.email}`}>{data.email}</Link> │ <Link src={data.linkedin}>{data.linkedin}</Link>
                </Text>
            </View>

            <View style={styles.skillsSection}>
                <Text style={styles.skillsTitle}>Core Competencies</Text>
                <Text style={styles.skillsText}>{data.technicalSkills.join(' • ')}</Text>
            </View>

            <View style={styles.summarySection}>
                <Text>{data.professionalSummary}</Text>
            </View>

            <View style={styles.experienceSection}>
                <Text style={styles.experienceTitle}>Professional Experience</Text>
                {data.detailedExperience.map(exp => (
                    <View key={exp.id} style={styles.experienceItem} wrap={false}>
                        <View style={styles.expHeader}>
                            <Text style={styles.jobTitle}>{exp.title}</Text>
                            <Text style={styles.companyName}>{exp.company}</Text>
                        </View>
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