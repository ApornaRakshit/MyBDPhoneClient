import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Search,
  ChevronDown,
  
  MessageSquarePlus,
  PhoneCall,
  Mail,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  LifeBuoy,
  CreditCard,
  UserCheck,
  Phone,
  Server,
  Headphones,
  FileQuestion,
  Tag,
  SlidersHorizontal,
  
} from 'lucide-react';
import API from '../../services/api';

const CATEGORY_ICONS = {
  'Account & Login': UserCheck,
  'Recharge & Payment': CreditCard,
  'Packages': Sparkles,
  'IP Phone': Phone,
  'Virtual Number': PhoneCall,
  'Cloud PBX': Server,
  'Calls & Caller Tune': Headphones,
};

const DEFAULT_FAQS = [
  {
    id: 1,
    category: 'Account & Login',
    question: 'How do I create and verify my MyBDPhone account?',
    answer: 'Click Register on the top right, enter your email and phone number, and verify your email via the secure 6-digit verification code. Once logged in, submit your NID or Trade License from the Profile / KYC tab for instant telecom verification.'
  },
  {
    id: 2,
    category: 'Account & Login',
    question: 'What documents are required to activate an official 096 IP Phone number?',
    answer: 'In compliance with BTRC regulations, corporate accounts require Trade License, TIN Certificate, National ID (NID) of the authorized signatory, and an Application Letter. Individual accounts require a valid Bangladeshi NID card copy and a recent photograph.'
  },
  {
    id: 3,
    category: 'Recharge & Payment',
    question: 'How do I recharge my account?',
    answer: 'Open your User Dashboard → Recharge, enter any amount from ৳100 up to ৳25,000, and complete payment securely via bKash, Nagad, Rocket, Visa/Mastercard, or DGePay payment gateway. Your wallet balance updates instantly with an automated Mushak-6.3 VAT receipt.'
  },
  {
    id: 4,
    category: 'Recharge & Payment',
    question: 'Which payment methods are supported for wallet top-up and packages?',
    answer: 'We support all major Bangladeshi mobile financial services (bKash, Nagad, Rocket, Upay), local debit/credit cards (Visa, Mastercard, Amex), internet banking, and direct automated gateway checkout via DGePay and Moneybag.'
  },
  {
    id: 5,
    category: 'Packages',
    question: 'How do I activate a package?',
    answer: 'Navigate to the Packages page, select your preferred IP Phone or Cloud PBX plan, and click "Get Started" or "Subscribe". You can pay using your wallet balance or complete an instant checkout via DGePay/bKash. Features activate immediately upon payment.'
  },
  {
    id: 6,
    category: 'Packages',
    question: 'Can I upgrade or change my subscription package anytime?',
    answer: 'Yes. You can upgrade, downgrade, or add additional extension capacity to your Cloud PBX plan at any time from your User Dashboard with automated pro-rated billing calculation.'
  },
  {
    id: 7,
    category: 'IP Phone',
    question: 'How can I configure my IP Phone?',
    answer: 'Connect your IP desk phone (Yealink, Grandstream, Fanvil, or Cisco) to your local network router. Access the phone\'s web GUI using its IP address, enter your SIP Server (`sip.mybdphone.com`), Extension User ID, and SIP Password found under User Portal → My IP Phone.'
  },
  {
    id: 8,
    category: 'IP Phone',
    question: 'Why is my number not working or showing unregistered?',
    answer: 'Common causes include: 1) Expired account wallet balance; 2) Pending KYC document verification; 3) SIP ALG enabled on your internet router (please disable SIP ALG in your router settings); 4) Incorrect SIP password. Check your User Dashboard status or contact support.'
  },
  {
    id: 9,
    category: 'Virtual Number',
    question: 'Can I receive calls from any mobile operator across Bangladesh?',
    answer: 'Yes. Official 096 IP numbers are fully interconnected across all Bangladesh mobile operators (Grameenphone, Banglalink, Robi Axiata, Teletalk), BTCL landlines, and international telecom carriers with crystal-clear HD audio.'
  },
  {
    id: 10,
    category: 'Virtual Number',
    question: 'How long does virtual number provisioning take?',
    answer: 'Once your KYC documentation is submitted and approved by our compliance desk, your 096 Virtual Number and SIP credentials are provisioned automatically within 10 to 30 minutes.'
  },
  {
    id: 11,
    category: 'Cloud PBX',
    question: 'How do I configure IVR menus and dynamic call routing?',
    answer: 'Navigate to Cloud PBX → IVR Settings in your portal. Upload custom audio greetings or use our Bangla Neural TTS engine. You can map keypad buttons (e.g. 1 for Sales, 2 for Support) and define after-hours schedules in minutes.'
  },
  {
    id: 12,
    category: 'Cloud PBX',
    question: 'Does Cloud PBX include cloud call recording?',
    answer: 'Yes! Dual-channel stereo call recording is included. Audio files are encrypted at rest with AES-256 and stored in your cloud archive for 90 days with in-browser playback, waveform scrubbers, and MP3 download options.'
  },
  {
    id: 13,
    category: 'Calls & Caller Tune',
    question: 'How can I check my call history?',
    answer: 'Log in to your User Portal and navigate to Call History. You can filter incoming, outgoing, and missed calls, view exact call durations and tariff deductions, and listen to or download call recordings.'
  },
  {
    id: 14,
    category: 'Calls & Caller Tune',
    question: 'How do I set up a custom corporate Caller Tune?',
    answer: 'You can activate the Caller Tune add-on for only ৳99/month from our Digital Services Shop. Upload your custom company audio greeting or promotional jingle (MP3 format) from User Portal → Caller Tune Settings.'
  },
  {
    id: 15,
    category: 'Account & Login',
    question: 'How can I contact support?',
    answer: 'You can reach our Dhaka technical support desk 24/7 via: 1) Hotline: 096490123756; 2) Email: support@mybdphone.com; 3) Creating a Priority Support Ticket directly from User Portal → Support Tickets.'
  }
];

