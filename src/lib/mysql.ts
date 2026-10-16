import mysql from 'mysql2/promise';
import { hashPassword, verifyPassword } from './auth';
import { countries as initialCountries } from '@/data/countries';
import { universities as initialUniversities } from '@/data/universities';
import { services as initialServices } from '@/data/services';
import { successStories as initialStories, videoTestimonials as initialVideos } from '@/data/successStories';
import { blogPosts as initialBlogPosts } from '@/data/blogPosts';
import { teamMembers as initialTeam } from '@/data/team';
import { faqs as initialFaqs } from '@/data/faqs';
import { initialVisaSuccessItems } from '@/data/visaSuccess';
import { initialReviews } from '@/data/reviews';

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fccglobal_cms',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

declare global {
  var __mysql_pool: mysql.Pool | undefined;
}

let isInitialized = false;
let initPromise: Promise<boolean> | null = null;
let mySqlAvailable = false;
let lastMySQLCheck = 0;
let hasLoggedNotice = false;
const CHECK_COOLDOWN_MS = 25000;

export function getPool(): mysql.Pool {
  if (!global.__mysql_pool) {
    global.__mysql_pool = mysql.createPool(DB_CONFIG);
  }
  return global.__mysql_pool;
}

export async function checkMySQLConnectivity(): Promise<boolean> {
  const now = Date.now();
  if (mySqlAvailable && isInitialized) return true;
  if (lastMySQLCheck > 0 && now - lastMySQLCheck < CHECK_COOLDOWN_MS) {
    return mySqlAvailable;
  }
  lastMySQLCheck = now;

  try {
    const conn = await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      database: DB_CONFIG.database,
      connectTimeout: 1200,
    });
    await conn.ping();
    await conn.end();
    mySqlAvailable = true;
    hasLoggedNotice = false;
    return true;
  } catch {
    mySqlAvailable = false;
    if (!hasLoggedNotice) {
      console.log('[Database Info] XAMPP MySQL is currently stopped. Seamlessly running in resilient local JSON storage mode.');
      hasLoggedNotice = true;
    }
    return false;
  }
}

