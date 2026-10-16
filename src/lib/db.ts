import fs from 'fs';
import path from 'path';
import {
  Country,
  University,
  Service,
  SuccessStory,
  VideoTestimonial,
  BlogPost,
  FAQItem,
  TeamMember,
  User,
  GeneralSettings,
  NavigationSettings,
  FooterSettings,
  HomepageSettings,
  Lead,
  Appointment,
  MediaItem,
  SocialLinks,
  EmailSettings,
  AppointmentSettings,
  SEOSettings,
  CustomPage,
  VisaSuccessItem,
  VisaSuccessPageSettings,
  ServicesPageSettings,
  AboutPageSettings,
  Subscriber,
  BroadcastCampaign,
  AiChatSettings,
  Review,
} from './types';
import { hashPassword } from './auth';
import { syncTableToMySQL, loadDataFromMySQL, fetchTableFromMySQL } from './mysql';

import { countries as initialCountries } from '@/data/countries';
import { universities as initialUniversities } from '@/data/universities';
import { services as initialServices } from '@/data/services';
import { successStories as initialStories, videoTestimonials as initialVideos } from '@/data/successStories';
import { initialVisaSuccessItems } from '@/data/visaSuccess';
import { blogPosts as initialBlogPosts } from '@/data/blogPosts';
import { teamMembers as initialTeam } from '@/data/team';
import { faqs as initialFaqs } from '@/data/faqs';
import { initialReviews } from '@/data/reviews';

