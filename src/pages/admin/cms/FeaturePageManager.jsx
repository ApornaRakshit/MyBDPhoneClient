import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../../services/api';
import {
  Layers,
  Plus,
  Pencil,
  Trash2,
  Eye,
  CheckCircle2,
  X,
  Smartphone,
  Save,
  Radio,
  Clock,
  Cpu,
  HelpCircle,
  ArrowRight,
  Code,
  FileText,
} from 'lucide-react';

export const FeaturePageManager = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [rawJsonMode, setRawJsonMode] = useState(false);
  const [rawJsonText, setRawJsonText] = useState('');

  const loadPages = async () => {
    setLoading(true);
    try {
      const res = await API.get('/features/admin/all');
      if (res.data?.success) {
        setPages(res.data.pages || []);
      }
    } catch (err) {
      console.error('Error loading feature pages:', err);
      setError('Failed to load feature pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleOpenEdit = (page) => {
    setEditingPage(JSON.parse(JSON.stringify(page)));
    setRawJsonText(JSON.stringify(page.sections || [], null, 2));
    setRawJsonMode(false);
    setError(null);
    setSuccess(null);
  };

  const handleOpenCreate = () => {
    const newPage = {
      slug: '',
      title: '',
      subtitle: '',
      hero_description: '',
      is_active: 1,
      sections: [
        {
          section_key: 'overview_stats',
          title: 'Enterprise Concurrency Standards',
          display_order: 1,
          content: {
            eyebrow: 'CAPABILITIES',
            stats: [
              { label: 'Concurrency', value: '5 Devices', icon: 'Smartphone' },
              { label: 'Latency', value: '< 150ms', icon: 'Zap' },
            ],
          },
        },
      ],
    };
    setEditingPage(newPage);
    setRawJsonText(JSON.stringify(newPage.sections, null, 2));
    setRawJsonMode(false);
    setError(null);
    setSuccess(null);
  };

  const handleSavePage = async (e) => {
    e.preventDefault();
    if (!editingPage) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    let parsedSections = editingPage.sections || [];
    if (rawJsonMode) {
      try {
        parsedSections = JSON.parse(rawJsonText);
      } catch (err) {
        setSaving(false);
        setError('Invalid JSON syntax in Sections editor.');
        return;
      }
    }

    const payload = {
      slug: editingPage.slug,
      title: editingPage.title,
      subtitle: editingPage.subtitle,
      hero_description: editingPage.hero_description,
      is_active: editingPage.is_active ? 1 : 0,
      sections: parsedSections,
    };

    try {
      if (editingPage.id) {
        await API.put(`/features/admin/${editingPage.id}`, payload);
      } else {
        await API.post('/features/admin/create', payload);
      }
      setSuccess('Feature page saved successfully!');
      loadPages();
      setTimeout(() => {
        setEditingPage(null);
        setSuccess(null);
      }, 1200);
    } catch (err) {
      console.error('Error saving feature page:', err);
      setError(err.response?.data?.message || 'Failed to save feature page');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feature page?')) return;
    try {
      await API.delete(`/features/admin/${id}`);
      loadPages();
    } catch (err) {
      alert('Error deleting page');
    }
  };

  // Helper to update specific section content in visual mode
  const updateSectionContent = (index, newContent) => {
    if (!editingPage) return;
    const updated = [...(editingPage.sections || [])];
    updated[index] = {
      ...updated[index],
      content: newContent,
    };
    setEditingPage({ ...editingPage, sections: updated });
    setRawJsonText(JSON.stringify(updated, null, 2));
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">
            Feature Landing Pages CMS
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage dynamic interactive feature showcases (e.g. Multi-Device Ringing) with real-time UI previews.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl font-bold text-sm bg-[#12544F] text-white hover:bg-[#092328] flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Feature Page</span>
        </button>
      </div>

      {/* Pages Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-sm">
                <th className="pb-3">Title & Tagline</th>
                <th className="pb-3">Public Route</th>
                <th className="pb-3">Sections Count</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">Loading feature pages...</td>
                </tr>
              ) : pages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">No feature pages found. Click New Feature Page to create one.</td>
                </tr>
              ) : (
                pages.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5">
                      <div className="font-bold text-[#092328] text-sm">{p.title}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-sm">{p.subtitle}</div>
                    </td>
                    <td className="py-3.5">
                      <span className="font-mono text-sm text-[#12544F] bg-[#12544F]/5 px-2.5 py-1 rounded-md">
                        /features/{p.slug}
                      </span>
                    </td>
                    <td className="py-3.5 text-sm text-slate-600 font-bold">
                      {(p.sections || []).length} Blocks
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        p.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {p.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      <Link
                        to={`/features/${p.slug}`}
                        target="_blank"
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(p)}
                        className="px-2.5 py-1 rounded-lg bg-[#12544F]/10 hover:bg-[#12544F]/20 text-[#12544F] text-sm font-bold transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePage(p.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-sm font-bold transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Page Editor Modal */}
      {editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-800 space-y-6 relative my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-xl font-black text-[#092328]">
                  {editingPage.id ? `Edit Feature: ${editingPage.title}` : 'Create Feature Page'}
                </h3>
                <p className="text-sm text-slate-500">
                  Configure hero copywriting, live device simulations, routing modes, and architecture diagrams.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPage(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Scroll Area */}
            <form onSubmit={handleSavePage} className="overflow-y-auto pr-1 space-y-5 flex-1 text-sm">
              
              {/* Primary Meta Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 font-bold block mb-1 text-sm">Page Title *</label>
                  <input
                    type="text"
                    required
                    value={editingPage.title}
                    onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1 text-sm">Public Slug * (/features/...)</label>
                  <input
                    type="text"
                    required
                    disabled={Boolean(editingPage.id)}
                    value={editingPage.slug}
                    onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                    placeholder="e.g. multi-device-ringing"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] font-mono focus:bg-white focus:outline-hidden disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1 text-sm">Tagline / Subtitle</label>
                <input
                  type="text"
                  value={editingPage.subtitle || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, subtitle: e.target.value })}
                  placeholder="e.g. Simultaneous & Intelligent Call Routing Across 5 Devices"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1 text-sm">Hero Detailed Description</label>
                <textarea
                  rows={2}
                  value={editingPage.hero_description || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, hero_description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="text-slate-700 font-bold text-sm flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingPage.is_active)}
                    onChange={(e) => setEditingPage({ ...editingPage, is_active: e.target.checked ? 1 : 0 })}
                    className="rounded text-[#12544F] focus:ring-0 w-4 h-4"
                  />
                  <span>Page is Published & Active</span>
                </label>
              </div>

              {/* Sections Editor Header */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-black text-[#092328] text-sm flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#12544F]" />
                      <span>Dynamic Section Blocks</span>
                    </h4>
                    <p className="text-sm text-slate-400">
                      Devices manager, Ringing strategies, Timeout rules, Technical flow steps & FAQ
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRawJsonMode(!rawJsonMode)}
                      className="px-3 py-1.5 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>{rawJsonMode ? 'Visual Blocks' : 'Raw JSON Mode'}</span>
                    </button>
                  </div>
                </div>

                {/* Raw JSON Mode or Visual Block Cards */}
                {rawJsonMode ? (
                  <div className="space-y-2">
                    <textarea
                      rows={12}
                      value={rawJsonText}
                      onChange={(e) => setRawJsonText(e.target.value)}
                      className="w-full p-3 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-sm focus:outline-hidden leading-relaxed"
                    />
                    <span className="text-[11px] text-slate-400">
                      Directly edit sections schema. Content changes immediately reflect on the public feature landing page.
                    </span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(editingPage.sections || []).map((sec, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-[#12544F]">
                              {sec.section_key}
                            </span>
                            <span className="font-bold text-sm text-[#092328]">{sec.title}</span>
                          </div>
                        </div>

                        {/* Quick field helpers based on section key */}
                        {sec.section_key === 'device_manager' && (
                          <div className="text-sm text-slate-600 bg-white p-3 rounded-xl border border-slate-100 space-y-1">
                            <div>Primary Line: <strong>{sec.content?.primary_number || '096490123756'}</strong></div>
                            <div>Devices Configured: <strong>{(sec.content?.devices || []).length} terminals</strong></div>
                          </div>
                        )}

                        {sec.section_key === 'ringing_strategies' && (
                          <div className="text-sm text-slate-600 bg-white p-3 rounded-xl border border-slate-100 space-y-1">
                            <div>Ringing Modes: <strong>{(sec.content?.modes || []).map(m => m.name).join(', ')}</strong></div>
                          </div>
                        )}

                        {sec.section_key === 'technical_flow' && (
                          <div className="text-sm text-slate-600 bg-white p-3 rounded-xl border border-slate-100 space-y-1">
                            <div>Architecture Steps: <strong>{(sec.content?.steps || []).length} steps verified</strong></div>
                          </div>
                        )}

                        {sec.section_key === 'faq' && (
                          <div className="text-sm text-slate-600 bg-white p-3 rounded-xl border border-slate-100 space-y-1">
                            <div>FAQ Accordion Items: <strong>{(sec.content?.items || []).length} Q&As</strong></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status alerts */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
                  {success}
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingPage(null)}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#12544F] hover:bg-[#092328] text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save & Publish'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FeaturePageManager;

