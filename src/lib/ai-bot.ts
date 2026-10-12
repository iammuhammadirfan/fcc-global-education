import { db } from './db';
import { AiChatSettings } from './types';
import { DEFAULT_AI_CHAT_SETTINGS } from './ai-constants';

export { DEFAULT_AI_CHAT_SETTINGS };

export async function getAiChatSettings(): Promise<AiChatSettings> {
  try {
    const settings = await db.getTable('aiChatSettings');
    if (!settings) return DEFAULT_AI_CHAT_SETTINGS;
    return {
      ...DEFAULT_AI_CHAT_SETTINGS,
      ...settings,
      suggestedQuestions:
        settings.suggestedQuestions && settings.suggestedQuestions.length > 0
          ? settings.suggestedQuestions
          : DEFAULT_AI_CHAT_SETTINGS.suggestedQuestions,
    };
  } catch (err) {
    console.warn('[AI Bot Settings Warning]:', err);
    return DEFAULT_AI_CHAT_SETTINGS;
  }
}

// Build comprehensive website context dynamically from live database
export async function buildWebsiteKnowledgeContext(): Promise<string> {
  try {
    const [general, countries, universities, services, faqs] = await Promise.all([
      db.getTable('generalSettings').then((r) => r || {}),
      db.getTable('countries').then((r) => r || []),
      db.getTable('universities').then((r) => r || []),
      db.getTable('services').then((r) => r || []),
      db.getTable('faqs').then((r) => r || []),
    ]);

    const activeCountries = countries
      .filter((c: any) => c.published !== false)
      .map((c: any) => `${c.name} (${c.code || ''}): Capital ${c.capital || ''}, Currency ${c.currency || ''}, Visa requirements: ${c.visaRequirements || 'Standard student visa compliance'}`)
      .join('; ');

    const activeUniversities = universities
      .filter((u: any) => u.published !== false)
      .slice(0, 15)
      .map((u: any) => `${u.name} (${u.country}) - World Rank: ${u.ranking || 'Top tier'}, Tuition approx: ${u.tuitionFee || 'Competitive'}, Popular fields: ${(u.popularPrograms || []).join(', ')}`)
      .join('; ');

    const activeServices = services
      .filter((s: any) => s.active !== false)
      .map((s: any) => `${s.title}: ${s.shortDescription || s.description || ''}`)
      .join('; ');

    const topFaqs = faqs
      .slice(0, 6)
      .map((f: any) => `Q: ${f.question} | A: ${f.answer}`)
      .join('\n');

    return `
========================================
FCC GLOBAL EDUCATION OFFICIAL DIRECTORY & PORTAL DATA:
- Organization Name: ${general.companyName || 'FCC Global Education'}
- Tagline: ${general.tagline || 'Leading International Education & Visa Consultancy'}
- Official London Headquarters: ${general.address || 'Berkeley Square House, Mayfair, London W1J 6BD, United Kingdom'}
- Phone / Contact: ${general.phone || '+44 (0) 20 7946 0912'}
- WhatsApp Helpline: ${general.whatsapp || '+442079460912'}
- Admissions Email: ${general.email || 'admissions@fccglobaleducation.com'}
- Website Portal: ${general.websiteUrl || 'http://localhost:3000'}
- Consultation Booking URL: /book-appointment (Free 1-on-1 strategy clinics via Online Video Call or In-Person Office Visit)
- Contact Form: /contact

DESTINATIONS WE ADVISE ON:
${activeCountries || 'United Kingdom, United States, Canada, Australia, Germany, Ireland, New Zealand, Netherlands'}

FEATURED PARTNER UNIVERSITIES:
${activeUniversities || 'Leading Russell Group, Group of Eight, and global accredited universities'}

OUR CORE SERVICES:
${activeServices || 'University shortlisting, Scholarship application, Statement of Purpose refinement, Visa file preparation & mock interviews, Pre-departure briefing'}

VERIFIED FAQs:
${topFaqs || 'Comprehensive support provided for admissions and visas worldwide.'}
========================================
`;
  } catch (err) {
    console.warn('[AI Knowledge Context Warning]:', err);
    return 'FCC Global Education: Premier international education consultancy facilitating world-class admissions, scholarship strategy, and 98.6% visa success.';
  }
}