export const FaqHelpdesk = () => {
  const [pageData, setPageData] = useState(null);
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIds, setOpenFaqIds] = useState(new Set([1, 3, 7])); // open default popular items
  const [helpfulFeedback, setHelpfulFeedback] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const res = await API.get('/public/resources/faq-helpdesk');
        if (res.data?.success) {
          if (res.data.page) setPageData(res.data.page);
          if (res.data.faqs && res.data.faqs.length > 0) {
            setFaqs(res.data.faqs);
          }
        }
      } catch (err) {
        console.error('Failed to load FAQs from API, using default data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const categories = useMemo(() => {
    const defaultCats = [
      'All',
      'Account & Login',
      'Recharge & Payment',
      'Packages',
      'IP Phone',
      'Virtual Number',
      'Cloud PBX',
      'Calls & Caller Tune'
    ];
    const catSet = new Set(defaultCats);
    faqs.forEach((f) => {
      if (f.category) catSet.add(f.category);
    });
    return Array.from(catSet);
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchCat = selectedCategory === 'All' || faq.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        faq.question?.toLowerCase().includes(query) ||
        faq.answer?.toLowerCase().includes(query) ||
        faq.category?.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  const toggleAccordion = (id) => {
    setOpenFaqIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenFaqIds(new Set(filteredFaqs.map((f, i) => f.id || i)));
  };

  const collapseAll = () => {
    setOpenFaqIds(new Set());
  };

  const handleFeedback = (id, type) => {
    setHelpfulFeedback((prev) => ({ ...prev, [id]: type }));
  };

  const pageTitle = pageData?.title || 'Frequently Asked Questions & Support';
  const pageSubtitle =
    pageData?.subtitle ||
    'Find instant answers to common questions about your account, packages, IP phone, and billing.';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#092328] pt-6 pb-20">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden bg-linear-to-b from-[#EBF5F3] via-white to-[#F8FAFC] border-b border-emerald-950/10 py-12 md:py-16">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#12544F]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#12544F] uppercase tracking-wider mb-3">
            <HelpCircle className="w-4 h-4" />
            <span>Helpdesk & Knowledge Support Center</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#092328] tracking-tight mb-4 max-w-3xl">
            {pageTitle}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed mb-8">
            {pageSubtitle}
          </p>

          {/* Search Box */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help questions (e.g. How to recharge, IP phone setup, IVR, KYC)..."
              className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#12544F]/30 focus:border-[#12544F] text-sm text-[#092328] placeholder-slate-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            const CatIcon = CATEGORY_ICONS[cat] || Tag;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#12544F] text-white shadow-md shadow-[#12544F]/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <CatIcon className="w-3.5 h-3.5" />
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Action Bar (Count + Expand/Collapse All) */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
          <span className="text-sm font-bold text-slate-500">
            Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? 'question' : 'questions'}
            {selectedCategory !== 'All' ? ` in "${selectedCategory}"` : ''}
          </span>
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="text-sm font-bold text-[#12544F] hover:underline"
            >
              Expand all
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={collapseAll}
              className="text-sm font-bold text-slate-500 hover:underline"
            >
              Collapse all
            </button>
          </div>
        </div>

        {/* Accordion FAQ List */}
        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
            <FileQuestion className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-lg text-[#092328]">No results found</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">
              We couldn't find any FAQs matching "{searchQuery}". Try searching with different keywords.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 bg-[#12544F] text-white rounded-xl text-sm font-bold hover:bg-[#0c3935]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const faqKey = faq.id || idx;
              const isOpen = openFaqIds.has(faqKey);
              const CatIcon = CATEGORY_ICONS[faq.category] || HelpCircle;
              const userVote = helpfulFeedback[faqKey];

              return (
                <div
                  key={faqKey}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-[#12544F]/40 shadow-md ring-1 ring-[#12544F]/20'
                      : 'border-slate-200/80 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  {/* Question Header */}
                  <button
                    onClick={() => toggleAccordion(faqKey)}
                    className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 select-none"
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center transition-colors ${
                          isOpen ? 'bg-[#12544F] text-white' : 'bg-slate-100 text-[#12544F]'
                        }`}
                      >
                        <CatIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="inline-block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                          {faq.category}
                        </span>
                        <h3 className="font-black text-base sm:text-lg text-[#092328] leading-snug">
                          {faq.question}
                        </h3>
                      </div>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? 'bg-[#12544F]/10 text-[#12544F] rotate-180' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Answer Content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-6 pt-2 text-sm leading-relaxed text-slate-600 border-t border-slate-100">
                          <p className="mt-2 text-slate-700 whitespace-pre-line leading-relaxed">
                            {faq.answer}
                          </p>

                          {/* Was this helpful widget */}
                          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-400">
                            <span>Was this answer helpful?</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleFeedback(faqKey, 'yes')}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-bold transition ${
                                  userVote === 'yes'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                }`}
                              >
                                <ThumbsUp className="w-3 h-3" />
                                <span>Yes</span>
                              </button>
                              <button
                                onClick={() => handleFeedback(faqKey, 'no')}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-bold transition ${
                                  userVote === 'no'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                }`}
                              >
                                <ThumbsDown className="w-3 h-3" />
                                <span>No</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="mt-16 bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#12544F]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12544F]/10 text-[#12544F] text-sm font-black uppercase tracking-wider mb-3">
                <LifeBuoy className="w-3.5 h-3.5" />
                <span>24/7 SUPPORT HELPDESK</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#092328] mb-3">
                Still Need Help?
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Can’t find the solution you’re looking for? Our dedicated telecom engineering team in Dhaka is available 24/7 to resolve technical, billing, and routing inquiries.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 justify-center">
              <Link
                to="/user/support"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#12544F] hover:bg-[#0c3935] text-white rounded-2xl text-sm font-black transition shadow-md shadow-[#12544F]/20"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Create Support Ticket</span>
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="tel:096490123756"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-[#092328] rounded-xl text-sm font-bold transition border border-slate-200"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#12544F]" />
                  <span>096490123756</span>
                </a>
                <a
                  href="mailto:support@mybdphone.com"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-[#092328] rounded-xl text-sm font-bold transition border border-slate-200"
                >
                  <Mail className="w-3.5 h-3.5 text-[#12544F]" />
                  <span>Email NOC</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqHelpdesk;

