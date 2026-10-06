import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, RefreshCw, Save, Trash2, UploadCloud, Building2, Image as ImageIcon } from 'lucide-react';
import API from '../../services/api';

const API_ROOT = String(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
const absUrl = (v) => {
  if (!v) return '';
  if (/^(https?:\/\/|data:|blob:)/i.test(v)) return v;
  if (v.startsWith('/uploads/')) return `${API_ROOT}${v}`;
  return v;
};
const parse = (v) => {
  if (!v) return {};
  if (typeof v === 'object') return v;
  try { return JSON.parse(v); } catch { return {}; }
};
const clone = (v) => JSON.parse(JSON.stringify(v));

const TABS = [
  ['sections', 'Sections'],
  ['hero', 'Hero Slides'],
  ['cards', 'Service Cards'],
  ['offerings', 'Core Offerings'],
  ['clients', 'Clients / Brand Logos'],
  ['advantages', 'Advantages'],
  ['addons', 'Add-ons'],
  ['faq', 'FAQ'],
  ['text', 'Landing Text']
];

const COLLECTIONS = {
  hero: 'home_hero_slides',
  cards: 'home_service_cards',
  offerings: 'home_offerings',
  clients: 'home_clients',
  advantages: 'home_advantages',
  addons: 'home_addons',
  faq: 'faq'
};

const emptyBy = (kind) => ({
  hero: { title: '', description: '', image_url: '', meta: 'TEAM COLLABORATION & MULTI-DEVICE', sort_order: 1, status: 'active', payload: { eyebrow: '', primary_text: 'Get Started', primary_url: '/register', secondary_text: 'Explore Packages', secondary_url: '/packages', badges: [] } },
  cards: { title: '', description: '', image_url: '', link_url: '/features', meta: '', sort_order: 1, status: 'active', payload: { label: 'Learn More' } },
  offerings: { title: '', description: '', image_url: '', link_url: '/features', meta: 'CATEGORY', sort_order: 1, status: 'active', payload: { features: [], button_text: 'Explore', button_url: '/features' } },
  clients: { title: '', description: '', logoUrl: '', logo_url: '', image_url: '', sort_order: 1, order: 1, status: 'active', isVisible: true, is_visible: true, payload: {} },
  advantages: { title: '', description: '', image_url: '', icon: 'ShieldCheck', sort_order: 1, status: 'active', payload: {} },
  addons: { title: '', description: '', image_url: '', icon: 'Sparkles', meta: '৳99/mo', sort_order: 1, status: 'active', payload: {} },
  faq: { title: '', description: '', image_url: '', icon: '', link_url: '', meta: '', sort_order: 1, status: 'active', payload: { answer: '' } },
}[kind]);

export const HomePageManager = () => {
  const [searchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const initialTab = TABS.some(([k]) => k === requestedTab) ? requestedTab : 'sections';
  const [tab, setTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [config, setConfig] = useState({});
  const [sections, setSections] = useState([]);
  const [homePageId, setHomePageId] = useState(null);
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const cfg = await API.get('/cms/admin/config');
      setConfig(cfg.data?.config || {});

      if (tab === 'sections' || tab === 'text') {
        const h = await API.get('/cms/public/home');
        setSections(h.data?.sections || []);
        setHomePageId(h.data?.page?.id || null);
      } else if (tab === 'clients') {
        // First try dedicated /api/v1/client-brands/admin
        try {
          const res = await API.get('/v1/client-brands/admin');
          if (res.data?.success && Array.isArray(res.data.data)) {
            setItems(res.data.data.map(x => ({
              ...x,
              image_url: x.logoUrl || x.logo_url,
              status: (x.isVisible ?? x.is_visible) ? 'active' : 'inactive',
              sort_order: x.order ?? x.sort_order ?? 0,
            })));
          } else {
            const r = await API.get(`/cms/admin/items/${COLLECTIONS[tab]}`);
            setItems((r.data?.items || []).map(x => ({ ...x, payload: parse(x.payload) })));
          }
        } catch {
          const r = await API.get(`/cms/admin/items/${COLLECTIONS[tab]}`);
          setItems((r.data?.items || []).map(x => ({ ...x, payload: parse(x.payload) })));
        }
      } else {
        const r = await API.get(`/cms/admin/items/${COLLECTIONS[tab]}`);
        setItems((r.data?.items || []).map(x => ({ ...x, payload: parse(x.payload) })));
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load CMS data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (TABS.some(([k]) => k === requestedTab)) setTab(requestedTab);
  }, [requestedTab]);

  useEffect(() => {
    load();
  }, [tab]);

  const upload = async (file) => {
    if (!file) return '';
    setSaving(true);
    try {
      const fd = new FormData();
      if (tab === 'clients') {
        fd.append('logo', file);
        const r = await API.post('/v1/client-brands/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        return r.data?.logoUrl || r.data?.url || '';
      } else {
        fd.append('file', file);
        const r = await API.post('/cms/admin/media/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        return r.data?.url || '';
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Upload failed');
      return '';
    } finally {
      setSaving(false);
    }
  };

  const saveItem = async (item) => {
    setSaving(true);
    setError('');
    try {
      if (tab === 'clients') {
        const logoUrl = item.logoUrl || item.logo_url || item.image_url;
        const payload = {
          title: item.title,
          logoUrl: logoUrl,
          logo_url: logoUrl,
          order: Number(item.order ?? item.sort_order ?? 0),
          sort_order: Number(item.sort_order ?? item.order ?? 0),
          isVisible: item.status === 'active' || item.isVisible === true || item.is_visible === true,
          is_visible: item.status === 'active' || item.isVisible === true || item.is_visible === true,
          status: item.status || 'active',
        };

        if (item.id && !String(item.id).startsWith('fallback-')) {
          await API.put(`/v1/client-brands/${item.id}`, payload);
        } else {
          await API.post('/v1/client-brands', payload);
        }
      } else {
        const body = { ...item, collection_key: COLLECTIONS[tab] };
        if (item.id) await API.put(`/cms/admin/items/${item.id}`, body);
        else await API.post('/cms/admin/items', body);
      }
      setModal(null);
      setMsg('Saved and published successfully.');
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const toggleItem = async (id) => {
    try {
      if (tab === 'clients') {
        await API.put(`/v1/client-brands/${id}/toggle`);
      } else {
        await API.put(`/cms/admin/items/${id}/toggle`);
      }
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Status toggle failed');
    }
  };

  const deleteItem = async (id) => {
    if (!confirm('Are you sure you want to delete this brand logo?')) return;
    try {
      if (tab === 'clients') {
        await API.delete(`/v1/client-brands/${id}`);
      } else {
        await API.delete(`/cms/admin/items/${id}`);
      }
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Delete failed');
    }
  };

  const moveItem = async (i, d) => {
    const next = clone(items);
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    next.forEach((x, k) => {
      x.sort_order = k + 1;
      x.order = k + 1;
    });
    setItems(next);
    try {
      if (tab === 'clients') {
        await API.put('/v1/client-brands/reorder', { items: next.map(x => ({ id: x.id, order: x.sort_order, sort_order: x.sort_order })) });
      } else {
        await API.put('/cms/admin/items/reorder', { items: next.map(x => ({ id: x.id, sort_order: x.sort_order })) });
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Reorder failed');
      await load();
    }
  };

  const moveSection = async (i, d) => {
    const next = clone(sections);
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    next.forEach((x, k) => x.sort_order = k + 1);
    setSections(next);
    await API.put('/cms/admin/sections/reorder', { items: next.map(x => ({ id: x.id, sort_order: x.sort_order })) });
  };

  const toggleSection = async (id) => {
    await API.put(`/cms/admin/sections/${id}/toggle`);
    await load();
  };

  const deleteSection = async (id) => {
    if (!confirm('Delete this section?')) return;
    await API.delete(`/cms/admin/sections/${id}`);
    await load();
  };

  const saveSection = async (section) => {
    setSaving(true);
    try {
      if (section.id) await API.put(`/cms/admin/sections/${section.id}`, section);
      else await API.post(`/cms/admin/pages/${section.page_id}/sections`, section);
      setModal(null);
      setMsg('Section saved.');
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Section save failed');
    } finally {
      setSaving(false);
    }
  };

  const saveHomeConfig = async (next) => {
    setSaving(true);
    try {
      await API.put('/cms/admin/config/home_config', { value: next });
      setConfig(p => ({ ...p, home_config: next }));
      setMsg('Landing text and settings saved.');
    } catch (e) {
      setError(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const homeConfig = config.home_config || {};
  const titleMap = homeConfig.section_titles || {};
  const visibility = homeConfig.section_visibility || {};
  const orderedSections = useMemo(() => sections, [sections]);

  if (loading && !items.length && !sections.length) {
    return <div className="p-10 rounded-3xl bg-white border border-slate-200 text-center text-slate-500">Loading Landing Page Manager…</div>;
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="text-sm text-slate-400">
            <Link to="/admin/cms" className="hover:text-[#12544F]">CMS & Site Management</Link> / Home Page Manager
          </div>
          <h1 className="mt-2 text-3xl font-black text-[#092328]">Home Page Manager</h1>
          <p className="mt-1 text-sm text-slate-500 max-w-4xl">
            Control dynamic home page sections, packages, and the &quot;Clients We Have Helped with PBX&quot; brand logo slider without touching source code.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="px-4 py-2.5 rounded-xl border bg-white text-sm font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <Link to="/" target="_blank" className="px-4 py-2.5 rounded-xl bg-[#12544F] text-white text-sm font-bold hover:bg-[#0e433f] transition">
            View Live
          </Link>
        </div>
      </div>

      {(msg || error) && (
        <div className={`px-4 py-3 rounded-2xl text-sm font-semibold ${error ? 'bg-rose-50 border border-rose-200 text-rose-700' : 'bg-emerald-50 border border-emerald-200 text-emerald-700'}`}>
          {error || msg}
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(([k, l]) => (
          <button
            key={k}
            onClick={() => { setTab(k); setMsg(''); setError(''); }}
            className={`px-4 py-2.5 rounded-xl text-sm font-black border transition cursor-pointer ${
              tab === k ? 'bg-[#12544F] text-white border-[#12544F] shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === 'sections' && (
        <SectionsEditor
          sections={orderedSections}
          homePageId={homePageId}
          homeConfig={homeConfig}
          titleMap={titleMap}
          visibility={visibility}
          setModal={setModal}
          setTab={setTab}
          toggleSection={toggleSection}
          deleteSection={deleteSection}
          moveSection={moveSection}
          saveHomeConfig={saveHomeConfig}
        />
      )}

      {tab === 'text' && (
        <LandingTextEditor
          homeConfig={homeConfig}
          config={config}
          saveHomeConfig={saveHomeConfig}
          upload={upload}
          saving={saving}
        />
      )}

      {COLLECTIONS[tab] && (
        <CollectionEditor
          kind={tab}
          items={items}
          setModal={setModal}
          toggle={toggleItem}
          del={deleteItem}
          move={moveItem}
        />
      )}

      {modal?.type === 'item' && (
        <ItemModal
          kind={modal.kind}
          item={modal.item}
          onClose={() => setModal(null)}
          onSave={saveItem}
          upload={upload}
          saving={saving}
        />
      )}

      {modal?.type === 'section' && (
        <SectionModal
          section={modal.section}
          onClose={() => setModal(null)}
          onSave={saveSection}
          saving={saving}
          upload={upload}
        />
      )}
    </div>
  );
};

function SectionsEditor({ sections, homePageId, homeConfig, titleMap, visibility, setModal, setTab, toggleSection, deleteSection, moveSection, saveHomeConfig }) {
  const pageId = homePageId || sections[0]?.page_id;
  const add = () => setModal({
    type: 'section',
    section: {
      page_id: pageId,
      section_key: `custom-${Date.now()}`,
      section_type: 'custom',
      title: 'New Section',
      subtitle: '',
      content_html: '',
      settings: {},
      sort_order: sections.length + 1,
      status: 'active'
    }
  });

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#092328]">Home Page Sections & Order</h2>
          <p className="text-sm text-slate-500">
            Active sections render on the live website. Reorder, toggle visibility, edit titles, or configure brand logos.
          </p>
        </div>
        <button onClick={add} className="px-4 py-2.5 rounded-xl bg-[#12544F] text-white text-sm font-bold flex items-center gap-2 cursor-pointer hover:bg-[#0e433f]">
          <Plus className="w-4 h-4" /> Add Section
        </button>
      </div>

      <div className="space-y-3">
        {sections.map((s, i) => {
          const isClients = s.section_key === 'clients';
          const isPackages = s.section_key === 'packages';
          const displayTitle = titleMap[s.section_key] || s.title || s.section_key;

          return (
            <div
              key={s.id || i}
              className={`p-4 rounded-2xl border transition-all flex flex-col xl:flex-row xl:items-center gap-4 ${
                isClients
                  ? 'border-[#12544F]/40 bg-[#f0faf6] shadow-xs'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-black text-[#092328] text-base">{displayTitle}</div>
                  {isClients && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#12544F] text-white">
                      Brand Logo Slider
                    </span>
                  )}
                  {isPackages && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-700">
                      Search 096 Numbers & Packages
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                  <span className="font-mono">{s.section_type}</span>
                  <span>·</span>
                  <span className="font-mono">{s.section_key}</span>
                  <span>·</span>
                  <span>Order: {s.sort_order ?? i + 1}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {isClients && (
                  <button
                    type="button"
                    onClick={() => setTab('clients')}
                    className="px-3 py-1.5 rounded-xl bg-[#12544F] text-white text-sm font-bold flex items-center gap-1.5 hover:bg-[#0e433f] cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5" /> Manage Brand Logos
                  </button>
                )}

                <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${
                  s.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {s.status === 'active' ? 'VISIBLE' : 'HIDDEN'}
                </span>

                <button
                  type="button"
                  title={s.status === 'active' ? 'Hide section from live home page' : 'Make section visible'}
                  onClick={() => toggleSection(s.id)}
                  className="p-2 rounded-xl border bg-white hover:bg-slate-50 cursor-pointer"
                >
                  {s.status === 'active' ? <EyeOff className="w-4 h-4 text-slate-600" /> : <Eye className="w-4 h-4 text-[#12544F]" />}
                </button>

                <button
                  type="button"
                  title="Edit section metadata"
                  onClick={() => setModal({ type: 'section', section: clone(s) })}
                  className="p-2 rounded-xl border bg-white hover:bg-slate-50 cursor-pointer text-slate-700"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  title="Move up"
                  onClick={() => moveSection(i, -1)}
                  disabled={i === 0}
                  className="p-2 rounded-xl border bg-white hover:bg-slate-50 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  title="Move down"
                  onClick={() => moveSection(i, 1)}
                  disabled={i === sections.length - 1}
                  className="p-2 rounded-xl border bg-white hover:bg-slate-50 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  title="Delete section"
                  onClick={() => deleteSection(s.id)}
                  className="p-2 rounded-xl border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t">
        <button onClick={() => saveHomeConfig({ ...homeConfig, section_visibility: { ...visibility } })} className="hidden">
          save
        </button>
      </div>
    </div>
  );
}

function CollectionEditor({ kind, items, setModal, toggle, del, move }) {
  const labels = {
    hero: 'Hero Carousel Slides',
    cards: 'Hero Service Cards',
    offerings: 'Core Offering Cards',
    clients: 'Clients We Have Helped with PBX (Brand Logos)',
    advantages: 'MyBDPhone Advantages',
    addons: 'Digital Phone Add-ons',
    faq: 'Frequently Asked Questions'
  };

  const isClients = kind === 'clients';

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-[#092328]">{labels[kind]}</h2>
            {isClients && (
              <span className="px-2.5 py-0.5 rounded-full text-sm font-black bg-emerald-100 text-emerald-800">
                {items.length} Logos
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            {isClients
              ? 'Upload new brand logos, update company titles, change display order, or toggle visibility.'
              : 'Add, edit, activate/deactivate, move up/down, upload images/icons, or delete items.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModal({ type: 'item', kind, item: emptyBy(kind) })}
          className="px-4 py-2.5 rounded-xl bg-[#12544F] text-white text-sm font-bold flex items-center gap-2 cursor-pointer hover:bg-[#0e433f]"
        >
          <Plus className="w-4 h-4" /> Add {isClients ? 'Brand Logo' : 'Item'}
        </button>
      </div>

      <div className={`grid gap-4 ${
        kind === 'offerings' ? 'lg:grid-cols-2' :
        kind === 'clients' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' :
        kind === 'hero' || kind === 'cards' || kind === 'advantages' || kind === 'addons' ? 'md:grid-cols-2 xl:grid-cols-4' : 'md:grid-cols-2'
      }`}>
        {items.map((item, i) => {
          const logoSrc = item.logoUrl || item.logo_url || item.image_url;
          const isActive = item.status === 'active' || item.isVisible === true || item.is_visible === true;

          return (
            <div
              key={item.id || i}
              className={`rounded-2xl border p-4 transition-all flex flex-col justify-between ${
                isActive ? 'border-slate-200 bg-white hover:border-[#12544F]/50 shadow-xs' : 'border-dashed border-slate-300 bg-slate-50/70 opacity-75'
              }`}
            >
              <div>
                <div className="h-20 rounded-xl bg-[#eff8f4] flex items-center justify-center overflow-hidden p-2.5 relative group">
                  {logoSrc ? (
                    <img
                      src={absUrl(logoSrc)}
                      className="max-h-full max-w-full object-contain"
                      alt={item.title || 'Brand Logo'}
                    />
                  ) : (
                    <span className="text-2xl text-[#2A835F]">✦</span>
                  )}
                  <span className={`absolute top-1.5 right-1.5 px-2 py-0.5 rounded text-[9px] font-black ${
                    isActive ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'
                  }`}>
                    {isActive ? 'VISIBLE' : 'HIDDEN'}
                  </span>
                </div>

                <div className="mt-3 font-black text-[#092328] text-sm line-clamp-1">
                  {item.title || 'Untitled'}
                </div>

                {isClients && (
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Order: {item.order ?? item.sort_order ?? i + 1}
                  </div>
                )}

                {kind !== 'clients' && (
                  <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                    {kind === 'faq'
                      ? (item.payload?.answer || item.description || item.content_html || 'No answer added')
                      : item.description}
                  </p>
                )}

                {item.meta && (
                  <div className="mt-1 text-sm font-black text-[#12544F]">
                    {item.meta}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Edit Logo & Title"
                    onClick={() => setModal({ type: 'item', kind, item: { ...clone(item), payload: parse(item.payload) } })}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    title={isActive ? 'Hide logo from slider' : 'Show logo on slider'}
                    onClick={() => toggle(item.id)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 cursor-pointer"
                  >
                    {isActive ? <EyeOff className="w-3.5 h-3.5 text-slate-600" /> : <Eye className="w-3.5 h-3.5 text-[#12544F]" />}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Move up"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    title="Move down"
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    title="Delete logo"
                    onClick={() => del(item.id)}
                    className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ItemModal({ kind, item, onClose, onSave, upload, saving }) {
  const [f, setF] = useState({
    ...clone(item),
    payload: parse(item.payload),
    image_url: item.logoUrl || item.logo_url || item.image_url || '',
    logoUrl: item.logoUrl || item.logo_url || item.image_url || '',
  });

  const p = f.payload || {};
  const set = (k, v) => setF(x => ({ ...x, [k]: v }));
  const setP = (k, v) => setF(x => ({ ...x, payload: { ...parse(x.payload), [k]: v } }));
  const [features, setFeatures] = useState((p.features || []).join('\n'));

  const file = async (e) => {
    const url = await upload(e.target.files?.[0]);
    if (url) {
      set('image_url', url);
      set('logoUrl', url);
      set('logo_url', url);
    }
  };

  const isFaq = kind === 'faq';
  const isClients = kind === 'clients';

  const submit = () => {
    const next = { ...f, payload: parse(f.payload) };
    if (kind === 'hero') next.payload.badges = String(next.payload.badges || '').split(/\n+/).map(x => x.trim()).filter(Boolean);
    if (kind === 'offerings') next.payload.features = features.split(/\n+/).map(x => x.trim()).filter(Boolean);
    if (isFaq) {
      next.payload.answer = String(next.payload.answer || '');
      next.description = next.payload.answer;
      next.content_html = '';
    }
    if (isClients) {
      const url = f.logoUrl || f.logo_url || f.image_url;
      next.logoUrl = url;
      next.logo_url = url;
      next.image_url = url;
      next.order = Number(f.sort_order ?? f.order ?? 0);
      next.sort_order = Number(f.sort_order ?? f.order ?? 0);
      next.isVisible = f.status === 'active';
      next.is_visible = f.status === 'active';
    }
    onSave(next);
  };

  const faqAnswer = String(p.answer || f.description || f.content_html || '');
  const modalTitle = f.id
    ? `Edit ${isClients ? 'Client Brand Logo' : isFaq ? 'FAQ' : kind === 'hero' ? 'Hero Slide' : 'Item'}`
    : `Add ${isClients ? 'Client Brand Logo' : isFaq ? 'FAQ' : kind === 'hero' ? 'Hero Slide' : 'Item'}`;

  return (
    <Modal title={modalTitle} onClose={onClose}>
      {isFaq ? (
        <div className="space-y-4">
          <Field label="Question" value={f.title} onChange={v => set('title', v)} />
          <TextArea label="Answer" value={faqAnswer} onChange={v => setP('answer', v)} rows={7} placeholder="Write the answer shown on the landing page." />
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Sort Order" type="number" value={f.sort_order} onChange={v => set('sort_order', Number(v) || 0)} />
            <div>
              <label className="block text-sm font-black text-slate-700 mb-1.5">Status</label>
              <select value={f.status || 'active'} onChange={e => set('status', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      ) : isClients ? (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Field
              label="Company / Brand Name *"
              value={f.title}
              onChange={v => set('title', v)}
              placeholder="e.g. Karim Motors, Skybuy BD"
            />
            <Field
              label="Display Order (Sort Order)"
              type="number"
              value={f.sort_order ?? f.order ?? 1}
              onChange={v => {
                set('sort_order', Number(v) || 0);
                set('order', Number(v) || 0);
              }}
            />
          </div>

          <Upload
            label="Brand Company Logo Image *"
            value={f.logoUrl || f.logo_url || f.image_url}
            onChange={v => {
              set('image_url', v);
              set('logoUrl', v);
              set('logo_url', v);
            }}
            onFile={file}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-black text-slate-700 mb-1.5">Visibility Status</label>
              <select
                value={f.status || (f.isVisible === false || f.is_visible === false ? 'inactive' : 'active')}
                onChange={e => {
                  set('status', e.target.value);
                  set('isVisible', e.target.value === 'active');
                  set('is_visible', e.target.value === 'active');
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold"
              >
                <option value="active">Visible (Active on Slider)</option>
                <option value="inactive">Hidden (Inactive)</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-500">
                Slider displays <strong>10 logos per slide</strong> (2 rows x 5 columns) on desktop.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Title / Company Name" value={f.title} onChange={v => set('title', v)} />
          <Field label="Label / Price / Category" value={f.meta} onChange={v => set('meta', v)} />
          <div className="md:col-span-2">
            <TextArea label="Description" value={f.description} onChange={v => set('description', v)} rows={3} />
          </div>
          <Upload label="Image / Logo" value={f.image_url} onChange={v => set('image_url', v)} onFile={file} />
          {kind !== 'advantages' && kind !== 'addons' && (
            <Field label="Link URL" value={f.link_url} onChange={v => set('link_url', v)} />
          )}
          {kind === 'hero' && (
            <>
              <Field label="Eyebrow" value={p.eyebrow} onChange={v => setP('eyebrow', v)} />
              <Field label="Primary Button Text" value={p.primary_text} onChange={v => setP('primary_text', v)} />
              <Field label="Primary Button URL" value={p.primary_url} onChange={v => setP('primary_url', v)} />
              <Field label="Secondary Button Text" value={p.secondary_text} onChange={v => setP('secondary_text', v)} />
              <Field label="Secondary Button URL" value={p.secondary_url} onChange={v => setP('secondary_url', v)} />
              <TextArea label="Badges (one per line)" value={Array.isArray(p.badges) ? p.badges.join('\n') : p.badges || ''} onChange={v => setP('badges', v)} rows={3} />
            </>
          )}
          {kind === 'offerings' && (
            <>
              <TextArea label="Features (one per line)" value={features} onChange={setFeatures} rows={6} />
              <Field label="Button Text" value={p.button_text} onChange={v => setP('button_text', v)} />
              <Field label="Button URL" value={p.button_url} onChange={v => setP('button_url', v)} />
            </>
          )}
          <div>
            <label className="block text-sm font-black text-slate-700 mb-1.5">Status</label>
            <select value={f.status || 'active'} onChange={e => set('status', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
        <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-slate-100 font-bold text-sm cursor-pointer hover:bg-slate-200">
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={saving || !f.title || (isFaq && !faqAnswer.trim()) || (isClients && !(f.logoUrl || f.logo_url || f.image_url))}
          className="px-5 py-2.5 rounded-xl bg-[#12544F] text-white font-bold text-sm flex items-center gap-2 cursor-pointer hover:bg-[#0e433f] disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save & Publish'}
        </button>
      </div>
    </Modal>
  );
}

function LandingTextEditor({ homeConfig, saveHomeConfig, saving }) {
  const [v, setV] = useState({
    ...homeConfig,
    section_titles: { ...(homeConfig.section_titles || {}) },
    section_visibility: { ...(homeConfig.section_visibility || {}) }
  });

  const set = (k, x) => setV(p => ({ ...p, [k]: x }));
  const title = (k, x) => setV(p => ({ ...p, section_titles: { ...(p.section_titles || {}), [k]: x } }));

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-5">
      <div>
        <h2 className="text-xl font-black">Landing Headings & Subtitles</h2>
        <p className="text-sm text-slate-500">
          Update text labels and descriptions displayed across the public home page.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          ['offerings', 'Offerings Heading'],
          ['packages', 'Packages Heading'],
          ['clients', 'Clients Section Heading ("Clients We Have Helped with PBX")'],
          ['advantages', 'Advantages Heading'],
          ['addons', 'Add-ons Heading'],
          ['faq', 'FAQ Heading'],
          ['cta', 'CTA Heading']
        ].map(([k, l]) => (
          <Field key={k} label={l} value={v.section_titles?.[k]} onChange={x => title(k, x)} />
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <TextArea label="Offerings Subtitle" value={v.offerings_subtitle} onChange={x => set('offerings_subtitle', x)} rows={3} />
        <TextArea label="Packages Subtitle" value={v.packages_subtitle} onChange={x => set('packages_subtitle', x)} rows={3} />
        <TextArea label="Clients Subtitle" value={v.clients_subtitle} onChange={x => set('clients_subtitle', x)} rows={3} />
        <TextArea label="Advantages Subtitle" value={v.advantages_subtitle} onChange={x => set('advantages_subtitle', x)} rows={3} />
        <TextArea label="Add-ons Subtitle" value={v.addons_subtitle} onChange={x => set('addons_subtitle', x)} rows={3} />
        <TextArea label="FAQ Subtitle" value={v.faq_subtitle} onChange={x => set('faq_subtitle', x)} rows={3} />
        <TextArea label="CTA Subtitle" value={v.cta_subtitle} onChange={x => set('cta_subtitle', x)} rows={3} />
      </div>
      <div className="flex justify-end">
        <button onClick={() => saveHomeConfig(v)} disabled={saving} className="px-5 py-2.5 rounded-xl bg-[#12544F] text-white font-bold flex items-center gap-2 cursor-pointer hover:bg-[#0e433f]">
          <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Landing Settings'}
        </button>
      </div>
    </div>
  );
}

function SectionModal({ section, onClose, onSave, saving, upload }) {
  const [f, setF] = useState({ ...clone(section), settings: parse(section.settings) });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const file = async (e) => {
    const url = await upload(e.target.files?.[0]);
    if (url) setF(p => ({ ...p, settings: { ...parse(p.settings), image_url: url } }));
  };

  return (
    <Modal title={`${section.id ? 'Edit' : 'Add'} Section`} onClose={onClose}>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Section Key" value={f.section_key} onChange={v => set('section_key', v)} />
        <Field label="Section Type" value={f.section_type} onChange={v => set('section_type', v)} />
        <Field label="Title" value={f.title} onChange={v => set('title', v)} />
        <Field label="Subtitle" value={f.subtitle} onChange={v => set('subtitle', v)} />
        <Upload label="Section Image / Logo" value={f.settings?.image_url || ''} onChange={v => set('settings', { ...parse(f.settings), image_url: v })} onFile={file} />
        <div>
          <label className="block text-sm font-black text-slate-700 mb-1.5">Status</label>
          <select value={f.status || 'active'} onChange={e => set('status', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <TextArea label="Section Content" value={f.content_html} onChange={v => set('content_html', v)} rows={8} placeholder="Text/HTML content for custom section" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-3">
        <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-slate-100 font-bold cursor-pointer">
          Cancel
        </button>
        <button onClick={() => onSave({ ...f, settings: parse(f.settings) })} disabled={saving || !f.section_key} className="px-5 py-2.5 rounded-xl bg-[#12544F] text-white font-bold flex items-center gap-2 cursor-pointer hover:bg-[#0e433f]">
          <Save className="w-4 h-4" /> Save Section
        </button>
      </div>
    </Modal>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/50 p-4 overflow-y-auto">
      <div className="min-h-full flex items-start justify-center py-8">
        <div className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-2xl font-black text-[#092328]">{title}</h3>
            <button onClick={onClose} className="px-3 py-2 rounded-xl bg-slate-100 font-bold hover:bg-slate-200 cursor-pointer">
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, ...props }) {
  return (
    <div>
      <label className="block text-sm font-black text-slate-700 mb-1.5">{label}</label>
      <input
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        {...props}
        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#12544F] text-sm"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, ...props }) {
  return (
    <div>
      <label className="block text-sm font-black text-slate-700 mb-1.5">{label}</label>
      <textarea
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        {...props}
        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#12544F] text-sm resize-y"
      />
    </div>
  );
}

function Upload({ label, value, onChange, onFile }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-black text-slate-700">{label}</label>
      <div className="flex gap-2">
        <input
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm"
          placeholder="/uploads/brands/... or https://..."
        />
        <label className="cursor-pointer shrink-0 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-black flex items-center gap-1 hover:bg-slate-50">
          <UploadCloud className="w-4 h-4" /> Choose File
          <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif" className="hidden" onChange={onFile} />
        </label>
      </div>
      {value && (
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
          <img src={absUrl(value)} className="h-14 max-w-40 object-contain rounded" alt="preview" />
          <span className="text-sm text-slate-400 truncate flex-1">{value}</span>
        </div>
      )}
    </div>
  );
}

export default HomePageManager;
