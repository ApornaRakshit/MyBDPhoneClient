import{ useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { CmsHtml } from '../../components/cms/CmsHtml';
import {
  ArrowRight, CheckCircle2, PhoneCall, PhoneForwarded, PhoneIncoming,
  PhoneOutgoing, Headphones, ListTree, Clock3, Users, Route, Music2,
  Scale, CalendarClock, Video, Mic2, Shuffle, Radio
} from 'lucide-react';

const API_ROOT = String(import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
  .replace(/\/api\/?$/, '');

const mediaUrl = (value, fallback = '') => {
  if (!value) return fallback;
  if (/^(https?:\/\/|data:|blob:)/i.test(String(value))) return value;
  if (String(value).startsWith('/uploads/')) return `${API_ROOT}${value}`;
  return value;
};

const parse = (value, fallback = {}) => {
  if (!value) return fallback;
  if (typeof value === 'object') return value;
  try { return JSON.parse(value); } catch { return fallback; }
};

const iconMap = {
  PhoneCall, PhoneForwarded, PhoneIncoming, PhoneOutgoing, Headphones,
  ListTree, Clock3, Users, Route, Music2, Scale, CalendarClock,
  Video, Mic2, Shuffle, Radio,
};

function Icon({ name = 'PhoneCall', className = 'w-5 h-5' }) {
  const I = iconMap[name] || PhoneCall;
  return <I className={className} />;
}

function Button({ href = '/contact', children, secondary = false }) {
  const cls = secondary
    ? 'inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#12544F] border border-[#2A835F]/35 text-sm font-black hover:-translate-y-0.5 transition'
    : 'inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#12544F] text-white text-sm font-black shadow-sm hover:-translate-y-0.5 transition';
  if (/^https?:\/\//i.test(href)) {
    return <a href={href} target="_blank" rel="noreferrer" className={cls}>{children}<ArrowRight className="w-4 h-4" /></a>;
  }
  return <Link to={href} className={cls}>{children}<ArrowRight className="w-4 h-4" /></Link>;
}

function Heading({ section, dark = false, center = true }) {
  const s = parse(section.settings);
  const align = s.text_align || (center ? 'center' : 'left');
  const alignment = align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';
  return (
    <div className={`${alignment} max-w-3xl ${center ? 'mx-auto' : ''} mb-10`}>
      {s.eyebrow && (
        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[.14em] ${
          dark ? 'bg-white/10 text-emerald-100 border border-white/10' : 'bg-[#e8f4f1] text-[#2A835F]'
        }`}>
          {s.eyebrow}
        </span>
      )}
      <h2 className={`mt-3 text-3xl sm:text-4xl font-black tracking-tight ${dark ? 'text-white' : 'text-[#092328]'}`}>
        {section.title}
      </h2>
      {section.subtitle && (
        <p className={`mt-3 text-sm sm:text-base leading-7 ${dark ? 'text-emerald-50/80' : 'text-slate-500'}`}>
          {section.subtitle}
        </p>
      )}
    </div>
  );
}

function Hero({ section }) {
  const s = parse(section.settings);
  const badges = Array.isArray(s.badges)
    ? s.badges
    : String(s.badges || '').split('\n').map(x => x.trim()).filter(Boolean);
  const image = s.image_url || s.image || '';
  const textAlign = s.text_align || 'left';

  return (
    <section className="relative overflow-hidden bg-[#e8f8f2] border-b border-[#8BBB92]/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(42,131,95,.20),transparent_30%),linear-gradient(180deg,#effbf7,#dff5ec)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className={`grid lg:grid-cols-2 items-center gap-10 min-h-[500px] ${s.image_position === 'left' ? '' : ''}`}>
          <div className={textAlign === 'center' ? 'text-center' : textAlign === 'right' ? 'text-right' : 'text-left'}>
            {s.eyebrow && (
              <div className="inline-flex items-center gap-2 text-[10px] sm:text-sm font-black uppercase tracking-[.13em] text-[#176454]">
                <span className="w-8 h-[2px] bg-[#2A835F]" />{s.eyebrow}
              </div>
            )}
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[58px] leading-[1.04] font-black tracking-tight text-[#092328]">
              {section.title}
            </h1>
            {section.subtitle && <p className="mt-5 text-sm sm:text-base leading-7 text-slate-600 max-w-xl ml-auto mr-auto lg:ml-0">{section.subtitle}</p>}
            {section.content_html && <CmsHtml html={section.content_html} className="mt-5 prose prose-slate max-w-xl mx-auto lg:mx-0" />}
            <div className="mt-7 flex flex-wrap gap-3 justify-center lg:justify-start">
              <Button href={s.primary_url || '/contact'}>{s.primary_text || 'Contact Sales'}</Button>
              <Button href={s.secondary_url || '/packages'} secondary>{s.secondary_text || 'View Packages'}</Button>
            </div>
            {badges.length > 0 && (
              <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
                {badges.slice(0, 3).map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-[#12544F]" />
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 leading-tight">{b}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`flex items-center justify-center ${s.image_position === 'left' ? 'lg:order-first' : ''}`}>
            {image ? (
              <div className="relative w-full max-w-[560px]">
                <div className="absolute -inset-8 rounded-full bg-white/35 blur-3xl" />
                <img src={mediaUrl(image)} alt={section.title || 'Call Center'} className="relative w-full max-h-[440px] object-contain drop-shadow-[0_24px_35px_rgba(9,35,40,.14)]" />
              </div>
            ) : (
              <div className="w-full max-w-[520px] min-h-[320px] rounded-[2rem] bg-white/55 border border-white flex items-center justify-center">
                <Headphones className="w-28 h-28 text-[#2A835F]/50" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ImageText({ section }) {
  const s = parse(section.settings);
  const imagePosition = s.image_position || 'right';
  const textAlign = s.text_align || 'left';
  const imageAlign = s.image_align || 'center';
  const textCls = textAlign === 'center' ? 'text-center' : textAlign === 'right' ? 'text-right' : 'text-left';
  const imageCls = imageAlign === 'left' ? 'justify-start' : imageAlign === 'right' ? 'justify-end' : 'justify-center';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
      <div className={`grid lg:grid-cols-2 gap-8 items-center rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-10 shadow-sm ${imagePosition === 'left' ? '' : ''}`}>
        <div className={`${imagePosition === 'left' ? 'lg:order-1' : 'lg:order-2'} flex ${imageCls}`}>
          {s.image_url || s.image ? (
            <img src={mediaUrl(s.image_url || s.image)} alt={section.title || ''} className="w-full max-h-[390px] object-contain rounded-2xl" />
          ) : (
            <div className="w-full min-h-[260px] rounded-2xl bg-[#eef8f4] flex items-center justify-center">
              <PhoneCall className="w-24 h-24 text-[#2A835F]/45" />
            </div>
          )}
        </div>
        <div className={`${imagePosition === 'left' ? 'lg:order-2' : 'lg:order-1'} ${textCls}`}>
          {s.eyebrow && <div className="text-[10px] font-black uppercase tracking-[.14em] text-[#2A835F]">{s.eyebrow}</div>}
          {section.title && <h2 className="mt-2 text-3xl sm:text-4xl font-black text-[#092328]">{section.title}</h2>}
          {section.subtitle && <p className="mt-4 text-slate-600 leading-7">{section.subtitle}</p>}
          {section.content_html && <CmsHtml html={section.content_html} className="mt-5 prose prose-slate max-w-none" />}
          {s.primary_url && (
            <div className={`mt-6 flex gap-3 ${textAlign === 'right' ? 'justify-end' : textAlign === 'center' ? 'justify-center' : 'justify-start'}`}>
              <Button href={s.primary_url}>{s.primary_text || 'Learn More'}</Button>
              {s.secondary_url && <Button href={s.secondary_url} secondary>{s.secondary_text || 'Contact Sales'}</Button>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FeatureGrid({ section, items }) {
  const s = parse(section.settings);
  const columns = Number(s.columns) || 3;
  const grid = columns === 2
    ? 'grid sm:grid-cols-2 gap-5'
    : columns === 4
      ? 'grid sm:grid-cols-2 lg:grid-cols-4 gap-5'
      : 'grid sm:grid-cols-2 lg:grid-cols-3 gap-5';
  const align = s.text_align || 'center';
  const textCls = align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
      <Heading section={section} />
      {items.length ? (
        <div className={grid}>
          {items.map((item, i) => {
            const p = parse(item.payload);
            return (
              <article key={item.id || i} className={`group rounded-[1.6rem] border border-slate-200 bg-white p-6 sm:p-7 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition ${textCls}`}>
                <div className={`flex ${align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center'}`}>
                  {item.image_url ? (
                    <div className="w-16 h-16 rounded-2xl bg-[#eaf4f1] overflow-hidden flex items-center justify-center">
                      <img src={mediaUrl(item.image_url)} alt={item.title || ''} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-[#eaf4f1] text-[#12544F] flex items-center justify-center">
                      <Icon name={item.icon || p.icon || 'PhoneCall'} className="w-7 h-7" />
                    </div>
                  )}
                </div>
                <h3 className="mt-5 text-lg font-black text-[#092328]">{item.title}</h3>
                {item.description && <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>}
                {item.content_html && <CmsHtml html={item.content_html} className="mt-3 prose prose-slate prose-sm max-w-none" />}
                {p.badge && <div className="mt-4 text-[10px] font-black uppercase tracking-wider text-[#2A835F]">{p.badge}</div>}
              </article>
            );
          })}
        </div>
      ) : <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">No active Call Center features have been added yet.</div>}
    </section>
  );
}

function RichText({ section }) {
  const s = parse(section.settings);
  const align = s.text_align || 'left';
  const cls = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-10 shadow-sm">
        <Heading section={section} center={false} />
        {section.content_html && <CmsHtml html={section.content_html} className={`prose prose-slate max-w-none ${cls}`} />}
      </div>
    </section>
  );
}

