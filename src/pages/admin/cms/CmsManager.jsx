import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../../services/api';
import { RichTextEditor } from '../../../components/cms/RichTextEditor';
import { Save, Plus, Pencil, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, RefreshCw, ArrowLeft, Copy, UploadCloud } from 'lucide-react';

const LABELS = { header:'Header / Navbar Manager', footer:'Footer Manager', home:'Home Page Manager', pages:'Pages & Landing CMS', features:'Features Manager', faq:'FAQ Manager', testimonials:'Testimonials Manager', blog:'Blog / News Manager', media:'Media Library', settings:'Global Site Settings', contact:'Contact Page Manager', callcenter:'Call Center Solution Manager' };
const COLLECTIONS = ['features','faq','testimonials','blog'];
const clone = (v) => JSON.parse(JSON.stringify(v));
const parseJson = (value, fallback = {}) => {
  if (!value) return fallback;
  if (typeof value === 'object') return value;
  try { return JSON.parse(value); } catch { return fallback; }
};
const emptyItem = {title:'', slug:'', description:'', content_html:'', image_url:'', icon:'', link_url:'', meta:'', sort_order:0, status:'active', payload:{}, answer:''};

const CLOUD_PBX_DEFAULT_SECTIONS = [
  ['hero', 'hero', 'Cloud PBX for Modern Business', 'Connect your teams with a scalable hosted phone system.', 1, {
    image_url: '/uploads/cms/cloud-pbx-icon.png',
    eyebrow: 'CLOUD BUSINESS TELEPHONY',
    primary_text: 'View Packages',
    primary_url: '/packages',
    secondary_text: 'Contact Sales',
    secondary_url: '/contact',
    badges: ['096 IP number', 'Flexible extensions', 'Hosted PBX'],
  }],
  ['pricing', 'pricing', 'Cloud PBX Packages', 'Choose a plan based on extensions, IVR and concurrent call needs.', 2, { collection_key: 'cloud_pbx_packages' }],
  ['comparison', 'comparison', 'PBX Package Comparison', 'Compare the included calling capacity and controls at a glance.', 3, { collection_key: 'cloud_pbx_packages' }],
  ['overview', 'image_text', 'Cloud PBX for Your Business', 'A flexible hosted phone system for professional customer communication.', 4, {
    image_url: '/uploads/cms/cloud-pbx-icon.png',
    image_position: 'left',
    eyebrow: 'CLOUD PBX',
  }],
  ['features', 'feature_grid', 'Features & Benefits of Cloud PBX', 'Professional call controls that help teams answer, route and manage conversations.', 5, { collection_key: 'cloud_pbx_features', columns: 3 }],
  ['benefits', 'benefits', 'Why Choose MyBDPhone Cloud PBX', 'Built for secure, dependable and easy-to-manage business telephony.', 6, { collection_key: 'cloud_pbx_benefits', columns: 3 }],
  ['consultation', 'consultation', 'Get a Free Consultation', 'Talk to our team about the right Cloud PBX setup for your business.', 7, {
    phone: '096490123756',
    hours: '9:00 AM – 9:00 PM',
    chat_url: '/contact',
    chat_text: 'Start Live Chat',
    button_text: 'Call Us',
  }],
  ['documents', 'documents', 'Required Documents to Purchase PBX Package', 'Keep these documents ready for onboarding.', 8, { collection_key: 'cloud_pbx_documents', columns: 3 }],
  ['clients', 'clients', 'Clients We Have Helped with PBX', 'Teams across Bangladesh can manage their business calls from one platform.', 9, { collection_key: 'cloud_pbx_clients', columns: 6 }],
  ['faq', 'faq', 'Frequently Asked Questions', 'Common questions about hosted Cloud PBX.', 10, { collection_key: 'cloud_pbx_faq' }],
  ['cta', 'cta', 'Ready to Upgrade Your Business Telephony?', 'Get help selecting a Cloud PBX package or request a tailored setup.', 11, {
    primary_text: 'Explore Packages',
    primary_url: '/packages',
    secondary_text: 'Talk to Sales',
    secondary_url: '/contact',
  }],
];


