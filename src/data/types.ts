export interface Country {
  id: string;
  slug: string;
  name: string;
  flag: string;
  code: string;
  region: 'Europe' | 'North America' | 'Asia-Pacific';
  heroImage: string;
  tagline: string;
  overview: string;
  whyStudy: string[];
  popularCourses: string[];
  averageTuition: string;
  livingCosts: string;
  currency: string;
  intakes: string[];
  postStudyWork: string;
  visaSuccessRate: string;
  workWhileStudying: string;
  topUniversityNames: string[];
  scholarshipsOverview: string;
  visaRequirements: string[];
  postStudyOpportunities: string[];
  applicationDeadlines: string;
  // Optional CMS extensions
  order?: number;
  sortOrder?: number;
  published?: boolean;
  shortDescription?: string;
  longDescription?: string;
  tuition?: string;
  livingCost?: string;
  visaInfo?: string;
  workOpportunity?: string;
  scholarships?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface University {
  id: string;
  slug: string;
  name: string;
  country: string;
  countrySlug: string;
  city: string;
  worldRank: number;
  rankingBadge: string;
  acceptanceRate: string;
  logo: string;
  image: string;
  overview: string;
  tuition: {
    undergraduate: string;
    postgraduate: string;
  };
  livingCostEstimate: string;
  popularPrograms: string[];
  studyFields: string[];
  entryRequirements: {
    academic: string;
    english: string;
    standardizedTests?: string;
  };
  scholarships: {
    title: string;
    amount: string;
    deadline: string;
    eligibility: string;
  }[];
  intakes: string[];
  highlights: string[];
  officialRep: boolean;
  // Optional CMS extensions
  order?: number;
  sortOrder?: number;
  published?: boolean;
  featured?: boolean;
  coverImage?: string;
  description?: string;
  ranking?: string;
  tuitionRange?: string;
  website?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  benefits: string[];
  deliverables: string[];
  targetAudience: string;
  turnaroundTime: string;
  // Optional CMS extensions
  order?: number;
  sortOrder?: number;
  active?: boolean;
  shortDescription?: string;
  fullDescription?: string;
  turnaround?: string;
}

export interface SuccessStory {
  id: string;
  studentName: string;
  studentPhoto: string;
  previousEducation: string;
  cgpa: string;
  country: string;
  countrySlug: string;
  university: string;
  universitySlug: string;
  program: string;
  degreeLevel: 'Bachelors' | 'Masters' | 'PhD' | 'Diploma';
  visaResult: string;
  visaGrantedDate: string;
  intake: string;
  scholarshipAmount?: string;
  testimonial: string;
  rating: number;
  featured?: boolean;
  // Optional CMS extensions
  name?: string;
  image?: string;
  visaGrantTime?: string;
  scholarship?: string;
  quote?: string;
  published?: boolean;
  videoUrl?: string;
  gender?: 'man' | 'woman' | 'male' | 'female' | string;
}

export interface VideoTestimonial {
  id: string;
  studentName: string;
  university: string;
  country: string;
  program: string;
  thumbnailUrl: string;
  videoEmbedUrl: string;
  duration: string;
  quote: string;
  visaGrantedYear: string;
  // Optional CMS extensions
  title?: string;
  destination?: string;
  thumbnail?: string;
  embedUrl?: string;
  category?: string;
  featured?: boolean;
  published?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Study Abroad' | 'Scholarships' | 'Visa Updates' | 'University Guides' | 'IELTS' | 'Student Tips' | 'Country Guides';
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  coverImage: string;
  tags: string[];
  featured?: boolean;
  // Optional CMS extensions
  publishedDate?: string;
  published?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Admissions' | 'Visa' | 'Scholarships' | 'IELTS' | 'Fees' | 'Universities' | 'Accommodation' | 'Applications';
  order?: number;
  published?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  experience: string;
  credentials: string[];
  image: string;
  bio: string;
  specializations: string[];
  order?: number;
  active?: boolean;
  specialization?: string;
}
