import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../../services/api';
import {
  Building2,
  Server,
  PhoneCall,
  Headphones,
  CreditCard,
  ShieldCheck,
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
  Shield,
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
} from 'lucide-react';

const ICON_MAP = {
  Building2,
  Server,
  PhoneCall,
  Headphones,
  CreditCard,
  ShieldCheck,
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
  Shield,
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

export const FinTechSolutionPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    // Fetch dynamic data from GET /api/public/cms-page/solutions/fintech
    API.get('/public/cms-page/solutions/fintech')
      .then((res) => {
        if (!active) return;
        if (res.data?.success && res.data?.page) {
          setData(res.data);
        } else {
          setError('Failed to load fintech solution data');
        }
      })
      .catch((err) => {
        if (!active) return;
        // Fallback endpoint
        API.get('/cms/public/page/solutions/fintech')
          .then((res2) => {
            if (!active) return;
            if (res2.data?.success && res2.data?.page) {
              setData(res2.data);
            } else {
              setError('Failed to load fintech solution data');
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

  // Find sections by key or type
  const heroSec = sections.find((s) => s.section_type === 'HERO' || s.section_key === 'hero');
  const solutionsGridSec = sections.find((s) => s.section_type === 'SOLUTIONS_GRID' || s.section_key === 'solutions_grid');
  const keyFeaturesSec = sections.find((s) => s.section_type === 'KEY_FEATURES' || s.section_key === 'key_features');
  const packagesSec = sections.find((s) => s.section_type === 'PACKAGES' || s.section_key === 'packages');
  const whyChooseSec = sections.find((s) => s.section_type === 'WHY_CHOOSE' || s.section_key === 'why_choose');
  const finalCtaSec = sections.find((s) => s.section_type === 'FINAL_CTA' || s.section_key === 'final_cta');

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#f8fafc] text-slate-500 text-sm">
        <div className="w-10 h-10 rounded-full border-3 border-emerald-600 border-t-transparent animate-spin mb-4" />
        <span className="font-semibold text-slate-600">Loading FinTech Telecom Engine...</span>
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
  const solutionsSettings = parse(solutionsGridSec?.custom_settings || solutionsGridSec?.settings, {});
  const featuresSettings = parse(keyFeaturesSec?.custom_settings || keyFeaturesSec?.settings, {});
  const packagesSettings = parse(packagesSec?.custom_settings || packagesSec?.settings, {});
  const whyChooseSettings = parse(whyChooseSec?.custom_settings || whyChooseSec?.settings, {});
  const finalCtaSettings = parse(finalCtaSec?.custom_settings || finalCtaSec?.settings, {});

  const solutionsList = Array.isArray(solutionsSettings.solutions) ? solutionsSettings.solutions : [];
  const featuresList = Array.isArray(featuresSettings.features) ? featuresSettings.features : [];
  const packagesList = Array.isArray(packagesSettings.packages) ? packagesSettings.packages : [];
  const whyPointsList = Array.isArray(whyChooseSettings.points) ? whyChooseSettings.points : [];

  const heroImage = heroSec?.image_url || heroSettings.image_url || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44';

  return (
    <div className="bg-[#fcfdfd] text-[#092328] font-sans antialiased overflow-hidden">
      
      {/* ── 1. HERO SECTION ── */}
      {heroSec && (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#092328] via-[#0d343a] to-[#12544F] text-white py-20 lg:py-28 border-b border-emerald-900/40">
          {/* Subtle Grid / Glow Background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="lg:col-span-7 space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-sm font-black uppercase tracking-wider backdrop-blur-md">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{heroSec.subtitle || 'FINTECH & BANKING TELECOM ENGINE'}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12]">
                  {heroSec.title}
                </h1>

                {heroSec.content_body && (
                  <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl font-normal">
                    {heroSec.content_body}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    to={heroSettings.primary_btn?.url || heroSettings.primary_url || '/packages'}
                    className="px-7 py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-[#092328] shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 active:scale-95"
                  >
                    <span>{heroSettings.primary_btn?.text || heroSettings.primary_text || 'Explore FinTech Plans'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to={heroSettings.secondary_btn?.url || heroSettings.secondary_url || '/contact'}
                    className="px-7 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all active:scale-95 flex items-center gap-2"
                  >
                    <span>{heroSettings.secondary_btn?.text || heroSettings.secondary_text || 'Talk to Specialist'}</span>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-emerald-800/60">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>BTRC Compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>AES-256 Cloud Voice</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>99.9% Core Uptime</span>
                  </div>
                </div>
              </motion.div>

              {/* Right Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-5 flex justify-center"
              >
                <div className="relative w-full max-w-lg">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                  <div className="relative rounded-2xl overflow-hidden border border-emerald-400/20 bg-slate-900/60 shadow-2xl backdrop-blur-sm p-2">
                    <img
                      src={mediaUrl(heroImage)}
                      alt={heroSec.title}
                      className="w-full h-80 sm:h-96 object-cover rounded-xl"
                    />
                    <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-bold text-white">Bank-Grade SIP Trunks</span>
                      </div>
                      <span className="text-emerald-300 font-mono text-[11px]">096 Official Number</span>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>
      )}

      {/* ── 2. SOLUTIONS GRID (6 Key Use Cases) ── */}
      {solutionsGridSec && (
        <section className="py-20 bg-white border-b border-slate-100" id="solutions">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-1.5 text-sm font-black text-[#12544F] uppercase tracking-widest bg-[#12544F]/5 px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                FINANCIAL USE CASES
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#092328] tracking-tight mb-4">
                {solutionsGridSec.title}
              </h2>
              {solutionsGridSec.subtitle && (
                <p className="text-slate-600 text-base leading-relaxed">
                  {solutionsGridSec.subtitle}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {solutionsList.map((sol, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  className="group relative bg-[#f9fafb] hover:bg-white rounded-2xl border border-slate-200/90 p-7 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-[#12544F]/10 flex items-center justify-center mb-6 group-hover:bg-[#12544F] transition-colors duration-300">
                      <DynamicIcon
                        name={sol.icon}
                        className="w-7 h-7 text-[#12544F] group-hover:text-white transition-colors duration-300"
                      />
                    </div>
                    <h3 className="text-lg font-black text-[#092328] mb-2.5 leading-snug group-hover:text-[#12544F] transition-colors">
                      {sol.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {sol.desc || sol.description}
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center text-sm font-bold text-[#12544F] group-hover:text-emerald-600 transition-colors">
                    <span>Explore integration</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 3. KEY FEATURES SECTION ── */}
      {keyFeaturesSec && (
        <section className="py-20 bg-[#f8fafc] border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-1.5 text-sm font-black text-[#12544F] uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                SECURITY & AUTOMATION
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#092328] tracking-tight mb-4">
                {keyFeaturesSec.title}
              </h2>
              {keyFeaturesSec.subtitle && (
                <p className="text-slate-600 text-base leading-relaxed">
                  {keyFeaturesSec.subtitle}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuresList.map((feat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex items-start gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <DynamicIcon name={feat.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#092328] mb-1">
                      {feat.title}
                    </h3>
                    <p className="text-sm sm:text-sm text-slate-500 leading-relaxed">
                      {feat.desc || feat.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 4. FINANCIAL & FINTECH PACKAGES ── */}
      {packagesSec && (
        <section className="py-24 bg-white border-b border-slate-100" id="packages">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-1.5 text-sm font-black text-[#12544F] uppercase tracking-widest bg-[#12544F]/5 px-3 py-1 rounded-full mb-3">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                TAILORED PRICING PLANS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#092328] tracking-tight mb-4">
                {packagesSec.title}
              </h2>
              {packagesSec.subtitle && (
                <p className="text-slate-600 text-base leading-relaxed">
                  {packagesSec.subtitle}
                </p>
              )}
            </div>

            {/* 3 Equal Width Pricing Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {packagesList.map((pkg, index) => {
                const isPopular = Boolean(pkg.popular);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.1 }}
                    className={`relative rounded-3xl flex flex-col justify-between p-8 sm:p-9 transition-all duration-300 ${
                      isPopular
                        ? 'bg-gradient-to-b from-[#092328] to-[#12544F] text-white shadow-2xl shadow-emerald-900/20 border-2 border-emerald-400 ring-4 ring-emerald-500/10 -translate-y-2'
                        : 'bg-[#fcfdfd] text-[#092328] border border-slate-200/90 shadow-lg hover:shadow-xl hover:border-slate-300'
                    }`}
                  >
                    {/* Most Popular Badge */}
                    {isPopular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-400 text-[#092328] font-black text-[11px] uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                        ★ Most Popular Choice
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-xl font-black ${isPopular ? 'text-white' : 'text-[#092328]'}`}>
                          {pkg.name}
                        </h3>
                      </div>

                      {/* Pricing Display */}
                      <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-slate-200/20">
                        <span className={`text-4xl sm:text-5xl font-black tracking-tight ${isPopular ? 'text-emerald-300' : 'text-[#12544F]'}`}>
                          {pkg.price}
                        </span>
                        {pkg.period && (
                          <span className={`text-sm font-semibold ${isPopular ? 'text-emerald-100/70' : 'text-slate-500'}`}>
                            {pkg.period}
                          </span>
                        )}
                      </div>

                      {/* Features List */}
                      <div className="space-y-3.5 mb-8">
                        <div className={`text-sm font-bold uppercase tracking-wider mb-2 ${isPopular ? 'text-emerald-200/80' : 'text-slate-400'}`}>
                          What&apos;s included:
                        </div>
                        {Array.isArray(pkg.features) &&
                          pkg.features.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-3 text-sm">
                              <div
                                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                  isPopular ? 'bg-emerald-400/20 text-emerald-300' : 'bg-emerald-50 text-emerald-600'
                                }`}
                              >
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                              <span className={isPopular ? 'text-slate-200' : 'text-slate-700'}>
                                {feat}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-2">
                      <Link
                        to={isPopular ? '/packages' : '/contact'}
                        className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md ${
                          isPopular
                            ? 'bg-emerald-400 hover:bg-emerald-300 text-[#092328] shadow-emerald-500/30'
                            : 'bg-[#12544F] hover:bg-[#0e3f3b] text-white shadow-emerald-950/10'
                        }`}
                      >
                        <span>{pkg.cta || 'Choose Package'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── 5. WHY CHOOSE MYBDPHONE SECTION (Clean 2-Column / Card Grid) ── */}
      {whyChooseSec && (
        <section className="py-20 bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Heading & Mission */}
              <div className="lg:col-span-5 space-y-5">
                <span className="inline-flex items-center gap-1.5 text-sm font-black text-[#12544F] uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  ENTERPRISE ADVANTAGE
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#092328] tracking-tight leading-tight">
                  {whyChooseSec.title}
                </h2>
                {whyChooseSec.subtitle && (
                  <p className="text-base text-slate-600 leading-relaxed font-medium">
                    {whyChooseSec.subtitle}
                  </p>
                )}

                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                  <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Regulatory SLA Guarantee</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Operate under authorized Bangladesh Telecommunication Regulatory Commission guidelines with certified voice trunking and verified CLI.
                  </p>
                </div>
              </div>

              {/* Right Column: 4 Clean Reason Cards (2x2 Grid) */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {whyPointsList.map((pt, pIdx) => (
                  <motion.div
                    key={pIdx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: pIdx * 0.08 }}
                    className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-[#12544F]/10 text-[#12544F] flex items-center justify-center font-black text-sm mb-4">
                        0{pIdx + 1}
                      </div>
                      <h3 className="text-base font-black text-[#092328] mb-2 leading-snug">
                        {pt.title}
                      </h3>
                      <p className="text-sm sm:text-sm text-slate-600 leading-relaxed">
                        {pt.desc || pt.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ── 6. FINAL CTA SECTION ── */}
      {finalCtaSec && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#06181b] via-[#092328] to-[#12544F] p-8 sm:p-14 text-white shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="max-w-2xl space-y-3">
                  <span className="text-sm font-black uppercase tracking-widest text-emerald-300 block">
                    READY TO UPGRADE?
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {finalCtaSec.title}
                  </h2>
                  {finalCtaSec.subtitle && (
                    <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed">
                      {finalCtaSec.subtitle}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3.5 shrink-0">
                  <Link
                    to={finalCtaSettings.primary_btn?.url || '/packages'}
                    className="px-8 py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-[#092328] shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 active:scale-95"
                  >
                    <span>{finalCtaSettings.primary_btn?.text || 'Get Started'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to={finalCtaSettings.secondary_btn?.url || '/contact'}
                    className="px-8 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all active:scale-95"
                  >
                    <span>{finalCtaSettings.secondary_btn?.text || 'Talk to Specialist'}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default FinTechSolutionPage;
