import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

const mediaUrl = (url = '') => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url) || url.startsWith('blob:')) return url;
  const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const GuideCard = ({ guide, index = 0 }) => {
  if (!guide) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="h-full"
    >
      <Link
        to={`/resources/product-guides/${guide.slug}`}
        className="group flex flex-col justify-between h-full bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-500 transition-all duration-300"
      >
        <div>
          {/* Featured Image or Illustration Header */}
          <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden flex items-center justify-center">
            {guide.featured_image ? (
              <img
                src={mediaUrl(guide.featured_image)}
                alt={guide.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#092328] to-[#12544F] flex items-center justify-center text-emerald-300/40">
                <BookOpen className="w-12 h-12" />
              </div>
            )}
            
            {/* Category Tag */}
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 text-[#12544F] shadow-sm backdrop-blur-md">
                {guide.category || 'Guide'}
              </span>
            </div>

            {/* Popular Badge */}
            {Boolean(guide.is_popular) && (
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  <span>Popular</span>
                </span>
              </div>
            )}
          </div>

          {/* Text Content */}
          <div className="p-6">
            <div className="flex items-center gap-1.5 text-sm text-slate-400 font-semibold mb-2.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{guide.read_time || '5 min read'}</span>
            </div>

            <h3 className="font-black text-base sm:text-lg text-[#092328] group-hover:text-[#12544F] transition-colors line-clamp-2 leading-snug mb-2">
              {guide.title}
            </h3>

            <p className="text-sm sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
              {guide.short_desc || 'Read step-by-step documentation and configuration instructions.'}
            </p>
          </div>
        </div>

        <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between text-sm font-black text-[#12544F]">
          <span>Read Full Tutorial</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </motion.div>
  );
};

export default GuideCard;

