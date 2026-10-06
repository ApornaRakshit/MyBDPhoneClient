import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export const FAQAccordion = ({
  faqs = [],
  highlightQuery = '',
  defaultOpenIndex = 0,
}) => {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

  const toggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  if (!faqs || faqs.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400">
        <HelpCircle className="w-10 h-10 mx-auto mb-3 text-slate-300" />
        <p className="font-bold text-sm">No FAQs found matching your criteria.</p>
        <p className="text-sm text-slate-400 mt-1">Try searching with different keywords or switch categories.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <motion.div
            key={faq.id || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.03 }}
            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
              isOpen
                ? 'bg-white border-[#12544F]/40 shadow-md ring-1 ring-[#12544F]/10'
                : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className="w-full px-5 sm:px-6 py-4.5 text-left flex items-center justify-between gap-4 font-black text-[#092328] hover:text-[#12544F] transition-colors cursor-pointer select-none"
            >
              <div className="flex items-start gap-3 min-w-0">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center text-sm font-black shrink-0 mt-0.5">
                  Q
                </span>
                <span className="text-sm sm:text-base leading-snug">
                  {faq.question}
                </span>
              </div>

              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 ${
                  isOpen ? 'bg-[#12544F] text-white rotate-180' : 'bg-slate-100 text-slate-400'
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-5 sm:px-6 pb-5 pt-1 pl-14 sm:pl-15 text-sm sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/80 space-y-2">
                    <p className="whitespace-pre-line">{faq.answer}</p>
                    {faq.category && (
                      <div className="pt-2">
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
                          Category: {faq.category}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FAQAccordion;

