import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Phone,
  Building2,
  Globe,
  Server,
  Bot,
  Zap,
  Mic,
  Music,
  Target,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Headphones,
  ArrowRight,
  ChevronRight,
  Layers,
  Award,
  Users,
  Check,
  PhoneCall,
  Flame,
  HelpCircle,
} from 'lucide-react';
import API from '../../services/api';

const ICON_MAP = {
  Phone,
  Building2,
  Globe,
  Server,
  Bot,
  Zap,
  Mic,
  Music,
  Target,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Headphones,
  Layers,
  Award,
  Users,
  PhoneCall,
};

const DEFAULT_ABOUT = {
  page: {
    title: 'About MyBDPhone',
    meta_title: 'About MyBDPhone - Unified Business Communication Platform',
    meta_description:
      'Learn about MyBDPhone, our mission, vision, and how we empower modern businesses with IP PBX, Virtual Numbers, and AI Calling.',
  },
  sections: [
    {
      section_key: 'hero',
      section_type: 'HERO',
      title: 'About MyBDPhone',
      subtitle:
        'A unified business communication platform powering modern enterprises and growing businesses across Bangladesh.',
      content_body: '',
      image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
      layout_orientation: 'IMAGE_RIGHT',
      display_order: 0,
      custom_settings: {
        eyebrow: 'WHO WE ARE & OUR MISSION',
        primary_btn: { text: 'Explore Solutions', url: '/packages' },
        secondary_btn: { text: 'Contact Us', url: '/contact' },
      },
    },
    {
      section_key: 'who_we_are',
      section_type: 'WHO_WE_ARE',
      title: 'Who We Are',
      subtitle: 'Simplifying Business Telecommunications',
      content_body:
        'MyBDPhone is a next-generation IP telecom and communication engine built to bridge the gap between traditional telephone systems and modern cloud technology. We serve enterprises, call centers, e-commerce, and startups with scalable, reliable voice and AI solutions.',
      image_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7',
      layout_orientation: 'IMAGE_RIGHT',
      display_order: 1,
      custom_settings: {
        badge: 'OUR IDENTITY',
        stats: [
          { label: 'Uptime SLA', value: '99.98%' },
          { label: 'Active Extensions', value: '50,000+' },
          { label: 'Dhaka NOC Support', value: '24/7' },
        ],
      },
    },
    {
      section_key: 'what_we_offer',
      section_type: 'WHAT_WE_OFFER',
      title: 'What We Offer',
      subtitle:
        'Comprehensive communication tools designed for modern workforce requirements.',
      display_order: 2,
      custom_settings: {
        services: [
          {
            title: 'IP Phone',
            desc: 'Crystal clear hardware and softphone VoIP connectivity.',
            icon: 'Phone',
          },
          {
            title: 'Business IP Number',
            desc: 'Official corporate identity for customer trust.',
            icon: 'Building2',
          },
          {
            title: 'Virtual Number',
            desc: 'Instant multi-channel virtual phone routing.',
            icon: 'Globe',
          },
          {
            title: 'Cloud PBX',
            desc: 'Smart extensions, call queues, and intelligent routing.',
            icon: 'Server',
          },
          {
            title: 'AI Calling',
            desc: 'Automated AI voice calls with localized Bangla support.',
            icon: 'Bot',
          },
          {
            title: 'Auto Dialer',
            desc: 'Broadcast campaigns and automated customer outreach.',
            icon: 'Zap',
          },
          {
            title: 'Call Recording',
            desc: 'Secure cloud storage for call logs and quality audit.',
            icon: 'Mic',
          },
          {
            title: 'Caller Tune',
            desc: 'Custom corporate branding tune for incoming callers.',
            icon: 'Music',
          },
        ],
      },
    },
    {
      section_key: 'mission_vision',
      section_type: 'MISSION_VISION',
      title: 'Our Mission & Vision',
      subtitle: 'Guiding principles driving our technological innovations.',
      display_order: 3,
      custom_settings: {
        mission: {
          title: 'Our Mission',
          desc: 'To empower every business in Bangladesh with modern, accessible, and high-quality cloud communication solutions that replace rigid traditional hardware.',
        },
        vision: {
          title: 'Our Vision',
          desc: 'To lead the AI and IP telecommunication transformation, becoming the most trusted business voice platform across South Asia.',
        },
      },
    },
    {
      section_key: 'why_we_built',
      section_type: 'WHY_WE_BUILT',
      title: 'Why We Built MyBDPhone',
      subtitle: 'Solving modern business communication challenges.',
      content_body:
        'Traditional telecom setups are expensive, inflexible, and difficult to manage across remote teams. We built MyBDPhone as a unified, cloud-first platform that lets companies set up call centers, PBX extensions, dynamic IVRs, and AI voice agents in minutes without heavy hardware investments.',
      display_order: 4,
      custom_settings: {
        problem_title: 'The Traditional Problem',
        problem_desc:
          'High upfront PBX hardware costs, fixed landline wires, inflexible vendor contracts, and no remote agent flexibility.',
        solution_title: 'The MyBDPhone Solution',
        solution_desc:
          '100% cloud-hosted IP telephony, instant 096 activation, self-service web portals, and integrated Bangla AI voice bots.',
      },
    },
    {
      section_key: 'our_commitment',
      section_type: 'OUR_COMMITMENT',
      title: 'Our Commitment',
      subtitle:
        'What you can always expect from our service and support team.',
      display_order: 5,
      custom_settings: {
        commitments: [
          {
            title: 'Reliable Service',
            desc: 'High-uptime infrastructure ensuring continuous call availability.',
            icon: 'ShieldCheck',
          },
          {
            title: 'Simple Experience',
            desc: 'Intuitive admin dashboard and instant activation workflows.',
            icon: 'CheckCircle2',
          },
          {
            title: 'Secure Communication',
            desc: 'Encrypted VoIP protocols and compliance with BTRC regulations.',
            icon: 'Lock',
          },
          {
            title: 'Customer Support',
            desc: 'Dedicated 24/7 technical assistance for smooth operation.',
            icon: 'Headphones',
          },
        ],
      },
    },
    {
      section_key: 'final_cta',
      section_type: 'FINAL_CTA',
      title: 'Ready for smarter communication?',
      subtitle:
        'Transform your enterprise telecommunications with MyBDPhone today.',
      display_order: 6,
      custom_settings: {
        primary_btn: { text: 'Get Started', url: '/packages' },
        secondary_btn: { text: 'Talk to Specialist', url: '/contact' },
      },
    },
  ],
};

