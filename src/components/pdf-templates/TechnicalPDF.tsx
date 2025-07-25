// src/components/pdf-templates/TechnicalPDF.tsx

import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
// import type { ResumeData } from '../PDFDownloader';
import type { ResumeData } from '@/types/resume';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-regular-webfont.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
  ]
});

Font.register({
  family: 'Roboto Mono',
  src: 'https://cdn.jsdelivr.net/npm/roboto-mono-font@0.1.0/fonts/Roboto_Mono/robotomono-regular-webfont.ttf'
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
    padding: 30, 
    fontFamily: 'Helvetica', 
    fontSize: 10,
    lineHeight: 1.3
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    borderBottomWidth: 2, 
    borderBottomColor: '#e0e0e0', 
    paddingBottom: 12,
    marginBottom: 8
  },
  headerLeft: { 
    flex: 1 
  },
  headerRight: { 
    textAlign: 'right', 
    fontSize: 9,
    color: '#666',
    lineHeight: 1.4
  },
  name: { 
    fontSize: 28, 
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2
  },
  section: { 
    marginTop: 16,
    marginBottom: 4
  },
  sectionTitle: { 
    fontFamily: 'Roboto Mono', 
    fontSize: 10, 
    fontWeight: 'bold', 
    color: '#27ae60',
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  summaryText: { 
    lineHeight: 1.5,
    color: '#2c3e50',
    textAlign: 'justify'
  },
  skillsContainer: { 
    backgroundColor: '#f8f9fa', 
    padding: 10, 
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#3498db'
  },
  skillsText: { 
    fontFamily: 'Roboto Mono', 
    fontSize: 9, 
    color: '#2c3e50',
    lineHeight: 1.6
  },
  experienceItem: { 
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1'
  },
  jobTitle: { 
    fontSize: 12, 
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2
  },
  companyName: { 
    fontSize: 10, 
    fontWeight: 'bold', 
    color: '#7f8c8d',
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
    color: '#3498db', 
    fontWeight: 'bold',
    fontSize: 10,
    marginRight: 2,
    marginTop: 1
  },
  bulletText: { 
    flex: 1,
    lineHeight: 1.4,
    color: '#2c3e50'
  },
  link: {
    color: '#3498db',
    textDecoration: 'none'
  },
  contactText: {
    fontSize: 9,
    color: '#666',
    marginBottom: 2
  }
});

export const TechnicalPDF = ({ data }: { data: ResumeData }) => (
  <Document author="ResumeCraft AI" title={`${data.name || 'Resume'} - Technical`}>
    <Page size="A4" style={styles.page}>
      <View style={styles.header} fixed>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{data.name || 'Your Name'}</Text>
        </View>
        <View style={styles.headerRight}>
          {data.phone && (
            <Text style={styles.contactText}>{data.phone}</Text>
          )}
          {data.email && (
            <Link src={`mailto:${data.email}`} style={styles.link}>
              <Text style={styles.contactText}>{data.email}</Text>
            </Link>
          )}
          {data.linkedin && (
            <Link src={data.linkedin} style={styles.link}>
              <Text style={styles.contactText}>LinkedIn Profile</Text>
            </Link>
          )}
          {data.github && (
            <Link src={data.github} style={styles.link}>
              <Text style={styles.contactText}>GitHub Profile</Text>
            </Link>
          )}
        </View>
      </View>

      {data.professionalSummary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>// SUMMARY</Text>
          <Text style={styles.summaryText}>{data.professionalSummary}</Text>
        </View>
      )}

      {data.technicalSkills && data.technicalSkills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>// TECHNICAL_SKILLS</Text>
          <View style={styles.skillsContainer}>
            <Text style={styles.skillsText}>
              {data.technicalSkills.join(' | ')}
            </Text>
          </View>
        </View>
      )}

      {data.detailedExperience && data.detailedExperience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>// PROFESSIONAL_EXPERIENCE</Text>
          {data.detailedExperience.map((exp, index) => (
            <View key={exp.id || index} style={styles.experienceItem} wrap={false}>
              <Text style={styles.jobTitle}>{exp.title || 'Position Title'}</Text>
              <Text style={styles.companyName}>{exp.company || 'Company Name'}</Text>
              {exp.points && exp.points.length > 0 && exp.points.map((point, pIndex) => (
                <View key={pIndex} style={styles.bulletPoint}>
                  <Text style={styles.bullet}>{'>'}</Text>
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