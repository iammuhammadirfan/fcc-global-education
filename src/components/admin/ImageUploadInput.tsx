'use client';

import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Check, Loader2, Link as LinkIcon, ExternalLink } from 'lucide-react';

interface ImageUploadInputProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  category?: 'hero' | 'blog' | 'destinations' | 'universities' | 'team' | 'settings' | 'general' | 'testimonials' | string;
  dark?: boolean;
  required?: boolean;
  helperText?: string;
  previewHeight?: string;
}

export default function ImageUploadInput({
  label,
  value,
  onChange,
  placeholder = 'https://... or /uploads/...',
  category = 'general',
  dark = true,
  required = false,
  helperText,
  previewHeight = 'h-24',
}: ImageUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/') && !file.name.endsWith('.ico') && !file.name.endsWith('.svg')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WebP, SVG, ICO).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds 10MB limit.');
      return;
    }

    setErrorMsg(null);
    setUploading(true);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image');
      }

      if (data.media?.url) {
        onChange(data.media.url);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error uploading image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const triggerBrowse = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Base theme styles
  const isDark = dark;
  const labelColor = isDark ? 'text-slate-300' : 'text-slate-700';
  const boxBg = isDark
    ? dragActive ? 'bg-amber-950/20 border-amber-500' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
    : dragActive ? 'bg-amber-50 border-amber-400' : 'bg-slate-50 border-slate-200 hover:border-slate-300';
  const inputBg = isDark
    ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-amber-500'
    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-500';

  return (
    <div className="space-y-2 text-xs">
      {label && (
        <div className="flex items-center justify-between">
          <label className={`block font-semibold ${labelColor}`}>
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-amber-500 hover:text-amber-400 font-medium flex items-center gap-1 transition"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? 'Hide URL Box' : 'Edit Direct URL'}</span>
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.svg,.ico,.webp"
        className="hidden"
        disabled={uploading}
        onChange={handleFileChange}
      />

      {/* Main Upload Dropzone / Preview Area */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`w-full max-w-full overflow-hidden border border-dashed rounded-xl p-3 transition ${boxBg}`}
      >
        {value ? (
          /* Preview + Controls when image is uploaded */
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full max-w-full">
            {/* Thumbnail */}
            <div className="relative group shrink-0 w-28 h-20 rounded-lg overflow-hidden border border-slate-300 bg-slate-100">
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
                title="View full image"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Actions */}
            <div className="flex-1 min-w-0 w-full space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={triggerBrowse}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Change Image</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs border border-rose-200 transition flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <X className="w-3 h-3" />
                  <span>Remove</span>
                </button>

                {uploadSuccess && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    <Check className="w-3 h-3" />
                    <span>Saved</span>
                  </span>
                )}
              </div>

              {/* Truncated Path */}
              <div
                className="text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded truncate block w-full max-w-full"
                title={value}
              >
                {value}
              </div>
            </div>
          </div>
        ) : (
          /* Empty Dropzone when no image is uploaded */
          <div
            onClick={triggerBrowse}
            className="flex flex-col items-center justify-center py-4 px-3 text-center cursor-pointer group w-full"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            </div>
            <p className="text-xs font-bold text-slate-800">
              {uploading ? 'Uploading image...' : 'Click to upload or drag image here'}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              JPG, PNG, WebP up to 10MB (saved to /public/uploads/)
            </p>
          </div>
        )}
      </div>

      {/* Optional Direct URL Input Field */}
      {showUrlInput && (
        <div className="space-y-1 pt-1 animate-fadeIn">
          <label className={`block text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Direct Image URL / Local Path
          </label>
          <div className="relative">
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={`w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none transition ${inputBg}`}
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {errorMsg && (
        <p className="text-[11px] font-semibold text-rose-400 bg-rose-950/50 border border-rose-800/50 px-2.5 py-1 rounded-lg">
          {errorMsg}
        </p>
      )}

      {helperText && (
        <p className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}
