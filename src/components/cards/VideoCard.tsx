'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, Clock, MapPin, GraduationCap } from 'lucide-react';
import { VideoTestimonial } from '@/data/types';
import VideoModal from '@/components/ui/VideoModal';

interface VideoCardProps {
  testimonial: VideoTestimonial;
}

export default function VideoCard({
  testimonial,
  theme = 'light',
}: {
  testimonial: any;
  theme?: 'light' | 'dark';
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const studentName = testimonial.studentName || testimonial.title || 'Student Scholar';
  const university = testimonial.university || 'Global University';
  const country = testimonial.country || testimonial.destination || 'International';
  const program = testimonial.program || testimonial.category || 'Degree Course';
  const duration = testimonial.duration || '2:30';
  const visaYear = testimonial.visaGrantedYear || 'Recent';
  const quote = testimonial.quote || '';

  let embedUrl = testimonial.videoEmbedUrl || testimonial.embedUrl || testimonial.videoUrl || '';
  let ytId = '';

  if (embedUrl.includes('watch?v=') || embedUrl.includes('watch?')) {
    const match = embedUrl.match(/v=([a-zA-Z0-9_-]+)/);
    ytId = match ? match[1] : embedUrl.split('watch?v=')[1]?.split('&')[0];
  } else if (embedUrl.includes('youtu.be/')) {
    ytId = embedUrl.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0];
  } else if (embedUrl.includes('embed/')) {
    ytId = embedUrl.split('embed/')[1]?.split('?')[0]?.split('&')[0];
  } else if (embedUrl.includes('shorts/')) {
    ytId = embedUrl.split('shorts/')[1]?.split('?')[0]?.split('&')[0];
  }

  if (ytId) {
    embedUrl = `https://www.youtube.com/embed/${ytId}`;
  }

  const defaultThumb = ytId
    ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
    : (testimonial.thumbnailUrl || testimonial.thumbnail || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80');

  const [imgSrc, setImgSrc] = useState(defaultThumb);
  const isDark = theme === 'dark';

  return (
    <>
      <div
        className={`group rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-2xl ${
          isDark
            ? 'bg-slate-900/90 border border-slate-800/90 hover:border-amber-400/50'
            : 'bg-white border border-slate-200/90 hover:border-amber-300'
        }`}
      >
        {/* 16:9 Aspect Ratio Thumbnail with Play Overlay */}
        <div
          onClick={() => setModalOpen(true)}
          className="relative aspect-video w-full cursor-pointer overflow-hidden bg-slate-950 group/thumb"
        >
          <Image
            src={imgSrc}
            alt={studentName}
            fill
            unoptimized={true}
            onError={() => {
              if (ytId && !imgSrc.includes('mqdefault')) {
                setImgSrc(`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`);
              } else {
                setImgSrc('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80');
              }
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover/thumb:scale-105 transition-transform duration-500 opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/10 to-transparent group-hover/thumb:bg-slate-950/30 transition-colors" />

          {/* Central Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/30 group-hover/thumb:scale-115 transition-transform duration-300">
              <Play className="w-6 h-6 fill-slate-950 ml-1" />
            </div>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-white text-[11px] font-mono font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{duration}</span>
          </div>

          {/* Country Pill */}
          <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-sm border border-white/15 text-white text-xs font-semibold">
            {country}
          </div>
        </div>

        {/* Video Card Content */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
              <span
                className={`flex items-center gap-1 font-semibold truncate ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">{university}</span>
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 border ${
                  isDark
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                Visa {visaYear}
              </span>
            </div>

            <h4
              className={`text-base font-bold transition-colors line-clamp-1 ${
                isDark
                  ? 'text-white group-hover:text-amber-400'
                  : 'text-slate-900 group-hover:text-amber-600'
              }`}
            >
              {studentName}
            </h4>
            <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {program}
            </div>
          </div>

          {quote && (
            <p
              className={`text-xs italic line-clamp-2 leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              &ldquo;{quote}&rdquo;
            </p>
          )}

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/20 hover:scale-[1.01] transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Watch Student Video</span>
          </button>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        videoUrl={embedUrl}
        title={`${studentName} - Study in ${country} (${university})`}
      />
    </>
  );
}
