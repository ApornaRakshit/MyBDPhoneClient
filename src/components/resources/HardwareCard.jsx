import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Shield, ArrowRight, ShoppingBag, Eye, Send } from 'lucide-react';
import HardwareQuoteModal from './HardwareQuoteModal';

const mediaUrl = (url = '') => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url) || url.startsWith('blob:')) return url;
  const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const HardwareCard = ({ product, index = 0 }) => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  if (!product) return null;

  const keySpecs = Array.isArray(product.key_specs_json)
    ? product.key_specs_json
    : typeof product.key_specs_json === 'string'
    ? JSON.parse(product.key_specs_json || '[]')
    : [];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: index * 0.05 }}
        className="h-full"
      >
        <div className="group flex flex-col justify-between h-full bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-500 transition-all duration-300">
          <div>
            {/* Image Box */}
            <div className="relative aspect-[4/3] w-full bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-center overflow-hidden">
              <img
                src={mediaUrl(product.main_image || '/uploads/cms/ip-phone-icon.png')}
                alt={product.model_name}
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
              />

              {/* Brand Tag */}
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white text-[#092328] border border-slate-200 shadow-xs">
                  {product.brand}
                </span>
              </div>

              {/* Stock Tag */}
              <div className="absolute top-3 right-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  product.is_available
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-600 border border-rose-200'
                }`}>
                  {product.is_available ? 'In Stock' : 'Pre-Order'}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
                {product.device_type}
              </div>

              <Link to={`/resources/hardware/${product.slug}`}>
                <h3 className="font-black text-base sm:text-lg text-[#092328] group-hover:text-[#12544F] transition-colors line-clamp-2 leading-snug mb-2">
                  {product.model_name}
                </h3>
              </Link>

              <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                {product.short_desc}
              </p>

              {/* Key Specs Pills */}
              {keySpecs.length > 0 && (
                <div className="space-y-1.5 mb-4 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                  {keySpecs.slice(0, 3).map((spec, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-700">{spec.label}:</span>
                      <span className="truncate">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer with Price & Actions */}
          <div className="p-6 pt-0">
            <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Estimated Price</span>
                <span className="text-lg sm:text-xl font-black text-[#092328]">
                  ৳{Number(product.price).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>{product.warranty?.split(' ')[0]} Yr Warranty</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link
                to={`/resources/hardware/${product.slug}`}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold text-center flex items-center justify-center gap-1 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Specs</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsQuoteOpen(true)}
                className="py-2.5 px-3 rounded-xl bg-[#12544F] hover:bg-[#092328] text-white text-sm font-bold text-center flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Get Quote</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quote Request Modal */}
      <HardwareQuoteModal
        product={product}
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
      />
    </>
  );
};

export default HardwareCard;

