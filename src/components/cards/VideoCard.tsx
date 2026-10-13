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
        className={`group rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-xl ${
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
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/15 to-transparent group-hover/thumb:bg-slate-950/20 transition-colors" />

          {/* Central Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover/thumb:scale-110 transition-transform duration-300">
              <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
            </div>
          </div>

          {/* Country Pill */}
          <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 text-white text-[11px] font-semibold">
            {country}
          </div>

          {/* Visa Year Pill */}
          <div
            className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${
              isDark
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-emerald-600/90 text-white border-emerald-400/40'
            }`}
          >
            Visa {visaYear}
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-amber-300 text-[10px] font-mono font-medium flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{duration}</span>
          </div>
        </div>

        {/* Video Card Content */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
          <div className="space-y-1">
            <div className="flex items-center text-xs gap-1 font-semibold truncate text-slate-400">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className={`truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{university}</span>
            </div>

            <h4
              className={`text-sm sm:text-base font-bold transition-colors line-clamp-1 ${
                isDark
                  ? 'text-white group-hover:text-amber-400'
                  : 'text-slate-900 group-hover:text-amber-600'
              }`}
            >
              {studentName}
            </h4>

            <div className={`text-[11px] sm:text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {program}
            </div>

            {quote && (
              <p
                className={`text-[11px] sm:text-xs italic line-clamp-1 leading-relaxed pt-0.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                &ldquo;{quote}&rdquo;
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-gradient-to-r hover:from-amber-400 hover:to-amber-500 hover:text-slate-950 text-amber-400 border border-slate-700/80 hover:border-transparent transition-all cursor-pointer shadow-xs"
          >
            <Play className="w-3 h-3 fill-current" />
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
