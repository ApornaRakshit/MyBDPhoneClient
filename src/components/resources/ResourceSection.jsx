import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Check,
  ShieldCheck,
  FileCheck,
  Lock,
  Database,
  FileText,
  Download,
  Phone,
  HelpCircle,
  Headphones,
  ShoppingBag,
} from 'lucide-react';
import ResourceCard from './ResourceCard';

const mediaUrl = (url = '') => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url) || url.startsWith('blob:')) return url;
  const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const ResourceSection = ({ section }) => {
  if (!section || section.is_active === 0 || section.is_active === false) return null;

  const contentJson = section.content_json || {};
  const type = String(section.section_type || '').toUpperCase();
  const align = section.align || 'left';

  // 1. HERO SECTION
  if (type === 'HERO') {
    const badges = Array.isArray(contentJson.badges) ? contentJson.badges : [];
    const primaryText = contentJson.primary_text || 'Explore Knowledge Base';
    const primaryUrl = contentJson.primary_url || '/resources/product-guides';
    const secondaryText = contentJson.secondary_text;
    const secondaryUrl = contentJson.secondary_url || '/resources/hardware';
    const eyebrow = contentJson.eyebrow || 'RESOURCES & COMPLIANCE';

    return (
      <section className="relative overflow-hidden bg-[#1E6763] text-white py-20 sm:py-28">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 50%, rgba(16,185,129,.35) 0%, transparent 50%), radial-gradient(circle at 85% 30%, rgba(45,212,191,.2) 0%, transparent 50%)',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            {eyebrow && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-emerald-300 text-sm font-black uppercase tracking-wider mb-6">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{eyebrow}</span>
              </div>
            )}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] mb-5">
              {section.title}
            </h1>
            {section.subtitle && (
              <p className="text-lg sm:text-xl text-emerald-100/90 font-semibold mb-4 leading-snug">
                {section.subtitle}
              </p>
            )}
            {section.content && (
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8">
                {section.content}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3.5 mb-8">
              <Link
                to={primaryUrl}
                className="px-6 sm:px-8 py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-[#092328] shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 active:scale-95"
              >
                <span>{primaryText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              {secondaryText && (
                <Link
                  to={secondaryUrl}
                  className="px-6 sm:px-8 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all active:scale-95"
                >
                  {secondaryText}
                </Link>
              )}
            </div>

            {badges.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                {badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-sm font-semibold"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{badge}</span>
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    );
  }

  // 2. MODULE GRID SECTION
  if (type === 'MODULE_GRID') {
    const items = Array.isArray(contentJson.items) ? contentJson.items : [];
    return (
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-sm font-black text-[#12544F] uppercase tracking-widest block mb-2">
              KNOWLEDGE BASE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#092328] tracking-tight mb-3">
              {section.title}
            </h2>
            {section.subtitle && (
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                {section.subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, idx) => (
              <ResourceCard
                key={idx}
                index={idx}
                title={item.title}
                desc={item.desc}
                icon={item.icon}
                link={item.link}
                badge={item.badge}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 3. RULES GRID (For Compliance)
  if (type === 'RULES_GRID') {
    const rules = Array.isArray(contentJson.rules) ? contentJson.rules : [];
    return (
      <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-sm font-black text-[#12544F] uppercase tracking-widest block mb-2">
              TELECOM REGULATIONS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#092328] tracking-tight mb-3">
              {section.title}
            </h2>
            {section.subtitle && (
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                {section.subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rules.map((rule, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200 hover:shadow-lg transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#12544F] text-white flex items-center justify-center font-black">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#092328]">
                  {rule.title}
                </h3>
                <p className="text-sm sm:text-sm text-slate-500 leading-relaxed">
                  {rule.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 4. DOCUMENTS LIST (For Compliance downloads)
  if (type === 'DOCUMENTS_LIST') {
    const documents = Array.isArray(contentJson.documents) ? contentJson.documents : [];
    return (
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-100" id="documents">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-sm font-black text-[#12544F] uppercase tracking-widest block mb-2">
              OFFICIAL DOWNLOADS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#092328] tracking-tight mb-3">
              {section.title}
            </h2>
            {section.subtitle && (
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                {section.subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between gap-4 hover:border-emerald-500 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-[#092328] truncate">{doc.title}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.format}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={mediaUrl(doc.url || '#')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-[#12544F] text-slate-600 hover:text-white transition-colors shrink-0"
                  title="Download Document"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 5. CTA BANNER
  if (type === 'CTA_BANNER') {
    const primaryText = contentJson.primary_text || 'Get Support';
    const primaryUrl = contentJson.primary_url || '/resources/support';
    const secondaryText = contentJson.secondary_text;
    const secondaryUrl = contentJson.secondary_url || '/contact';
    const eyebrow = contentJson.eyebrow || 'STILL NEED ASSISTANCE?';

    return (
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#06181b] via-[#092328] to-[#12544F] p-8 sm:p-14 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <span className="text-sm font-black uppercase tracking-widest text-emerald-300 block mb-2">
                  {eyebrow}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
                  {section.title}
                </h2>
                {section.subtitle && (
                  <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed">
                    {section.subtitle}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-3.5 shrink-0">
                <Link
                  to={primaryUrl}
                  className="px-6 sm:px-8 py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-[#092328] shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 active:scale-95"
                >
                  <span>{primaryText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                {secondaryText && (
                  <Link
                    to={secondaryUrl}
                    className="px-6 sm:px-8 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all active:scale-95"
                  >
                    {secondaryText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default RICH_TEXT
  return (
    <section className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328] mb-3">{section.title}</h2>
        {section.subtitle && <p className="text-slate-500 mb-6 text-sm">{section.subtitle}</p>}
        <div className="prose prose-slate max-w-none text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: section.content }} />
      </div>
    </section>
  );
};

export default ResourceSection;

