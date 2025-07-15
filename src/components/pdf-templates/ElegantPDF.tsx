// src/components/pdf-templates/ElegantPDF.tsx

import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
import type { ResumeData } from '../PDFDownloader';

// Register elegant fonts
Font.register({
  family: 'Playfair Display',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgEM86xKJ.woff2' },
    { src: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFkD-vYSZviVYUb_rj3ij__anPXDTzYgEM86xKJ.woff2', fontWeight: 'bold' },
    { src: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgEM86xKJ.woff2', fontStyle: 'italic' },
  ]
});

Font.register({
  family: 'Lato',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjx4wXiWtFCc.woff2' },
    { src: 'https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVSwiPGQ3q5d0.woff2', fontWeight: 'bold' },
    { src: 'https://fonts.gstatic.com/s/lato/v24/S6u8w4BMUTPHjxsAXC-qNiXg7Q.woff2', fontStyle: 'italic' },
  ]
});

const styles = StyleSheet.create({
  page: { 
    padding: '50px 60px', 
    fontFamily: 'Playfair Display', 
    fontSize: 10, 
    color: '#333',
    lineHeight: 1.4
  },
  header: { 
    textAlign: 'center', 
    marginBottom: 30,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    paddingBottom: 20
  },
  name: { 
    fontSize: 32, 
    letterSpacing: 4, 
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8
  },
  contact: { 
    fontFamily: 'Lato', 
    fontSize: 9, 
    color: '#666', 
    marginTop: 8,
    lineHeight: 1.3
  },
  contactLink: {
    color: '#3498db',
    textDecoration: 'none'
  },
  summary: { 
    textAlign: 'center', 
    margin: '25px 40px 25px 40px', 
    fontStyle: 'italic', 
    fontSize: 11, 
    lineHeight: 1.5,
    color: '#4a5568'
  },
  separator: { 
    textAlign: 'center', 
    marginBottom: 25, 
    fontSize: 14, 
    color: '#bbb',
    letterSpacing: 3
  },
  section: { 
    marginBottom: 25 
  },
  sectionTitle: { 
    textAlign: 'center', 
    fontSize: 12, 
    fontWeight: 'bold', 
    letterSpacing: 2, 
    textTransform: 'uppercase', 
    marginBottom: 20,
    color: '#2c3e50',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 8
  },
  experienceItem: { 
    marginBottom: 18,
    textAlign: 'center',
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f7fafc'
  },
  jobTitle: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#2c3e50',
    marginBottom: 4
  },
  companyName: { 
    fontFamily: 'Lato', 
    fontStyle: 'italic', 
    fontSize: 10, 
    marginBottom: 8,
    color: '#718096'
  },
  bulletPoint: { 
    fontFamily: 'Lato', 
    flexDirection: 'row', 
    marginBottom: 4,
    textAlign: 'left',
    alignItems: 'flex-start'
  },
  bullet: { 
    width: 15,
    color: '#3498db',
    fontSize: 11,
    marginRight: 5
  },
  bulletText: { 
    flex: 1,
    lineHeight: 1.4,
    color: '#4a5568'
  },
  skillsSection: {
    marginTop: 30,
    textAlign: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#e2e8f0',
    paddingTop: 20
  },
  skillsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
    color: '#2c3e50'
  },
  skillsText: { 
    fontFamily: 'Lato', 
    fontSize: 9, 
    color: '#718096',
    lineHeight: 1.5
  }
});

export const ElegantPDF = ({ data }: { data: ResumeData }) => (
  <Document author="ResumeCraft AI" title={`${data.name} Resume - Elegant`}>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{data.name}</Text>
        <Text style={styles.contact}>
          {data.phone}  ·  
          <Link src={`mailto:${data.email}`}>
            <Text style={styles.contactLink}>{data.email}</Text>
          </Link>  ·  
          <Link src={data.linkedin}>
            <Text style={styles.contactLink}>{data.linkedin}</Text>
          </Link>
        </Text>
      </View>

      <Text style={styles.summary}>{data.professionalSummary}</Text>
      <Text style={styles.separator}>• • •</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience</Text>
        {data.detailedExperience.map((exp, index) => (
          <View key={exp.id || index} style={styles.experienceItem} wrap={false}>
            <Text style={styles.jobTitle}>{exp.title}</Text>
            <Text style={styles.companyName}>{exp.company}</Text>
            {exp.points.map((point, pIndex) => (
              <View key={pIndex} style={styles.bulletPoint}>
                <Text style={styles.bullet}>›</Text>
                <Text style={styles.bulletText}>{point}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.skillsSection}>
        <Text style={styles.skillsTitle}>Skills</Text>
        <Text style={styles.skillsText}>{data.technicalSkills.join(' | ')}</Text>
      </View>
    </Page>
  </Document>
);