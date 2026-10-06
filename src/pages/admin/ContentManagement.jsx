import { Link } from 'react-router-dom';
import { FileText, Menu, PanelTop, PanelBottom, Home, Sparkles, HelpCircle, Heart, Newspaper, Images, Settings, Package, ArrowRight, BookOpen, ShieldCheck, Building2 } from 'lucide-react';

const cards = [
  ['resources','Resources & Guides Hub CMS','Manage Product Guides, FAQ & Helpdesk, and BTRC Compliance policies live.','Manage resources hub',BookOpen],
  ['navigation','Navigation Menu Manager','Keep your existing mega-menu, dropdown columns, ordering and visibility tools.','Manage navigation',Menu],
  ['header','Header / Navbar Manager','Manage announcement bar, logo, buttons, sticky header and header behaviour.','Manage header',PanelTop],
  ['footer','Footer Manager','Control footer columns, links, social channels, newsletter and copyright.','Manage footer',PanelBottom],
  ['home','Home Page Manager','Reorder, activate/deactivate and edit homepage sections without code.','Manage home page',Home],
  ['client-brands','Brand Logos / Clients','Manage 40+ dynamic PBX client brand logos, ordering, uploads and slider visibility.','Manage brand logos',Building2],
  ['pages','Pages & Landing CMS','Create custom pages with rich text, SEO, featured images and publication status.','Manage pages',FileText],
  ['call-center','Call Center Solution','Manage the PBX-style Call Center landing page, sections, feature cards, images, alignment and CTAs.','Manage Call Center page',FileText],
  ['features','Features Manager','Create, edit, reorder and deactivate feature cards used across the website.','Manage features',Sparkles],
  ['faq','FAQ Manager','Manage questions and answers with active/inactive controls.','Manage FAQs',HelpCircle],
  ['testimonials','Testimonials Manager','Control customer stories, descriptions, images and ordering.','Manage testimonials',Heart],
  ['blog','Blog / News Manager','Write long-form articles with the rich text editor and publish controls.','Manage blog',Newspaper],
  ['media','Media Library','Keep reusable image URLs and media references in one place.','Manage media',Images],
  ['contact','Contact Page Manager','Manage the complete Contact page layout, cards, inquiry form and service options without code.','Manage contact page',FileText],
  ['settings','Global Site Settings','Manage identity, contact, social, SEO and regional content settings.','Manage settings',Settings],
  ['packages','Subscription / Pricing','Use the existing Package Manager for all live monthly plans.','Open package manager',Package],
];

export const AdminContentManagement = () => (
  <div className="space-y-7 pb-12">
    <div>
      <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">CMS & Site Management</h1>
      <p className="text-sm text-slate-500 mt-1 max-w-3xl">Manage website content, structure, publication status and reusable content blocks without touching source code. Your existing Navigation Menu Manager remains the canonical mega-menu editor.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {cards.map(([key,title,desc,action,Icon]) => (
        <Link 
          key={key} 
          to={
            key === 'resources' ? '/admin/cms/resources' :
            key === 'navigation' ? '/admin/navigation' :
            key === 'packages' ? '/admin/packages' :
            key === 'call-center' ? '/admin/cms/pages' :
            key === 'client-brands' ? '/admin/cms/home?tab=clients' :
            `/admin/cms/${key}`
          } 
          className="group rounded-3xl bg-white border border-slate-200 p-5 hover:border-[#2A835F] hover:shadow-lg transition-all"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#12544F]/10 text-[#12544F] flex items-center justify-center"><Icon className="w-5 h-5"/></div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#12544F] transition-colors"/>
          </div>
          <h2 className="mt-4 font-black text-[#092328]">{title}</h2>
          <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{desc}</p>
          <div className="mt-4 text-sm font-extrabold text-[#12544F]">{action} →</div>
        </Link>
      ))}
    </div>
  </div>
);

export default AdminContentManagement;
