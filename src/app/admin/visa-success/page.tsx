'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  ShieldCheck,
  Plus,
  Search,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
  Globe,
  Upload,
  Image as ImageIcon,
  Check,
  X,
  Sparkles,
  Save,
  FileText,
  Sliders,
  Award,
  Layers,
  ArrowRight,
  Folder,
  FolderUp,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Building,
  MoveUp,
  MoveDown,
  LayoutGrid,
  PlusCircle,
} from 'lucide-react';
import { VisaSuccessItem, VisaSuccessPageSettings, HomepageVisaRow } from '@/lib/types';
import ToggleSwitch from '@/components/admin/ToggleSwitch';

const defaultHomepageRows: HomepageVisaRow[] = [
  {
    id: 'row-australia',
    title: 'Australia Student Visa Success Proofs',
    highlightText: 'Visa Success Proofs',
    badge: 'Australia Approvals',
    subtitle: 'Official Australian Department of Home Affairs (Subclass 500) student visa grant letters and approvals.',
    country: 'Australia',
    limit: 10,
    enabled: true,
  },
  {
    id: 'row-uk',
    title: 'United Kingdom Student Visa Success Proofs',
    highlightText: 'Visa Success Proofs',
    badge: 'UK & Global Approvals',
    subtitle: 'Official UKVI student visa grants, CAS confirmations, and verified consulate approval decisions.',
    country: 'United Kingdom',
    limit: 10,
    enabled: true,
  },
];

const defaultFrameworks = [
  {
    country: 'United Kingdom',
    flag: '🇬🇧',
    visaType: 'United Kingdom Student Route Visa',
    approvalRate: '98.6%',
    avgProcessing: '2 – 4 Weeks via Official Portal',
    fundsRule: 'Proof of liquid living funds + tuition receipt',
    interviewReq: 'Comprehensive Credibility & Mock Interview Clinic',
    keyHighlight: 'Post-Study Work: 2-3 Years Graduate Route',
  },
  {
    country: 'United States',
    flag: '🇺🇸',
    visaType: 'United States F-1 Student Visa',
    approvalRate: '95.4%',
    avgProcessing: '3 – 6 Weeks via Official Portal',
    fundsRule: 'First year tuition + living funds on I-20',
    interviewReq: 'Mandatory Consular Interview Prep & Mocks',
    keyHighlight: 'Post-Study Work: 1-3 Years STEM OPT',
  },
  {
    country: 'Canada',
    flag: '🇨🇦',
    visaType: 'Canada Study Permit Route',
    approvalRate: '96.2%',
    avgProcessing: '4 – 8 Weeks via Official Portal',
    fundsRule: 'GIC CAD $20,635 + First Year Tuition Proof',
    interviewReq: 'SOP Documentation Review & Biometrics',
    keyHighlight: 'Post-Study Work: Up to 3 Years PGWP',
  },
  {
    country: 'Australia',
    flag: '🇦🇺',
    visaType: 'Subclass 500 Student Visa',
    approvalRate: '97.8%',
    avgProcessing: '3 – 6 Weeks via Official Portal',
    fundsRule: 'Living costs AUD $29,710 + First Year Tuition',
    interviewReq: 'GS (Genuine Student) Statement Audit',
    keyHighlight: 'Post-Study Work: 2-4 Years Post-Study Work',
  },
  {
    country: 'Germany',
    flag: '🇩🇪',
    visaType: 'Germany National Student Visa',
    approvalRate: '99.1%',
    avgProcessing: '4 – 8 Weeks via Official Portal',
    fundsRule: 'Blocked Account (€11,904) + Health Insurance',
    interviewReq: 'Embassy Document Verification Clinic',
    keyHighlight: 'Post-Study Work: 18 Months Job Seeking Permit',
  },
];

const defaultStages = [
  {
    stageNumber: 'Stage 01',
    title: 'CAS / I-20 Audit',
    description: 'Verification that course start dates, fees, and passport details match academic records with zero discrepancies.',
  },
  {
    stageNumber: 'Stage 02',
    title: 'Financial Dossier Check',
    description: '28-day holding verification, sponsor affidavits, CA valuation, and tax return audits.',
  },
  {
    stageNumber: 'Stage 03',
    title: 'Statement of Purpose',
    description: 'Legal drafting of SOP proving academic continuity, home ties, and genuine temporary student intent.',
  },
  {
    stageNumber: 'Stage 04',
    title: 'Consular Mocks',
    description: '3 live 1-on-1 mock interviews simulating toughest questions on financing, post-study goals, and career progression.',
  },
  {
    stageNumber: 'Stage 05',
    title: 'Filing & Biometrics',
    description: 'Portal upload, VFS appointment booking, priority processing dispatch, and tracking until stamp collection.',
  },
];

const STANDARD_COUNTRIES = [
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'Germany',
  'Ireland',
  'New Zealand',
  'Sweden',
  'Netherlands',
];

