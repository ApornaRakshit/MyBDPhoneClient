import { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../../services/api';
import AnimatedFlow from '../../components/cms/AnimatedFlow';
import CallRecordingPlayer from '../../components/cms/CallRecordingPlayer';
import { CmsHtml } from '../../components/cms/CmsHtml';
import {
  PhoneCall,
  PhoneIncoming,
  Cpu,
  Users,
  Clock,
  Sliders,
  Headphones,
  Route,
  Zap,
  ShieldCheck,
  Shield,
  Globe2,
  Layers,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Smartphone,
  Laptop,
  Monitor,
  Radio,
  FileAudio,
  PhoneForwarded,
  Activity,
  Check,
  HelpCircle,
  Play,
  AudioWaveform,
  PlugZap,
  Building2,
  Store,
  ReceiptText,
  ListTree,
  Megaphone,
  BellRing,
  CalendarDays,
  Bot,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  XCircle,
  FileText,
  Copy,
  BadgePercent,
  TrendingUp,
  Mic,
  Eye,
  CreditCard,
  Server,
} from 'lucide-react';

const ICON_MAP = {
  PhoneCall,
  PhoneIncoming,
  Cpu,
  Users,
  Clock,
  Sliders,
  Headphones,
  Route,
  Zap,
  ShieldCheck,
  Shield,
  Globe2,
  Layers,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Laptop,
  Monitor,
  Radio,
  FileAudio,
  PhoneForwarded,
  Activity,
  Check,
  HelpCircle,
  Play,
  AudioWaveform,
  PlugZap,
  Building2,
  Store,
  ReceiptText,
  ListTree,
  Megaphone,
  BellRing,
  CalendarDays,
  Bot,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  XCircle,
  FileText,
  Copy,
  BadgePercent,
  TrendingUp,
  Mic,
  Eye,
  CreditCard,
  Server,
};

function DynamicIcon({ name = 'Zap', className = 'w-6 h-6' }) {
  const Comp = ICON_MAP[name] || Zap;
  return <Comp className={className} />;
}

const parse = (val, fallback = {}) => {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
};

const mediaUrl = (url = '') => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url) || url.startsWith('blob:')) return url;
  const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

