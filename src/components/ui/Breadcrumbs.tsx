import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  items: {
    label: string;
    href?: string;
  }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-3 text-sm text-slate-600 font-medium">
      <ol className="flex flex-wrap items-center gap-2">
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1 text-slate-500 hover:text-amber-600 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            {item.href ? (
              <Link
                href={item.href}
                className="text-slate-500 hover:text-amber-600 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-900 font-bold">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
