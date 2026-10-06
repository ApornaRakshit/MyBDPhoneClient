import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  ShoppingBag,
  HelpCircle,
  Headphones,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  BookOpen,
  Search,
  CheckCircle2,
} from 'lucide-react';
import API from '../../services/api';
import Breadcrumbs from '../../components/resources/Breadcrumbs';
import ResourceCard from '../../components/resources/ResourceCard';
import GuideCard from '../../components/resources/GuideCard';
import HardwareCard from '../../components/resources/HardwareCard';
import FAQAccordion from '../../components/resources/FAQAccordion';
import ResourceSection from '../../components/resources/ResourceSection';

export const ResourcesHome = () => {
  const [pageData, setPageData] = useState(null);
  const [popularGuides, setPopularGuides] = useState([]);
  const [featuredHardware, setFeaturedHardware] = useState([]);
  const [topFaqs, setTopFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const [pageRes, guidesRes, hwRes, faqsRes] = await Promise.allSettled([
          API.get('/resources/pages/resources'),
          API.get('/resources/guides?popular=true&limit=3'),
          API.get('/resources/hardware?limit=3'),
          API.get('/resources/faqs?limit=4'),
        ]);

        if (pageRes.status === 'fulfilled' && pageRes.value.data?.success) {
          setPageData(pageRes.value.data);
        }
        if (guidesRes.status === 'fulfilled' && guidesRes.value.data?.success) {
          setPopularGuides(guidesRes.value.data.guides || []);
        }
        if (hwRes.status === 'fulfilled' && hwRes.value.data?.success) {
          setFeaturedHardware(hwRes.value.data.products || []);
        }
        if (faqsRes.status === 'fulfilled' && faqsRes.value.data?.success) {
          setTopFaqs(faqsRes.value.data.faqs || []);
        }
      } catch (err) {
        console.error('Error loading resources home:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#f8fafc] text-slate-500 text-sm">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-3" />
        <span>Loading MyBDPhone Resources...</span>
      </div>
    );
  }

  const sections = pageData?.sections || [];
  const heroSection = sections.find((s) => s.section_key === 'hero');
  const moduleSection = sections.find((s) => s.section_key === 'modules');
  const ctaSection = sections.find((s) => s.section_key === 'support_cta');

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* 1. HERO SECTION (Dynamic from CMS) */}
      {heroSection ? (
        <ResourceSection section={heroSection} />
      ) : (
        <section className="relative overflow-hidden bg-[#1E6763] text-white py-20 sm:py-24 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-emerald-300 text-sm font-black uppercase tracking-wider mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL TELECOM KNOWLEDGE BASE</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-black mb-4">
              Resources & Technical Documentation
            </h1>
            <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto mb-8">
              Explore product setup guides, certified VoIP hardware specifications, interactive FAQs, and regulatory compliance info.
            </p>
          </div>
        </section>
      )}

      {/* 2. 5 CORE MODULE CARDS */}
      {moduleSection ? (
        <ResourceSection section={moduleSection} />
      ) : (
        <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-sm font-black text-[#12544F] uppercase tracking-widest block mb-2">
                RESOURCE DIRECTORY
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#092328]">
                Explore Our Core Modules
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ResourceCard
                title="Product Guides & Manuals"
                desc="Step-by-step setup tutorials for softphones, Asterisk, FreePBX, and IVR routing."
                icon="FileText"
                link="/resources/product-guides"
                badge="Guides"
              />
              <ResourceCard
                title="Hardware Catalog"
                desc="Carrier-certified IP phones, ATAs, gateways, and call center headsets."
                icon="ShoppingBag"
                link="/resources/hardware"
                badge="Catalog"
              />
              <ResourceCard
                title="Searchable FAQ & Helpdesk"
                desc="Instant answers across Account, Recharge, Cloud PBX, and AI Calling."
                icon="HelpCircle"
                link="/resources/faq"
                badge="Helpdesk"
              />
              <ResourceCard
                title="Support Ticket Center"
                desc="24/7 dedicated customer service ticket tracking and engineer resolution."
                icon="Headphones"
                link="/resources/support"
                badge="24/7 Support"
              />
              <ResourceCard
                title="Compliance & BTRC Info"
                desc="Official BTRC licensing standards, IPTSP regulations, and KYC guidelines."
                icon="ShieldCheck"
                link="/resources/compliance"
                badge="BTRC Official"
              />
            </div>
          </div>
        </section>
      )}

      {/* 3. POPULAR GUIDES SHOWCASE */}
      {popularGuides.length > 0 && (
        <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-sm font-black text-[#12544F] uppercase tracking-widest block mb-1">
                  POPULAR ARTICLES
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">
                  Featured Setup Tutorials
                </h2>
              </div>
              <Link
                to="/resources/product-guides"
                className="inline-flex items-center gap-1 text-sm font-black text-[#12544F] hover:text-[#092328] transition-colors"
              >
                <span>View All Guides</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularGuides.map((guide, idx) => (
                <GuideCard key={guide.id || idx} guide={guide} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. HARDWARE SPOTLIGHT */}
      {featuredHardware.length > 0 && (
        <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-sm font-black text-[#12544F] uppercase tracking-widest block mb-1">
                  CERTIFIED DEVICES
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">
                  Hardware Equipment Catalog
                </h2>
              </div>
              <Link
                to="/resources/hardware"
                className="inline-flex items-center gap-1 text-sm font-black text-[#12544F] hover:text-[#092328] transition-colors"
              >
                <span>Explore All Devices</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredHardware.map((prod, idx) => (
                <HardwareCard key={prod.id || idx} product={prod} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. TOP FAQS PREVIEW */}
      {topFaqs.length > 0 && (
        <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-sm font-black text-[#12544F] uppercase tracking-widest block mb-1">
                INSTANT ANSWERS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">
                Frequently Asked Questions
              </h2>
            </div>

            <FAQAccordion faqs={topFaqs.slice(0, 4)} defaultOpenIndex={0} />

            <div className="text-center pt-8">
              <Link
                to="/resources/faq"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-[#12544F] hover:text-white font-bold text-sm text-slate-700 transition-colors shadow-xs"
              >
                <span>Browse Full FAQ Helpdesk</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 6. BOTTOM CTA BANNER (Dynamic from CMS) */}
      {ctaSection && <ResourceSection section={ctaSection} />}
    </div>
  );
};

export default ResourcesHome;