interface DatabaseSchema {
  users: User[];
  generalSettings: GeneralSettings;
  navigationSettings: NavigationSettings;
  footerSettings: FooterSettings;
  homepageSettings: HomepageSettings;
  countries: Country[];
  universities: University[];
  services: Service[];
  successStories: SuccessStory[];
  visaSuccess: VisaSuccessItem[];
  videos: VideoTestimonial[];
  blogPosts: BlogPost[];
  teamMembers: TeamMember[];
  faqs: FAQItem[];
  leads: Lead[];
  appointments: Appointment[];
  media: MediaItem[];
  socialLinks: SocialLinks;
  emailSettings: EmailSettings;
  appointmentSettings: AppointmentSettings;
  seoSettings: SEOSettings;
  customPages: CustomPage[];
  visaSuccessPageSettings?: VisaSuccessPageSettings;
  servicesPageSettings?: ServicesPageSettings;
  aboutPageSettings?: AboutPageSettings;
  subscribers?: Subscriber[];
  broadcastCampaigns?: BroadcastCampaign[];
  aiChatSettings?: AiChatSettings;
  broadcastDraft?: any;
  deletedSubscribers?: string[];
  reviews?: Review[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

function createInitialDatabase(): DatabaseSchema {
  const superAdminPasswordHash = hashPassword('admin123');
  const editorPasswordHash = hashPassword('editor123');
  const counselorPasswordHash = hashPassword('counselor123');

  return {
    users: [
      {
        id: 'usr_super_admin',
        name: 'Dr. Evelyn Montgomery',
        email: 'admin@fccglobaleducation.com',
        passwordHash: superAdminPasswordHash,
        role: 'super_admin',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr_editor',
        name: 'Julian Vance, Esq.',
        email: 'editor@fccglobaleducation.com',
        passwordHash: editorPasswordHash,
        role: 'editor',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr_counselor',
        name: 'Samantha Rao',
        email: 'counselor@fccglobaleducation.com',
        passwordHash: counselorPasswordHash,
        role: 'counselor',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
        createdAt: new Date().toISOString(),
      },
    ],
    generalSettings: {
      companyName: 'FCC Global Education',
      tagline: 'Leading International Education & Visa Consultancy',
      logoUrl: '',
      darkLogoUrl: '',
      faviconUrl: '',
      phone: '+92 300 8886 536',
      alternatePhone: '+44 (0) 20 7946 0912',
      whatsapp: '+923008886536',
      email: 'info@fccglobaleducation.com',
      address: '1st Floor, Imran Gujjar Plaza, Main Stop Kot Shahabuddin, Shahdara Town, Shahdara, 54950',
      officeHours: 'Monday – Saturday: 9:00 AM – 6:30 PM PKT',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1st+Floor%2C+Imran+Gujjar+Plaza%2C+Main+Stop+Kot+Shahabuddin%2C+Shahdara+Town%2C+Shahdara%2C+54950',
      websiteUrl: 'https://fccglobaleducation.com',
      shortDescription: 'Premier international education consultancy facilitating world-class admissions, scholarship strategy, and 98.6% visa success across top-tier universities worldwide.',
      copyrightText: `© ${new Date().getFullYear()} FCC Global Education Consultants Ltd. All Rights Reserved.`,
    },
    navigationSettings: {
      items: [
        { id: 'nav-1', label: 'Home', href: '/', enabled: true, order: 1 },
        { id: 'nav-2', label: 'About Us', href: '/about', enabled: true, order: 2 },
        { id: 'nav-3', label: 'Services', href: '/services', enabled: true, order: 3 },
        { id: 'nav-4', label: 'Destinations', href: '/destinations', hasDropdown: true, dropdownType: 'destinations', enabled: true, order: 4 },
        { id: 'nav-5', label: 'Universities', href: '/universities', hasDropdown: true, dropdownType: 'universities', enabled: true, order: 5 },
        { id: 'nav-6', label: 'Success Stories', href: '/success-stories', enabled: true, order: 6 },
        { id: 'nav-7', label: 'Visa Success', href: '/visa-success', enabled: true, order: 7 },
        { id: 'nav-9', label: 'FAQ', href: '/faq', enabled: true, order: 8 },
        { id: 'nav-10', label: 'Contact', href: '/contact', enabled: true, order: 9 },
      ],
      ctaButton: {
        label: 'Book Free Consultation',
        href: '/book-appointment',
        enabled: true,
      },
    },
    footerSettings: {
      description: 'Premier international education consultancy facilitating world-class admissions, scholarship strategy, and visa success across top-tier universities in the UK, USA, Canada, Australia, and Europe.',
      accreditations: ['PIER Certified (QEAC)', 'British Council Certified', 'AIRC Member'],
      links: [
        { id: 'fl-1', label: 'Home', href: '/', section: 'explore', order: 1 },
        { id: 'fl-2', label: 'About Us', href: '/about', section: 'explore', order: 2 },
        { id: 'fl-3', label: 'All Services', href: '/services', section: 'explore', order: 3 },
        { id: 'fl-4', label: 'University Directory', href: '/universities', section: 'explore', order: 4 },
        { id: 'fl-5', label: 'Student Success Stories', href: '/success-stories', section: 'explore', order: 5 },
        { id: 'fl-6', label: 'Visa Track Record', href: '/visa-success', section: 'explore', order: 6 },
        { id: 'fl-8', label: 'Frequently Asked Questions', href: '/faq', section: 'explore', order: 7 },
        { id: 'fl-9', label: 'Privacy Policy', href: '/privacy-policy', section: 'legal', order: 1 },
        { id: 'fl-10', label: 'Terms of Engagement', href: '/terms-and-conditions', section: 'legal', order: 2 },
        { id: 'fl-11', label: 'Cookie Policy', href: '/cookie-policy', section: 'legal', order: 3 },
      ],
      privacyPolicyUrl: '/privacy-policy',
      termsUrl: '/terms-and-conditions',
      complianceNotice: 'Disclaimer: FCC Global Education is an international educational advisory. Visa grant decisions rest exclusively with the official immigration authorities and embassies of respective sovereign nations.',
    },
    homepageSettings: {
      hero: {
        trustBadge: 'British Council & PIER Certified Global Education Counselors',
        headline: 'Your Global Education Journey Starts Here',
        headlineHighlight: 'Starts Here',
        subheadline: 'Expert guidance, university admissions, visa support, and personalized counseling to help you study at leading universities around the world.',
        primaryCtaText: 'Book a Free Consultation',
        primaryCtaHref: '/book-appointment',
        secondaryCtaText: 'Explore Study Destinations',
        secondaryCtaHref: '/destinations',
        heroImageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
        latestAdmissionText: 'Latest Admission',
        latestAdmissionUniversity: 'Imperial College London',
        latestAdmissionBadge: '£10k Grant',
      },
      stats: {
        studentsPlaced: '5,000+',
        studentsPlacedLabel: 'Students Placed',
        visaSuccessRate: '98.6%',
        visaSuccessRateLabel: 'Visa Approval Rate',
        partnerUniversities: '120+',
        partnerUniversitiesLabel: 'Partner Universities',
        scholarshipsSecured: '$14.2M+',
        scholarshipsSecuredLabel: 'Scholarships Secured',
      },
      sections: [
        { id: 'hero', name: 'Hero Banner', enabled: true, order: 1 },
        { id: 'marquee', name: 'Partner University Ticker', enabled: true, order: 2 },
        { id: 'pathway', name: '4-Step Journey Pathway', enabled: true, order: 3 },
        { id: 'destinations', name: 'Study Destinations Showcase', enabled: true, order: 4 },
        { id: 'services', name: 'Services Portfolio', enabled: true, order: 5 },
        { id: 'universities', name: 'Top Universities Spotlight', enabled: true, order: 6 },
        { id: 'calculator', name: 'Admission & Visa Calculator', enabled: true, order: 7 },
        { id: 'stories', name: 'Success Stories & Videos', enabled: true, order: 8 },
        { id: 'why_us', name: 'Why Students Trust FCC Global Education', enabled: true, order: 9 },
        { id: 'cta_banner', name: 'Pre-Footer Conversion Banner', enabled: true, order: 10 },
      ],
    },
    countries: initialCountries,
    universities: initialUniversities,
    services: initialServices,
    successStories: initialStories,
    visaSuccess: initialVisaSuccessItems,
    videos: initialVideos,
    blogPosts: initialBlogPosts,
    teamMembers: initialTeam,
    faqs: initialFaqs,
    leads: [
      {
        id: 'lead-1',
        fullName: 'Alexander Wright',
        email: 'alex.wright@example.com',
        phone: '+44 7700 900542',
        currentCountry: 'United Kingdom',
        targetCountry: 'United States',
        studyLevel: 'Masters',
        program: 'MS Computer Science (AI Track)',
        academicScore: 'First Class Honours (GPA 3.8)',
        englishTest: 'Native / Exempt',
        message: 'Interested in Fall 2027 applications to Stanford and Columbia with potential RA funding.',
        sourcePage: '/contact',
        status: 'new',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: 'lead-2',
        fullName: 'Fatima Al-Zahra',
        email: 'fatima.zahra@example.com',
        phone: '+971 50 123 4567',
        currentCountry: 'United Arab Emirates',
        targetCountry: 'United Kingdom',
        studyLevel: 'Masters',
        program: 'MSc Financial Technology & Banking',
        academicScore: '84% (B.Com)',
        englishTest: 'IELTS Band 7.5',
        message: 'Looking for 1-year master courses in London and scholarship guidance.',
        sourcePage: '/eligibility-calculator',
        status: 'qualified',
        notes: 'Followed up via WhatsApp. High merit candidate for Imperial and UCL.',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
      {
        id: 'lead-3',
        fullName: 'Rajesh Patel',
        email: 'rajesh.patel@example.com',
        phone: '+91 98200 12345',
        currentCountry: 'India',
        targetCountry: 'Germany',
        studyLevel: 'Masters',
        program: 'MSc Automotive Engineering',
        academicScore: '8.8 / 10 CGPA (B.E. Mechanical)',
        englishTest: 'IELTS Band 7.0',
        message: 'Need help with TUM admissions and APS certificate verification.',
        sourcePage: '/destinations/germany',
        status: 'contacted',
        notes: 'Requested document checklist sent.',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'lead-4',
        fullName: 'Chloe Dupont',
        email: 'chloe.dupont@example.com',
        phone: '+33 6 12 34 56 78',
        currentCountry: 'France',
        targetCountry: 'Canada',
        studyLevel: 'Bachelors',
        program: 'Bachelor of Commerce / Business',
        academicScore: 'French Baccalaureate (16/20)',
        message: 'Planning to enroll at McGill or Toronto.',
        sourcePage: '/universities/mcgill',
        status: 'follow_up',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ],
    appointments: [
      {
        id: 'apt-1',
        fullName: 'Alexander Wright',
        email: 'alex.wright@example.com',
        phone: '+44 7700 900542',
        targetCountry: 'United States',
        studyLevel: 'Masters',
        consultationType: 'University Selection & Profiling',
        preferredDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        preferredTime: '11:00 AM – 11:30 AM',
        message: 'Stanford & Columbia MS Computer Science strategy call.',
        status: 'confirmed',
        meetingLink: 'https://meet.google.com/aur-aglb-edu',
        notes: 'Assigned to Samantha Rao (US Lead).',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'apt-2',
        fullName: 'Tanya Sharma',
        email: 'tanya.sharma@example.com',
        phone: '+91 98111 22334',
        targetCountry: 'United Kingdom',
        studyLevel: 'Masters',
        consultationType: 'Free Initial Profile Evaluation',
        preferredDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        preferredTime: '02:00 PM – 02:30 PM',
        message: 'Oxford & Cambridge master admissions feasibility.',
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'apt-3',
        fullName: 'Marcus Becker',
        email: 'marcus.b@example.de',
        phone: '+49 170 1234567',
        targetCountry: 'Australia',
        studyLevel: 'Masters',
        consultationType: 'Visa & Compliance Consultation',
        preferredDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
        preferredTime: '03:30 PM – 04:00 PM',
        message: 'Subclass 500 Visa documentation review.',
        status: 'confirmed',
        meetingLink: 'https://meet.google.com/aur-visa-oz',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
    ],
    media: [
      {
        id: 'med-1',
        name: 'oxford_campus.jpg',
        url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
        category: 'universities',
        sizeBytes: 421000,
        mimeType: 'image/jpeg',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'med-2',
        name: 'uk_banner.jpg',
        url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80',
        category: 'countries',
        sizeBytes: 812000,
        mimeType: 'image/jpeg',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'med-3',
        name: 'student_aarav.jpg',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        category: 'students',
        sizeBytes: 154000,
        mimeType: 'image/jpeg',
        createdAt: new Date().toISOString(),
      },
    ],
    socialLinks: {
      facebook: 'https://facebook.com/fccglobaledu',
      instagram: 'https://instagram.com/fccglobaledu',
      youtube: 'https://youtube.com/@fccglobaledu',
      tiktok: 'https://tiktok.com/@fccglobaledu',
      linkedin: 'https://linkedin.com/company/fccglobaledu',
      whatsapp: 'https://wa.me/442079460912',
      twitter: 'https://x.com/fccglobaledu',
    },
    emailSettings: {
      senderName: 'FCC Global Education Admissions',
      senderEmail: 'admissions@fccglobaleducation.com',
      replyToEmail: 'support@fccglobaleducation.com',
      smtpHost: 'smtp.mailtrap.io',
      smtpPort: 587,
      smtpUser: 'aura_smtp_user',
      smtpPass: 'aura_smtp_pass',
      templates: {
        inquiryReceived: {
          subject: 'Thank You for Reaching Out to FCC Global Education',
          body: 'Dear {{name}},\n\nThank you for submitting your study abroad inquiry for {{country}}. A dedicated senior counselor has been assigned to your file and will review your transcripts.\n\nBest regards,\nFCC Global Education Admissions Council',
        },
        appointmentConfirmed: {
          subject: 'Confirmed: Your FCC Global Education Strategy Call on {{date}}',
          body: 'Dear {{name}},\n\nYour 1-on-1 {{type}} consultation is confirmed for {{date}} at {{time}}.\n\nVideo Meeting Link: {{meetingLink}}\n\nPlease have your provisional transcripts ready for review.\n\nBest regards,\nFCC Global Education',
        },
        adminLeadNotification: {
          subject: 'New Student Lead Received: {{name}} ({{country}})',
          body: 'A new lead has been submitted on the website.\nName: {{name}}\nEmail: {{email}}\nPhone: {{phone}}\nDestination: {{country}}\nLevel: {{level}}',
        },
      },
    },
    appointmentSettings: {
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      workingHoursStart: '09:00',
      workingHoursEnd: '19:00',
      slotDurationMinutes: 30,
      timeZone: 'Europe/London (GMT)',
      consultationTypes: [
        {
          id: 'free-initial',
          title: 'Free Initial Profile Evaluation',
          duration: '30 Mins',
          badge: '100% Free',
          desc: 'Comprehensive review of your transcripts, eligibility check, and high-level country shortlisting.',
        },
        {
          id: 'uni-selection',
          title: 'University Selection & Profiling',
          duration: '45 Mins',
          badge: 'Popular',
          desc: 'Deep-dive into 6–10 tailored Dream, Target, and Safe institutions with course syllabus comparisons.',
        },
        {
          id: 'visa-consult',
          title: 'Visa & Compliance Consultation',
          duration: '45 Mins',
          badge: 'High Priority',
          desc: 'Financial document audit, 28-day holding rules, blocked accounts, and consular interview preparation.',
        },
        {
          id: 'scholarship-aid',
          title: 'Scholarship & Financial Aid Strategy',
          duration: '45 Mins',
          badge: 'Merit-Focused',
          desc: 'Targeted assessment for merit bursaries, Chevening, Fulbright, DAAD, and departmental fellowships.',
        },
      ],
    },
    seoSettings: {
      defaultTitle: 'FCC Global Education | Study Abroad Consultants | Universities, Admissions & Visa Guidance',
      defaultDescription: 'Premier international education consultancy providing end-to-end university shortlisting, fast-track admissions, scholarship counseling, and 98.6% student visa approvals across UK, USA, Canada, Australia, and Europe.',
      defaultKeywords: [
        'study abroad consultants',
        'overseas education consultancy',
        'study in UK',
        'study in USA',
        'study in Canada',
        'study in Australia',
        'student visa guidance',
        'scholarships for international students',
      ],
      ogImageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      twitterImageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      googleVerification: 'google-site-verification-placeholder-code',
      analyticsId: 'G-AURAGLOBAL2026',
      pageOverrides: {
        '/': {
          title: 'FCC Global Education | World-Class Study Abroad Counseling',
          description: 'Your Global Education Journey Starts Here. Expert university admissions, scholarship guidance, and 98.6% student visa approvals.',
        },
        '/about': {
          title: 'About Us | FCC Global Education Consultants',
          description: 'Learn about our founders, academic heritage, British Council and PIER accreditations, and core counseling values.',
        },
        '/services': {
          title: 'Our Services | Full-Spectrum Study Abroad Advisory',
          description: 'From academic profiling and SOP polishing to visa mock interviews and foreign accommodation booking.',
        },
        '/destinations': {
          title: 'Study Destinations | 12 Leading Global Education Hubs',
          description: 'Explore tuition fees, living costs, and post-study work rights across the UK, USA, Canada, Australia, and Europe.',
        },
        '/universities': {
          title: 'University Directory | Top World-Ranked Higher Education',
          description: 'Explore entry requirements, global QS rankings, tuition rates, and merit scholarship criteria.',
        },
        '/success-stories': {
          title: 'Student Success Stories | Real Offers & Student Visas',
          description: 'Read and watch genuine student testimonials from Imperial, Columbia, Toronto, Melbourne, and TUM.',
        },
        '/visa-success': {
          title: 'Visa Success Track Record | 98.6% Verified Approval Rate',
          description: 'Our certified immigration solicitors pre-audit financial dossiers and conduct rigorous consular mock interviews.',
        },
        '/contact': {
          title: 'Contact Us | FCC Global Education Global Offices & Inquiries',
          description: 'Get in touch with senior advisors at our London Headquarters, Toronto, Melbourne, or Dubai branches.',
        },
        '/book-appointment': {
          title: 'Book Free 1-on-1 Consultation | FCC Global Education',
          description: 'Schedule a free 30-minute video session with an accredited senior study abroad advisor.',
        },
        '/faq': {
          title: 'Frequently Asked Questions | Admissions & Visa Guidance',
          description: 'Transparent answers regarding university deadlines, IELTS waivers, bank balance rules, and tuition costs.',
        },
      },
    },
    customPages: [
      {
        id: 'page-privacy',
        slug: 'privacy-policy',
        title: 'Privacy Policy',
        content: `
### FCC Global Education Consultants - Privacy Policy
Last updated: January 2026

At FCC Global Education, we respect and safeguard the personal data and privacy of our student applicants, parents, and website visitors.

#### 1. Information We Collect
We collect personal information you provide directly through our appointment booking, contact inquiry, and interactive eligibility evaluation forms:
* **Contact Information**: Full name, email address, telephone/WhatsApp number, current city and country.
* **Academic Information**: Current educational qualifications, GPA/grades, English proficiency test scores (IELTS/TOEFL/PTE), and target degree courses.
* **Application Documents**: Academic transcripts, Statements of Purpose, CVs, and recommendation letters uploaded for consultation.

#### 2. How We Use Your Data
* To evaluate admission eligibility and match students with suitable university programs.
* To schedule and coordinate video counseling appointments and mock interviews.
* To prepare official university applications and student visa compliance documentation.
* We never sell, rent, or trade your personal information to third-party marketing entities.

#### 3. Data Protection (GDPR Compliance)
Under UK and European GDPR regulations, you have the right to request access to your stored records, request data rectification, or request complete deletion of your profile by emailing privacy@fccglobaleducation.com.
        `,
        published: true,
        seoTitle: 'Privacy Policy | FCC Global Education',
        seoDescription: 'Official privacy policy and GDPR compliance statement of FCC Global Education Consultants.',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'page-terms',
        slug: 'terms-and-conditions',
        title: 'Terms & Conditions',
        content: `
### Terms of Engagement & Service Conditions
Last updated: January 2026

Welcome to FCC Global Education Consultants. By using this website, scheduling consultations, or retaining our services, you agree to the following terms.

#### 1. Advisory Scope
FCC Global Education provides academic counseling, profile shortlisting, essay guidance, and visa compliance auditing. While we maintain a 98.6% visa approval record, final admission and visa issuance decisions remain the sole sovereign authority of respective universities and government immigration departments.

#### 2. Academic Integrity & Zero Plagiarism
All Statement of Purpose (SOP) and essay editing services adhere strictly to international academic integrity rules. We provide structural mentorship, language polishing, and narrative coaching; students remain the primary authors of their submitted materials.

#### 3. Confidentiality
All client financial portfolios, tax returns, and academic transcripts entrusted to our advisory team are handled under strict professional confidentiality agreements.
        `,
        published: true,
        seoTitle: 'Terms & Conditions | FCC Global Education',
        seoDescription: 'Terms of engagement and service conditions for FCC Global Education Consultants.',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'page-cookies',
        slug: 'cookie-policy',
        title: 'Cookie Policy',
        content: `
### Cookie Policy
Last updated: January 2026

Our website uses essential and analytics cookies to optimize user experience, remember your filter preferences, and analyze site traffic.

#### Essential Cookies
Necessary for website navigation, appointment calendar slot reservations, and secure admin session management.

#### Analytics Cookies
We use aggregated, anonymized metrics (such as Google Analytics) to understand which country guides and university profiles are most helpful to prospective students. You can manage or disable cookies at any time through your browser settings.
        `,
        published: true,
        seoTitle: 'Cookie Policy | FCC Global Education',
        seoDescription: 'Cookie policy and technical preference information for FCC Global Education.',
        updatedAt: new Date().toISOString(),
      },
    ],
    visaSuccessPageSettings: {
      heroBadge: 'Verified Legal Immigration Compliance',
      heroTitle: 'Turning Study Dreams Into',
      heroTitleHighlight: 'Visa Success',
      heroDescription: 'Our certified immigration solicitors and visa compliance officers audit every bank statement, tax filing, and sponsor affidavit before submission, ensuring near-perfect approval outcomes.',
      stats: {
        stat1Value: '98.6%',
        stat1Label: 'Audited Visa Approval Rate',
        stat2Value: '5,000+',
        stat2Label: 'Approved Student Visas',
        stat3Value: '12+',
        stat3Label: 'Destination Consulates & Embassies',
        stat4Value: '0%',
        stat4Label: 'Refusal on Compliant Files',
      },
      galleryBadge: 'Real Proofs & Official Stamps',
      galleryTitle: 'Verified Student Visa Approval Letters',
      galleryDescription: 'Browse genuine visa grant decisions and embassy approval stamps obtained by our scholars across the UK, USA, Canada, Australia, Germany, and Europe.',
      frameworksBadge: 'Country-Wise Protocols',
      frameworksTitle: 'Destination Visa Frameworks & Timelines',
      frameworksDescription: 'Every country enforces distinct financial holding rules, attestation mandates, and interview procedures. Here is how our team manages them for you.',
      destinationFrameworks: [],
      auditBadge: 'Why We Maintain 98.6% Success',
      auditTitle: 'Our 5-Stage Visa Pre-Audit Protocol',
      auditDescription: 'Every case is vetted through a five-tier compliance review before lodging to ensure zero grounds for rejection.',
    },
    servicesPageSettings: {
      heroBadge: 'End-to-End International Education Suite',
      heroTitle: 'Bespoke Services for Every Stage of',
      heroTitleHighlight: 'Your Global Journey',
      heroDescription: 'From academic profiling and Turnitin-verified SOP editing to our audited 98.6% visa advisory and overseas accommodation booking, discover our full spectrum of specialized student services.',
      spotlightBadge: 'Featured Deep-Dive',
      spotlightCtaText: 'Book Free Consultation for this Service',
      spotlightCtaLink: '/book-appointment',
      whatsappCtaText: 'Chat with Service Lead on WhatsApp',
      whatsappNumber: '+442079460912',
      selectorTitle: 'Select Service to Inspect:',
      portfolioBadge: 'Complete Portfolio',
      portfolioTitle: 'Explore All Specialized Advisory Services',
      portfolioSubtitle: 'Every service is led by certified specialists with direct experience in university admissions and international immigration law.',
      serviceCtaText: 'Get Service Consultation',
      serviceCtaLink: '/book-appointment',
      ctaBadge: 'Tailored Mentorship',
      ctaTitle: 'Not Sure Which Service You Need First?',
      ctaDescription: 'Book a complimentary 30-minute diagnostic session. Our senior counselor will evaluate your profile and chart a custom roadmap covering all required services.',
      ctaButtonText: 'Book Free Diagnostic Session',
      ctaButtonLink: '/book-appointment',
    },
    aboutPageSettings: {
      heroBadge: 'Who We Are & What We Stand For',
      heroTitle: 'Empowering the Next Generation of',
      heroTitleHighlight: 'Global Leaders',
      heroDescription: 'Founded on the belief that world-class education transforms trajectories, FCC Global Education bridges ambitious international scholars with the world’s most prestigious universities through ethical, data-driven, and high-touch mentorship.',
      stats: {
        stat1Value: '25,000+',
        stat1Label: 'Students Placed Globally',
        stat2Value: '98.6%',
        stat2Label: 'Verified Visa Success',
        stat3Value: '850+',
        stat3Label: 'Direct Partner Universities',
        stat4Value: '$14.2M+',
        stat4Label: 'Scholarships Won by Students',
      },
      storyBadge: 'Our Story',
      storyTitle: 'Built on Academic Integrity, Driven by Student Triumph',
      storyParagraph1: 'FCC Global Education began with a clear realization: international education counseling was broken. Most traditional agencies pushed students toward low-tier, commission-heavy private institutions without regard for academic fit or career trajectory.',
      storyParagraph2: 'We set out to create an elite advisory modeled on collegiate fellowship committees. By hiring counselors with degrees from Oxford, Harvard, LSE, and TUM, we brought deep academic rigor to the application process. Today, we stand as one of the most respected independent educational consultancies with official university representations and direct alumni chapters spanning 20+ countries.',
      storyImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80',
      storyImageBadge: 'Founded by International Academics',
      storyImageCaption: 'Over a decade of university admissions excellence across UK, USA, Canada, & Australia.',
      storyPillars: [
        {
          title: 'Ethical Counsel',
          description: 'Zero commission steering. We recommend universities that truly align with your goals.',
        },
        {
          title: 'Audit-Grade Visas',
          description: 'Immigration specialists verify all financial dossiers before submission.',
        },
      ],
      missionTitle: 'Our Mission',
      missionDescription: 'To democratize access to the world’s top educational institutions by providing rigorous profiling, uncompromised writing guidance, transparent visa compliance, and relentless scholarship advocacy for every deserving student.',
      visionTitle: 'Our Vision',
      visionDescription: 'To be the world’s most trusted overseas education authority, known for elevating students into global thinkers, innovative problem solvers, and lifelong alumni leaders in their host societies.',
      valuesBadge: 'Guiding Principles',
      valuesTitle: 'Our Non-Negotiable Values',
      values: [
        {
          id: 'val-1',
          title: '1. Absolute Transparency',
          description: 'Honest chances assessment. If a program is unrealistic or overpriced, we give you unfiltered truth, not false promises.',
        },
        {
          id: 'val-2',
          title: '2. Academic Rigor',
          description: 'We treat every application like an academic submission, ensuring essays are intellectually rich and free of boilerplate clichés.',
        },
        {
          id: 'val-3',
          title: '3. Zero Plagiarism',
          description: 'Every personal statement is crafted from original student interviews and verified via Turnitin and AI-detection tools.',
        },
        {
          id: 'val-4',
          title: '4. Lifelong Support',
          description: 'Our care extends well past the airport gate into local housing, tax registration, and graduate job hunting.',
        },
      ],
      teamBadge: 'Expert Advisory Council',
      teamTitle: 'Meet Our Senior Counselors & Visa Directors',
      teamDescription: 'Our counselors possess real credentials from the world’s leading universities and legal immigration bodies.',
      showTeam: true,
      ctaBadge: 'Begin Your Journey Today',
      ctaTitle: 'Connect Directly with a Senior Admissions Counselor',
      ctaDescription: 'Schedule a personalized, one-on-one session to evaluate your transcripts and identify matched universities with high scholarship likelihood.',
      ctaPrimaryButtonText: 'Book Free Profile Evaluation',
      ctaPrimaryButtonLink: '/book-appointment',
      ctaSecondaryButtonText: 'View Our Services',
      ctaSecondaryButtonLink: '/services',
      seoTitle: 'About Us | FCC Global Education Consultants',
      seoDescription: 'Learn about FCC Global Education’s story, leadership, global university accreditations, ethical counseling values, and 98.6% visa approval track record.',
    },
    subscribers: [],
    broadcastCampaigns: [],
    reviews: initialReviews,
  };
}

class DatabaseManager {
  private cache: DatabaseSchema | null = null;

  private ensureDataDir() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  }

  public getDb(): DatabaseSchema {
    this.ensureDataDir();

    if (!fs.existsSync(DB_FILE)) {
      const initialData = createInitialDatabase();
      this.writeDb(initialData);
      this.cache = initialData;
      return this.cache;
    }

    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      let needsSave = false;
      if (!parsed.visaSuccess || !Array.isArray(parsed.visaSuccess)) {
        parsed.visaSuccess = [];
        needsSave = true;
      }
      if (!parsed.servicesPageSettings || typeof parsed.servicesPageSettings !== 'object') {
        parsed.servicesPageSettings = createInitialDatabase().servicesPageSettings;
        needsSave = true;
      }
      if (!parsed.aboutPageSettings || typeof parsed.aboutPageSettings !== 'object') {
        parsed.aboutPageSettings = createInitialDatabase().aboutPageSettings;
        needsSave = true;
      }
      if (!Array.isArray(parsed.subscribers)) {
        parsed.subscribers = [];
        needsSave = true;
      }
      if (!Array.isArray(parsed.broadcastCampaigns)) {
        parsed.broadcastCampaigns = [];
        needsSave = true;
      }
      if (!Array.isArray(parsed.reviews)) {
        parsed.reviews = initialReviews;
        needsSave = true;
      }
      if (needsSave) {
        this.writeDb(parsed);
      }
      this.cache = parsed;
      return parsed;
    } catch (readErr) {
      if (this.cache) return this.cache;
      console.error('[Database Read/Parse Warning]:', readErr);

      // Protect against wiping data on temporary concurrent read glitches:
      try {
        if (fs.existsSync(DB_FILE)) {
          const rawContent = fs.readFileSync(DB_FILE, 'utf-8');
          if (rawContent && rawContent.trim().length > 20) {
            const reParsed = JSON.parse(rawContent);
            if (reParsed && typeof reParsed === 'object') {
              this.cache = reParsed;
              return reParsed;
            }
          }
        }
      } catch {}

      const initialData = createInitialDatabase();
      this.writeDb(initialData);
      this.cache = initialData;
      return this.cache;
    }
  }

  public writeDb(data: DatabaseSchema) {
    this.ensureDataDir();
    try {
      const tempFile = path.join(DB_DIR, `db_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.tmp`);
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
      try {
        fs.renameSync(tempFile, DB_FILE);
      } catch {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
        try { fs.unlinkSync(tempFile); } catch {}
      }
      this.cache = data;
    } catch (err) {
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
        this.cache = data;
      } catch (fallbackErr) {
        console.error('[Database Write Error]:', fallbackErr);
      }
    }
  }

  // Direct MySQL + Local DB methods
  public async getTable<K extends keyof DatabaseSchema>(table: K): Promise<DatabaseSchema[K]> {
    // 1. Live direct query from XAMPP MySQL database
    try {
      const mysqlData = await fetchTableFromMySQL(table as string);
      if (mysqlData !== null && mysqlData !== undefined) {
        const local = this.getDb();
        (local as any)[table] = mysqlData;
        return mysqlData as DatabaseSchema[K];
      }
    } catch (err: any) {
      console.warn(`[MySQL getTable error for ${String(table)}]:`, err?.message || err);
    }

    // 2. Resilient fallback to local storage
    const db = this.getDb();
    return db[table];
  }

  // Synchronous cache read for internal sync helpers
  public getTableSync<K extends keyof DatabaseSchema>(table: K): DatabaseSchema[K] {
    const db = this.getDb();
    return db[table];
  }

  public async updateTable<K extends keyof DatabaseSchema>(table: K, value: DatabaseSchema[K]) {
    const db = this.getDb();
    db[table] = value;
    this.writeDb(db);

    // Immediately synchronize update to XAMPP MySQL database
    try {
      await syncTableToMySQL(table as string, value);
    } catch (err: any) {
      console.error(`[MySQL updateTable sync error for ${String(table)}]:`, err);
    }

    return db[table];
  }

  public async syncFromMySQL(): Promise<boolean> {
    try {
      const mysqlData = await loadDataFromMySQL();
      if (mysqlData) {
        const current = this.getDb();
        const merged: DatabaseSchema = {
          ...current,
          ...mysqlData,
        };
        if (!merged.visaSuccess || !Array.isArray(merged.visaSuccess)) {
          merged.visaSuccess = current.visaSuccess || [];
        }
        if (!merged.aboutPageSettings || typeof merged.aboutPageSettings !== 'object') {
          merged.aboutPageSettings = current.aboutPageSettings || createInitialDatabase().aboutPageSettings;
        }
        // Protect student reviews: merge by ID so no review from either local DB or MySQL is EVER lost
        const currentList = Array.isArray(current.reviews) ? current.reviews : [];
        const mysqlList = Array.isArray(mysqlData.reviews) ? mysqlData.reviews : [];
        if (mysqlList.length > 0 || currentList.length > 0) {
          const map = new Map<string, Review>();
          for (const item of mysqlList) {
            if (item && item.id) map.set(item.id, item);
          }
          for (const item of currentList) {
            if (item && item.id) map.set(item.id, item);
          }
          merged.reviews = Array.from(map.values());
        } else {
          merged.reviews = initialReviews;
        }
        this.writeDb(merged);
        return true;
      }
    } catch (err: any) {
      console.warn('[MySQL Sync] Load warning:', err?.message || err);
    }
    return false;
  }

  public async findBySlug<K extends keyof DatabaseSchema>(table: K, slug: string): Promise<any> {
    const list = await this.getTable(table);
    if (Array.isArray(list)) {
      return (list as any[]).find((item: any) => item.slug?.toLowerCase() === slug.toLowerCase()) || null;
    }
    return null;
  }

  public async findById<K extends keyof DatabaseSchema>(table: K, id: string): Promise<any> {
    const list = await this.getTable(table);
    if (Array.isArray(list)) {
      return (list as any[]).find((item: any) => item.id === id) || null;
    }
    return null;
  }

  public clearCache() {
    this.cache = null;
  }
}

export const db = new DatabaseManager();

declare global {
  var __mysql_sync_interval: any;
  var __mysql_is_syncing: boolean;
}

// Automatically synchronize from XAMPP MySQL database on start & continuously in background
if (typeof window === 'undefined') {
  if (!global.__mysql_sync_interval) {
    db.syncFromMySQL().catch(() => {});
    global.__mysql_sync_interval = setInterval(async () => {
      if (global.__mysql_is_syncing) return;
      global.__mysql_is_syncing = true;
      try {
        await db.syncFromMySQL();
      } catch {} finally {
        global.__mysql_is_syncing = false;
      }
    }, 20000);
  }
}

// Helper to ensure 1 unique email is recorded in the subscribers audience
export async function addSubscriber(
  email: string,
  name?: string,
  source: 'newsletter' | 'appointment' | 'contact' | 'manual' = 'newsletter',
  phone?: string
): Promise<Subscriber | null> {
  if (!email || !email.includes('@')) return null;
  const cleanEmail = email.trim().toLowerCase();
  const subscribers: Subscriber[] = (await db.getTable('subscribers')) || [];
  const existingIndex = subscribers.findIndex((s) => s.email.toLowerCase() === cleanEmail);
  if (existingIndex !== -1) {
    let changed = false;
    if (phone && !subscribers[existingIndex].phone) {
      subscribers[existingIndex].phone = phone.trim();
      changed = true;
    }
    if (name && !subscribers[existingIndex].name) {
      subscribers[existingIndex].name = name.trim();
      changed = true;
    }
    if (changed) {
      await db.updateTable('subscribers', subscribers);
    }
    return subscribers[existingIndex];
  }
  const newSub: Subscriber = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: cleanEmail,
    name: name?.trim() || undefined,
    phone: phone?.trim() || undefined,
    source,
    status: 'active',
    subscribedAt: new Date().toISOString(),
  };
  subscribers.unshift(newSub);
  await db.updateTable('subscribers', subscribers);
  return newSub;
}
