import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../../services/api';
import { CmsHtml } from '../../components/cms/CmsHtml';
import {
  Building2,
  Server,
  PhoneCall,
  PhoneIncoming,
  Headphones,
  CreditCard,
  ShieldCheck,
  Shield,
  Mic,
  FileText,
  Users,
  Bot,
  Zap,
  Eye,
  CheckCircle2,
  Check,
  ArrowRight,
  Sparkles,
  Phone,
  HelpCircle,
  Clock,
  Layers,
  Award,
  ChevronRight,
  TrendingUp,
  Cpu,
  RotateCcw,
  Activity,
  Lock,
  Globe2,
  Smartphone,
  Laptop,
  Monitor,
  Route,
  BadgePercent,
  Radio,
  FileAudio,
  Store,
  ReceiptText,
  ListTree,
  Megaphone,
  BellRing,
  CalendarDays,
  XCircle,
} from 'lucide-react';

const ICON_MAP = {
  Building2,
  Server,
  PhoneCall,
  PhoneIncoming,
  Headphones,
  CreditCard,
  ShieldCheck,
  Shield,
  Mic,
  FileText,
  Users,
  Bot,
  Zap,
  Eye,
  CheckCircle2,
  Check,
  ArrowRight,
  Sparkles,
  Phone,
  HelpCircle,
  Clock,
  Layers,
  Award,
  ChevronRight,
  TrendingUp,
  Cpu,
  RotateCcw,
  Activity,
  Lock,
  Globe2,
  Smartphone,
  Laptop,
  Monitor,
  Route,
  BadgePercent,
  Radio,
  FileAudio,
  Store,
  ReceiptText,
  ListTree,
  Megaphone,
  BellRing,
  CalendarDays,
  XCircle,
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

export const RemoteWorkforceSolutionPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    // Fetch dynamic data from GET /api/public/cms-page/solutions/remote-workforce
    API.get('/public/cms-page/solutions/remote-workforce')
      .then((res) => {
        if (!active) return;
        if (res.data?.success && res.data?.page) {
          setData(res.data);
        } else {
          setError('Failed to load remote workforce solution data');
        }
      })
      .catch((err) => {
        if (!active) return;
        // Fallback endpoint
        API.get('/cms/public/page/solutions/remote-workforce')
          .then((res2) => {
            if (!active) return;
            if (res2.data?.success && res2.data?.page) {
              setData(res2.data);
            } else {
              setError('Failed to load remote workforce solution data');
            }
          })
          .catch((err2) => {
            if (!active) return;
            setError(err2.response?.data?.message || err.message || 'Page not found');
          });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const sections = useMemo(() => {
    return (data?.sections || [])
      .slice()
      .filter((s) => s.is_visible !== false && s.status !== 'inactive')
      .sort((a, b) => Number(a.display_order ?? a.sort_order ?? 0) - Number(b.display_order ?? b.sort_order ?? 0));
  }, [data]);

  // Find 7 specific sections by key or type
  const heroSec = sections.find((s) => s.section_type === 'HERO' || s.section_key === 'hero');
  const overviewSec = sections.find((s) => ['OVERVIEW', 'IMAGE_TEXT', 'TEXT_IMAGE_SPLIT'].includes(s.section_type) || s.section_key === 'overview');
  const coreFeaturesSec = sections.find((s) => ['CORE_FEATURES', 'KEY_FEATURES', 'FEATURE_GRID'].includes(s.section_type) || s.section_key === 'core_features' || s.section_key === 'features');
  const howItWorksSec = sections.find((s) => ['HOW_IT_WORKS', 'STEPS'].includes(s.section_type) || s.section_key === 'how_it_works' || s.section_key === 'steps');
  const benefitsSec = sections.find((s) => ['BENEFITS', 'MAIN_BENEFITS', 'BENEFITS_GRID', 'WHY_CHOOSE'].includes(s.section_type) || s.section_key === 'benefits' || s.section_key === 'why_choose');
  const whoItsForSec = sections.find((s) => ['WHO_ITS_FOR', 'TARGET_AUDIENCE', 'AUDIENCES', 'USE_CASES'].includes(s.section_type) || s.section_key === 'who_its_for' || s.section_key === 'target_audience');
  const ctaSec = sections.find((s) => ['CTA', 'FINAL_CTA', 'CTA_BANNER'].includes(s.section_type) || s.section_key === 'cta' || s.section_key === 'final_cta');

  // Other extra dynamic sections if added by admin
  const otherSections = sections.filter((s) => 
    s !== heroSec && 
    s !== overviewSec && 
    s !== coreFeaturesSec && 
    s !== howItWorksSec && 
    s !== benefitsSec && 
    s !== whoItsForSec && 
    s !== ctaSec
  );

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#f8fafc] text-slate-500 text-sm">
        <div className="w-10 h-10 rounded-full border-3 border-emerald-600 border-t-transparent animate-spin mb-4" />
        <span className="font-semibold text-slate-600">Loading Remote Workforce Telecom Engine...</span>
      </div>
    );
  }

  if (error && !data?.page) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#f8fafc] text-slate-500 text-sm px-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
          <Shield className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Page Unavailable</h2>
        <p className="max-w-md mb-6 text-slate-500">{error || 'This solution page is currently inactive or being updated.'}</p>
        <Link to="/" className="px-6 py-2.5 rounded-xl bg-[#12544F] text-white font-bold text-sm hover:bg-[#0e3f3b] transition">
          Return to Home
        </Link>
      </div>
    );
  }

  const heroSettings = parse(heroSec?.custom_settings || heroSec?.settings, {});
  const overviewSettings = parse(overviewSec?.custom_settings || overviewSec?.settings, {});
  const coreFeaturesSettings = parse(coreFeaturesSec?.custom_settings || coreFeaturesSec?.settings, {});
  const howItWorksSettings = parse(howItWorksSec?.custom_settings || howItWorksSec?.settings, {});
  const benefitsSettings = parse(benefitsSec?.custom_settings || benefitsSec?.settings, {});
  const whoItsForSettings = parse(whoItsForSec?.custom_settings || whoItsForSec?.settings, {});
  const ctaSettings = parse(ctaSec?.custom_settings || ctaSec?.settings, {});

  const heroBadges = Array.isArray(heroSettings.badges)
    ? heroSettings.badges
    : typeof heroSettings.badges === 'string' && heroSettings.badges
    ? heroSettings.badges.split('\n').filter(Boolean)
    : [];

  const overviewBadges = Array.isArray(overviewSettings.badges)
    ? overviewSettings.badges
    : typeof overviewSettings.badges === 'string' && overviewSettings.badges
    ? overviewSettings.badges.split('\n').filter(Boolean)
    : [];

  const coreFeaturesList = Array.isArray(coreFeaturesSettings.features)
    ? coreFeaturesSettings.features
    : Array.isArray(coreFeaturesSettings.items)
    ? coreFeaturesSettings.items
    : [];

  const stepsList = Array.isArray(howItWorksSettings.steps)
    ? howItWorksSettings.steps
    : Array.isArray(howItWorksSettings.items)
    ? howItWorksSettings.items
    : [];

  const benefitsList = Array.isArray(benefitsSettings.benefits)
    ? benefitsSettings.benefits
    : Array.isArray(benefitsSettings.points)
    ? benefitsSettings.points
    : Array.isArray(benefitsSettings.items)
    ? benefitsSettings.items
    : [];

  const audienceList = Array.isArray(whoItsForSettings.audiences)
    ? whoItsForSettings.audiences
    : Array.isArray(whoItsForSettings.items)
    ? whoItsForSettings.items
    : [];

  const overviewOrientation = (
    overviewSec?.layout_orientation ||
    overviewSettings.layout_orientation ||
    (overviewSettings.image_position === 'right' ? 'IMAGE_RIGHT' : 'IMAGE_LEFT')
  ).toUpperCase();
  const isOverviewImageLeft = overviewOrientation === 'IMAGE_LEFT';

  return (
    <div className="min-h-screen bg-white">
      {/* ── 1. HERO SECTION ───────────────────────────────────── */}
      {heroSec && (
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
                {(heroSettings.eyebrow || heroSec.subtitle) && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-emerald-300 text-sm font-black uppercase tracking-wider mb-6">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{heroSettings.eyebrow || heroSec.subtitle}</span>
                  </div>
                )}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] mb-5">
                  {heroSec.title}
                </h1>
                {heroSec.subtitle && heroSettings.eyebrow && (
                  <p className="text-lg sm:text-xl text-emerald-100/90 font-semibold mb-4 leading-snug">
                    {heroSec.subtitle}
                  </p>
                )}
                {(heroSec.content_body || heroSec.content_html) && (
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mb-8">
                    {heroSec.content_body || heroSec.content_html}
                  </p>
                )}

                <div className="flex flex-wrap gap-3.5 mb-8">
                  <Link
                    to={heroSettings.primary_btn?.url || heroSettings.primary_url || '/packages'}
                    className="px-6 sm:px-8 py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-[#092328] shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 active:scale-95"
                  >
                    <span>{heroSettings.primary_btn?.text || heroSettings.primary_text || 'Get Started'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  {(heroSettings.secondary_btn?.text || heroSettings.secondary_text) && (
                    <Link
                      to={heroSettings.secondary_btn?.url || heroSettings.secondary_url || '/contact'}
                      className="px-6 sm:px-8 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all active:scale-95"
                    >
                      {heroSettings.secondary_btn?.text || heroSettings.secondary_text}
                    </Link>
                  )}
                </div>

                {heroBadges.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {heroBadges.map((badge, idx) => (
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

              {(heroSec.image_url || heroSettings.image_url) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="lg:col-span-5 flex justify-center"
                >
                  <div className="relative p-3 rounded-3xl bg-[#1E6763]">
                    <img
                      src={mediaUrl(heroSec.image_url || heroSettings.image_url)}
                      alt={heroSec.title}
                      className="w-full max-w-md h-auto object-cover rounded-2xl shadow-2xl border border-white/10"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── 2. OVERVIEW SECTION (Image + Text Split) ──────────── */}
      {overviewSec && (
        <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`flex flex-col gap-12 items-center ${
                isOverviewImageLeft ? 'lg:flex-row-reverse' : 'lg:flex-row'
              }`}
            >
              {/* Text */}
              <div className="flex-1 w-full">
                {overviewSettings.eyebrow && (
                  <span className="text-sm font-black text-[#12544F] uppercase tracking-widest block mb-3">
                    {overviewSettings.eyebrow}
                  </span>
                )}
                <h2 className="text-2xl sm:text-4xl font-black text-[#092328] tracking-tight leading-tight mb-4">
                  {overviewSec.title}
                </h2>
                {overviewSec.subtitle && (
                  <p className="text-base sm:text-lg text-slate-700 font-semibold mb-4">
                    {overviewSec.subtitle}
                  </p>
                )}
                {(overviewSec.content_body || overviewSec.content_html) && (
                  <div className="text-sm sm:text-base text-slate-500 leading-relaxed space-y-4 mb-6">
                    {overviewSec.content_body ? (
                      <p>{overviewSec.content_body}</p>
                    ) : (
                      <CmsHtml html={overviewSec.content_html} />
                    )}
                  </div>
                )}

                {overviewBadges.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                    {overviewBadges.map((b, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                )}

                {(overviewSettings.primary_btn?.text || overviewSettings.primary_text) && (
                  <div>
                    <Link
                      to={overviewSettings.primary_btn?.url || overviewSettings.primary_url || '/packages'}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#12544F] hover:bg-[#0d403c] text-white font-bold text-sm shadow-md transition-all active:scale-95"
                    >
                      <span>{overviewSettings.primary_btn?.text || overviewSettings.primary_text}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Image */}
              {(overviewSec.image_url || overviewSettings.image_url) && (
                <div className="flex-1 w-full flex justify-center">
                  <div className="relative w-full max-w-lg p-3 sm:p-4 rounded-3xl bg-slate-50 border border-slate-200 shadow-xl overflow-hidden group">
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                    <img
                      src={mediaUrl(overviewSec.image_url || overviewSettings.image_url)}
                      alt={overviewSec.title}
                      className="w-full h-auto object-cover rounded-2xl group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── 3. CORE FEATURES SECTION ──────────────────────────── */}
      {coreFeaturesSec && (
        <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-sm font-black text-[#12544F] uppercase tracking-widest block mb-2">
                {coreFeaturesSettings.eyebrow || 'POWERFUL COLLABORATION TOOLS'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#092328] tracking-tight mb-3">
                {coreFeaturesSec.title}
              </h2>
              {coreFeaturesSec.subtitle && (
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                  {coreFeaturesSec.subtitle}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreFeaturesList.map((feat, index) => (
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
                        name={feat.icon || 'ShieldCheck'}
                        className="w-6 h-6 text-[#12544F] group-hover:text-white transition-colors duration-300"
                      />
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-[#092328] mb-2 leading-snug">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {feat.description || feat.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 4. HOW IT WORKS (Steps) ───────────────────────────── */}
      {howItWorksSec && (
        <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-sm font-black text-[#12544F] uppercase tracking-widest block mb-2">
                {howItWorksSettings.eyebrow || 'WORKFLOW'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#092328] tracking-tight mb-3">
                {howItWorksSec.title}
              </h2>
              {howItWorksSec.subtitle && (
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                  {howItWorksSec.subtitle}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stepsList.map((s, i) => (
                <div
                  key={i}
                  className="relative bg-slate-50 rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 rounded-xl bg-[#12544F] text-white flex items-center justify-center font-black text-sm shrink-0">
                      {s.step || `0${i + 1}`}
                    </span>
                    <DynamicIcon name={s.icon || 'Sparkles'} className="w-6 h-6 text-[#12544F]" />
                  </div>
                  <h3 className="font-black text-[#092328] text-base mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {s.description || s.desc}
                  </p>
                  {i < stepsList.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="w-5 h-5 text-slate-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 5. BENEFITS SECTION ───────────────────────────────── */}
      {benefitsSec && (
        <section className="py-16 sm:py-24 bg-[#f8fbf9] border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-sm font-black text-[#12544F] uppercase tracking-widest block mb-2">
                {benefitsSettings.eyebrow || 'PROVEN VALUE'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#092328] tracking-tight mb-3">
                {benefitsSec.title}
              </h2>
              {benefitsSec.subtitle && (
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                  {benefitsSec.subtitle}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefitsList.map((b, i) => (
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
      )}

      {/* ── 6. WHO IT'S FOR (Target Audience) ─────────────────── */}
      {whoItsForSec && (
        <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-sm font-black text-[#12544F] uppercase tracking-widest block mb-2">
                {whoItsForSettings.eyebrow || "WHO IT'S FOR"}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#092328] tracking-tight mb-3">
                {whoItsForSec.title}
              </h2>
              {whoItsForSec.subtitle && (
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                  {whoItsForSec.subtitle}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {audienceList.map((item, index) => (
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
      )}

      {/* ── 7. CTA BANNER ─────────────────────────────────────── */}
      {ctaSec && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#06181b] via-[#092328] to-[#12544F] p-8 sm:p-14 text-white shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="max-w-2xl">
                  <span className="text-sm font-black uppercase tracking-widest text-emerald-300 block mb-2">
                    {ctaSettings.eyebrow || 'READY TO UPGRADE?'}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
                    {ctaSec.title}
                  </h2>
                  {ctaSec.subtitle && (
                    <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed">
                      {ctaSec.subtitle}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-3.5 shrink-0">
                  <Link
                    to={ctaSettings.primary_btn?.url || ctaSettings.primary_url || '/packages'}
                    className="px-6 sm:px-8 py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-[#092328] shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 active:scale-95"
                  >
                    <span>{ctaSettings.primary_btn?.text || ctaSettings.primary_text || 'Explore Packages'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  {(ctaSettings.secondary_btn?.text || ctaSettings.secondary_text) && (
                    <Link
                      to={ctaSettings.secondary_btn?.url || ctaSettings.secondary_url || '/contact'}
                      className="px-6 sm:px-8 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all active:scale-95"
                    >
                      {ctaSettings.secondary_btn?.text || ctaSettings.secondary_text}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Extra admin custom sections (if any) */}
      {otherSections.map((sec) => (
        <section key={sec.id || sec.section_key} className="py-16 bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-[#092328] mb-4">{sec.title}</h2>
            {sec.subtitle && <p className="text-slate-500 mb-6">{sec.subtitle}</p>}
            <CmsHtml html={sec.content_html || sec.content_body} />
          </div>
        </section>
      ))}
    </div>
  );
};

export default RemoteWorkforceSolutionPage;

