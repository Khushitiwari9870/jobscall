// src/components/resume/PDFViewer.tsx
'use client';

import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { ResumeData } from '@/types/resume';

// Register font if needed
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    fontSize: 10,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: 5,
    marginBottom: 10,
  },
  item: {
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 10,
    color: '#666',
  },
  itemDate: {
    fontSize: 10,
    color: '#666',
  },
  itemDescription: {
    fontSize: 10,
    lineHeight: 1.4,
  },
});

interface PDFViewerProps {
  resumeData: ResumeData;
}

export default function PDFViewer({ resumeData }: PDFViewerProps) {
  const { personalInfo, experiences, educations, skills, projects, certifications } = resumeData;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName}</Text>
          <View style={styles.contactInfo}>
            <Text>{personalInfo.email}</Text>
            {personalInfo.phone && <Text>• {personalInfo.phone}</Text>}
            {personalInfo.address && <Text>• {personalInfo.address}</Text>}
            {personalInfo.website && <Text>• {personalInfo.website}</Text>}
            {personalInfo.linkedin && <Text>• {personalInfo.linkedin}</Text>}
            {personalInfo.github && <Text>• {personalInfo.github}</Text>}
          </View>
        </View>

        {/* Experience */}
        {experiences?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experiences.map((exp, index) => (
              <View key={index} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.jobTitle}</Text>
                  <Text style={styles.itemDate}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>
                  {exp.company} • {exp.location}
                </Text>
                {exp.description?.map((desc, i) => (
                  <Text key={i} style={styles.itemDescription}>
                    • {desc}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {educations?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {educations.map((edu, index) => (
              <View key={index} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.degree}</Text>
                  <Text style={styles.itemDate}>
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>
                  {edu.institution} • {edu.location}
                </Text>
                {edu.description && (
                  <Text style={styles.itemDescription}>{edu.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
              {skills.map((skill, index) => (
                <Text key={index} style={styles.itemDescription}>
                  {skill.name}{index < skills.length - 1 ? ' •' : ''}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((project, index) => (
              <View key={index} style={styles.item}>
                <Text style={styles.itemTitle}>{project.name}</Text>
                <Text style={styles.itemSubtitle}>
                  {project.technologies.join(' • ')}
                </Text>
                <Text style={styles.itemDescription}>
                  {project.description}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {certifications?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert, index) => (
              <View key={index} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{cert.name}</Text>
                  <Text style={styles.itemDate}>{cert.date}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}