export async function initDatabase(): Promise<boolean> {
  if (isInitialized) return true;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const isOnline = await checkMySQLConnectivity();
      if (!isOnline) {
        return false;
      }

      const p = getPool();
    // 1. Users Table (Highly Secure Authentication)
    await p.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(191) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('super_admin', 'editor', 'counselor') NOT NULL DEFAULT 'counselor',
        avatar VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Leads CRM Table
    await p.execute(`
      CREATE TABLE IF NOT EXISTS leads (
        id VARCHAR(100) PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        current_country VARCHAR(100),
        target_country VARCHAR(100) NOT NULL,
        study_level VARCHAR(100) NOT NULL,
        program VARCHAR(255),
        academic_score VARCHAR(255),
        english_test VARCHAR(255),
        message TEXT,
        source_page VARCHAR(255),
        status ENUM('new', 'contacted', 'follow_up', 'qualified', 'converted', 'closed') DEFAULT 'new',
        notes TEXT,
        assigned_to VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Appointments Table
    await p.execute(`
      CREATE TABLE IF NOT EXISTS appointments (
        id VARCHAR(100) PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        whatsapp VARCHAR(100),
        target_country VARCHAR(100) NOT NULL,
        study_level VARCHAR(100) NOT NULL,
        consultation_type VARCHAR(255) NOT NULL,
        preferred_date VARCHAR(50) NOT NULL,
        preferred_time VARCHAR(50) NOT NULL,
        message TEXT,
        status ENUM('pending', 'confirmed', 'rescheduled', 'completed', 'cancelled') DEFAULT 'pending',
        notes TEXT,
        meeting_link VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_date (preferred_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. Countries Table
    await p.execute(`
      CREATE TABLE IF NOT EXISTS countries (
        id VARCHAR(100) PRIMARY KEY,
        slug VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        flag VARCHAR(50),
        code VARCHAR(10),
        region VARCHAR(50),
        hero_image VARCHAR(500),
        tagline VARCHAR(255),
        overview TEXT,
        why_study LONGTEXT,
        popular_courses LONGTEXT,
        average_tuition VARCHAR(100),
        living_costs VARCHAR(100),
        currency VARCHAR(50),
        intakes LONGTEXT,
        post_study_work VARCHAR(255),
        visa_success_rate VARCHAR(50),
        work_while_studying VARCHAR(255),
        top_university_names LONGTEXT,
        scholarships_overview TEXT,
        visa_requirements LONGTEXT,
        post_study_opportunities LONGTEXT,
        application_deadlines VARCHAR(255),
        sort_order INT DEFAULT 1,
        published BOOLEAN DEFAULT TRUE,
        seo_title VARCHAR(255),
        seo_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_slug (slug),
        INDEX idx_published (published)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. Universities Table
    await p.execute(`
      CREATE TABLE IF NOT EXISTS universities (
        id VARCHAR(100) PRIMARY KEY,
        slug VARCHAR(150) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        country VARCHAR(100) NOT NULL,
        country_slug VARCHAR(100),
        city VARCHAR(100),
        world_rank INT,
        ranking_badge VARCHAR(100),
        acceptance_rate VARCHAR(50),
        logo VARCHAR(500),
        image VARCHAR(500),
        overview TEXT,
        tuition LONGTEXT,
        living_cost_estimate VARCHAR(100),
        popular_programs LONGTEXT,
        study_fields LONGTEXT,
        entry_requirements LONGTEXT,
        scholarships LONGTEXT,
        intakes LONGTEXT,
        highlights LONGTEXT,
        official_rep BOOLEAN DEFAULT TRUE,
        featured BOOLEAN DEFAULT FALSE,
        sort_order INT DEFAULT 1,
        published BOOLEAN DEFAULT TRUE,
        website VARCHAR(500),
        seo_title VARCHAR(255),
        seo_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_slug (slug),
        INDEX idx_country (country),
        INDEX idx_published (published)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 6. Services Table
    await p.execute(`
      CREATE TABLE IF NOT EXISTS services (
        id VARCHAR(100) PRIMARY KEY,
        slug VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        short_desc TEXT,
        full_desc TEXT,
        icon VARCHAR(100),
        benefits LONGTEXT,
        deliverables LONGTEXT,
        target_audience VARCHAR(255),
        turnaround_time VARCHAR(100),
        sort_order INT DEFAULT 1,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_slug (slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 7. Success Stories Table
    await p.execute(`
      CREATE TABLE IF NOT EXISTS success_stories (
        id VARCHAR(100) PRIMARY KEY,
        student_name VARCHAR(255) NOT NULL,
        student_photo VARCHAR(500),
        previous_education VARCHAR(255),
        cgpa VARCHAR(100),
        country VARCHAR(100),
        country_slug VARCHAR(100),
        university VARCHAR(255),
        university_slug VARCHAR(150),
        program VARCHAR(255),
        degree_level VARCHAR(100),
        visa_result VARCHAR(255),
        visa_granted_date VARCHAR(100),
        intake VARCHAR(100),
        scholarship_amount VARCHAR(100),
        testimonial TEXT,
        rating INT DEFAULT 5,
        featured BOOLEAN DEFAULT FALSE,
        published BOOLEAN DEFAULT TRUE,
        video_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_featured (featured)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 8. Videos Table
    await p.execute(`
      CREATE TABLE IF NOT EXISTS videos (
        id VARCHAR(100) PRIMARY KEY,
        student_name VARCHAR(255),
        university VARCHAR(255),
        country VARCHAR(100),
        program VARCHAR(255),
        thumbnail_url VARCHAR(500),
        video_embed_url VARCHAR(500) NOT NULL,
        duration VARCHAR(50),
        quote TEXT,
        visa_granted_year VARCHAR(50),
        category VARCHAR(100),
        featured BOOLEAN DEFAULT FALSE,
        published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 9. Blog Posts Table
    await p.execute(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id VARCHAR(100) PRIMARY KEY,
        slug VARCHAR(150) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT,
        content LONGTEXT NOT NULL,
        category VARCHAR(100),
        author LONGTEXT,
        published_at VARCHAR(100),
        read_time VARCHAR(50),
        cover_image VARCHAR(500),
        tags LONGTEXT,
        featured BOOLEAN DEFAULT FALSE,
        published BOOLEAN DEFAULT TRUE,
        seo_title VARCHAR(255),
        seo_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_slug (slug),
        INDEX idx_category (category)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 10. Team Members Table
    await p.execute(`
      CREATE TABLE IF NOT EXISTS team_members (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        experience VARCHAR(100),
        credentials LONGTEXT,
        image VARCHAR(500),
        bio TEXT,
        specializations LONGTEXT,
        sort_order INT DEFAULT 1,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 11. FAQs Table
    await p.execute(`
      CREATE TABLE IF NOT EXISTS faqs (
        id VARCHAR(100) PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        category VARCHAR(100),
        sort_order INT DEFAULT 1,
        published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 12. Media Library Table
    await p.execute(`
      CREATE TABLE IF NOT EXISTS media (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        url VARCHAR(500) NOT NULL,
        category VARCHAR(100),
        size_bytes BIGINT,
        mime_type VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 12b. Persistent Media Binary Files Table (LONGBLOB)
    await p.execute(`
      CREATE TABLE IF NOT EXISTS media_files (
        id VARCHAR(100) PRIMARY KEY,
        mime_type VARCHAR(100),
        size_bytes INT,
        data LONGBLOB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 13. Custom & Legal Pages Table
    await p.execute(`
      CREATE TABLE IF NOT EXISTS custom_pages (
        id VARCHAR(100) PRIMARY KEY,
        slug VARCHAR(150) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        hero_image VARCHAR(500),
        content LONGTEXT NOT NULL,
        published BOOLEAN DEFAULT TRUE,
        seo_title VARCHAR(255),
        seo_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_slug (slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 14. CMS Settings Table (Key-Value)
    await p.execute(`
      CREATE TABLE IF NOT EXISTS cms_settings (
        key_name VARCHAR(100) PRIMARY KEY,
        value_json LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 15. Visa Success Showcase Table
    await p.execute(`
      CREATE TABLE IF NOT EXISTS visa_success (
        id VARCHAR(100) PRIMARY KEY,
        student_name VARCHAR(255) NOT NULL,
        student_photo VARCHAR(500),
        visa_letter_image VARCHAR(500) NOT NULL,
        country VARCHAR(100) NOT NULL,
        country_code VARCHAR(10),
        country_slug VARCHAR(100),
        university VARCHAR(255) NOT NULL,
        program VARCHAR(255) NOT NULL,
        intake VARCHAR(100),
        visa_type VARCHAR(255),
        approval_days VARCHAR(100),
        grant_date VARCHAR(100),
        testimonial TEXT,
        featured BOOLEAN DEFAULT TRUE,
        published BOOLEAN DEFAULT TRUE,
        show_on_homepage BOOLEAN DEFAULT FALSE,
        sort_order INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_country (country),
        INDEX idx_published (published)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    try {
      await p.execute('ALTER TABLE visa_success ADD COLUMN show_on_homepage BOOLEAN DEFAULT FALSE');
    } catch {}

    // 16. Student Reviews Table (Persistent Verified Reviews & Ratings)
    await p.execute(`
      CREATE TABLE IF NOT EXISTS student_reviews (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        rating INT DEFAULT 5,
        country VARCHAR(255),
        country_slug VARCHAR(255),
        university VARCHAR(255),
        university_slug VARCHAR(255),
        program VARCHAR(255),
        comment TEXT,
        status VARCHAR(50) DEFAULT 'approved',
        published BOOLEAN DEFAULT TRUE,
        show_on_home BOOLEAN DEFAULT TRUE,
        gender VARCHAR(20) DEFAULT 'man',
        avatar TEXT,
        intake VARCHAR(100),
        verified_student BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_published (published),
        INDEX idx_show_on_home (show_on_home),
        INDEX idx_university_slug (university_slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Ensure student_reviews has default initial reviews if empty
    try {
      const [reviewCount]: any = await p.execute('SELECT COUNT(*) as count FROM student_reviews');
      if (reviewCount && reviewCount[0]?.count === 0 && initialReviews && initialReviews.length > 0) {
        for (const r of initialReviews) {
          await p.execute(
            `INSERT IGNORE INTO student_reviews (
              id, name, email, rating, country, country_slug, university, university_slug,
              program, comment, status, published, show_on_home, gender, avatar, intake,
              verified_student, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              r.id, r.name, r.email || null, r.rating || 5, r.country || null, r.countrySlug || null,
              r.university || null, r.universitySlug || null, r.program || null, r.comment || '',
              r.status || 'approved', r.published ? 1 : 0, r.showOnHome ? 1 : 0, r.gender || 'man',
              r.avatar || null, r.intake || 'Fall 2025', r.verifiedStudent ? 1 : 0,
              r.createdAt ? new Date(r.createdAt) : new Date(),
            ]
          );
        }
      }
    } catch {}

    // Check if initial seeding is needed
    const [userRows]: any = await p.execute('SELECT COUNT(*) as count FROM users');
    if (userRows[0].count === 0) {
      await seedDatabase(p);
    }

    isInitialized = true;
    mySqlAvailable = true;
    return true;
  } catch (error: any) {
    isInitialized = false;
    mySqlAvailable = false;
    return false;
  } finally {
    initPromise = null;
  }
})();

  return initPromise;
}

async function seedDatabase(p: mysql.Pool) {
  console.log('Seeding XAMPP MySQL database with initial data...');

  // 1. Seed Admin Users (Secure Password Hashing)
  const defaultPass = hashPassword('admin123');
  await p.execute(
    `INSERT INTO users (id, name, email, password_hash, role, avatar) VALUES 
     (?, ?, ?, ?, ?, ?),
     (?, ?, ?, ?, ?, ?),
     (?, ?, ?, ?, ?, ?)`,
    [
      'usr_super_admin', 'Dr. Evelyn Montgomery', 'admin@fccglobaleducation.com', defaultPass, 'super_admin', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200',
      'usr_editor', 'Marcus Sterling', 'editor@fccglobaleducation.com', defaultPass, 'editor', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200',
      'usr_counselor', 'Priya Sharma', 'counselor@fccglobaleducation.com', defaultPass, 'counselor', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200'
    ]
  );

  // 2. Seed Countries
  for (let idx = 0; idx < initialCountries.length; idx++) {
    const c = initialCountries[idx];
    await p.execute(
      `INSERT INTO countries (
        id, slug, name, flag, code, region, hero_image, tagline, overview,
        why_study, popular_courses, average_tuition, living_costs, currency,
        intakes, post_study_work, visa_success_rate, work_while_studying,
        top_university_names, scholarships_overview, visa_requirements,
        post_study_opportunities, application_deadlines, sort_order, published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        c.id, c.slug, c.name, c.flag, c.code, c.region, c.heroImage, c.tagline, c.overview,
        JSON.stringify(c.whyStudy || []),
        JSON.stringify(c.popularCourses || []),
        c.averageTuition, c.livingCosts, c.currency,
        JSON.stringify(c.intakes || []),
        c.postStudyWork, c.visaSuccessRate, c.workWhileStudying,
        JSON.stringify(c.topUniversityNames || []),
        c.scholarshipsOverview,
        JSON.stringify(c.visaRequirements || []),
        JSON.stringify(c.postStudyOpportunities || []),
        c.applicationDeadlines,
        idx + 1,
        true
      ]
    );
  }

  // 3. Seed Universities
  for (let idx = 0; idx < initialUniversities.length; idx++) {
    const u = initialUniversities[idx];
    await p.execute(
      `INSERT INTO universities (
        id, slug, name, country, country_slug, city, world_rank, ranking_badge,
        acceptance_rate, logo, image, overview, tuition, living_cost_estimate,
        popular_programs, study_fields, entry_requirements, scholarships, intakes,
        highlights, official_rep, featured, sort_order, published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        u.id, u.slug, u.name, u.country, u.countrySlug, u.city, u.worldRank, u.rankingBadge,
        u.acceptanceRate, u.logo, u.image, u.overview,
        JSON.stringify(u.tuition || {}),
        u.livingCostEstimate,
        JSON.stringify(u.popularPrograms || []),
        JSON.stringify(u.studyFields || []),
        JSON.stringify(u.entryRequirements || {}),
        JSON.stringify(u.scholarships || []),
        JSON.stringify(u.intakes || []),
        JSON.stringify(u.highlights || []),
        u.officialRep,
        idx < 6,
        idx + 1,
        true
      ]
    );
  }

  // 4. Seed Services
  for (let idx = 0; idx < initialServices.length; idx++) {
    const s = initialServices[idx];
    await p.execute(
      `INSERT INTO services (
        id, slug, title, short_desc, full_desc, icon, benefits, deliverables,
        target_audience, turnaround_time, sort_order, active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        s.id, s.slug, s.title, s.shortDesc, s.fullDesc, s.icon,
        JSON.stringify(s.benefits || []),
        JSON.stringify(s.deliverables || []),
        s.targetAudience, s.turnaroundTime, idx + 1, true
      ]
    );
  }

  // 5. Seed Success Stories
  for (const st of initialStories) {
    await p.execute(
      `INSERT INTO success_stories (
        id, student_name, student_photo, previous_education, cgpa, country,
        country_slug, university, university_slug, program, degree_level,
        visa_result, visa_granted_date, intake, scholarship_amount, testimonial,
        rating, featured, published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        st.id, st.studentName, st.studentPhoto, st.previousEducation, st.cgpa,
        st.country, st.countrySlug, st.university, st.universitySlug, st.program,
        st.degreeLevel, st.visaResult, st.visaGrantedDate, st.intake,
        st.scholarshipAmount || null, st.testimonial, st.rating, st.featured || false, true
      ]
    );
  }

  // 6. Seed Videos
  for (const v of initialVideos) {
    await p.execute(
      `INSERT INTO videos (
        id, student_name, university, country, program, thumbnail_url,
        video_embed_url, duration, quote, visa_granted_year, category, featured, published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        v.id, v.studentName, v.university, v.country, v.program, v.thumbnailUrl,
        v.videoEmbedUrl, v.duration, v.quote, v.visaGrantedYear, 'Success Stories', true, true
      ]
    );
  }

  // 7. Seed Blog Posts
  for (const b of initialBlogPosts) {
    await p.execute(
      `INSERT INTO blog_posts (
        id, slug, title, excerpt, content, category, author, published_at,
        read_time, cover_image, tags, featured, published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        b.id, b.slug, b.title, b.excerpt, b.content, b.category,
        JSON.stringify(b.author || {}),
        b.publishedAt, b.readTime, b.coverImage,
        JSON.stringify(b.tags || []),
        b.featured || false, true
      ]
    );
  }

  // 8. Seed Team Members
  for (let idx = 0; idx < initialTeam.length; idx++) {
    const tm = initialTeam[idx];
    await p.execute(
      `INSERT INTO team_members (
        id, name, role, experience, credentials, image, bio, specializations, sort_order, active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tm.id, tm.name, tm.role, tm.experience,
        JSON.stringify(tm.credentials || []),
        tm.image, tm.bio,
        JSON.stringify(tm.specializations || []),
        idx + 1, true
      ]
    );
  }

  // 9. Seed FAQs
  for (let idx = 0; idx < initialFaqs.length; idx++) {
    const f = initialFaqs[idx];
    await p.execute(
      `INSERT INTO faqs (id, question, answer, category, sort_order, published) VALUES (?, ?, ?, ?, ?, ?)`,
      [f.id, f.question, f.answer, f.category, idx + 1, true]
    );
  }

  // 10. Seed Custom Legal Pages
  await p.execute(
    `INSERT INTO custom_pages (id, slug, title, hero_image, content, published, seo_title, seo_description) VALUES 
     (?, ?, ?, ?, ?, ?, ?, ?),
     (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'page-privacy', 'privacy-policy', 'Privacy Policy',
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200',
      '### FCC Global Education - Privacy Policy\n\nWe prioritize student privacy and comply with global GDPR regulations.',
      true, 'Privacy Policy | FCC Global Education', 'Official privacy policy of FCC Global Education Consultants.',
      'page-terms', 'terms-and-conditions', 'Terms & Conditions',
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200',
      '### Terms & Conditions\n\nAll advisory and admissions consultancy terms of engagement.',
      true, 'Terms & Conditions | FCC Global Education', 'Official terms and conditions of FCC Global Education.'
    ]
  );

  // 11. Seed CMS Settings (General, Social, Email, Appointments, SEO, Navigation, Footer, Homepage)
  const defaultGeneral = {
    companyName: 'FCC Global Education Consultants',
    tagline: 'World-Class Study Abroad Counseling & Visa Guidance',
    logoUrl: '/logo.svg',
    phone: '+44 (0) 20 7946 0912',
    whatsapp: '+447946091200',
    email: 'admissions@fccglobaleducation.com',
    address: 'Berkeley Square House, Mayfair, London W1J 6BD, United Kingdom',
    officeHours: 'Monday - Friday: 09:00 AM - 06:00 PM GMT',
    googleMapsUrl: 'https://maps.google.com/?q=Berkeley+Square+House+London',
    websiteUrl: 'https://fccglobaleducation.com',
    shortDescription: 'Premier international education consultancy facilitating admissions to top-ranked institutions across 12 countries.',
    copyrightText: '© 2026 FCC Global Education Consultants. All rights reserved.',
  };

  const defaultNavigation = {
    items: [
      { label: 'Destinations', href: '/destinations', badge: '12 Countries' },
      { label: 'Universities', href: '/universities' },
      { label: 'Services', href: '/services' },
      { label: 'Student Reviews', href: '/success-stories' },
      { label: 'Visa Success', href: '/visa-success' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    ctaButton: {
      text: 'Book Free Consultation',
      href: '/book-appointment',
    },
  };

  const defaultFooter = {
    companyDescription: 'FCC Global Education is a premier global education consultancy guiding students toward top-tier university placements and visa approvals.',
    disclaimer: 'Official partner and authorized recruitment representative for leading institutions in the UK, USA, Canada, Australia, and Europe.',
    copyright: '© 2026 FCC Global Education Consultants. All rights reserved.',
    newsletterText: 'Subscribe to get bi-weekly university deadline reminders and scholarship alerts.',
    quickLinks: [
      { name: 'About FCC Global Education', href: '/about' },
      { name: 'Admissions Services', href: '/services' },
      { name: 'Student Visa Guidance', href: '/visa-success' },
      { name: 'Success Stories', href: '/success-stories' },
      { name: 'FAQ & Help', href: '/faq' },
      { name: 'Book Consultation', href: '/book-appointment' },
    ],
    destinations: [
      { name: 'Study in UK', href: '/destinations/uk' },
      { name: 'Study in USA', href: '/destinations/usa' },
      { name: 'Study in Canada', href: '/destinations/canada' },
      { name: 'Study in Australia', href: '/destinations/australia' },
      { name: 'Study in Germany', href: '/destinations/germany' },
      { name: 'Study in Ireland', href: '/destinations/ireland' },
    ],
    services: [
      { name: 'Profile Evaluation', href: '/services#profile-evaluation' },
      { name: 'University Profiling', href: '/services#university-selection' },
      { name: 'SOP & Essay Editing', href: '/services#sop-editing' },
      { name: 'Visa Documentation', href: '/services#visa-guidance' },
      { name: 'Mock Interviews', href: '/services#mock-interviews' },
      { name: 'Pre-Departure Briefing', href: '/services#pre-departure' },
    ],
  };

  const defaultHomepage = {
    hero: {
      badge: 'British Council & AIRC Certified Counselors',
      title: 'Your Gateway to Top Global Universities',
      subtitle: 'Personalized university shortlisting, fast-track offers, scholarship guidance, and 98.6% visa approval rate across 12 countries.',
      primaryCtaText: 'Book Free Consultation',
      primaryCtaUrl: '/book-appointment',
      secondaryCtaUrl: '/destinations',
      heroImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200',
    },
    stats: [
      { number: '12,500+', label: 'Students Placed' },
      { number: '98.6%', label: 'Visa Approval Rate' },
      { number: '100+', label: 'Partner Universities' },
      { number: '$18M+', label: 'Scholarships Secured' },
    ],
    sections: [
      { id: 'hero', title: 'Hero Banner', enabled: true, order: 1 },
      { id: 'ticker', title: 'University Partner Ticker', enabled: true, order: 2 },
      { id: 'destinations', title: 'Top Study Destinations', enabled: true, order: 3 },
      { id: 'calculator', title: 'Interactive Admission Calculator', enabled: true, order: 4 },
      { id: 'universities', title: 'Partner Universities Showcase', enabled: true, order: 5 },
      { id: 'services', title: 'Our Core Counseling Services', enabled: true, order: 6 },
      { id: 'stories', title: 'Verified Student Success Stories', enabled: true, order: 7 },
      { id: 'videos', title: 'Video Reviews & Reactions', enabled: true, order: 8 },
      { id: 'stats', title: 'Key Statistics & Milestones', enabled: true, order: 9 },
      { id: 'faq', title: 'Frequently Asked Questions', enabled: true, order: 10 },
      { id: 'cta', title: 'Final Consultation CTA', enabled: true, order: 11 },
    ],
  };

  const defaultSEO = {
    defaultTitle: 'FCC Global Education | Study Abroad Consultants',
    titleTemplate: '%s | FCC Global Education',
    defaultDescription: 'Premier international education consultancy providing university admissions, scholarship guidance, and 98.6% student visa approvals.',
    keywords: ['study abroad', 'overseas education', 'student visa', 'university admissions', 'study in uk', 'study in usa'],
    ogImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200',
    twitterImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200',
    googleSiteVerification: '',
    googleAnalyticsId: '',
  };

  const defaultAppointments = {
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHoursStart: '10:00 AM',
    workingHoursEnd: '06:00 PM',
    slotDurationMinutes: 30,
    timeZone: 'Europe/London (GMT)',
    defaultMeetingLink: 'https://meet.google.com/aur-aglb-edu',
    consultationTypes: [
      'Free Initial Profile Evaluation',
      'University Selection & Profiling',
      'Visa & Compliance Consultation',
      'Scholarship & Financial Aid Strategy'
    ],
  };

  const defaultEmail = {
    senderName: 'FCC Global Education Admissions',
    senderEmail: 'admissions@fccglobaleducation.com',
    replyToEmail: 'support@fccglobaleducation.com',
    smtpHost: 'smtp.mailtrap.io',
    smtpPort: 587,
    adminNotificationEmail: 'admin@fccglobaleducation.com',
  };

  const defaultSocial = {
    facebook: 'https://facebook.com/fccglobaledu',
    instagram: 'https://instagram.com/fccglobaledu',
    youtube: 'https://youtube.com/@fccglobaledu',
    tiktok: 'https://tiktok.com/@fccglobaledu',
    linkedin: 'https://linkedin.com/company/fccglobaledu',
    whatsapp: 'https://wa.me/447946091200',
    twitter: 'https://x.com/fccglobaledu',
  };

  await p.execute('INSERT INTO cms_settings (key_name, value_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE value_json = VALUES(value_json)', ['general', JSON.stringify(defaultGeneral)]);
  await p.execute('INSERT INTO cms_settings (key_name, value_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE value_json = VALUES(value_json)', ['navigation', JSON.stringify(defaultNavigation)]);
  await p.execute('INSERT INTO cms_settings (key_name, value_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE value_json = VALUES(value_json)', ['footer', JSON.stringify(defaultFooter)]);
  await p.execute('INSERT INTO cms_settings (key_name, value_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE value_json = VALUES(value_json)', ['homepage', JSON.stringify(defaultHomepage)]);
  await p.execute('INSERT INTO cms_settings (key_name, value_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE value_json = VALUES(value_json)', ['seo', JSON.stringify(defaultSEO)]);
  await p.execute('INSERT INTO cms_settings (key_name, value_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE value_json = VALUES(value_json)', ['appointments', JSON.stringify(defaultAppointments)]);
  await p.execute('INSERT INTO cms_settings (key_name, value_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE value_json = VALUES(value_json)', ['email', JSON.stringify(defaultEmail)]);
  await p.execute('INSERT INTO cms_settings (key_name, value_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE value_json = VALUES(value_json)', ['social', JSON.stringify(defaultSocial)]);

  // 12. Seed Visa Success Showcase
  for (let idx = 0; idx < initialVisaSuccessItems.length; idx++) {
    const vs = initialVisaSuccessItems[idx];
    await p.execute(
      `INSERT INTO visa_success (
        id, student_name, student_photo, visa_letter_image, country, country_code, country_slug,
        university, program, intake, visa_type, approval_days, grant_date, testimonial,
        featured, published, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        vs.id, vs.studentName, vs.studentPhoto || null, vs.visaLetterImage, vs.country,
        vs.countryCode || null, vs.countrySlug || null, vs.university, vs.program,
        vs.intake || null, vs.visaType || null, vs.approvalDays || null, vs.grantDate || null,
        vs.testimonial || null, vs.featured ?? true, vs.published ?? true, vs.order || idx + 1
      ]
    );
  }

  // 13. Seed Student Reviews
  for (const r of initialReviews) {
    await p.execute(
      `INSERT INTO student_reviews (
        id, name, email, rating, country, country_slug, university, university_slug,
        program, comment, status, published, show_on_home, gender, avatar, intake,
        verified_student
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name), rating = VALUES(rating), comment = VALUES(comment)`,
      [
        r.id, r.name, r.email || null, r.rating || 5, r.country || null, r.countrySlug || null,
        r.university || null, r.universitySlug || null, r.program || null, r.comment || '',
        r.status || 'approved', r.published ? 1 : 0, r.showOnHome ? 1 : 0, r.gender || 'man',
        r.avatar || null, r.intake || 'Fall 2025', r.verifiedStudent ? 1 : 0
      ]
    );
  }

  console.log('XAMPP MySQL database successfully seeded!');
}

function safeJsonParse<T>(val: any, fallback: T): T {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

export function normalizeNavigationSettings(nav: any) {
  if (!nav || typeof nav !== 'object') return nav;
  const clone = { ...nav };
  if (Array.isArray(clone.items)) {
    let items = clone.items
      .filter((item: any) => item.href !== '/blog' && !item.href?.startsWith('/blog') && item.label?.toLowerCase() !== 'blog')
      .map((it: any) => {
        const item = { ...it };
        if (item.href === '/success-stories' || item.label?.toLowerCase() === 'student reviews' || item.label?.toLowerCase() === 'success stories') {
          item.label = 'Student Reviews';
          item.href = '/success-stories';
          delete item.badge;
        }
        if (item.badge && (item.badge.includes('98%') || item.badge.toLowerCase().includes('visa rate'))) {
          delete item.badge;
        }
        return item;
      });

    const hasVisaSuccess = items.some((it: any) => it.href === '/visa-success' || it.label?.toLowerCase() === 'visa success');
    if (!hasVisaSuccess) {
      const reviewIdx = items.findIndex((it: any) => it.href === '/success-stories' || it.label === 'Student Reviews');
      const visaItem = { label: 'Visa Success', href: '/visa-success', enabled: true };
      if (reviewIdx !== -1) {
        items.splice(reviewIdx + 1, 0, visaItem);
      } else {
        const aboutIdx = items.findIndex((it: any) => it.href === '/about' || it.label === 'About Us');
        if (aboutIdx !== -1) {
          items.splice(aboutIdx, 0, visaItem);
        } else {
          items.push(visaItem);
        }
      }
    } else {
      items = items.map((it: any) => {
        if (it.href === '/visa-success' || it.label?.toLowerCase() === 'visa success') {
          return { ...it, label: 'Visa Success', href: '/visa-success', enabled: true };
        }
        return it;
      });
    }

    clone.items = items;
  }
  return clone;
}

export async function verifyUserCredentialsMySQL(email: string, password: string) {
  try {
    const ok = await initDatabase();
    if (!ok) return null;
    const p = getPool();
    const [rows]: any = await p.execute(
      'SELECT id, name, email, password_hash, role, avatar FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1',
      [email.trim()]
    );
    if (!rows || rows.length === 0) return null;
    const userRow = rows[0];
    const isMatch = verifyPassword(password, userRow.password_hash);
    if (!isMatch) return null;
    return {
      id: userRow.id,
      name: userRow.name,
      email: userRow.email,
      role: userRow.role,
      avatar: userRow.avatar,
    };
  } catch (err) {
    console.error('MySQL authentication error:', err);
    return null;
  }
}

export async function getUserByIdMySQL(id: string) {
  try {
    const ok = await initDatabase();
    if (!ok) return null;
    const p = getPool();
    const [rows]: any = await p.execute(
      'SELECT id, name, email, role, avatar FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    if (!rows || rows.length === 0) return null;
    return rows[0];
  } catch (err) {
    console.error('MySQL getUserById error:', err);
    return null;
  }
}

export async function saveLeadToMySQL(lead: any) {
  try {
    const ok = await initDatabase();
    if (!ok) return false;
    const p = getPool();
    await p.execute(
      `INSERT INTO leads (
        id, full_name, email, phone, current_country, target_country, study_level,
        program, academic_score, english_test, message, source_page, status, notes, assigned_to
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        full_name = VALUES(full_name),
        email = VALUES(email),
        phone = VALUES(phone),
        current_country = VALUES(current_country),
        target_country = VALUES(target_country),
        study_level = VALUES(study_level),
        program = VALUES(program),
        academic_score = VALUES(academic_score),
        english_test = VALUES(english_test),
        message = VALUES(message),
        source_page = VALUES(source_page),
        status = VALUES(status),
        notes = VALUES(notes),
        assigned_to = VALUES(assigned_to)`,
      [
        lead.id || `lead_${Date.now()}`,
        lead.fullName || lead.name || 'Anonymous Lead',
        lead.email || 'no-email@provided.com',
        lead.phone || 'N/A',
        lead.currentCountry || null,
        lead.targetCountry || 'United Kingdom',
        lead.studyLevel || 'Masters',
        lead.program || null,
        lead.academicScore || null,
        lead.englishTest || null,
        lead.message || null,
        lead.sourcePage || null,
        lead.status || 'new',
        lead.notes || null,
        lead.assignedTo || null,
      ]
    );
    return true;
  } catch (err) {
    console.error('Error saving lead to MySQL:', err);
    return false;
  }
}

export async function saveAppointmentToMySQL(apt: any) {
  try {
    const ok = await initDatabase();
    if (!ok) return false;
    const p = getPool();
    await p.execute(
      `INSERT INTO appointments (
        id, full_name, email, phone, whatsapp, target_country, study_level,
        consultation_type, preferred_date, preferred_time, message, status, notes, meeting_link
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        full_name = VALUES(full_name),
        email = VALUES(email),
        phone = VALUES(phone),
        whatsapp = VALUES(whatsapp),
        target_country = VALUES(target_country),
        study_level = VALUES(study_level),
        consultation_type = VALUES(consultation_type),
        preferred_date = VALUES(preferred_date),
        preferred_time = VALUES(preferred_time),
        message = VALUES(message),
        status = VALUES(status),
        notes = VALUES(notes),
        meeting_link = VALUES(meeting_link)`,
      [
        apt.id || `apt_${Date.now()}`,
        apt.fullName || apt.studentName || 'Anonymous Student',
        apt.email || 'no-email@provided.com',
        apt.phone || 'N/A',
        apt.whatsapp || null,
        apt.targetCountry || apt.country || 'United Kingdom',
        apt.studyLevel || 'Masters',
        apt.consultationType || 'Free Initial Profile Evaluation',
        apt.preferredDate || apt.date || '2026-10-15',
        apt.preferredTime || apt.time || '10:00 AM',
        apt.message || null,
        apt.status || 'pending',
        apt.notes || null,
        apt.meetingLink || null,
      ]
    );
    return true;
  } catch (err) {
    console.error('Error saving appointment to MySQL:', err);
    return false;
  }
}

export async function loadDataFromMySQL(): Promise<any | null> {
  try {
    const ok = await initDatabase();
    if (!ok) return null;
    const p = getPool();

    const [userRows]: any = await p.execute('SELECT * FROM users');
    const [countryRows]: any = await p.execute('SELECT * FROM countries ORDER BY sort_order ASC');
    const [uniRows]: any = await p.execute('SELECT * FROM universities ORDER BY sort_order ASC');
    const [serviceRows]: any = await p.execute('SELECT * FROM services ORDER BY sort_order ASC');
    const [storyRows]: any = await p.execute('SELECT * FROM success_stories ORDER BY created_at DESC');
    const [videoRows]: any = await p.execute('SELECT * FROM videos ORDER BY created_at DESC');
    const [blogRows]: any = await p.execute('SELECT * FROM blog_posts ORDER BY created_at DESC');
    const [teamRows]: any = await p.execute('SELECT * FROM team_members ORDER BY sort_order ASC');
    const [faqRows]: any = await p.execute('SELECT * FROM faqs ORDER BY sort_order ASC');
    const [leadRows]: any = await p.execute('SELECT * FROM leads ORDER BY created_at DESC');
    const [aptRows]: any = await p.execute('SELECT * FROM appointments ORDER BY created_at DESC');
    const [mediaRows]: any = await p.execute('SELECT * FROM media ORDER BY created_at DESC');
    const [pageRows]: any = await p.execute('SELECT * FROM custom_pages ORDER BY created_at ASC');
    const [visaSuccessRows]: any = await p.execute('SELECT * FROM visa_success ORDER BY sort_order ASC, id ASC');
    const [reviewRows]: any = await p.execute('SELECT * FROM student_reviews ORDER BY created_at DESC, id DESC').catch(() => [[]]);
    const [settingRows]: any = await p.execute('SELECT * FROM cms_settings');

    const result: any = {
      users: userRows.map((r: any) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        passwordHash: r.password_hash,
        role: r.role,
        avatar: r.avatar,
        createdAt: r.created_at?.toISOString ? r.created_at.toISOString() : String(r.created_at || ''),
      })),
      countries: countryRows.map((r: any) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        flag: r.flag,
        code: r.code,
        region: r.region,
        heroImage: r.hero_image,
        tagline: r.tagline,
        overview: r.overview,
        whyStudy: safeJsonParse(r.why_study, []),
        popularCourses: safeJsonParse(r.popular_courses, []),
        averageTuition: r.average_tuition,
        livingCosts: r.living_costs,
        currency: r.currency,
        intakes: safeJsonParse(r.intakes, []),
        postStudyWork: r.post_study_work,
        visaSuccessRate: r.visa_success_rate,
        workWhileStudying: r.work_while_studying,
        topUniversityNames: safeJsonParse(r.top_university_names, []),
        scholarshipsOverview: r.scholarships_overview,
        visaRequirements: safeJsonParse(r.visa_requirements, []),
        postStudyOpportunities: safeJsonParse(r.post_study_opportunities, []),
        applicationDeadlines: r.application_deadlines,
        sortOrder: r.sort_order ?? 1,
        order: r.sort_order ?? 1,
        published: Boolean(r.published),
        seoTitle: r.seo_title,
        seoDescription: r.seo_description,
      })),
      universities: uniRows.map((r: any) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        country: r.country,
        countrySlug: r.country_slug,
        city: r.city,
        worldRank: r.world_rank,
        rankingBadge: r.ranking_badge,
        acceptanceRate: r.acceptance_rate,
        logo: r.logo,
        image: r.image,
        overview: r.overview,
        tuition: safeJsonParse(r.tuition, {}),
        livingCostEstimate: r.living_cost_estimate,
        popularPrograms: safeJsonParse(r.popular_programs, []),
        studyFields: safeJsonParse(r.study_fields, []),
        entryRequirements: safeJsonParse(r.entry_requirements, {}),
        scholarships: safeJsonParse(r.scholarships, []),
        intakes: safeJsonParse(r.intakes, []),
        highlights: safeJsonParse(r.highlights, []),
        officialRep: Boolean(r.official_rep),
        featured: Boolean(r.featured),
        sortOrder: r.sort_order ?? 1,
        order: r.sort_order ?? 1,
        published: Boolean(r.published),
        website: r.website,
        seoTitle: r.seo_title,
        seoDescription: r.seo_description,
      })),
      services: serviceRows.map((r: any) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        shortDesc: r.short_desc,
        fullDesc: r.full_desc,
        icon: r.icon,
        benefits: safeJsonParse(r.benefits, []),
        deliverables: safeJsonParse(r.deliverables, []),
        targetAudience: r.target_audience,
        turnaroundTime: r.turnaround_time,
        sortOrder: r.sort_order,
        active: Boolean(r.active),
      })),
      successStories: storyRows.map((r: any) => ({
        id: r.id,
        studentName: r.student_name,
        studentPhoto: r.student_photo,
        previousEducation: r.previous_education,
        cgpa: r.cgpa,
        country: r.country,
        countrySlug: r.country_slug,
        university: r.university,
        universitySlug: r.university_slug,
        program: r.program,
        degreeLevel: r.degree_level,
        visaResult: r.visa_result,
        visaGrantedDate: r.visa_granted_date,
        intake: r.intake,
        scholarshipAmount: r.scholarship_amount,
        testimonial: r.testimonial,
        rating: r.rating,
        featured: Boolean(r.featured),
        published: Boolean(r.published),
        videoUrl: r.video_url,
      })),
      videos: videoRows.map((r: any) => ({
        id: r.id,
        studentName: r.student_name,
        university: r.university,
        country: r.country,
        program: r.program,
        thumbnailUrl: r.thumbnail_url,
        videoEmbedUrl: r.video_embed_url,
        duration: r.duration,
        quote: r.quote,
        visaGrantedYear: r.visa_granted_year,
        category: r.category,
        featured: Boolean(r.featured),
        published: Boolean(r.published),
      })),
      blogPosts: blogRows.map((r: any) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt,
        content: r.content,
        category: r.category,
        author: safeJsonParse(r.author, {}),
        publishedAt: r.published_at,
        readTime: r.read_time,
        coverImage: r.cover_image,
        tags: safeJsonParse(r.tags, []),
        featured: Boolean(r.featured),
        published: Boolean(r.published),
        seoTitle: r.seo_title,
        seoDescription: r.seo_description,
      })),
      teamMembers: teamRows.map((r: any) => ({
        id: r.id,
        name: r.name,
        role: r.role,
        experience: r.experience,
        credentials: safeJsonParse(r.credentials, []),
        image: r.image,
        bio: r.bio,
        specializations: safeJsonParse(r.specializations, []),
        sortOrder: r.sort_order,
        active: Boolean(r.active),
      })),
      faqs: faqRows.map((r: any) => ({
        id: r.id,
        question: r.question,
        answer: r.answer,
        category: r.category,
        sortOrder: r.sort_order,
        published: Boolean(r.published),
      })),
      leads: leadRows.map((r: any) => ({
        id: r.id,
        fullName: r.full_name,
        email: r.email,
        phone: r.phone,
        currentCountry: r.current_country,
        targetCountry: r.target_country,
        studyLevel: r.study_level,
        program: r.program,
        academicScore: r.academic_score,
        englishTest: r.english_test,
        message: r.message,
        sourcePage: r.source_page,
        status: r.status,
        notes: r.notes,
        assignedTo: r.assigned_to,
        createdAt: r.created_at?.toISOString ? r.created_at.toISOString() : String(r.created_at || ''),
        updatedAt: r.updated_at?.toISOString ? r.updated_at.toISOString() : String(r.updated_at || ''),
      })),
      appointments: aptRows.map((r: any) => ({
        id: r.id,
        fullName: r.full_name,
        email: r.email,
        phone: r.phone,
        whatsapp: r.whatsapp,
        targetCountry: r.target_country,
        studyLevel: r.study_level,
        consultationType: r.consultation_type,
        preferredDate: r.preferred_date,
        preferredTime: r.preferred_time,
        message: r.message,
        status: r.status,
        notes: r.notes,
        meetingLink: r.meeting_link,
        createdAt: r.created_at?.toISOString ? r.created_at.toISOString() : String(r.created_at || ''),
        updatedAt: r.updated_at?.toISOString ? r.updated_at.toISOString() : String(r.updated_at || ''),
      })),
      media: mediaRows.map((r: any) => ({
        id: r.id,
        name: r.name,
        url: r.url,
        category: r.category,
        sizeBytes: Number(r.size_bytes || 0),
        mimeType: r.mime_type,
        createdAt: r.created_at?.toISOString ? r.created_at.toISOString() : String(r.created_at || ''),
      })),
      customPages: pageRows.map((r: any) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        heroImage: r.hero_image,
        content: r.content,
        published: Boolean(r.published),
        seoTitle: r.seo_title,
        seoDescription: r.seo_description,
        updatedAt: r.updated_at?.toISOString ? r.updated_at.toISOString() : String(r.updated_at || ''),
      })),
      visaSuccess: (visaSuccessRows || []).map((r: any) => ({
        id: r.id,
        studentName: r.student_name,
        studentPhoto: r.student_photo,
        visaLetterImage: r.visa_letter_image,
        country: r.country,
        countryCode: r.country_code,
        countrySlug: r.country_slug,
        university: r.university,
        program: r.program,
        intake: r.intake,
        visaType: r.visa_type,
        approvalDays: r.approval_days,
        grantDate: r.grant_date,
        testimonial: r.testimonial,
        featured: Boolean(r.featured),
        published: Boolean(r.published),
        showOnHomepage: Boolean(r.show_on_homepage),
        order: r.sort_order,
        createdAt: r.created_at?.toISOString ? r.created_at.toISOString() : String(r.created_at || ''),
      })),
      reviews: (reviewRows || []).map((r: any) => ({
        id: r.id,
        name: r.name,
        email: r.email || '',
        rating: r.rating || 5,
        country: r.country || 'United Kingdom',
        countrySlug: r.country_slug || 'uk',
        university: r.university || 'General Consultation',
        universitySlug: r.university_slug || 'general',
        program: r.program || undefined,
        comment: r.comment || '',
        status: r.status || 'approved',
        published: Boolean(r.published),
        showOnHome: Boolean(r.show_on_home),
        gender: r.gender || 'man',
        avatar: r.avatar,
        intake: r.intake || 'Fall 2025',
        verifiedStudent: Boolean(r.verified_student),
        createdAt: r.created_at?.toISOString ? r.created_at.toISOString() : String(r.created_at || ''),
      })),
    };

    for (const s of settingRows) {
      const parsed = safeJsonParse(s.value_json, null);
      if (!parsed) continue;
      if (s.key_name === 'general') result.generalSettings = parsed;
      else if (s.key_name === 'navigation') result.navigationSettings = normalizeNavigationSettings(parsed);
      else if (s.key_name === 'footer') result.footerSettings = parsed;
      else if (s.key_name === 'homepage') result.homepageSettings = parsed;
      else if (s.key_name === 'seo') result.seoSettings = parsed;
      else if (s.key_name === 'appointments') result.appointmentSettings = parsed;
      else if (s.key_name === 'email') result.emailSettings = parsed;
      else if (s.key_name === 'social') result.socialLinks = parsed;
      else if (s.key_name === 'visa_success_page') result.visaSuccessPageSettings = parsed;
      else if (s.key_name === 'services_page') result.servicesPageSettings = parsed;
      else if (s.key_name === 'about_page') result.aboutPageSettings = parsed;
      else if (s.key_name === 'subscribers') result.subscribers = parsed;
      else if (s.key_name === 'broadcast_campaigns') result.broadcastCampaigns = parsed;
      else if (s.key_name === 'ai_chat') result.aiChatSettings = parsed;
    }

    return result;
  } catch (err) {
    console.error('Error loading data from MySQL:', err);
    return null;
  }
}

export async function syncTableToMySQL(table: string, data: any) {
  try {
    const ok = await initDatabase();
    if (!ok) return false;
    const p = getPool();

    // 1. Settings tables
    const settingsKeyMap: Record<string, string> = {
      generalSettings: 'general',
      navigationSettings: 'navigation',
      footerSettings: 'footer',
      homepageSettings: 'homepage',
      seoSettings: 'seo',
      appointmentSettings: 'appointments',
      emailSettings: 'email',
      socialLinks: 'social',
      visaSuccessPageSettings: 'visa_success_page',
      servicesPageSettings: 'services_page',
      aboutPageSettings: 'about_page',
      subscribers: 'subscribers',
      broadcastCampaigns: 'broadcast_campaigns',
      aiChatSettings: 'ai_chat',
    };

    if (settingsKeyMap[table]) {
      const toSave = settingsKeyMap[table] === 'navigation' ? normalizeNavigationSettings(data) : data;
      await p.execute(
        'INSERT INTO cms_settings (key_name, value_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE value_json = VALUES(value_json)',
        [settingsKeyMap[table], JSON.stringify(toSave)]
      );
      return true;
    }

    // 2. Leads table
    if (table === 'leads' && Array.isArray(data)) {
      for (const lead of data) {
        await saveLeadToMySQL(lead);
      }
      return true;
    }

    // 3. Appointments table
    if (table === 'appointments' && Array.isArray(data)) {
      const ids = data.map((apt: any) => apt.id).filter(Boolean);
      if (ids.length > 0) {
        await p.query('DELETE FROM appointments WHERE id NOT IN (?)', [ids]);
      } else {
        await p.execute('DELETE FROM appointments');
      }
      for (const apt of data) {
        await saveAppointmentToMySQL(apt);
      }
      return true;
    }

    // 4. Users table
    if (table === 'users' && Array.isArray(data)) {
      const ids = data.map((u: any) => u.id).filter(Boolean);
      if (ids.length > 0) {
        await p.query('DELETE FROM users WHERE id NOT IN (?)', [ids]);
      }
      for (const u of data) {
        await p.execute(
          `INSERT INTO users (id, name, email, password_hash, role, avatar)
           VALUES (?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             name = VALUES(name),
             email = VALUES(email),
             password_hash = COALESCE(VALUES(password_hash), password_hash),
             role = VALUES(role),
             avatar = VALUES(avatar)`,
          [u.id, u.name, u.email, u.passwordHash || null, u.role, u.avatar || null]
        );
      }
      return true;
    }

    // 5. Countries table
    if (table === 'countries' && Array.isArray(data)) {
      const ids = data.map((c: any) => c.id).filter(Boolean);
      if (ids.length > 0) {
        await p.query('DELETE FROM countries WHERE id NOT IN (?)', [ids]);
      }
      for (const c of data) {
        await p.execute(
          `INSERT INTO countries (
            id, slug, name, flag, code, region, hero_image, tagline, overview,
            why_study, popular_courses, average_tuition, living_costs, currency,
            intakes, post_study_work, visa_success_rate, work_while_studying,
            top_university_names, scholarships_overview, visa_requirements,
            post_study_opportunities, application_deadlines, sort_order, published
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            name = VALUES(name), flag = VALUES(flag), code = VALUES(code), region = VALUES(region),
            hero_image = VALUES(hero_image), tagline = VALUES(tagline), overview = VALUES(overview),
            why_study = VALUES(why_study), popular_courses = VALUES(popular_courses),
            average_tuition = VALUES(average_tuition), living_costs = VALUES(living_costs),
            currency = VALUES(currency), intakes = VALUES(intakes), post_study_work = VALUES(post_study_work),
            visa_success_rate = VALUES(visa_success_rate), work_while_studying = VALUES(work_while_studying),
            top_university_names = VALUES(top_university_names), scholarships_overview = VALUES(scholarships_overview),
            visa_requirements = VALUES(visa_requirements), post_study_opportunities = VALUES(post_study_opportunities),
            application_deadlines = VALUES(application_deadlines), sort_order = VALUES(sort_order), published = VALUES(published)`,
          [
            c.id, c.slug, c.name, c.flag || null, c.code || null, c.region || null, c.heroImage || null,
            c.tagline || null, c.overview || null, JSON.stringify(c.whyStudy || []),
            JSON.stringify(c.popularCourses || []), c.averageTuition || null, c.livingCosts || null,
            c.currency || null, JSON.stringify(c.intakes || []), c.postStudyWork || null,
            c.visaSuccessRate || null, c.workWhileStudying || null,
            JSON.stringify(c.topUniversityNames || []), c.scholarshipsOverview || null,
            JSON.stringify(c.visaRequirements || []), JSON.stringify(c.postStudyOpportunities || []),
            c.applicationDeadlines || null, c.order ?? c.sortOrder ?? 1, c.published ?? true,
          ]
        );
      }
      return true;
    }

    // 6. Universities table
    if (table === 'universities' && Array.isArray(data)) {
      const ids = data.map((u: any) => u.id).filter(Boolean);
      if (ids.length > 0) {
        await p.query('DELETE FROM universities WHERE id NOT IN (?)', [ids]);
      }
      for (const u of data) {
        await p.execute(
          `INSERT INTO universities (
            id, slug, name, country, country_slug, city, world_rank, ranking_badge,
            acceptance_rate, logo, image, overview, tuition, living_cost_estimate,
            popular_programs, study_fields, entry_requirements, scholarships, intakes,
            highlights, official_rep, featured, sort_order, published, website
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            name = VALUES(name), country = VALUES(country), country_slug = VALUES(country_slug),
            city = VALUES(city), world_rank = VALUES(world_rank), ranking_badge = VALUES(ranking_badge),
            acceptance_rate = VALUES(acceptance_rate), logo = VALUES(logo), image = VALUES(image),
            overview = VALUES(overview), tuition = VALUES(tuition), living_cost_estimate = VALUES(living_cost_estimate),
            popular_programs = VALUES(popular_programs), study_fields = VALUES(study_fields),
            entry_requirements = VALUES(entry_requirements), scholarships = VALUES(scholarships),
            intakes = VALUES(intakes), highlights = VALUES(highlights), official_rep = VALUES(official_rep),
            featured = VALUES(featured), sort_order = VALUES(sort_order), published = VALUES(published),
            website = VALUES(website)`,
          [
            u.id, u.slug, u.name, u.country, u.countrySlug || null, u.city || null,
            u.worldRank || null, u.rankingBadge || null, u.acceptanceRate || null,
            u.logo || null, u.image || null, u.overview || null, JSON.stringify(u.tuition || {}),
            u.livingCostEstimate || null, JSON.stringify(u.popularPrograms || []),
            JSON.stringify(u.studyFields || []), JSON.stringify(u.entryRequirements || {}),
            JSON.stringify(u.scholarships || []), JSON.stringify(u.intakes || []),
            JSON.stringify(u.highlights || []), u.officialRep ?? true, u.featured ?? false,
            u.order ?? u.sortOrder ?? 1, u.published ?? true, u.website || null,
          ]
        );
      }
      return true;
    }

    // 7. Services table
    if (table === 'services' && Array.isArray(data)) {
      const ids = data.map((s: any) => s.id).filter(Boolean);
      if (ids.length > 0) {
        await p.query('DELETE FROM services WHERE id NOT IN (?)', [ids]);
      }
      for (const s of data) {
        await p.execute(
          `INSERT INTO services (
            id, slug, title, short_desc, full_desc, icon, benefits, deliverables,
            target_audience, turnaround_time, sort_order, active
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            title = VALUES(title), short_desc = VALUES(short_desc), full_desc = VALUES(full_desc),
            icon = VALUES(icon), benefits = VALUES(benefits), deliverables = VALUES(deliverables),
            target_audience = VALUES(target_audience), turnaround_time = VALUES(turnaround_time),
            sort_order = VALUES(sort_order), active = VALUES(active)`,
          [
            s.id, s.slug, s.title, s.shortDesc || null, s.fullDesc || null, s.icon || null,
            JSON.stringify(s.benefits || []), JSON.stringify(s.deliverables || []),
            s.targetAudience || null, s.turnaroundTime || null, s.sortOrder || 1, s.active ?? true,
          ]
        );
      }
      return true;
    }

    // 8. Blog Posts table
    if (table === 'blogPosts' && Array.isArray(data)) {
      const ids = data.map((b: any) => b.id).filter(Boolean);
      if (ids.length > 0) {
        await p.query('DELETE FROM blog_posts WHERE id NOT IN (?)', [ids]);
      }
      for (const b of data) {
        await p.execute(
          `INSERT INTO blog_posts (
            id, slug, title, excerpt, content, category, author, published_at,
            read_time, cover_image, tags, featured, published
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            title = VALUES(title), excerpt = VALUES(excerpt), content = VALUES(content),
            category = VALUES(category), author = VALUES(author), published_at = VALUES(published_at),
            read_time = VALUES(read_time), cover_image = VALUES(cover_image), tags = VALUES(tags),
            featured = VALUES(featured), published = VALUES(published)`,
          [
            b.id, b.slug, b.title, b.excerpt || null, b.content, b.category || null,
            JSON.stringify(b.author || {}), b.publishedAt || null, b.readTime || null,
            b.coverImage || null, JSON.stringify(b.tags || []), b.featured ?? false, b.published ?? true,
          ]
        );
      }
      return true;
    }

    // 9. Success Stories table
    if (table === 'successStories' && Array.isArray(data)) {
      const ids = data.map((st: any) => st.id).filter(Boolean);
      if (ids.length > 0) {
        await p.query('DELETE FROM success_stories WHERE id NOT IN (?)', [ids]);
      } else {
        await p.execute('DELETE FROM success_stories');
      }
      for (const st of data) {
        await p.execute(
          `INSERT INTO success_stories (
            id, student_name, student_photo, previous_education, cgpa, country,
            country_slug, university, university_slug, program, degree_level,
            visa_result, visa_granted_date, intake, scholarship_amount, testimonial,
            rating, featured, published, video_url
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            student_name = VALUES(student_name), student_photo = VALUES(student_photo),
            previous_education = VALUES(previous_education), cgpa = VALUES(cgpa),
            country = VALUES(country), country_slug = VALUES(country_slug),
            university = VALUES(university), university_slug = VALUES(university_slug),
            program = VALUES(program), degree_level = VALUES(degree_level),
            visa_result = VALUES(visa_result), visa_granted_date = VALUES(visa_granted_date),
            intake = VALUES(intake), scholarship_amount = VALUES(scholarship_amount),
            testimonial = VALUES(testimonial), rating = VALUES(rating),
            featured = VALUES(featured), published = VALUES(published), video_url = VALUES(video_url)`,
          [
            st.id, st.studentName, st.studentPhoto || null, st.previousEducation || null,
            st.cgpa || null, st.country || null, st.countrySlug || null, st.university || null,
            st.universitySlug || null, st.program || null, st.degreeLevel || null,
            st.visaResult || null, st.visaGrantedDate || null, st.intake || null,
            st.scholarshipAmount || null, st.testimonial || null, st.rating || 5,
            st.featured ?? false, st.published ?? true, st.videoUrl || null,
          ]
        );
      }
      return true;
    }

    // 10. Videos table
    if (table === 'videos' && Array.isArray(data)) {
      const ids = data.map((v: any) => v.id).filter(Boolean);
      if (ids.length > 0) {
        await p.query('DELETE FROM videos WHERE id NOT IN (?)', [ids]);
      } else {
        await p.execute('DELETE FROM videos');
      }
      for (const v of data) {
        await p.execute(
          `INSERT INTO videos (
            id, student_name, university, country, program, thumbnail_url,
            video_embed_url, duration, quote, visa_granted_year, category, featured, published
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            student_name = VALUES(student_name), university = VALUES(university),
            country = VALUES(country), program = VALUES(program),
            thumbnail_url = VALUES(thumbnail_url), video_embed_url = VALUES(video_embed_url),
            duration = VALUES(duration), quote = VALUES(quote),
            visa_granted_year = VALUES(visa_granted_year), category = VALUES(category),
            featured = VALUES(featured), published = VALUES(published)`,
          [
            v.id, v.studentName || v.title || 'Student Video', v.university || null, v.country || v.destination || null,
            v.program || null, v.thumbnailUrl || v.thumbnail || null, v.videoEmbedUrl || v.embedUrl || '',
            v.duration || null, v.quote || null, v.visaGrantedYear || null,
            v.category || null, v.featured ?? false, v.published ?? true,
          ]
        );
      }
      return true;
    }

    // 11. Team Members table
    if (table === 'teamMembers' && Array.isArray(data)) {
      const ids = data.map((tm: any) => tm.id).filter(Boolean);
      if (ids.length > 0) {
        await p.query('DELETE FROM team_members WHERE id NOT IN (?)', [ids]);
      } else {
        await p.execute('DELETE FROM team_members');
      }
      for (const tm of data) {
        await p.execute(
          `INSERT INTO team_members (
            id, name, role, experience, credentials, image, bio, specializations, sort_order, active
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            name = VALUES(name), role = VALUES(role), experience = VALUES(experience),
            credentials = VALUES(credentials), image = VALUES(image), bio = VALUES(bio),
            specializations = VALUES(specializations), sort_order = VALUES(sort_order), active = VALUES(active)`,
          [
            tm.id, tm.name, tm.role, tm.experience || null,
            JSON.stringify(tm.credentials || []), tm.image || null, tm.bio || null,
            JSON.stringify(tm.specializations || []), tm.sortOrder || 1, tm.active ?? true,
          ]
        );
      }
      return true;
    }

    // 12. FAQs table
    if (table === 'faqs' && Array.isArray(data)) {
      const ids = data.map((f: any) => f.id).filter(Boolean);
      if (ids.length > 0) {
        await p.query('DELETE FROM faqs WHERE id NOT IN (?)', [ids]);
      }
      for (const f of data) {
        await p.execute(
          `INSERT INTO faqs (id, question, answer, category, sort_order, published)
           VALUES (?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             question = VALUES(question), answer = VALUES(answer),
             category = VALUES(category), sort_order = VALUES(sort_order), published = VALUES(published)`,
          [f.id, f.question, f.answer, f.category || null, f.sortOrder || 1, f.published ?? true]
        );
      }
      return true;
    }

    // 13. Custom Pages table
    if (table === 'customPages' && Array.isArray(data)) {
      const ids = data.map((cp: any) => cp.id).filter(Boolean);
      if (ids.length > 0) {
        await p.query('DELETE FROM custom_pages WHERE id NOT IN (?)', [ids]);
      }
      for (const cp of data) {
        await p.execute(
          `INSERT INTO custom_pages (id, slug, title, hero_image, content, published, seo_title, seo_description)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             slug = VALUES(slug), title = VALUES(title), hero_image = VALUES(hero_image),
             content = VALUES(content), published = VALUES(published),
             seo_title = VALUES(seo_title), seo_description = VALUES(seo_description)`,
          [
            cp.id, cp.slug, cp.title, cp.heroImage || null, cp.content || '',
            cp.published ?? true, cp.seoTitle || null, cp.seoDescription || null,
          ]
        );
      }
      return true;
    }

    // 14. Media table
    if (table === 'media' && Array.isArray(data)) {
      const ids = data.map((m: any) => m.id).filter(Boolean);
      if (ids.length > 0) {
        await p.query('DELETE FROM media WHERE id NOT IN (?)', [ids]);
      }
      for (const m of data) {
        await p.execute(
          `INSERT INTO media (id, name, url, category, size_bytes, mime_type)
           VALUES (?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             name = VALUES(name), url = VALUES(url), category = VALUES(category),
             size_bytes = VALUES(size_bytes), mime_type = VALUES(mime_type)`,
          [m.id, m.name, m.url, m.category || null, m.sizeBytes || 0, m.mimeType || null]
        );
      }
      return true;
    }

    // 15. Visa Success table
    if (table === 'visaSuccess' && Array.isArray(data)) {
      const ids = data.map((v: any) => v.id).filter(Boolean);
      if (ids.length > 0) {
        await p.query('DELETE FROM visa_success WHERE id NOT IN (?)', [ids]);
      } else {
        await p.execute('DELETE FROM visa_success');
      }
      for (let idx = 0; idx < data.length; idx++) {
        const v = data[idx];
        await p.execute(
          `INSERT INTO visa_success (
            id, student_name, student_photo, visa_letter_image, country, country_code, country_slug,
            university, program, intake, visa_type, approval_days, grant_date, testimonial,
            featured, published, show_on_homepage, sort_order
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            student_name = VALUES(student_name),
            student_photo = VALUES(student_photo),
            visa_letter_image = VALUES(visa_letter_image),
            country = VALUES(country),
            country_code = VALUES(country_code),
            country_slug = VALUES(country_slug),
            university = VALUES(university),
            program = VALUES(program),
            intake = VALUES(intake),
            visa_type = VALUES(visa_type),
            approval_days = VALUES(approval_days),
            grant_date = VALUES(grant_date),
            testimonial = VALUES(testimonial),
            featured = VALUES(featured),
            published = VALUES(published),
            show_on_homepage = VALUES(show_on_homepage),
            sort_order = VALUES(sort_order)`,
          [
            v.id, v.studentName, v.studentPhoto || null, v.visaLetterImage, v.country,
            v.countryCode || null, v.countrySlug || null, v.university, v.program,
            v.intake || null, v.visaType || null, v.approvalDays || null, v.grantDate || null,
            v.testimonial || null, v.featured ?? true, v.published ?? true, v.showOnHomepage ? 1 : 0, v.order || idx + 1
          ]
        );
      }
      return true;
    }

    // 16. Reviews table (Student Reviews)
    if (table === 'reviews' && Array.isArray(data)) {
      const ids = data.map((r: any) => r.id).filter(Boolean);
      if (ids.length > 0) {
        await p.query('DELETE FROM student_reviews WHERE id NOT IN (?)', [ids]);
      } else {
        await p.execute('DELETE FROM student_reviews');
      }
      for (const r of data) {
        await p.execute(
          `INSERT INTO student_reviews (
            id, name, email, rating, country, country_slug, university, university_slug,
            program, comment, status, published, show_on_home, gender, avatar, intake,
            verified_student
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            name = VALUES(name), email = VALUES(email), rating = VALUES(rating),
            country = VALUES(country), country_slug = VALUES(country_slug),
            university = VALUES(university), university_slug = VALUES(university_slug),
            program = VALUES(program), comment = VALUES(comment), status = VALUES(status),
            published = VALUES(published), show_on_home = VALUES(show_on_home),
            gender = VALUES(gender), avatar = VALUES(avatar), intake = VALUES(intake),
            verified_student = VALUES(verified_student)`,
          [
            r.id, r.name, r.email || null, r.rating || 5, r.country || null, r.countrySlug || null,
            r.university || null, r.universitySlug || null, r.program || null, r.comment || '',
            r.status || 'approved', r.published !== false ? 1 : 0, r.showOnHome !== false ? 1 : 0,
            r.gender || 'man', r.avatar || null, r.intake || 'Fall 2025', r.verifiedStudent !== false ? 1 : 0
          ]
        );
      }
      return true;
    }

    return true;
  } catch (err) {
    console.error(`Error syncing table ${table} to MySQL:`, err);
    return false;
  }
}

export async function fetchTableFromMySQL(table: string): Promise<any> {
  try {
    const ok = await initDatabase();
    if (!ok) return null;
    const p = getPool();

    // 1. Settings tables stored in cms_settings
    const settingsMap: Record<string, string> = {
      generalSettings: 'general',
      navigationSettings: 'navigation',
      footerSettings: 'footer',
      homepageSettings: 'homepage',
      seoSettings: 'seo',
      appointmentSettings: 'appointments',
      emailSettings: 'email',
      socialLinks: 'social',
      visaSuccessPageSettings: 'visa_success_page',
      servicesPageSettings: 'services_page',
      aboutPageSettings: 'about_page',
      subscribers: 'subscribers',
      broadcastCampaigns: 'broadcast_campaigns',
      aiChatSettings: 'ai_chat',
    };

    if (settingsMap[table]) {
      const keyName = settingsMap[table];
      const [rows]: any = await p.execute(
        'SELECT value_json FROM cms_settings WHERE key_name = ? LIMIT 1',
        [keyName]
      );
      if (rows && rows.length > 0) {
        const val = safeJsonParse(rows[0].value_json, null);
        if (table === 'navigationSettings' || keyName === 'navigation') {
          return normalizeNavigationSettings(val);
        }
        return val;
      }
      return null;
    }

    // 2. Countries
    if (table === 'countries') {
      const [rows]: any = await p.execute('SELECT * FROM countries ORDER BY sort_order ASC, id ASC');
      if (!rows || rows.length === 0) return null;
      return rows.map((r: any) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        flag: r.flag,
        code: r.code,
        region: r.region,
        heroImage: r.hero_image,
        tagline: r.tagline,
        overview: r.overview,
        whyStudy: safeJsonParse(r.why_study, []),
        popularCourses: safeJsonParse(r.popular_courses, []),
        averageTuition: r.average_tuition,
        livingCosts: r.living_costs,
        currency: r.currency,
        intakes: safeJsonParse(r.intakes, []),
        postStudyWork: r.post_study_work,
        visaSuccessRate: r.visa_success_rate,
        workWhileStudying: r.work_while_studying,
        topUniversityNames: safeJsonParse(r.top_university_names, []),
        scholarshipsOverview: r.scholarships_overview,
        visaRequirements: safeJsonParse(r.visa_requirements, []),
        postStudyOpportunities: safeJsonParse(r.post_study_opportunities, []),
        applicationDeadlines: r.application_deadlines,
        sortOrder: r.sort_order,
        order: r.sort_order ?? 1,
        published: Boolean(r.published),
        seoTitle: r.seo_title,
        seoDescription: r.seo_description,
      }));
    }

    // 3. Universities
    if (table === 'universities') {
      const [rows]: any = await p.execute('SELECT * FROM universities ORDER BY sort_order ASC, id ASC');
      if (!rows || rows.length === 0) return null;
      return rows.map((r: any) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        country: r.country,
        countrySlug: r.country_slug,
        city: r.city,
        worldRank: r.world_rank,
        rankingBadge: r.ranking_badge,
        acceptanceRate: r.acceptance_rate,
        logo: r.logo,
        image: r.image,
        overview: r.overview,
        tuition: safeJsonParse(r.tuition, {}),
        livingCostEstimate: r.living_cost_estimate,
        popularPrograms: safeJsonParse(r.popular_programs, []),
        studyFields: safeJsonParse(r.study_fields, []),
        entryRequirements: safeJsonParse(r.entry_requirements, {}),
        scholarships: safeJsonParse(r.scholarships, []),
        intakes: safeJsonParse(r.intakes, []),
        highlights: safeJsonParse(r.highlights, []),
        officialRep: Boolean(r.official_rep),
        featured: Boolean(r.featured),
        sortOrder: r.sort_order,
        order: r.sort_order ?? 1,
        published: Boolean(r.published),
        website: r.website,
        seoTitle: r.seo_title,
        seoDescription: r.seo_description,
      }));
    }

    // 4. Services
    if (table === 'services') {
      const [rows]: any = await p.execute('SELECT * FROM services ORDER BY sort_order ASC, id ASC');
      if (!rows || rows.length === 0) return null;
      return rows.map((r: any) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        shortDesc: r.short_desc,
        fullDesc: r.full_desc,
        icon: r.icon,
        benefits: safeJsonParse(r.benefits, []),
        deliverables: safeJsonParse(r.deliverables, []),
        targetAudience: r.target_audience,
        turnaroundTime: r.turnaround_time,
        sortOrder: r.sort_order,
        active: Boolean(r.active),
      }));
    }

    // 5. Blog Posts
    if (table === 'blogPosts') {
      const [rows]: any = await p.execute('SELECT * FROM blog_posts ORDER BY published_at DESC, id DESC');
      if (!rows || rows.length === 0) return null;
      return rows.map((r: any) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt,
        content: r.content,
        category: r.category,
        author: safeJsonParse(r.author, {}),
        publishedAt: r.published_at,
        readTime: r.read_time,
        coverImage: r.cover_image,
        tags: safeJsonParse(r.tags, []),
        featured: Boolean(r.featured),
        published: Boolean(r.published),
        seoTitle: r.seo_title,
        seoDescription: r.seo_description,
      }));
    }

    // 6. Success Stories
    if (table === 'successStories') {
      const [rows]: any = await p.execute('SELECT * FROM success_stories ORDER BY id DESC');
      if (!rows || rows.length === 0) return [];
      return rows.map((r: any) => ({
        id: r.id,
        studentName: r.student_name,
        studentPhoto: r.student_photo,
        previousEducation: r.previous_education,
        cgpa: r.cgpa,
        country: r.country,
        countrySlug: r.country_slug,
        university: r.university,
        universitySlug: r.university_slug,
        program: r.program,
        degreeLevel: r.degree_level,
        visaResult: r.visa_result,
        visaGrantedDate: r.visa_granted_date,
        intake: r.intake,
        scholarshipAmount: r.scholarship_amount,
        testimonial: r.testimonial,
        rating: r.rating || 5,
        featured: Boolean(r.featured),
        published: Boolean(r.published),
        videoUrl: r.video_url,
      }));
    }

    // 7. Videos
    if (table === 'videos') {
      const [rows]: any = await p.execute('SELECT * FROM videos ORDER BY id DESC');
      if (!rows || rows.length === 0) return [];
      return rows.map((r: any) => ({
        id: r.id,
        title: r.student_name,
        studentName: r.student_name,
        university: r.university,
        country: r.country,
        destination: r.country,
        program: r.program,
        thumbnailUrl: r.thumbnail_url,
        thumbnail: r.thumbnail_url,
        videoEmbedUrl: r.video_embed_url,
        embedUrl: r.video_embed_url,
        duration: r.duration,
        quote: r.quote,
        visaGrantedYear: r.visa_granted_year,
        category: r.category,
        featured: Boolean(r.featured),
        published: Boolean(r.published),
      }));
    }

    // 8. Team Members
    if (table === 'teamMembers') {
      const [rows]: any = await p.execute('SELECT * FROM team_members ORDER BY sort_order ASC, id ASC');
      if (!rows || rows.length === 0) return [];
      return rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        role: r.role,
        experience: r.experience,
        credentials: safeJsonParse(r.credentials, []),
        image: r.image,
        bio: r.bio,
        specializations: safeJsonParse(r.specializations, []),
        sortOrder: r.sort_order,
        active: Boolean(r.active),
      }));
    }

    // 9. FAQs
    if (table === 'faqs') {
      const [rows]: any = await p.execute('SELECT * FROM faqs ORDER BY sort_order ASC, id ASC');
      if (!rows || rows.length === 0) return null;
      return rows.map((r: any) => ({
        id: r.id,
        question: r.question,
        answer: r.answer,
        category: r.category,
        sortOrder: r.sort_order,
        published: Boolean(r.published),
      }));
    }

    // 10. Custom Pages
    if (table === 'customPages') {
      const [rows]: any = await p.execute('SELECT * FROM custom_pages ORDER BY id ASC');
      if (!rows || rows.length === 0) return null;
      return rows.map((r: any) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        heroImage: r.hero_image,
        content: r.content,
        published: Boolean(r.published),
        seoTitle: r.seo_title,
        seoDescription: r.seo_description,
      }));
    }

    // 11. Leads CRM
    if (table === 'leads') {
      const [rows]: any = await p.execute('SELECT * FROM leads ORDER BY created_at DESC');
      if (!rows) return [];
      return rows.map((r: any) => ({
        id: r.id,
        fullName: r.full_name,
        email: r.email,
        phone: r.phone,
        currentCountry: r.current_country,
        targetCountry: r.target_country,
        studyLevel: r.study_level,
        program: r.program,
        academicScore: r.academic_score,
        englishTest: r.english_test,
        message: r.message,
        sourcePage: r.source_page,
        status: r.status,
        notes: r.notes,
        assignedTo: r.assigned_to,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
    }

    // 12. Appointments
    if (table === 'appointments') {
      const [rows]: any = await p.execute('SELECT * FROM appointments ORDER BY created_at DESC');
      if (!rows) return [];
      return rows.map((r: any) => ({
        id: r.id,
        fullName: r.full_name,
        email: r.email,
        phone: r.phone,
        whatsapp: r.whatsapp,
        targetCountry: r.target_country,
        studyLevel: r.study_level,
        consultationType: r.consultation_type,
        preferredDate: r.preferred_date,
        preferredTime: r.preferred_time,
        message: r.message,
        status: r.status,
        notes: r.notes,
        meetingLink: r.meeting_link,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
    }

    // 13. Media
    if (table === 'media') {
      const [rows]: any = await p.execute('SELECT * FROM media ORDER BY created_at DESC');
      if (!rows) return [];
      return rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        url: r.url,
        category: r.category,
        sizeBytes: r.size_bytes,
        mimeType: r.mime_type,
        createdAt: r.created_at,
      }));
    }

    // 14. Users
    if (table === 'users') {
      const [rows]: any = await p.execute('SELECT id, name, email, password_hash, role, avatar, created_at FROM users');
      if (!rows) return [];
      return rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        passwordHash: r.password_hash,
        role: r.role,
        avatar: r.avatar,
        createdAt: r.created_at,
      }));
    }

    // 15. Visa Success
    if (table === 'visaSuccess') {
      const [rows]: any = await p.execute('SELECT * FROM visa_success ORDER BY sort_order ASC, id ASC');
      if (!rows || rows.length === 0) return [];
      return rows.map((r: any) => ({
        id: r.id,
        studentName: r.student_name,
        studentPhoto: r.student_photo,
        visaLetterImage: r.visa_letter_image,
        country: r.country,
        countryCode: r.country_code,
        countrySlug: r.country_slug,
        university: r.university,
        program: r.program,
        intake: r.intake,
        visaType: r.visa_type,
        approvalDays: r.approval_days,
        grantDate: r.grant_date,
        testimonial: r.testimonial,
        featured: Boolean(r.featured),
        published: Boolean(r.published),
        showOnHomepage: Boolean(r.show_on_homepage),
        order: r.sort_order,
        createdAt: r.created_at?.toISOString ? r.created_at.toISOString() : String(r.created_at || ''),
      }));
    }

    // 16. Reviews (Student Reviews)
    if (table === 'reviews') {
      const [rows]: any = await p.execute('SELECT * FROM student_reviews ORDER BY created_at DESC, id DESC').catch(() => [[]]);
      if (!rows || rows.length === 0) return null;
      return rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        email: r.email || '',
        rating: r.rating || 5,
        country: r.country || 'United Kingdom',
        countrySlug: r.country_slug || 'uk',
        university: r.university || 'General Consultation',
        universitySlug: r.university_slug || 'general',
        program: r.program || undefined,
        comment: r.comment || '',
        status: r.status || 'approved',
        published: Boolean(r.published),
        showOnHome: Boolean(r.show_on_home),
        gender: r.gender || 'man',
        avatar: r.avatar,
        intake: r.intake || 'Fall 2025',
        verifiedStudent: Boolean(r.verified_student),
        createdAt: r.created_at?.toISOString ? r.created_at.toISOString() : String(r.created_at || ''),
      }));
    }

    return null;
  } catch (err: any) {
    console.error(`[MySQL fetchTable Error for ${table}]:`, err?.message || err);
    return null;
  }
}

// ==========================================
// Persistent Binary Media Storage (media_files table)
// ==========================================

export async function ensureMediaFilesTable(pool?: mysql.Pool): Promise<boolean> {
  try {
    const ok = await initDatabase();
    if (!ok) return false;
    const p = pool || getPool();
    await p.execute(`
      CREATE TABLE IF NOT EXISTS media_files (
        id VARCHAR(100) PRIMARY KEY,
        mime_type VARCHAR(100),
        size_bytes INT,
        data LONGBLOB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    return true;
  } catch {
    return false;
  }
}

export async function saveMediaFile(
  id: string,
  mimeType: string,
  sizeBytes: number,
  dataBuffer: Buffer
): Promise<void> {
  const ok = await ensureMediaFilesTable();
  if (!ok) return;
  const p = getPool();
  await p.execute(
    `INSERT INTO media_files (id, mime_type, size_bytes, data)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       mime_type = VALUES(mime_type),
       size_bytes = VALUES(size_bytes),
       data = VALUES(data)`,
    [id, mimeType, sizeBytes, dataBuffer]
  );
}

export async function getMediaFile(
  id: string
): Promise<{ id: string; mimeType: string; sizeBytes: number; data: Buffer } | null> {
  try {
    const ok = await ensureMediaFilesTable();
    if (!ok) return null;
    const p = getPool();
    const [rows]: any = await p.execute(
      'SELECT id, mime_type, size_bytes, data FROM media_files WHERE id = ? LIMIT 1',
      [id]
    );
    if (!rows || rows.length === 0) return null;
    const row = rows[0];
    return {
      id: row.id,
      mimeType: row.mime_type || 'application/octet-stream',
      sizeBytes: Number(row.size_bytes || 0),
      data: Buffer.isBuffer(row.data) ? row.data : Buffer.from(row.data),
    };
  } catch {
    return null;
  }
}

export async function deleteMediaFile(id: string): Promise<void> {
  try {
    const ok = await ensureMediaFilesTable();
    if (!ok) return;
    const p = getPool();
    await p.execute('DELETE FROM media_files WHERE id = ?', [id]);
  } catch {}
}

