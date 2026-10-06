import { useEffect, useState } from 'react';
import API from '../../../services/api';
import {
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';

const DEFAULT_CONTACT = {
  enabled: true,
  eyebrow: 'DIRECT CHANNELS',
  title: 'Our Dhaka Offices',
  description:
    'Feel free to contact us through phone, email, or visit our headquarters in Karwan Bazar.',
  office_cards: [
    {
      icon: 'MapPin',
      title: 'Head Office',
      lines: [
        'Wakil Tower (8th Floor)',
        'Ta-131, Gulshan-1 Badda Link Road',
        'Gulshan, Dhaka 1212',
      ],
      meta: '',
      active: true,
    },
    {
      icon: 'Phone',
      title: 'Telecom Hotline',
      lines: ['096490123756'],
      meta: 'Sat - Thu: 9:00 AM - 8:00 PM',
      active: true,
    },
    {
      icon: 'Mail',
      title: 'Email Contacts',
      lines: ['support@mybdphone.com', 'sales@mybdphone.com'],
      meta: '',
      active: true,
    },
  ],
  form: {
    title: 'Send Us an Inquiry',
    subtitle:
      'Fill out the form below and our account managers will contact you within 2 hours.',
    name_label: 'Your Full Name *',
    name_placeholder: 'e.g. Enter Your Name',
    phone_label: 'Phone Number *',
    phone_placeholder: '01XXXXXXXXX',
    email_label: 'Email Address *',
    email_placeholder: 'name@company.com',
    service_label: 'Service Interest',
    service_placeholder: 'Select Service Interest',
    message_label: 'Message Description *',
    message_placeholder:
      'Tell us about your team size, expected call minutes, or requirements...',
    button_text: 'Submit Inquiry',
    success_title: 'Inquiry Submitted Successfully!',
    success_text:
      'Thank you for contacting MyBDPhone. A telecom specialist will call you shortly.',
  },
  services: [
    { value: '096 IP Phone', label: '096 IP Phone (PBX)', active: true },
    {
      value: 'AI Voice Automation',
      label: 'AI Voice Automation & Campaigns',
      active: true,
    },
    {
      value: 'Enterprise Trunk',
      label: 'Enterprise SIP Trunking',
      active: true,
    },
    {
      value: 'Shop Addons',
      label: 'Digital Add-ons & Numbers',
      active: true,
    },
  ],
};

const ICON_OPTIONS = [
  'MapPin',
  'Phone',
  'Mail',
  'Clock3',
  'Building2',
  'Headphones',
  'ShieldCheck',
];

const clone = (value) => JSON.parse(JSON.stringify(value));

const Field = ({ label, value, onChange, ...props }) => (
  <div>
    <label className="block text-sm font-black text-slate-700 mb-1.5">
      {label}
    </label>
    <input
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      {...props}
      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#12544F] text-sm"
    />
  </div>
);

const TextArea = ({ label, value, onChange, ...props }) => (
  <div>
    <label className="block text-sm font-black text-slate-700 mb-1.5">
      {label}
    </label>
    <textarea
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      {...props}
      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#12544F] text-sm"
    />
  </div>
);

const Toggle = ({ value, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative w-11 h-6 rounded-full transition-colors ${
      value ? 'bg-[#2A835F]' : 'bg-slate-300'
    }`}
    aria-label={value ? 'Active' : 'Inactive'}
  >
    <span
      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
        value ? 'left-6' : 'left-1'
      }`}
    />
  </button>
);

const normalize = (raw = {}) => ({
  ...clone(DEFAULT_CONTACT),
  ...raw,
  office_cards: Array.isArray(raw.office_cards)
    ? raw.office_cards
    : clone(DEFAULT_CONTACT.office_cards),
  services: Array.isArray(raw.services)
    ? raw.services
    : clone(DEFAULT_CONTACT.services),
  form: {
    ...clone(DEFAULT_CONTACT.form),
    ...(raw.form || {}),
  },
});

export const ContactPageManager = () => {
  const [config, setConfig] = useState(DEFAULT_CONTACT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await API.get('/cms/admin/config');
      setConfig(normalize(res.data?.config?.contact_config || {}));
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to load contact CMS data'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    setMessage('');

    try {
      await API.put('/cms/admin/config/contact_config', {
        value: config,
      });
      setMessage('Contact page saved and published live.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to save contact page');
    } finally {
      setSaving(false);
    }
  };

  const updateForm = (key, value) =>
    setConfig((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        [key]: value,
      },
    }));

  const updateCard = (index, next) => {
    setConfig((prev) => {
      const cards = clone(prev.office_cards);
      cards[index] = next;
      return { ...prev, office_cards: cards };
    });
  };

  const addCard = () =>
    setConfig((prev) => ({
      ...prev,
      office_cards: [
        ...prev.office_cards,
        {
          icon: 'MapPin',
          title: 'New Contact Channel',
          lines: ['Enter contact information'],
          meta: '',
          active: true,
        },
      ],
    }));

  const removeCard = (index) =>
    setConfig((prev) => ({
      ...prev,
      office_cards: prev.office_cards.filter((_, i) => i !== index),
    }));

  const moveCard = (index, direction) =>
    setConfig((prev) => {
      const cards = clone(prev.office_cards);
      const target = index + direction;
      if (target < 0 || target >= cards.length) return prev;
      [cards[index], cards[target]] = [cards[target], cards[index]];
      return { ...prev, office_cards: cards };
    });

  const updateService = (index, key, value) =>
    setConfig((prev) => {
      const services = clone(prev.services);
      services[index] = { ...services[index], [key]: value };
      return { ...prev, services };
    });

  const addService = () =>
    setConfig((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          value: 'New Service',
          label: 'New Service',
          active: true,
        },
      ],
    }));

  const removeService = (index) =>
    setConfig((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));

  const moveService = (index, direction) =>
    setConfig((prev) => {
      const services = clone(prev.services);
      const target = index + direction;
      if (target < 0 || target >= services.length) return prev;
      [services[index], services[target]] = [
        services[target],
        services[index],
      ];
      return { ...prev, services };
    });

  if (loading) {
    return (
      <div className="p-10 rounded-3xl bg-white border border-slate-200 text-center text-slate-500">
        Loading Contact Page CMS...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-sm text-slate-400 mb-1">CMS & Site Management / Contact</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">
            Contact Page Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">
            Change every visible Contact page text, contact card, service option,
            form label and button without editing React code.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

          <a
            href="/contact"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </a>
        </div>
      </div>

      {message && (
        <div className="px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
          {message}
        </div>
      )}

      <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-black text-[#092328]">Page Visibility & Heading</h2>
            <p className="text-sm text-slate-500 mt-1">
              These values control the left side heading shown in the screenshot.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-slate-600">
              {config.enabled ? 'Published' : 'Hidden'}
            </span>
            <Toggle
              value={config.enabled}
              onChange={() =>
                setConfig((prev) => ({ ...prev, enabled: !prev.enabled }))
              }
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Field
            label="Eyebrow"
            value={config.eyebrow}
            onChange={(value) => setConfig((prev) => ({ ...prev, eyebrow: value }))}
          />
          <Field
            label="Main Title"
            value={config.title}
            onChange={(value) => setConfig((prev) => ({ ...prev, title: value }))}
          />
        </div>

        <TextArea
          label="Description"
          rows={3}
          value={config.description}
          onChange={(value) =>
            setConfig((prev) => ({ ...prev, description: value }))
          }
        />
      </div>

      <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-black text-[#092328]">Direct Contact Channels</h2>
            <p className="text-sm text-slate-500 mt-1">
              Add, remove, reorder or deactivate the cards on the left.
            </p>
          </div>

          <button
            type="button"
            onClick={addCard}
            className="px-4 py-2.5 rounded-xl bg-[#12544F] text-white text-sm font-black flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Channel
          </button>
        </div>

        <div className="space-y-4">
          {config.office_cards.map((card, index) => (
            <div
              key={`${card.title}-${index}`}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-[#12544F]/10 text-[#12544F] flex items-center justify-center text-sm font-black">
                    {index + 1}
                  </span>
                  <span className="font-black text-sm text-[#092328]">
                    Contact Card {index + 1}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => moveCard(index, -1)}
                    className="p-2 rounded-lg border border-slate-200 bg-white"
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveCard(index, 1)}
                    className="p-2 rounded-lg border border-slate-200 bg-white"
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateCard(index, {
                        ...card,
                        active: card.active === false,
                      })
                    }
                    className="p-2 rounded-lg border border-slate-200 bg-white text-[#12544F]"
                    title={card.active === false ? 'Activate' : 'Deactivate'}
                  >
                    {card.active === false ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeCard(index)}
                    className="p-2 rounded-lg border border-slate-200 bg-white text-rose-500"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="Card Title"
                  value={card.title}
                  onChange={(value) =>
                    updateCard(index, { ...card, title: value })
                  }
                />

                <div>
                  <label className="block text-sm font-black text-slate-700 mb-1.5">
                    Icon
                  </label>
                  <select
                    value={card.icon || 'MapPin'}
                    onChange={(e) =>
                      updateCard(index, { ...card, icon: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                  >
                    {ICON_OPTIONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <TextArea
                label="Card Lines — one line per row"
                rows={4}
                value={(card.lines || []).join('\n')}
                onChange={(value) =>
                  updateCard(index, {
                    ...card,
                    lines: String(value)
                      .split('\n')
                      .map((line) => line.trim())
                      .filter(Boolean),
                  })
                }
              />

              <Field
                label="Small Meta / Opening Hours"
                value={card.meta || ''}
                onChange={(value) =>
                  updateCard(index, { ...card, meta: value })
                }
                placeholder="Sat - Thu: 9:00 AM - 8:00 PM"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-5">
        <div>
          <h2 className="font-black text-[#092328]">Inquiry Form Content</h2>
          <p className="text-sm text-slate-500 mt-1">
            Everything inside the right-side form can be changed from here.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Field
            label="Form Title"
            value={config.form.title}
            onChange={(value) => updateForm('title', value)}
          />
          <Field
            label="Button Text"
            value={config.form.button_text}
            onChange={(value) => updateForm('button_text', value)}
          />
        </div>

        <TextArea
          label="Form Subtitle"
          rows={2}
          value={config.form.subtitle}
          onChange={(value) => updateForm('subtitle', value)}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <Field
            label="Name Label"
            value={config.form.name_label}
            onChange={(value) => updateForm('name_label', value)}
          />
          <Field
            label="Name Placeholder"
            value={config.form.name_placeholder}
            onChange={(value) => updateForm('name_placeholder', value)}
          />
          <Field
            label="Phone Label"
            value={config.form.phone_label}
            onChange={(value) => updateForm('phone_label', value)}
          />
          <Field
            label="Phone Placeholder"
            value={config.form.phone_placeholder}
            onChange={(value) => updateForm('phone_placeholder', value)}
          />
          <Field
            label="Email Label"
            value={config.form.email_label}
            onChange={(value) => updateForm('email_label', value)}
          />
          <Field
            label="Email Placeholder"
            value={config.form.email_placeholder}
            onChange={(value) => updateForm('email_placeholder', value)}
          />
          <Field
            label="Service Label"
            value={config.form.service_label}
            onChange={(value) => updateForm('service_label', value)}
          />
          <Field
            label="Service Placeholder"
            value={config.form.service_placeholder}
            onChange={(value) => updateForm('service_placeholder', value)}
          />
        </div>

        <TextArea
          label="Message Label"
          rows={2}
          value={config.form.message_label}
          onChange={(value) => updateForm('message_label', value)}
        />

        <TextArea
          label="Message Placeholder"
          rows={3}
          value={config.form.message_placeholder}
          onChange={(value) => updateForm('message_placeholder', value)}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <TextArea
            label="Success Title"
            rows={2}
            value={config.form.success_title}
            onChange={(value) => updateForm('success_title', value)}
          />
          <TextArea
            label="Success Message"
            rows={2}
            value={config.form.success_text}
            onChange={(value) => updateForm('success_text', value)}
          />
        </div>
      </div>

      <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-black text-[#092328]">Service Interest Options</h2>
            <p className="text-sm text-slate-500 mt-1">
              These options appear in the Contact page dropdown.
            </p>
          </div>

          <button
            type="button"
            onClick={addService}
            className="px-4 py-2.5 rounded-xl bg-[#12544F] text-white text-sm font-black flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>

        <div className="space-y-3">
          {config.services.map((service, index) => (
            <div
              key={`${service.value}-${index}`}
              className="grid md:grid-cols-[1fr_1fr_auto_auto_auto] gap-3 items-end p-4 rounded-2xl bg-slate-50 border border-slate-200"
            >
              <Field
                label="Value"
                value={service.value}
                onChange={(value) => updateService(index, 'value', value)}
              />
              <Field
                label="Visible Label"
                value={service.label}
                onChange={(value) => updateService(index, 'label', value)}
              />

              <button
                type="button"
                onClick={() => moveService(index, -1)}
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white"
                title="Move up"
              >
                <ArrowUp className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const active = service.active !== false;
                  updateService(index, 'active', !active);
                }}
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-[#12544F]"
                title="Activate/deactivate"
              >
                {service.active !== false ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => removeService(index)}
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-rose-500"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="sticky bottom-4 z-20 flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-[#12544F] text-white font-black shadow-xl flex items-center gap-2 disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save & Publish Contact Page'}
        </button>
      </div>
    </div>
  );
};
