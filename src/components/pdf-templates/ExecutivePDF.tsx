// src/components/pdf-templates/ExecutivePDF.tsx - ROBUST VERSION

import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
// import type { ResumeData } from '../PDFDownloader';
import type { ResumeData } from '@/types/resume';

// Using built-in PDF fonts for reliability - no external font loading
const styles = StyleSheet.create({
    page: { 
        flexDirection: 'column', 
        fontFamily: 'Helvetica', // Built-in font
        fontSize: 10,
        color: '#333333'
    },
    header: {
        backgroundColor: '#2d3748',
        color: 'white',
        textAlign: 'center',
        padding: '20 0',
    },
    name: {
        fontSize: 26,
        fontFamily: 'Helvetica-Bold', // Built-in bold font
        textTransform: 'uppercase',
        letterSpacing: 3,
    },
    main: {
        flexDirection: 'row',
        flex: 1,
    },
    leftColumn: {
        width: '33%',
        backgroundColor: '#f7fafc',
        padding: 20,
    },
    rightColumn: {
        width: '67%',
        padding: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: '#718096',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
    },
    contactItem: {
        fontSize: 9,
        marginBottom: 4,
        color: '#333333',
    },
    contactLink: {
        fontSize: 9,
        marginBottom: 4,
        color: '#2b6cb0',
        textDecoration: 'none',
    },
    skillItem: {
        fontSize: 9,
        marginBottom: 4,
        color: '#333333',
    },
    summaryText: {
        lineHeight: 1.4,
        color: '#333333',
        textAlign: 'justify',
    },
    experienceItem: {
        marginBottom: 16,
    },
    jobTitle: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        color: '#1a202c',
        marginBottom: 2,
    },
    companyName: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: '#4a5568',
        marginBottom: 6,
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 4,
        alignItems: 'flex-start',
    },
    bullet: {
        width: 10,
        fontSize: 10,
        color: '#666666',
        marginTop: 1,
    },
    bulletText: {
        flex: 1,
        color: '#333333',
        lineHeight: 1.3,
    },
});

export const ExecutivePDF = ({ data }: { data: ResumeData }) => (
  <Document author="ResumeCraft AI" title={`${data.name} Resume - Executive`}>
    <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
            <Text style={styles.name}>{data.name}</Text>
        </View>

        {/* Main Content */}
        <View style={styles.main}>
            {/* Left Column */}
            <View style={styles.leftColumn}>
                {/* Contact Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact</Text>
                    <Text style={styles.contactItem}>{data.phone}</Text>
                    <Link src={`mailto:${data.email}`} style={styles.contactLink}>
                        {data.email}
                    </Link>
                    <Link src={data.linkedin} style={styles.contactLink}>
                        {data.linkedin}
                    </Link>
                    {data.github && (
                        <Link src={data.github} style={styles.contactLink}>
                            {data.github}
                        </Link>
                    )}
                </View>

                {/* Technical Skills Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Technical Skills</Text>
                    {data.technicalSkills.map((skill, index) => (
                        <Text key={index} style={styles.skillItem}>{skill}</Text>
                    ))}
                </View>
            </View>

            {/* Right Column */}
            <View style={styles.rightColumn}>
                {/* Career Summary Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Career Summary</Text>
                    <Text style={styles.summaryText}>{data.professionalSummary}</Text>
                </View>

                {/* Professional Experience Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Professional Experience</Text>
                    {data.detailedExperience.map((exp, index) => (
                        <View key={exp.id || index} style={styles.experienceItem} wrap={false}>
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
            </View>
        </View>
    </Page>
  </Document>
);