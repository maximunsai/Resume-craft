// src/components/pdf-templates/CreativePDF.tsx

import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
import type { ResumeData } from '../PDFDownloader';

// Register Montserrat font with proper weights
Font.register({
  family: 'Montserrat',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/montserrat/v26/JTUSjIg1_i6t8kCHKm459Wlhyw.ttf' },
    { src: 'https://fonts.gstatic.com/s/montserrat/v26/JTUSjIg1_i6t8kCHKm459WRhyw.ttf', fontWeight: 'bold' },
  ]
});

const styles = StyleSheet.create({
    page: { 
        flexDirection: 'row', 
        fontFamily: 'Montserrat', 
        fontSize: 10,
        color: '#333'
    },
    leftColumn: { 
        width: '35%', 
        backgroundColor: '#319795', // Teal color matching the image
        color: 'white', 
        padding: 20,
        paddingTop: 30
    },
    rightColumn: { 
        width: '65%', 
        padding: 20,
        paddingTop: 30
    },
    profileCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 3,
        borderColor: 'white',
        alignSelf: 'center',
        marginBottom: 20,
    },
    name: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        textAlign: 'center',
        marginBottom: 30,
        color: 'white'
    },
    section: { 
        marginBottom: 25 
    },
    sectionTitleLeft: { 
        fontSize: 11, 
        fontWeight: 'bold', 
        textTransform: 'uppercase', 
        borderBottomWidth: 1, 
        borderBottomColor: 'rgba(255, 255, 255, 0.5)', 
        paddingBottom: 5, 
        marginBottom: 12,
        color: 'white'
    },
    sectionTitleRight: { 
        fontSize: 12, 
        fontWeight: 'bold', 
        textTransform: 'uppercase', 
        borderBottomWidth: 2, 
        borderBottomColor: '#319795', 
        paddingBottom: 5, 
        marginBottom: 12,
        color: '#319795'
    },
    contactText: { 
        fontSize: 9, 
        lineHeight: 1.4, 
        marginBottom: 4,
        color: 'white'
    },
    profileText: { 
        lineHeight: 1.5, 
        color: '#4A5568',
        textAlign: 'justify'
    },
    experienceItem: { 
        marginBottom: 18 
    },
    jobTitle: { 
        fontSize: 13, 
        fontWeight: 'bold', 
        color: '#2D3748',
        marginBottom: 2
    },
    companyName: { 
        fontSize: 11, 
        color: '#319795', 
        marginBottom: 8,
        fontStyle: 'italic'
    },
    bulletPoint: { 
        flexDirection: 'row', 
        marginBottom: 4,
        alignItems: 'flex-start'
    },
    bullet: { 
        width: 12,
        fontSize: 10,
        color: '#319795',
        marginTop: 1
    },
    bulletText: { 
        flex: 1, 
        color: '#4A5568',
        lineHeight: 1.4
    },
    skillTag: { 
        backgroundColor: 'rgba(255, 255, 255, 0.2)', 
        color: 'white', 
        borderRadius: 12, 
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 8,
        paddingRight: 8,
        fontSize: 8, 
        marginRight: 6, 
        marginBottom: 6,
        textAlign: 'center'
    },
    skillContainer: { 
        flexDirection: 'row', 
        flexWrap: 'wrap',
        marginTop: 5
    }
});

export const CreativePDF = ({ data }: { data: ResumeData }) => (
  <Document author="ResumeCraft AI" title={`${data.name} Resume - Creative`}>
    <Page size="A4" style={styles.page}>
        {/* Left Column - Teal Sidebar */}
        <View style={styles.leftColumn}>
            {/* Profile Circle Placeholder */}
            <View style={styles.profileCircle} />
            
            <Text style={styles.name}>{data.name}</Text>
            
            <View style={styles.section}>
                <Text style={styles.sectionTitleLeft}>Contact</Text>
                {data.phone && <Text style={styles.contactText}>{data.phone}</Text>}
                {data.email && (
                    <Link src={`mailto:${data.email}`} style={styles.contactText}>
                        {data.email}
                    </Link>
                )}
                {data.linkedin && (
                    <Link src={data.linkedin} style={styles.contactText}>
                        LinkedIn Profile
                    </Link>
                )}
                {data.github && (
                    <Link src={data.github} style={styles.contactText}>
                        GitHub Profile
                    </Link>
                )}
            </View>
            
            <View style={styles.section}>
                <Text style={styles.sectionTitleLeft}>Skills</Text>
                <View style={styles.skillContainer}>
                    {data.technicalSkills && data.technicalSkills.map((skill, index) => (
                        <Text key={index} style={styles.skillTag}>{skill}</Text>
                    ))}
                </View>
            </View>
        </View>

        {/* Right Column - Main Content */}
        <View style={styles.rightColumn}>
            {data.professionalSummary && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitleRight}>Profile</Text>
                    <Text style={styles.profileText}>{data.professionalSummary}</Text>
                </View>
            )}
            
            {data.detailedExperience && data.detailedExperience.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitleRight}>Experience</Text>
                    {data.detailedExperience.map((exp, index) => (
                        <View key={exp.id || index} style={styles.experienceItem} wrap={false}>
                            <Text style={styles.jobTitle}>{exp.title}</Text>
                            <Text style={styles.companyName}>{exp.company}</Text>
                            {exp.points && exp.points.map((point, pIndex) => (
                                <View key={pIndex} style={styles.bulletPoint}>
                                    <Text style={styles.bullet}>•</Text>
                                    <Text style={styles.bulletText}>{point}</Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            )}
        </View>
    </Page>
  </Document>
);