export default function AdminVisaSuccessPage() {
  const [activeTab, setActiveTab] = useState<'content' | 'homepage-rows' | 'posters'>('content');

  // --- 1. POSTERS STATE ---
  const [items, setItems] = useState<VisaSuccessItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCustomCountry, setIsCustomCountry] = useState(false);
  const [customCountryName, setCustomCountryName] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<VisaSuccessItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [universities, setUniversities] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/universities')
      .then((r) => r.json())
      .then((d) => {
        if (d.universities) setUniversities(d.universities);
      })
      .catch(() => null);
  }, []);

  const initialForm: Partial<VisaSuccessItem> = {
    studentName: 'Student Visa Success',
    visaLetterImage: '',
    country: 'United Kingdom',
    countryCode: 'GB',
    approvalDays: 'Visa Approved',
    published: true,
    featured: true,
    showOnHomepage: false,
  };
  const [form, setForm] = useState<Partial<VisaSuccessItem>>(initialForm);

  const openAddPosterModal = () => {
    setEditingItem(null);
    setForm(initialForm);
    setIsCustomCountry(false);
    setCustomCountryName('');
    setIsModalOpen(true);
  };

  const openEditPosterModal = (item: VisaSuccessItem) => {
    setEditingItem(item);
    setForm({ ...item, showOnHomepage: Boolean(item.showOnHomepage) });
    const isCustom = !STANDARD_COUNTRIES.includes(item.country || '');
    setIsCustomCountry(isCustom);
    setCustomCountryName(isCustom ? (item.country || '') : '');
    setIsModalOpen(true);
  };

  // --- BULK FOLDER UPLOAD STATE ---
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkCountry, setBulkCountry] = useState('United Kingdom');
  const [bulkCountryCode, setBulkCountryCode] = useState('GB');
  const [isCustomBulkCountry, setIsCustomBulkCountry] = useState(false);
  const [customBulkCountryName, setCustomBulkCountryName] = useState('');
  const [bulkApprovalDays, setBulkApprovalDays] = useState('Visa Approved');
  const [bulkIntake, setBulkIntake] = useState('Fall 2026');
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkUploadProgress, setBulkUploadProgress] = useState({ current: 0, total: 0, percent: 0, statusText: '' });
  const folderInputRef = useRef<HTMLInputElement>(null);
  const multiFilesInputRef = useRef<HTMLInputElement>(null);

  // --- GALLERY PAGINATION & SELECTION STATE ---
  const [galleryPage, setGalleryPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [deletingBulk, setDeletingBulk] = useState(false);

  const openBulkUploadModal = () => {
    setIsBulkModalOpen(true);
    setBulkFiles([]);
    setIsCustomBulkCountry(false);
    setCustomBulkCountryName('');
    setBulkCountry('United Kingdom');
    setBulkCountryCode('GB');
    setBulkUploadProgress({ current: 0, total: 0, percent: 0, statusText: '' });
  };

  const isOnHomepage = (item: VisaSuccessItem) => {
    return Boolean(item.showOnHomepage);
  };

  const toggleHomepageSlider = async (item: VisaSuccessItem) => {
    const currentStatus = Boolean(item.showOnHomepage);
    const newStatus = !currentStatus;

    if (newStatus) {
      const countryName = item.country || 'this country';
      const countryActiveCount = items.filter(
        (it) => Boolean(it.showOnHomepage) && it.country?.toLowerCase() === item.country?.toLowerCase()
      ).length;

      if (countryActiveCount >= 10) {
        alert(
          `Homepage slider par ${countryName} ke liye maximum 10 results active ho sakte hain. Pehle kisi aur result ko untick karein.`
        );
        return;
      }
    }

    // Instantly update UI state optimistically
    setItems((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, showOnHomepage: newStatus } : it))
    );

    try {
      const res = await fetch('/api/admin/visa-success', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, showOnHomepage: newStatus }),
      });
      const data = await res.json();
      if (!data.success) {
        // Rollback on failure
        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, showOnHomepage: currentStatus } : it))
        );
        alert(data.error || 'Failed to update slider status');
      }
    } catch (err) {
      console.error(err);
      // Rollback on failure
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, showOnHomepage: currentStatus } : it))
      );
    }
  };

  const homepageSliderItems = items.filter((it) => Boolean(it.showOnHomepage));

  // --- 2. PAGE CMS SETTINGS STATE ---
  const [settings, setSettings] = useState<VisaSuccessPageSettings>({
    heroBadge: 'Verified Legal Immigration Compliance',
    heroTitle: 'Turning Study Dreams Into',
    heroTitleHighlight: 'Visa Success',
    heroDescription:
      'Our certified immigration solicitors and visa compliance officers audit every bank statement, tax filing, and sponsor affidavit before submission, ensuring near-perfect approval outcomes.',
    homepageRows: defaultHomepageRows,
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
    galleryDescription:
      'Browse genuine visa grant decisions and embassy approval stamps obtained by our scholars across the UK, USA, Canada, Australia, Germany, and Europe.',
    frameworksBadge: 'Country-Wise Protocols',
    frameworksTitle: 'Destination Visa Frameworks & Timelines',
    frameworksDescription:
      'Every country enforces distinct financial holding rules, attestation mandates, and interview procedures. Here is how our team manages them for you.',
    destinationFrameworks: defaultFrameworks,
    auditBadge: 'Why We Maintain 98.6% Success',
    auditTitle: 'Our 5-Stage Visa Pre-Audit Protocol',
    auditDescription:
      'We never submit a visa application until it has cleared every internal compliance hurdle.',
    auditStages: defaultStages,
    disclaimerTitle: 'Compliance Disclosure & Realistic Advisory Notice',
    disclaimerText:
      'FCC Global Education operates in strict compliance with international student recruitment standards. While our rigorous document audit produces an industry-leading 98.6% approval record, all visa grant determinations are the sole, sovereign prerogative of respective government immigration departments (such as UKVI, US Department of State, IRCC Canada, and Australian Home Affairs). We do not guarantee visa issuance; rather, we provide audit-standard representation that eliminates procedural and documentary refusal grounds.',
    ctaTitle: 'Have an Offer Letter and Need Flawless Visa Support?',
    ctaDescription:
      'Book a dedicated visa consultation with our licensed immigration compliance director. We audit your financial documents and organize your mock interview clinic.',
    ctaButtonText: 'Book Visa File Assessment',
  });
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Helper functions for Homepage Rows Management
  const addHomepageRow = () => {
    const newRowId = `row_${Date.now()}`;
    const newRow: HomepageVisaRow = {
      id: newRowId,
      title: 'Global Student Visa Success Proofs',
      highlightText: 'Visa Success Proofs',
      badge: 'Verified Approvals',
      subtitle: 'Official embassy student visa grants, CAS and I-20 approvals.',
      country: 'United States',
      limit: 10,
      enabled: true,
    };
    setSettings((prev) => ({
      ...prev,
      homepageRows: [...(prev.homepageRows || []), newRow],
    }));
  };

  const updateHomepageRow = (index: number, updates: Partial<HomepageVisaRow>) => {
    setSettings((prev) => {
      const rows = [...(prev.homepageRows || [])];
      rows[index] = { ...rows[index], ...updates };
      return { ...prev, homepageRows: rows };
    });
  };

  const removeHomepageRow = (index: number) => {
    if ((settings.homepageRows || []).length <= 1) {
      alert('Kam az kam 1 row Homepage par lazmi honi chahiye.');
      return;
    }
    if (!confirm('Kya aap waqai is row ko delete karna chahte hain?')) return;
    setSettings((prev) => {
      const rows = [...(prev.homepageRows || [])];
      rows.splice(index, 1);
      return { ...prev, homepageRows: rows };
    });
  };

  const moveHomepageRow = (index: number, direction: 'up' | 'down') => {
    setSettings((prev) => {
      const rows = [...(prev.homepageRows || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= rows.length) return prev;
      const temp = rows[index];
      rows[index] = rows[targetIndex];
      rows[targetIndex] = temp;
      return { ...prev, homepageRows: rows };
    });
  };

  // Editing framework card inside modal
  const [frameworkModalOpen, setFrameworkModalOpen] = useState(false);
  const [editingFrameworkIndex, setEditingFrameworkIndex] = useState<number | null>(null);
  const [frameworkForm, setFrameworkForm] = useState<any>({
    country: '',
    flag: '🌍',
    visaType: '',
    approvalRate: '98%',
    avgProcessing: '2 – 4 Weeks',
    fundsRule: '',
    interviewReq: '',
    keyHighlight: '',
  });

  // Fetch posters
  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/visa-success');
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch page settings
  const fetchSettings = async () => {
    try {
      setLoadingSettings(true);
      const res = await fetch('/api/admin/visa-success/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings((prev) => ({
          ...prev,
          ...data.settings,
          homepageRows:
            Array.isArray(data.settings.homepageRows) && data.settings.homepageRows.length > 0
              ? data.settings.homepageRows
              : prev.homepageRows || defaultHomepageRows,
          stats: { ...prev.stats, ...(data.settings.stats || {}) },
          destinationFrameworks:
            data.settings.destinationFrameworks && data.settings.destinationFrameworks.length > 0
              ? data.settings.destinationFrameworks
              : prev.destinationFrameworks,
          auditStages:
            data.settings.auditStages && data.settings.auditStages.length > 0
              ? data.settings.auditStages
              : prev.auditStages,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSettings(false);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchSettings();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setPreviewImage(null);
        setFrameworkModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save page settings
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingSettings(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/admin/visa-success/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert(data.error || 'Failed to save settings');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // Direct file upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'visas');

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.media?.url) {
        setForm((prev) => ({
          ...prev,
          visaLetterImage: data.media.url,
          studentName:
            prev.studentName && prev.studentName !== 'Student Visa Success'
              ? prev.studentName
              : file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        }));
      } else {
        alert(data.error || 'Failed to upload image file.');
      }
    } catch (err) {
      console.error(err);
      alert('File upload failed. Please retry.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.visaLetterImage) {
      alert('Please upload a Visa Success Poster Image.');
      return;
    }

    if (isCustomCountry) {
      if (!customCountryName.trim()) {
        alert('Please enter a custom destination country name.');
        return;
      }
    }

    const finalCountry = isCustomCountry
      ? customCountryName.trim()
      : (form.country || 'United Kingdom');
    const finalCode = isCustomCountry
      ? (finalCountry.slice(0, 2).toUpperCase() || 'GL')
      : (form.countryCode || 'GB');

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        country: finalCountry,
        countryCode: finalCode,
        studentName: form.studentName || 'Student Visa Success',
      };

      let res;
      if (editingItem) {
        res = await fetch('/api/admin/visa-success', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingItem.id,
            ...payload,
          }),
        });
      } else {
        res = await fetch('/api/admin/visa-success', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchItems();
      } else {
        alert(data.error || 'Failed to save visa success record');
      }
    } catch (err) {
      console.error(err);
      alert('Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Visa Success Poster?')) return;
    try {
      const res = await fetch(`/api/admin/visa-success?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => prev.filter((it) => it.id !== id));
      } else {
        alert(data.error || 'Delete failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const togglePublished = async (item: VisaSuccessItem) => {
    try {
      const newStatus = !item.published;
      const res = await fetch('/api/admin/visa-success', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, published: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, published: newStatus } : it))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Framework Card helpers
  const openAddFramework = () => {
    setEditingFrameworkIndex(null);
    setFrameworkForm({
      country: '',
      flag: '🌍',
      visaType: '',
      approvalRate: '98%',
      avgProcessing: '2 – 4 Weeks via Official Portal',
      fundsRule: 'Proof of liquid living funds + tuition receipt',
      interviewReq: 'Comprehensive Credibility & Mock Interview Clinic',
      keyHighlight: 'Post-study work rights available for eligible graduates.',
    });
    setFrameworkModalOpen(true);
  };

  const openEditFramework = (idx: number) => {
    setEditingFrameworkIndex(idx);
    setFrameworkForm(settings.destinationFrameworks?.[idx] || {});
    setFrameworkModalOpen(true);
  };

  const saveFrameworkCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!frameworkForm.country) {
      alert('Please provide a destination country name');
      return;
    }
    const list = [...(settings.destinationFrameworks || [])];
    if (editingFrameworkIndex !== null) {
      list[editingFrameworkIndex] = frameworkForm;
    } else {
      list.push(frameworkForm);
    }
    setSettings({ ...settings, destinationFrameworks: list });
    setFrameworkModalOpen(false);
  };

  const deleteFrameworkCard = (idx: number) => {
    if (!confirm('Remove this destination framework card?')) return;
    const list = (settings.destinationFrameworks || []).filter((_, i) => i !== idx);
    setSettings({ ...settings, destinationFrameworks: list });
  };

  // Bulk Upload Handlers
  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) {
      alert('Selected folder mein koi valid image (PNG, JPG, WEBP) nahi mili.');
      return;
    }
    setBulkFiles(files);
  };

  const handleMultipleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) return;
    setBulkFiles(files);
  };

  const handleBulkUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkFiles.length === 0) {
      alert('Meherbani kar ke pehle folder ya multiple images select karein.');
      return;
    }

    const finalCountry = isCustomBulkCountry ? customBulkCountryName.trim() : bulkCountry;
    if (!finalCountry) {
      alert('Meherbani kar ke destination country select ya enter karein.');
      return;
    }

    let code = 'GB';
    if (finalCountry === 'United States') code = 'US';
    else if (finalCountry === 'Canada') code = 'CA';
    else if (finalCountry === 'Australia') code = 'AU';
    else if (finalCountry === 'Germany') code = 'DE';
    else if (finalCountry === 'Ireland') code = 'IE';
    else if (finalCountry === 'New Zealand') code = 'NZ';
    else if (finalCountry === 'Sweden') code = 'SE';
    else if (finalCountry === 'Netherlands') code = 'NL';
    else code = finalCountry.slice(0, 2).toUpperCase() || 'GL';

    setBulkUploading(true);
    setBulkUploadProgress({
      current: 0,
      total: bulkFiles.length,
      percent: 0,
      statusText: `Starting upload of ${bulkFiles.length} visa posters...`,
    });

    try {
      const BATCH_SIZE = 10;
      let totalUploaded = 0;

      for (let i = 0; i < bulkFiles.length; i += BATCH_SIZE) {
        const batch = bulkFiles.slice(i, i + BATCH_SIZE);
        const formData = new FormData();
        formData.append('country', finalCountry);
        formData.append('countryCode', code);
        formData.append('approvalDays', bulkApprovalDays);
        formData.append('intake', bulkIntake);

        batch.forEach((file) => {
          formData.append('files', file);
        });

        const currentCount = Math.min(i + batch.length, bulkFiles.length);
        const percent = Math.round((currentCount / bulkFiles.length) * 100);

        setBulkUploadProgress({
          current: currentCount,
          total: bulkFiles.length,
          percent: percent,
          statusText: `Uploading ${currentCount} of ${bulkFiles.length} posters (${percent}%)...`,
        });

        const res = await fetch('/api/admin/visa-success/bulk', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to upload batch');
        }

        totalUploaded += (data.count || batch.length);
      }

      setBulkUploadProgress({
        current: bulkFiles.length,
        total: bulkFiles.length,
        percent: 100,
        statusText: `All ${totalUploaded} visa posters successfully uploaded!`,
      });

      alert(`✅ Success: ${totalUploaded} Visa Posters folder se upload ho gaye hain!\n\nYe ab gallery aur /visa-success page par pagination ke sath live hain. Homepage slider ke liye aap kisi bhi poster ko "Edit" kar ke Student Name aur University add kar sakte hain.`);
      setIsBulkModalOpen(false);
      setBulkFiles([]);
      fetchItems();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Bulk upload failed. Please try again.');
    } finally {
      setBulkUploading(false);
    }
  };

  const countriesList = Array.from(new Set(items.map((it) => it.country).filter(Boolean)));

  const filtered = items.filter((it) => {
    const matchesSearch =
      (it.studentName?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (it.country?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (it.approvalDays?.toLowerCase() || '').includes(search.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || it.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedItems = filtered.slice((galleryPage - 1) * itemsPerPage, galleryPage * itemsPerPage);

  // Selection helpers
  const isItemSelected = (id: string) => selectedItemIds.includes(id);

  const toggleSelectItem = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isAllPageSelected =
    paginatedItems.length > 0 && paginatedItems.every((it) => selectedItemIds.includes(it.id));

  const toggleSelectAllPage = () => {
    if (isAllPageSelected) {
      const pageIds = new Set(paginatedItems.map((it) => it.id));
      setSelectedItemIds((prev) => prev.filter((id) => !pageIds.has(id)));
    } else {
      const pageIds = paginatedItems.map((it) => it.id);
      setSelectedItemIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const selectAllFiltered = () => {
    setSelectedItemIds(filtered.map((it) => it.id));
  };

  const clearSelection = () => {
    setSelectedItemIds([]);
  };

  const handleDeleteSelected = async () => {
    if (selectedItemIds.length === 0) return;
    const count = selectedItemIds.length;
    if (
      !confirm(
        `⚠️ Kya aap waqai in ${count} Visa Posters ko aik sath delete karna chahte hain?\n\nYe action permanent hai aur wapas nahi laya ja sakta.`
      )
    ) {
      return;
    }

    setDeletingBulk(true);
    try {
      const res = await fetch('/api/admin/visa-success', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedItemIds }),
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => prev.filter((it) => !selectedItemIds.includes(it.id)));
        setSelectedItemIds([]);
        alert(`✅ ${data.deletedCount || count} Visa Posters kamyabi se delete ho gaye.`);
      } else {
        alert(data.error || 'Failed to delete selected posters.');
      }
    } catch (err) {
      console.error(err);
      alert('Delete operation failed. Please retry.');
    } finally {
      setDeletingBulk(false);
    }
  };

  // Reset page when search or country changes
  useEffect(() => {
    setGalleryPage(1);
  }, [search, selectedCountry]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-amber-600" />
            Visa Success Management & Page CMS
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage page content (hero, stats, gallery header, destination frameworks) and upload visa approval grant posters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'content' || activeTab === 'homepage-rows' ? (
            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition cursor-pointer disabled:opacity-50"
            >
              {savingSettings ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : saveSuccess ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{savingSettings ? 'Saving Changes...' : saveSuccess ? 'Saved Live!' : activeTab === 'homepage-rows' ? 'Save Homepage Rows' : 'Save Page Content'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openBulkUploadModal}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer border border-slate-700 hover:border-amber-400/50"
              >
                <FolderUp className="w-4 h-4 text-amber-400" />
                <span>Bulk / Folder Upload</span>
              </button>

              <button
                type="button"
                onClick={openAddPosterModal}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 transition cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Single Poster</span>
              </button>
            </div>
          )}

          <a
            href="/visa-success"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
          >
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>View Live Page</span>
          </a>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'content'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Page Content & Headings CMS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('homepage-rows')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'homepage-rows'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>★ Homepage Sliders (2 Rows Manager)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('posters')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'posters'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-amber-400" />
          <span>Visa Grant Letters Gallery ({items.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FULL PAGE CONTENT CMS */}
      {/* ========================================================================= */}
      {activeTab === 'content' && (
        <form onSubmit={handleSaveSettings} className="space-y-8">
          {/* 1. Hero Section Content */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  1. Hero Banner Content
                </h3>
              </div>
              <span className="text-[11px] text-slate-500">Top of /visa-success</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 text-xs font-bold mb-1">
                  Top Pill Badge
                </label>
                <input
                  type="text"
                  value={settings.heroBadge || ''}
                  onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
                  placeholder="VERIFIED LEGAL IMMIGRATION COMPLIANCE"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 text-xs font-bold mb-1">
                  Main Heading Title
                </label>
                <input
                  type="text"
                  value={settings.heroTitle || ''}
                  onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                  placeholder="Turning Study Dreams Into"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 text-xs font-bold mb-1">
                  Heading Highlight (Green)
                </label>
                <input
                  type="text"
                  value={settings.heroTitleHighlight || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, heroTitleHighlight: e.target.value })
                  }
                  placeholder="Visa Success"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-bold mb-1">
                Hero Subtitle / Description
              </label>
              <textarea
                rows={2}
                value={settings.heroDescription || ''}
                onChange={(e) => setSettings({ ...settings, heroDescription: e.target.value })}
                placeholder="Our certified immigration solicitors and visa compliance officers audit..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          {/* 2. Key Trust Statistics (4 Counters) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  2. Key Trust Statistics (4 Stat Counters)
                </h3>
              </div>
              <span className="text-[11px] text-slate-500">Live Numbers on Hero</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stat 1 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-[10px] font-bold text-emerald-600 uppercase">Counter 1</span>
                <div>
                  <label className="block text-slate-600 text-[11px] font-semibold mb-1">Value</label>
                  <input
                    type="text"
                    value={settings.stats?.stat1Value || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...settings.stats, stat1Value: e.target.value },
                      })
                    }
                    placeholder="98.6%"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-[11px] font-semibold mb-1">Label</label>
                  <input
                    type="text"
                    value={settings.stats?.stat1Label || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...settings.stats, stat1Label: e.target.value },
                      })
                    }
                    placeholder="Audited Visa Approval Rate"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700"
                  />
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-[10px] font-bold text-slate-900 uppercase">Counter 2</span>
                <div>
                  <label className="block text-slate-600 text-[11px] font-semibold mb-1">Value</label>
                  <input
                    type="text"
                    value={settings.stats?.stat2Value || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...settings.stats, stat2Value: e.target.value },
                      })
                    }
                    placeholder="5,000+"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-[11px] font-semibold mb-1">Label</label>
                  <input
                    type="text"
                    value={settings.stats?.stat2Label || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...settings.stats, stat2Label: e.target.value },
                      })
                    }
                    placeholder="Approved Student Visas"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700"
                  />
                </div>
              </div>

              {/* Stat 3 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-[10px] font-bold text-amber-600 uppercase">Counter 3</span>
                <div>
                  <label className="block text-slate-600 text-[11px] font-semibold mb-1">Value</label>
                  <input
                    type="text"
                    value={settings.stats?.stat3Value || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...settings.stats, stat3Value: e.target.value },
                      })
                    }
                    placeholder="12+"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-[11px] font-semibold mb-1">Label</label>
                  <input
                    type="text"
                    value={settings.stats?.stat3Label || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...settings.stats, stat3Label: e.target.value },
                      })
                    }
                    placeholder="Destination Consulates & Embassies"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700"
                  />
                </div>
              </div>

              {/* Stat 4 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-[10px] font-bold text-cyan-600 uppercase">Counter 4</span>
                <div>
                  <label className="block text-slate-600 text-[11px] font-semibold mb-1">Value</label>
                  <input
                    type="text"
                    value={settings.stats?.stat4Value || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...settings.stats, stat4Value: e.target.value },
                      })
                    }
                    placeholder="0%"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-[11px] font-semibold mb-1">Label</label>
                  <input
                    type="text"
                    value={settings.stats?.stat4Label || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...settings.stats, stat4Label: e.target.value },
                      })
                    }
                    placeholder="Refusal on Compliant Files"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Approval Letters Section Header */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-cyan-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  3. Verified Letters & Gallery Section Header
                </h3>
              </div>
              <span className="text-[11px] text-slate-500">Poster Showcase Headings</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 text-xs font-bold mb-1">
                  Gallery Badge
                </label>
                <input
                  type="text"
                  value={settings.galleryBadge || ''}
                  onChange={(e) => setSettings({ ...settings, galleryBadge: e.target.value })}
                  placeholder="Real Proofs & Official Stamps"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 text-xs font-bold mb-1">
                  Gallery Section Title
                </label>
                <input
                  type="text"
                  value={settings.galleryTitle || ''}
                  onChange={(e) => setSettings({ ...settings, galleryTitle: e.target.value })}
                  placeholder="Verified Student Visa Approval Letters"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-bold mb-1">
                Gallery Description
              </label>
              <textarea
                rows={2}
                value={settings.galleryDescription || ''}
                onChange={(e) =>
                  setSettings({ ...settings, galleryDescription: e.target.value })
                }
                placeholder="Browse genuine visa grant decisions and embassy approval stamps..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          {/* 4. Destination Visa Frameworks & Timelines (Section Header + Cards Manager) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  4. Destination Visa Frameworks & Timelines (Cards 4-5 Per Line)
                </h3>
              </div>
              <button
                type="button"
                onClick={openAddFramework}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 self-start cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Destination Card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 text-xs font-bold mb-1">
                  Section Pill Badge
                </label>
                <input
                  type="text"
                  value={settings.frameworksBadge || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, frameworksBadge: e.target.value })
                  }
                  placeholder="Country-Wise Protocols"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 text-xs font-bold mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={settings.frameworksTitle || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, frameworksTitle: e.target.value })
                  }
                  placeholder="Destination Visa Frameworks & Timelines"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-bold mb-1">
                Section Subtitle / Description
              </label>
              <textarea
                rows={2}
                value={settings.frameworksDescription || ''}
                onChange={(e) =>
                  setSettings({ ...settings, frameworksDescription: e.target.value })
                }
                placeholder="Every country enforces distinct financial holding rules..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            {/* List of Framework Cards */}
            <div className="pt-2">
              <label className="block text-slate-800 text-xs font-bold mb-2">
                Active Destination Cards ({settings.destinationFrameworks?.length || 0})
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {settings.destinationFrameworks?.map((card, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3 hover:border-amber-300 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{card.flag || '🌍'}</span>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{card.country}</div>
                            <div className="text-[10px] text-slate-500">{card.visaType}</div>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          {card.approvalRate}
                        </span>
                      </div>

                      <div className="mt-2 space-y-1 text-[11px] text-slate-600">
                        <div>
                          <strong className="text-slate-800">Turnaround:</strong>{' '}
                          {card.avgProcessing}
                        </div>
                        <div className="truncate">
                          <strong className="text-slate-800">Funds:</strong> {card.fundsRule}
                        </div>
                        <div className="truncate">
                          <strong className="text-slate-800">Interview:</strong> {card.interviewReq}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => openEditFramework(idx)}
                        className="px-2.5 py-1 rounded-lg text-slate-700 bg-white border border-slate-200 hover:bg-amber-50 hover:text-amber-800 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteFrameworkCard(idx)}
                        className="p-1 rounded-lg text-red-600 hover:bg-red-50 text-[11px] cursor-pointer"
                        title="Delete Card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. 5-Stage Visa Pre-Audit Protocol */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  5. 5-Stage Visa Pre-Audit Protocol
                </h3>
              </div>
              <span className="text-[11px] text-slate-500">Vetting Process Section</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 text-xs font-bold mb-1">
                  Audit Pill Badge
                </label>
                <input
                  type="text"
                  value={settings.auditBadge || ''}
                  onChange={(e) => setSettings({ ...settings, auditBadge: e.target.value })}
                  placeholder="Why We Maintain 98.6% Success"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 text-xs font-bold mb-1">
                  Audit Section Title
                </label>
                <input
                  type="text"
                  value={settings.auditTitle || ''}
                  onChange={(e) => setSettings({ ...settings, auditTitle: e.target.value })}
                  placeholder="Our 5-Stage Visa Pre-Audit Protocol"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-bold mb-1">
                Audit Description
              </label>
              <textarea
                rows={2}
                value={settings.auditDescription || ''}
                onChange={(e) =>
                  setSettings({ ...settings, auditDescription: e.target.value })
                }
                placeholder="We never submit a visa application until it has cleared every internal compliance hurdle."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            {/* Stages editor */}
            <div className="space-y-3 pt-2">
              <label className="block text-slate-800 text-xs font-bold">
                5 Audit Stages
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {settings.auditStages?.map((stage, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={stage.stageNumber || `Stage 0${idx + 1}`}
                        onChange={(e) => {
                          const stages = [...(settings.auditStages || [])];
                          stages[idx] = { ...stages[idx], stageNumber: e.target.value };
                          setSettings({ ...settings, auditStages: stages });
                        }}
                        className="text-xs font-bold text-amber-700 bg-white border border-slate-200 px-2 py-0.5 rounded w-24"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={stage.title || ''}
                        onChange={(e) => {
                          const stages = [...(settings.auditStages || [])];
                          stages[idx] = { ...stages[idx], title: e.target.value };
                          setSettings({ ...settings, auditStages: stages });
                        }}
                        placeholder="Stage Title"
                        className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg"
                      />
                    </div>
                    <div>
                      <textarea
                        rows={2}
                        value={stage.description || ''}
                        onChange={(e) => {
                          const stages = [...(settings.auditStages || [])];
                          stages[idx] = { ...stages[idx], description: e.target.value };
                          setSettings({ ...settings, auditStages: stages });
                        }}
                        placeholder="Stage description..."
                        className="w-full text-[11px] text-slate-600 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Bottom Save Bar */}
          <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-300 p-4 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Edits will reflect live immediately on the website upon saving.</span>
            </div>
            <button
              type="submit"
              disabled={savingSettings}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition cursor-pointer disabled:opacity-50"
            >
              {savingSettings ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : saveSuccess ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{savingSettings ? 'Saving Content...' : saveSuccess ? 'Saved Live!' : 'Save All Page Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: HOMEPAGE SLIDERS (2 ROWS MANAGER) */}
      {/* ========================================================================= */}
      {activeTab === 'homepage-rows' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0">
                <Sliders className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">
                    Homepage Visa Proofs Sliders (Rows Manager)
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Live On Homepage
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Configure the 2 rows displayed on the Homepage. Row 1 shows Australia visa grants and Row 2 shows United Kingdom &amp; other destinations (10 posters each). You can customize headings, target countries, badges, limits, or add new rows.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={addHomepageRow}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Add New Row</span>
              </button>

              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition cursor-pointer disabled:opacity-50"
              >
                {savingSettings ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : saveSuccess ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{savingSettings ? 'Saving...' : saveSuccess ? 'Saved Live!' : 'Save Homepage Rows'}</span>
              </button>
            </div>
          </div>

          {/* Rows List */}
          <div className="space-y-4">
            {(settings.homepageRows || defaultHomepageRows).map((row, idx) => {
              const matchingPosters = items.filter(
                (it) => it.country?.toLowerCase() === (row.country || '').toLowerCase()
              );
              const activeCount = matchingPosters.filter((it) => Boolean(it.showOnHomepage)).length;

              return (
                <div
                  key={row.id || idx}
                  className={`bg-white rounded-2xl border-2 transition-all p-5 shadow-xs space-y-4 ${
                    row.enabled !== false ? 'border-amber-300/80' : 'border-slate-200 opacity-70'
                  }`}
                >
                  {/* Row Top Status & Reordering */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-3 py-1 rounded-xl font-black text-xs bg-slate-900 text-amber-400 shadow-2xs">
                        Row #{idx + 1} {idx === 0 ? '(Top Row - Australia)' : idx === 1 ? '(Second Row - UK)' : ''}
                      </span>
                      <span className="text-sm font-extrabold text-slate-800">
                        Target Country: <span className="text-amber-700">{row.country || 'Global'}</span>
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                        {matchingPosters.length} posters in database • {activeCount} pinned for slider
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveHomepageRow(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveHomepageRow(idx, 'down')}
                        disabled={idx === (settings.homepageRows || []).length - 1}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-1.5 ml-2">
                        <span className="text-xs font-semibold text-slate-600">Active</span>
                        <ToggleSwitch
                          enabled={row.enabled !== false}
                          onChange={(val) => updateHomepageRow(idx, { enabled: val })}
                        />
                      </div>

                      {(settings.homepageRows || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHomepageRow(idx)}
                          className="p-1.5 ml-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
                          title="Delete Row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Row Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                      <label className="block text-slate-700 text-xs font-bold mb-1">
                        Row Heading Title
                      </label>
                      <input
                        type="text"
                        value={row.title || ''}
                        onChange={(e) => updateHomepageRow(idx, { title: e.target.value })}
                        placeholder="e.g. Australia Student Visa Success Proofs"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 text-xs font-bold mb-1">
                        Target Country
                      </label>
                      <select
                        value={row.country || 'Australia'}
                        onChange={(e) => updateHomepageRow(idx, { country: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white cursor-pointer"
                      >
                        <option value="Australia">Australia</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="Germany">Germany</option>
                        <option value="Ireland">Ireland</option>
                        <option value="New Zealand">New Zealand</option>
                        <option value="All">All Countries</option>
                        <option value="Other">Other Countries</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 text-xs font-bold mb-1">
                        Pill Badge Label
                      </label>
                      <input
                        type="text"
                        value={row.badge || ''}
                        onChange={(e) => updateHomepageRow(idx, { badge: e.target.value })}
                        placeholder="e.g. Australia Approvals"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 text-xs font-bold mb-1">
                        Highlighted Text in Heading
                      </label>
                      <input
                        type="text"
                        value={row.highlightText || ''}
                        onChange={(e) => updateHomepageRow(idx, { highlightText: e.target.value })}
                        placeholder="e.g. Visa Success Proofs"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 text-xs font-bold mb-1">
                        Slider Posters Limit
                      </label>
                      <input
                        type="number"
                        min={4}
                        max={20}
                        value={row.limit || 10}
                        onChange={(e) => updateHomepageRow(idx, { limit: parseInt(e.target.value) || 10 })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                      />
                    </div>

                    <div className="lg:col-span-3">
                      <label className="block text-slate-700 text-xs font-bold mb-1">
                        Row Subtitle / Short Description
                      </label>
                      <input
                        type="text"
                        value={row.subtitle || ''}
                        onChange={(e) => updateHomepageRow(idx, { subtitle: e.target.value })}
                        placeholder="e.g. Official Australian Department of Home Affairs (Subclass 500) student visa grant letters and approvals."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Bottom Save Bar for Homepage Rows */}
          <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-300 p-4 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Rows configuration saves directly to database and updates Homepage immediately.</span>
            </div>
            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition cursor-pointer disabled:opacity-50"
            >
              {savingSettings ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : saveSuccess ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{savingSettings ? 'Saving Rows...' : saveSuccess ? 'Saved Live!' : 'Save Homepage Rows'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: VISA APPROVAL POSTERS GALLERY */}
      {/* ========================================================================= */}
      {activeTab === 'posters' && (
        <div className="space-y-6">
          {/* 🌟 Dedicated Active Homepage Slider Queue (Max 10) */}
          <div className="bg-white rounded-3xl border-2 border-amber-300/90 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center font-black text-lg shadow-xs">
                  ★
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                      Homepage Sliders Active Pinned Results
                    </h3>
                    <span className="text-xs bg-amber-100 text-amber-900 border border-amber-300 px-3 py-0.5 rounded-full font-black">
                      {homepageSliderItems.length} Total Pinned
                    </span>
                    {Object.entries(
                      homepageSliderItems.reduce((acc: Record<string, number>, it) => {
                        const c = it.country || 'Global';
                        acc[c] = (acc[c] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([country, count]) => (
                      <span key={country} className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-2xs">
                        <span>✓ {country}:</span>
                        <span className="font-black">{count}/10 Live</span>
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                    <strong>Strict Admin Control:</strong> Homepage par sirf wahi posters show honge jo aap neechay gallery me tick karenge (&ldquo;+ Allow / Add to Homepage Slider&rdquo;). Agar kisi country ke posters tick nahi honge, to wo Homepage par bilkul show nahi honge.
                  </p>
                </div>
              </div>
            </div>

            {homepageSliderItems.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto font-bold text-sm">
                  ★
                </div>
                <div className="font-bold text-slate-800 text-sm">Abhi koi result Homepage slider par active nahi hai</div>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Neechay gallery mein kisi bhi card ke neechay &ldquo;+ Add to Homepage Slider&rdquo; checkbox par click karein.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
                {homepageSliderItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="relative group bg-slate-50 hover:bg-white rounded-2xl p-2 border-2 border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <span className="absolute top-1.5 left-1.5 z-10 text-[9px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-md shadow-xs">
                      #{idx + 1}
                    </span>
                    <div className="aspect-[3/4] sm:aspect-[4/5] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer" onClick={() => setPreviewImage(item.visaLetterImage)}>
                      <img
                        src={item.visaLetterImage}
                        alt={`${item.country} Visa`}
                        className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="mt-1.5 text-center">
                      <div className="text-[11px] font-extrabold text-slate-900 truncate">
                        {item.country} Visa Grant
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleHomepageSlider(item)}
                      className="mt-2 w-full py-1 text-[10px] font-bold rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1"
                      title="Remove from Homepage Slider"
                    >
                      <X className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student name, title, or country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-xs"
              />
            </div>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-amber-500 shadow-xs cursor-pointer"
            >
              <option value="all">All Countries ({items.length})</option>
              {countriesList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Bulk Select & Actions Bar */}
          {filtered.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Select All on Page Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-800 select-none bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition">
                  <input
                    type="checkbox"
                    checked={isAllPageSelected}
                    onChange={toggleSelectAllPage}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer accent-amber-500"
                  />
                  <span>Select All on Page ({paginatedItems.length})</span>
                </label>

                {/* Select All in Entire Filtered List */}
                {filtered.length > paginatedItems.length && (
                  <button
                    type="button"
                    onClick={selectAllFiltered}
                    className="text-xs font-semibold text-amber-700 hover:text-amber-800 underline cursor-pointer"
                  >
                    Select All {filtered.length} in Gallery
                  </button>
                )}

                {/* Selected Count Indicator */}
                {selectedItemIds.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg">
                      ✓ {selectedItemIds.length} Selected
                    </span>
                    <button
                      type="button"
                      onClick={clearSelection}
                      className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                {/* Speed & Page Size Selector */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="font-semibold text-slate-500">Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setGalleryPage(1);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer shadow-2xs"
                  >
                    <option value={50}>50 per page (Recommended)</option>
                    <option value={100}>100 per page</option>
                    <option value={24}>24 per page</option>
                    <option value={12}>12 per page</option>
                  </select>
                </div>

                {/* Bulk Delete Button */}
                {selectedItemIds.length > 0 && (
                  <button
                    type="button"
                    onClick={handleDeleteSelected}
                    disabled={deletingBulk}
                    className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-red-600/30 transition cursor-pointer animate-in fade-in duration-150 disabled:opacity-50"
                  >
                    {deletingBulk ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    <span>Delete Selected ({selectedItemIds.length})</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Grid of Visa Poster Cards */}
          {loading ? (
            <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
              Loading Visa Success posters...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 space-y-3">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-800 text-sm">No Visa Success Posters uploaded yet</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click &ldquo;Upload New Visa Poster&rdquo; to select and upload your first visa success graphic.
              </p>
              <button
                onClick={openAddPosterModal}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs inline-flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" /> Upload Poster
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedItems.map((item) => {
                  const isSelected = isItemSelected(item.id);

                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between group overflow-hidden ${
                        isSelected
                          ? 'border-amber-500 ring-2 ring-amber-400 shadow-md bg-amber-50/15'
                          : 'border-slate-200 shadow-xs hover:shadow-lg'
                      }`}
                    >
                      {/* Card Poster Image with Anti-Crop Showcase */}
                      <div
                        className="relative aspect-[3/4] sm:aspect-[4/5] bg-slate-900/5 overflow-hidden cursor-pointer flex items-center justify-center select-none"
                        onClick={() => setPreviewImage(item.visaLetterImage)}
                      >
                        {/* Ambient backdrop blur */}
                        <img
                          src={item.visaLetterImage}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-25 pointer-events-none"
                        />
                        {/* Foreground crisp image */}
                        <img
                          src={item.visaLetterImage}
                          alt={`${item.country || 'Visa'} Success Proof`}
                          className="relative z-10 w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            if (!target.src.includes('unsplash.com/photo-1544717305-2782549b5136')) {
                              target.src =
                                'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80';
                            }
                          }}
                        />

                        {/* Top Left Speed Tag */}
                        <div className="absolute top-2.5 left-2.5 z-20">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                            {item.approvalDays || 'Visa Approved'}
                          </span>
                        </div>

                        {/* Top Right Multi-Select Checkbox */}
                        <div
                          className="absolute top-2.5 right-2.5 z-30"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <label className="flex items-center justify-center w-7 h-7 rounded-xl bg-white/95 backdrop-blur-md border border-slate-300 shadow-sm cursor-pointer hover:bg-white hover:scale-105 transition-all">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectItem(item.id)}
                              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer accent-amber-500"
                            />
                          </label>
                        </div>

                        {/* Hover Click to Zoom */}
                        <div className="absolute inset-0 z-20 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="px-3 py-1.5 rounded-xl bg-white text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md">
                            <Eye className="w-3.5 h-3.5 text-amber-600" /> Click to Zoom
                          </span>
                        </div>
                      </div>

                      {/* Clean Card Info - Country & Approval, No Student Name / University */}
                      <div className="p-2.5 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-extrabold text-slate-900 flex items-center gap-1.5 truncate">
                          <Globe className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="truncate">{item.country} Visa Grant</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                          {item.approvalDays || 'Approved'}
                        </span>
                      </div>

                      {/* Homepage Slider Checkbox Option */}
                      <div className={`px-3.5 py-2.5 border-t transition-colors flex items-center justify-between text-xs ${
                        Boolean(item.showOnHomepage)
                          ? 'bg-amber-50/90 border-amber-200'
                          : 'bg-slate-50 border-slate-100'
                      }`}>
                        <label className="flex items-center gap-2 cursor-pointer text-slate-800 select-none w-full">
                          <input
                            type="checkbox"
                            checked={Boolean(item.showOnHomepage)}
                            onChange={() => toggleHomepageSlider(item)}
                            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer accent-amber-500"
                          />
                          <span className={Boolean(item.showOnHomepage) ? 'font-black text-amber-950 flex items-center gap-1 text-[11px]' : 'font-medium text-slate-600 hover:text-slate-900 text-[11px]'}>
                            {Boolean(item.showOnHomepage) ? '★ Live on Homepage Slider (Active)' : '+ Allow / Add to Homepage Slider'}
                          </span>
                        </label>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => togglePublished(item)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                            item.published !== false
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          {item.published !== false ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Live
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-slate-500" /> Hidden
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEditPosterModal(item)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-white border border-transparent hover:border-slate-200 transition cursor-pointer"
                            title="Edit Record (Add Name, University, etc.)"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Gallery Pagination Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 pb-2 border-t border-slate-200">
                <div className="text-xs text-slate-500 font-medium">
                  Showing <span className="font-bold text-slate-900">{Math.min((galleryPage - 1) * itemsPerPage + 1, filtered.length)}</span> to{' '}
                  <span className="font-bold text-slate-900">{Math.min(galleryPage * itemsPerPage, filtered.length)}</span> of{' '}
                  <span className="font-bold text-slate-900">{filtered.length}</span> Total Visa Posters (Page {galleryPage} of {totalPages})
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setGalleryPage((p) => Math.max(1, p - 1))}
                    disabled={galleryPage === 1}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, idx) => idx + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - galleryPage) <= 2)
                      .map((p, idx, arr) => (
                        <React.Fragment key={p}>
                          {idx > 0 && arr[idx - 1] !== p - 1 && (
                            <span className="text-xs text-slate-400 px-1">...</span>
                          )}
                          <button
                            type="button"
                            onClick={() => setGalleryPage(p)}
                            className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                              galleryPage === p
                                ? 'bg-amber-500 text-slate-950 shadow-xs'
                                : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {p}
                          </button>
                        </React.Fragment>
                      ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setGalleryPage((p) => Math.min(totalPages, p + 1))}
                    disabled={galleryPage === totalPages}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: POSTER UPLOAD / EDIT */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header with prominent [X Close] Button */}
            <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center font-bold">
                  <Upload className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {editingItem ? 'Edit Visa Success Poster' : 'Upload Visa Success Poster'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Student visa grant graphic & destination details</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-200 hover:border-red-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                title="Close Modal (Escape)"
              >
                <X className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {/* Primary Direct File Upload Dropzone */}
              <div>
                <label className="block text-slate-800 mb-1.5 font-bold">
                  Visa Success Poster Graphic *
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {form.visaLetterImage ? (
                  <div className="relative aspect-[4/3] max-h-56 rounded-2xl border-2 border-emerald-300 bg-slate-50 overflow-hidden flex items-center justify-center p-2 group">
                    <img
                      src={form.visaLetterImage}
                      alt="Uploaded poster preview"
                      className="w-full h-full object-contain rounded-xl"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-white text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-slate-100 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-amber-600" /> Replace Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewImage(form.visaLetterImage || null)}
                        className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-amber-300 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> Full View
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-[4/3] rounded-2xl border-2 border-dashed border-amber-400/80 bg-amber-50/50 hover:bg-amber-50 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all hover:border-amber-500"
                  >
                    {uploadingFile ? (
                      <div className="space-y-2">
                        <RefreshCw className="w-8 h-8 animate-spin text-amber-600 mx-auto" />
                        <div className="font-bold text-slate-800 text-sm">Uploading your image...</div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto text-amber-800 shadow-xs">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div className="font-bold text-slate-900 text-sm">
                          Click to select Visa Success Poster from your Computer
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Supports PNG, JPG, JPEG, WEBP posters / eVisa graphics
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Information Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">
                    Student Name / Poster Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.studentName || ''}
                    onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                    placeholder="e.g. Saher Malik - UK Visa"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Destination Country *</label>
                  <select
                    value={isCustomCountry ? 'Other' : (form.country || 'United Kingdom')}
                    onChange={(e) => {
                      const c = e.target.value;
                      if (c === 'Other') {
                        setIsCustomCountry(true);
                        setCustomCountryName('');
                        setForm((prev) => ({ ...prev, country: '', countryCode: 'GL' }));
                      } else {
                        setIsCustomCountry(false);
                        setCustomCountryName('');
                        let code = 'GB';
                        if (c === 'United States') code = 'US';
                        else if (c === 'Canada') code = 'CA';
                        else if (c === 'Australia') code = 'AU';
                        else if (c === 'Germany') code = 'DE';
                        else if (c === 'Ireland') code = 'IE';
                        else if (c === 'New Zealand') code = 'NZ';
                        else if (c === 'Sweden') code = 'SE';
                        else if (c === 'Netherlands') code = 'NL';
                        setForm((prev) => ({ ...prev, country: c, countryCode: code, university: '' }));
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white font-medium cursor-pointer"
                  >
                    <option value="United Kingdom">United Kingdom (UK)</option>
                    <option value="United States">United States (USA)</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="Ireland">Ireland</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Netherlands">Netherlands</option>
                    {/* Render any existing custom countries from items that aren't in STANDARD_COUNTRIES */}
                    {countriesList
                      .filter((c) => !STANDARD_COUNTRIES.includes(c))
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    <option value="Other" className="font-bold text-amber-700">
                      ★ Other (Apni Marzi Se Country Add Karein...)
                    </option>
                  </select>
                </div>
              </div>

              {/* Dynamic Custom Country Input Field */}
              {isCustomCountry && (
                <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-300 space-y-1.5 animate-in fade-in duration-150">
                  <label className="block text-amber-950 font-bold text-[11px] flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-amber-600" />
                    <span>Enter Custom Country Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customCountryName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomCountryName(val);
                      setForm((prev) => ({
                        ...prev,
                        country: val,
                        countryCode: val.slice(0, 2).toUpperCase() || 'GL',
                        university: '',
                      }));
                    }}
                    placeholder="e.g. Italy, France, Malaysia, Turkey, Cyprus, Poland, etc."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-amber-300 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <p className="text-[10px] text-slate-600">
                    Ye custom country live page ke destination filters aur stats mein automatically add ho jayegi.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Approval Tag / Badge</label>
                  <input
                    type="text"
                    value={form.approvalDays || ''}
                    onChange={(e) => setForm({ ...form, approvalDays: e.target.value })}
                    placeholder="e.g. UK Student Visa / Approved in 5 Days"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-semibold">University ({form.country || 'Target Country'})</label>
                    <span className="text-[10px] text-amber-700 font-medium">
                      {universities.filter((u) => u.country?.toLowerCase() === (form.country || '').toLowerCase()).length} in {form.country || 'Selected Country'}
                    </span>
                  </div>
                  <select
                    value={form.university || ''}
                    onChange={(e) => setForm({ ...form, university: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white cursor-pointer"
                  >
                    <option value="">-- Choose {form.country || 'Country'} University or Open --</option>
                    {universities
                      .filter((u) => u.country?.toLowerCase() === (form.country || '').toLowerCase())
                      .map((u) => (
                        <option key={u.id || u.name} value={u.name}>
                          {u.name} {u.city ? `(${u.city})` : ''}
                        </option>
                      ))}
                    <option value="Other">Other / Unlisted University</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-1">
                <ToggleSwitch
                  checked={form.published !== false}
                  onChange={(val) => setForm({ ...form, published: val })}
                  label="Publish on Website"
                  description="Display in the public visa grant proof gallery"
                  activeColor="emerald"
                />

                <ToggleSwitch
                  checked={form.showOnHomepage !== false}
                  onChange={(val) => setForm({ ...form, showOnHomepage: val })}
                  label="Show on Homepage Slider"
                  description="Highlight in the verified visa slider queue on homepage"
                  activeColor="amber"
                />
              </div>

              {/* Sticky Bottom Actions inside form */}
              <div className="sticky bottom-0 -mx-5 -mb-5 px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 rounded-b-3xl mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel / Close</span>
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingFile || !form.visaLetterImage}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{submitting ? 'Saving Poster...' : editingItem ? 'Update Poster' : 'Save & Publish Poster'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DESTINATION FRAMEWORK CARD EDIT / ADD */}
      {/* ========================================================================= */}
      {frameworkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl my-8 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-600" />
                {editingFrameworkIndex !== null ? 'Edit Destination Card' : 'Add Destination Card'}
              </h3>
              <button
                type="button"
                onClick={() => setFrameworkModalOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors cursor-pointer shrink-0"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={saveFrameworkCard} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-700 mb-1 font-bold">Country Name *</label>
                  <input
                    type="text"
                    required
                    value={frameworkForm.country || ''}
                    onChange={(e) => setFrameworkForm({ ...frameworkForm, country: e.target.value })}
                    placeholder="e.g. United Kingdom"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Flag Emoji</label>
                  <input
                    type="text"
                    value={frameworkForm.flag || '🌍'}
                    onChange={(e) => setFrameworkForm({ ...frameworkForm, flag: e.target.value })}
                    placeholder="🇬🇧"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-center text-base focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Visa Route Label</label>
                  <input
                    type="text"
                    value={frameworkForm.visaType || ''}
                    onChange={(e) => setFrameworkForm({ ...frameworkForm, visaType: e.target.value })}
                    placeholder="e.g. UK Student Route Visa"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Approval Rate</label>
                  <input
                    type="text"
                    value={frameworkForm.approvalRate || ''}
                    onChange={(e) => setFrameworkForm({ ...frameworkForm, approvalRate: e.target.value })}
                    placeholder="e.g. 98.6%"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Processing Turnaround</label>
                <input
                  type="text"
                  value={frameworkForm.avgProcessing || ''}
                  onChange={(e) => setFrameworkForm({ ...frameworkForm, avgProcessing: e.target.value })}
                  placeholder="e.g. 2 – 4 Weeks via Official Portal"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Financial Proof Required</label>
                <input
                  type="text"
                  value={frameworkForm.fundsRule || ''}
                  onChange={(e) => setFrameworkForm({ ...frameworkForm, fundsRule: e.target.value })}
                  placeholder="e.g. Proof of liquid living funds + tuition receipt"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Interview Simulation / Prep</label>
                <input
                  type="text"
                  value={frameworkForm.interviewReq || ''}
                  onChange={(e) => setFrameworkForm({ ...frameworkForm, interviewReq: e.target.value })}
                  placeholder="e.g. Comprehensive Credibility & Mock Interview Clinic"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Key Highlight (Post-Study Work)</label>
                <input
                  type="text"
                  value={frameworkForm.keyHighlight || ''}
                  onChange={(e) => setFrameworkForm({ ...frameworkForm, keyHighlight: e.target.value })}
                  placeholder="e.g. Post-Study Work: 2-3 Years Graduate Route"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setFrameworkModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer shadow-xs"
                >
                  {editingFrameworkIndex !== null ? 'Update Card' : 'Add Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BULK / FOLDER VISA UPLOAD */}
      {/* ========================================================================= */}
      {isBulkModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
          onClick={() => {
            if (!bulkUploading) setIsBulkModalOpen(false);
          }}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center font-bold">
                  <FolderUp className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    Bulk Folder & Multiple Visas Upload
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Ek sath poora folder ya multiple visa letters upload karein
                  </p>
                </div>
              </div>
              {!bulkUploading && (
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                  <span>Close</span>
                </button>
              )}
            </div>

            {/* Hidden Input Elements */}
            <input
              type="file"
              ref={folderInputRef}
              {...({ webkitdirectory: '', directory: '', multiple: true } as any)}
              onChange={handleFolderSelect}
              className="hidden"
            />
            <input
              type="file"
              ref={multiFilesInputRef}
              multiple
              accept="image/*"
              onChange={handleMultipleFilesSelect}
              className="hidden"
            />

            {/* Form Body */}
            <form onSubmit={handleBulkUploadSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              {/* Step 1: Destination Country (Required) */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-900 font-bold text-xs flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-amber-600" />
                    <span>1. Destination Country Select Karein (Required) *</span>
                  </label>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Required
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Folder ke saray uploaded visas is country ke sath register honge.
                </p>

                <select
                  value={isCustomBulkCountry ? 'Other' : bulkCountry}
                  onChange={(e) => {
                    const c = e.target.value;
                    if (c === 'Other') {
                      setIsCustomBulkCountry(true);
                      setCustomBulkCountryName('');
                      setBulkCountry('');
                      setBulkCountryCode('GL');
                    } else {
                      setIsCustomBulkCountry(false);
                      setCustomBulkCountryName('');
                      setBulkCountry(c);
                      let code = 'GB';
                      if (c === 'United States') code = 'US';
                      else if (c === 'Canada') code = 'CA';
                      else if (c === 'Australia') code = 'AU';
                      else if (c === 'Germany') code = 'DE';
                      else if (c === 'Ireland') code = 'IE';
                      else if (c === 'New Zealand') code = 'NZ';
                      else if (c === 'Sweden') code = 'SE';
                      else if (c === 'Netherlands') code = 'NL';
                      setBulkCountryCode(code);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold text-xs focus:outline-none focus:border-amber-500 cursor-pointer shadow-2xs"
                >
                  <option value="United Kingdom">United Kingdom (UK)</option>
                  <option value="United States">United States (USA)</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="Ireland">Ireland</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="Sweden">Sweden</option>
                  <option value="Netherlands">Netherlands</option>
                  {countriesList
                    .filter((c) => !STANDARD_COUNTRIES.includes(c))
                    .map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  <option value="Other" className="font-bold text-amber-700">
                    ★ Other (Enter Custom Country...)
                  </option>
                </select>

                {isCustomBulkCountry && (
                  <div className="pt-2 animate-in fade-in duration-150">
                    <input
                      type="text"
                      required
                      placeholder="Enter custom country name..."
                      value={customBulkCountryName}
                      onChange={(e) => setCustomBulkCountryName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-amber-300 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-semibold"
                    />
                  </div>
                )}
              </div>

              {/* Step 2: Choose Folder or Multiple Images */}
              <div className="space-y-3">
                <label className="block text-slate-900 font-bold text-xs flex items-center gap-1.5">
                  <Folder className="w-4 h-4 text-amber-600" />
                  <span>2. Folder ya Multiple Files Select Karein *</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Select Entire Folder Button */}
                  <div
                    onClick={() => {
                      if (!bulkUploading) folderInputRef.current?.click();
                    }}
                    className="p-4 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50/40 hover:bg-amber-50 hover:border-amber-500 transition-all flex flex-col items-center justify-center text-center cursor-pointer group space-y-2 select-none"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Folder className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">
                        Select Entire Folder
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Computer se poora folder select karein
                      </p>
                    </div>
                  </div>

                  {/* Select Multiple Images Button */}
                  <div
                    onClick={() => {
                      if (!bulkUploading) multiFilesInputRef.current?.click();
                    }}
                    className="p-4 rounded-2xl border-2 border-dashed border-cyan-400 bg-cyan-50/40 hover:bg-cyan-50 hover:border-cyan-500 transition-all flex flex-col items-center justify-center text-center cursor-pointer group space-y-2 select-none"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-100 border border-cyan-300 text-cyan-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Upload className="w-5 h-5 text-cyan-700" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">
                        Select Multiple Images
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Multiple files (10, 20, 50+) pick karein
                      </p>
                    </div>
                  </div>
                </div>

                {/* Selected Files Preview List */}
                {bulkFiles.length > 0 ? (
                  <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{bulkFiles.length} Visa Posters Selected Ready to Upload</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setBulkFiles([])}
                        className="text-[10px] font-bold text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        Clear List
                      </button>
                    </div>

                    <div className="max-h-28 overflow-y-auto pr-1 space-y-1">
                      {bulkFiles.slice(0, 15).map((f, i) => (
                        <div
                          key={i}
                          className="text-[10px] text-emerald-800 bg-white/80 px-2 py-0.5 rounded border border-emerald-100 flex items-center justify-between"
                        >
                          <span className="truncate max-w-[320px]">{f.name}</span>
                          <span className="text-slate-400 font-mono">
                            {(f.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                        </div>
                      ))}
                      {bulkFiles.length > 15 && (
                        <div className="text-[10px] text-emerald-700 font-semibold italic text-center">
                          + {bulkFiles.length - 15} more files selected
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-[11px] text-slate-400 py-1">
                    Abhi koi files select nahi ki gayin. Upar kisi bhi option par click karein.
                  </div>
                )}
              </div>

              {/* Step 3: Default Optional Settings */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold text-[11px]">
                    Default Approval Tag
                  </label>
                  <input
                    type="text"
                    value={bulkApprovalDays}
                    onChange={(e) => setBulkApprovalDays(e.target.value)}
                    placeholder="e.g. Visa Approved"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold text-[11px]">
                    Default Intake
                  </label>
                  <input
                    type="text"
                    value={bulkIntake}
                    onChange={(e) => setBulkIntake(e.target.value)}
                    placeholder="e.g. Fall 2026"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>
              </div>

              {/* Informational Guidance Alert */}
              <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 text-[11px] text-amber-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Important Note:</span>
                </div>
                <p className="leading-relaxed">
                  Bulk upload hone ke baad saray posters <strong>Admin Gallery</strong> aur <strong>Public /visa-success</strong> page par pagination ke sath live ho jayenge.
                  <br />
                  <strong>Homepage Slider</strong> par show karne ke liye unka <strong>Student Name</strong> aur <strong>University</strong> lazmi hai, jo aap baad mein kisi bhi waqt card ke &ldquo;Edit&rdquo; icon par click kar ke add kar sakte hain.
                </p>
              </div>

              {/* Live Upload Progress */}
              {bulkUploading && (
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{bulkUploadProgress.statusText}</span>
                    </span>
                    <span className="font-mono font-bold">{bulkUploadProgress.percent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300 rounded-full"
                      style={{ width: `${bulkUploadProgress.percent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Sticky Footer Submit Bar */}
              <div className="sticky bottom-0 -mx-6 -mb-6 px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 rounded-b-3xl mt-4">
                <button
                  type="button"
                  disabled={bulkUploading}
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer shadow-xs disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={bulkUploading || bulkFiles.length === 0}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                >
                  {bulkUploading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <FolderUp className="w-4 h-4" />
                  )}
                  <span>
                    {bulkUploading
                      ? 'Uploading Posters...'
                      : `Start Bulk Upload (${bulkFiles.length} Posters)`}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULLSCREEN LIGHTBOX PREVIEW */}
      {/* ========================================================================= */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[92vh] bg-white rounded-3xl p-3 sm:p-4 shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex-1 overflow-auto max-h-[80vh] flex items-center justify-center bg-slate-900/5 rounded-2xl p-2 sm:p-4">
              <img
                src={previewImage}
                alt="Visa Proof Preview"
                className="max-w-full max-h-[76vh] object-contain rounded-xl shadow-lg"
              />
            </div>
            <div className="p-3 flex items-center justify-between text-xs border-t border-slate-100 mt-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Visa Success Graphic
              </span>
              <button
                onClick={() => setPreviewImage(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