/* ── Section: Hero ────────────────────────────────────────── */
function HeroSection({ section }) {
  const settings = parse(section.custom_settings || section.settings, {});
  const badges = Array.isArray(settings.badges)
    ? settings.badges
    : typeof settings.badges === 'string' && settings.badges
    ? settings.badges.split('\n').filter(Boolean)
    : [];

  const primaryText = settings.primary_text || 'Get Started';
  const primaryUrl = settings.primary_url || '/ip-phone';
  const secondaryText = settings.secondary_text || 'View Packages';
  const secondaryUrl = settings.secondary_url || '/packages';
  const eyebrow = settings.eyebrow || 'OFFICIAL 096 IP TELEPHONY';
  const imageUrl = section.image_url || settings.image_url || settings.image || '';

  return (
    <section className="relative overflow-hidden bg-[#1E6763] text-white py-20 sm:py-28">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 50%, rgba(16,185,129,.35) 0%, transparent 50%), radial-gradient(circle at 85% 30%, rgba(45,212,191,.2) 0%, transparent 50%)',
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
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
            {(section.content_body || section.content_html) && (
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mb-8">
                {section.content_body || section.content_html}
              </p>
            )}

            <div className="flex flex-wrap gap-3.5 mb-8">
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
              <div className="flex flex-wrap gap-2.5 pt-2">
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

          {imageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 flex justify-center"
            >
              <div className="relative p-3 rounded-3xl bg-[#1E6763]">
                <img
                  src={mediaUrl(imageUrl)}
                  alt={section.title}
                  className="w-full max-w-md h-auto object-contain rounded-2xl"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Section: Text / Image Split (Layout Orientation) ───────── */
function TextImageSplitSection({ section }) {
  const settings = parse(section.custom_settings || section.settings, {});
  const orientation = (
    section.layout_orientation ||
    settings.layout_orientation ||
    (settings.image_position === 'left' ? 'IMAGE_LEFT' : 'IMAGE_RIGHT')
  ).toUpperCase();

  const isImageLeft = orientation === 'IMAGE_LEFT';
  const imageUrl = section.image_url || settings.image_url || settings.image || '';
  const badges = Array.isArray(settings.badges)
    ? settings.badges
    : typeof settings.badges === 'string' && settings.badges
    ? settings.badges.split('\n').filter(Boolean)
    : [];

  const primaryText = settings.primary_text;
  const primaryUrl = settings.primary_url || '/packages';
  const eyebrow = settings.eyebrow;

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex flex-col gap-12 items-center ${
            isImageLeft ? 'lg:flex-row-reverse' : 'lg:flex-row'
          }`}
        >
          {/* Text Content */}
          <div className="flex-1 w-full">
            {eyebrow && (
              <span className="text-sm font-black text-[#12544F] uppercase tracking-widest block mb-3">
                {eyebrow}
              </span>
            )}
            <h2 className="text-2xl sm:text-4xl font-black text-[#092328] tracking-tight leading-tight mb-4">
              {section.title}
            </h2>
            {section.subtitle && (
              <p className="text-base sm:text-lg text-slate-700 font-semibold mb-4">
                {section.subtitle}
              </p>
            )}
            {(section.content_body || section.content_html) && (
              <div className="text-sm sm:text-base text-slate-500 leading-relaxed space-y-4 mb-6">
                {section.content_body ? (
                  <p>{section.content_body}</p>
                ) : (
                  <CmsHtml html={section.content_html} />
                )}
              </div>
            )}

            {badges.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                {badges.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            )}

            {primaryText && (
              <div>
                <Link
                  to={primaryUrl}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#12544F] hover:bg-[#0d403c] text-white font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  <span>{primaryText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Image Content */}
          {imageUrl && (
            <div className="flex-1 w-full flex justify-center">
              <div className="relative w-full max-w-lg p-3 sm:p-4 rounded-3xl bg-slate-50 border border-slate-200 shadow-xl overflow-hidden group">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                <img
                  src={mediaUrl(imageUrl)}
                  alt={section.title}
                  className="w-full h-auto object-cover rounded-2xl group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Section: Feature Grid ────────────────────────────────── */
function FeatureGridSection({ section }) {
  const settings = parse(section.custom_settings || section.settings, {});
  const items = Array.isArray(settings.items)
    ? settings.items
    : Array.isArray(settings.features)
    ? settings.features
    : Array.isArray(settings.solutions)
    ? settings.solutions
    : [];
  const columns = settings.columns || 3;
  const eyebrow = settings.eyebrow || 'CAPABILITIES';

  const colClass =
    columns === 2
      ? 'md:grid-cols-2'
      : columns === 3
      ? 'md:grid-cols-2 lg:grid-cols-3'
      : 'md:grid-cols-2 lg:grid-cols-4';

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-sm font-black text-[#12544F] uppercase tracking-widest block mb-2">
            {eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#092328] tracking-tight mb-3">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              {section.subtitle}
            </p>
          )}
        </div>

        <div className={`grid grid-cols-1 ${colClass} gap-6`}>
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group bg-white rounded-2xl border border-slate-200/80 p-6 hover:border-emerald-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#12544F]/10 flex items-center justify-center mb-5 group-hover:bg-[#12544F] transition-colors duration-300">
                  <DynamicIcon
                    name={item.icon}
                    className="w-6 h-6 text-[#12544F] group-hover:text-white transition-colors duration-300"
                  />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#092328] mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-sm text-slate-500 leading-relaxed">
                  {item.description || item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section: Benefits / Why Choose ──────────────────────── */
function BenefitsSection({ section }) {
  const settings = parse(section.custom_settings || section.settings, {});
  const benefits = Array.isArray(settings.benefits)
    ? settings.benefits
    : Array.isArray(settings.points)
    ? settings.points
    : Array.isArray(settings.items)
    ? settings.items
    : [];
  const eyebrow = settings.eyebrow || 'ADVANTAGES & BENEFITS';

  return (
    <section className="py-16 sm:py-24 bg-[#f8fbf9] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-sm font-black text-[#12544F] uppercase tracking-widest block mb-2">
            {eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#092328] tracking-tight mb-3">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              {section.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group bg-white rounded-2xl border border-slate-200/80 p-6 hover:border-emerald-500 hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-xl bg-[#12544F]/10 text-[#12544F] flex items-center justify-center font-black text-xs">
                    {b.num || `0${i + 1}`}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 group-hover:bg-[#12544F] group-hover:text-white transition-colors">
                    <DynamicIcon name={b.icon || 'CheckCircle2'} className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-black text-[#092328] text-base mb-2 leading-snug">{b.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {b.description || b.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section: Target Audience / Who It's For ─────────────── */
function TargetAudienceSection({ section }) {
  const settings = parse(section.custom_settings || section.settings, {});
  const audiences = Array.isArray(settings.audiences)
    ? settings.audiences
    : Array.isArray(settings.items)
    ? settings.items
    : [];
  const eyebrow = settings.eyebrow || "WHO IT'S FOR";

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-sm font-black text-[#12544F] uppercase tracking-widest block mb-2">
            {eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#092328] tracking-tight mb-3">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              {section.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="bg-slate-50/80 rounded-2xl border border-slate-200 p-6 hover:border-[#12544F]/40 hover:shadow-xl hover:bg-white transition-all flex flex-col justify-between"
            >
              <div>
                {item.tag && (
                  <span className="inline-block px-3 py-1 rounded-full bg-[#12544F]/10 text-[#12544F] text-xs font-black uppercase tracking-wider mb-4">
                    {item.tag}
                  </span>
                )}
                <h3 className="text-lg font-black text-[#092328] mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {item.description || item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section: How It Works (Steps) ────────────────────────── */
function HowItWorksSection({ section }) {
  const settings = parse(section.custom_settings || section.settings, {});
  const steps = Array.isArray(settings.steps) ? settings.steps : [];
  const eyebrow = settings.eyebrow || 'WORKFLOW';

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-sm font-black text-[#12544F] uppercase tracking-widest block mb-2">
            {eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#092328] tracking-tight mb-3">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              {section.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div
              key={i}
              className="relative bg-slate-50 rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-xl bg-[#12544F] text-white flex items-center justify-center font-black text-sm shrink-0">
                  {s.step || `0${i + 1}`}
                </span>
                <DynamicIcon name={s.icon} className="w-6 h-6 text-[#12544F]" />
              </div>
              <h3 className="font-black text-[#092328] text-base mb-2">{s.title}</h3>
              <p className="text-sm sm:text-sm text-slate-500 leading-relaxed">
                {s.description || s.desc}
              </p>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-5 h-5 text-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section: FAQ Accordion ───────────────────────────────── */
function FaqSection({ section }) {
  const settings = parse(section.custom_settings || section.settings, {});
  const items = Array.isArray(settings.items) ? settings.items : [];
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (idx) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-black text-[#12544F] uppercase tracking-widest block mb-2">
            HELP CENTER
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#092328] tracking-tight mb-3">
            {section.title || 'Frequently Asked Questions'}
          </h2>
          {section.subtitle && (
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              {section.subtitle}
            </p>
          )}
        </div>

        <div className="space-y-3.5">
          {items.map((item, index) => {
            const isOpen = openIdx === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-black text-[#092328] hover:text-[#12544F] transition-colors"
                >
                  <span className="text-sm sm:text-base">{item.q || item.title}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm sm:text-sm text-slate-500 leading-relaxed border-t border-slate-100">
                    {item.a || item.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Section: CTA Banner ──────────────────────────────────── */
function CtaBannerSection({ section }) {
  const settings = parse(section.custom_settings || section.settings, {});
  const primaryText = settings.primary_text || 'Get Started';
  const primaryUrl = settings.primary_url || '/ip-phone';
  const secondaryText = settings.secondary_text || 'View Packages';
  const secondaryUrl = settings.secondary_url || '/packages';
  const eyebrow = settings.eyebrow || 'READY TO UPGRADE?';

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

/* ── Section: Comparison Table (Traditional IVR vs AI Voice Agent) ── */
function ComparisonSection({ section }) {
  const settings = parse(section.custom_settings || section.settings, {});
  const rows = Array.isArray(settings.rows) ? settings.rows : [];
  const colTraditional = settings.col_traditional || 'Traditional Keypad IVR';
  const colAi = settings.col_ai || 'MyBDPhone AI Voice Automation';
  const eyebrow = settings.eyebrow || 'COMPARISON MATRIX';

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-100" id="comparison">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-sm font-black text-[#12544F] uppercase tracking-widest block mb-2">
            {eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#092328] tracking-tight mb-3">
            {section.title || 'Traditional IVR vs. AI Voice Automation'}
          </h2>
          {section.subtitle && (
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              {section.subtitle}
            </p>
          )}
        </div>

        {/* Comparison Table */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-xl bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="py-5 px-6 font-black text-slate-900 text-sm w-1/3">
                    Feature & Metric
                  </th>
                  <th className="py-5 px-6 font-bold text-slate-500 text-sm w-1/3 bg-slate-100/50">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                      <span>{colTraditional}</span>
                    </div>
                  </th>
                  <th className="py-5 px-6 font-black text-[#12544F] text-sm w-1/3 bg-emerald-50/70 border-l border-emerald-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{colAi}</span>
                      <span className="ml-auto text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-black text-slate-800 text-sm sm:text-sm">
                      {row.metric || row.title || row.feature}
                    </td>
                    <td className="py-4 px-6 text-slate-600 bg-slate-50/30 text-sm sm:text-sm">
                      <div className="flex items-start gap-2.5">
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{row.traditional || row.legacy || '—'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-emerald-950 font-semibold bg-emerald-50/40 border-l border-emerald-100 text-sm sm:text-sm">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{row.ai || row.nextgen || row.modern || '—'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Section: Audio / Call Recording Player ────────────────── */
function AudioDemoSection({ section }) {
  const settings = parse(section.custom_settings || section.settings, {});
  const samples = Array.isArray(settings.samples) ? settings.samples : [];
  
  // Check if samples or section context indicates Call Recording
  const isCallRecording =
    section.section_type === 'CALL_RECORDING_PLAYER' ||
    section.section_key?.includes('call_recording') ||
    section.section_key?.includes('recording') ||
    samples.some((s) => s.caller_id || s.call_type || s.channel);

  if (isCallRecording) {
    return (
      <section className="py-16 sm:py-24 bg-[#051113] border-b border-slate-900" id="audio-player">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CallRecordingPlayer section={section} />
        </div>
      </section>
    );
  }

  return null;
}

/* ── Section: Dynamic Dispatcher ──────────────────────────── */
function SectionDispatcher({ section }) {
  if (section.status === 'inactive' || section.is_visible === false) return null;

  const type = String(section.section_type || '').toUpperCase();
  const key = String(section.section_key || '').toLowerCase();

  // Route by type or key
  if (type === 'HERO' || key === 'hero') {
    return <HeroSection section={section} />;
  }
  if (type === 'ANIMATED_FLOW' || type === 'ANIMATED_IVR_FLOW' || key.includes('animated')) {
    return (
      <section className="py-16 sm:py-24 bg-[#E5F8F1] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedFlow section={section} />
        </div>
      </section>
    );
  }
  if (['TEXT_IMAGE_SPLIT', 'IMAGE_TEXT', 'OVERVIEW'].includes(type) || key === 'overview') {
    return <TextImageSplitSection section={section} />;
  }
  if (['FEATURE_GRID', 'KEY_FEATURES', 'CORE_FEATURES'].includes(type) || key.includes('feature')) {
    return <FeatureGridSection section={section} />;
  }
  if (['HOW_IT_WORKS', 'STEPS'].includes(type) || key.includes('how') || key.includes('step')) {
    return <HowItWorksSection section={section} />;
  }
  if (['BENEFITS', 'BENEFITS_GRID', 'MAIN_BENEFITS', 'WHY_CHOOSE'].includes(type) || key.includes('benefit') || key.includes('why_choose')) {
    return <BenefitsSection section={section} />;
  }
  if (['WHO_ITS_FOR', 'TARGET_AUDIENCE', 'AUDIENCES', 'USE_CASES'].includes(type) || key.includes('who') || key.includes('audience')) {
    return <TargetAudienceSection section={section} />;
  }
  if (['COMPARISON', 'COMPARISON_TABLE', 'COMPARISON_MATRIX'].includes(type) || key.includes('comparison')) {
    return <ComparisonSection section={section} />;
  }
  if (type === 'CALL_RECORDING_PLAYER' || key.includes('call_recording')) {
    return (
      <section className="py-16 sm:py-24 bg-[#051113] border-b border-slate-900" id="audio-player">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CallRecordingPlayer section={section} />
        </div>
      </section>
    );
  }
  if (['AUDIO_DEMO', 'VOICE_DEMO', 'AUDIO_PLAYER', 'VOICE_STUDIO'].includes(type) || key.includes('voice') || key.includes('audio')) {
    return <AudioDemoSection section={section} />;
  }
  if (type === 'FAQ' || key.includes('faq')) {
    return <FaqSection section={section} />;
  }
  if (['CTA_BANNER', 'CTA', 'FINAL_CTA'].includes(type) || key.includes('cta')) {
    return <CtaBannerSection section={section} />;
  }

  return section.content_html || section.content_body ? (
    <section className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black text-[#092328] mb-4">{section.title}</h2>
        {section.subtitle && <p className="text-slate-500 mb-6">{section.subtitle}</p>}
        <CmsHtml html={section.content_html || section.content_body} />
      </div>
    </section>
  ) : null;
}

/* ── Main DynamicCMSPage Component ────────────────────────── */
export const DynamicCMSPage = ({ slug: slugProp } = {}) => {
  const params = useParams();
  const location = useLocation();

  // Prefer explicit prop > route param slug > full pathname without leading/trailing slashes
  const slug =
    slugProp ||
    params.slug ||
    location.pathname.replace(/^\/+|\/+$/g, '') ||
    '';

  const [cmsData, setCmsData] = useState(null);
  const [mode, setMode] = useState('loading'); // loading | ready | inactive | error

  useEffect(() => {
    let live = true;
    setMode('loading');

    const rawClean = slug.trim().replace(/^\/+|\/+$/g, '');
    const cleanSlug = encodeURIComponent(rawClean);

    // Try /api/public/cms-page/:slug first
    API.get(`/public/cms-page/${cleanSlug}`)
      .then((res) => {
        if (!live) return;
        if (res.data?.success && res.data?.page) {
          setCmsData(res.data);
          setMode('ready');
        } else {
          setMode('error');
        }
      })
      .catch((err1) => {
        if (!live) return;
        // Fallback to /cms/public/page/:slug
        API.get(`/cms/public/page/${cleanSlug}`)
          .then((res2) => {
            if (!live) return;
            if (res2.data?.success && res2.data?.page) {
              setCmsData(res2.data);
              setMode('ready');
            } else {
              setMode('error');
            }
          })
          .catch((err2) => {
            if (!live) return;
            // If encoded had slashes, try unencoded raw path as well
            if (rawClean !== cleanSlug) {
              API.get(`/public/cms-page/${rawClean}`)
                .then((res3) => {
                  if (!live) return;
                  if (res3.data?.success && res3.data?.page) {
                    setCmsData(res3.data);
                    setMode('ready');
                  } else {
                    setMode('error');
                  }
                })
                .catch((err3) => {
                  if (!live) return;
                  setMode(
                    err3.response?.status === 410 || err2.response?.status === 410 || err1.response?.status === 410
                      ? 'inactive'
                      : 'error'
                  );
                });
              return;
            }
            setMode(
              err2.response?.status === 410 || err1.response?.status === 410
                ? 'inactive'
                : 'error'
            );
          });
      });

    return () => {
      live = false;
    };
  }, [slug]);

  const sortedSections = useMemo(() => {
    return (cmsData?.sections || [])
      .slice()
      .sort(
        (a, b) =>
          Number(a.display_order ?? a.sort_order ?? 0) -
            Number(b.display_order ?? b.sort_order ?? 0) ||
          Number(a.id) - Number(b.id)
      );
  }, [cmsData]);

  if (mode === 'loading') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#f7fafb] text-slate-500 text-sm">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-3" />
        <span>Loading MyBDPhone...</span>
      </div>
    );
  }

  if (mode === 'inactive') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#f7fafb] text-slate-500 text-sm px-4 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Page Inactive</h2>
        <p>This feature page is currently inactive.</p>
      </div>
    );
  }

  if (mode === 'error' || !cmsData?.page) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#f7fafb] text-slate-500 text-sm px-4 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Page Not Found</h2>
        <p className="mb-4">This feature page has not been published yet.</p>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-[#12544F] text-white font-bold text-sm"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <main className="w-full overflow-x-hidden bg-white">
      {sortedSections.length > 0 ? (
        sortedSections.map((section) => (
          <SectionDispatcher key={section.id || section.section_key} section={section} />
        ))
      ) : (
        <section className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
          <p>This feature page has no published sections yet.</p>
        </section>
      )}
    </main>
  );
};

export default DynamicCMSPage;
