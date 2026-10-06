import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Layers,
  Smile,
  TrendingUp,
  Smartphone,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Rocket,
  Store,
  Building2,
  PhoneCall,
  Check,
  Zap,
  Globe,
  Shield,
  Clock,
  Award,
  Users,
} from 'lucide-react';
import API from '../../services/api';

const ICON_MAP = {
  Layers,
  Smile,
  TrendingUp,
  Smartphone,
  ShieldCheck,
  Headphones,
  Rocket,
  Store,
  Building2,
  PhoneCall,
  Zap,
  Globe,
  Shield,
  Clock,
  Award,
  Users,
  Sparkles,
};

const AUDIENCE_ICONS = {
  Startup: Rocket,
  'Small Business': Store,
  'Corporate Team': Building2,
  'Call Center': Headphones,
};

const DEFAULT_PAGE_DATA = {
  page: {
    title: 'Why Choose MyBDPhone',
    meta_title: 'Why Choose MyBDPhone - Powerful Business Communication Platform',
    meta_description:
      'Discover why modern businesses choose MyBDPhone for all-in-one IP telephony, PBX, and AI communication tools.',
  },
  sections: [
    {
      section_key: 'hero',
      section_type: 'HERO',
      title: 'Powerful Communication. Simple Experience.',
      subtitle: 'WHY CHOOSE MYBDPHONE?',
      content_body:
        'Everything your business needs to stay connected without complex setups or hardware bloat.',
      display_order: 0,
      custom_settings: {
        floating_cards: ['✓ Easy to Manage', '✓ Scalable', '✓ Business Ready'],
        primary_btn: { text: 'Get Started', url: '/packages' },
        secondary_btn: { text: 'Talk to Specialist', url: '/contact' },
      },
    },
    {
      section_key: 'main_benefits',
      section_type: 'MAIN_BENEFITS',
      title: 'Key Platform Benefits',
      subtitle: 'Designed for efficiency, clarity, and growth.',
      display_order: 1,
      custom_settings: {
        benefits: [
          {
            num: '01',
            title: 'All-in-One Platform',
            desc: 'IP Phone, PBX, AI Calling, and Auto Dialer in one central system.',
            icon: 'Layers',
          },
          {
            num: '02',
            title: 'Easy to Use',
            desc: 'Simple dashboard management with no steep learning curve.',
            icon: 'Smile',
          },
          {
            num: '03',
            title: 'Flexible & Scalable',
            desc: 'Instantly scale extensions and channels as your business grows.',
            icon: 'TrendingUp',
          },
          {
            num: '04',
            title: 'Multi-Device Sync',
            desc: 'Seamless call handling across Android, iOS, Desktop, and Hardware IP Phones.',
            icon: 'Smartphone',
          },
          {
            num: '05',
            title: 'Reliable Uptime',
            desc: 'High-availability telecom network ensuring uninterrupted calling.',
            icon: 'ShieldCheck',
          },
          {
            num: '06',
            title: 'Local 24/7 Support',
            desc: 'Dedicated support team in Bangladesh ready to assist anytime.',
            icon: 'Headphones',
          },
        ],
      },
    },
    {
      section_key: 'comparison',
      section_type: 'COMPARISON',
      title: 'Traditional Systems vs MyBDPhone',
      subtitle:
        'See how MyBDPhone modernizes your entire business telecommunication setup.',
      display_order: 2,
      custom_settings: {
        comparison_table: [
          {
            traditional: 'Multiple fragmented tools',
            mybdphone: 'One unified platform',
          },
          {
            traditional: 'Complex hardware setup',
            mybdphone: 'Easy cloud-based setup',
          },
          {
            traditional: 'Limited flexibility & rigid plans',
            mybdphone: 'Flexible custom packages',
          },
          {
            traditional: 'Hard to manage across locations',
            mybdphone: 'Centralized online dashboard',
          },
          {
            traditional: 'Basic calling features only',
            mybdphone: 'Advanced AI & Call Automation',
          },
        ],
      },
    },
    {
      section_key: 'target_audience',
      section_type: 'TARGET_AUDIENCE',
      title: 'Built for Every Business',
      subtitle: 'Tailored solutions for teams of all sizes.',
      display_order: 3,
      custom_settings: {
        audiences: [
          {
            title: 'Startup',
            desc: 'Quick setup, low cost, and professional caller ID.',
            tag: 'Perfect for small teams',
          },
          {
            title: 'Small Business',
            desc: 'Manage client calls smoothly with smart routing.',
            tag: 'Perfect for growing teams',
          },
          {
            title: 'Corporate Team',
            desc: 'Multi-department PBX extensions and analytics.',
            tag: 'Perfect for enterprises',
          },
          {
            title: 'Call Center',
            desc: 'High-volume auto dialer, recording, and agent monitoring.',
            tag: 'Perfect for support & sales',
          },
        ],
      },
    },
    {
      section_key: 'trust_numbers',
      section_type: 'TRUST_NUMBERS',
      title: 'Trusted by Growing Companies',
      subtitle: 'Proven stats backing our service reliability.',
      display_order: 4,
      custom_settings: {
        stats: [
          { value: '10K+', label: 'Active Users' },
          { value: '24/7', label: 'Dedicated Support' },
          { value: '99.9%', label: 'Service Availability' },
          { value: '1', label: 'Unified Platform' },
        ],
      },
    },
    {
      section_key: 'final_cta',
      section_type: 'FINAL_CTA',
      title: 'Choose a smarter way to communicate.',
      subtitle: 'Upgrade your business calling infrastructure today.',
      display_order: 5,
      custom_settings: {
        primary_btn: { text: 'Get Started', url: '/packages' },
        secondary_btn: { text: 'Talk to Specialist', url: '/contact' },
      },
    },
  ],
};

