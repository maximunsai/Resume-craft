// src/components/pdf-templates/AcademicPDF.tsx

import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
import type { ResumeData } from '../PDFDownloader';

// Register fonts for academic styling
Font.register({
  family: 'Times',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/crimsontext/v19/wlp2gwHKFkZgtmSR3NB0oRJvaAJSA_JN3Q.ttf' },
    { src: 'https://fonts.gstatic.com/s/crimsontext/v19/wlp2gwHKFkZgtmSR3NB0oRJX_QJSAx5wdg.ttf', fontWeight: 'bold' },
  ],
});

Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4taVQUwaEQbjB_mQ.ttf' },
    { src: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1x4kaVQUwaEQbjB_mQ.ttf', fontWeight: 'bold' },
  ],
});

const styles = StyleSheet.create({
    page: { 
        padding: 40, 
        fontFamily: 'Times', 
        fontSize: 11, 
        lineHeight: 1.4,
        color: '#333'
    },
    header: { 
        textAlign: 'center', 
        marginBottom: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    name: { 
        fontSize: 24, 
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#000'
    },
    contact: { 
        fontSize: 10, 
        fontFamily: 'Helvetica',
        color: '#555',
        lineHeight: 1.3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    contactText: {
        fontSize: 10,
        color: '#555'
    },
    section: { 
        marginBottom: 20 
    },
    sectionTitle: { 
        fontSize: 12, 
        fontWeight: 'bold', 
        textTransform: 'uppercase', 
        letterSpacing: 1, 
        borderBottomWidth: 0.5, 
        borderBottomColor: '#333', 
        paddingBottom: 3, 
        marginBottom: 12,
        color: '#000'
    },
    abstractText: {
        textAlign: 'justify',
        lineHeight: 1.5,
        marginBottom: 8
    },
    experienceItem: { 
        marginBottom: 16,
        paddingLeft: 4
    },
    jobTitle: { 
        fontSize: 12, 
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 2
    },
    companyName: { 
        fontSize: 11, 
        color: '#444', 
        marginBottom: 6,
        fontStyle: 'italic'
    },
    bulletPoint: { 
        flexDirection: 'row', 
        marginBottom: 4,
        alignItems: 'flex-start'
    },
    bullet: { 
        width: 15, 
        fontSize: 11,
        color: '#333',
        marginTop: 1
    },
    bulletText: { 
        flex: 1,
        lineHeight: 1.4,
        textAlign: 'justify'
    },
    skillsText: {
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.4,
        textAlign: 'justify'
    },
    contactLink: {
        color: '#555',
        textDecoration: 'none'
    }
});

export const AcademicPDF = ({ data }: { data: ResumeData }) => (
  <Document author="ResumeCraft AI" title={`${data.name} CV`}>
    <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
            <Text style={styles.name}>{data.name || 'Your Name'}</Text>
            <View style={styles.contact}>
                {data.email && (
                    <Link src={`mailto:${data.email}`} style={styles.contactLink}>
                        {data.email}
                    </Link>
                )}
                {data.phone && (
                    <Text style={styles.contactText}>
                        {data.email ? ' │ ' : ''}{data.phone}
                    </Text>
                )}
                {data.linkedin && (
                    <>
                        <Text style={styles.contactText}> │ </Text>
                        <Link src={data.linkedin} style={styles.contactLink}>
                            LinkedIn
                        </Link>
                    </>
                )}
            </View>
        </View>

        {/* Abstract Section */}
        {data.professionalSummary && (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Abstract</Text>
                <Text style={styles.abstractText}>{data.professionalSummary}</Text>
            </View>
        )}

        {/* Research & Professional Experience Section */}
        {data.detailedExperience && data.detailedExperience.length > 0 && (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Research & Professional Experience</Text>
                {data.detailedExperience.map((exp, index) => (
                    <View key={exp.id || index} style={styles.experienceItem} wrap={false}>
                        <Text style={styles.jobTitle}>{exp.title || 'Position Title'}</Text>
                        <Text style={styles.companyName}>{exp.company || 'Company Name'}</Text>
                        {exp.points && exp.points.length > 0 && exp.points.map((point, pIndex) => (
                            <View key={pIndex} style={styles.bulletPoint}>
                                <Text style={styles.bullet}>■</Text>
                                <Text style={styles.bulletText}>{point}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        )}

        {/* Technical Proficiencies Section */}
        {data.technicalSkills && data.technicalSkills.length > 0 && (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Technical Proficiencies</Text>
                <Text style={styles.skillsText}>{data.technicalSkills.join(', ')}</Text>
            </View>
        )}
    </Page>
  </Document>
);