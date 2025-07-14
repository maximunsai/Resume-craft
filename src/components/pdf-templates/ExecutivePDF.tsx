// src/components/pdf-templates/ExecutivePDF.tsx - CORRECTED VERSION

import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
import type { ResumeData } from '../PDFDownloader';

// =================================================================
// THE FIX IS HERE: We are explicitly registering the 'Lato' font family
// with all the weights that our styles might use (regular, bold, and heavy for the name).
// =================================================================
Font.register({ 
  family: 'Lato', 
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/lato-font@3.0.0/fonts/lato-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/lato-font@3.0.0/fonts/lato-bold.ttf', fontWeight: 'bold' },
    { src: 'https://cdn.jsdelivr.net/npm/lato-font@3.0.0/fonts/lato-black.ttf', fontWeight: 'heavy' },
  ]
});
// =================================================================

// The styles object is correct as it uses the 'Lato' font we just registered.
const styles = StyleSheet.create({
    page: { 
        flexDirection: 'column', 
        fontFamily: 'Lato', 
        fontSize: 10,
        color: '#333'
    },
    header: {
        backgroundColor: '#2d3748', // Corresponds to Tailwind's gray-800
        color: 'white',
        textAlign: 'center',
        padding: '20px 0',
    },
    name: {
        fontSize: 28,
        fontWeight: 'heavy', // Using the 'black' weight we registered
        textTransform: 'uppercase',
        letterSpacing: 4,
    },
    main: {
        flexDirection: 'row',
        flex: 1,
    },
    leftColumn: {
        width: '33%',
        backgroundColor: '#f7fafc', // Corresponds to Tailwind's gray-100
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
        fontWeight: 'bold',
        color: '#718096', // Corresponds to Tailwind's gray-500
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
    },
    contactItem: {
        fontSize: 9,
        marginBottom: 4,
    },
    skillItem: {
        fontSize: 9,
        marginBottom: 4,
    },
    summaryText: {
        lineHeight: 1.4,
    },
    experienceItem: {
        marginBottom: 16,
    },
    jobTitle: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    companyName: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#4a5568', // Corresponds to Tailwind's gray-700
        marginBottom: 6,
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    bullet: {
        width: 10,
        fontSize: 10,
    },
    bulletText: {
        flex: 1,
    },
});

// The main component is correct. I've added <Link> tags.
export const ExecutivePDF = ({ data }: { data: ResumeData }) => (
  <Document author="ResumeCraft AI" title={`${data.name} Resume - Executive`}>
    <Page size="A4" style={styles.page}>
        <View style={styles.header}>
            <Text style={styles.name}>{data.name}</Text>
        </View>

        <View style={styles.main}>
            {/* Left Column */}
            <View style={styles.leftColumn}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact</Text>
                    <Text style={styles.contactItem}>{data.phone}</Text>
                    <Link src={`mailto:${data.email}`} style={styles.contactItem}>{data.email}</Link>
                    <Link src={data.linkedin} style={styles.contactItem}>{data.linkedin}</Link>
                    <Link src={data.github} style={styles.contactItem}>{data.github}</Link>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Technical Skills</Text>
                    {data.technicalSkills.map(skill => (
                        <Text key={skill} style={styles.skillItem}>{skill}</Text>
                    ))}
                </View>
            </View>

            {/* Right Column */}
            <View style={styles.rightColumn}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Career Summary</Text>
                    <Text style={styles.summaryText}>{data.professionalSummary}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Professional Experience</Text>
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