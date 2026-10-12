import Link from 'next/link';
import {
  Compass,
  GraduationCap,
  FileCheck,
  Award,
  Stamp,
  PenTool,
  Languages,
  Building2,
  PlaneTakeoff,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { Service } from '@/data/types';

interface ServiceCardProps {
  service: Service;
}

const iconMap: Record<string, any> = {
  Compass,
  GraduationCap,
  FileCheck,
  Award,
  Stamp,
  PenTool,
  Languages,
  Building2,
  PlaneTakeoff,
  HeartHandshake,
};

export default function ServiceCard({ service }: ServiceCardProps) {
  const IconComponent = iconMap[service.icon] || GraduationCap;

  return (
    <div className="group rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between">
      <div className="space-y-4">
        {/* Header with Icon and turnaround */}
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all duration-300">
            <IconComponent className="w-6 h-6" />
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{service.turnaroundTime}</span>
          </span>
        </div>

        {/* Title and Short description */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
            {service.title}
          </h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            {service.shortDesc}
          </p>
        </div>

        {/* Key Benefits */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Key Advantages:
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {service.benefits.slice(0, 3).map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="leading-tight">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-6">
        <Link
          href="/book-appointment"
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-amber-400 hover:text-slate-950 transition-colors group/btn"
        >
          <span>Get Free Consultation</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
