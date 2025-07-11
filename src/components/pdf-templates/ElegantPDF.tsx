// src/components/pdf-templates/ElegantPDF.tsx

import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
import type { ResumeData } from '../PDFDownloader';

// A sophisticated serif font like Playfair Display
Font.register({ family: 'Playfair Display', fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@fontsource/playfair-display@4.5.13/files/playfair-display-latin-400-normal.woff' },
    { src: 'https://cdn.jsdelivr.net/npm/@fontsource/playfair-display@4.5.13/files/playfair-display-latin-700-normal.woff', fontWeight: 'bold'},
    { src: 'https://cdn.jsdelivr.net/npm/@fontsource/playfair-display@4.5.13/files/playfair-display-latin-400-italic.woff', fontStyle: 'italic' },
]});
Font.register({ family: 'Lato', src: 'https://cdn.jsdelivr.net/npm/lato-font@3.0.0/fonts/lato-regular.ttf' });

const styles = StyleSheet.create({
    page: { padding: '50px 60px', fontFamily: 'Playfair Display', fontSize: 10, color: '#333' },
    header: { textAlign: 'center', marginBottom: 30 },
    name: { fontSize: 32, letterSpacing: 4, textTransform: 'uppercase'},
    contact: { fontFamily: 'Lato', fontSize: 9, color: '#666', marginTop: 6 },
    summary: { textAlign: 'center', margin: '0 40px 20px 40px', fontStyle: 'italic', fontSize: 11, lineHeight: 1.4 },
    separator: { textAlign: 'center', marginBottom: 20, fontSize: 12, color: '#aaa'},
    section: { marginBottom: 15 },
    sectionTitle: { textAlign: 'center', fontSize: 12, fontWeight: 'bold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 15 },
    experienceItem: { marginBottom: 12 },
    jobTitle: { fontSize: 14, fontWeight: 'bold', color: '#111' },
    companyName: { fontFamily: 'Lato', fontStyle: 'italic', fontSize: 10, marginBottom: 5 },
    bulletPoint: { fontFamily: 'Lato', flexDirection: 'row', marginBottom: 3 },
    bullet: { width: 12 },
    bulletText: { flex: 1 },
    footer: { position: 'absolute', bottom: 30, left: 60, right: 60, textAlign: 'center', borderTopWidth: 0.5, borderTopColor: '#ccc', paddingTop: 8 },
    footerText: { fontFamily: 'Lato', fontSize: 8, color: '#888' },
});

export const ElegantPDF = ({ data }: { data: ResumeData }) => (
  <Document author="ResumeCraft AI" title={`${data.name} Resume - Elegant`}>
    <Page size="A4" style={styles.page}>
        <View style={styles.header}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.contact}>
                {data.phone}  ·  <Link src={`mailto:${data.email}`}>{data.email}</Link>  ·  <Link src={data.linkedin}>{data.linkedin}</Link>
            </Text>
        </View>

        <Text style={styles.summary}>{data.professionalSummary}</Text>
        <Text style={styles.separator}>* * *</Text>
        
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.detailedExperience.map(exp => (
                <View key={exp.id} style={styles.experienceItem} wrap={false}>
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

        <View style={styles.footer} fixed>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.footerText}>{data.technicalSkills.join(' | ')}</Text>
        </View>
    </Page>
  </Document>
);