// Intelligent Fallback Knowledge Engine (Used if no Groq API Key is configured or during network outage)
export function generateLocalFallbackResponse(userMessage: string, knowledgeSummary: string): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes('scholarship') || msg.includes('fee waiver') || msg.includes('funding')) {
    return `### 🎓 Scholarships & Tuition Fee Waivers at FCC Global Education

We assist qualified international students in securing significant academic and merit awards for upcoming **2026/2027 intakes**:

* **Merit-Based Fee Reductions**: Up to **£10,000 / $15,000** off annual tuition across participating UK, Canadian, Australian, and US universities.
* **100% Full-Ride Sponsorships**: Government and university-funded grants for high-achieving STEM, Business, and Healthcare applicants.
* **Automatic Early-Bird Bursaries**: Pre-approved fee credits applied directly upon conditional offer issuance.

To assess your exact scholarship eligibility based on your academic transcripts and GPA:
👉 **[Book a Free Scholarship Assessment](/book-appointment)** or message our advisors directly on WhatsApp!`;
  }

  if (msg.includes('visa') || msg.includes('cas') || msg.includes('i-20') || msg.includes('embassy') || msg.includes('document')) {
    return `### 🛂 Student Visa Guidance (98.6% Success Rate)

Our accredited immigration solicitors and compliance counselors ensure **100% error-free visa submissions**:

* **Financial Proof Audits**: Guidance on maintaining the mandatory 28-day funds rule, blocked accounts (Germany), and legitimate sponsorship affidavits.
* **CAS & I-20 Clearance**: Fast-track issuance by liaising directly with university international compliance teams.
* **Visa Mock Interviews**: 1-on-1 preparatory sessions replicating UKVI, US Consular, and Canadian visa interviews.
* **Biometrics & Health Surcharge**: Complete scheduling and document indexing support.

👉 **[Schedule a Visa Strategy Call](/book-appointment)** to review your financial portfolio today!`;
  }

  if (msg.includes('appointment') || msg.includes('book') || msg.includes('meeting') || msg.includes('consultation')) {
    return `### 📅 Book Your Free 1-on-1 Consultation

You can reserve a dedicated 30-minute advisory clinic with a senior counselor right now:

* 📹 **1-on-1 Online Video Call**: Join via Google Meet / Zoom from the comfort of your home.
* 🏢 **In-Person Office Visit**: Meet our senior admissions directors directly at our offices.

👉 **[Click Here to Book Your Free Appointment](/book-appointment)** — Choose your preferred date, time slot, and meeting format in under 60 seconds!`;
  }

  if (msg.includes('ielts') || msg.includes('toefl') || msg.includes('pte') || msg.includes('english') || msg.includes('waiver')) {
    return `### 📝 English Proficiency & IELTS Waiver Options

Yes! Many of our partner universities offer **IELTS Waivers** under the following conditions:

* **Medium of Instruction (MOI)**: If your prior degree was taught entirely in English.
* **High School English Marks**: Securing 70%+ in high school English examinations (e.g. CBSE, ISC, Cambridge O/A Levels).
* **Alternative Accepted Tests**: Duolingo English Test (DET), PTE Academic, and internal university English evaluation exams.

Connect with our counselors to verify if your target universities will waive IELTS for your profile:
👉 **[Check IELTS Waiver Eligibility](/book-appointment)**`;
  }

  if (msg.includes('uk') || msg.includes('britain') || msg.includes('london')) {
    return `### 🇬🇧 Study in the United Kingdom

The UK remains one of the world's most prestigious study destinations:
* **Degree Durations**: 3-Year Bachelors & 1-Year Masters programs (save an entire year of living expenses!).
* **Post-Study Work**: 2-Year Graduate Route post-study work visa (3 years for PhD).
* **Top Institutions**: Russell Group and leading modern career-focused universities across London, Manchester, Edinburgh, and Birmingham.
* **Intakes**: September / October (Primary) & January / February (Winter).

👉 **[Explore UK Admissions & Shortlist Universities](/book-appointment)**`;
  }

  if (msg.includes('canada') || msg.includes('toronto') || msg.includes('vancouver')) {
    return `### 🇨🇦 Study in Canada

Canada offers world-class education paired with clear post-graduation immigration pathways:
* **Post-Graduation Work Permit (PGWP)**: Up to 3 years of open work rights upon course completion.
* **Top Institutions**: Leading U15 universities and public polytechnic colleges.
* **Co-op Work Programs**: Paid internships integrated directly into degree curricula.

👉 **[Start Your Canadian University Application](/book-appointment)**`;
  }

  if (msg.includes('australia') || msg.includes('sydney') || msg.includes('melbourne') || msg.includes('500')) {
    return `### 🇦🇺 Study in Australia & Subclass 500 Student Visa
Australia offers premier Group of Eight (Go8) universities with world-class graduate outcomes:
* **Degree Options**: 3-Year Bachelors, 2-Year Masters & Research PhDs.
* **Post-Study Work (PSW)**: Up to 2-4 years temporary graduate work rights.
* **Key Requirements**: Confirmation of Enrolment (CoE), Genuine Student (GS) assessment, Financial proof (AUD $29,710/year living costs + tuition), and OSHC Health Cover.
* **Intakes**: February (Primary) & July (Secondary).

👉 **[Start Your Australian University Assessment](/book-appointment)** or chat via WhatsApp!`;
  }

  if (msg.includes('usa') || msg.includes('america') || msg.includes('f-1') || msg.includes('f1')) {
    return `### 🇺🇸 Study in the United States (F-1 Student Visa)
* **Programs**: 4-Year Bachelors, 1-2 Year Masters & STEM OPT extensions.
* **STEM OPT Benefit**: Up to 3 years total post-graduation US work authorization for STEM graduates!
* **Requirements**: Form I-20 issuance, SEVIS Fee payment, and US Embassy Consular Interview preparation.
* **Financial Aid**: Merit assistantships (TA/RA) and international tuition scholarships.

👉 **[Book US Admissions & Visa Interview Session](/book-appointment)**`;
  }

  if (msg.includes('fee') || msg.includes('cost') || msg.includes('kharcha') || msg.includes('expense') || msg.includes('tuition')) {
    return `### 💰 International Tuition Fees & Living Expenses (2026/2027)

| Destination | Average Annual Tuition | Estimated Living Expenses | Post-Study Work |
|-------------|------------------------|---------------------------|-----------------|
| 🇬🇧 **United Kingdom** | £13,000 – £24,000 / year | £9,207 – £12,006 / year | 2 Years Graduate Route |
| 🇦🇺 **Australia** | AUD $22,000 – $42,000 / year | AUD $29,710 / year | 2 – 4 Years PSW |
| 🇨🇦 **Canada** | CAD $18,000 – $34,000 / year | CAD $20,635 / year | Up to 3 Years PGWP |
| 🇺🇸 **USA** | $20,000 – $45,000 / year | $12,000 – $18,000 / year | 1 – 3 Years OPT |

*💡 **Scholarship Tip**: Most students can reduce tuition by £2,000 – £8,000 through early FCC Global partner scholarships!*

👉 **[Get an Accurate Personalized Cost Estimate](/book-appointment)**`;
  }

  if (msg.includes('contact') || msg.includes('phone') || msg.includes('whatsapp') || msg.includes('office') || msg.includes('address') || msg.includes('email')) {
    return `### 📞 Connect Directly With FCC Global Education

* **London Headquarters**: Berkeley Square House, Mayfair, London W1J 6BD, United Kingdom
* **Phone Helpline**: +44 (0) 20 7946 0912
* **Admissions Email**: admissions@fccglobaleducation.com
* **Official WhatsApp**: Click the green WhatsApp button at the bottom right of the screen for instant counselor chat!
* **Book 1-on-1 Session**: [Book Appointment Online](/book-appointment)`;
  }

  // General Welcoming Response
  return `### 👋 Welcome to FCC Global Education

Thank you for your inquiry! As a premier global education and visa consultancy, we provide complete end-to-end guidance for international students:

* 🏛️ **University Selection & Shortlisting**: Matching your academic profile with top institutions across UK, USA, Canada, Australia & Europe.
* 💰 **Scholarship Maximization**: Securing tuition fee waivers and merit bursaries.
* 🛂 **Visa File Preparation**: High-compliance visa auditing with a 98.6% approval track record.
* 🎯 **Free Advisory Clinics**: 1-on-1 strategy sessions via HD video call or office visit.

How can I assist you further? You can ask about:
• **"Scholarships for 2026/2027"**
• **"UK or Canada admissions requirements"**
• **"How to book a free counseling call"**
• **"IELTS waiver options"**

Or speak directly with a human counselor:
👉 **[Book Free 1-on-1 Strategy Call](/book-appointment)**`;
}
