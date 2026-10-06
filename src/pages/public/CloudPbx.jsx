import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeftRight,
  BadgeCheck,
  CheckCircle2,
  Database,
  FileAudio,
  FileText,
  GitBranch,
  Headphones,
  Image as ImageIcon,
  IdCard,
  LayoutDashboard,
  LifeBuoy,
  MonitorCheck,
  MousePointerClick,
  Network,
  Phone,
  PhoneCall,
  PhoneForwarded,
  Radio,
  Route,
  Server,
  ShieldCheck,
  Users,
  Voicemail,
} from 'lucide-react';
import API from '../../services/api';
import { CmsHtml } from '../../components/cms/CmsHtml';
import cloudPbxIcon from '../../assets/cloud-pbx-icon.png';

const API_ROOT = String(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
const mediaUrl = (value, fallback = '') => {
  if (!value) return fallback;
  if (/^(https?:\/\/|data:|blob:)/i.test(value)) return value;
  if (value.startsWith('/uploads/')) return `${API_ROOT}${value}`;
  return value;
};
const parse = (value, fallback = {}) => {
  if (!value) return fallback;
  if (typeof value === 'object') return value;
  try { return JSON.parse(value); } catch { return fallback; }
};

const ICONS = {
  ArrowLeftRight, BadgeCheck, Database, FileAudio, FileText, GitBranch, Headphones,
  Image: ImageIcon, IdCard, LayoutDashboard, LifeBuoy, MonitorCheck, MousePointerClick,
  Network, Phone, PhoneCall, PhoneForwarded, Radio, Route, Server, ShieldCheck, Users, Voicemail,
};
const iconFor = (name, fallback = ShieldCheck) => ICONS[name] || fallback;

const defaults = {
  hero: { eyebrow: 'CLOUD BUSINESS TELEPHONY', primary_text: 'View Packages', primary_url: '/packages', secondary_text: 'Contact Sales', secondary_url: '/contact', badges: ['096 IP number', 'Flexible extensions', 'Hosted PBX'] },
};

const FALLBACK_SECTIONS = [
  { id: 'fallback-hero', section_key: 'hero', section_type: 'hero', title: 'Cloud PBX for Modern Business', subtitle: 'Connect your teams with a scalable hosted phone system.', sort_order: 1, status: 'active', settings: { ...defaults.hero, image_url: '/assets/cloud-pbx-icon.png' } },
  { id: 'fallback-pricing', section_key: 'pricing', section_type: 'pricing', title: 'Cloud PBX Packages', subtitle: 'Choose a plan based on extensions, IVR and concurrent call needs.', sort_order: 2, status: 'active', settings: { collection_key: 'cloud_pbx_packages' } },
  { id: 'fallback-comparison', section_key: 'comparison', section_type: 'comparison', title: 'PBX Package Comparison', subtitle: 'Compare included calling capacity and controls at a glance.', sort_order: 3, status: 'active', settings: { collection_key: 'cloud_pbx_packages' } },
  { id: 'fallback-overview', section_key: 'overview', section_type: 'image_text', title: 'Cloud PBX for Your Business', subtitle: 'A flexible hosted phone system for professional customer communication.', sort_order: 4, status: 'active', settings: { image_url: '/assets/cloud-pbx-icon.png', image_position: 'left', eyebrow: 'CLOUD PBX' }, content_html: '<p>Cloud PBX centralizes business calling through a hosted phone system with flexible extensions, routing, IVR, conferencing and recording.</p>' },
  { id: 'fallback-features', section_key: 'features', section_type: 'feature_grid', title: 'Features & Benefits of Cloud PBX', subtitle: 'Professional call controls that help teams answer, route and manage conversations.', sort_order: 5, status: 'active', settings: { collection_key: 'cloud_pbx_features', columns: 3 } },
  { id: 'fallback-benefits', section_key: 'benefits', section_type: 'benefits', title: 'Why Choose MyBDPhone Cloud PBX', subtitle: 'Built for secure, dependable and easy-to-manage business telephony.', sort_order: 6, status: 'active', settings: { collection_key: 'cloud_pbx_benefits', columns: 3 } },
  { id: 'fallback-consultation', section_key: 'consultation', section_type: 'consultation', title: 'Get a Free Consultation', subtitle: 'Talk to our team about the right Cloud PBX setup for your business.', sort_order: 7, status: 'active', settings: { phone: '096490123756', hours: '9:00 AM – 9:00 PM', chat_url: '/contact', chat_text: 'Start Live Chat', button_text: 'Call Us' } },
  { id: 'fallback-documents', section_key: 'documents', section_type: 'documents', title: 'Required Documents to Purchase PBX Package', subtitle: 'Keep these documents ready for onboarding.', sort_order: 8, status: 'active', settings: { collection_key: 'cloud_pbx_documents', columns: 3 } },
  { id: 'fallback-clients', section_key: 'clients', section_type: 'clients', title: 'Clients We Have Helped with PBX', subtitle: 'Teams across Bangladesh can manage their business calls from one platform.', sort_order: 9, status: 'active', settings: { collection_key: 'cloud_pbx_clients', columns: 6 } },
  { id: 'fallback-faq', section_key: 'faq', section_type: 'faq', title: 'Frequently Asked Questions', subtitle: 'Common questions about hosted Cloud PBX.', sort_order: 10, status: 'active', settings: { collection_key: 'cloud_pbx_faq' } },
  { id: 'fallback-cta', section_key: 'cta', section_type: 'cta', title: 'Ready to Upgrade Your Business Telephony?', subtitle: 'Get help selecting a Cloud PBX package or request a tailored setup.', sort_order: 11, status: 'active', settings: { primary_text: 'Explore Packages', primary_url: '/packages', secondary_text: 'Talk to Sales', secondary_url: '/contact' } },
];

const FALLBACK_COLLECTIONS = {
  cloud_pbx_packages: [
    { id: 'p1', title: 'Starter', description: 'Hosted Cloud PBX for small teams with essential call handling tools.', meta: '৳995 / month', payload: { price: 995, billing: 'Per Month', features: ['1 Free IP Number', '5 Extensions', '2 Call Channels', '1 IVR', 'No Call Monitoring', 'Call charge: ৳0.50 / minute'], button_text: 'Purchase Now', button_url: '/packages' } },
    { id: 'p2', title: 'Business', description: 'Cloud PBX capacity for growing teams and multi-agent calling.', meta: '৳1,495 / month', payload: { price: 1495, billing: 'Per Month', popular: true, features: ['1 Free IP Number', '10 Extensions', '4 Call Channels', '2 IVR', 'No Call Monitoring', 'Call charge: ৳0.45 / minute'], button_text: 'Purchase Now', button_url: '/packages' } },
    { id: 'p3', title: 'Corporate', description: 'Advanced PBX controls for established support, sales and operations teams.', meta: '৳2,995 / month', payload: { price: 2995, billing: 'Per Month', features: ['1 Free IP Number', '30 Extensions', '6 Call Channels', '10 IVR', 'Call Monitoring', 'Call charge: ৳0.45 / minute'], button_text: 'Purchase Now', button_url: '/packages' } },
    { id: 'p4', title: 'Enterprise', description: 'High-capacity Cloud PBX for larger organizations with distributed teams.', meta: '৳4,995 / month', payload: { price: 4995, billing: 'Per Month', features: ['1 Free IP Number', '200 Extensions', '10 Call Channels', 'Unlimited IVR', 'Call Monitoring', 'Call charge: ৳0.40 / minute'], button_text: 'Purchase Now', button_url: '/packages' } },
  ],
  cloud_pbx_features: [
    { id: 'f1', title: 'Virtual Receptionist', description: 'Automate greetings and guide callers to the right team.', icon: 'Headphones' },
    { id: 'f2', title: 'Call Forwarding', description: 'Forward calls to another extension, mobile or home phone.', icon: 'PhoneForwarded' },
    { id: 'f3', title: 'Smart Call Routing', description: 'Route calls by extension, schedule or business rule.', icon: 'Route' },
    { id: 'f4', title: 'Call Conferencing', description: 'Bring multiple team members into one voice conversation.', icon: 'Users' },
    { id: 'f5', title: 'Call Transferring', description: 'Transfer live calls between agents or departments.', icon: 'ArrowLeftRight' },
    { id: 'f6', title: 'Voice Messages', description: 'Let callers leave messages after hours.', icon: 'Voicemail' },
    { id: 'f7', title: 'Multiple IVR', description: 'Run multiple IVR trees for departments and schedules.', icon: 'GitBranch' },
    { id: 'f8', title: 'Call Recording', description: 'Record business calls for quality and review.', icon: 'FileAudio' },
    { id: 'f9', title: 'CRM Support', description: 'Connect calling with CRM workflows.', icon: 'Database' },
  ],
  cloud_pbx_benefits: [
    { id: 'b1', title: 'Secure & Fast', description: 'Designed for dependable business calling.', icon: 'ShieldCheck' },
    { id: 'b2', title: 'Dedicated Infrastructure', description: 'Hosted infrastructure for predictable performance.', icon: 'Server' },
    { id: 'b3', title: 'Reliable', description: 'Built for day-to-day customer communication.', icon: 'BadgeCheck' },
    { id: 'b4', title: 'Easy to Use', description: 'Access PBX features over the internet.', icon: 'MousePointerClick' },
    { id: 'b5', title: 'Single Dashboard', description: 'Manage PBX operations from one control surface.', icon: 'LayoutDashboard' },
    { id: 'b6', title: 'Expert Technical Support', description: 'Get help with SIP and PBX configuration.', icon: 'LifeBuoy' },
  ],
  cloud_pbx_documents: [
    { id: 'd1', title: 'NID Card Copy', description: 'Clear copies of both sides of the national identity card.', icon: 'IdCard' },
    { id: 'd2', title: 'Passport Size Photo', description: 'A recent passport-size photograph.', icon: 'Image' },
    { id: 'd3', title: 'Trade License Copy', description: 'Company trade license copy, when applicable.', icon: 'FileText' },
  ],
  cloud_pbx_clients: [
    { id: 'c1', title: 'Banglalink', image_url: '/assets/brands/banglalink.webp' },
    { id: 'c2', title: 'bKash', image_url: '/assets/brands/bkash.png' },
    { id: 'c3', title: 'Nagad', image_url: '/assets/brands/nagad.webp' },
    { id: 'c4', title: 'JTI', image_url: '/assets/brands/jti.png' },
    { id: 'c5', title: 'BDJobs', image_url: '/assets/brands/bdjobs.jpg' },
    { id: 'c6', title: 'Fingerprint Tech', image_url: '/assets/brands/fingerprinttech.jpg' },
  ],
  cloud_pbx_faq: [
    { id: 'q1', title: 'What is a PBX phone system?', description: 'PBX is a private business telephone system that lets teams share external lines while using internal extensions and call controls.' },
    { id: 'q2', title: 'What is a hosted Cloud PBX?', description: 'A hosted Cloud PBX is operated by the service provider, so the business can use PBX capabilities without maintaining on-premise PBX hardware.' },
    { id: 'q3', title: 'How much does Cloud PBX cost?', description: 'Pricing depends on extensions, call channels, IVR requirements and other configuration choices.' },
    { id: 'q4', title: 'Why does a business need PBX?', description: 'PBX centralizes business calling with extensions, routing, IVR, conferencing, recording and monitoring.' },
    { id: 'q5', title: 'Can the same number receive multiple calls?', description: 'Yes. Concurrent call capacity depends on the selected package and configured call channels.' },
  ],
};


function SectionHeading({ eyebrow = 'MYBDPHONE CLOUD PBX', title, subtitle, dark = false }) {
  return (
    <div className="max-w-3xl mx-auto text-center mb-10">
      {eyebrow && <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[.14em] ${dark ? 'bg-white/10 text-emerald-200 border border-white/10' : 'bg-[#e8f4f1] text-[#2A835F]'}`}>{eyebrow}</span>}
      <h2 className={`mt-3 text-3xl sm:text-4xl font-black tracking-tight ${dark ? 'text-white' : 'text-[#092328]'}`}>{title}</h2>
      {subtitle && <p className={`mt-3 text-sm sm:text-base leading-7 ${dark ? 'text-slate-200' : 'text-slate-500'}`}>{subtitle}</p>}
    </div>
  );
}

function PublicButton({ href = '#', children, primary = true }) {
  const cls = primary
    ? 'px-6 py-3.5 rounded-xl bg-[#12544F] text-white text-sm font-black shadow-sm hover:-translate-y-0.5 transition'
    : 'px-6 py-3.5 rounded-xl bg-white text-[#12544F] border border-[#2A835F]/40 text-sm font-black hover:-translate-y-0.5 transition';
  if (/^https?:\/\//i.test(href)) return <a href={href} target="_blank" rel="noreferrer" className={cls}>{children}<ArrowRight className="inline w-4 h-4 ml-1" /></a>;
  return <Link to={href} className={cls}>{children}<ArrowRight className="inline w-4 h-4 ml-1" /></Link>;
}

function HeroSection({ section }) {
  const s = parse(section.settings, defaults.hero);
  const badges = Array.isArray(s.badges) ? s.badges : String(s.badges || '').split('\n').map(x => x.trim()).filter(Boolean);
  return (
    <section className="relative overflow-hidden bg-[#e8f8f2] border-b border-[#8BBB92]/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_25%,rgba(42,131,95,.18),transparent_32%),linear-gradient(180deg,#eaf9f4,#d8f4ea)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid lg:grid-cols-2 items-center gap-10 min-h-[460px]">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-sm font-black uppercase tracking-[.13em] text-[#176454]">
              <span className="w-8 h-[2px] bg-[#2A835F]" />{s.eyebrow || 'CLOUD BUSINESS TELEPHONY'}
            </div>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[58px] leading-[1.03] font-black tracking-tight text-[#092328]">{section.title}</h1>
            {section.subtitle && <p className="mt-5 text-sm sm:text-base leading-7 text-slate-600 max-w-xl">{section.subtitle}</p>}
            <div className="mt-7 flex flex-wrap gap-3">
              <PublicButton href={s.primary_url || '/packages'} primary>{s.primary_text || 'View Packages'}</PublicButton>
              <PublicButton href={s.secondary_url || '/contact'} primary={false}>{s.secondary_text || 'Contact Sales'}</PublicButton>
            </div>
            {!!badges.length && <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">{badges.slice(0, 3).map((b, i) => <div key={i} className="flex items-center gap-2"><span className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-[#12544F]" /></span><span className="text-[10px] font-semibold text-slate-500 leading-tight">{b}</span></div>)}</div>}
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[560px]">
              <div className="absolute -inset-8 rounded-full bg-white/25 blur-3xl" />
              <img src={mediaUrl(s.image_url || s.image || '', cloudPbxIcon)} alt={section.title || 'Cloud PBX'} className="relative w-full max-h-[420px] object-contain drop-shadow-[0_24px_35px_rgba(9,35,40,.12)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection({ section, items = [] }) {
  const plans = items.length ? items : [];
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
      <SectionHeading eyebrow="CLOUD PBX PACKAGES" title={section.title} subtitle={section.subtitle} />
      {plans.length ? <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">{plans.map((item, i) => {
        const p = parse(item.payload);
        const features = Array.isArray(p.features) ? p.features : String(p.features || '').split(/\n|,/).map(x => x.trim()).filter(Boolean);
        return <div key={item.id || i} className={`relative rounded-[1.6rem] border p-6 sm:p-7 bg-white text-[#092328] shadow-sm flex flex-col ${p.popular ? 'border-[#2A835F] ring-2 ring-[#2A835F]/15' : 'border-slate-200'}`}>
          {p.popular && <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-[#2A835F] text-white text-[10px] font-black">Popular</span>}
          <h3 className="text-2xl font-black">{item.title}</h3>
          <p className="mt-2 text-sm leading-5 text-slate-500 min-h-[42px]">{item.description}</p>
          <div className="mt-5 text-3xl font-black text-[#2A835F]">৳{Number(p.price || String(item.meta || '').replace(/[^0-9.]/g, '') || 0).toLocaleString()}<span className="text-sm font-semibold ml-1 text-slate-500">/{String(p.billing || 'month').toLowerCase().replace('per ', '')}</span></div>
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5 flex-1">{features.map((f, fi) => <div key={fi} className="flex gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-[#2A835F] shrink-0" />{f}</div>)}</div>
          <Link to={p.button_url || '/packages'} className="mt-5 w-full text-center py-3 rounded-xl bg-[#12544F] text-white font-black text-sm">{p.button_text || 'Purchase Now'}</Link>
        </div>;
      })}</div> : <EmptyState text="No active Cloud PBX packages are available yet." />}
    </section>
  );
}

function ComparisonSection({ section, items = [] }) {
  const plans = items;
  const derived = useMemo(() => {
    const map = [];
    plans.forEach((plan) => {
      const p = parse(plan.payload);
      const features = Array.isArray(p.features) ? p.features : [];
      const basic = [
        ['Free IP Number', features.find(f => /free ip/i.test(f)) || '—'],
        ['Extensions', features.find(f => /extension/i.test(f)) || '—'],
        ['Call Channels', features.find(f => /call channel/i.test(f)) || '—'],
        ['IVR', features.find(f => /ivr/i.test(f)) || '—'],
        ['Call Monitoring', features.find(f => /call monitoring/i.test(f)) || '—'],
        ['Call Charge', features.find(f => /call charge/i.test(f)) || '—'],
        ['Price', plan.meta || `৳${p.price || 0} / month`],
      ];
      map.push({ id: plan.id, title: plan.title, rows: basic });
    });
    return map;
  }, [plans]);
  if (!plans.length) return null;
  const labels = [...new Set(derived.flatMap(x => x.rows.map(r => r[0])))];
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
      <SectionHeading eyebrow="PLAN COMPARISON" title={section.title} subtitle={section.subtitle} />
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-[900px] w-full text-sm"><thead className="bg-[#f4faf7]"><tr><th className="text-left p-4 font-black text-[#092328]">Features</th>{plans.map(p => <th key={p.id} className="p-4 text-center font-black text-[#12544F]">{p.title}</th>)}</tr></thead>
          <tbody>{labels.map((label, i) => <tr key={label} className={i % 2 ? 'bg-slate-50/60' : ''}><td className="p-4 font-bold text-slate-700">{label}</td>{derived.map((plan) => <td key={plan.id} className="p-4 text-center text-slate-600">{plan.rows.find(r => r[0] === label)?.[1] || '—'}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}

function CollectionGrid({ section, items, eyebrow, iconFallback = ShieldCheck, columns = 3, compact = false }) {
  const grid = columns === 6 ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4' : columns === 4 ? 'grid sm:grid-cols-2 lg:grid-cols-4 gap-4' : 'grid sm:grid-cols-2 lg:grid-cols-3 gap-4';
  return <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16"><SectionHeading eyebrow={eyebrow} title={section.title} subtitle={section.subtitle} /><div className={grid}>{items.map((item, i) => {
    const p = parse(item.payload);
    const I = iconFor(item.icon, iconFallback);
    return <div key={item.id || i} className={`group rounded-2xl border border-slate-200 bg-white shadow-sm ${compact ? 'p-4 flex items-center justify-center min-h-[96px]' : 'p-5 sm:p-6 hover:shadow-lg transition'}`}>
      {item.image_url ? <div className="w-12 h-12 rounded-xl bg-[#eaf4f1] flex items-center justify-center overflow-hidden"><img src={mediaUrl(item.image_url)} alt={item.title || ''} className="w-full h-full object-contain" /></div> : <div className="w-10 h-10 rounded-xl bg-[#eaf4f1] flex items-center justify-center"><I className="w-5 h-5 text-[#12544F]" /></div>}
      {!compact && <><h3 className="mt-4 text-sm font-black text-[#092328]">{item.title}</h3>{item.description && <p className="mt-2 text-sm sm:text-sm leading-6 text-slate-500">{item.description}</p>}{p.badge && <div className="mt-4 text-[10px] font-black text-[#12544F] uppercase">{p.badge}</div>}</>}
    </div>;
  })}</div></section>;
}

function OverviewSection({ section }) {
  const s = parse(section.settings);
  const defaultBullets = [
    'Hosted business telephony accessible over the internet.',
    'Flexible extensions, call flows, IVR and routing controls.',
    'Designed for teams that need a centralized calling dashboard.',
  ];
  return <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16"><div className={`grid lg:grid-cols-2 gap-8 items-center rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-10 shadow-sm`}>
    <div className={s.image_position === 'right' ? 'lg:order-1' : 'lg:order-2'}>{s.image_url && <img src={mediaUrl(s.image_url)} alt={section.title} className="w-full max-h-[360px] object-contain rounded-2xl" />}</div>
    <div className={s.image_position === 'right' ? 'lg:order-2' : 'lg:order-1'}>
      {s.eyebrow && <div className="text-[10px] font-black uppercase tracking-[.14em] text-[#2A835F]">{s.eyebrow}</div>}
      {section.title && <h2 className="mt-2 text-3xl sm:text-4xl font-black text-[#092328]">{section.title}</h2>}
      {section.subtitle && <p className="mt-4 text-slate-600 leading-7">{section.subtitle}</p>}
      {section.content_html ? (
        <CmsHtml html={section.content_html} className="mt-5 prose prose-slate max-w-none" />
      ) : (
        <div className="mt-6 space-y-3">
          {defaultBullets.map((text, index) => <div key={index} className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#2A835F] shrink-0" /><span className="text-sm text-slate-600">{text}</span></div>)}
        </div>
      )}
    </div>
  </div></section>;
}

function ConsultationSection({ section }) {
  const s = parse(section.settings);
  const phone = s.phone || '096490123756';
  return <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16"><div className="rounded-[2rem] bg-[#0d4d4a] p-7 sm:p-10 text-white relative overflow-hidden"><div className="absolute -right-20 -top-28 w-72 h-72 rounded-full bg-white/10" /><SectionHeading dark eyebrow="TALK TO OUR TEAM" title={section.title} subtitle={section.subtitle} /><div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-3"><a href={`tel:${phone}`} className="px-6 py-3.5 rounded-xl bg-white text-[#0d4d4a] text-sm font-black">{s.button_text || 'Call Us'} · {phone}</a><Link to={s.chat_url || '/contact'} className="px-6 py-3.5 rounded-xl bg-[#2A835F] text-white text-sm font-black">{s.chat_text || 'Start Live Chat'}</Link></div>{s.hours && <div className="relative z-10 text-center text-sm text-emerald-100 mt-4">Available: {s.hours}</div>}</div></section>;
}

function DocumentsSection({ section, items }) { return <CollectionGrid section={section} items={items} eyebrow="ONBOARDING" iconFallback={FileText} columns={3} />; }
function ClientsSection({ section, items }) { return <CollectionGrid section={section} items={items} eyebrow="TRUSTED TEAMS" columns={6} compact />; }

function FaqSection({ section, items }) {
  if (!items.length) return null;
  return <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16"><SectionHeading eyebrow="HELP CENTER" title={section.title} subtitle={section.subtitle} /><div className="space-y-3">{items.map((item, i) => <details key={item.id || i} className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"><summary className="cursor-pointer list-none flex items-center justify-between gap-4 text-sm sm:text-base font-black text-[#092328]"><span>{item.title}</span><span className="text-[#12544F] text-xl leading-none transition-transform group-open:rotate-45">+</span></summary><div className="pt-3 text-sm leading-6 text-slate-600">{item.content_html ? <CmsHtml html={item.content_html} /> : (item.description || parse(item.payload).answer || 'Our support team can help you with this question.')}</div></details>)}</div></section>;
}

function CtaSection({ section }) { const s = parse(section.settings); return <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10"><div className="relative overflow-hidden rounded-[2rem] border border-[#8BBB92]/40 bg-[#eaf8f3] p-7 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6"><div className="absolute -right-20 -bottom-28 w-72 h-72 rounded-full bg-[#9ee2cb]/35" /><div className="relative text-center lg:text-left"><h2 className="text-3xl sm:text-4xl font-black text-[#092328]">{section.title}</h2>{section.subtitle && <p className="mt-2 text-sm sm:text-base text-slate-600">{section.subtitle}</p>}</div><div className="relative flex flex-col sm:flex-row gap-3"><PublicButton href={s.primary_url || '/packages'}>{s.primary_text || 'Explore Packages'}</PublicButton><PublicButton href={s.secondary_url || '/contact'} primary={false}>{s.secondary_text || 'Talk to Sales'}</PublicButton></div></div></section>; }

function GenericSection({ section }) {
  const settings = parse(section.settings);
  return <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16"><div className="rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-10 shadow-sm">{settings.image_url && <img src={mediaUrl(settings.image_url)} alt={section.title || ''} className="mb-6 w-full max-h-[420px] object-contain rounded-2xl" />}{section.title && <h2 className="text-3xl font-black text-[#092328]">{section.title}</h2>}{section.subtitle && <p className="mt-2 text-slate-500">{section.subtitle}</p>}{section.content_html && <CmsHtml html={section.content_html} className="mt-5 prose prose-slate max-w-none" />}</div></section>;
}

function EmptyState({ text }) { return <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-sm text-slate-500">{text}</div>; }

export const CloudPbx = () => {
  const [data, setData] = useState(null);
  const [mode, setMode] = useState('loading');
  useEffect(() => {
    let live = true;
    API.get('/cms/public/page/cloud-pbx').then((res) => { if (live) { setData(res.data || {}); setMode('ready'); } }).catch((err) => { if (live) setMode(err.response?.status === 410 ? 'inactive' : 'error'); });
    return () => { live = false; };
  }, []);
  if (mode === 'loading') return <div className="min-h-[55vh] flex items-center justify-center text-slate-500">Loading Cloud PBX…</div>;
  if (mode === 'inactive') return <div className="min-h-[55vh] flex items-center justify-center text-slate-500">This Cloud PBX page is currently inactive.</div>;

  // CMS data is authoritative whenever available. These defaults are only a
  // first-run/local safety net so an empty CMS response never collapses into
  // the bare title + footer state shown by older builds.
  const page = data?.page || {
    id: 'cloud-pbx-fallback',
    title: 'Cloud PBX',
    slug: 'cloud-pbx',
    status: 'published',
    seo_description: 'Cloud PBX and business call routing solutions from MyBDPhone.',
  };
  const collections = Object.keys(data?.collections || {}).length
    ? { ...FALLBACK_COLLECTIONS, ...data.collections }
    : FALLBACK_COLLECTIONS;
  const orderedSections = ((data?.sections || []).length ? data.sections : FALLBACK_SECTIONS)
    .slice()
    .sort((a, b) => Number(a.sort_order) - Number(b.sort_order) || String(a.id).localeCompare(String(b.id)));
  const render = (section) => {
    if (section.status !== 'active') return null;
    const settings = parse(section.settings);
    const items = settings.collection_key ? (collections[settings.collection_key] || []) : [];
    switch (section.section_type) {
      case 'hero': return <HeroSection key={section.id} section={section} />;
      case 'pricing': return <PricingSection key={section.id} section={section} items={items} />;
      case 'comparison': return <ComparisonSection key={section.id} section={section} items={items} />;
      case 'image_text': return <OverviewSection key={section.id} section={section} />;
      case 'feature_grid': return items.length ? <CollectionGrid key={section.id} section={section} items={items} eyebrow="FEATURES & BENEFITS" iconFallback={PhoneCall} columns={settings.columns || 3} /> : null;
      case 'benefits': return items.length ? <CollectionGrid key={section.id} section={section} items={items} eyebrow="WHY CHOOSE MYBDPHONE" columns={settings.columns || 3} /> : null;
      case 'consultation': return <ConsultationSection key={section.id} section={section} />;
      case 'documents': return items.length ? <DocumentsSection key={section.id} section={section} items={items} /> : null;
      case 'clients': return items.length ? <ClientsSection key={section.id} section={section} items={items} /> : null;
      case 'faq': return items.length ? <FaqSection key={section.id} section={section} items={items} /> : null;
      case 'cta': return <CtaSection key={section.id} section={section} />;
      default: return <GenericSection key={section.id} section={section} />;
    }
  };

  return <main className="w-full overflow-x-hidden bg-[#f7fafb] pb-8">
    {orderedSections.length ? orderedSections.map(render) : <GenericSection section={{ title: page.title, subtitle: page.seo_description, settings: JSON.stringify({ image_url: page.featured_image }), content_html: page.content_html }} />}
  </main>;
};
