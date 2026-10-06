import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, CreditCard, Package, RefreshCw, ArrowRight, CheckCircle2 } from 'lucide-react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const money = (v) => `৳${Number(v || 0).toLocaleString('en-US')}`;

export const UserMySubscriptions = () => {
  const { user, refreshUser } = useAuth();
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await API.get('/auth/me');
        if (alive && res.data.success) {
          setSubs(res.data.user?.subscriptions || (res.data.user?.active_subscription ? [res.data.user.active_subscription] : []));
        }
      } catch (_) {
        if (alive && user?.active_subscription) setSubs([user.active_subscription]);
      } finally { if (alive) setLoading(false); }
    };
    load();
    return () => { alive = false; };
  }, []);

  const active = user?.active_subscription;

  return (
    <div className="space-y-7 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-black uppercase tracking-wider text-[#2A835F]">Account</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328] mt-1">My Subscriptions</h1>
          <p className="text-sm text-slate-500 mt-1">View active services, expiry dates, renewal status and subscription history.</p>
        </div>
        <Link to="/packages" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#12544F] text-white text-sm font-bold">
          Browse Packages <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {active && (
        <div className="rounded-3xl bg-gradient-to-r from-[#092328] via-[#12544F] to-[#2A835F] p-6 sm:p-8 text-white shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8BBB92]" /> Active Subscription
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-3">{active.package_name}</h2>
              <p className="text-sm text-slate-300 mt-1">{active.service_type?.replace('_', ' ') || 'MyBDPhone service'}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 min-w-0 sm:min-w-[320px]">
              <div className="rounded-2xl bg-white/10 border border-white/15 p-4">
                <div className="text-[10px] uppercase font-bold text-slate-300">Activated</div>
                <div className="font-black mt-1">{active.started_at ? new Date(active.started_at).toLocaleDateString() : '—'}</div>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/15 p-4">
                <div className="text-[10px] uppercase font-bold text-slate-300">Expires</div>
                <div className="font-black mt-1">{active.expires_at ? new Date(active.expires_at).toLocaleDateString() : '—'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div><h3 className="font-black text-[#092328]">Subscription History</h3><p className="text-sm text-slate-400 mt-1">All plans assigned to this account.</p></div>
          <button onClick={refreshUser} className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"><RefreshCw className="w-4 h-4" /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400"><tr>
              <th className="px-6 py-4 text-left">Package</th><th className="px-6 py-4 text-left">Service</th><th className="px-6 py-4 text-left">Activated</th><th className="px-6 py-4 text-left">Expires</th><th className="px-6 py-4 text-left">Status</th><th className="px-6 py-4 text-right">Action</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? <tr><td colSpan="6" className="py-10 text-center text-slate-400">Loading subscriptions...</td></tr> : subs.length === 0 ? <tr><td colSpan="6" className="py-10 text-center text-slate-400">No subscription history found.</td></tr> : subs.map((s) => (
                <tr key={s.id || s.package_id}>
                  <td className="px-6 py-4 font-black text-[#092328]"><div className="flex items-center gap-2"><Package className="w-4 h-4 text-[#2A835F]" />{s.package_name || s.name}</div></td>
                  <td className="px-6 py-4 capitalize text-slate-600">{(s.service_type || '').replace('_', ' ')}</td>
                  <td className="px-6 py-4 text-slate-500">{s.started_at ? new Date(s.started_at).toLocaleDateString() : '—'}</td>
                  <td className="px-6 py-4 text-slate-500">{s.expires_at ? new Date(s.expires_at).toLocaleDateString() : '—'}</td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${s.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>{s.status}</span></td>
                  <td className="px-6 py-4 text-right"><Link to="/user/packages" className="inline-flex items-center gap-1 text-sm font-bold text-[#12544F]">Renew <ArrowRight className="w-3 h-3" /></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
