import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Package,
  CheckCircle2,
  Calendar,
  Clock,
  RefreshCw,
  Plus,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const UserMyPackages = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [primaryNumber, setPrimaryNumber] = useState('096490123756');

  useEffect(() => {
    API.get('/settings/public').then((res)=>{
      if(res.data.success && res.data.settings?.primary_096_number) setPrimaryNumber(res.data.settings.primary_096_number);
    }).catch(()=>{});
    API.get('/packages')
      .then((res) => {
        if (res.data.success) setPackages(res.data.packages);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const activeSub = user?.active_subscription;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">My Packages & Subscriptions</h1>
          <p className="text-sm sm:text-sm text-slate-500 mt-0.5">
            View active plan details, renewal cycles, and available package upgrades.
          </p>
        </div>

        <Link
          to="/packages"
          className="px-4 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#12544F] to-[#2A835F] text-white shadow-md hover:brightness-110 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Browse All Plans</span>
        </Link>
      </div>

      {/* Active Subscription Banner Card */}
      {activeSub ? (
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#092328] via-[#12544F] to-[#2A835F] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Active Monthly Plan
            </span>
            <div className="text-3xl font-black text-white">{activeSub.package_name}</div>
            <p className="text-sm text-slate-300">
              Assigned Number: <strong className="text-white">{activeSub.assigned_number || primaryNumber || '096490123756'}</strong>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center min-w-[140px]">
              <div className="text-sm text-slate-300 font-semibold">Expires On</div>
              <div className="text-sm font-black text-white mt-1">
                {new Date(activeSub.expires_at).toLocaleDateString()}
              </div>
            </div>
            <Link
              to="/user/recharge"
              className="px-5 py-3 rounded-xl font-bold text-sm bg-[#8BBB92] text-[#092328] hover:bg-white transition-colors"
            >
              Auto-Renew with Balance
            </Link>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
          <div className="text-base font-bold text-[#092328]">No active monthly plan subscription found</div>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Choose a package below to activate an official 096 IP number and smart telephony services.
          </p>
        </div>
      )}

      {/* Available Packages Catalog */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-[#092328]">Available Packages</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-[#2A835F] shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                  {pkg.service_type.replace('_', ' ')}
                </span>
                <h4 className="font-bold text-base text-[#092328]">{pkg.name}</h4>
                <div className="text-2xl font-black text-[#12544F]">
                  ৳{parseFloat(pkg.price).toLocaleString()}
                  <span className="text-sm font-normal text-slate-400">/{pkg.billing_period}</span>
                </div>
                <p className="text-sm text-slate-500 leading-snug">{pkg.description}</p>
              </div>

              <div className="pt-6">
                <Link
                  to="/packages"
                  className="w-full py-2.5 rounded-xl font-bold text-sm text-center block bg-[#12544F] hover:bg-[#092328] text-white transition-colors shadow-2xs"
                >
                  Switch / Subscribe
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

