import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import API from '../../services/api';
import Breadcrumbs from '../../components/resources/Breadcrumbs';
import GuideCard from '../../components/resources/GuideCard';
import SearchFilter from '../../components/resources/SearchFilter';

export const ProductGuides = () => {
  const [guides, setGuides] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchGuides = async (cat = activeCategory, search = searchQuery) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cat && cat !== 'All') params.append('category', cat);
      if (search && search.trim()) params.append('search', search.trim());

      const res = await API.get(`/resources/guides?${params.toString()}`);
      if (res.data?.success) {
        setGuides(res.data.guides || []);
        if (res.data.categories && res.data.categories.length > 0) {
          setCategories(res.data.categories);
        }
      }
    } catch (err) {
      console.error('Error fetching guides:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides(activeCategory, searchQuery);
  }, [activeCategory]);

  const handleSearchSubmit = (q) => {
    setSearchQuery(q);
    fetchGuides(activeCategory, q);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Resources Hub', url: '/resources' },
            { label: 'Product Guides & Tutorials' },
          ]}
        />

        {/* Header Title & Intro */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12544F]/10 text-[#12544F] text-sm font-black uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>KNOWLEDGE BASE & TUTORIALS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#092328] tracking-tight mb-4">
            Product Guides & Setup Manuals
          </h1>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            Step-by-step documentation for configuring softphones, Asterisk trunks, FreePBX, IVR routing, and Voice AI webhooks.
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
            placeholder="Search tutorials by keywords (e.g. Grandstream, Asterisk, IVR)..."
          />
        </div>

        {/* Guides Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto mb-3" />
            <span className="text-sm">Loading tutorials...</span>
          </div>
        ) : guides.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-xs max-w-xl mx-auto">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-[#092328]">No Guides Found</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">
              We couldn't find any guides matching "{searchQuery}". Try searching with different terms or selecting 'All' categories.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
                fetchGuides('All', '');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#12544F] text-white font-bold text-sm shadow-xs cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, idx) => (
              <GuideCard key={guide.id || idx} guide={guide} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGuides;

