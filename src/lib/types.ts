export * from '@/data/types';
import { VideoTestimonial } from '@/data/types';

export type Role = 'super_admin' | 'editor' | 'counselor';
export type VideoStory = VideoTestimonial;

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  avatar?: string;
  createdAt: string;
}

export interface GeneralSettings {
  companyName: string;
  tagline: string;
  logoUrl: string;
  darkLogoUrl?: string;
  faviconUrl?: string;
  phone: string;
  alternatePhone?: string;
  whatsapp: string;
  email: string;
  address: string;
  officeHours: string;
  googleMapsUrl: string;
  mapsUrl?: string;
  websiteUrl: string;
  shortDescription: string;
  copyrightText: string;
}

export interface NavItem {
  id?: string;
  label: string;
  href: string;
  badge?: string;
  hasDropdown?: boolean;
  dropdownType?: 'destinations' | 'universities' | 'custom';
  enabled?: boolean;
  order?: number;
}

export type NavigationConfig = any;
export type FooterConfig = any;
export type HomepageConfig = any;
export type MediaFile = MediaItem;
export type SeoSettings = SEOSettings;

export interface NavigationSettings {
  items: NavItem[];
  ctaButton: {
    label: string;
    href: string;
    enabled: boolean;
  };
}

export interface FooterLink {
  id: string;
  label: string;
  href: string;
  section: 'explore' | 'destinations' | 'legal';
  order: number;
}

export interface FooterSettings {
  description: string;
  accreditations: string[];
  links: FooterLink[];
  privacyPolicyUrl: string;
  termsUrl: string;
  complianceNotice: string;
}

export interface HomepageSectionConfig {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
}

export interface HomepageSettings {
  hero: {
    trustBadge: string;
    headline: string;
    headlineHighlight: string;
    subheadline: string;
    primaryCtaText: string;
    primaryCtaHref: string;
    secondaryCtaText: string;
    secondaryCtaHref: string;
    heroImageUrl: string;
    latestAdmissionText: string;
    latestAdmissionUniversity: string;
    latestAdmissionBadge: string;
  };
  stats: any;
  sections: HomepageSectionConfig[];
  ceoSection?: any;
  studentsPlaced?: string;
  studentsPlacedLabel?: string;
  visaSuccessRate?: string;
  visaSuccessRateLabel?: string;
  partnerUniversities?: string;
  partnerUniversitiesLabel?: string;
  scholarshipsSecured?: string;
  scholarshipsSecuredLabel?: string;
  visaSuccessRows?: HomepageVisaRow[];
  [key: string]: any;
}

export interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  currentCountry?: string;
  targetCountry: string;
  studyLevel: string;
  program?: string;
  academicScore?: string;
  englishTest?: string;
  message?: string;
  sourcePage: string;
  status: 'new' | 'contacted' | 'follow_up' | 'qualified' | 'converted' | 'closed';
  notes?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  targetCountry: string;
  studyLevel: string;
  consultationType: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled';
  notes?: string;
  meetingLink?: string;
  meetingMode?: 'video' | 'in_person';
  format?: string;
  createdAt: string;
  updatedAt: string;
  // Aliases for Admin Panel UI
  studentName?: string;
  country?: string;
  date?: string;
  time?: string;
  whatsapp?: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  category: 'general' | 'homepage' | 'countries' | 'universities' | 'students' | 'success_stories' | 'blog' | 'team' | 'videos' | 'documents' | string;
  sizeBytes: number;
  size?: number;
  uploadedAt?: string;
  mimeType: string;
  createdAt: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  linkedin: string;
  whatsapp: string;
  twitter: string;
}

export interface EmailSettings {
  senderName: string;
  senderEmail: string;
  replyToEmail: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  adminNotificationEmail?: string;
  templates: {
    inquiryReceived: {
      subject: string;
      body: string;
    };
    appointmentConfirmed: {
      subject: string;
      body: string;
    };
    adminLeadNotification: {
      subject: string;
      body: string;
    };
  };
}

export interface AiChatSettings {
  enabled: boolean;
  groqApiKey: string;
  model: string;
  botName: string;
  botAvatar?: string;
  welcomeMessage: string;
  systemPrompt: string;
  suggestedQuestions: string[];
  temperature: number;
}

export interface AppointmentSettings {
  availableDays: string[];
  workingHoursStart: string;
  workingHoursEnd: string;
  slotDurationMinutes: number;
  timeZone: string;
  defaultMeetingLink?: string;
  consultationTypes: any[];
}

export interface SEOSettings {
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string[];
  ogImageUrl: string;
  twitterImageUrl: string;
  googleVerification?: string;
  analyticsId?: string;
  titleTemplate?: string;
  keywords?: string[];
  ogImage?: string;
  twitterImage?: string;
  googleSiteVerification?: string;
  googleAnalyticsId?: string;
  pageOverrides: Record<string, {
    title: string;
    description: string;
    keywords?: string[];
  }>;
}