function Toggle({value,onChange}){return <button type="button" onClick={onChange} className={`relative w-11 h-6 rounded-full transition-colors ${value?'bg-[#2A835F]':'bg-slate-300'}`}><span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${value?'left-6':'left-1'}`}/></button>}
function Field({label, value, onChange, ...props}){return <div><label className="block text-sm font-black text-slate-700 mb-1.5">{label}</label><input value={value ?? ''} onChange={(e)=>onChange(e.target.value)} {...props} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#12544F] text-sm"/></div>}
function TextArea({label,value,onChange,...props}){return <div><label className="block text-sm font-black text-slate-700 mb-1.5">{label}</label><textarea value={value ?? ''} onChange={(e)=>onChange(e.target.value)} {...props} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#12544F] text-sm"/></div>}

export const CmsManager = () => {
  const { section='home' } = useParams();
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState('');
  const [config,setConfig]=useState(null);
  const [items,setItems]=useState([]);
  const [pages,setPages]=useState([]);
  const [sections,setSections]=useState([]);
  const [media,setMedia]=useState([]);
  const [editing,setEditing]=useState(null);
  const [editorOpen,setEditorOpen]=useState(false);
  const [sectionPage,setSectionPage]=useState(null);
  const [pageSections,setPageSections]=useState([]);
  const [sectionLoading,setSectionLoading]=useState(false);
  const [sectionError,setSectionError]=useState('');

  const title = LABELS[section] || 'CMS Manager';
  const isCollection = COLLECTIONS.includes(section);

  const load = async () => {
    setLoading(true); setMessage('');
    try {
      if (['header','footer','home','settings','contact'].includes(section)) {
        const res = await API.get('/cms/admin/config');
        setConfig(res.data.config || {});
        if (section==='home') {
          const homeRes = await API.get('/cms/public/home');
          setSections(homeRes.data.sections || []);
        }
      } else if (section==='pages') {
        const res=await API.get('/cms/admin/pages'); setPages(res.data.pages||[]);
      } else if (isCollection) {
        const res=await API.get(`/cms/admin/items/${section}`); setItems(res.data.items||[]);
      } else if (section==='media') {
        const res=await API.get('/cms/admin/media'); setMedia(res.data.media||[]);
      }
    } catch(e) { setMessage(e.response?.data?.message || 'Failed to load CMS data'); }
    finally { setLoading(false); }
  };

  useEffect(()=>{load();setEditing(null);setEditorOpen(false);},[section]);

  const saveConfig = async () => {
    setSaving(true);setMessage('');
    try { await API.put(`/cms/admin/config/${section}_config`,{value:config?.[`${section}_config`]}); setMessage('Saved and published live.'); }
    catch(e){setMessage(e.response?.data?.message||'Save failed');} finally{setSaving(false);}
  };

  const configKey = `${section}_config`;
  const currentConfig = config?.[configKey] || {};

  const sectionRows = useMemo(()=>sections,[sections]);
  const moveSection = async (index,dir) => {
    const next=clone(sectionRows); const j=index+dir; if(j<0||j>=next.length)return; [next[index],next[j]]=[next[j],next[index]]; next.forEach((x,i)=>x.sort_order=i+1); setSections(next); await API.put('/cms/admin/sections/reorder',{items:next.map(x=>({id:x.id,sort_order:x.sort_order}))});
  };

  const openNewItem = ()=>{setEditing(clone(emptyItem));setEditorOpen(true)};
  const editItem=(item)=>{const payload=typeof item.payload==='string'?JSON.parse(item.payload||'{}'):item.payload||{};setEditing({...clone(item),payload,answer:section==='faq'?(payload.answer||item.description||item.content_html||''):''});setEditorOpen(true)};
  const saveItem=async()=>{
    if(!editing?.title)return setMessage('Title is required');
    setSaving(true);setMessage('');
    try{
      if(editing.id) await API.put(`/cms/admin/items/${editing.id}`,editing);
      else await API.post('/cms/admin/items',{...editing,collection_key:section});
      setEditorOpen(false);await load();setMessage('Item saved successfully.');
    }catch(e){setMessage(e.response?.data?.message||'Save failed')}finally{setSaving(false)}
  };
  const toggleItem=async(id)=>{await API.put(`/cms/admin/items/${id}/toggle`);await load()};
  const deleteItem=async(id)=>{if(!window.confirm('Delete this item?'))return;await API.delete(`/cms/admin/items/${id}`);await load()};
  const moveItem=async(index,dir)=>{const next=clone(items);const j=index+dir;if(j<0||j>=next.length)return;[next[index],next[j]]=[next[j],next[index]];next.forEach((x,i)=>x.sort_order=i+1);setItems(next);await API.put('/cms/admin/items/reorder',{items:next.map(x=>({id:x.id,sort_order:x.sort_order}))})};

  const savePage=async()=>{if(!editing?.title||!editing?.slug)return setMessage('Page title and slug are required');setSaving(true);try{if(editing.id) await API.put(`/cms/admin/pages/${editing.id}`,editing); else await API.post('/cms/admin/pages',editing);setEditorOpen(false);await load();setMessage('Page saved.')}catch(e){setMessage(e.response?.data?.message||'Save failed')}finally{setSaving(false)}};
  const togglePage=async(id)=>{await API.put(`/cms/admin/pages/${id}/toggle`);await load()};
  const deletePage=async(id)=>{if(!window.confirm('Delete this page?'))return;await API.delete(`/cms/admin/pages/${id}`);await load()};

  const saveMedia=async()=>{if(!editing?.name||!editing?.url)return setMessage('Media name and URL are required');setSaving(true);try{if(editing.id) await API.put(`/cms/admin/media/${editing.id}`,editing); else await API.post('/cms/admin/media',editing);setEditorOpen(false);await load();setMessage('Media saved.')}catch(e){setMessage(e.response?.data?.message||'Save failed')}finally{setSaving(false)}};
  const toggleMedia=async(id)=>{await API.put(`/cms/admin/media/${id}/toggle`);await load()};
  const deleteMedia=async(id)=>{if(!window.confirm('Delete this media record?'))return;await API.delete(`/cms/admin/media/${id}`);await load()};

  if(section==='navigation') return null;

  return <div className="space-y-6 pb-12">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div><div className="flex items-center gap-2 text-sm text-slate-400 mb-1"><Link to="/admin/cms" className="hover:text-[#12544F]">CMS & Site Management</Link><span>/</span><span>{title}</span></div><h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">{title}</h1><p className="text-sm text-slate-500 mt-1">Everything here is database-driven. Save changes to publish them to the live frontend without editing source files.</p></div>
      <div className="flex gap-2"><button type="button" onClick={load} className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold flex items-center gap-2"><RefreshCw className="w-4 h-4"/>Refresh</button><Link to="/admin/cms" className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold flex items-center gap-2"><ArrowLeft className="w-4 h-4"/>CMS Home</Link></div>
    </div>
    {message && <div className="px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">{message}</div>}
    {loading ? <div className="p-10 rounded-3xl bg-white border border-slate-200 text-center text-slate-500">Loading CMS…</div> : <>

      {['header','footer','settings','contact'].includes(section) && <ConfigEditor section={section} value={currentConfig} setValue={(next)=>setConfig((p)=>({...p,[configKey]:next}))} onSave={saveConfig} saving={saving} />}

      {section==='home-legacy' && <div className="rounded-3xl bg-white border border-slate-200 p-5 space-y-4"><div className="flex items-center justify-between"><div><h2 className="font-black text-[#092328]">Homepage Sections</h2><p className="text-sm text-slate-500">Activate, deactivate and reorder sections. Your existing visual site layout can remain; section content is controlled here.</p></div></div>{sectionRows.map((row,i)=><div key={row.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200"><div><div className="font-bold text-[#092328]">{row.title || row.section_key}</div><div className="text-sm text-slate-500 mt-1">{row.section_type} · {row.section_key}</div></div><div className="flex items-center gap-2"><span className={`text-[11px] font-black px-2 py-1 rounded-full ${row.status==='active'?'bg-emerald-100 text-emerald-700':'bg-slate-200 text-slate-500'}`}>{row.status}</span><button type="button" onClick={()=>moveSection(i,-1)} className="p-2 rounded-lg bg-white border border-slate-200"><ArrowUp className="w-4 h-4"/></button><button type="button" onClick={()=>moveSection(i,1)} className="p-2 rounded-lg bg-white border border-slate-200"><ArrowDown className="w-4 h-4"/></button></div></div>)}</div>}

      {section==='pages' && <PageManager pages={pages} editing={editing} setEditing={setEditing} editorOpen={editorOpen} setEditorOpen={setEditorOpen} savePage={savePage} saving={saving} togglePage={togglePage} deletePage={deletePage} onManageSections={async (page)=>{
        setSectionPage(page);
        setPageSections([]);
        setSectionError('');
        setSectionLoading(true);
        try {
          let r = await API.get(`/cms/admin/pages/${page.id}/sections`);
          let nextSections = r.data?.sections || [];

          // Older local databases can have the Cloud PBX page row but no
          // section rows. Repair only when the returned list is empty.
          if (page.slug === 'cloud-pbx' && nextSections.length === 0) {
            try {
              nextSections = await repairCloudPbxSections(page.id);
            } catch (repairError) {
              setSectionError(
                repairError.response?.data?.message ||
                repairError.message ||
                'Cloud PBX sections are missing. Use Repair Cloud PBX to initialize them.'
              );
            }
          }

          setPageSections(nextSections);
        } catch(e) {
          setSectionError(e.response?.data?.message || 'Failed to load page sections');
        } finally {
          setSectionLoading(false);
        }
      }} />}
      {sectionPage && <SectionsModal page={sectionPage} sections={pageSections} setSections={setPageSections} loading={sectionLoading} error={sectionError} onRefresh={async()=>{
        setSectionLoading(true);
        setSectionError('');
        try {
          const r=await API.get(`/cms/admin/pages/${sectionPage.id}/sections`);
          setPageSections(r.data.sections||[]);
        } catch(e) {
          setSectionError(e.response?.data?.message || 'Failed to load page sections');
        } finally {
          setSectionLoading(false);
        }
      }} onClose={()=>{setSectionPage(null);setSectionError('')}} />}
      {isCollection && <CollectionManager section={section} items={items} editing={editing} setEditing={setEditing} editorOpen={editorOpen} setEditorOpen={setEditorOpen} openNewItem={openNewItem} editItem={editItem} saveItem={saveItem} saving={saving} toggleItem={toggleItem} deleteItem={deleteItem} moveItem={moveItem} />}
      {section==='media' && <MediaManager media={media} editing={editing} setEditing={setEditing} editorOpen={editorOpen} setEditorOpen={setEditorOpen} saveMedia={saveMedia} saving={saving} toggleMedia={toggleMedia} deleteMedia={deleteMedia} />}
    </>}
  </div>;
};

function ConfigEditor({section,value,setValue,onSave,saving}){
  if(section==='header') return <HeaderEditor value={value} setValue={setValue} onSave={onSave} saving={saving}/>;
  if(section==='footer') return <FooterEditor value={value} setValue={setValue} onSave={onSave} saving={saving}/>;
  if(section==='home') return <HomeConfigEditor value={value} setValue={setValue} onSave={onSave} saving={saving}/>;
  if(section==='contact') return <ContactConfigEditor value={value} setValue={setValue} onSave={onSave} saving={saving}/>;
  return <GlobalEditor value={value} setValue={setValue} onSave={onSave} saving={saving}/>;
}

function SaveButton({onSave,saving}){return <div className="flex justify-end"><button type="button" onClick={onSave} disabled={saving} className="px-5 py-2.5 rounded-xl bg-[#12544F] text-white font-bold flex items-center gap-2 disabled:opacity-60"><Save className="w-4 h-4"/>{saving?'Saving…':'Save & Publish'}</button></div>}
function CmsUpload({label,value,onChange}){const [uploading,setUploading]=React.useState(false);const file=async(e)=>{const f=e.target.files?.[0];if(!f)return;setUploading(true);try{const fd=new FormData();fd.append('file',f);const r=await API.post('/cms/admin/media/upload',fd,{headers:{'Content-Type':'multipart/form-data'}});onChange(r.data?.url||'')}catch(err){alert(err.response?.data?.message||'Upload failed')}finally{setUploading(false)}};return <div><label className="block text-sm font-black text-slate-700 mb-1.5">{label}</label><div className="flex gap-2"><input value={value||''} onChange={e=>onChange(e.target.value)} className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm" placeholder="/uploads/cms/..."/><label className="cursor-pointer px-3 py-2.5 rounded-xl border bg-white text-sm font-black flex items-center gap-1"><UploadCloud className="w-4 h-4"/>{uploading?'Uploading…':'Choose File'}<input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="hidden" onChange={file}/></label></div>{value&&<img src={`${String(value).startsWith('/uploads/')?String(import.meta.env.VITE_API_URL||'http://localhost:5000/api').replace(/\/api\/?$/,''):''}${value}`} className="mt-2 h-14 max-w-48 object-contain rounded-lg bg-slate-50" alt="preview"/>}</div>}
function HeaderEditor({value,setValue,onSave,saving}){const v={announcement_enabled:true,show_search:true,sticky_header:true,...value};return <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-6"><div className="grid md:grid-cols-2 gap-4"><CmsUpload label="Navbar Logo" value={v.logo_url} onChange={x=>setValue({...v,logo_url:x})}/><Field label="Announcement Text" value={v.announcement_text} onChange={x=>setValue({...v,announcement_text:x})}/><Field label="Login Button Text" value={v.login_text} onChange={x=>setValue({...v,login_text:x})}/><Field label="Login Button URL" value={v.login_url} onChange={x=>setValue({...v,login_url:x})}/><Field label="Primary Button Text" value={v.primary_text} onChange={x=>setValue({...v,primary_text:x})}/><Field label="Primary Button URL" value={v.primary_url} onChange={x=>setValue({...v,primary_url:x})}/></div><div className="grid md:grid-cols-3 gap-4">{[['Announcement Bar','announcement_enabled'],['Show Search','show_search'],['Sticky Header','sticky_header']].map(([l,k])=><div key={k} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50"><span className="font-bold text-sm text-slate-700">{l}</span><Toggle value={!!v[k]} onChange={()=>setValue({...v,[k]:!v[k]})}/></div>)}</div><SaveButton onSave={onSave} saving={saving}/></div>}
function FooterEditor({value,setValue,onSave,saving}){const v={columns:[],social:[],newsletter_enabled:false,...value};const setCol=(i,next)=>{const cols=clone(v.columns||[]);cols[i]=next;setValue({...v,columns:cols})};const addCol=()=>setValue({...v,columns:[...(v.columns||[]),{title:'New Column',links:[]}]});const addLink=(ci)=>{const c=clone(v.columns[ci]);c.links=[...(c.links||[]),{label:'New Link',url:'/',active:true}];setCol(ci,c)};return <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-6"><div className="grid md:grid-cols-2 gap-4"><CmsUpload label="Footer Logo" value={v.logo_url} onChange={x=>setValue({...v,logo_url:x})}/><CmsUpload label="Payment Gateway Image" value={v.payment_image_url} onChange={x=>setValue({...v,payment_image_url:x})}/></div><TextArea label="Footer Description" rows={4} value={v.description} onChange={x=>setValue({...v,description:x})}/><div className="flex items-center justify-between"><h3 className="font-black">Footer Columns</h3><button type="button" onClick={addCol} className="px-3 py-2 rounded-xl bg-[#12544F] text-white text-sm font-bold flex items-center gap-1"><Plus className="w-3.5 h-3.5"/>Add Column</button></div>{(v.columns||[]).map((col,ci)=><div key={ci} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"><div className="flex gap-2"><Field label={`Column ${ci+1} Title`} value={col.title} onChange={x=>setCol(ci,{...col,title:x})}/><button type="button" onClick={()=>setValue({...v,columns:v.columns.filter((_,i)=>i!==ci)})} className="self-end p-2.5 rounded-xl text-rose-500"><Trash2 className="w-4 h-4"/></button></div>{(col.links||[]).map((link,li)=><div key={li} className="grid md:grid-cols-[1fr_1fr_auto_auto] gap-2 items-end"><Field label="Label" value={link.label} onChange={x=>{const c=clone(col);c.links[li].label=x;setCol(ci,c)}}/><Field label="URL" value={link.url} onChange={x=>{const c=clone(col);c.links[li].url=x;setCol(ci,c)}}/><div className="flex items-center justify-center h-10"><Toggle value={link.active!==false} onChange={()=>{const c=clone(col);c.links[li].active=link.active===false;setCol(ci,c)}}/></div><button type="button" onClick={()=>{const c=clone(col);c.links=c.links.filter((_,i)=>i!==li);setCol(ci,c)}} className="h-10 px-3 rounded-xl border bg-white text-rose-500"><Trash2 className="w-4 h-4"/></button></div>)}<button type="button" onClick={()=>addLink(ci)} className="text-sm font-black text-[#12544F]">+ Add footer link</button></div>)}<div className="grid md:grid-cols-2 gap-3"><Field label="Copyright" value={v.copyright} onChange={x=>setValue({...v,copyright:x})}/><Field label="Footer Note" value={v.footer_note} onChange={x=>setValue({...v,footer_note:x})}/></div><SaveButton onSave={onSave} saving={saving}/></div>}
function ContactConfigEditor({value,setValue,onSave,saving}){
  const v={enabled:true,eyebrow:'DIRECT CHANNELS',title:'Our Dhaka Offices',description:'',cards:[],form:{services:[]},...value};
  const form={name_label:'Your Full Name *',name_placeholder:'e.g. Enter Your Name',phone_label:'Phone Number *',phone_placeholder:'01XXXXXXXXX',email_label:'Email Address *',email_placeholder:'name@company.com',service_label:'Service Interest',service_placeholder:'Select Service Interest',message_label:'Message Description *',message_placeholder:'',submit_text:'Submit Inquiry',success_title:'Inquiry Submitted Successfully!',success_message:'',...v.form};
  const cards=Array.isArray(v.cards)?v.cards:[];
  const services=Array.isArray(form.services)?form.services:[];
  const setCard=(i,key,val)=>setValue({...v,cards:cards.map((c,n)=>n===i?{...c,[key]:val}:c)});
  const setService=(i,key,val)=>setValue({...v,form:{...form,services:services.map((x,n)=>n===i?{...x,[key]:val}:x)}});
  const addCard=()=>setValue({...v,cards:[...cards,{icon:'MapPin',title:'New Contact',lines:[''],meta:'',active:true}]});
  const removeCard=(i)=>setValue({...v,cards:cards.filter((_,n)=>n!==i)});
  const addService=()=>setValue({...v,form:{...form,services:[...services,{label:'New Service',value:'New Service',active:true}]}});
  const removeService=(i)=>setValue({...v,form:{...form,services:services.filter((_,n)=>n!==i)}});
  const linesText=(c)=>Array.isArray(c.lines)?c.lines.join('\n'):String(c.lines||'');
  return <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-7">
    <div className="flex items-center justify-between gap-3"><div><h2 className="font-black text-[#092328]">Contact Page Content</h2><p className="text-sm text-slate-500 mt-1">Everything below is stored in the CMS database. No Contact.jsx editing is needed.</p></div><Toggle value={v.enabled!==false} onChange={()=>setValue({...v,enabled:v.enabled===false})}/></div>
    <div className="grid md:grid-cols-2 gap-4"><Field label="Eyebrow / Small Heading" value={v.eyebrow} onChange={x=>setValue({...v,eyebrow:x})}/><Field label="Main Title" value={v.title} onChange={x=>setValue({...v,title:x})}/><div className="md:col-span-2"><TextArea label="Description" rows={3} value={v.description} onChange={x=>setValue({...v,description:x})}/></div></div>

    <div className="space-y-4"><div className="flex items-center justify-between"><div><h3 className="font-black">Direct Channel Cards</h3><p className="text-sm text-slate-500">Add, edit, hide or remove Head Office, hotline, email and any other contact card.</p></div><button type="button" onClick={addCard} className="px-3 py-2 rounded-xl bg-[#12544F] text-white text-sm font-bold">+ Add Card</button></div>
      {cards.map((card,i)=><div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3"><div className="grid md:grid-cols-4 gap-3"><Field label="Icon" value={card.icon} onChange={x=>setCard(i,'icon',x)} placeholder="MapPin / Phone / Mail"/><Field label="Card Title" value={card.title} onChange={x=>setCard(i,'title',x)}/><Field label="Meta / Hours" value={card.meta} onChange={x=>setCard(i,'meta',x)}/><div className="flex items-end gap-3"><div className="flex-1 p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between"><span className="text-sm font-black">Active</span><Toggle value={card.active!==false} onChange={()=>setCard(i,'active',card.active===false)}/></div><button type="button" onClick={()=>removeCard(i)} className="px-3 py-3 rounded-xl bg-white border border-rose-200 text-rose-600 text-sm font-bold">Delete</button></div></div><TextArea label="Information Lines (one per line)" rows={3} value={linesText(card)} onChange={x=>setCard(i,'lines',String(x).split('\n'))}/></div>)}
    </div>

    <div className="space-y-4"><div><h3 className="font-black">Inquiry Form</h3><p className="text-sm text-slate-500 mt-1">Control every visible label, placeholder and message in the form.</p></div><div className="grid md:grid-cols-2 gap-4"><Field label="Form Title" value={form.title} onChange={x=>setValue({...v,form:{...form,title:x}})}/><Field label="Form Subtitle" value={form.subtitle} onChange={x=>setValue({...v,form:{...form,subtitle:x}})}/><Field label="Name Label" value={form.name_label} onChange={x=>setValue({...v,form:{...form,name_label:x}})}/><Field label="Name Placeholder" value={form.name_placeholder} onChange={x=>setValue({...v,form:{...form,name_placeholder:x}})}/><Field label="Phone Label" value={form.phone_label} onChange={x=>setValue({...v,form:{...form,phone_label:x}})}/><Field label="Phone Placeholder" value={form.phone_placeholder} onChange={x=>setValue({...v,form:{...form,phone_placeholder:x}})}/><Field label="Email Label" value={form.email_label} onChange={x=>setValue({...v,form:{...form,email_label:x}})}/><Field label="Email Placeholder" value={form.email_placeholder} onChange={x=>setValue({...v,form:{...form,email_placeholder:x}})}/><Field label="Service Label" value={form.service_label} onChange={x=>setValue({...v,form:{...form,service_label:x}})}/><Field label="Service Placeholder" value={form.service_placeholder} onChange={x=>setValue({...v,form:{...form,service_placeholder:x}})}/><Field label="Message Label" value={form.message_label} onChange={x=>setValue({...v,form:{...form,message_label:x}})}/><Field label="Submit Button Text" value={form.submit_text} onChange={x=>setValue({...v,form:{...form,submit_text:x}})}/><div className="md:col-span-2"><TextArea label="Message Placeholder" rows={2} value={form.message_placeholder} onChange={x=>setValue({...v,form:{...form,message_placeholder:x}})}/></div><Field label="Success Title" value={form.success_title} onChange={x=>setValue({...v,form:{...form,success_title:x}})}/><TextArea label="Success Message" rows={2} value={form.success_message} onChange={x=>setValue({...v,form:{...form,success_message:x}})}/></div></div>

    <div className="space-y-4"><div className="flex items-center justify-between"><div><h3 className="font-black">Service Interest Options</h3><p className="text-sm text-slate-500">These options appear in the Contact page dropdown.</p></div><button type="button" onClick={addService} className="px-3 py-2 rounded-xl bg-[#12544F] text-white text-sm font-bold">+ Add Service</button></div>{services.map((service,i)=><div key={i} className="grid md:grid-cols-[1fr_1fr_auto_auto] gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50 items-end"><Field label="Visible Label" value={service.label} onChange={x=>setService(i,'label',x)}/><Field label="Value" value={service.value} onChange={x=>setService(i,'value',x)}/><div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-2"><span className="text-sm font-black">Active</span><Toggle value={service.active!==false} onChange={()=>setService(i,'active',service.active===false)}/></div><button type="button" onClick={()=>removeService(i)} className="px-3 py-3 rounded-xl border border-rose-200 text-rose-600 text-sm font-bold">Delete</button></div>)}</div>
    <SaveButton onSave={onSave} saving={saving}/>
  </div>
}

function HomeConfigEditor({value,setValue,onSave,saving}){const v={section_titles:{},section_visibility:{hero:true,features:true,packages:true,testimonials:true,faq:true,cta:true},...value};const titles={...v.section_titles};const vis={...v.section_visibility};return <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-5"><div className="grid md:grid-cols-2 gap-4"><Field label="Hero Badge" value={v.hero_badge} onChange={x=>setValue({...v,hero_badge:x})}/><Field label="Hero Image URL" value={v.hero_image_url} onChange={x=>setValue({...v,hero_image_url:x})}/><Field label="Hero Title" value={v.hero_title} onChange={x=>setValue({...v,hero_title:x})}/><TextArea label="Hero Subtitle" rows={3} value={v.hero_subtitle} onChange={x=>setValue({...v,hero_subtitle:x})}/><Field label="Primary Button Text" value={v.hero_primary_text} onChange={x=>setValue({...v,hero_primary_text:x})}/><Field label="Primary Button URL" value={v.hero_primary_url} onChange={x=>setValue({...v,hero_primary_url:x})}/><Field label="Secondary Button Text" value={v.hero_secondary_text} onChange={x=>setValue({...v,hero_secondary_text:x})}/><Field label="Secondary Button URL" value={v.hero_secondary_url} onChange={x=>setValue({...v,hero_secondary_url:x})}/></div><div><h3 className="font-black mb-3">Section Titles & Visibility</h3><div className="grid md:grid-cols-2 gap-3">{['features','packages','testimonials','faq','cta'].map(k=><div key={k} className="p-4 rounded-2xl bg-slate-50 border border-slate-200"><div className="grid grid-cols-[1fr_auto] gap-3 items-end"><Field label={k.replace('_',' ')} value={titles[k]||''} onChange={x=>setValue({...v,section_titles:{...titles,[k]:x}})}/><Toggle value={vis[k]!==false} onChange={()=>setValue({...v,section_visibility:{...vis,[k]:!vis[k]}})}/></div></div>)}</div></div><SaveButton onSave={onSave} saving={saving}/></div>}

function GlobalEditor({value,setValue,onSave,saving}){const v=value||{};return <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-5"><div className="grid md:grid-cols-2 gap-4"><Field label="Site Name" value={v.site_name} onChange={x=>setValue({...v,site_name:x})}/><Field label="Tagline" value={v.tagline} onChange={x=>setValue({...v,tagline:x})}/><Field label="Logo URL" value={v.logo_url} onChange={x=>setValue({...v,logo_url:x})}/><Field label="Favicon URL" value={v.favicon_url} onChange={x=>setValue({...v,favicon_url:x})}/><Field label="Hotline Phone" value={v.hotline_phone} onChange={x=>setValue({...v,hotline_phone:x})}/><Field label="Support Email" value={v.support_email} onChange={x=>setValue({...v,support_email:x})}/><Field label="Sales Email" value={v.sales_email} onChange={x=>setValue({...v,sales_email:x})}/><Field label="Office Address" value={v.office_address} onChange={x=>setValue({...v,office_address:x})}/><Field label="Facebook URL" value={v.facebook_url} onChange={x=>setValue({...v,facebook_url:x})}/><Field label="LinkedIn URL" value={v.linkedin_url} onChange={x=>setValue({...v,linkedin_url:x})}/><Field label="YouTube URL" value={v.youtube_url} onChange={x=>setValue({...v,youtube_url:x})}/><Field label="Instagram URL" value={v.instagram_url} onChange={x=>setValue({...v,instagram_url:x})}/></div><div className="grid md:grid-cols-2 gap-4"><TextArea label="SEO Title" rows={2} value={v.seo_title} onChange={x=>setValue({...v,seo_title:x})}/><TextArea label="SEO Description" rows={2} value={v.seo_description} onChange={x=>setValue({...v,seo_description:x})}/></div><SaveButton onSave={onSave} saving={saving}/></div>}

function parseFaqAnswer(item){const p=typeof item?.payload==='string'?(()=>{try{return JSON.parse(item.payload||'{}')}catch{return {}}})():item?.payload||{};return p.answer||item?.description||item?.content_html||''}
function CollectionManager({section,items,editing,setEditing,editorOpen,setEditorOpen,openNewItem,editItem,saveItem,saving,toggleItem,deleteItem,moveItem}){const singular=section==='faq'?'FAQ':section==='blog'?'Blog Post':section==='testimonials'?'Testimonial':'Feature';return <div className="rounded-3xl bg-white border border-slate-200 p-5 space-y-5"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><h2 className="font-black text-[#092328]">{singular} Collection</h2><p className="text-sm text-slate-500 mt-1">Every item is live only when its status is active/published.</p></div><button type="button" onClick={openNewItem} className="px-4 py-2.5 rounded-xl bg-[#12544F] text-white font-bold text-sm flex items-center gap-2"><Plus className="w-4 h-4"/>Add {singular}</button></div><div className="space-y-3">{items.map((item,i)=><div key={item.id} className="p-4 rounded-2xl border border-slate-200 flex flex-col lg:flex-row lg:items-center gap-3"><div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">{item.image_url?<img src={item.image_url} alt="" className="w-full h-full object-cover"/>:null}</div><div className="min-w-0 flex-1"><div className="font-bold text-[#092328] truncate">{item.title}</div><div className="text-sm text-slate-500 line-clamp-2 mt-1">{section==='faq' ? (parseFaqAnswer(item) || 'No answer added') : (item.description || 'No short description')}</div></div><div className="flex flex-wrap items-center gap-2"><span className={`px-2 py-1 rounded-full text-[10px] font-black ${['active','published'].includes(item.status)?'bg-emerald-100 text-emerald-700':'bg-slate-100 text-slate-500'}`}>{item.status}</span><button type="button" title="Move up" onClick={()=>moveItem(i,-1)} className="p-2 rounded-lg border border-slate-200"><ArrowUp className="w-4 h-4"/></button><button type="button" title="Move down" onClick={()=>moveItem(i,1)} className="p-2 rounded-lg border border-slate-200"><ArrowDown className="w-4 h-4"/></button><button type="button" onClick={()=>toggleItem(item.id)} className="p-2 rounded-lg border border-slate-200 text-[#12544F]">{['active','published'].includes(item.status)?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button><button type="button" onClick={()=>editItem(item)} className="p-2 rounded-lg border border-slate-200"><Pencil className="w-4 h-4"/></button><button type="button" onClick={()=>deleteItem(item.id)} className="p-2 rounded-lg border border-slate-200 text-rose-500"><Trash2 className="w-4 h-4"/></button></div></div>)}</div>{editorOpen&&<ItemModal section={section} item={editing} setItem={setEditing} onClose={()=>setEditorOpen(false)} onSave={saveItem} saving={saving}/>}</div>}

function CloudPbxPackageFields({item,setItem}){
  const p=item?.payload||{};
  const set=(key,value)=>setItem({...item,payload:{...p,[key]:value}});
  const featureText=Array.isArray(p.features)?p.features.join('\n'):String(p.features||'');
  return <div className="rounded-2xl border border-[#2A835F]/20 bg-[#f4faf7] p-4 space-y-4">
    <div>
      <div className="font-black text-sm text-[#12544F]">Cloud PBX Package Controls</div>
      <p className="mt-1 text-sm text-slate-500">These fields directly control the Cloud PBX pricing cards and comparison table.</p>
    </div>
    <div className="grid md:grid-cols-3 gap-4">
      <Field label="Monthly Price (৳)" type="number" value={p.price??''} onChange={v=>set('price',Number(v)||0)} />
      <Field label="Billing Label" value={p.billing||''} onChange={v=>set('billing',v)} placeholder="Per Month" />
      <div className="flex items-end"><div className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5"><span className="text-sm font-black text-slate-700">Popular Plan</span><Toggle value={!!p.popular} onChange={()=>set('popular',!p.popular)} /></div></div>
    </div>
    <div className="grid md:grid-cols-2 gap-4">
      <Field label="Button Text" value={p.button_text||''} onChange={v=>set('button_text',v)} placeholder="Purchase Now" />
      <Field label="Button URL" value={p.button_url||''} onChange={v=>set('button_url',v)} placeholder="/packages" />
    </div>
    <TextArea label="Package Features (one per line)" rows={8} value={featureText} onChange={v=>set('features',String(v).split('\n').map(x=>x.trim()).filter(Boolean))} />
  </div>;
}

function ItemModal({section,item,setItem,onClose,onSave,saving,collectionLabel:collectionLabelProp}){
  const isFaq=section==='faq' || /_faq$/i.test(String(section||''));
  const isBlog=section==='blog';
  const isTest=section==='testimonials';
  const answerValue=isFaq?(item.answer ?? item.payload?.answer ?? item.description ?? item.content_html ?? ''):'';
  const setAnswer=(value)=>setItem({...item,answer:value,payload:{...(item.payload||{}),answer:value},description:value,content_html:''});
  const submit=()=>{ if(item?.__payloadError)return; const clean={...item}; delete clean.__payloadText; delete clean.__payloadError; onSave(clean); };
  return <div className="fixed inset-0 z-[70] bg-black/50 p-4 overflow-y-auto">
    <div className="min-h-full flex items-start justify-center py-10">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black">{item?.id?'Edit':'Add'} {isFaq?'FAQ':isBlog?'Blog Post':isTest?'Testimonial':(collectionLabelProp||'CMS Item')}</h3>
            <p className="text-sm text-slate-500 mt-1">{isFaq?'Manage the question, answer and active/inactive status shown on the landing page.':'Use the rich text editor for long-form content.'}</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400">✕</button>
        </div>
        {isFaq ? <>
          <Field label="Question" value={item.title} onChange={x=>setItem({...item,title:x})}/>
          <TextArea label="Answer" rows={6} value={answerValue} onChange={setAnswer} placeholder="Write the answer shown when the question is opened."/>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Sort Order" type="number" value={item.sort_order} onChange={x=>setItem({...item,sort_order:Number(x)||0})}/>
            <div>
              <label className="block text-sm font-black text-slate-700 mb-1.5">Status</label>
              <select value={item.status} onChange={(e)=>setItem({...item,status:e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm">
                <option value="active">Active</option><option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex items-end"><div className="w-full p-3 rounded-xl bg-slate-50 text-sm text-slate-500">Collection: <strong>{section}</strong></div></div>
          </div>
        </> : <>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Title" value={item.title} onChange={x=>setItem({...item,title:x})}/><Field label="Slug" value={item.slug} onChange={x=>setItem({...item,slug:x})}/>
            <CmsUpload label="Image" value={item.image_url} onChange={x=>setItem({...item,image_url:x})}/><Field label="Icon" value={item.icon} onChange={x=>setItem({...item,icon:x})}/>
            <Field label="Link URL" value={item.link_url} onChange={x=>setItem({...item,link_url:x})}/><Field label="Meta / Label" value={item.meta} onChange={x=>setItem({...item,meta:x})}/>
          </div>
          <TextArea label="Short Description" rows={3} value={item.description} onChange={x=>setItem({...item,description:x})}/>
          <RichTextEditor value={item.content_html || ''} onChange={(x)=>setItem({...item,content_html:x})}/>
          {section==='cloud_pbx_packages' && <CloudPbxPackageFields item={item} setItem={setItem}/>}
          <TextArea label="Structured Data JSON" rows={8} value={item.__payloadText!==undefined?item.__payloadText:JSON.stringify(item.payload||{},null,2)} onChange={x=>{try{setItem({...item,payload:JSON.parse(x||'{}'),__payloadText:undefined,__payloadError:''})}catch{setItem({...item,__payloadText:x,__payloadError:'Invalid JSON — fix before saving.'})}}} spellCheck={false}/>
          {item.__payloadError&&<div className="text-sm font-bold text-rose-600">{item.__payloadError}</div>}
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Sort Order" type="number" value={item.sort_order} onChange={x=>setItem({...item,sort_order:Number(x)||0})}/>
            <div><label className="block text-sm font-black text-slate-700 mb-1.5">Status</label><select value={item.status} onChange={(e)=>setItem({...item,status:e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm"><option value="active">Active</option><option value="inactive">Inactive</option><option value="draft">Draft</option><option value="published">Published</option></select></div>
            <div className="flex items-end"><div className="w-full p-3 rounded-xl bg-slate-50 text-sm text-slate-500">Collection: <strong>{section}</strong></div></div>
          </div>
        </>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl bg-slate-100 font-bold text-sm">Cancel</button>
          <button type="button" onClick={submit} disabled={saving} className="px-5 py-2.5 rounded-xl bg-[#12544F] text-white font-bold text-sm flex items-center gap-2"><Save className="w-4 h-4"/>{saving?'Saving…':'Save'}</button>
        </div>
      </div>
    </div>
  </div>
}

async function repairCloudPbxSections(pageId) {
  try {
    const r = await API.post(`/cms/admin/pages/${pageId}/repair-cloud-pbx`);
    return r.data?.sections || [];
  } catch (primaryError) {
    // Compatibility fallback for an older local server that does not expose
    // the dedicated repair endpoint. The normal create-section API is enough
    // to bootstrap the missing structure without overwriting existing rows.
    for (const [section_key, section_type, title, subtitle, sort_order, settings] of CLOUD_PBX_DEFAULT_SECTIONS) {
      try {
        await API.post(`/cms/admin/pages/${pageId}/sections`, {
          section_key,
          section_type,
          title,
          subtitle,
          content_html: '',
          settings,
          sort_order,
          status: 'active',
        });
      } catch (_sectionError) {
        // A duplicate or partially-existing section is safe to skip.
      }
    }
    try {
      const r = await API.get(`/cms/admin/pages/${pageId}/sections`);
      const sections = r.data?.sections || [];
      if (!sections.length) throw primaryError;
      return sections;
    } catch (readError) {
      throw readError;
    }
  }
}

function PageManager({pages,editing,setEditing,editorOpen,setEditorOpen,savePage,saving,togglePage,deletePage,onManageSections}){
  const newPage=()=>{setEditing({title:'',slug:'',template:'standard',content_html:'',featured_image:'',seo_title:'',seo_description:'',status:'draft',sort_order:0});setEditorOpen(true)};
  return (
    <div className="space-y-6">
      {/* Resources Hub Top Spotlight */}
      <div className="rounded-3xl bg-linear-to-r from-[#092328] to-[#12544F] p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Resources Knowledge Base CMS</span>
          </div>
          <h3 className="text-xl font-black">Dynamic Product Guides, FAQs & BTRC Compliance Hub</h3>
          <p className="text-sm text-white/80 mt-1 max-w-2xl leading-relaxed">
            Manage your step-by-step setup guides, expandable FAQ helpdesk categories, and official BTRC compliance directives with real-time editing.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/admin/cms/resources"
            className="px-5 py-2.5 rounded-xl bg-white text-[#092328] hover:bg-emerald-50 text-sm font-black transition shadow"
          >
            Open Resources Hub Manager →
          </Link>
        </div>
      </div>

      <div className="rounded-3xl bg-white border border-slate-200 p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-black text-[#092328]">Published & Draft Pages</h2>
            <p className="text-sm text-slate-500">Create standalone pages and publish them without code.</p>
          </div>
          <button type="button" onClick={newPage} className="px-4 py-2.5 rounded-xl bg-[#12544F] text-white font-bold text-sm flex items-center gap-2">
            <Plus className="w-4 h-4"/>Create Page
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-sm text-slate-400 border-b">
                <th className="p-3">Title</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p)=>{
                const isResourceSlug = ['product-guides', 'faq-helpdesk', 'compliance-btrc', 'resources', 'compliance'].includes(p.slug);
                const pagePath = p.slug === 'home' ? '/' : isResourceSlug ? `/resources/${p.slug}` : (p.slug.startsWith('/') ? p.slug : `/${p.slug}`);
                return (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-slate-50/60 transition">
                    <td className="p-3 font-bold text-[#092328]">
                      <div>{p.title}</div>
                      {isResourceSlug && (
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-black uppercase bg-[#12544F]/10 text-[#12544F]">
                          Resources Hub Page
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-500">
                      {pagePath}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black ${p.status==='published'?'bg-emerald-100 text-emerald-700':p.status==='inactive'?'bg-slate-100 text-slate-500':'bg-amber-100 text-amber-700'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {isResourceSlug ? (
                          <Link
                            to="/admin/cms/resources"
                            className="px-2.5 py-1.5 border border-[#12544F]/30 bg-[#12544F]/5 rounded-lg text-[11px] font-black text-[#12544F] hover:bg-[#12544F] hover:text-white transition"
                          >
                            Manage Hub
                          </Link>
                        ) : null}
                        <button type="button" onClick={()=>setEditing({...p})} className="p-2 border rounded-lg hover:bg-slate-100" title="Edit Metadata">
                          <Pencil className="w-4 h-4"/>
                        </button>
                        <button type="button" onClick={()=>onManageSections(p)} className="px-2.5 py-1.5 border rounded-lg text-[11px] font-bold text-[#12544F] hover:bg-slate-100">
                          Sections
                        </button>
                        {p.slug!=='home'&&<button type="button" onClick={()=>togglePage(p.id)} className="p-2 border rounded-lg hover:bg-slate-100" title="Toggle Status">{p.status==='published'?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>}
                        {p.slug!=='home'&&<button type="button" onClick={()=>deletePage(p.id)} className="p-2 border rounded-lg text-rose-500 hover:bg-rose-50" title="Delete Page"><Trash2 className="w-4 h-4"/></button>}
                        <Link to={pagePath} target="_blank" className="p-2 border rounded-lg text-[#12544F] hover:bg-slate-100" title="Open public page">
                          <Eye className="w-4 h-4"/>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {editorOpen||editing?.title!==undefined?<PageModal page={editing} setPage={setEditing} onClose={()=>{setEditorOpen(false);setEditing(null)}} onSave={savePage} saving={saving}/>:null}
      </div>
    </div>
  );
}

const SECTION_TYPES = [
  ['hero', 'Hero'],
  ['pricing', 'Pricing Cards'],
  ['comparison', 'Comparison Table'],
  ['image_text', 'Image + Text / Overview'],
  ['text_image_split', 'Text / Image Split (Layout Swap)'],
  ['feature_grid', 'Feature Grid'],
  ['core_features', 'Core Features Grid'],
  ['benefits', 'Benefits Grid'],
  ['benefits_grid', 'Benefits List (Icon + Text)'],
  ['stats_bar', 'Stats / Metrics Bar'],
  ['how_it_works', 'How It Works (Steps)'],
  ['who_its_for', "Who It's For / Target Audience"],
  ['use_cases', 'Use Cases Grid'],
  ['animated_flow', 'Animated Technical Flow (IVR / PBX)'],
  ['consultation', 'Consultation / Contact'],
  ['documents', 'Required Documents'],
  ['clients', 'Client Logos'],
  ['faq', 'FAQ Accordion'],
  ['cta', 'Call To Action'],
  ['cta_banner', 'CTA Banner (Full Width)'],
  ['solutions_grid', 'Solutions Grid (6 Use Cases)'],
  ['key_features', 'Key Features / Compliance Grid'],
  ['packages', 'Packages & Pricing Cards (3 Plans)'],
  ['why_choose', 'Why Choose Us / Advantage (2-Col Grid)'],
  ['final_cta', 'Final CTA Banner'],
  ['call_center_hero', 'Call Center Hero'],
  ['call_center_features', 'Call Center Feature Grid'],
  ['rich_text', 'Rich Text'],
];

const collectionLabel = (key='') => {
  const k = String(key);
  const labels = {
    cloud_pbx_packages:'Cloud PBX Packages',
    cloud_pbx_features:'Cloud PBX Features',
    cloud_pbx_benefits:'Cloud PBX Benefits',
    cloud_pbx_documents:'Cloud PBX Documents',
    cloud_pbx_clients:'Cloud PBX Clients',
    cloud_pbx_faq:'Cloud PBX FAQs',
    home_hero_slides:'Home Hero Slides',
    home_service_cards:'Home Service Cards',
    home_offerings:'Home Offerings',
    home_advantages:'Home Advantages',
    home_addons:'Home Add-ons',
    call_center_features:'Call Center Features',
  };
  return labels[k] || k || 'CMS Items';
};

function AnimatedFlowConfigurator({ settings, set }) {
  const steps = Array.isArray(settings.steps) ? settings.steps : [];
  const scenarios = Array.isArray(settings.scenarios) ? settings.scenarios : [];

  const updateStep = (index, key, value) => {
    const next = clone(steps);
    next[index] = { ...next[index], [key]: value };
    set('steps', next);
  };

  const addStep = () => {
    const next = [...steps, { id: steps.length + 1, title: 'New Flow Step', desc: 'Step description', icon: 'Cpu' }];
    set('steps', next);
  };

  const removeStep = (index) => {
    const next = steps.filter((_, i) => i !== index);
    set('steps', next);
  };

  const updateScenario = (index, key, value) => {
    const next = clone(scenarios);
    next[index] = { ...next[index], [key]: value };
    set('scenarios', next);
  };

  const addScenario = () => {
    const next = [...scenarios, { id: `scenario_${Date.now()}`, label: 'Custom Scenario', badge: 'RULE', branch: 'vip', description: 'Scenario description' }];
    set('scenarios', next);
  };

  const removeScenario = (index) => {
    const next = scenarios.filter((_, i) => i !== index);
    set('scenarios', next);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-black text-sm text-[#12544F]">Animated Technical Flow Configurator</div>
          <div className="text-sm text-slate-500">Configure visual flow stages and interactive simulation scenarios.</div>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-black uppercase text-slate-700">Pipeline Stages ({steps.length})</span>
          <button type="button" onClick={addStep} className="px-2.5 py-1 rounded-lg bg-[#12544F] text-white text-sm font-bold flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Stage
          </button>
        </div>
        {steps.map((st, i) => (
          <div key={i} className="p-3 rounded-xl border border-slate-200 bg-white grid md:grid-cols-12 gap-2 items-center">
            <div className="md:col-span-1 text-center font-bold text-sm text-slate-400">#{i + 1}</div>
            <div className="md:col-span-4">
              <input value={st.title || ''} onChange={(e) => updateStep(i, 'title', e.target.value)} placeholder="Stage Title" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm" />
            </div>
            <div className="md:col-span-5">
              <input value={st.desc || st.description || ''} onChange={(e) => updateStep(i, 'desc', e.target.value)} placeholder="Stage Subtitle / Description" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm" />
            </div>
            <div className="md:col-span-1">
              <input value={st.icon || 'Cpu'} onChange={(e) => updateStep(i, 'icon', e.target.value)} placeholder="Icon" className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-sm font-mono" title="Lucide icon name (e.g. PhoneIncoming, Cpu, GitBranch, UserCheck)" />
            </div>
            <div className="md:col-span-1 text-right">
              <button type="button" onClick={() => removeStep(i)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Scenarios List */}
      <div className="space-y-3 pt-2 border-t border-emerald-500/20">
        <div className="flex items-center justify-between">
          <span className="text-sm font-black uppercase text-slate-700">Interactive Scenarios ({scenarios.length})</span>
          <button type="button" onClick={addScenario} className="px-2.5 py-1 rounded-lg bg-[#12544F] text-white text-sm font-bold flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Scenario
          </button>
        </div>
        {scenarios.map((sc, i) => (
          <div key={i} className="p-3 rounded-xl border border-slate-200 bg-white grid md:grid-cols-12 gap-2 items-center">
            <div className="md:col-span-3">
              <input value={sc.label || ''} onChange={(e) => updateScenario(i, 'label', e.target.value)} placeholder="Scenario Label" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-bold" />
            </div>
            <div className="md:col-span-2">
              <input value={sc.badge || ''} onChange={(e) => updateScenario(i, 'badge', e.target.value)} placeholder="Badge" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm" />
            </div>
            <div className="md:col-span-6">
              <input value={sc.description || ''} onChange={(e) => updateScenario(i, 'description', e.target.value)} placeholder="Simulation Description" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm" />
            </div>
            <div className="md:col-span-1 text-right">
              <button type="button" onClick={() => removeScenario(i)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonConfigurator({ settings, set }) {
  const hasComparisonTable = Array.isArray(settings.comparison_table);
  const rows = hasComparisonTable
    ? settings.comparison_table
    : Array.isArray(settings.rows)
    ? settings.rows
    : [];

  const updateRow = (index, key, value) => {
    const next = clone(rows);
    next[index] = { ...next[index], [key]: value };
    if (hasComparisonTable || next.some(r => r.mybdphone !== undefined)) {
      set('comparison_table', next);
    } else {
      set('rows', next);
    }
  };

  const addRow = () => {
    if (hasComparisonTable || rows.some(r => r.mybdphone !== undefined)) {
      const next = [...rows, { traditional: 'Traditional behavior', mybdphone: 'MyBDPhone modern solution' }];
      set('comparison_table', next);
    } else {
      const next = [...rows, { metric: 'New Feature Metric', traditional: 'Traditional behavior', ai: 'AI Agent capability', winner: 'ai' }];
      set('rows', next);
    }
  };

  const removeRow = (index) => {
    const next = rows.filter((_, i) => i !== index);
    if (hasComparisonTable || next.some(r => r.mybdphone !== undefined)) {
      set('comparison_table', next);
    } else {
      set('rows', next);
    }
  };

  const isMybdphoneKey = hasComparisonTable || rows.some(r => r.mybdphone !== undefined);

  return (
    <div className="space-y-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-black text-sm text-blue-900">Side-by-Side Comparison Table ({rows.length} Rows)</div>
          <div className="text-sm text-slate-500">Configure traditional phone system vs MyBDPhone comparison rows.</div>
        </div>
        <button type="button" onClick={addRow} className="px-2.5 py-1 rounded-lg bg-[#12544F] text-white text-sm font-bold flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add Row
        </button>
      </div>

      {!isMybdphoneKey && (
        <div className="grid md:grid-cols-2 gap-3">
          <Field label="Left Column Header (Traditional)" value={settings.col_traditional || ''} onChange={v => set('col_traditional', v)} placeholder="Traditional Keypad IVR" />
          <Field label="Right Column Header (AI Voice)" value={settings.col_ai || ''} onChange={v => set('col_ai', v)} placeholder="MyBDPhone AI Voice Automation" />
        </div>
      )}

      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="p-3 rounded-xl border border-slate-200 bg-white grid md:grid-cols-12 gap-2 items-center">
            {!isMybdphoneKey && (
              <div className="md:col-span-3">
                <input value={row.metric || ''} onChange={(e) => updateRow(i, 'metric', e.target.value)} placeholder="Feature / Metric" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-bold" />
              </div>
            )}
            <div className={isMybdphoneKey ? 'md:col-span-5' : 'md:col-span-4'}>
              <label className="block text-[10px] font-bold text-rose-800 mb-0.5">Traditional System</label>
              <input value={row.traditional || ''} onChange={(e) => updateRow(i, 'traditional', e.target.value)} placeholder="Traditional Behavior" className="w-full px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50/40 text-sm text-slate-700" />
            </div>
            <div className={isMybdphoneKey ? 'md:col-span-6' : 'md:col-span-4'}>
              <label className="block text-[10px] font-bold text-emerald-800 mb-0.5">MyBDPhone Solution</label>
              <input value={row.mybdphone ?? row.ai ?? ''} onChange={(e) => updateRow(i, isMybdphoneKey ? 'mybdphone' : 'ai', e.target.value)} placeholder="MyBDPhone Capability" className="w-full px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50/40 text-sm text-emerald-950 font-bold" />
            </div>
            <div className="md:col-span-1 text-right self-end pb-1">
              <button type="button" onClick={() => removeRow(i)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MainBenefitsConfigurator({ settings, set }) {
  const benefits = Array.isArray(settings.benefits) ? settings.benefits : [];

  const updateBenefit = (index, key, value) => {
    const next = clone(benefits);
    next[index] = { ...next[index], [key]: value };
    set('benefits', next);
  };

  const addBenefit = () => {
    const next = [...benefits, {
      num: benefits.length < 9 ? `0${benefits.length + 1}` : `${benefits.length + 1}`,
      title: 'New Benefit Title',
      desc: 'Short explanation of the benefit.',
      icon: 'Layers'
    }];
    set('benefits', next);
  };

  const removeBenefit = (index) => {
    const next = benefits.filter((_, i) => i !== index);
    set('benefits', next);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-black text-sm text-[#12544F]">Main Benefits Cards ({benefits.length})</div>
          <div className="text-sm text-slate-500">Configure benefit number, title, description, and Lucide icon.</div>
        </div>
        <button type="button" onClick={addBenefit} className="px-2.5 py-1 rounded-lg bg-[#12544F] text-white text-sm font-bold flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add Benefit Card
        </button>
      </div>

      <div className="space-y-3">
        {benefits.map((b, i) => (
          <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-white grid md:grid-cols-12 gap-2 items-center">
            <div className="md:col-span-1">
              <input value={b.num || `0${i + 1}`} onChange={(e) => updateBenefit(i, 'num', e.target.value)} placeholder="01" className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-sm font-bold text-center" />
            </div>
            <div className="md:col-span-4">
              <input value={b.title || ''} onChange={(e) => updateBenefit(i, 'title', e.target.value)} placeholder="Benefit Title" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-bold" />
            </div>
            <div className="md:col-span-5">
              <input value={b.desc || b.description || ''} onChange={(e) => updateBenefit(i, 'desc', e.target.value)} placeholder="Description" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm" />
            </div>
            <div className="md:col-span-1">
              <input value={b.icon || 'Layers'} onChange={(e) => updateBenefit(i, 'icon', e.target.value)} placeholder="Icon" className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-sm font-mono" title="Icon name (e.g. Layers, Smile, TrendingUp, Smartphone, ShieldCheck, Headphones)" />
            </div>
            <div className="md:col-span-1 text-right">
              <button type="button" onClick={() => removeBenefit(i)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TargetAudienceConfigurator({ settings, set }) {
  const audiences = Array.isArray(settings.audiences) ? settings.audiences : [];

  const updateAudience = (index, key, value) => {
    const next = clone(audiences);
    next[index] = { ...next[index], [key]: value };
    set('audiences', next);
  };

  const addAudience = () => {
    const next = [...audiences, {
      title: 'Audience / Team Name',
      desc: 'Why MyBDPhone is tailored for this team.',
      tag: 'Perfect for teams'
    }];
    set('audiences', next);
  };

  const removeAudience = (index) => {
    const next = audiences.filter((_, i) => i !== index);
    set('audiences', next);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-black text-sm text-[#12544F]">Target Audience Cards ({audiences.length})</div>
          <div className="text-sm text-slate-500">Configure target segment cards, descriptions, and pill tags.</div>
        </div>
        <button type="button" onClick={addAudience} className="px-2.5 py-1 rounded-lg bg-[#12544F] text-white text-sm font-bold flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add Audience Card
        </button>
      </div>

      <div className="space-y-3">
        {audiences.map((aud, i) => (
          <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-white grid md:grid-cols-12 gap-2 items-center">
            <div className="md:col-span-3">
              <input value={aud.title || ''} onChange={(e) => updateAudience(i, 'title', e.target.value)} placeholder="Startup / Small Business" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-bold" />
            </div>
            <div className="md:col-span-5">
              <input value={aud.desc || aud.description || ''} onChange={(e) => updateAudience(i, 'desc', e.target.value)} placeholder="Description" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm" />
            </div>
            <div className="md:col-span-3">
              <input value={aud.tag || ''} onChange={(e) => updateAudience(i, 'tag', e.target.value)} placeholder="Perfect for small teams" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold text-emerald-800" />
            </div>
            <div className="md:col-span-1 text-right">
              <button type="button" onClick={() => removeAudience(i)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrustNumbersConfigurator({ settings, set }) {
  const stats = Array.isArray(settings.stats) ? settings.stats : [];

  const updateStat = (index, key, value) => {
    const next = clone(stats);
    next[index] = { ...next[index], [key]: value };
    set('stats', next);
  };

  const addStat = () => {
    const next = [...stats, { value: '100%', label: 'Metric Label' }];
    set('stats', next);
  };

  const removeStat = (index) => {
    const next = stats.filter((_, i) => i !== index);
    set('stats', next);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-black text-sm text-[#12544F]">Trust & Verified Stats ({stats.length})</div>
          <div className="text-sm text-slate-500">Configure key numbers, metrics, and labels.</div>
        </div>
        <button type="button" onClick={addStat} className="px-2.5 py-1 rounded-lg bg-[#12544F] text-white text-sm font-bold flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add Metric Stat
        </button>
      </div>

      <div className="space-y-3">
        {stats.map((st, i) => (
          <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-white grid md:grid-cols-12 gap-2 items-center">
            <div className="md:col-span-4">
              <input value={st.value || ''} onChange={(e) => updateStat(i, 'value', e.target.value)} placeholder="e.g. 10K+ / 99.9%" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-black font-mono" />
            </div>
            <div className="md:col-span-7">
              <input value={st.label || ''} onChange={(e) => updateStat(i, 'label', e.target.value)} placeholder="Active Users / Uptime" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm" />
            </div>
            <div className="md:col-span-1 text-right">
              <button type="button" onClick={() => removeStat(i)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FloatingCardsConfigurator({ settings, set }) {
  const cards = Array.isArray(settings.floating_cards) ? settings.floating_cards : [];

  const updateCard = (index, value) => {
    const next = [...cards];
    next[index] = value;
    set('floating_cards', next);
  };

  const addCard = () => {
    const next = [...cards, '✓ New Feature Point'];
    set('floating_cards', next);
  };

  const removeCard = (index) => {
    const next = cards.filter((_, i) => i !== index);
    set('floating_cards', next);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-black text-sm text-[#12544F]">Hero Floating Checklist Cards ({cards.length})</div>
          <div className="text-sm text-slate-500">Highlight key selling points on the Hero visual card.</div>
        </div>
        <button type="button" onClick={addCard} className="px-2.5 py-1 rounded-lg bg-[#12544F] text-white text-sm font-bold flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add Point
        </button>
      </div>

      <div className="space-y-2">
        {cards.map((card, i) => (
          <div key={i} className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center gap-2">
            <input value={card || ''} onChange={(e) => updateCard(i, e.target.value)} placeholder="✓ Easy to Manage" className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-bold" />
            <button type="button" onClick={() => removeCard(i)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AudioDemoConfigurator({ settings, set }) {
  const samples = Array.isArray(settings.samples) ? settings.samples : [];

  const updateSample = (index, key, value) => {
    const next = clone(samples);
    next[index] = { ...next[index], [key]: value };
    set('samples', next);
  };

  const addSample = () => {
    const next = [...samples, {
      id: `sample_${Date.now()}`,
      title: 'Call Recording Title',
      agent: 'Agent Name',
      caller_id: '+880 1700-000000',
      call_type: 'Inbound Call',
      department: 'Support & Quality',
      role: 'Role Title',
      duration: '0:15',
      audio_url: '',
      bangla_script: '',
      english_script: ''
    }];
    set('samples', next);
  };

  const removeSample = (index) => {
    const next = samples.filter((_, i) => i !== index);
    set('samples', next);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-black text-sm text-purple-900">Call Recording Samples Configurator</div>
          <div className="text-sm text-slate-500">Configure call recordings, audio tracks, caller IDs, and dialogue transcripts.</div>
        </div>
        <button type="button" onClick={addSample} className="px-2.5 py-1 rounded-lg bg-[#12544F] text-white text-sm font-bold flex items-center gap-1 cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Add Audio Track
        </button>
      </div>

      <div className="space-y-4">
        {samples.map((sample, i) => (
          <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-black text-sm text-purple-900">Track #{i + 1}: {sample.title || sample.name || 'Untitled'}</span>
              <button type="button" onClick={() => removeSample(i)} className="text-sm text-rose-600 font-bold hover:underline cursor-pointer">
                Delete Sample
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-2">
              <Field label="Call Title" value={sample.title || sample.name || ''} onChange={v => { updateSample(i, 'title', v); updateSample(i, 'name', v); }} placeholder="e.g. Order Confirmation" />
              <Field label="Agent / Role" value={sample.agent || sample.role || ''} onChange={v => { updateSample(i, 'agent', v); updateSample(i, 'role', v); }} placeholder="e.g. Tanvir (Senior Rep)" />
              <Field label="Duration" value={sample.duration || ''} onChange={v => updateSample(i, 'duration', v)} placeholder="e.g. 0:15" />
            </div>
            <div className="grid md:grid-cols-3 gap-2">
              <Field label="Caller ID (optional)" value={sample.caller_id || ''} onChange={v => updateSample(i, 'caller_id', v)} placeholder="e.g. +880 1712-345678" />
              <Field label="Call Type (optional)" value={sample.call_type || ''} onChange={v => updateSample(i, 'call_type', v)} placeholder="e.g. Inbound Call" />
              <Field label="Department / Tag" value={sample.department || ''} onChange={v => updateSample(i, 'department', v)} placeholder="e.g. Sales & Billing" />
            </div>
            <Field label="Audio File URL / Path" value={sample.audio_url || ''} onChange={v => updateSample(i, 'audio_url', v)} placeholder="/uploads/audio/tanvir.mp3 or https://..." />
            <div className="grid md:grid-cols-2 gap-2">
              <TextArea label="Dialogue Script / Transcript (Bangla)" rows={2} value={sample.bangla_script || ''} onChange={v => updateSample(i, 'bangla_script', v)} placeholder="অডিও স্ক্রিপ্ট লিখুন..." />
              <TextArea label="English Notes / Translation" rows={2} value={sample.english_script || ''} onChange={v => updateSample(i, 'english_script', v)} placeholder="Dialogue notes or translation..." />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepsConfigurator({ settings, set }) {
  const steps = Array.isArray(settings.steps) ? settings.steps : [];

  const updateStep = (index, key, value) => {
    const next = clone(steps);
    next[index] = { ...next[index], [key]: value };
    set('steps', next);
  };

  const addStep = () => {
    const next = [...steps, { step: `0${steps.length + 1}`, title: 'Step Title', desc: 'Step description', icon: 'Sparkles' }];
    set('steps', next);
  };

  const removeStep = (index) => {
    const next = steps.filter((_, i) => i !== index);
    set('steps', next);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-black text-sm text-[#12544F]">Step-by-Step Flow Cards Configurator</div>
          <div className="text-sm text-slate-500">Configure pipeline flow stages, numbers, descriptions, and icons.</div>
        </div>
        <button type="button" onClick={addStep} className="px-2.5 py-1 rounded-lg bg-[#12544F] text-white text-sm font-bold flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add Step
        </button>
      </div>

      <div className="space-y-3">
        {steps.map((st, i) => (
          <div key={i} className="p-3 rounded-xl border border-slate-200 bg-white grid md:grid-cols-12 gap-2 items-center">
            <div className="md:col-span-1">
              <input value={st.step || `0${i + 1}`} onChange={(e) => updateStep(i, 'step', e.target.value)} placeholder="01" className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-sm font-bold text-center" />
            </div>
            <div className="md:col-span-4">
              <input value={st.title || ''} onChange={(e) => updateStep(i, 'title', e.target.value)} placeholder="Step Title" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-bold" />
            </div>
            <div className="md:col-span-5">
              <input value={st.desc || st.description || ''} onChange={(e) => updateStep(i, 'desc', e.target.value)} placeholder="Description" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm" />
            </div>
            <div className="md:col-span-1">
              <input value={st.icon || 'Sparkles'} onChange={(e) => updateStep(i, 'icon', e.target.value)} placeholder="Icon" className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-sm font-mono" title="Icon name (e.g. PhoneIncoming, AudioWaveform, Cpu, Sparkles)" />
            </div>
            <div className="md:col-span-1 text-right">
              <button type="button" onClick={() => removeStep(i)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SolutionsGridConfigurator({ settings, set }) {
  const solutions = Array.isArray(settings.solutions) ? settings.solutions : [];

  const update = (index, key, value) => {
    const next = clone(solutions);
    next[index] = { ...next[index], [key]: value };
    set('solutions', next);
  };

  const add = () => {
    const next = [...solutions, { title: 'New Solution', desc: 'Solution description...', icon: 'Building2' }];
    set('solutions', next);
  };

  const remove = (index) => {
    const next = solutions.filter((_, i) => i !== index);
    set('solutions', next);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-black text-sm text-[#12544F]">Financial Solutions Grid Configurator (6 Use Cases)</div>
          <div className="text-sm text-slate-500">Configure core use cases, descriptions, and icons.</div>
        </div>
        <button type="button" onClick={add} className="px-2.5 py-1 rounded-lg bg-[#12544F] text-white text-sm font-bold flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add Solution
        </button>
      </div>

      <div className="space-y-3">
        {solutions.map((sol, i) => (
          <div key={i} className="p-3 rounded-xl border border-slate-200 bg-white grid md:grid-cols-12 gap-2 items-center">
            <div className="md:col-span-1 text-center font-bold text-sm text-slate-400">#{i + 1}</div>
            <div className="md:col-span-4">
              <input value={sol.title || ''} onChange={(e) => update(i, 'title', e.target.value)} placeholder="Solution Title" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-bold" />
            </div>
            <div className="md:col-span-5">
              <input value={sol.desc || sol.description || ''} onChange={(e) => update(i, 'desc', e.target.value)} placeholder="Short Description" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm" />
            </div>
            <div className="md:col-span-1">
              <input value={sol.icon || 'Building2'} onChange={(e) => update(i, 'icon', e.target.value)} placeholder="Icon" className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-sm font-mono" title="Icon name (e.g. Building2, Server, PhoneCall, Headphones, CreditCard, ShieldCheck)" />
            </div>
            <div className="md:col-span-1 text-right">
              <button type="button" onClick={() => remove(i)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KeyFeaturesConfigurator({ settings, set }) {
  const features = Array.isArray(settings.features) ? settings.features : [];

  const update = (index, key, value) => {
    const next = clone(features);
    next[index] = { ...next[index], [key]: value };
    set('features', next);
  };

  const add = () => {
    const next = [...features, { title: 'New Feature', desc: 'Feature description...', icon: 'ShieldCheck' }];
    set('features', next);
  };

  const remove = (index) => {
    const next = features.filter((_, i) => i !== index);
    set('features', next);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-black text-sm text-[#12544F]">Key Security & Compliance Features Configurator</div>
          <div className="text-sm text-slate-500">Configure security feature cards, descriptions, and icons.</div>
        </div>
        <button type="button" onClick={add} className="px-2.5 py-1 rounded-lg bg-[#12544F] text-white text-sm font-bold flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add Feature
        </button>
      </div>

      <div className="space-y-3">
        {features.map((feat, i) => (
          <div key={i} className="p-3 rounded-xl border border-slate-200 bg-white grid md:grid-cols-12 gap-2 items-center">
            <div className="md:col-span-1 text-center font-bold text-sm text-slate-400">#{i + 1}</div>
            <div className="md:col-span-4">
              <input value={feat.title || ''} onChange={(e) => update(i, 'title', e.target.value)} placeholder="Feature Title" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-bold" />
            </div>
            <div className="md:col-span-5">
              <input value={feat.desc || feat.description || ''} onChange={(e) => update(i, 'desc', e.target.value)} placeholder="Short Description" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm" />
            </div>
            <div className="md:col-span-1">
              <input value={feat.icon || 'Mic'} onChange={(e) => update(i, 'icon', e.target.value)} placeholder="Icon" className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-sm font-mono" title="Icon name (e.g. Mic, FileText, Users, Bot, Zap, Eye)" />
            </div>
            <div className="md:col-span-1 text-right">
              <button type="button" onClick={() => remove(i)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PackagesConfigurator({ settings, set }) {
  const packages = Array.isArray(settings.packages) ? settings.packages : [];

  const update = (index, key, value) => {
    const next = clone(packages);
    next[index] = { ...next[index], [key]: value };
    set('packages', next);
  };

  const add = () => {
    const next = [
      ...packages,
      {
        name: 'New Package',
        price: '৳4,999',
        period: '/month',
        features: ['1 Virtual/IP Number', '5 Agent Extensions', 'Call Recording'],
        cta: 'Choose Plan',
        popular: false
      }
    ];
    set('packages', next);
  };

  const remove = (index) => {
    const next = packages.filter((_, i) => i !== index);
    set('packages', next);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-black text-sm text-[#12544F]">FinTech Tailored Packages Configurator</div>
          <div className="text-sm text-slate-500">Configure plan names, prices, feature checklists, and highlight popular plan.</div>
        </div>
        <button type="button" onClick={add} className="px-2.5 py-1 rounded-lg bg-[#12544F] text-white text-sm font-bold flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add Package
        </button>
      </div>

      <div className="space-y-4">
        {packages.map((pkg, i) => (
          <div key={i} className={`p-4 rounded-xl border bg-white space-y-3 ${pkg.popular ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-200'}`}>
            <div className="grid md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-3">
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Package Name</label>
                <input value={pkg.name || ''} onChange={(e) => update(i, 'name', e.target.value)} placeholder="FinTech Starter" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-bold" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Price Rate</label>
                <input value={pkg.price || ''} onChange={(e) => update(i, 'price', e.target.value)} placeholder="৳2,999" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-bold text-emerald-700" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Billing Period</label>
                <input value={pkg.period ?? '/month'} onChange={(e) => update(i, 'period', e.target.value)} placeholder="/month" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 mb-1">CTA Button Text</label>
                <input value={pkg.cta || 'Choose Package'} onChange={(e) => update(i, 'cta', e.target.value)} placeholder="Choose Starter" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm" />
              </div>
              <div className="md:col-span-2 flex items-center justify-center gap-2 pt-4">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={Boolean(pkg.popular)} onChange={(e) => update(i, 'popular', e.target.checked)} className="rounded text-emerald-600 focus:ring-emerald-500" />
                  <span>Popular</span>
                </label>
              </div>
              <div className="md:col-span-1 text-right pt-4">
                <button type="button" onClick={() => remove(i)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg" title="Delete Plan">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Features Included (one per line)</label>
              <textarea
                rows={3}
                value={Array.isArray(pkg.features) ? pkg.features.join('\n') : pkg.features || ''}
                onChange={(e) => update(i, 'features', e.target.value.split('\n').filter(Boolean))}
                placeholder="1 Virtual/IP Number&#10;Up to 5 Agent Extensions&#10;Call Recording (30 Days)"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-sans"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WhyChooseConfigurator({ settings, set }) {
  const points = Array.isArray(settings.points) ? settings.points : [];

  const update = (index, key, value) => {
    const next = clone(points);
    next[index] = { ...next[index], [key]: value };
    set('points', next);
  };

  const add = () => {
    const next = [...points, { title: 'New Trust Point', desc: 'Description of why clients trust MyBDPhone...' }];
    set('points', next);
  };

  const remove = (index) => {
    const next = points.filter((_, i) => i !== index);
    set('points', next);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-black text-sm text-[#12544F]">Why Choose MyBDPhone (Trust Points Grid)</div>
          <div className="text-sm text-slate-500">Configure key reliability and security points.</div>
        </div>
        <button type="button" onClick={add} className="px-2.5 py-1 rounded-lg bg-[#12544F] text-white text-sm font-bold flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add Point
        </button>
      </div>

      <div className="space-y-3">
        {points.map((pt, i) => (
          <div key={i} className="p-3 rounded-xl border border-slate-200 bg-white grid md:grid-cols-12 gap-2 items-center">
            <div className="md:col-span-1 text-center font-bold text-sm text-slate-400">0{i + 1}</div>
            <div className="md:col-span-4">
              <input value={pt.title || ''} onChange={(e) => update(i, 'title', e.target.value)} placeholder="Point Title" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-bold" />
            </div>
            <div className="md:col-span-6">
              <input value={pt.desc || pt.description || ''} onChange={(e) => update(i, 'desc', e.target.value)} placeholder="Description" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm" />
            </div>
            <div className="md:col-span-1 text-right">
              <button type="button" onClick={() => remove(i)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionSettingsFields({editing,setEditing}) {
  const settings=parseJson(editing?.settings || editing?.custom_settings, {});
  const set=(k,v)=>setEditing((prev)=>{
    const nextSettings = { ...parseJson(prev.settings || prev.custom_settings, {}), [k]: v };
    return {
      ...prev,
      settings: nextSettings,
      custom_settings: nextSettings,
    };
  });
  const setJson=(text)=>{
    try { 
      const parsed = JSON.parse(text || '{}');
      setEditing((prev)=>({
        ...prev,
        settings: parsed,
        custom_settings: parsed,
        __settingsError: '',
        __settingsText: undefined,
      })); 
    }
    catch { 
      setEditing((prev)=>({
        ...prev,
        __settingsText: text,
        __settingsError: 'Invalid JSON — please fix the JSON syntax before saving.',
      })); 
    }
  };
  const settingsText=editing?.__settingsText!==undefined ? editing.__settingsText : JSON.stringify(settings,null,2);
  const isAnimatedFlow = String(editing.section_type || '').toLowerCase().includes('animated') || editing.section_key === 'animated_flow';

  return <div className="space-y-4">
    <div className="rounded-2xl border border-[#2A835F]/20 bg-[#f4faf7] p-4">
      <div className="font-black text-[#12544F] text-sm">Dynamic Section & Layout Controls</div>
      <div className="text-sm text-slate-500 mt-1">Configure layout orientation (Image Left vs Right), image URLs, buttons, badges, and interactive technical flows.</div>
    </div>

    {/* Layout Orientation Toggle */}
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
      <label className="block text-sm font-black text-slate-700">Layout Orientation (Image / Content Swap)</label>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            set('layout_orientation', 'IMAGE_LEFT');
            set('image_position', 'left');
            setEditing((prev) => ({ ...prev, layout_orientation: 'IMAGE_LEFT' }));
          }}
          className={`py-2.5 px-4 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${
            (editing.layout_orientation || settings.layout_orientation || settings.image_position) === 'IMAGE_LEFT' || settings.image_position === 'left'
              ? 'bg-[#12544F] text-white border-[#12544F] shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span>← Image Left (Content Right)</span>
        </button>
        <button
          type="button"
          onClick={() => {
            set('layout_orientation', 'IMAGE_RIGHT');
            set('image_position', 'right');
            setEditing((prev) => ({ ...prev, layout_orientation: 'IMAGE_RIGHT' }));
          }}
          className={`py-2.5 px-4 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${
            (editing.layout_orientation || settings.layout_orientation || settings.image_position) === 'IMAGE_RIGHT' || (!editing.layout_orientation && settings.image_position !== 'left')
              ? 'bg-[#12544F] text-white border-[#12544F] shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span>Image Right (Content Left) →</span>
        </button>
      </div>
    </div>

    {/* Specialized Flow Configurator for Animated Technical Flows */}
    {isAnimatedFlow && (
      <AnimatedFlowConfigurator settings={settings} set={set} />
    )}

    {/* Hero Floating Checklist Cards Configurator */}
    {(Array.isArray(settings.floating_cards) || editing.section_key === 'hero' || editing.section_type === 'HERO') && (
      <FloatingCardsConfigurator settings={settings} set={set} />
    )}

    {/* Main Benefits Cards Configurator */}
    {(Array.isArray(settings.benefits) || ['MAIN_BENEFITS', 'BENEFITS', 'BENEFITS_GRID'].includes(String(editing.section_type || '').toUpperCase()) || editing.section_key?.includes('benefit')) && (
      <MainBenefitsConfigurator settings={settings} set={set} />
    )}

    {/* Comparison Table Configurator */}
    {(Array.isArray(settings.comparison_table) || Array.isArray(settings.rows) || String(editing.section_type || '').toLowerCase().includes('comparison') || editing.section_key?.includes('comparison')) && (
      <ComparisonConfigurator settings={settings} set={set} />
    )}

    {/* Target Audience / Who It's For Cards Configurator */}
    {(Array.isArray(settings.audiences) || ['TARGET_AUDIENCE', 'WHO_ITS_FOR', 'AUDIENCES', 'USE_CASES'].includes(String(editing.section_type || '').toUpperCase()) || editing.section_key?.includes('audience') || editing.section_key?.includes('who')) && (
      <TargetAudienceConfigurator settings={settings} set={set} />
    )}

    {/* Trust Numbers & Stats Configurator */}
    {(Array.isArray(settings.stats) || String(editing.section_type || '').toUpperCase() === 'TRUST_NUMBERS' || editing.section_key?.includes('trust') || editing.section_key?.includes('stat')) && (
      <TrustNumbersConfigurator settings={settings} set={set} />
    )}

    {/* Call Recording Samples Configurator */}
    {(String(editing.section_type || '').toLowerCase().includes('recording') || editing.section_key?.includes('recording')) && (
      <AudioDemoConfigurator settings={settings} set={set} />
    )}

    {/* Step Flow Configurator */}
    {(Array.isArray(settings.steps) || String(editing.section_type || '').toLowerCase().includes('step') || String(editing.section_type || '').toLowerCase().includes('how') || editing.section_key?.includes('step') || editing.section_key?.includes('how') || editing.section_key?.includes('flow')) && !isAnimatedFlow && (
      <StepsConfigurator settings={settings} set={set} />
    )}

    {/* Financial Solutions Grid Configurator */}
    {(Array.isArray(settings.solutions) || String(editing.section_type || '').toUpperCase() === 'SOLUTIONS_GRID' || editing.section_key === 'solutions_grid') && (
      <SolutionsGridConfigurator settings={settings} set={set} />
    )}

    {/* Key / Core Features Configurator */}
    {(Array.isArray(settings.features) || ['KEY_FEATURES', 'CORE_FEATURES', 'FEATURE_GRID'].includes(String(editing.section_type || '').toUpperCase()) || editing.section_key?.includes('feature')) && (
      <KeyFeaturesConfigurator settings={settings} set={set} />
    )}

    {/* Packages / Pricing Configurator */}
    {(Array.isArray(settings.packages) || String(editing.section_type || '').toUpperCase() === 'PACKAGES' || editing.section_key === 'packages') && (
      <PackagesConfigurator settings={settings} set={set} />
    )}

    {/* Why Choose Points Configurator */}
    {(Array.isArray(settings.points) || String(editing.section_type || '').toUpperCase() === 'WHY_CHOOSE' || editing.section_key === 'why_choose') && (
      <WhyChooseConfigurator settings={settings} set={set} />
    )}

    <div className="grid md:grid-cols-2 gap-4">
      <Field label="Collection Key (optional)" value={settings.collection_key||''} onChange={v=>set('collection_key',v)} placeholder="cloud_pbx_features"/>
      <Field label="Grid Columns (2, 3, or 4)" type="number" value={settings.columns||''} onChange={v=>set('columns',Number(v)||undefined)} placeholder="4"/>
      
      <CmsUpload label="Section Media Image" value={editing.image_url || settings.image_url || settings.image || ''} onChange={v=>{
        set('image_url',v);
        setEditing((prev)=>({...prev, image_url: v}));
      }}/>
      <Field label="Eyebrow / Small Heading" value={settings.eyebrow||''} onChange={v=>set('eyebrow',v)}/>
      <Field label="Primary Button Text" value={settings.primary_text || settings.primary_btn?.text || ''} onChange={v=>{
        set('primary_text',v);
        set('primary_btn', { ...(typeof settings.primary_btn === 'object' ? settings.primary_btn : {}), text: v });
      }}/>
      <Field label="Primary Button URL" value={settings.primary_url || settings.primary_btn?.url || ''} onChange={v=>{
        set('primary_url',v);
        set('primary_btn', { ...(typeof settings.primary_btn === 'object' ? settings.primary_btn : {}), url: v });
      }}/>
      <Field label="Secondary Button Text" value={settings.secondary_text || settings.secondary_btn?.text || ''} onChange={v=>{
        set('secondary_text',v);
        set('secondary_btn', { ...(typeof settings.secondary_btn === 'object' ? settings.secondary_btn : {}), text: v });
      }}/>
      <Field label="Secondary Button URL" value={settings.secondary_url || settings.secondary_btn?.url || ''} onChange={v=>{
        set('secondary_url',v);
        set('secondary_btn', { ...(typeof settings.secondary_btn === 'object' ? settings.secondary_btn : {}), url: v });
      }}/>
      <Field label="Phone Hotline" value={settings.phone||''} onChange={v=>set('phone',v)}/>
      <Field label="Operational Hours" value={settings.hours||''} onChange={v=>set('hours',v)}/>
      <div className="md:col-span-2">
        <TextArea label="Badges / Small Highlights (one per line)" rows={3} value={Array.isArray(settings.badges)?settings.badges.join('\n'):settings.badges||''} onChange={v=>set('badges',String(v).split('\n').map(x=>x.trim()).filter(Boolean))}/>
      </div>
    </div>

    <div>
      <TextArea label="Advanced JSON Configurator (custom_settings)" rows={10} value={settingsText} onChange={setJson} spellCheck={false}/>
      {editing?.__settingsError && <div className="mt-1 text-sm font-bold text-rose-600">{editing.__settingsError}</div>}
    </div>
    {settings.collection_key && <div className="rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm text-slate-500">Linked collection: <strong className="text-[#12544F]">{collectionLabel(settings.collection_key)}</strong>. After saving, use <strong>Manage Items</strong> beside this section.</div>}
  </div>;
}

function CollectionItemsModal({collectionKey,onClose}) {
  const [items,setItems]=React.useState([]); const [editing,setEditing]=React.useState(null); const [saving,setSaving]=React.useState(false); const [error,setError]=React.useState('');
  const load=async()=>{try{const r=await API.get(`/cms/admin/items/${encodeURIComponent(collectionKey)}`);setItems((r.data?.items||[]).map(x=>({...x,payload:parseJson(x.payload,{})})));}catch(e){setError(e.response?.data?.message||'Failed to load collection')}};
  React.useEffect(()=>{load()},[collectionKey]);
  const add=()=>setEditing({title:'',slug:'',description:'',content_html:'',image_url:'',icon:'',link_url:'',meta:'',sort_order:items.length+1,status:'active',payload:{}});
  const save=async()=>{if(!editing?.title?.trim())return setError('Title is required');setSaving(true);setError('');try{const body={...editing,collection_key:collectionKey};if(editing.id)await API.put(`/cms/admin/items/${editing.id}`,body);else await API.post('/cms/admin/items',body);setEditing(null);await load();}catch(e){setError(e.response?.data?.message||'Failed to save item')}finally{setSaving(false)}};
  const toggle=async(id)=>{try{await API.put(`/cms/admin/items/${id}/toggle`);await load()}catch(e){setError(e.response?.data?.message||'Failed to change status')}};
  const del=async(id)=>{if(!window.confirm('Delete this CMS item?'))return;try{await API.delete(`/cms/admin/items/${id}`);await load()}catch(e){setError(e.response?.data?.message||'Failed to delete item')}};
  const move=async(i,d)=>{const next=clone(items);const j=i+d;if(j<0||j>=next.length)return;[next[i],next[j]]=[next[j],next[i]];next.forEach((x,k)=>x.sort_order=k+1);setItems(next);try{await API.put('/cms/admin/items/reorder',{items:next.map(x=>({id:x.id,sort_order:x.sort_order}))})}catch(e){setError(e.response?.data?.message||'Failed to reorder items');await load()}};
  return <div className="fixed inset-0 z-[85] bg-black/50 p-4 overflow-y-auto"><div className="min-h-full flex items-start justify-center py-8"><div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl p-6">
    <div className="flex items-center justify-between gap-3"><div><h3 className="text-xl font-black text-[#092328]">{collectionLabel(collectionKey)}</h3><p className="text-sm text-slate-500 mt-1">Manage content without touching React source code.</p></div><button type="button" onClick={onClose} className="text-slate-400">✕</button></div>
    {error&&<div className="mt-4 px-3 py-2 rounded-xl bg-rose-50 text-rose-700 text-sm font-semibold">{error}</div>}
    <div className="mt-5 flex justify-end"><button type="button" onClick={add} className="px-4 py-2 rounded-xl bg-[#12544F] text-white font-bold text-sm flex items-center gap-2"><Plus className="w-4 h-4"/>Add Item</button></div>
    <div className="mt-4 space-y-3">{items.map((item,i)=><div key={item.id} className="p-4 rounded-2xl border border-slate-200 flex flex-col lg:flex-row lg:items-center gap-3"><div className="flex-1 min-w-0"><div className="font-bold text-[#092328] truncate">{item.title}</div><div className="text-sm text-slate-500 mt-1 line-clamp-2">{item.description||item.meta||'No description'}</div></div><span className={`px-2 py-1 rounded-full text-[10px] font-black ${['active','published'].includes(item.status)?'bg-emerald-100 text-emerald-700':'bg-slate-100 text-slate-500'}`}>{item.status}</span><div className="flex flex-wrap gap-2"><button type="button" onClick={()=>toggle(item.id)} className="p-2 border rounded-lg" title="Active / inactive">{['active','published'].includes(item.status)?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button><button type="button" onClick={()=>move(i,-1)} className="p-2 border rounded-lg"><ArrowUp className="w-4 h-4"/></button><button type="button" onClick={()=>move(i,1)} className="p-2 border rounded-lg"><ArrowDown className="w-4 h-4"/></button><button type="button" onClick={()=>setEditing({...item,payload:parseJson(item.payload,{})})} className="p-2 border rounded-lg"><Pencil className="w-4 h-4"/></button><button type="button" onClick={()=>del(item.id)} className="p-2 border rounded-lg text-rose-500"><Trash2 className="w-4 h-4"/></button></div></div>)}</div>
    {editing&&<ItemModal section={collectionKey} item={editing} setItem={setEditing} onClose={()=>setEditing(null)} onSave={save} saving={saving} collectionLabel={collectionLabel(collectionKey)}/>} 
  </div></div></div>;
}

function SectionsModal({page,sections,setSections,onRefresh,onClose,loading=false,error=''}){
  const [editing,setEditing]=useState(null);
  const [saving,setSaving]=useState(false);
  const [msg,setMsg]=useState('');
  const [collection,setCollection]=useState(null);
  const create=()=>setEditing({
    page_id:page.id,
    section_key:`section-${Date.now()}`,
    section_type:'rich_text',
    title:'',
    subtitle:'',
    content_body:'',
    content_html:'',
    layout_orientation:'IMAGE_RIGHT',
    image_url:'',
    settings:{},
    custom_settings:{},
    sort_order:sections.length+1,
    display_order:sections.length+1,
    status:'active'
  });

  const save=async()=>{
    if(!editing?.section_key)return setMsg('Section key is required');
    if(editing.__settingsError)return setMsg('Fix Advanced Settings JSON before saving');
    setSaving(true);
    setMsg('');
    try{
      const finalSettings = parseJson(editing.settings || editing.custom_settings, {});
      const body = {
        ...editing,
        settings: finalSettings,
        custom_settings: finalSettings,
        content_body: editing.content_body || editing.content_html || '',
        content_html: editing.content_html || editing.content_body || '',
        layout_orientation: editing.layout_orientation || finalSettings.layout_orientation || 'IMAGE_RIGHT',
        image_url: editing.image_url || finalSettings.image_url || '',
        display_order: editing.display_order ?? editing.sort_order ?? 0,
        sort_order: editing.sort_order ?? editing.display_order ?? 0,
      };
      delete body.__settingsText;
      delete body.__settingsError;
      if(editing.id) await API.put(`/cms/admin/sections/${editing.id}`, body);
      else await API.post(`/cms/admin/pages/${page.id}/sections`, body);
      setEditing(null);
      await onRefresh();
    }catch(e){
      setMsg(e.response?.data?.message||'Failed to save section');
    }finally{
      setSaving(false);
    }
  };

  const toggle=async(id)=>{try{await API.put(`/cms/admin/sections/${id}/toggle`);await onRefresh()}catch(e){setMsg(e.response?.data?.message||'Failed to change section status')}};
  const del=async(id)=>{if(!window.confirm('Delete this section?'))return;try{await API.delete(`/cms/admin/sections/${id}`);await onRefresh()}catch(e){setMsg(e.response?.data?.message||'Failed to delete section')}};
  const move=async(i,dir)=>{const next=clone(sections);const j=i+dir;if(j<0||j>=next.length)return;[next[i],next[j]]=[next[j],next[i]];next.forEach((x,k)=>{x.sort_order=k+1;x.display_order=k+1;});setSections(next);try{await API.put('/cms/admin/sections/reorder',{items:next.map(x=>({id:x.id,sort_order:x.sort_order,display_order:x.display_order}))})}catch(e){setMsg(e.response?.data?.message||'Failed to reorder sections');await onRefresh()}};
  
  return <div className="fixed inset-0 z-[75] bg-black/50 p-4 overflow-y-auto"><div className="min-h-full flex items-start justify-center py-10"><div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl p-6">
    <div className="flex items-center justify-between gap-3"><div><h3 className="text-xl font-black">Sections — {page.title}</h3><p className="text-sm text-slate-500 mt-1">Every section supports activate/deactivate, edit, move up/down, delete, image upload and linked content management.</p></div><button type="button" onClick={onClose} className="text-slate-400">✕</button></div>
    {msg&&<div className="mt-4 px-3 py-2 rounded-xl bg-rose-50 text-rose-700 text-sm font-semibold">{msg}</div>}
    {error&&<div className="mt-4 px-3 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold">{error}</div>}
    <div className="mt-5 flex justify-end"><button type="button" onClick={create} disabled={loading} className="px-4 py-2 rounded-xl bg-[#12544F] text-white font-bold text-sm flex items-center gap-2 disabled:opacity-50"><Plus className="w-4 h-4"/>Add Section</button></div>
    {loading ? (
      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500">Loading sections…</div>
    ) : sections.length ? (
      <div className="mt-4 space-y-3">{sections.map((s,i)=>{const st=parseJson(s.settings || s.custom_settings,{});const key=st.collection_key;const orientation = s.layout_orientation || st.layout_orientation || (st.image_position === 'left' ? 'IMAGE_LEFT' : 'IMAGE_RIGHT');return <div key={s.id} className="p-4 rounded-2xl border border-slate-200 flex flex-col xl:flex-row xl:items-center gap-3"><div className="flex-1 min-w-0"><div className="font-bold text-[#092328] truncate">{s.title||s.section_key}</div><div className="text-sm text-slate-500 mt-1 flex flex-wrap gap-2 items-center"><span>{s.section_type}</span><span>·</span><span>{s.status}</span><span>·</span><span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">{orientation}</span>{key?<span>· {collectionLabel(key)}</span>:null}</div></div><div className="flex gap-2 items-center flex-wrap"><button type="button" onClick={()=>toggle(s.id)} className="p-2 border rounded-lg" title={s.status==='active'?'Set inactive':'Set active'}>{s.status==='active'?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button><button type="button" onClick={()=>setEditing({...s,settings:parseJson(s.settings || s.custom_settings,{}),custom_settings:parseJson(s.custom_settings || s.settings,{})})} className="p-2 border rounded-lg" title="Edit section"><Pencil className="w-4 h-4"/></button>{key&&<button type="button" onClick={()=>setCollection(key)} className="px-2.5 py-2 border rounded-lg text-sm font-black text-[#12544F]">Manage Items</button>}{st.admin_path&&<Link to={st.admin_path} className="px-2.5 py-2 border rounded-lg text-sm font-black text-[#12544F]">Open Manager</Link>}<button type="button" onClick={()=>move(i,-1)} className="p-2 border rounded-lg" title="Move up"><ArrowUp className="w-4 h-4"/></button><button type="button" onClick={()=>move(i,1)} className="p-2 border rounded-lg" title="Move down"><ArrowDown className="w-4 h-4"/></button><button type="button" onClick={()=>del(s.id)} className="p-2 border rounded-lg text-rose-500" title="Delete section"><Trash2 className="w-4 h-4"/></button></div></div>})}</div>
    ) : (
      <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
        <div className="font-black text-[#092328]">No sections found</div>
        <div className="mt-1 text-sm text-slate-500">Use Add Section to create your first block, or refresh the page if the built-in landing structure is being initialized.</div>
      </div>
    )}
    {editing&&<div className="mt-5 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4"><div className="grid md:grid-cols-2 gap-4"><Field label="Section Key" value={editing.section_key} onChange={x=>setEditing({...editing,section_key:x})}/><div><label className="block text-sm font-black text-slate-700 mb-1.5">Section Type</label><select value={editing.section_type||'rich_text'} onChange={e=>setEditing({...editing,section_type:e.target.value})} className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">{SECTION_TYPES.map(([k,l])=><option key={k} value={k}>{l}</option>)}</select></div><Field label="Title" value={editing.title} onChange={x=>setEditing({...editing,title:x})}/><Field label="Subtitle" value={editing.subtitle} onChange={x=>setEditing({...editing,subtitle:x})}/><Field label="Display / Sort Order" type="number" value={editing.display_order ?? editing.sort_order} onChange={x=>setEditing({...editing,display_order:Number(x)||0,sort_order:Number(x)||0})}/><div><label className="block text-sm font-black text-slate-700 mb-1.5">Status</label><select value={editing.status||'active'} onChange={e=>setEditing({...editing,status:e.target.value})} className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="active">Active</option><option value="inactive">Inactive</option></select></div></div><SectionSettingsFields editing={editing} setEditing={setEditing}/><div><label className="block text-sm font-black text-slate-700 mb-1.5">Content Body (Text / HTML / Description)</label><TextArea rows={4} value={editing.content_body || editing.content_html || ''} onChange={x=>setEditing({...editing,content_body:x,content_html:x})}/></div><RichTextEditor value={editing.content_html||editing.content_body||''} onChange={x=>setEditing({...editing,content_html:x,content_body:x})}/><div className="flex justify-end gap-2"><button type="button" onClick={()=>setEditing(null)} className="px-4 py-2 rounded-xl bg-white border font-bold">Cancel</button><button type="button" onClick={save} disabled={saving} className="px-5 py-2 rounded-xl bg-[#12544F] text-white font-bold">{saving?'Saving…':'Save Section'}</button></div></div>}
    {collection&&<CollectionItemsModal collectionKey={collection} onClose={()=>setCollection(null)}/>} 
  </div></div></div>;
}

function PageModal({page,setPage,onClose,onSave,saving}){
  return (
    <div className="fixed inset-0 z-[70] bg-black/50 p-4 overflow-y-auto">
      <div className="min-h-full flex items-start justify-center py-10">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-6 space-y-5">
          <div className="flex justify-between gap-4">
            <div>
              <h3 className="text-xl font-black">{page?.id ? 'Edit Page' : 'Create Page'}</h3>
              <p className="text-sm text-slate-500 mt-1">
                Edit this page, upload images, write rich content, add sections and publish it without touching React code.
              </p>
            </div>
            <button type="button" onClick={onClose} className="text-slate-400">✕</button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Page Title" value={page?.title} onChange={x=>setPage({...page,title:x})}/>
            <Field
              label="Public Slug"
              value={page?.slug}
              onChange={x=>setPage({...page,slug:x.toLowerCase().trim().replace(/^\/+|\/+$/g,'').replace(/\s+/g,'-')})}
              placeholder="features, company, resources"
            />
          </div>

          <CmsUpload
            label="Featured / Hero Image"
            value={page?.featured_image}
            onChange={x=>setPage({...page,featured_image:x})}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-black text-slate-700 mb-1.5">Template</label>
              <select
                value={page?.template || 'standard'}
                onChange={e=>setPage({...page,template:e.target.value})}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm"
              >
                <option value="standard">Standard</option>
                <option value="landing">Landing</option><option value="product_landing">Product Landing</option>
                <option value="article">Article</option>
                <option value="contact">Contact</option>
                <option value="features">Features</option>
                <option value="packages">Packages</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-black text-slate-700 mb-1.5">Publication Status</label>
              <select
                value={page?.status || 'draft'}
                onChange={e=>setPage({...page,status:e.target.value})}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-slate-700 mb-1.5">
              Main Page Content
            </label>
            <RichTextEditor
              value={page?.content_html || ''}
              onChange={x=>setPage({...page,content_html:x})}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="SEO Title" value={page?.seo_title} onChange={x=>setPage({...page,seo_title:x})}/>
            <TextArea
              label="SEO Description"
              rows={3}
              value={page?.seo_description}
              onChange={x=>setPage({...page,seo_description:x})}
            />
          </div>

          <div className="rounded-2xl bg-[#12544F]/5 border border-[#2A835F]/20 p-4 text-sm text-slate-600">
            <div className="font-black text-[#12544F]">No-code publishing</div>
            <div className="mt-1">
              Public URL: <span className="font-mono font-bold text-slate-800">/{page?.slug || 'your-slug'}</span>.
              Use the Sections button after saving to add and manage Hero, Feature Cards, Image + Text, How It Works, Use Cases, FAQ, CTA and other landing blocks without touching React code.
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl bg-slate-100 font-bold text-sm">
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={saving || !page?.title?.trim() || !page?.slug?.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#12544F] text-white font-bold text-sm flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4"/>
              {saving ? 'Saving…' : 'Save Page'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MediaManager({media,editing,setEditing,editorOpen,setEditorOpen,saveMedia,saving,toggleMedia,deleteMedia}){const openNew=()=>{setEditing({name:'',url:'',media_type:'image',alt_text:'',status:'active'});setEditorOpen(true)};return <div className="rounded-3xl bg-white border border-slate-200 p-5 space-y-5"><div className="flex items-center justify-between"><div><h2 className="font-black">Media Library</h2><p className="text-sm text-slate-500">Paste a URL from your storage/CDN or upload to your own server later. Status controls whether the media is allowed in CMS pickers.</p></div><button type="button" onClick={openNew} className="px-4 py-2.5 rounded-xl bg-[#12544F] text-white font-bold text-sm flex items-center gap-2"><UploadCloud className="w-4 h-4"/>Add Media</button></div><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{media.map(m=><div key={m.id} className="rounded-2xl border border-slate-200 p-3"><div className="aspect-video rounded-xl bg-slate-100 overflow-hidden">{m.media_type==='image'?<img src={m.url} alt={m.alt_text||m.name} className="w-full h-full object-cover"/>:<div className="p-4 text-sm font-mono break-all">{m.url}</div>}</div><div className="mt-3 font-bold text-sm truncate">{m.name}</div><div className="text-sm text-slate-400 truncate">{m.url}</div><div className="mt-3 flex items-center justify-between"><button onClick={()=>navigator.clipboard?.writeText(m.url)} className="text-sm font-bold text-[#12544F] flex items-center gap-1"><Copy className="w-3 h-3"/>Copy URL</button><div className="flex gap-1"><button onClick={()=>toggleMedia(m.id)} className="p-2 rounded-lg border">{m.status==='active'?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button><button onClick={()=>{setEditing({...m});setEditorOpen(true)}} className="p-2 rounded-lg border"><Pencil className="w-4 h-4"/></button><button onClick={()=>deleteMedia(m.id)} className="p-2 rounded-lg border text-rose-500"><Trash2 className="w-4 h-4"/></button></div></div></div>)}</div>{editorOpen&&<div className="fixed inset-0 z-[70] bg-black/50 p-4 flex items-center justify-center"><div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-4"><div className="flex justify-between"><h3 className="text-xl font-black">{editing?.id?'Edit':'Add'} Media</h3><button onClick={()=>setEditorOpen(false)}>✕</button></div><Field label="Name" value={editing?.name} onChange={x=>setEditing({...editing,name:x})}/><Field label="URL" value={editing?.url} onChange={x=>setEditing({...editing,url:x})}/><Field label="Alt Text" value={editing?.alt_text} onChange={x=>setEditing({...editing,alt_text:x})}/><Field label="Media Type" value={editing?.media_type} onChange={x=>setEditing({...editing,media_type:x})}/><div className="flex justify-end gap-2"><button onClick={()=>setEditorOpen(false)} className="px-4 py-2.5 rounded-xl bg-slate-100 font-bold">Cancel</button><button onClick={saveMedia} disabled={saving} className="px-5 py-2.5 rounded-xl bg-[#12544F] text-white font-bold">{saving?'Saving…':'Save Media'}</button></div></div></div>}</div>}
