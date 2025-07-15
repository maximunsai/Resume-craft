// src/components/pdf-templates/ClassicPDF.tsx - FIXED VERSION

import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
import type { ResumeData } from '../PDFDownloader';



const styles = StyleSheet.create({
    page: { 
        padding: 40, 
        fontFamily: 'Times-Roman', // Built-in font - always works
        fontSize: 11, 
        lineHeight: 1.4, // Slightly increased for better readability
        color: '#333333'
    },
    header: { 
        textAlign: 'center', 
        marginBottom: 20, 
        borderBottomWidth: 1, 
        borderBottomColor: '#333333', 
        paddingBottom: 10 
    },
    name: { 
        fontSize: 24, // Slightly smaller to prevent overflow
        fontWeight: 'bold',
        fontFamily: 'Times-Bold',
        marginBottom: 5
    },
    contact: { 
        fontSize: 10, 
        fontFamily: 'Helvetica', // Built-in font
        color: '#666666',
        lineHeight: 1.2
    },
    section: { 
        marginBottom: 15 // Increased spacing
    },
    sectionTitle: { 
        fontSize: 14, 
        fontWeight: 'bold',
        fontFamily: 'Times-Bold',
        marginBottom: 8,
        color: '#333333',
        borderBottomWidth: 0.5,
        borderBottomColor: '#cccccc',
        paddingBottom: 3
    },
    jobTitle: { 
        fontSize: 12, 
        fontWeight: 'bold',
        fontFamily: 'Times-Bold',
        marginBottom: 2
    },
    companyName: { 
        fontSize: 11, 
        fontStyle: 'italic',
        fontFamily: 'Times-Italic',
        marginBottom: 6,
        color: '#666666'
    },
    bulletPoint: { 
        flexDirection: 'row', 
        marginBottom: 4, 
        fontFamily: 'Helvetica', 
        fontSize: 10,
        alignItems: 'flex-start' // Better alignment
    },
    bullet: { 
        width: 12, // Slightly wider for better spacing
        marginRight: 3,
        textAlign: 'center'
    },
    bulletText: { 
        flex: 1,
        lineHeight: 1.3
    },
    skillsContainer: {
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.4
    },
    summaryText: {
        fontFamily: 'Times-Roman',
        fontSize: 11,
        lineHeight: 1.4,
        textAlign: 'justify'
    }
});

// =================================================================
// CRITICAL FIX 2: Improved error handling and safer rendering
// =================================================================
export const ClassicPDF = ({ data }: { data: ResumeData }) => {
    // Validate data to prevent runtime errors
    if (!data || !data.name) {
        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <Text>Error: Invalid resume data</Text>
                </Page>
            </Document>
        );
    }

    return (
        <Document 
            author="ResumeCraft AI" 
            title={`${data.name} Resume - Classic`}
            subject="Professional Resume"
            creator="ResumeCraft AI"
        >
            <Page size="A4" style={styles.page}>
                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={styles.name}>{data.name || 'Name Not Provided'}</Text>
                    <View style={styles.contact}>
                        <Text>
                            {data.email && (
                                <>
                                    <Link src={`mailto:${data.email}`}>{data.email}</Link>
                                    {(data.phone || data.linkedin || data.github) && ' | '}
                                </>
                            )}
                            {data.phone && (
                                <>
                                    {data.phone}
                                    {(data.linkedin || data.github) && ' | '}
                                </>
                            )}
                            {data.linkedin && (
                                <>
                                    <Link src={data.linkedin}>{data.linkedin}</Link>
                                    {data.github && ' | '}
                                </>
                            )}
                            {data.github && (
                                <Link src={data.github}>{data.github}</Link>
                            )}
                        </Text>
                    </View>
                </View>

                {/* Professional Summary */}
                {data.professionalSummary && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Summary</Text>
                        <Text style={styles.summaryText}>{data.professionalSummary}</Text>
                    </View>
                )}

                {/* Core Competencies */}
                {data.technicalSkills && data.technicalSkills.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Core Competencies</Text>
                        <Text style={styles.skillsContainer}>
                            {data.technicalSkills.join(' / ')}
                        </Text>
                    </View>
                )}
                
                {/* Professional Experience */}
                {data.detailedExperience && data.detailedExperience.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Professional Experience</Text>
                        {data.detailedExperience.map((exp, index) => (
                            <View 
                                key={exp.id || index} 
                                wrap={false} 
                                style={{ marginBottom: 12 }}
                            >
                                <Text style={styles.jobTitle}>
                                    {exp.title || 'Position Title'}
                                </Text>
                                <Text style={styles.companyName}>
                                    {exp.company || 'Company Name'}
                                </Text>
                                {exp.points && exp.points.length > 0 && exp.points.map((point, pIndex) => (
                                    <View key={pIndex} style={styles.bulletPoint}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.bulletText}>{point}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                )}
            </Page>
        </Document>
    );
};