export interface CustomPage {
  id: string;
  slug: string;
  title: string;
  heroImage?: string;
  content: string;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  updatedAt: string;
}

export interface VisaSuccessItem {
  id: string;
  studentName: string;
  studentPhoto?: string;
  visaLetterImage: string;
  country: string;
  countryCode?: string;
  countrySlug?: string;
  university: string;
  program: string;
  intake?: string;
  visaType?: string;
  approvalDays?: string;
  grantDate?: string;
  testimonial?: string;
  featured?: boolean;
  published?: boolean;
  showOnHomepage?: boolean;
  order?: number;
  createdAt?: string;
}

export interface HomepageVisaRow {
  id: string;
  title: string;
  highlightText?: string;
  badge?: string;
  subtitle?: string;
  country: string;
  limit?: number;
  enabled?: boolean;
}

export interface VisaSuccessPageSettings {
  heroBadge?: string;
  heroTitle?: string;
  heroTitleHighlight?: string;
  heroDescription?: string;
  homepageRows?: HomepageVisaRow[];
  stats?: {
    stat1Value?: string;
    stat1Label?: string;
    stat2Value?: string;
    stat2Label?: string;
    stat3Value?: string;
    stat3Label?: string;
    stat4Value?: string;
    stat4Label?: string;
  };
  galleryBadge?: string;
  galleryTitle?: string;
  galleryDescription?: string;
  frameworksBadge?: string;
  frameworksTitle?: string;
  frameworksDescription?: string;
  destinationFrameworks?: Array<{
    country: string;
    flag?: string;
    visaType?: string;
    approvalRate?: string;
    avgProcessing?: string;
    fundsRule?: string;
    interviewReq?: string;
    keyHighlight?: string;
  }>;
  auditBadge?: string;
  auditTitle?: string;
  auditDescription?: string;
  auditStages?: Array<{
    stageNumber?: string;
    title?: string;
    description?: string;
  }>;
  disclaimerTitle?: string;
  disclaimerText?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
}

export interface ServicesPageSettings {
  // Hero Section
  heroBadge?: string;
  heroTitle?: string;
  heroTitleHighlight?: string;
  heroDescription?: string;

  // Spotlight / Deep Dive Section
  spotlightBadge?: string;
  spotlightCtaText?: string;
  spotlightCtaLink?: string;
  whatsappCtaText?: string;
  whatsappNumber?: string;
  selectorTitle?: string;

  // Portfolio Section
  portfolioBadge?: string;
  portfolioTitle?: string;
  portfolioSubtitle?: string;
  serviceCtaText?: string;
  serviceCtaLink?: string;

  // Pre-Footer CTA Section
  ctaBadge?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
}

export interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  country: string;
  countrySlug?: string;
  university: string;
  universitySlug?: string;
  program?: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  published: boolean;
  showOnHome: boolean;
  avatar?: string;
  createdAt: string;
  verifiedStudent?: boolean;
}

export interface AboutValueItem {
  id: string;
  title: string;
  description: string;
}

export interface AboutFeaturePillar {
  title: string;
  description: string;
}

export interface AboutPageSettings {
  // Hero Section
  heroBadge?: string;
  heroTitle?: string;
  heroTitleHighlight?: string;
  heroDescription?: string;

  // Key Statistics
  stats?: {
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
    stat4Value: string;
    stat4Label: string;
  };

  // Story Section
  storyBadge?: string;
  storyTitle?: string;
  storyParagraph1?: string;
  storyParagraph2?: string;
  storyImage?: string;
  storyImageBadge?: string;
  storyImageCaption?: string;
  storyPillars?: AboutFeaturePillar[];

  // Mission & Vision
  missionTitle?: string;
  missionDescription?: string;
  visionTitle?: string;
  visionDescription?: string;

  // Values Section
  valuesBadge?: string;
  valuesTitle?: string;
  values?: AboutValueItem[];

  // Team Section
  teamBadge?: string;
  teamTitle?: string;
  teamDescription?: string;
  showTeam?: boolean;

  // Pre-Footer CTA Section
  ctaBadge?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaPrimaryButtonText?: string;
  ctaPrimaryButtonLink?: string;
  ctaSecondaryButtonText?: string;
  ctaSecondaryButtonLink?: string;

  // SEO
  seoTitle?: string;
  seoDescription?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  experience?: string;
  credentials?: string[];
  image: string;
  bio: string;
  specializations?: string[];
  order?: number;
  sortOrder?: number;
  active?: boolean;
  specialization?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  source: 'newsletter' | 'appointment' | 'contact' | 'manual';
  status: 'active' | 'unsubscribed';
  subscribedAt: string;
}

export interface BroadcastCampaign {
  id: string;
  subject: string;
  campaignTitle: string;
  messageBody: string;
  ctaText?: string;
  ctaLink?: string;
  recipientCount: number;
  sentAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  action: 'LOGIN' | 'UPLOAD' | 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'SETTINGS_CHANGE';
  entity: string;
  entityId?: string;
  details: string;
  ip?: string;
  userAgent?: string;
  metadata?: any;
}


