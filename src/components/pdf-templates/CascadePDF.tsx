// src/components/pdf-templates/CascadePDF.tsx

import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
// import type { ResumeData } from '../PDFDownloader';
import type { ResumeData } from '@/types/resume';

// Use system fonts for better reliability
// Font.register({ 
//   family: 'Garamond', 
//   fonts: [
//     { src: 'https://cdn.jsdelivr.net/npm/eb-garamond@1.0.1/fonts/EBGaramond-Regular.ttf' },
//     { src: 'https://cdn.jsdelivr.net/npm/eb-garamond@1.0.1/fonts/EBGaramond-Bold.ttf', fontWeight: 'bold' },
//   ]
// });

const styles = StyleSheet.create({
  page: { 
    padding: 50, 
    fontFamily: 'Times-Roman', // Use built-in font
    fontSize: 11,
    lineHeight: 1.4,
    backgroundColor: '#ffffff'
  },
  header: { 
    textAlign: 'center', 
    paddingBottom: 20,
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#2d3748'
  },
  name: { 
    fontSize: 28, 
    fontFamily: 'Times-Bold', // Use built-in bold font
    color: '#1a202c',
    marginBottom: 8,
    letterSpacing: 1
  },
  contact: { 
    fontSize: 11, 
    color: '#4a5568',
    lineHeight: 1.5
  },
  contactLink: {
    color: '#2b6cb0',
    textDecoration: 'none'
  },
  section: { 
    marginTop: 20,
    marginBottom: 15
  },
  sectionTitle: { 
    fontSize: 14, 
    fontFamily: 'Times-Bold', // Use built-in bold font
    textTransform: 'uppercase', 
    marginBottom: 12,
    letterSpacing: 1.2,
    color: '#2d3748',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 4
  },
  summaryText: {
    lineHeight: 1.5,
    color: '#4a5568',
    textAlign: 'justify'
  },
  experienceItem: { 
    marginBottom: 16,
    paddingLeft: 0
  },
  expHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6
  },
  jobTitle: { 
    fontSize: 13, 
    fontFamily: 'Times-Bold', // Use built-in bold font
    color: '#2d3748',
    flex: 1
  },
  companyName: { 
    fontSize: 12, 
    color: '#718096',
    fontStyle: 'italic',
    textAlign: 'right'
  },
  bulletPoint: { 
    flexDirection: 'row', 
    marginTop: 4, 
    marginLeft: 12,
    alignItems: 'flex-start'
  },
  bullet: { 
    width: 12,
    color: '#4a5568',
    fontSize: 10,
    marginTop: 1
  },
  bulletText: { 
    flex: 1,
    color: '#4a5568',
    lineHeight: 1.4
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  skillsText: {
    color: '#4a5568',
    lineHeight: 1.6
  },
  divider: {
    color: '#a0aec0',
    marginHorizontal: 4
  }
});

export const CascadePDF = ({ data }: { data: ResumeData }) => (
  <Document author="ResumeCraft AI" title={`${data.name} Resume - Cascade`}>
    <Page size="A4" style={styles.page}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.name}</Text>
        <Text style={styles.contact}>
          <Link src={`mailto:${data.email}`} style={styles.contactLink}>
            {data.email}
          </Link>
          <Text style={styles.divider}> | </Text>
          {data.phone}
          <Text style={styles.divider}> | </Text>
          <Link src={data.linkedin} style={styles.contactLink}>
            {data.linkedin}
          </Link>
        </Text>
      </View>

      {/* Professional Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.summaryText}>{data.professionalSummary}</Text>
      </View>
      
      {/* Experience Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience</Text>
        {data.detailedExperience.map((exp, index) => (
          <View key={exp.id} style={styles.experienceItem} wrap={false}>
            <View style={styles.expHeader}>
              <Text style={styles.jobTitle}>{exp.title}</Text>
              <Text style={styles.companyName}>{exp.company}</Text>
            </View>
            {(exp.points || []).map((point, pIndex) => (
              <View key={pIndex} style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{point}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Skills Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <Text style={styles.skillsText}>
          {data.technicalSkills.join(' • ')}
        </Text>
      </View>
    </Page>
  </Document>
);