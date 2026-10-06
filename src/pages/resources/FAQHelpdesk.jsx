import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Sparkles, Headphones, ArrowRight, MessageSquare } from 'lucide-react';
import API from '../../services/api';
import Breadcrumbs from '../../components/resources/Breadcrumbs';
import SearchFilter from '../../components/resources/SearchFilter';
import FAQAccordion from '../../components/resources/FAQAccordion';

export const FAQHelpdesk = () => {
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchFaqs = async (cat = activeCategory, search = searchQuery) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cat && cat !== 'All') params.append('category', cat);
      if (search && search.trim()) params.append('search', search.trim());

      const res = await API.get(`/resources/faqs?${params.toString()}`);
      if (res.data?.success) {
        setFaqs(res.data.faqs || []);
        if (res.data.categories && res.data.categories.length > 0) {
          setCategories(res.data.categories);
        }
      }
    } catch (err) {
      console.error('Error fetching FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs(activeCategory, searchQuery);
  }, [activeCategory]);

  const handleSearchSubmit = (q) => {
    setSearchQuery(q);
    fetchFaqs(activeCategory, q);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Resources Hub', url: '/resources' },
            { label: 'Searchable FAQ & Helpdesk' },
          ]}
        />

        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12544F]/10 text-[#12544F] text-sm font-black uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>HELPDESK & KNOWLEDGE BASE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#092328] tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            Find immediate answers regarding 096 IP number activation, recharge options, Cloud PBX packages, and BTRC compliance.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="mb-12">
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={handleSearchSubmit}
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={(cat) => setActiveCategory(cat)}
            placeholder="Type your question or keyword (e.g. KYC, bKash, Call Recording, Codec)..."
          />
        </div>

        {/* FAQs List */}
        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto mb-3" />
            <span className="text-sm">Loading FAQs...</span>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-1 text-sm font-bold text-slate-400 uppercase tracking-wider">
              <span>Showing {faqs.length} Answers in {activeCategory}</span>
              <span>Updated Live</span>
            </div>

            <FAQAccordion faqs={faqs} defaultOpenIndex={0} />
          </div>
        )}

        {/* "Still Need Help?" Bottom Card */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#092328] to-[#12544F] text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-black">Still have unanswered questions?</h3>
            <p className="text-sm sm:text-sm text-emerald-100/80 max-w-lg leading-relaxed">
              Our 24/7 technical customer support team in Dhaka is ready to guide your PBX setup and answer any specific billing or compliance inquiries.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/resources/support"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#092328] font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Open Support Ticket</span>
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
            >
              Contact Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQHelpdesk;

