import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import {
  Phone,
  Smartphone,
  Laptop,
  Monitor,
  Radio,
  FileAudio,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  Server
} from 'lucide-react';

export const MyIpPhone = () => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [callerTune, setCallerTune] = useState('');
  const [callRecording, setCallRecording] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [copyNotice, setCopyNotice] = useState('');

  const loadData = async () => {
    try {
      const res = await API.get('/ip-phone/my-service');
      if (res.data.success && res.data.details) {
        setDetails(res.data.details);
        setCallerTune(res.data.details.caller_tune || '');
        setCallRecording(res.data.details.call_recording || false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await API.put('/ip-phone/my-service', {
        caller_tune: callerTune,
        call_recording: callRecording,
      });
      alert('IP Phone configuration updated successfully!');
      loadData();
    } catch (err) {
      alert('Failed to update settings');
    } finally {
      setUpdating(false);
    }
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopyNotice(`Copied ${fieldName}!`);
    setTimeout(() => setCopyNotice(''), 2000);
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-slate-400">Loading IP Phone details...</div>;
  }

  if (!details) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#12544F]/10 text-[#12544F] mx-auto flex items-center justify-center">
          <Phone className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-black text-[#092328]">No Active 096 Line Assigned</h3>
        <p className="text-sm text-slate-500">
          Subscribe to an IP Phone package (StartUp or Pro) to receive an official 096 phone number and SIP configuration.
        </p>
        <div className="pt-2">
          <Link
            to="/user/packages"
            className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#12544F] to-[#2A835F] text-white shadow-md inline-block"
          >
            Browse IP Packages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">My IP Phone (096 Telephony)</h1>
          <p className="text-sm sm:text-sm text-slate-500 mt-0.5">
            Manage your assigned 096 number, SIP device registrations, caller tune, and recordings.
          </p>
        </div>
        {copyNotice && (
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-200">
            {copyNotice}
          </span>
        )}
      </div>

      {/* Top Number Banner Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#092328] via-[#12544F] to-[#2A835F] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            BTRC Verified Line • {details.subscription.package_name}
          </span>
          <div className="text-3xl sm:text-4xl font-black tracking-wider text-white">
            {details.number}
          </div>
          <div className="text-sm text-slate-300">
            Expires on: <span className="font-bold text-white">{new Date(details.subscription.expires_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center min-w-[120px]">
            <div className="text-2xl font-black text-[#8BBB92]">{details.device_count} / {details.max_devices}</div>
            <div className="text-[10px] text-slate-200 font-semibold uppercase mt-0.5">Devices Allowed</div>
          </div>
        </div>
      </div>

      {/* Grid: SIP Credentials & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: SIP Credentials Box (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[#12544F]" />
              <h3 className="font-bold text-sm text-[#092328]">SIP Softphone Credentials</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400">Standard RFC-3261</span>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <label className="text-slate-500 font-medium block mb-1">SIP Server Domain</label>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between font-mono font-bold text-slate-800">
                <span>{details.sip_server}</span>
                <button
                  onClick={() => copyToClipboard(details.sip_server, 'SIP Server')}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <label className="text-slate-500 font-medium block mb-1">SIP Username / Auth ID</label>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between font-mono font-bold text-slate-800">
                <span>{details.sip_username}</span>
                <button
                  onClick={() => copyToClipboard(details.sip_username, 'Username')}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <label className="text-slate-500 font-medium block mb-1">SIP Password</label>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between font-mono font-bold text-slate-800">
                <span>{showPassword ? details.sip_password : '••••••••••••••••'}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(details.sip_password, 'Password')}
                    className="p-1 text-slate-400 hover:text-slate-700"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
            Enter these credentials in <strong>Zoiper</strong>, <strong>Grandstream Wave</strong>, or <strong>MicroSIP</strong> on Android, PC, or hardware IP phones.
          </div>
        </div>

        {/* Right: Telephony Feature Controls (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#2A835F]" />
              <h3 className="font-bold text-sm text-[#092328]">Line Feature Controls</h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-600">Real-Time Sync</span>
          </div>

          <form onSubmit={handleUpdateSettings} className="space-y-4 text-sm">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Custom Caller Tune Text / Jingle</label>
              <input
                type="text"
                placeholder="e.g. Welcome to Corporate Hotline..."
                value={callerTune}
                onChange={(e) => setCallerTune(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
              />
              <p className="text-[10px] text-slate-400 mt-1">Played automatically to inbound callers.</p>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2.5">
                <FileAudio className="w-4 h-4 text-[#12544F]" />
                <div>
                  <div className="font-bold text-slate-800">Cloud Call Recording</div>
                  <div className="text-[10px] text-slate-400">Save and archive all conversations in cloud</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={callRecording}
                onChange={(e) => setCallRecording(e.target.checked)}
                className="w-5 h-5 accent-[#2A835F] cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full py-3 rounded-xl font-bold text-sm bg-[#12544F] hover:bg-[#092328] text-white shadow-xs transition-colors"
            >
              {updating ? 'Saving Configuration...' : 'Save Settings'}
            </button>
          </form>
        </div>

      </div>

      {/* Connected Devices Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-[#092328]">Connected SIP Devices & Extensions</h3>
            <p className="text-sm text-slate-400">Live active device sessions registered on this 096 number</p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-sm font-bold bg-emerald-50 text-emerald-700">
            {details.active_devices.length} Devices Online
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {details.active_devices.map((dev) => (
            <div key={dev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400">{dev.last_seen}</span>
              </div>
              <div className="font-bold text-sm text-slate-800">{dev.name}</div>
              <div className="text-[11px] text-slate-500 font-mono">IP: {dev.ip}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

