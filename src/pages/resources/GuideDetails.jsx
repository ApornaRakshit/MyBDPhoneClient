import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Share2,
  CheckCircle2,
  HelpCircle,
  Headphones,
  Copy,
  Check,
} from 'lucide-react';
import API from '../../services/api';
import Breadcrumbs from '../../components/resources/Breadcrumbs';
import GuideCard from '../../components/resources/GuideCard';

const mediaUrl = (url = '') => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url) || url.startsWith('blob:')) return url;
  const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const GuideDetails = () => {
  const { slug } = useParams();
  const [guide, setGuide] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchGuide = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get(`/resources/guides/${slug}`);
        if (res.data?.success && res.data.guide) {
          setGuide(res.data.guide);
          setRelated(res.data.related || []);
        } else {
          setError('Guide not found');
        }
      } catch (err) {
        console.error('Error loading guide details:', err);
        setError('Failed to load guide tutorial.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchGuide();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#f8fafc] text-slate-500 text-sm">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-3" />
        <span>Loading guide tutorial...</span>
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center bg-[#f8fafc] px-4 py-16 text-center">
        <HelpCircle className="w-12 h-12 text-slate-300 mb-3" />
        <h2 className="text-xl font-black text-[#092328] mb-2">Guide Tutorial Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">The tutorial you are looking for may have been moved or updated.</p>
        <Link
          to="/resources/product-guides"
          className="px-6 py-2.5 rounded-xl bg-[#12544F] text-white font-bold text-sm shadow-xs"
        >
          ← Back to All Guides
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Resources Hub', url: '/resources' },
            { label: 'Product Guides', url: '/resources/product-guides' },
            { label: guide.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Content Area */}
          <main className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs">
            
            {/* Header Meta */}
            <div className="space-y-4 pb-6 border-b border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="px-3 py-1 rounded-full text-sm font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-800 border border-emerald-500/20">
                  {guide.category}
                </span>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-sm text-slate-400 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{guide.read_time || '5 min read'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="p-1.5 text-slate-400 hover:text-[#12544F] rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1 text-sm font-bold cursor-pointer"
                    title="Share Guide Link"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    <span>{copied ? 'Copied' : 'Share'}</span>
                  </button>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-[#092328] tracking-tight leading-tight">
                {guide.title}
              </h1>

              {guide.short_desc && (
                <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-medium">
                  {guide.short_desc}
                </p>
              )}
            </div>

            {/* Featured Image */}
            {guide.featured_image && (
              <div className="my-8 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 aspect-[16/9]">
                <img
                  src={mediaUrl(guide.featured_image)}
                  alt={guide.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Rich HTML Content */}
            <div
              className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed space-y-4 pt-4 prose-headings:font-black prose-headings:text-[#092328] prose-a:text-[#12544F] prose-a:font-bold prose-code:bg-slate-100 prose-code:p-1 prose-code:rounded prose-pre:bg-[#092328] prose-pre:text-emerald-200 prose-img:rounded-2xl"
              dangerouslySetInnerHTML={{ __html: guide.full_content }}
            />

            {/* Bottom Article Feedback Box */}
            <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-sm sm:text-sm font-bold text-slate-700">
                  Was this setup tutorial helpful for your team?
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/resources/support"
                  className="px-4 py-2 rounded-xl bg-[#12544F] text-white font-bold text-sm shadow-xs"
                >
                  Contact Support Engineer
                </Link>
              </div>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Quick Support Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#092328] to-[#12544F] text-white shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">Need Setup Help?</h3>
              <p className="text-sm text-emerald-100/80 leading-relaxed">
                Our certified VoIP network engineers can help configure your PBX trunks, mobile softphones, and call routing remotely.
              </p>
              <Link
                to="/resources/support"
                className="block w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#092328] font-black text-sm text-center shadow-md transition-all active:scale-95"
              >
                Open Priority Ticket
              </Link>
            </div>

            {/* Related Tutorials in Category */}
            {related.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
                <h4 className="font-black text-sm text-[#092328] uppercase tracking-wider">
                  Related Tutorials in {guide.category}
                </h4>

                <div className="space-y-3 divide-y divide-slate-100">
                  {related.map((rel) => (
                    <Link
                      key={rel.id}
                      to={`/resources/product-guides/${rel.slug}`}
                      className="group block pt-3 first:pt-0 transition-colors"
                    >
                      <h5 className="text-sm sm:text-sm font-bold text-slate-800 group-hover:text-[#12544F] line-clamp-2 leading-snug">
                        {rel.title}
                      </h5>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 font-mono">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        <span>{rel.read_time || '5 min read'}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Hardware Store Link */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3">
              <h4 className="font-black text-sm text-[#092328]">Recommended IP Phones</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Looking for carrier-tested VoIP desktop phones and noise-cancelling headsets?
              </p>
              <Link
                to="/resources/hardware"
                className="inline-flex items-center gap-1.5 text-sm font-black text-[#12544F] hover:underline"
              >
                <span>Browse Hardware Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default GuideDetails;

