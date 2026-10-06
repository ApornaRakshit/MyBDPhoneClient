import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import API from '../../services/api';
import { CmsHtml } from '../../components/cms/CmsHtml';
import {
  Activity,
  ArrowRight,
  AudioWaveform,
  BadgePercent,
  BarChart3,
  BellRing,
  Bot,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  CheckCircle,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Cpu,
  Database,
  FileAudio,
  FileSpreadsheet,
  Filter,
  Gauge,
  Globe2,
  Headphones,
  History,
  Home,
  Layers,
  ListChecks,
  ListTree,
  Megaphone,
  PackageCheck,
  PhoneCall,
  PhoneForwarded,
  PhoneIncoming,
  PhoneOutgoing,
  Play,
  PlugZap,
  Radio,
  ReceiptText,
  Repeat,
  Route,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sliders,
  Smartphone,
  Sparkles,
  Store,
  Target,
  TrendingUp,
  UserRoundCheck,
  Users,
  Wifi,
  Workflow,
  Zap,
} from 'lucide-react';

const API_ROOT = String(import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
  .replace(/\/api\/?$/, '');

const mediaUrl = (value, fallback = '') => {
  if (!value) return fallback;
  if (/^(https?:\/\/|data:|blob:)/i.test(String(value))) return String(value);
  if (String(value).startsWith('/uploads/')) return `${API_ROOT}${value}`;
  return String(value);
};

const parse = (value, fallback = {}) => {
  if (!value) return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const iconMap = {
  Activity,
  AudioWaveform,
  BadgePercent,
  BarChart3,
  BellRing,
  Bot,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  CheckCircle,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Cpu,
  Database,
  FileAudio,
  FileSpreadsheet,
  Filter,
  Gauge,
  Globe2,
  Headphones,
  History,
  Home,
  Layers,
  ListChecks,
  ListTree,
  Megaphone,
  PackageCheck,
  PhoneCall,
  PhoneForwarded,
  PhoneIncoming,
  PhoneOutgoing,
  Play,
  PlugZap,
  Radio,
  ReceiptText,
  Repeat,
  Route,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sliders,
  Smartphone,
  Sparkles,
  Store,
  Target,
  TrendingUp,
  UserRoundCheck,
  Users,
  Wifi,
  Workflow,
  Zap,
};

function Icon({ name = 'PhoneCall', className = 'w-6 h-6' }) {
  const Comp = iconMap[name] || PhoneCall;
  return <Comp className={className} />;
}

function Button({ href = '/contact', children, secondary = false }) {
  const cls = secondary
    ? 'inline-flex items-center justify-center gap-2 rounded-xl border border-[#2A835F]/35 bg-white px-5 py-3 text-sm font-black text-[#12544F] transition hover:-translate-y-0.5 hover:shadow-md'
    : 'inline-flex items-center justify-center gap-2 rounded-xl bg-[#12544F] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#092328]';
  if (/^https?:\/\//i.test(href)) {
    return <a className={cls} href={href} target="_blank" rel="noreferrer">{children}<ArrowRight className="h-4 w-4" /></a>;
  }
  return <Link className={cls} to={href}>{children}<ArrowRight className="h-4 w-4" /></Link>;
}

function SectionHeading({ section, dark = false }) {
  const s = parse(section.settings);
  const align = s.text_align || 'center';
  const textCls = align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';
  return (
    <div className={`${textCls} max-w-3xl ${align === 'center' ? 'mx-auto' : ''} mb-9`}>
      {s.eyebrow && (
        <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[.14em] ${
          dark
            ? 'border-white/10 bg-white/10 text-emerald-100'
            : 'border-[#8BBB92]/30 bg-[#eaf5f1] text-[#2A835F]'
        }`}>
          {s.eyebrow}
        </span>
      )}
      <h2 className={`mt-3 text-3xl font-black tracking-tight sm:text-4xl ${dark ? 'text-white' : 'text-[#092328]'}`}>
        {section.title}
      </h2>
      {section.subtitle && (
        <p className={`mt-3 text-sm leading-7 sm:text-base ${dark ? 'text-emerald-50/80' : 'text-slate-500'}`}>
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
    : String(s.badges || '').split('\n').map((x) => x.trim()).filter(Boolean);
  const image = s.image_url || s.image || '';
  const textAlign = s.text_align || 'left';

  return (
    <section className="relative overflow-hidden border-b border-[#8BBB92]/30 bg-[#e8f8f2]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(42,131,95,.18),transparent_30%),linear-gradient(180deg,#effbf7,#e4f5ef)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:px-8 lg:py-20">
        <div className={textAlign === 'center' ? 'text-center' : textAlign === 'right' ? 'text-right' : 'text-left'}>
          {s.eyebrow && (
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[.14em] text-[#176454] sm:text-sm">
              <span className="h-[2px] w-8 bg-[#2A835F]" />
              {s.eyebrow}
            </div>
          )}
          <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight text-[#092328] sm:text-5xl lg:text-[58px]">
            {section.title}
          </h1>
          {section.subtitle && (
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base lg:mx-0">
              {section.subtitle}
            </p>
          )}
          {section.content_html && (
            <CmsHtml html={section.content_html} className="prose prose-slate mt-5 max-w-xl" />
          )}
          <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Button href={s.primary_url || '/contact'}>{s.primary_text || 'Contact Sales'}</Button>
            {s.secondary_text && (
              <Button href={s.secondary_url || '/contact'} secondary>{s.secondary_text}</Button>
            )}
          </div>
          {badges.length > 0 && (
            <div className="mt-7 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              {badges.slice(0, 3).map((badge, i) => (
                <div key={`${badge}-${i}`} className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/60 p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#12544F]/10">
                    <CheckCircle2 className="h-4 w-4 text-[#12544F]" />
                  </span>
                  <span className="text-[10px] font-bold leading-tight text-slate-600">{badge}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`flex justify-center ${s.image_position === 'left' ? 'lg:order-first' : ''}`}>
          <div className="relative flex min-h-[300px] w-full max-w-[560px] items-center justify-center rounded-[2rem] bg-white/50 p-8 shadow-sm ring-1 ring-white/80">
            <div className="absolute -inset-10 rounded-full bg-white/40 blur-3xl" />
            {image ? (
              <img
                src={mediaUrl(image)}
                alt={section.title || 'MyBDPhone'}
                className="relative max-h-[390px] w-full object-contain drop-shadow-[0_24px_30px_rgba(9,35,40,.12)]"
              />
            ) : (
              <PhoneCall className="relative h-28 w-28 text-[#2A835F]/45" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureGrid({ section, items }) {
  const s = parse(section.settings);
  const columns = Number(s.columns) || 4;
  const grid = columns === 2
    ? 'grid gap-5 sm:grid-cols-2'
    : columns === 3
      ? 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid gap-5 sm:grid-cols-2 lg:grid-cols-4';
  const align = s.text_align || 'center';
  const textCls = align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';
  return (
    <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
      <SectionHeading section={section} />
      <div className={grid}>
        {items.map((item, index) => {
          const p = parse(item.payload);
          return (
            <article key={item.id || index} className={`group rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#8BBB92]/60 hover:shadow-lg ${textCls}`}>
              <div className={`flex ${align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center'}`}>
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-[#e8f5f0] text-[#12544F]">
                  {item.image_url ? <img src={mediaUrl(item.image_url)} alt={item.title} className="h-full w-full object-contain p-2" /> : <Icon name={item.icon || p.icon} />}
                </div>
              </div>
              <h3 className="mt-5 text-lg font-black text-[#092328]">{item.title}</h3>
              {item.description && <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>}
              {p.badge && <div className="mt-4 text-[10px] font-black uppercase tracking-[.12em] text-[#2A835F]">{p.badge}</div>}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ImageText({ section }) {
  const s = parse(section.settings);
  const imagePosition = s.image_position || 'right';
  const textAlign = s.text_align || 'left';
  const textCls = textAlign === 'center' ? 'text-center' : textAlign === 'right' ? 'text-right' : 'text-left';
  const image = s.image_url || s.image || '';
  return (
    <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
      <div className="grid items-center gap-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-10 lg:grid-cols-2">
        <div className={imagePosition === 'left' ? 'lg:order-1' : 'lg:order-2'}>
          <div className="flex min-h-[260px] items-center justify-center rounded-[1.5rem] bg-[#eef8f4] p-7">
            {image ? (
              <img src={mediaUrl(image)} alt={section.title || 'MyBDPhone'} className="max-h-[330px] w-full object-contain" />
            ) : <PhoneCall className="h-24 w-24 text-[#2A835F]/40" />}
          </div>
        </div>
        <div className={`${imagePosition === 'left' ? 'lg:order-2' : 'lg:order-1'} ${textCls}`}>
          {s.eyebrow && <div className="text-[10px] font-black uppercase tracking-[.14em] text-[#2A835F]">{s.eyebrow}</div>}
          <h2 className="mt-2 text-3xl font-black text-[#092328] sm:text-4xl">{section.title}</h2>
          {section.subtitle && <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">{section.subtitle}</p>}
          {section.content_html && <CmsHtml html={section.content_html} className="prose prose-slate mt-5 max-w-none" />}
          {s.primary_url && (
            <div className={`mt-6 flex flex-wrap gap-3 ${textAlign === 'right' ? 'justify-end' : textAlign === 'center' ? 'justify-center' : 'justify-start'}`}>
              <Button href={s.primary_url}>{s.primary_text || 'Learn More'}</Button>
              {s.secondary_url && <Button href={s.secondary_url} secondary>{s.secondary_text || 'Contact Sales'}</Button>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Steps({ section, items }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
      <SectionHeading section={section} />
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item, index) => {
          const p = parse(item.payload);
          const number = p.number || item.meta || String(index + 1).padStart(2, '0');
          return (
            <article key={item.id || index} className="relative rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-[#2A835F]/25">{number}</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf5f1] text-[#12544F]">
                  <Icon name={item.icon || 'Layers'} className="h-5 w-5" />
                </div>
              </div>
              <h3 className="mt-5 text-lg font-black text-[#092328]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function UseCases({ section, items }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
      <SectionHeading section={section} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <article key={item.id || index} className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-5 transition hover:bg-white hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#12544F] shadow-sm">
              <Icon name={item.icon || 'Building2'} />
            </div>
            <h3 className="text-base font-black text-[#092328]">{item.title}</h3>
            {item.description && <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}

function Pricing({ section, packages }) {
  if (!packages.length) return null;
  const gridCls = packages.length >= 3 ? 'md:grid-cols-2 lg:grid-cols-3' : packages.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1';
  return (
    <section className="mx-auto max-w-5xl px-4 pt-16 sm:px-6 lg:px-8">
      <SectionHeading section={section} />
      <div className={`grid gap-6 ${gridCls}`}>
        {packages.map((pkg) => {
          const p = parse(pkg.payload);
          const name = pkg.name || pkg.title || '';
          const desc = pkg.description || p.description || '';
          const price = pkg.price ?? p.price ?? 0;
          const billingPeriod = pkg.billing_period || p.billing || p.billing_period || 'month';
          const rawFeatures = pkg.features || p.features || [];
          const features = Array.isArray(rawFeatures) ? rawFeatures : parse(rawFeatures, []);
          const popular = Boolean(pkg.is_recommended || p.popular || p.is_recommended);
          const badgeText = pkg.badge_text || p.badge_text || '';
          return (
            <article key={pkg.id} className={`relative rounded-[1.75rem] p-7 shadow-sm ${popular ? 'bg-[#092328] text-white ring-2 ring-[#2A835F]' : 'border border-slate-200 bg-white text-slate-800'}`}>
              {badgeText && (
                <span className="absolute right-6 top-5 rounded-full bg-[#2A835F] px-3 py-1 text-[10px] font-black uppercase text-white">{badgeText}</span>
              )}
              <h3 className={`text-2xl font-black ${popular ? 'text-white' : 'text-[#092328]'}`}>{name}</h3>
              <p className={`mt-2 text-sm leading-6 ${popular ? 'text-slate-300' : 'text-slate-500'}`}>{desc}</p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-4xl font-black text-[#8BBB92]">৳{Number(price || 0).toLocaleString()}</span>
                <span className={`pb-1 text-sm ${popular ? 'text-slate-300' : 'text-slate-500'}`}>/{billingPeriod}</span>
              </div>
              <div className={`mt-6 space-y-2.5 border-t pt-5 ${popular ? 'border-white/10' : 'border-slate-100'}`}>
                {features.slice(0, 8).map((feature, i) => (
                  <div key={`${feature}-${i}`} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8BBB92]" />
                    <span className={popular ? 'text-slate-200' : 'text-slate-700'}>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="mt-7">
                <Button href={p.button_url || '/packages'}>{p.button_text || `Choose ${name}`}</Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function FAQ({ section, items }) {
  return (
    <section className="mx-auto max-w-4xl px-4 pt-16 sm:px-6 lg:px-8">
      <SectionHeading section={section} />
      <div className="space-y-3">
        {items.map((item, index) => (
          <details key={item.id || index} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <summary className="cursor-pointer list-none pr-8 text-base font-black text-[#092328]">
              {item.title}
            </summary>
            <div className="mt-3 text-sm leading-7 text-slate-500">
              {item.description || parse(item.payload).answer || ''}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function Cta({ section }) {
  const s = parse(section.settings);
  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#0d4d4a] p-7 sm:p-10">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10" />
        <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="text-[10px] font-black uppercase tracking-[.14em] text-emerald-100/70">MYBDPHONE</div>
            <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">{section.title}</h2>
            {section.subtitle && <p className="mt-3 text-sm leading-7 text-emerald-50/80 sm:text-base">{section.subtitle}</p>}
          </div>
          <div className="relative flex flex-wrap gap-3">
            <Button href={s.primary_url || '/contact'}>{s.primary_text || 'Get Started'}</Button>
            {s.secondary_text && <Button href={s.secondary_url || '/contact'} secondary>{s.secondary_text}</Button>}
          </div>
        </div>
      </div>
    </section>
  );
}

function StandardFallback({ page }) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {page.content_html ? (
        <CmsHtml html={page.content_html} className="prose prose-slate max-w-none" />
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          This landing page has no active sections yet.
        </div>
      )}
    </section>
  );
}

function ProductRenderer({ section, collections, packages }) {
  if (section.status !== 'active') return null;
  const settings = parse(section.settings);
  const items = settings.collection_key ? (collections[settings.collection_key] || []) : [];
  switch (section.section_type) {
    case 'hero':
      return <Hero section={section} />;
    case 'feature_grid':
      return <FeatureGrid section={section} items={items} />;
    case 'image_text':
      return <ImageText section={section} />;
    case 'steps':
      return <Steps section={section} items={items} />;
    case 'use_cases':
      return <UseCases section={section} items={items} />;
    case 'pricing':
      return settings.package_service_type ? <Pricing section={section} packages={packages} /> : <Pricing section={section} packages={items} />;
    case 'faq':
      return <FAQ section={section} items={items} />;
    case 'cta':
      return <Cta section={section} />;
    case 'rich_text':
    default:
      return section.content_html ? (
        <section className="mx-auto max-w-5xl px-4 pt-16 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <SectionHeading section={section} />
            <CmsHtml html={section.content_html} className="prose prose-slate max-w-none" />
          </div>
        </section>
      ) : null;
  }
}

export const ProductLanding = ({ slug: slugProp } = {}) => {
  const params = useParams();
  const location = useLocation();

  // Derive slug: prefer explicit prop > route param > last segment of the pathname
  const slug = slugProp || params.slug || location.pathname.replace(/^\/+|\/+$/g, '').split('/').pop() || '';
  const [data, setData] = useState(null);
  const [packages, setPackages] = useState([]);
  const [mode, setMode] = useState('loading');

  useEffect(() => {
    let live = true;
    setMode('loading');
    API.get(`/cms/public/page/${encodeURIComponent(slug || '')}`)
      .then(async (res) => {
        if (!live) return;
        setData(res.data || {});
        setMode('ready');

        const sections = res.data?.sections || [];
        const needsPackages = sections.some((section) => parse(section.settings).package_service_type);
        if (needsPackages) {
          const serviceType = sections.map((section) => parse(section.settings).package_service_type).find(Boolean);
          try {
            const packageRes = await API.get(`/packages?service_type=${encodeURIComponent(serviceType)}`);
            if (live && packageRes.data?.success) setPackages(packageRes.data.packages || []);
          } catch {
            if (live) setPackages([]);
          }
        }
      })
      .catch((error) => {
        if (!live) return;
        setMode(error.response?.status === 410 ? 'inactive' : 'error');
      });
    return () => { live = false; };
  }, [slug]);

  const sections = useMemo(
    () => (data?.sections || []).slice().sort((a, b) => Number(a.sort_order) - Number(b.sort_order) || Number(a.id) - Number(b.id)),
    [data]
  );

  if (mode === 'loading') {
    return <div className="min-h-[55vh] bg-[#f7fafb] px-4 py-24 text-center text-slate-500">Loading MyBDPhone...</div>;
  }
  if (mode === 'inactive') {
    return <div className="min-h-[55vh] bg-[#f7fafb] px-4 py-24 text-center text-slate-500">This page is currently inactive.</div>;
  }
  if (mode === 'error' || !data?.page) {
    return <div className="min-h-[55vh] bg-[#f7fafb] px-4 py-24 text-center text-slate-500">This page is not published yet.</div>;
  }

  return (
    <main className="w-full overflow-x-hidden bg-[#f7fafb] pb-4">
      {sections.length
        ? sections.map((section) => (
            <ProductRenderer
              key={section.id}
              section={section}
              collections={data.collections || {}}
              packages={packages}
            />
          ))
        : <StandardFallback page={data.page} />}
    </main>
  );
};

export default ProductLanding;