function Consultation({ section }) {
  const s = parse(section.settings);
  const phone = s.phone || '096490123756';
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
      <div className="rounded-[2rem] bg-[#0d4d4a] p-7 sm:p-10 text-white relative overflow-hidden">
        <div className="absolute -right-20 -top-28 w-72 h-72 rounded-full bg-white/10" />
        <Heading section={section} dark />
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href={`tel:${phone}`} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#0d4d4a] text-sm font-black">
            <PhoneCall className="w-4 h-4" /> {s.button_text || 'Call Us'} · {phone}
          </a>
          <Button href={s.chat_url || '/contact'} secondary>{s.chat_text || 'Start Live Chat'}</Button>
        </div>
        {s.hours && <div className="relative z-10 text-center text-sm text-emerald-100 mt-4">Available: {s.hours}</div>}
      </div>
    </section>
  );
}

function Cta({ section }) {
  const s = parse(section.settings);
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
      <div className="relative overflow-hidden rounded-[2rem] border border-[#8BBB92]/40 bg-[#eaf8f3] p-7 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="absolute -right-20 -bottom-28 w-72 h-72 rounded-full bg-[#9ee2cb]/35" />
        <div className="relative">
          <h2 className="text-3xl sm:text-4xl font-black text-[#092328]">{section.title}</h2>
          {section.subtitle && <p className="mt-2 text-sm sm:text-base text-slate-600">{section.subtitle}</p>}
        </div>
        <div className="relative flex flex-col sm:flex-row gap-3">
          <Button href={s.primary_url || '/contact'}>{s.primary_text || 'Contact Sales'}</Button>
          <Button href={s.secondary_url || '/packages'} secondary>{s.secondary_text || 'View Packages'}</Button>
        </div>
      </div>
    </section>
  );
}

