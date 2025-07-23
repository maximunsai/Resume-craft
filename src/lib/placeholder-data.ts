// src/lib/placeholder-data.ts

// import type { ResumeData } from '@/components/PDFDownloader';
import type { ResumeData } from '@/types/resume';


export const placeholderResumeData: ResumeData = {
    name: 'John M. Anderson',
    email: 'john.anderson@email.com',
    phone: '(555) 123-4567',
    linkedin: 'linkedin.com/in/jmanderson',
    github: 'github.com/jmanderson',
    professionalSummary: 'Accomplished and results-oriented Senior Software Engineer with over 10 years of experience in designing, developing, and deploying scalable web applications. Proven ability to lead projects from conception to completion.',
    technicalSkills: [
        'JavaScript (ES6+)', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'CI/CD'
    ],
    detailedExperience: [
        {
            id: 1,
            title: 'Senior Software Engineer',
            company: 'Innovatech Solutions Inc.',
            points: [
                'Architected and led the development of a new real-time analytics dashboard using Next.js and WebSockets, resulting in a 30% increase in user engagement.',
                'Mentored a team of four junior engineers, improving team productivity and code quality.',
                'Optimized backend services, reducing API response times by over 50%.',
            ],
            startDate: '',
            endDate: '',
            description: ''
        },
        {
            id: 2,
            title: 'Software Engineer',
            company: 'Digital Creations Co.',
            points: [
                'Developed and maintained features for a large-scale e-commerce platform using React and Redux.',
                'Collaborated with product managers and designers to translate requirements into technical solutions.',
                'Wrote comprehensive unit and integration tests, increasing code coverage by 40%.',
            ],
            startDate: '',
            endDate: '',
            description: ''
        }
    ],
};