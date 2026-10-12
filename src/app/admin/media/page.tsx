'use client';

import React, { useEffect, useState, useRef } from 'react';
import { 
  FolderOpen, UploadCloud, Search, Trash2, Copy, 
  Check, File, Image as ImageIcon, Video, FileText, 
  ExternalLink, RefreshCw, Filter, HardDrive
} from 'lucide-react';
import { MediaFile } from '@/lib/types';

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('General');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      if (data.success) {
        setMedia(data.media || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', uploadCategory);

        const res = await fetch('/api/admin/media', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          setMedia(prev => [data.file, ...prev]);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    try {
      const res = await fetch(`/api/admin/media?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMedia(prev => prev.filter(m => m.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyUrl = (id: string, url: string) => {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = [
    'General', 'Homepage', 'Countries', 'Universities', 
    'Students', 'Success Stories', 'Blog', 'Team', 'Videos', 'Documents'
  ];

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const filtered = media.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || m.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderOpen className="w-7 h-7 text-amber-400" />
            Media & Asset Library
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Store, organize, and reference image assets, university logos, documents, and videos.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchMedia}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition"
          >
            <RefreshCw className="w-4 h-4 text-blue-400" />
            Refresh
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload Media'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileUpload(e.dataTransfer.files);
        }}
        className="p-8 border-2 border-dashed border-slate-800 hover:border-amber-500/40 rounded-2xl bg-slate-900/40 text-center transition flex flex-col items-center justify-center gap-3"
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Drag & drop files here, or browse from computer</div>
          <div className="text-xs text-slate-400 mt-1">Supports PNG, JPG, WEBP, SVG, PDF, MP4 (Max 15MB)</div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-slate-400">Upload to folder:</span>
          <select
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search files by name..."
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
          <option value="all">All Folders ({media.length})</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-400" />
            Loading media library...
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
            No media files found in this category.
          </div>
        ) : (
          filtered.map(m => {
            const isImage = m.mimeType?.startsWith('image') || m.url.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i);
            const isVideo = m.mimeType?.startsWith('video') || m.url.match(/\.(mp4|webm)$/i);

            return (
              <div key={m.id} className="group bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 rounded-xl overflow-hidden flex flex-col justify-between transition">
                <div className="relative aspect-square bg-slate-950 overflow-hidden flex items-center justify-center">
                  {isImage ? (
                    <img src={m.url} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  ) : isVideo ? (
                    <div className="flex flex-col items-center text-slate-400">
                      <Video className="w-8 h-8 text-amber-400 mb-1" />
                      <span className="text-[10px]">Video File</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <FileText className="w-8 h-8 text-blue-400 mb-1" />
                      <span className="text-[10px]">Document</span>
                    </div>
                  )}

                  <div className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-medium text-slate-300">
                    {m.category}
                  </div>
                </div>

                <div className="p-2.5 space-y-1">
                  <div className="text-xs font-semibold text-white truncate" title={m.name}>
                    {m.name}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{formatSize(m.size || m.sizeBytes || 0)}</span>
                    <span>{(m.uploadedAt || m.createdAt || '').slice(0, 10)}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => copyUrl(m.id, m.url)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-200 font-medium flex items-center gap-1 transition"
                      title="Copy URL"
                    >
                      {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedId === m.id ? 'Copied' : 'Copy'}
                    </button>
                    <div className="flex items-center gap-0.5">
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-slate-400 hover:text-white rounded transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="p-1 text-slate-400 hover:text-red-400 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
