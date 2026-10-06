import { useState, useEffect } from 'react';
import API from '../../services/api';
import { Save,  } from 'lucide-react';

export const AdminPaymentSettings = () => {
  const [settings, setSettings] = useState({
    bkash_merchant: '01700000000',
    nagad_merchant: '01800000000',
    rocket_merchant: '01900000000',
    min_recharge: '1',
    max_recharge: '10000',
    gateway_mode: 'sandbox',
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
        setMsg('Payment configuration saved successfully!');
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
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">Payment Gateway Configuration</h1>
        <p className="text-sm sm:text-sm text-slate-500 mt-0.5">
          Configure merchant phone numbers, API keys, and recharge limits for bKash, Nagad, and Rocket.
        </p>
      </div>

      {msg && <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-700 text-sm border border-emerald-200">{msg}</div>}
      {errorMsg && <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-700 text-sm border border-rose-200">{errorMsg}</div>}

      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs">
        <form onSubmit={handleSave} className="space-y-5 text-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 font-bold block mb-1 text-sm">Minimum Recharge (৳)</label>
              <input
                type="number"
                value={settings.min_recharge}
                onChange={(e) => setSettings({ ...settings, min_recharge: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden focus:border-[#12544F]"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1 text-sm">Maximum Recharge (৳)</label>
              <input
                type="number"
                value={settings.max_recharge}
                onChange={(e) => setSettings({ ...settings, max_recharge: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden focus:border-[#12544F]"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-4">
            <h4 className="font-bold text-sm text-[#092328]">Merchant Numbers & Wallets</h4>

            <div>
              <label className="text-slate-700 font-bold block mb-1 text-sm">bKash Merchant Account Number</label>
              <input
                type="text"
                value={settings.bkash_merchant}
                onChange={(e) => setSettings({ ...settings, bkash_merchant: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden focus:border-[#12544F]"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1 text-sm">Nagad Merchant Account Number</label>
              <input
                type="text"
                value={settings.nagad_merchant}
                onChange={(e) => setSettings({ ...settings, nagad_merchant: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden focus:border-[#12544F]"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1 text-sm">Rocket Merchant Account Number</label>
              <input
                type="text"
                value={settings.rocket_merchant}
                onChange={(e) => setSettings({ ...settings, rocket_merchant: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden focus:border-[#12544F]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#12544F] text-white hover:bg-[#092328] shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Payment Settings'}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

