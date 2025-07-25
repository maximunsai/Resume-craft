// src/components/pdf-templates/BoldPDF.tsx

import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
// import type { ResumeData } from '../PDFDownloader';
import type { ResumeData } from '@/types/resume';

Font.register({
  family: 'Oswald',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/oswald-font@0.1.0/fonts/oswald-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/oswald-font@0.1.0/fonts/oswald-bold.ttf', fontWeight: 'bold' },
  ]
});

Font.register({
  family: 'Lato',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/lato-font@3.0.0/fonts/lato-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/lato-font@3.0.0/fonts/lato-bold.ttf', fontWeight: 'bold' },
  ]
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
    flexDirection: 'row', 
    fontFamily: 'Helvetica', 
    fontSize: 10,
    margin: 0,
    padding: 0
  },
  leftColumn: { 
    width: '35%', 
    backgroundColor: '#2d3748', 
    color: 'white', 
    padding: 25,
    minHeight: '100vh'
  },
  rightColumn: { 
    width: '65%', 
    padding: 25,
    backgroundColor: '#ffffff'
  },
  name: { 
    fontFamily: 'Oswald', 
    fontSize: 28, 
    fontWeight: 'bold',
    textTransform: 'uppercase', 
    marginBottom: 25,
    lineHeight: 1.1,
    color: '#ffffff'
  },
  section: { 
    marginBottom: 20 
  },
  leftSectionTitle: { 
    fontFamily: 'Oswald', 
    fontSize: 12, 
    fontWeight: 'bold',
    textTransform: 'uppercase', 
    color: '#a0aec0', 
    marginBottom: 8,
    letterSpacing: 1
  },
  leftText: { 
    fontSize: 9, 
    lineHeight: 1.5, 
    color: '#e2e8f0',
    marginBottom: 4
  },
  leftLink: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#81c784',
    textDecoration: 'none',
    marginBottom: 4
  },
  rightSectionTitle: { 
    fontFamily: 'Oswald', 
    fontSize: 16, 
    fontWeight: 'bold',
    textTransform: 'uppercase', 
    color: '#2d3748', 
    marginBottom: 12,
    letterSpacing: 1
  },
  experienceItem: { 
    borderLeftWidth: 3, 
    borderLeftColor: '#2d3748', 
    paddingLeft: 15, 
    marginBottom: 16,
    paddingBottom: 8
  },
  jobTitle: { 
    fontFamily: 'Oswald', 
    fontSize: 13, 
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 2
  },
  companyName: { 
    fontStyle: 'italic', 
    color: '#718096', 
    marginBottom: 6,
    fontSize: 10
  },
  bulletPoint: { 
    flexDirection: 'row', 
    marginBottom: 4,
    alignItems: 'flex-start'
  },
  bullet: { 
    width: 12, 
    color: '#2d3748',
    fontWeight: 'bold',
    marginRight: 4
  },
  bulletText: { 
    flex: 1,
    lineHeight: 1.4,
    color: '#4a5568'
  },
  skillContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    marginTop: 4
  },
  skillTag: { 
    backgroundColor: '#edf2f7', 
    color: '#2d3748', 
    fontSize: 8, 
    fontWeight: 'bold',
    padding: '4px 8px', 
    marginRight: 6, 
    marginBottom: 6, 
    borderRadius: 4,
    textTransform: 'uppercase'
  },
  contactItem: {
    marginBottom: 6
  }
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
          <View style={styles.contactItem}>
            <Text style={styles.leftText}>{data.phone}</Text>
          </View>
          <View style={styles.contactItem}>
            <Link src={`mailto:${data.email}`}>
              <Text style={styles.leftLink}>{data.email}</Text>
            </Link>
          </View>
          <View style={styles.contactItem}>
            <Link src={data.linkedin}>
              <Text style={styles.leftLink}>{data.linkedin}</Text>
            </Link>
          </View>
          {data.github && (
            <View style={styles.contactItem}>
              <Link src={data.github}>
                <Text style={styles.leftLink}>{data.github}</Text>
              </Link>
            </View>
          )}
        </View>
      </View>

      <View style={styles.rightColumn}>
        <View style={styles.section}>
          <Text style={styles.rightSectionTitle}>Experience</Text>
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
        
        <View style={styles.section}>
          <Text style={styles.rightSectionTitle}>Skills</Text>
          <View style={styles.skillContainer}>
            {data.technicalSkills.map((skill, index) => (
              <Text key={index} style={styles.skillTag}>{skill}</Text>
            ))}
          </View>
        </View>
      </View>
    </Page>
  </Document>
);