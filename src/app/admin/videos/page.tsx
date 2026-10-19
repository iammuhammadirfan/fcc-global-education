'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Video, Plus, Search, Edit3, Trash2, CheckCircle2, 
  XCircle, RefreshCw, ExternalLink, PlayCircle, X
} from 'lucide-react';
import { VideoStory } from '@/lib/types';
import ToggleSwitch from '@/components/admin/ToggleSwitch';

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoStory | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);

  const initialForm: Partial<VideoStory> = {
    title: '',
    studentName: '',
    destination: 'United Kingdom',
    university: 'University of Edinburgh',
    embedUrl: '',
    duration: '3:30',
    category: 'Student Reviews',
    featured: true,
    published: true
  };

  const [form, setForm] = useState<Partial<VideoStory>>(initialForm);

  const getThumbnail = (v: any) => {
    const url = v?.embedUrl || v?.videoEmbedUrl || '';
    let ytId = '';
    if (url.includes('watch?v=') || url.includes('watch?')) {
      const match = url.match(/v=([a-zA-Z0-9_-]+)/);
      ytId = match ? match[1] : url.split('watch?v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      ytId = url.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0];
    } else if (url.includes('embed/')) {
      ytId = url.split('embed/')[1]?.split('?')[0]?.split('&')[0];
    } else if (url.includes('shorts/')) {
      ytId = url.split('shorts/')[1]?.split('?')[0]?.split('&')[0];
    }
    if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    return v?.thumbnail || v?.thumbnailUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800';
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/videos');
      const data = await res.json();
      if (data.success) {
        setVideos(data.videos || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
    fetch('/api/admin/countries')
      .then((r) => r.json())
      .then((d) => {
        if (d.countries) setCountries(d.countries);
      })
      .catch(() => null);

    fetch('/api/universities')
      .then((r) => r.json())
      .then((d) => {
        if (d.universities) setUniversities(d.universities);
      })
      .catch(() => null);
  }, []);

  const openAddModal = () => {
    setEditingVideo(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (v: VideoStory) => {
    setEditingVideo(v);
    setForm(v);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const studentName = form.studentName || form.title || 'Student Video';
    const title = form.title || form.studentName || 'Student Video';
    const embedUrl = form.embedUrl || '';

    if (!embedUrl) {
      alert('Please enter a YouTube or Vimeo video link');
      return;
    }

    setSubmitting(true);
    try {
      const method = editingVideo ? 'PUT' : 'POST';
      const payload = {
        ...form,
        title,
        studentName,
        embedUrl,
        videoEmbedUrl: embedUrl,
      };
      const res = await fetch('/api/admin/videos', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchVideos();
      } else {
        alert(data.error || 'Failed to save video');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      const res = await fetch(`/api/admin/videos?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setVideos(prev => prev.filter(v => v.id !== id));
        fetchVideos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const togglePublish = async (video: VideoStory) => {
    try {
      const updated = { ...video, published: !video.published };
      const res = await fetch('/api/admin/videos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      if (data.success) {
        setVideos(prev => prev.map(v => v.id === video.id ? updated : v));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ['Success Stories', 'Student Reviews', 'University Videos', 'Visa Success', 'Company Videos', 'Promotional Videos'];

  const filtered = videos.filter(v => {
    const title = v.title || v.quote || '';
    const student = v.studentName || '';
    const uni = v.university || '';
    const matchesSearch = 
      title.toLowerCase().includes(search.toLowerCase()) ||
      student.toLowerCase().includes(search.toLowerCase()) ||
      uni.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || v.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Video className="w-7 h-7 text-amber-400" />
            Student Videos CMS
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage genuine student video testimonials and campus experience stories displayed on the website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/success-stories#student-videos"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-amber-400 hover:text-amber-300 text-xs font-semibold flex items-center gap-2 transition"
          >
            <ExternalLink className="w-4 h-4" />
            View Live Videos
          </Link>
          <button
            onClick={fetchVideos}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition"
          >
            <RefreshCw className="w-4 h-4 text-blue-400" />
            Refresh
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            Add Video
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search videos by title, student, or university..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-300 focus:outline-none focus:border-amber-500/50"
        >
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-400" />
            Loading video library...
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500">
            No videos found matching your filter.
          </div>
        ) : (
          filtered.map(v => (
            <div key={v.id} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700/80 transition flex flex-col justify-between">
              <div>
                <div className="relative aspect-video bg-slate-950 overflow-hidden group">
                  <img
                    src={getThumbnail(v)}
                    alt={v.title}
                    onError={(e: any) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-amber-400 drop-shadow-lg" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-[10px] font-mono px-2 py-0.5 rounded text-white">
                    {v.duration}
                  </div>
                  <div className="absolute top-2 left-2 bg-slate-900/90 text-amber-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-amber-500/20">
                    {v.category || 'General'}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-white text-sm line-clamp-1">{v.title}</h3>
                  <div className="text-xs text-slate-400">
                    <span className="text-slate-200 font-medium">{v.studentName}</span> • {v.university} ({v.destination})
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-800/60 flex items-center justify-between mt-2">
                <button
                  onClick={() => togglePublish(v)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
                    v.published
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {v.published ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {v.published ? 'Published' : 'Draft'}
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(v)}
                    className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-amber-400" />
                {editingVideo ? `Edit Video: ${editingVideo.title}` : 'Add Video Story'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Video Title *</label>
                <input
                  type="text"
                  required
                  value={form.title || ''}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Oxford Acceptance Reaction & Visa Grant"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Student Name</label>
                  <input
                    type="text"
                    value={form.studentName || ''}
                    onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                    placeholder="e.g. Emma Watson"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">University</label>
                  <input
                    type="text"
                    list="video-unis-list"
                    value={form.university || ''}
                    onChange={(e) => setForm({ ...form, university: e.target.value })}
                    placeholder="e.g. University of Edinburgh"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                  <datalist id="video-unis-list">
                    {universities
                      .filter((u) => !form.destination || u.country?.toLowerCase() === form.destination.toLowerCase())
                      .map((u) => (
                        <option key={u.id || u.name} value={u.name} />
                      ))}
                  </datalist>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Destination Country</label>
                  <input
                    type="text"
                    list="video-countries-list"
                    value={form.destination || ''}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    placeholder="e.g. United Kingdom, Japan, Australia"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                  <datalist id="video-countries-list">
                    {countries.map((c: any) => (
                      <option key={c.id || c.name} value={c.name} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Category</label>
                  <select
                    value={form.category || 'Success Stories'}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Embed URL (YouTube/Vimeo) *</label>
                <input
                  type="text"
                  required
                  value={form.embedUrl || ''}
                  onChange={(e) => setForm({ ...form, embedUrl: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Duration (e.g. 3:45)</label>
                  <input
                    type="text"
                    value={form.duration || '3:30'}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="3:45"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-amber-400/90 flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Thumbnail auto-fetches from YouTube / Vimeo.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <ToggleSwitch
                  checked={form.featured ?? false}
                  onChange={(val) => setForm({ ...form, featured: val })}
                  label="Featured Video"
                  description="Highlight at top of video showcase"
                  activeColor="amber"
                />
                <ToggleSwitch
                  checked={form.published ?? true}
                  onChange={(val) => setForm({ ...form, published: val })}
                  label="Published Status"
                  description="Visible to visitors on website"
                  activeColor="emerald"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-semibold shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingVideo ? 'Save Video' : 'Create Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
