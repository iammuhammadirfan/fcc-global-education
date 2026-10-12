import { TeamMember } from './types';

export const teamMembers: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Dr. Evelyn Montgomery',
    role: 'Founder & Chief Executive Officer',
    experience: '18+ Years in International Higher Education',
    credentials: ['PhD in International Education (Oxford)', 'Former Admissions Dean', 'PIER Certified (QEAC)'],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    bio: 'Former senior admissions evaluator at top UK and Canadian institutions with nearly two decades of experience guiding over 4,000 students to world-class academic institutions.',
    specializations: ['Oxbridge Admissions', 'Institutional Strategy', 'Global Scholarships'],
  },
  {
    id: 'team-2',
    name: 'Julian Vance, Esq.',
    role: 'Director of Global Immigration & Visa Compliance',
    experience: '14+ Years in Immigration Law',
    credentials: ['LL.M. International Law (LSE)', 'OISC Level 3 Regulated', 'Former Consular Officer Advisor'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    bio: 'Specialist in student visa jurisprudence across the UK, USA, Australia, and the Schengen zone. Oversees our 98.6% visa approval audit pipeline and interview preparation clinics.',
    specializations: ['US F-1 Visa Credibility', 'UKVI CAS Compliance', 'Financial Dossier Auditing'],
  },
  {
    id: 'team-3',
    name: 'Samantha Rao',
    role: 'Head of North American Admissions (USA & Canada)',
    experience: '11+ Years in US/Canada College Counseling',
    credentials: ['M.Ed. Higher Education (Harvard)', 'NACAC Member', 'AIRC Certified Counselor'],
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    bio: 'Helped place hundreds of scholars into Ivy League and top Canadian universities with over $8 million in institutional scholarships and graduate assistantships.',
    specializations: ['Ivy League Admissions', 'STEM OPT Extensions', 'Common App Strategy'],
  },
  {
    id: 'team-4',
    name: 'Henrik Lindqvist',
    role: 'Head of European & Nordic Higher Education',
    experience: '9+ Years in Continental European Admissions',
    credentials: ['M.Sc. Munich (TUM)', 'DAAD Alumni Network', 'Study in Sweden Certified'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    bio: 'Pioneered zero-tuition German and regional Italian scholarship pathways for international students, with unmatched expertise in APS certification and uni-assist processing.',
    specializations: ['Germany Tuition-Free Admissions', 'APS Procedures', 'DSU Scholarships Italy'],
  },
];

export const globalStats = {
  studentsPlaced: '5,000+',
  countriesRepresented: '20+',
  partnerUniversities: '120+',
  visaSuccessRate: '98.6%',
  scholarshipsSecured: '$14.2M+',
  averageTurnaroundDays: '7–10 Days',
};