const parseSettings = (sec) => {
  if (sec?.custom_settings && typeof sec.custom_settings === 'object') {
    return sec.custom_settings;
  }
  if (sec?.settings && typeof sec.settings === 'object') {
    return sec.settings;
  }
  try {
    return JSON.parse(sec?.custom_settings || sec?.settings || '{}');
  } catch {
    return {};
  }
};

export const WhyChooseUs = () => {
  const [pageData, setPageData] = useState(DEFAULT_PAGE_DATA.page);
  const [sections, setSections] = useState(DEFAULT_PAGE_DATA.sections);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        const res = await API.get('/public/cms-page/why-choose-us');
        if (res.data?.success) {
          if (res.data.page) setPageData(res.data.page);
          if (res.data.sections && res.data.sections.length > 0) {
            setSections(res.data.sections);
          }
        }
      } catch (err) {
        console.error(
          'Failed to fetch dynamic Why Choose Us page data, using default fallback:',
          err
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, []);

  const sectionMap = useMemo(() => {
    const map = {};
    sections.forEach((s) => {
      const typeKey = (s.section_type || '').toUpperCase();
      const secKey = (s.section_key || '').toUpperCase();
      if (typeKey) map[typeKey] = s;
      if (secKey) map[secKey] = s;
    });
    return map;
  }, [sections]);

  const heroSec =
    sectionMap['HERO'] || sectionMap['HERO'] || DEFAULT_PAGE_DATA.sections[0];
  const benefitsSec =
    sectionMap['MAIN_BENEFITS'] ||
    sectionMap['MAIN_BENEFITS'] ||
    DEFAULT_PAGE_DATA.sections[1];
  const comparisonSec =
    sectionMap['COMPARISON'] ||
    sectionMap['COMPARISON'] ||
    DEFAULT_PAGE_DATA.sections[2];
  const audienceSec =
    sectionMap['TARGET_AUDIENCE'] ||
    sectionMap['TARGET_AUDIENCE'] ||
    DEFAULT_PAGE_DATA.sections[3];
  const trustSec =
    sectionMap['TRUST_NUMBERS'] ||
    sectionMap['TRUST_NUMBERS'] ||
    DEFAULT_PAGE_DATA.sections[4];
  const ctaSec =
    sectionMap['FINAL_CTA'] ||
    sectionMap['FINAL_CTA'] ||
    DEFAULT_PAGE_DATA.sections[5];

  const heroSettings = parseSettings(heroSec);
  const benefitsSettings = parseSettings(benefitsSec);
  const comparisonSettings = parseSettings(comparisonSec);
  const audienceSettings = parseSettings(audienceSec);
  const trustSettings = parseSettings(trustSec);
  const ctaSettings = parseSettings(ctaSec);

  const floatingCards =
    heroSettings.floating_cards ||
    DEFAULT_PAGE_DATA.sections[0].custom_settings.floating_cards;
  const benefitsList =
    benefitsSettings.benefits ||
    DEFAULT_PAGE_DATA.sections[1].custom_settings.benefits;
  const comparisonList =
    comparisonSettings.comparison_table ||
    comparisonSettings.rows ||
    DEFAULT_PAGE_DATA.sections[2].custom_settings.comparison_table;
  const audiencesList =
    audienceSettings.audiences ||
    DEFAULT_PAGE_DATA.sections[3].custom_settings.audiences;
  const statsList =
    trustSettings.stats ||
    DEFAULT_PAGE_DATA.sections[4].custom_settings.stats;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#092328] selection:bg-[#12544F]/10 selection:text-[#12544F]">
      {/* ========================================================= */}
      {/* 1. HERO SECTION WITH FLOATING UI CARDS */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EBF5F3] via-[#F4FAF8] to-[#F8FAFC] border-b border-emerald-950/10 py-16 md:py-24">
        {/* Subtle Decorative Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#12544F]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-12 right-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12544F]/10 text-[#12544F] text-sm font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#2A835F]" />
                <span>
                  {heroSec.subtitle ||
                    heroSettings.eyebrow ||
                    'WHY CHOOSE MYBDPHONE?'}
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#092328] tracking-tight leading-[1.12]">
                {heroSec.title || 'Powerful Communication. Simple Experience.'}
              </h1>

              {/* Subtitle / Description */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {heroSec.content_body ||
                  heroSec.subtitle_text ||
                  'Everything your business needs to stay connected without complex setups or hardware bloat.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to={heroSettings.primary_btn?.url || '/packages'}
                  className="px-7 py-3.5 bg-[#12544F] hover:bg-[#0c3935] text-white rounded-2xl text-sm sm:text-sm font-black transition shadow-lg shadow-[#12544F]/20 flex items-center gap-2 group"
                >
                  <span>{heroSettings.primary_btn?.text || 'Get Started'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  to={heroSettings.secondary_btn?.url || '/contact'}
                  className="px-7 py-3.5 bg-white hover:bg-slate-100 text-[#092328] border border-slate-200 rounded-2xl text-sm sm:text-sm font-bold transition shadow-xs"
                >
                  {heroSettings.secondary_btn?.text || 'Talk to Specialist'}
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Floating UI Interactive Showcase Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Floating Container */}
                <div className="relative rounded-3xl p-6 sm:p-8 bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-2xl space-y-6">
                  {/* Top Status Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#12544F]/10 text-[#12544F] flex items-center justify-center font-black">
                        <Layers className="w-5 h-5 text-[#12544F]" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-[#092328]">
                          Unified Telecom Engine
                        </div>
                        <div className="text-[11px] text-slate-400 font-semibold">
                          BTRC Licensed IPTSP
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Live 99.9%</span>
                    </div>
                  </div>

                  {/* Floating Checkmark Points */}
                  <div className="space-y-3">
                    {floatingCards.map((item, idx) => {
                      const cleanText = String(item).replace(/^[✓✔\s*•-]+\s*/, '');
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                          className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 hover:border-[#12544F]/40 hover:bg-emerald-50/40 transition duration-200 group"
                        >
                          <div className="w-7 h-7 rounded-xl bg-emerald-100 group-hover:bg-[#12544F] text-[#12544F] group-hover:text-white flex items-center justify-center transition shrink-0">
                            <Check className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-bold text-[#092328]">
                            {cleanText}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Bottom Stats Preview Pill */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#092328] to-[#12544F] text-white flex items-center justify-between shadow-md">
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">
                        Zero Hardware Bloat
                      </div>
                      <div className="text-sm font-extrabold text-white mt-0.5">
                        Instant 5-Minute Activation
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-emerald-300" />
                    </div>
                  </div>
                </div>

                {/* Floating Micro Badge Accent */}
                <div className="hidden sm:flex absolute -bottom-5 -left-5 p-3 rounded-2xl bg-white border border-slate-200 shadow-xl items-center gap-2.5 z-20">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-black uppercase text-slate-400">
                      Security
                    </div>
                    <div className="text-sm font-black text-[#092328]">
                      Enterprise SLA
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. MAIN BENEFITS SECTION (6 Large Modern Cards) */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-black uppercase tracking-wider text-[#2A835F] bg-[#2A835F]/10 px-3.5 py-1 rounded-full">
            OUR ADVANTAGES
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#092328] tracking-tight mt-3 mb-3">
            {benefitsSec.title || 'Key Platform Benefits'}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-normal">
            {benefitsSec.subtitle || 'Designed for efficiency, clarity, and growth.'}
          </p>
        </div>

        {/* 2-Column / 3-Column Modern Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {benefitsList.map((benefit, idx) => {
            const IconComp = ICON_MAP[benefit.icon] || Layers;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-8 flex flex-col justify-between hover:shadow-xl hover:border-[#12544F]/40 transition-all duration-300 group relative overflow-hidden"
              >
                {/* Subtle top ambient shimmer */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

                <div>
                  {/* Top Bar: Number + Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-slate-300 group-hover:text-[#12544F] transition-colors font-mono">
                      {benefit.num || `0${idx + 1}`}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-[#12544F] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#12544F] group-hover:text-white transition-all shadow-2xs">
                      <IconComp className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-black text-[#092328] mb-2.5 group-hover:text-[#12544F] transition-colors">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-sm text-slate-500 leading-relaxed">
                    {benefit.desc || benefit.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. COMPARISON SECTION (Traditional vs MyBDPhone) */}
      {/* ========================================================= */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-sm font-black uppercase tracking-wider text-[#12544F] bg-[#12544F]/10 px-3.5 py-1 rounded-full">
              THE UPGRADE PATH
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#092328] tracking-tight mt-3 mb-3">
              {comparisonSec.title || 'Traditional Systems vs MyBDPhone'}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-normal">
              {comparisonSec.subtitle ||
                'See how MyBDPhone modernizes your entire business telecommunication setup.'}
            </p>
          </div>

          {/* Side-by-Side Comparison Container */}
          <div className="rounded-3xl border border-slate-200 shadow-xl overflow-hidden bg-white">
            {/* Table Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 bg-slate-50/90 border-b border-slate-200">
              <div className="p-5 sm:p-6 flex items-center gap-3 border-b md:border-b-0 md:border-r border-slate-200">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-800">
                    Traditional Phone Systems
                  </div>
                  <div className="text-[11px] text-slate-400 font-semibold">
                    Rigid on-premise hardware & fixed lines
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 flex items-center justify-between bg-emerald-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#12544F] text-white flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-[#12544F]">
                      MyBDPhone Platform
                    </div>
                    <div className="text-[11px] text-emerald-800/70 font-semibold">
                      100% Cloud VoIP & AI Voice Automation
                    </div>
                  </div>
                </div>
                <span className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                  Recommended
                </span>
              </div>
            </div>

            {/* Table Comparison Rows */}
            <div className="divide-y divide-slate-100">
              {comparisonList.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-2 hover:bg-slate-50/50 transition-colors"
                >
                  {/* Traditional side */}
                  <div className="p-5 sm:p-6 flex items-start gap-3 border-b md:border-b-0 md:border-r border-slate-100 text-slate-600">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-sm font-medium">
                      {row.traditional || row.legacy || '—'}
                    </span>
                  </div>

                  {/* MyBDPhone side */}
                  <div className="p-5 sm:p-6 flex items-start gap-3 bg-emerald-50/20 text-emerald-950 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-sm">
                      {row.mybdphone || row.modern || row.ai || '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. BUILT FOR EVERY BUSINESS SECTION (Target Audiences) */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-black uppercase tracking-wider text-[#2A835F] bg-[#2A835F]/10 px-3.5 py-1 rounded-full">
            ADAPTIVE FOR ALL TEAMS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#092328] tracking-tight mt-3 mb-3">
            {audienceSec.title || 'Built for Every Business'}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-normal">
            {audienceSec.subtitle || 'Tailored solutions for teams of all sizes.'}
          </p>
        </div>

        {/* 4 Large Clean Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiencesList.map((item, idx) => {
            const IconComponent =
              AUDIENCE_ICONS[item.title] ||
              ICON_MAP[item.icon] ||
              Rocket;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white rounded-3xl border border-slate-200/90 p-7 flex flex-col justify-between shadow-2xs hover:shadow-xl hover:border-[#12544F]/40 transition-all duration-300 group"
              >
                <div>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 group-hover:bg-[#12544F] text-[#12544F] group-hover:text-white flex items-center justify-center mb-6 transition shadow-2xs">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-black text-[#092328] mb-2 group-hover:text-[#12544F] transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-sm text-slate-500 leading-relaxed mb-6">
                    {item.desc || item.description}
                  </p>
                </div>

                {/* Pill Tag */}
                <div className="pt-2">
                  <span className="inline-block text-[11px] font-black uppercase tracking-wider text-[#12544F] bg-[#12544F]/10 px-3 py-1 rounded-full">
                    {item.tag || 'Tailored Solution'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. TRUST & NUMBERS SECTION (Verified Stats) */}
      {/* ========================================================= */}
      <section className="py-20 bg-gradient-to-br from-[#092328] to-[#12544F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-sm font-black uppercase tracking-wider text-emerald-300 bg-white/10 px-3.5 py-1 rounded-full">
              PROVEN TRACK RECORD
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3 mb-3">
              {trustSec.title || 'Trusted by Growing Companies'}
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed font-normal">
              {trustSec.subtitle || 'Proven stats backing our service reliability.'}
            </p>
          </div>

          {/* 4 Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {statsList.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-6 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 text-center space-y-2 hover:bg-white/15 transition-all"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-mono">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-sm font-semibold text-emerald-200">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. FINAL CTA SECTION */}
      {/* ========================================================= */}
      <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#092328] via-[#0d3f3b] to-[#12544F] rounded-3xl p-8 sm:p-14 text-white text-center shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
              {ctaSec.title || 'Choose a smarter way to communicate.'}
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/90 font-normal leading-relaxed">
              {ctaSec.subtitle ||
                'Upgrade your business calling infrastructure today.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
              <Link
                to={ctaSettings.primary_btn?.url || '/packages'}
                className="px-8 py-3.5 bg-white text-[#092328] hover:bg-emerald-50 rounded-2xl text-sm sm:text-sm font-black transition shadow-lg flex items-center gap-2 group"
              >
                <span>{ctaSettings.primary_btn?.text || 'Get Started'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to={ctaSettings.secondary_btn?.url || '/contact'}
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl text-sm sm:text-sm font-bold transition"
              >
                {ctaSettings.secondary_btn?.text || 'Talk to Specialist'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyChooseUs;
