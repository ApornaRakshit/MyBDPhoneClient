import React, { useEffect, useMemo, useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, CircleHelp } from 'lucide-react';
import API from '../../services/api';

const iconMap = { MapPin, Phone, Mail, CircleHelp };

const DEFAULT_CONFIG = {
  enabled: true,
  eyebrow: 'DIRECT CHANNELS',
  title: 'Our Dhaka Offices',
  description: 'Feel free to contact us through phone, email, or visit our headquarters in Karwan Bazar.',
  cards: [
    { icon: 'MapPin', title: 'Head Office', lines: ['Wakil Tower (8th Floor)', 'Ta-131, Gulshan-1 Badda Link Road', 'Gulshan, Dhaka 1212'], meta: '', active: true },
    { icon: 'Phone', title: 'Telecom Hotline', lines: ['096490123756'], meta: 'Sat - Thu: 9:00 AM - 8:00 PM', active: true },
    { icon: 'Mail', title: 'Email Contacts', lines: ['support@mybdphone.com', 'sales@mybdphone.com'], meta: '', active: true },
  ],
  form: {
    title: 'Send Us an Inquiry',
    subtitle: 'Fill out the form below and our account managers will contact you within 2 hours.',
    name_label: 'Your Full Name *', name_placeholder: 'e.g. Enter Your Name',
    phone_label: 'Phone Number *', phone_placeholder: '01XXXXXXXXX',
    email_label: 'Email Address *', email_placeholder: 'name@company.com',
    service_label: 'Service Interest', service_placeholder: 'Select Service Interest',
    message_label: 'Message Description *', message_placeholder: 'Tell us about your team size, expected call minutes, or requirements...',
    submit_text: 'Submit Inquiry', success_title: 'Inquiry Submitted Successfully!',
    success_message: 'Thank you for contacting MyBDPhone. A telecom specialist will call you shortly.',
    services: [
      { label: '096 IP Phone (PBX)', value: '096 IP Phone', active: true },
      { label: 'AI Voice Automation & Campaigns', value: 'AI Voice Automation', active: true },
      { label: 'Enterprise SIP Trunking', value: 'Enterprise Trunk', active: true },
      { label: 'Digital Add-ons & Numbers', value: 'Shop Addons', active: true },
    ],
  },
};

