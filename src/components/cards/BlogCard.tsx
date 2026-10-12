import Image from 'next/image';
import Link from 'next/link';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/data/types';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden flex flex-col justify-between">
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/10 text-amber-400 text-[11px] font-bold">
          {post.category}
        </div>

        {/* Read Time */}
        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{post.readTime}</span>
        </div>
      </div>

      {/* Article Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{post.publishedAt}</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Author & Read More Link */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 flex-shrink-0">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-900 leading-tight">
                {post.author.name}
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                {post.author.role.split('&')[0]}
              </div>
            </div>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="text-xs font-bold text-amber-600 group-hover:text-amber-700 flex items-center gap-1 group-hover:underline"
          >
            <span>Read</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
