// src/components/pdf-templates/CreativePDF.tsx - CLEANED AND CORRECTED

import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
// We correctly import the ResumeData type from its single source of truth.
import type { ResumeData } from '@/types/resume';


// The styles object is now safe to use, as it can trust that 'Montserrat' has already been loaded.
const styles = StyleSheet.create({
    page: { 
        flexDirection: 'row', 
        fontFamily: 'Montserrat', 
        fontSize: 10,
        color: '#333'
    },
    leftColumn: { 
        width: '35%', 
        backgroundColor: '#319795',
        color: 'white', 
        padding: 20,
        paddingTop: 30
    },
    rightColumn: { 
        width: '65%', 
        padding: '30px 20px 20px 20px',
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
    },
    bulletPoint: { 
        flexDirection: 'row', 
        marginBottom: 4,
        paddingRight: 10,
    },
    bullet: { 
        width: 10,
        fontSize: 10,
        color: '#319795',
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
        padding: '4px 8px',
        fontSize: 8, 
        marginRight: 6, 
        marginBottom: 6,
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
                    {data.technicalSkills.map((skill) => (
                        <Text key={skill} style={styles.skillTag}>{skill}</Text>
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
            
            {data.detailedExperience?.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitleRight}>Experience</Text>
                    {data.detailedExperience.map((exp) => (
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
            )}
        </View>
    </Page>
  </Document>
);