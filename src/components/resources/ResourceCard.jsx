import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  ShoppingBag,
  HelpCircle,
  Headphones,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  BookOpen,
  Cpu,
  Layers,
  Zap
} from 'lucide-react';

const ICON_MAP = {
  FileText,
  ShoppingBag,
  HelpCircle,
  Headphones,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Cpu,
  Layers,
  Zap,
};

export const ResourceCard = ({
  title,
  desc,
  icon = 'FileText',
  link = '#',
  badge = '',
  index = 0,
}) => {
  const IconComponent = ICON_MAP[icon] || FileText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link
        to={link}
        className="group relative h-full flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        {/* Subtle hover gradient accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />

        <div>
          {/* Top Bar with Icon and Optional Badge */}
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="w-13 h-13 rounded-2xl bg-[#12544F]/10 text-[#12544F] flex items-center justify-center group-hover:bg-[#12544F] group-hover:text-white transition-all duration-300 shadow-sm">
              <IconComponent className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
            </div>
            {badge && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                {badge}
              </span>
            )}
          </div>

          <h3 className="text-lg sm:text-xl font-black text-[#092328] mb-2 group-hover:text-[#12544F] transition-colors leading-snug">
            {title}
          </h3>
          <p className="text-sm sm:text-sm text-slate-500 leading-relaxed line-clamp-3">
            {desc}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-sm font-black text-[#12544F] pt-6 group-hover:translate-x-1 transition-transform">
          <span>Explore Module</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </Link>
    </motion.div>
  );
};

export default ResourceCard;

