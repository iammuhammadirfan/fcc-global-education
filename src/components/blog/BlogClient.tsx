'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Clock, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import BlogCard from '@/components/cards/BlogCard';

export default function BlogClient({ initialPosts }: { initialPosts: any[] }) {
  const posts = initialPosts && initialPosts.length > 0 ? initialPosts : [];
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically compute available categories from existing posts
  const dynamicCategories = useMemo(() => {
    const cats = new Set<string>();
    posts.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return ['All', ...Array.from(cats)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchCategory =
        selectedCategory === 'All' || post.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(post.tags) && post.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchCategory && matchSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const featuredPost = posts.find((p) => p.featured) || posts[0];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-amber-50/50 via-white to-slate-50 text-slate-900 pt-10 pb-16 border-b border-slate-200/80 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Breadcrumbs items={[{ label: 'Blog & Resources' }]} />

          <div className="max-w-3xl space-y-4 pt-6">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-300">
              International Education Intelligence
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Admissions Guides, Visa Briefings &{' '}
              <span className="text-amber-600">
                Scholarship Blueprints
              </span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Curated articles by former admissions deans, immigration lawyers, and test prep coaches to keep you ahead of shifting international policies.
            </p>
          </div>

          {/* Search & Category Filter Multi-Bar */}
          <div className="mt-10 p-4 rounded-2xl bg-white border border-slate-200 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {dynamicCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-400 text-slate-950 shadow-sm font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article Spotlight (when category is All and no search) */}
      {selectedCategory === 'All' && !searchQuery && featuredPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 text-white overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 group">
            <div className="lg:col-span-7 relative h-72 lg:h-auto min-h-[340px]">
              {featuredPost.coverImage && (
                <Image
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-900" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-bold text-xs">
                Featured Analysis
              </div>
            </div>

            <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="font-semibold text-amber-400">{featuredPost.category}</span>
                  <span>•</span>
                  <span>{featuredPost.publishedAt}</span>
                  <span>•</span>
                  <span>{featuredPost.readTime}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight group-hover:text-amber-400 transition-colors">
                  <Link href={`/blog/${featuredPost.slug}`}>
                    {featuredPost.title}
                  </Link>
                </h2>

                <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {featuredPost.author?.avatar && (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-700">
                      <Image
                        src={featuredPost.author.avatar}
                        alt={featuredPost.author.name || 'Author'}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-bold text-white">{featuredPost.author?.name}</div>
                    <div className="text-xs text-slate-400">{featuredPost.author?.role}</div>
                  </div>
                </div>

                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors"
                >
                  <span>Read Full Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'Article' : 'Articles'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Actionable guides written by licensed education counselors and visa strategists.
            </p>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No articles found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try searching with different keywords or reset your category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Pre-Footer Newsletter Subscription Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0B1528] text-white p-8 sm:p-12 text-center border border-slate-800 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold text-white">
              Stay Informed on Global Education Policies
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Consulate regulations, post-study work rules, and university application deadlines change constantly. Subscribe to our monthly insider newsletter or book a free personalized profile review.
            </p>
            <div className="pt-4">
              <Link
                href="/book-appointment"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-[1.02] transition-all"
              >
                <span>Book 1-on-1 Strategy Session</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