function CallCenterRenderer({ section, collections }) {
  if (section.status !== 'active') return null;
  const s = parse(section.settings);
  const key = s.collection_key;
  const items = key ? (collections[key] || []) : [];
  switch (section.section_type) {
    case 'hero': return <Hero key={section.id} section={section} />;
    case 'image_text': return <ImageText key={section.id} section={section} />;
    case 'feature_grid': return <FeatureGrid key={section.id} section={section} items={items} />;
    case 'consultation': return <Consultation key={section.id} section={section} />;
    case 'cta': return <Cta key={section.id} section={section} />;
    case 'rich_text':
    default: return <RichText key={section.id} section={section} />;
  }
}

export const CallCenter = () => {
  const [data, setData] = useState(null);
  const [mode, setMode] = useState('loading');

  useEffect(() => {
    let live = true;
    API.get('/cms/public/page/call-center')
      .then((res) => {
        if (!live) return;
        setData(res.data || {});
        setMode('ready');
      })
      .catch((err) => {
        if (!live) return;
        setMode(err.response?.status === 410 ? 'inactive' : 'error');
      });
    return () => { live = false; };
  }, []);

  if (mode === 'loading') return <div className="min-h-[55vh] flex items-center justify-center text-slate-500">Loading Call Center…</div>;
  if (mode === 'inactive') return <div className="min-h-[55vh] flex items-center justify-center text-slate-500">This Call Center page is currently inactive.</div>;
  if (mode === 'error' || !data?.page) return <div className="min-h-[55vh] flex items-center justify-center text-slate-500">Call Center page is not published yet.</div>;

  const sections = (data.sections || []).slice().sort(
    (a, b) => Number(a.sort_order) - Number(b.sort_order) || Number(a.id) - Number(b.id)
  );
  const collections = data.collections || {};

  return (
    <main className="w-full overflow-x-hidden bg-[#f7fafb] pb-8">
      {sections.length
        ? sections.map(section => <CallCenterRenderer key={section.id} section={section} collections={collections} />)
        : <RichText section={{ title: data.page.title, subtitle: data.page.seo_description, content_html: data.page.content_html, settings: {} }} />}
    </main>
  );
};

export default CallCenter;
