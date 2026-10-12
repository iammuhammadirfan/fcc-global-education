'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // When pathname or searchParams change, route transition is complete
    if (loading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      const targetAttr = target.getAttribute('target');

      // Skip non-navigation links (hash anchors, external links, mailto/tel, new tabs)
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        targetAttr === '_blank' ||
        target.hasAttribute('download')
      ) {
        return;
      }

      // If linking to the exact same URL, don't trigger loading
      const currentUrl = window.location.pathname + window.location.search;
      if (href === currentUrl) return;

      // Start top progress bar immediately on click
      setLoading(true);
      setProgress(35);

      const t1 = setTimeout(() => {
        setProgress((prev) => (prev < 80 ? 75 : prev));
      }, 150);

      const t2 = setTimeout(() => {
        setProgress((prev) => (prev < 90 ? 90 : prev));
      }, 500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    };

    // Attach to document with capture so it triggers on first click immediately
    document.addEventListener('click', handleLinkClick, { capture: true, passive: true });
    return () => {
      document.removeEventListener('click', handleLinkClick, { capture: true });
    };
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[99999] pointer-events-none bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 shadow-[0_0_10px_#f59e0b] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transition: progress === 100 ? 'width 150ms ease-out, opacity 200ms ease-out' : 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </div>
  );
}
