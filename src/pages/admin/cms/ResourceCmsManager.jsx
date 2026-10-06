import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  HelpCircle,
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  Save,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Search,
  SlidersHorizontal,
  RefreshCw,
  X,
  FileText,
  Clock,
  Sparkles,
  Award,
  Layers,
  PhoneCall,
  Globe2,
  Bot,
  Smartphone,
  ReceiptText,
} from 'lucide-react';
import API from '../../../services/api';

const GUIDE_ICONS = ['PhoneCall', 'Globe2', 'Layers', 'Bot', 'Smartphone', 'ReceiptText', 'BookOpen', 'ShieldCheck'];
const FAQ_CATEGORIES = [
  'IP Phone & Number',
  'Billing & Recharge',
  'Packages & Subscription',
  'Apps & Devices',
  'Account & Security',
  'Troubleshooting',
  'Account & Login',
  'Recharge & Payment',
  'Packages',
  'IP Phone',
  'Virtual Number',
  'Cloud PBX',
  'Calls & Caller Tune',
];

export const ResourceCmsManager = () => {
  const [activeTab, setActiveTab] = useState('guides'); // 'guides' | 'faqs' | 'compliance' | 'pages'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Data states
  const [guides, setGuides] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [complianceSections, setComplianceSections] = useState([]);
  const [pagesMeta, setPagesMeta] = useState({
    'product-guides': { title: '', subtitle: '', meta_title: '', meta_desc: '' },
    'faq-helpdesk': { title: '', subtitle: '', meta_title: '', meta_desc: '' },
    'compliance-btrc': { title: '', subtitle: '', meta_title: '', meta_desc: '' },
  });

  // Modal states
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState(null);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);

  // Search & Filter
  const [searchGuide, setSearchGuide] = useState('');
  const [faqCategoryFilter, setFaqCategoryFilter] = useState('All');

  // Load all initial data
  const loadAllData = async () => {
    setLoading(true);
    try {
      // 1. Guides
      const guidesRes = await API.get('/resources/admin/guides');
      if (guidesRes.data?.success) setGuides(guidesRes.data.guides || []);

      // 2. FAQs
      const faqsRes = await API.get('/resources/admin/faqs');
      if (faqsRes.data?.success) setFaqs(faqsRes.data.faqs || []);

      // 3. Compliance Sections
      const compRes = await API.get('/resources/admin/sections?page_slug=compliance-btrc');
      if (compRes.data?.success) setComplianceSections(compRes.data.sections || []);

      // 4. Fetch Page metadata
      const p1 = await API.get('/public/resources/product-guides');
      const p2 = await API.get('/public/resources/faq-helpdesk');
      const p3 = await API.get('/public/resources/compliance-btrc');

      setPagesMeta({
        'product-guides': {
          title: p1.data?.page?.title || 'MyBDPhone Product & User Guides',
          subtitle: p1.data?.page?.subtitle || '',
          meta_title: p1.data?.page?.meta_title || '',
          meta_desc: p1.data?.page?.meta_desc || '',
        },
        'faq-helpdesk': {
          title: p2.data?.page?.title || 'Frequently Asked Questions & Support',
          subtitle: p2.data?.page?.subtitle || '',
          meta_title: p2.data?.page?.meta_title || '',
          meta_desc: p2.data?.page?.meta_desc || '',
        },
        'compliance-btrc': {
          title: p3.data?.page?.title || 'Telecom Compliance, Privacy & BTRC Guidelines',
          subtitle: p3.data?.page?.subtitle || '',
          meta_title: p3.data?.page?.meta_title || '',
          meta_desc: p3.data?.page?.meta_desc || '',
        },
      });
    } catch (err) {
      console.error('Error loading resource CMS data:', err);
      showMessage('error', 'Failed to load CMS data. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  // --- GUIDE HANDLERS ---
  const handleOpenGuideModal = (guide = null) => {
    if (guide) {
      setEditingGuide({ ...guide });
    } else {
      setEditingGuide({
        title: '',
        slug: '',
        category: 'IP Phone',
        icon: 'PhoneCall',
        read_time: '5 min read',
        is_popular: 1,
        is_published: 1,
        sort_order: (guides.length + 1) * 10,
        short_desc: '',
        full_content: '',
      });
    }
    setGuideModalOpen(true);
  };

  const handleSaveGuide = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingGuide.id) {
        await API.put(`/resources/admin/guides/${editingGuide.id}`, editingGuide);
        showMessage('success', 'Guide updated successfully!');
      } else {
        await API.post('/resources/admin/guides', editingGuide);
        showMessage('success', 'New guide published successfully!');
      }
      setGuideModalOpen(false);
      loadAllData();
    } catch (err) {
      console.error('Save guide error:', err);
      showMessage('error', err.response?.data?.message || 'Error saving guide');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGuide = async (id) => {
    if (!window.confirm('Are you sure you want to delete this guide card?')) return;
    try {
      await API.delete(`/resources/admin/guides/${id}`);
      showMessage('success', 'Guide removed.');
      loadAllData();
    } catch (err) {
      console.error('Delete guide error:', err);
      showMessage('error', 'Failed to delete guide.');
    }
  };

  const handleMoveGuide = async (index, dir) => {
    const next = [...guides];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    next.forEach((g, i) => { g.sort_order = (i + 1) * 10; });
    setGuides(next);
    try {
      await Promise.all(
        next.map((g) => API.put(`/resources/admin/guides/${g.id}`, { sort_order: g.sort_order }))
      );
      showMessage('success', 'Guides reordered successfully.');
    } catch (err) {
      console.error('Reorder guides error:', err);
      loadAllData();
    }
  };

  // --- FAQ HANDLERS ---
  const handleOpenFaqModal = (faq = null) => {
    if (faq) {
      setEditingFaq({ ...faq });
    } else {
      setEditingFaq({
        category: 'Account & Login',
        question: '',
        answer: '',
        sort_order: (faqs.length + 1) * 10,
        is_active: 1,
      });
    }
    setFaqModalOpen(true);
  };

  const handleSaveFaq = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingFaq.id) {
        await API.put(`/resources/admin/faqs/${editingFaq.id}`, editingFaq);
        showMessage('success', 'FAQ updated successfully!');
      } else {
        await API.post('/resources/admin/faqs', editingFaq);
        showMessage('success', 'New FAQ added successfully!');
      }
      setFaqModalOpen(false);
      loadAllData();
    } catch (err) {
      console.error('Save FAQ error:', err);
      showMessage('error', err.response?.data?.message || 'Error saving FAQ');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await API.delete(`/resources/admin/faqs/${id}`);
      showMessage('success', 'FAQ deleted.');
      loadAllData();
    } catch (err) {
      console.error('Delete FAQ error:', err);
      showMessage('error', 'Failed to delete FAQ.');
    }
  };

  const handleMoveFaq = async (index, dir) => {
    const next = [...faqs];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    next.forEach((f, i) => { f.sort_order = (i + 1) * 10; });
    setFaqs(next);
    try {
      await Promise.all(
        next.map((f) => API.put(`/resources/admin/faqs/${f.id}`, { sort_order: f.sort_order }))
      );
      showMessage('success', 'FAQs reordered successfully.');
    } catch (err) {
      console.error('Reorder FAQs error:', err);
      loadAllData();
    }
  };

  // --- COMPLIANCE SECTION HANDLERS ---
  const handleCreateComplianceSection = async () => {
    setSaving(true);
    try {
      await API.post('/resources/admin/sections', {
        page_id: 5,
        section_key: `custom_${Date.now().toString().slice(-4)}`,
        section_type: 'RICH_TEXT',
        title: 'New Compliance & Policy Section',
        subtitle: 'Enter section summary and requirements',
        content: 'Add detailed regulatory documentation here.',
        content_json: { eyebrow: 'POLICY REQUIREMENT', rules: [] },
        align: 'left',
        sort_order: (complianceSections.length + 1) * 10,
        is_active: 1
      });
      showMessage('success', 'New compliance section added!');
      loadAllData();
    } catch (err) {
      console.error('Create compliance section error:', err);
      showMessage('error', 'Failed to create section.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteComplianceSection = async (id) => {
    if (!window.confirm('Delete this compliance section?')) return;
    try {
      await API.delete(`/resources/admin/sections/${id}`);
      showMessage('success', 'Compliance section removed.');
      loadAllData();
    } catch (err) {
      console.error('Delete section error:', err);
      showMessage('error', 'Failed to delete section.');
    }
  };

  const handleMoveComplianceSection = async (index, dir) => {
    const next = [...complianceSections];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    next.forEach((s, i) => { s.sort_order = (i + 1) * 10; });
    setComplianceSections(next);
    try {
      await Promise.all(
        next.map((s) => API.put(`/resources/admin/sections/${s.id}`, { sort_order: s.sort_order }))
      );
      showMessage('success', 'Compliance sections reordered.');
    } catch (err) {
      console.error('Reorder compliance sections error:', err);
      loadAllData();
    }
  };

  const handleUpdateComplianceSection = async (section) => {
    setSaving(true);
    try {
      await API.put(`/resources/admin/sections/${section.id}`, section);
      showMessage('success', `Updated section: ${section.title}`);
      loadAllData();
    } catch (err) {
      console.error('Update section error:', err);
      showMessage('error', 'Failed to update section.');
    } finally {
      setSaving(false);
    }
  };

  // --- PAGE META HANDLERS ---
  const handleSavePageMeta = async (slug) => {
    setSaving(true);
    try {
      const payload = pagesMeta[slug];
      await API.put(`/admin/cms/resources/${slug}`, payload);
      showMessage('success', `Page headers for /resources/${slug} updated!`);
    } catch (err) {
      console.error('Update page error:', err);
      showMessage('error', 'Failed to update page info.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-[#12544F] uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Resources Hub CMS Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#092328]">
            Product Guides, FAQs & Compliance Management
          </h1>
          <p className="text-sm sm:text-sm text-slate-500 mt-1">
            Live real-time control over tutorials, helpdesk accordion items, and BTRC telecom policies.
          </p>
        </div>

        {/* Live Preview Links */}
        <div className="flex items-center gap-2">
          <Link
            to="/resources/product-guides"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-[#092328] hover:bg-slate-50 rounded-xl text-sm font-bold transition shadow-2xs"
          >
            <span>Guides</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <Link
            to="/resources/faq-helpdesk"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-[#092328] hover:bg-slate-50 rounded-xl text-sm font-bold transition shadow-2xs"
          >
            <span>FAQ</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <Link
            to="/resources/compliance-btrc"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-[#092328] hover:bg-slate-50 rounded-xl text-sm font-bold transition shadow-2xs"
          >
            <span>Compliance</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <button
            onClick={loadAllData}
            disabled={loading}
            className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition shadow-2xs"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {message.text && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('guides')}
          className={`px-5 py-3 text-sm font-black uppercase tracking-wider border-b-2 flex items-center gap-2 transition ${
            activeTab === 'guides'
              ? 'border-[#12544F] text-[#12544F]'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Product Guides ({guides.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className={`px-5 py-3 text-sm font-black uppercase tracking-wider border-b-2 flex items-center gap-2 transition ${
            activeTab === 'faqs'
              ? 'border-[#12544F] text-[#12544F]'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>FAQ & Helpdesk ({faqs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('compliance')}
          className={`px-5 py-3 text-sm font-black uppercase tracking-wider border-b-2 flex items-center gap-2 transition ${
            activeTab === 'compliance'
              ? 'border-[#12544F] text-[#12544F]'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Compliance & BTRC ({complianceSections.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pages')}
          className={`px-5 py-3 text-sm font-black uppercase tracking-wider border-b-2 flex items-center gap-2 transition ${
            activeTab === 'pages'
              ? 'border-[#12544F] text-[#12544F]'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Page Headings & SEO</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. PRODUCT GUIDES TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'guides' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search guides..."
                value={searchGuide}
                onChange={(e) => setSearchGuide(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#12544F]"
              />
            </div>

            <button
              onClick={() => handleOpenGuideModal()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#12544F] hover:bg-[#0c3935] text-white rounded-xl text-sm font-bold transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Guide</span>
            </button>
          </div>

          {/* Guides Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Guide Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Icon / Read Time</th>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {guides
                  .filter(
                    (g) =>
                      !searchGuide ||
                      g.title?.toLowerCase().includes(searchGuide.toLowerCase()) ||
                      g.category?.toLowerCase().includes(searchGuide.toLowerCase())
                  )
                  .map((guide) => (
                    <tr key={guide.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 px-4 font-bold text-[#092328]">
                        <div>{guide.title}</div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">/{guide.slug}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-600">
                          {guide.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        <div className="font-mono text-[11px]">{guide.icon}</div>
                        <div className="text-[10px] text-slate-400">{guide.read_time}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-600">
                        {guide.sort_order}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            guide.is_published
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {guide.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleMoveGuide(guides.findIndex((x) => x.id === guide.id), -1)}
                            className="p-1.5 text-slate-400 hover:text-[#12544F] hover:bg-slate-100 rounded-lg transition"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveGuide(guides.findIndex((x) => x.id === guide.id), 1)}
                            className="p-1.5 text-slate-400 hover:text-[#12544F] hover:bg-slate-100 rounded-lg transition"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenGuideModal(guide)}
                            className="p-1.5 text-slate-500 hover:text-[#12544F] hover:bg-slate-100 rounded-lg transition"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteGuide(guide.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. FAQS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'faqs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
              <button
                onClick={() => setFaqCategoryFilter('All')}
                className={`px-3 py-1.5 rounded-xl text-sm font-bold transition ${
                  faqCategoryFilter === 'All'
                    ? 'bg-[#12544F] text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                All ({faqs.length})
              </button>
              {FAQ_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFaqCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-bold whitespace-nowrap transition ${
                    faqCategoryFilter === cat
                      ? 'bg-[#12544F] text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleOpenFaqModal()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#12544F] hover:bg-[#0c3935] text-white rounded-xl text-sm font-bold transition shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add FAQ</span>
            </button>
          </div>

          {/* FAQs List */}
          <div className="grid grid-cols-1 gap-3">
            {faqs
              .filter(
                (f) => faqCategoryFilter === 'All' || f.category === faqCategoryFilter
              )
              .map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-[#12544F]/10 text-[#12544F]">
                        {faq.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Sort: {faq.sort_order}
                      </span>
                    </div>
                    <h4 className="font-black text-sm text-[#092328]">{faq.question}</h4>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
                    <button
                      onClick={() => handleMoveFaq(faqs.findIndex((x) => x.id === faq.id), -1)}
                      className="p-1.5 text-slate-400 hover:text-[#12544F] hover:bg-slate-100 rounded-lg transition"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveFaq(faqs.findIndex((x) => x.id === faq.id), 1)}
                      className="p-1.5 text-slate-400 hover:text-[#12544F] hover:bg-slate-100 rounded-lg transition"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenFaqModal(faq)}
                      className="p-1.5 text-slate-500 hover:text-[#12544F] hover:bg-slate-100 rounded-xl transition"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. COMPLIANCE SECTIONS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-slate-500">
              Edit compliance directives, KYC requirement checklists, anti-spam policies, and legal agreements.
            </div>
            <button
              onClick={handleCreateComplianceSection}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#12544F] hover:bg-[#0c3935] text-white rounded-xl text-sm font-bold transition shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Compliance Section</span>
            </button>
          </div>

          <div className="space-y-6">
            {complianceSections.map((sec, idx) => (
              <div
                key={sec.id || idx}
                className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#12544F] bg-[#12544F]/10 px-2.5 py-0.5 rounded-md">
                      {sec.section_key}
                    </span>
                    <h3 className="text-base font-black text-[#092328] mt-1">{sec.title}</h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleMoveComplianceSection(idx, -1)}
                      className="p-1.5 text-slate-400 hover:text-[#12544F] hover:bg-slate-100 rounded-lg transition"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveComplianceSection(idx, 1)}
                      className="p-1.5 text-slate-400 hover:text-[#12544F] hover:bg-slate-100 rounded-lg transition"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleUpdateComplianceSection(sec)}
                      disabled={saving}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#12544F] hover:bg-[#0c3935] text-white rounded-xl text-sm font-bold transition"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => handleDeleteComplianceSection(sec.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Section"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-black text-slate-700 mb-1">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={sec.title || ''}
                      onChange={(e) => {
                        const next = [...complianceSections];
                        next[idx].title = e.target.value;
                        setComplianceSections(next);
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-[#12544F]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black text-slate-700 mb-1">
                      Section Subtitle
                    </label>
                    <input
                      type="text"
                      value={sec.subtitle || ''}
                      onChange={(e) => {
                        const next = [...complianceSections];
                        next[idx].subtitle = e.target.value;
                        setComplianceSections(next);
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-[#12544F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black text-slate-700 mb-1">
                    Main Description / Content
                  </label>
                  <textarea
                    rows={3}
                    value={sec.content || ''}
                    onChange={(e) => {
                      const next = [...complianceSections];
                      next[idx].content = e.target.value;
                      setComplianceSections(next);
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-[#12544F]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-slate-700 mb-1">
                    Structured Data JSON (rules, documents, policies)
                  </label>
                  <textarea
                    rows={6}
                    value={
                      typeof sec.content_json === 'string'
                        ? sec.content_json
                        : JSON.stringify(sec.content_json, null, 2)
                    }
                    onChange={(e) => {
                      const next = [...complianceSections];
                      try {
                        next[idx].content_json = JSON.parse(e.target.value);
                      } catch {
                        next[idx].content_json = e.target.value;
                      }
                      setComplianceSections(next);
                    }}
                    className="w-full font-mono text-[11px] px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-[#12544F]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. PAGE HEADINGS & SEO TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 gap-6">
          {[
            {
              slug: 'product-guides',
              name: 'Product Guides Page (/resources/product-guides)',
            },
            {
              slug: 'faq-helpdesk',
              name: 'FAQ & Helpdesk Page (/resources/faq-helpdesk)',
            },
            {
              slug: 'compliance-btrc',
              name: 'Compliance & BTRC Page (/resources/compliance-btrc)',
            },
          ].map(({ slug, name }) => (
            <div
              key={slug}
              className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-black text-sm text-[#092328]">{name}</h3>
                  <div className="text-[11px] font-mono text-slate-400">Slug: {slug}</div>
                </div>
                <button
                  onClick={() => handleSavePageMeta(slug)}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#12544F] hover:bg-[#0c3935] text-white rounded-xl text-sm font-bold transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Headers</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-1">
                    Hero Page Title
                  </label>
                  <input
                    type="text"
                    value={pagesMeta[slug]?.title || ''}
                    onChange={(e) =>
                      setPagesMeta({
                        ...pagesMeta,
                        [slug]: { ...pagesMeta[slug], title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-[#12544F]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-slate-700 mb-1">
                    Meta SEO Title
                  </label>
                  <input
                    type="text"
                    value={pagesMeta[slug]?.meta_title || ''}
                    onChange={(e) =>
                      setPagesMeta({
                        ...pagesMeta,
                        [slug]: { ...pagesMeta[slug], meta_title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-[#12544F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-1">
                  Hero Subtitle
                </label>
                <textarea
                  rows={2}
                  value={pagesMeta[slug]?.subtitle || ''}
                  onChange={(e) =>
                    setPagesMeta({
                      ...pagesMeta,
                      [slug]: { ...pagesMeta[slug], subtitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-[#12544F]"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GUIDE MODAL */}
      {guideModalOpen && editingGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-base text-[#092328]">
                {editingGuide.id ? 'Edit Product Guide' : 'Add New Product Guide'}
              </h3>
              <button
                onClick={() => setGuideModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGuide} className="p-6 overflow-y-auto space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-black text-slate-700 mb-1">Guide Title *</label>
                  <input
                    type="text"
                    required
                    value={editingGuide.title}
                    onChange={(e) => setEditingGuide({ ...editingGuide, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#12544F]"
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-700 mb-1">Category</label>
                  <select
                    value={editingGuide.category}
                    onChange={(e) => setEditingGuide({ ...editingGuide, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#12544F]"
                  >
                    <option value="IP Phone">IP Phone</option>
                    <option value="Virtual Number">Virtual Number</option>
                    <option value="Cloud PBX">Cloud PBX</option>
                    <option value="Auto Dialer">Auto Dialer</option>
                    <option value="Calling App">Calling App</option>
                    <option value="Recharge & Billing">Recharge & Billing</option>
                    <option value="AI Calling">AI Calling</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-black text-slate-700 mb-1">Icon</label>
                  <select
                    value={editingGuide.icon}
                    onChange={(e) => setEditingGuide({ ...editingGuide, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#12544F]"
                  >
                    {GUIDE_ICONS.map((ic) => (
                      <option key={ic} value={ic}>
                        {ic}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-black text-slate-700 mb-1">Read Time</label>
                  <input
                    type="text"
                    value={editingGuide.read_time}
                    onChange={(e) =>
                      setEditingGuide({ ...editingGuide, read_time: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#12544F]"
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={editingGuide.sort_order}
                    onChange={(e) =>
                      setEditingGuide({ ...editingGuide, sort_order: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#12544F]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-700 mb-1">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  value={editingGuide.short_desc}
                  onChange={(e) =>
                    setEditingGuide({ ...editingGuide, short_desc: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#12544F]"
                />
              </div>

              <div>
                <label className="block font-black text-slate-700 mb-1">
                  Full Guide Step-by-Step Content (Markdown Supported)
                </label>
                <textarea
                  rows={8}
                  value={editingGuide.full_content}
                  onChange={(e) =>
                    setEditingGuide({ ...editingGuide, full_content: e.target.value })
                  }
                  placeholder="### 1. Title&#10;- Step 1&#10;- Step 2"
                  className="w-full font-mono text-sm px-3 py-2 border border-slate-200 rounded-xl focus:border-[#12544F]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingGuide.is_popular)}
                    onChange={(e) =>
                      setEditingGuide({ ...editingGuide, is_popular: e.target.checked ? 1 : 0 })
                    }
                    className="rounded text-[#12544F]"
                  />
                  <span className="font-bold text-slate-700">Mark as Popular</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingGuide.is_published)}
                    onChange={(e) =>
                      setEditingGuide({ ...editingGuide, is_published: e.target.checked ? 1 : 0 })
                    }
                    className="rounded text-[#12544F]"
                  />
                  <span className="font-bold text-slate-700">Published Status</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setGuideModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#12544F] hover:bg-[#0c3935] text-white rounded-xl font-bold transition"
                >
                  {saving ? 'Saving...' : 'Save Guide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ MODAL */}
      {faqModalOpen && editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-base text-[#092328]">
                {editingFaq.id ? 'Edit FAQ' : 'Add FAQ'}
              </h3>
              <button
                onClick={() => setFaqModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="p-6 overflow-y-auto space-y-4 text-sm">
              <div>
                <label className="block font-black text-slate-700 mb-1">Category *</label>
                <select
                  value={editingFaq.category}
                  onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#12544F]"
                >
                  {FAQ_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-black text-slate-700 mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#12544F]"
                />
              </div>

              <div>
                <label className="block font-black text-slate-700 mb-1">Answer *</label>
                <textarea
                  rows={5}
                  required
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#12544F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-black text-slate-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={editingFaq.sort_order}
                    onChange={(e) =>
                      setEditingFaq({ ...editingFaq, sort_order: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#12544F]"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingFaq.is_active)}
                      onChange={(e) =>
                        setEditingFaq({ ...editingFaq, is_active: e.target.checked ? 1 : 0 })
                      }
                      className="rounded text-[#12544F]"
                    />
                    <span className="font-bold text-slate-700">Active</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFaqModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#12544F] hover:bg-[#0c3935] text-white rounded-xl font-bold transition"
                >
                  {saving ? 'Saving...' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceCmsManager;