const parseSettings = (sec) => {
  if (sec?.custom_settings && typeof sec.custom_settings === 'object') return sec.custom_settings;
  if (sec?.settings && typeof sec.settings === 'object') return sec.settings;
  try {
    return JSON.parse(sec?.custom_settings || sec?.settings || '{}');
  } catch {
    return {};
  }
};

const mediaUrl = (url = '', fallback = '') => {
  if (!url) return fallback;
  if (/^(https?:\/\/|data:|blob:)/i.test(url)) return url;
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const About = () => {
  const [pageData, setPageData] = useState(DEFAULT_ABOUT.page);
  const [sections, setSections] = useState(DEFAULT_ABOUT.sections);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const res = await API.get('/public/cms-page/about');
        if (res.data?.success) {
          if (res.data.page) setPageData(res.data.page);
          if (res.data.sections && res.data.sections.length > 0) {
            setSections(res.data.sections);
          }
        }
      } catch (err) {
        console.error('Failed to fetch dynamic About page data, using default:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  const sectionMap = useMemo(() => {
    const map = {};
    sections.forEach((s) => {
      const key = s.section_type || s.section_key;
      map[key] = s;
      if (s.section_key) map[s.section_key.toUpperCase()] = s;
    });
    return map;
  }, [sections]);

  const heroSec = sectionMap['HERO'] || sectionMap['hero'] || DEFAULT_ABOUT.sections[0];
  const whoSec = sectionMap['WHO_WE_ARE'] || sectionMap['who_we_are'] || DEFAULT_ABOUT.sections[1];
  const offerSec = sectionMap['WHAT_WE_OFFER'] || sectionMap['what_we_offer'] || DEFAULT_ABOUT.sections[2];
  const missionSec = sectionMap['MISSION_VISION'] || sectionMap['mission_vision'] || DEFAULT_ABOUT.sections[3];
  const whySec = sectionMap['WHY_WE_BUILT'] || sectionMap['why_we_built'] || DEFAULT_ABOUT.sections[4];
  const commitSec = sectionMap['OUR_COMMITMENT'] || sectionMap['our_commitment'] || DEFAULT_ABOUT.sections[5];
  const ctaSec = sectionMap['FINAL_CTA'] || sectionMap['final_cta'] || DEFAULT_ABOUT.sections[6];

  const heroSettings = parseSettings(heroSec);
  const whoSettings = parseSettings(whoSec);
  const offerSettings = parseSettings(offerSec);
  const missionSettings = parseSettings(missionSec);
  const whySettings = parseSettings(whySec);
  const commitSettings = parseSettings(commitSec);
  const ctaSettings = parseSettings(ctaSec);

  const servicesList = offerSettings.services || DEFAULT_ABOUT.sections[2].custom_settings.services;
  const commitmentsList = commitSettings.commitments || DEFAULT_ABOUT.sections[5].custom_settings.commitments;
  const missionData = missionSettings.mission || DEFAULT_ABOUT.sections[3].custom_settings.mission;
  const visionData = missionSettings.vision || DEFAULT_ABOUT.sections[3].custom_settings.vision;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#092328]">
      {/* ========================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden bg-linear-to-b from-[#EBF5F3] via-[#F4FAF8] to-[#F8FAFC] border-b border-emerald-950/10 py-16 md:py-24">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#12544F]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12544F]/10 text-[#12544F] text-sm font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#2A835F]" />
                <span>{heroSettings.eyebrow || 'WHO WE ARE & OUR MISSION'}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#092328] tracking-tight leading-[1.1]">
                {heroSec.title || 'About MyBDPhone'}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {heroSec.subtitle ||
                  'A unified business communication platform powering modern enterprises and growing businesses across Bangladesh.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to={heroSettings.primary_btn?.url || '/packages'}
                  className="px-6 py-3.5 bg-[#12544F] hover:bg-[#0c3935] text-white rounded-2xl text-sm font-black transition shadow-lg shadow-[#12544F]/20 flex items-center gap-2"
                >
                  <span>{heroSettings.primary_btn?.text || 'Explore Solutions'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to={heroSettings.secondary_btn?.url || '/contact'}
                  className="px-6 py-3.5 bg-white hover:bg-slate-100 text-[#092328] border border-slate-200 rounded-2xl text-sm font-bold transition shadow-2xs"
                >
                  {heroSettings.secondary_btn?.text || 'Contact Us'}
                </Link>
              </div>
            </motion.div>

            {/* Right Visual Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-white">
                  <img
                    src={
                      mediaUrl(
                        heroSec.image_url || heroSettings.image_url || heroSettings.image,
                        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
                      )
                    }
                    alt="MyBDPhone Team & Telecom Infrastructure"
                    className="w-full h-72 sm:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#092328]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-100 shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-[#12544F]">
                          BTRC Licensed Operator
                        </div>
                        <div className="text-sm font-black text-[#092328]">
                          Carrier-Grade IP Telephony
                        </div>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. WHO WE ARE SECTION (2-Column Clean Split) */}
      {/* ========================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-sm font-black uppercase tracking-wider text-[#2A835F] bg-[#2A835F]/10 px-3 py-1 rounded-full">
              {whoSec.subtitle || 'SIMPLIFYING BUSINESS TELECOMMUNICATIONS'}
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-[#092328] tracking-tight">
              {whoSec.title || 'Who We Are'}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {whoSec.content_body ||
                'MyBDPhone is a next-generation IP telecom and communication engine built to bridge the gap between traditional telephone systems and modern cloud technology. We serve enterprises, call centers, e-commerce, and startups with scalable, reliable voice and AI solutions.'}
            </p>

            {/* Stats Highlights */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-3">
              {(
                whoSettings.stats || [
                  { label: 'Uptime SLA', value: '99.98%' },
                  { label: 'Active Extensions', value: '50,000+' },
                  { label: 'Dhaka NOC Support', value: '24/7' },
                ]
              ).map((stat, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center sm:text-left"
                >
                  <div className="text-xl sm:text-2xl font-black text-[#12544F]">
                    {stat.value}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-white">
              <img
                src={
                  mediaUrl(
                    whoSec.image_url || whoSettings.image_url || whoSettings.image,
                    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80'
                  )
                }
                alt="MyBDPhone Team Collaboration"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. WHAT WE OFFER (8 Clean Cards Grid) */}
      {/* ========================================================= */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-[#092328] tracking-tight mb-3">
              {offerSec.title || 'What We Offer'}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-normal">
              {offerSec.subtitle ||
                'Comprehensive communication tools designed for modern workforce requirements.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesList.map((service, idx) => {
              const IconComp = ICON_MAP[service.icon] || Phone;
              return (
                <div
                  key={idx}
                  className="bg-[#F8FAFC] rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-lg hover:border-[#12544F]/40 transition-all duration-300 group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-[#12544F] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#12544F] group-hover:text-white transition-all shadow-2xs">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-base text-[#092328] mb-2 group-hover:text-[#12544F] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. MISSION & VISION (Side-by-Side Equal Height Cards) */}
      {/* ========================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-[#092328] tracking-tight mb-3">
            {missionSec.title || 'Our Mission & Vision'}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-normal">
            {missionSec.subtitle ||
              'Guiding principles driving our technological innovations.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Mission Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#12544F]/10 text-[#12544F] flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-[#12544F]" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#12544F]">
                CORE PURPOSE
              </span>
              <h3 className="text-2xl font-black text-[#092328] mt-1 mb-4">
                {missionData.title || 'Our Mission'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {missionData.desc ||
                  'To empower every business in Bangladesh with modern, accessible, and high-quality cloud communication solutions that replace rigid traditional hardware.'}
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-linear-to-br from-[#092328] to-[#12544F] text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-emerald-400 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300">
                FUTURE HORIZON
              </span>
              <h3 className="text-2xl font-black text-white mt-1 mb-4">
                {visionData.title || 'Our Vision'}
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">
                {visionData.desc ||
                  'To lead the AI and IP telecommunication transformation, becoming the most trusted business voice platform across South Asia.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. WHY WE BUILT MYBDPHONE (Problem vs Solution Focused Box) */}
      {/* ========================================================= */}
      <section className="py-20 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-sm space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#12544F] bg-[#12544F]/10 px-3 py-1 rounded-full">
                THE STORY & MOTIVATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#092328] mt-3 mb-2">
                {whySec.title || 'Why We Built MyBDPhone'}
              </h2>
              <p className="text-sm sm:text-sm text-slate-500">
                {whySec.subtitle || 'Solving modern business communication challenges.'}
              </p>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed text-center sm:text-left">
              {whySec.content_body ||
                'Traditional telecom setups are expensive, inflexible, and difficult to manage across remote teams. We built MyBDPhone as a unified, cloud-first platform that lets companies set up call centers, PBX extensions, dynamic IVRs, and AI voice agents in minutes without heavy hardware investments.'}
            </p>

            {/* Comparison Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-6 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-2">
                <div className="text-sm font-black uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>{whySettings.problem_title || 'The Traditional Problem'}</span>
                </div>
                <p className="text-sm text-rose-950/80 leading-relaxed">
                  {whySettings.problem_desc ||
                    'High upfront PBX hardware costs, fixed landline wires, inflexible vendor contracts, and no remote agent flexibility.'}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                <div className="text-sm font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{whySettings.solution_title || 'The MyBDPhone Solution'}</span>
                </div>
                <p className="text-sm text-emerald-950/80 leading-relaxed">
                  {whySettings.solution_desc ||
                    '100% cloud-hosted IP telephony, instant 096 activation, self-service web portals, and integrated Bangla AI voice bots.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. OUR COMMITMENT (4-Point Icon Grid) */}
      {/* ========================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-[#092328] tracking-tight mb-3">
            {commitSec.title || 'Our Commitment'}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-normal">
            {commitSec.subtitle ||
              'What you can always expect from our service and support team.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {commitmentsList.map((comm, idx) => {
            const IconComp = ICON_MAP[comm.icon] || ShieldCheck;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#12544F] flex items-center justify-center mb-5">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-base text-[#092328] mb-2">
                    {comm.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {comm.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. FINAL CTA */}
      {/* ========================================================= */}
      <section className="pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-[#092328] to-[#12544F] rounded-3xl p-8 sm:p-14 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              {ctaSec.title || 'Ready for smarter communication?'}
            </h2>
            <p className="text-sm sm:text-base text-white/80 font-normal leading-relaxed">
              {ctaSec.subtitle ||
                'Transform your enterprise telecommunications with MyBDPhone today.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to={ctaSettings.primary_btn?.url || '/packages'}
                className="px-8 py-3.5 bg-white text-[#092328] hover:bg-emerald-50 rounded-2xl text-sm font-black transition shadow-lg"
              >
                {ctaSettings.primary_btn?.text || 'Get Started'}
              </Link>
              <Link
                to={ctaSettings.secondary_btn?.url || '/contact'}
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl text-sm font-bold transition"
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

export default About;

