import { useState, useEffect } from 'react';
import API from '../../services/api';
import {
 
  Plus,

  X
} from 'lucide-react';

export const AdminPackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [serviceType, setServiceType] = useState('ip_phone');
  const [price, setPrice] = useState('500');
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [description, setDescription] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [callMinutes, setCallMinutes] = useState('300');
  const [deviceLimit, setDeviceLimit] = useState('5');
  const [aiCredits, setAiCredits] = useState('0');
  const [concurrentCalls, setConcurrentCalls] = useState('3');
  const [recordingEnabled, setRecordingEnabled] = useState(false);
  const [callerTuneEnabled, setCallerTuneEnabled] = useState(true);
  const [isRecommended, setIsRecommended] = useState(false);
  const [status, setStatus] = useState('active');
  const [badgeText, setBadgeText] = useState('');
  const [sortOrder, setSortOrder] = useState('1');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadPackages = async () => {
    setLoading(true);
    try {
      const res = await API.get('/packages?include_inactive=true');
      if (res.data.success) {
        setPackages(res.data.packages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleOpenAdd = () => {
    setEditingPkg(null);
    setName('');
    setSlug('');
    setServiceType('ip_phone');
    setPrice('500');
    setBillingPeriod('monthly');
    setDescription('');
    setFeaturesText("096XXXXXXXX Number Registration\nCaller Tune Included\nPC Support (Windows / Mac)\nLaptop Support\nAndroid App Support\nMaximum 5 Devices\nCall History");
    setCallMinutes('300');
    setDeviceLimit('5');
    setAiCredits('0');
    setConcurrentCalls('3');
    setRecordingEnabled(false);
    setCallerTuneEnabled(true);
    setIsRecommended(false);
    setStatus('active');
    setBadgeText('');
    setSortOrder('1');
    setMessage('');
    setError('');
    setShowModal(true);
  };

  const handleOpenEdit = (pkg) => {
    setEditingPkg(pkg);
    setName(pkg.name);
    setSlug(pkg.slug);
    setServiceType(pkg.service_type);
    setPrice(String(pkg.price));
    setBillingPeriod(pkg.billing_period);
    setDescription(pkg.description || '');
    setFeaturesText(Array.isArray(pkg.features) ? pkg.features.join('\n') : '');
    setCallMinutes(String(pkg.call_minutes || 0));
    setDeviceLimit(String(pkg.device_limit || 1));
    setAiCredits(String(pkg.ai_credits || 0));
    setConcurrentCalls(String(pkg.concurrent_calls || 1));
    setRecordingEnabled(Boolean(pkg.recording_enabled));
    setCallerTuneEnabled(Boolean(pkg.caller_tune_enabled));
    setIsRecommended(Boolean(pkg.is_recommended));
    setStatus(pkg.status);
    setBadgeText(pkg.badge_text || '');
    setSortOrder(String(pkg.sort_order || 0));
    setMessage('');
    setError('');
    setShowModal(true);
  };

  const handleSavePackage = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    const features = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const payload = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      service_type: serviceType,
      price: parseFloat(price),
      billing_period: billingPeriod,
      description,
      features,
      call_minutes: parseInt(callMinutes) || 0,
      device_limit: parseInt(deviceLimit) || 1,
      ai_credits: parseInt(aiCredits) || 0,
      concurrent_calls: parseInt(concurrentCalls) || 1,
      recording_enabled: recordingEnabled ? 1 : 0,
      caller_tune_enabled: callerTuneEnabled ? 1 : 0,
      is_recommended: isRecommended ? 1 : 0,
      status,
      badge_text: badgeText || null,
      sort_order: parseInt(sortOrder) || 0,
    };

    try {
      if (editingPkg) {
        await API.put(`/packages/${editingPkg.id}`, payload);
        setMessage('Package updated successfully! Live on public website.');
      } else {
        await API.post('/packages', payload);
        setMessage('New package created successfully and is now live!');
      }

      loadPackages();
      setTimeout(() => setShowModal(false), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save package');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePackage = async (id, pkgName) => {
    if (!window.confirm(`Delete / Deactivate package "${pkgName}"?`)) return;
    try {
      await API.delete(`/packages/${id}`);
      loadPackages();
    } catch (err) {
      alert('Error removing package');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">No-Code Package Manager</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#12544F]/10 text-[#12544F] border border-[#12544F]/20">
              Dynamic CMS
            </span>
          </div>
          <p className="text-sm sm:text-sm text-slate-500 mt-0.5">
            Add, update pricing, customize feature bullet points, and set limits dynamically without code changes.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl font-bold text-sm bg-[#12544F] text-white hover:bg-[#092328] shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Packages Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-sm">
                <th className="pb-3">Package Details</th>
                <th className="pb-3">Service Type</th>
                <th className="pb-3">Price & Period</th>
                <th className="pb-3">Limits (Mins/Devices)</th>
                <th className="pb-3">Recommended</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">Loading package catalog...</td>
                </tr>
              ) : packages.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">No packages created yet</td>
                </tr>
              ) : (
                packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5">
                      <div className="font-bold text-[#092328] text-sm">{pkg.name}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{pkg.description}</div>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                        pkg.service_type === 'ai_calling' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-[#12544F]/10 text-[#12544F]'
                      }`}>
                        {pkg.service_type === 'ai_calling' ? 'AI Calling' : 'IP Phone'}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <div className="font-black text-emerald-600 text-sm">৳{parseFloat(pkg.price).toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400 capitalize">/{pkg.billing_period}</div>
                    </td>
                    <td className="py-3.5 text-slate-700 text-sm">
                      <div className="font-semibold">{pkg.call_minutes} Call Mins</div>
                      <div className="text-[10px] text-slate-400">{pkg.device_limit} Devices • {pkg.concurrent_calls} Concurrency</div>
                    </td>
                    <td className="py-3.5">
                      {pkg.is_recommended ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#12544F] text-white">
                          ★ Recommended
                        </span>
                      ) : (
                        <span className="text-slate-400 text-sm">Standard</span>
                      )}
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        pkg.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {pkg.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(pkg)}
                        className="px-2.5 py-1 rounded-lg bg-[#12544F]/10 hover:bg-[#12544F]/20 text-[#12544F] text-sm font-bold transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg.id, pkg.name)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-sm font-bold transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Package Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-800 space-y-5 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-[#12544F]">Dynamic Package Creator</span>
              <h3 className="text-xl font-black text-[#092328] mt-0.5">
                {editingPkg ? `Edit Package: ${editingPkg.name}` : 'Create New Package (No Code)'}
              </h3>
            </div>

            {error && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>}
            {message && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">{message}</div>}

            <form onSubmit={handleSavePackage} className="space-y-4 text-sm">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1 text-sm">Package Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. StartUp Monthly, AI Starter"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden focus:border-[#12544F]"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1 text-sm">Service Category *</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden"
                  >
                    <option value="ip_phone">IP Phone</option>
                    <option value="ai_calling">AI Calling (Voice Automation)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1 text-sm">Price (৳) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden focus:border-[#12544F]"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1 text-sm">Billing Period</label>
                  <select
                    value={billingPeriod}
                    onChange={(e) => setBillingPeriod(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                    <option value="one_time">One Time</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1 text-sm">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1 text-sm">Package Description</label>
                <textarea
                  rows={2}
                  placeholder="Short description shown to customers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1 text-sm">Feature Bullet Points (1 per line) *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="096XXXXXXXX Number Registration&#10;Caller Tune Included&#10;Maximum 5 Devices&#10;Call History"
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] font-mono focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Limits Configuration */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1 text-sm">Call Minutes</label>
                  <input
                    type="number"
                    value={callMinutes}
                    onChange={(e) => setCallMinutes(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1 text-sm">Device Limit</label>
                  <input
                    type="number"
                    value={deviceLimit}
                    onChange={(e) => setDeviceLimit(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1 text-sm">AI Credits/Mins</label>
                  <input
                    type="number"
                    value={aiCredits}
                    onChange={(e) => setAiCredits(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1 text-sm">Concurrency</label>
                  <input
                    type="number"
                    value={concurrentCalls}
                    onChange={(e) => setConcurrentCalls(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={isRecommended}
                    onChange={(e) => setIsRecommended(e.target.checked)}
                    className="accent-[#12544F] w-4 h-4"
                  />
                  <span className="font-bold text-slate-700">Highlight as Recommended</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={recordingEnabled}
                    onChange={(e) => setRecordingEnabled(e.target.checked)}
                    className="accent-[#12544F] w-4 h-4"
                  />
                  <span className="font-bold text-slate-700">Call Recording Included</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={callerTuneEnabled}
                    onChange={(e) => setCallerTuneEnabled(e.target.checked)}
                    className="accent-[#12544F] w-4 h-4"
                  />
                  <span className="font-bold text-slate-700">Caller Tune Included</span>
                </label>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl font-bold bg-[#12544F] text-white hover:bg-[#092328] transition-colors cursor-pointer text-sm shadow-xs"
                >
                  {saving ? 'Publishing Package...' : 'Save & Publish Live'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