const validateEmail = (val) => {
  if (!val || typeof val !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(val.trim());
};

const validatePhone = (val) => {
  if (!val || typeof val !== 'string') return false;
  const clean = val.replace(/[\s\-()]/g, '');
  // Strictly matches Bangladesh mobile (013-019XXXXXXXX, +8801..., 8801...) or IP/PBX (096..., +88096...)
  const bdMobileRegex = /^(?:\+?880|880|0)1[3-9]\d{8}$/;
  const bdIpRegex = /^(?:\+?880|880|0)96\d{8,9}$/;
  return bdMobileRegex.test(clean) || bdIpRegex.test(clean);
};

export const Contact = () => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  useEffect(() => {
    let alive = true;
    API.get('/cms/public/contact')
      .then((res) => { if (alive) setConfig({ ...DEFAULT_CONFIG, ...(res.data?.config || {}), form: { ...DEFAULT_CONFIG.form, ...(res.data?.config?.form || {}) } }); })
      .catch(() => { if (alive) setError(''); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const activeCards = useMemo(() => (config.cards || []).filter((card) => card.active !== false), [config.cards]);
  const activeServices = useMemo(() => (config.form?.services || []).filter((service) => service.active !== false), [config.form?.services]);

  const update = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (submitError) setSubmitError('');
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const errors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Please enter your full name (at least 2 characters).';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!validatePhone(formData.phone)) {
      errors.phone = 'Please enter a valid phone number (e.g. 017XXXXXXXX or +8801XXXXXXXXX).';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address (e.g. name@company.com).';
    }

    if (!formData.message.trim() || formData.message.trim().length < 5) {
      errors.message = 'Please provide a message description (at least 5 characters).';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSubmitError(
        errors.phone || errors.email || errors.name || errors.message || 'Please correct the errors in the form before submitting.'
      );
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    setSubmitError('');

    try {
      let res;
      try {
        res = await API.post('/contact/submit', formData);
      } catch (postErr) {
        // Fallback endpoint if needed
        res = await API.post('/cms/public/contact', formData);
      }

      if (res.data?.success) {
        setSubmitted(true);
      } else {
        setSubmitError(res.data?.message || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      console.error('CONTACT SUBMISSION ERROR:', err);
      setSubmitError(err.response?.data?.message || err.message || 'Something went wrong while submitting. Please try again or call our hotline.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!loading && config.enabled === false) {
    return <div className="min-h-[55vh] flex items-center justify-center text-slate-500">This page is currently unavailable.</div>;
  }

  return (
    <div className="bg-[#f7f9fb] min-h-[calc(100vh-80px)] py-10 sm:py-12 lg:py-11">
      {error && <div className="max-w-7xl mx-auto px-4 mb-4 text-sm text-slate-500">Using default contact content.</div>}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5 pt-2">
            <div>
              <span className="text-sm font-extrabold uppercase tracking-wider text-[#2A835F]">{config.eyebrow}</span>
              <h1 className="text-4xl sm:text-5xl font-black text-[#092328] mt-1 tracking-tight">{config.title}</h1>
              <p className="text-base text-slate-600 mt-2 max-w-xl leading-relaxed">{config.description}</p>
            </div>

            <div className="space-y-4 mt-7">
              {activeCards.map((card, index) => {
                const Icon = iconMap[card.icon] || CircleHelp;
                return (
                  <div key={`${card.title}-${index}`} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#12544F]/10 text-[#12544F] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-base text-[#092328]">{card.title}</h4>
                      <div className="mt-1 text-base text-slate-600 leading-relaxed space-y-0.5">
                        {(card.lines || []).map((line, i) => <div key={i}>{line}</div>)}
                      </div>
                      {card.meta && <p className="text-sm text-slate-400 mt-1.5">{card.meta}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-7 sm:p-9 lg:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#092328] tracking-tight">{config.form?.title}</h2>
                <p className="text-base text-slate-500 mt-1.5">{config.form?.subtitle}</p>
              </div>

              {submitted ? (
                <div className="mt-7 p-7 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-2">
                  <CheckCircle2 className="w-9 h-9 text-emerald-600 mx-auto" />
                  <h3 className="font-bold text-lg">{config.form?.success_title || 'Inquiry Submitted Successfully!'}</h3>
                  <p className="text-sm text-emerald-700">{config.form?.success_message || config.form?.success_text || 'Thank you for contacting MyBDPhone. A telecom specialist will call you shortly.'}</p>
                  <button type="button" onClick={() => { setSubmitted(false); setFieldErrors({}); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }} className="mt-3 text-sm font-bold underline cursor-pointer">Send another inquiry</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4 mt-7">
                  {submitError && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-slate-700 block mb-1.5">{config.form?.name_label || 'Your Full Name *'}</label>
                      <input 
                        type="text" 
                        required 
                        disabled={submitting} 
                        placeholder={config.form?.name_placeholder || 'e.g. Enter Your Name'} 
                        value={formData.name} 
                        onChange={(e) => update('name', e.target.value)} 
                        className={`w-full p-3.5 rounded-xl bg-slate-50 border text-sm focus:bg-white focus:outline-none disabled:opacity-60 transition-colors ${
                          fieldErrors.name 
                            ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' 
                            : 'border-slate-200 focus:border-[#2A835F]'
                        }`} 
                      />
                      {fieldErrors.name && (
                        <p className="text-xs text-rose-600 font-semibold mt-1">{fieldErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 block mb-1.5">{config.form?.phone_label || 'Phone Number *'}</label>
                      <input 
                        type="tel" 
                        required 
                        disabled={submitting} 
                        placeholder={config.form?.phone_placeholder || '01XXXXXXXXX'} 
                        value={formData.phone} 
                        onChange={(e) => update('phone', e.target.value)} 
                        className={`w-full p-3.5 rounded-xl bg-slate-50 border text-sm focus:bg-white focus:outline-none disabled:opacity-60 transition-colors ${
                          fieldErrors.phone 
                            ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' 
                            : 'border-slate-200 focus:border-[#2A835F]'
                        }`} 
                      />
                      {fieldErrors.phone && (
                        <p className="text-xs text-rose-600 font-semibold mt-1">{fieldErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-slate-700 block mb-1.5">{config.form?.email_label || 'Email Address *'}</label>
                      <input 
                        type="email" 
                        required 
                        disabled={submitting} 
                        placeholder={config.form?.email_placeholder || 'name@company.com'} 
                        value={formData.email} 
                        onChange={(e) => update('email', e.target.value)} 
                        className={`w-full p-3.5 rounded-xl bg-slate-50 border text-sm focus:bg-white focus:outline-none disabled:opacity-60 transition-colors ${
                          fieldErrors.email 
                            ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' 
                            : 'border-slate-200 focus:border-[#2A835F]'
                        }`} 
                      />
                      {fieldErrors.email && (
                        <p className="text-xs text-rose-600 font-semibold mt-1">{fieldErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 block mb-1.5">{config.form?.service_label || 'Service Interest'}</label>
                      <select 
                        disabled={submitting} 
                        value={formData.subject} 
                        onChange={(e) => update('subject', e.target.value)} 
                        className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-none disabled:opacity-60"
                      >
                        <option value="">{config.form?.service_placeholder || 'Select Service Interest'}</option>
                        {activeServices.map((service, index) => <option key={`${service.value}-${index}`} value={service.value}>{service.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-700 block mb-1.5">{config.form?.message_label || 'Message Description *'}</label>
                    <textarea 
                      required 
                      disabled={submitting} 
                      rows={5} 
                      placeholder={config.form?.message_placeholder || 'Tell us about your team size, expected call minutes, or requirements...'} 
                      value={formData.message} 
                      onChange={(e) => update('message', e.target.value)} 
                      className={`w-full p-3.5 rounded-xl bg-slate-50 border text-sm focus:bg-white focus:outline-none resize-y disabled:opacity-60 transition-colors ${
                        fieldErrors.message 
                          ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' 
                          : 'border-slate-200 focus:border-[#2A835F]'
                      }`} 
                    />
                    {fieldErrors.message && (
                      <p className="text-xs text-rose-600 font-semibold mt-1">{fieldErrors.message}</p>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl font-bold text-base text-white bg-gradient-to-r from-[#12544F] to-[#2A835F] hover:from-[#092328] hover:to-[#12544F] shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Submitting Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> <span>{config.form?.button_text || config.form?.submit_text || 'Submit Inquiry'}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
