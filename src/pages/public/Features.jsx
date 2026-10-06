import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ArrowUpRight } from 'lucide-react';
import API from '../../services/api';
import { CmsHtml } from '../../components/cms/CmsHtml';
import heroBg from '../../assets/hero-bg.png';

export const Features = () => {
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{API.get('/cms/public/collection/features').then(r=>setItems(r.data.items||[])).catch(console.error).finally(()=>setLoading(false));},[]);
  return <div className="space-y-16 pb-20">
    <section className="relative overflow-hidden bg-[#eaf6f2] py-16 text-center border-b border-[#8BBB92]/30" style={{backgroundImage:`url(${heroBg})`,backgroundSize:'cover',backgroundPosition:'center'}}><div className="max-w-4xl mx-auto px-4"><span className="text-sm font-black uppercase tracking-wide text-[#12544F]">Platform Capabilities</span><h1 className="text-4xl sm:text-5xl font-black text-[#092328] mt-3">Telecom & Voice AI Features</h1><p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3">This feature catalogue is managed from the admin CMS and updates automatically.</p></div></section>
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{loading?<div className="text-center py-16 text-slate-500">Loading features…</div>:<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{items.map(item=><div key={item.id} className="p-7 rounded-3xl bg-white border border-slate-200 hover:border-[#2A835F] hover:shadow-xl transition-all"><div className="flex items-start justify-between"><div className="w-12 h-12 rounded-2xl bg-[#12544F]/10 text-[#12544F] flex items-center justify-center"><CheckCircle2 className="w-6 h-6"/></div>{item.link_url&&<Link to={item.link_url} className="p-2 rounded-lg bg-slate-50 text-[#12544F]"><ArrowUpRight className="w-4 h-4"/></Link>}</div><h3 className="mt-5 text-xl font-black text-[#092328]">{item.title}</h3><p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.description}</p>{item.content_html&&<CmsHtml html={item.content_html} className="prose prose-sm max-w-none mt-3"/>}</div>)}</div>}</section>
    <section className="max-w-5xl mx-auto px-4"><div className="p-10 rounded-3xl bg-slate-100 border border-slate-200 text-center"><h2 className="text-2xl font-black text-[#092328]">Need a plan matched to your business?</h2><p className="mt-2 text-sm text-slate-600">Compare the live packages configured by the admin team.</p><Link to="/packages" className="inline-flex items-center gap-2 mt-5 px-6 py-3 rounded-xl bg-[#12544F] text-white font-bold">Explore Packages<ArrowRight className="w-4 h-4"/></Link></div></section>
  </div>;
};
