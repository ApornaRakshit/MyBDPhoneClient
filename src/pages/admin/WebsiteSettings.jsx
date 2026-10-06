import { useState, useEffect } from 'react';
import API from '../../services/api';
import {  Save, } from 'lucide-react';

export const AdminWebsiteSettings = () => {
  const [settings, setSettings] = useState({
    site_name: 'MyBDPhone',
    hotline_phone: '+88 96*********',
    primary_096_number: '096490123756',
    support_email: 'support@mybdphone.com',
    office_address: 'Level 14, BDBL Bhaban, 12 Kazi Nazrul Islam Ave, Karwan Bazar, Dhaka-1215, Bangladesh',
    system_currency: 'BDT (৳)',
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    API.get('/settings/public')
      .then((res) => {
        if (res.data.success && res.data.settings) {
          setSettings((prev) => ({ ...prev, ...res.data.settings }));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    setErrorMsg('');
    try {
      const res = await API.put('/settings/admin/update', { settings });
      if (res.data?.success) {
        setMsg('Website global settings updated successfully!');
        setTimeout(() => setMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">Platform & Website Settings</h1>
        <p className="text-sm sm:text-sm text-slate-500 mt-0.5">
          Manage system identity, support contact emails, Dhaka office location, and regional currency.
        </p>
      </div>

      {msg && <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-700 text-sm border border-emerald-200">{msg}</div>}
      {errorMsg && <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-700 text-sm border border-rose-200">{errorMsg}</div>}

      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs">
        <form onSubmit={handleSave} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 font-bold block mb-1 text-sm">Platform Name</label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden focus:border-[#12544F]"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1 text-sm">Support Hotline Phone</label>
              <input
                type="text"
                value={settings.hotline_phone}
                onChange={(e) => setSettings({ ...settings, hotline_phone: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden focus:border-[#12544F]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 font-bold block mb-1 text-sm">Primary 096 Service Number</label>
              <input
                type="text"
                value={settings.primary_096_number || ''}
                onChange={(e) => setSettings({ ...settings, primary_096_number: e.target.value })}
                placeholder="096490123756"
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden focus:border-[#12544F]"
              />
              <p className="text-[10px] text-slate-400 mt-1">Used as the preferred number for the next IP Phone activation when that number is available in inventory.</p>
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1 text-sm">Support Email Address</label>
              <input
                type="email"
                value={settings.support_email}
                onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden focus:border-[#12544F]"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1 text-sm">System Currency</label>
              <input
                type="text"
                value={settings.system_currency || 'BDT (৳)'}
                disabled
                className="w-full p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-sm text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-700 font-bold block mb-1 text-sm">Dhaka HQ Office Address</label>
            <textarea
              rows={2}
              value={settings.office_address}
              onChange={(e) => setSettings({ ...settings, office_address: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden focus:border-[#12544F]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#12544F] text-white hover:bg-[#092328] shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

