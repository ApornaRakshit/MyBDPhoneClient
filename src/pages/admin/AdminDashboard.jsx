import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Users,
  Wallet,
  Phone,
  LifeBuoy,
  CreditCard,
  CalendarCheck,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try { const res = await API.get('/admin/dashboard-stats'); if (res.data.success) setData(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); const timer = setInterval(load, 60000); return () => clearInterval(timer); }, []);

  if (loading) {
    return <div className="p-12 text-center text-sm text-slate-400">Loading control room analytics...</div>;
  }

  const stats = data?.stats || {};
  const charts = data?.charts || {};

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">System Analytics & Telemetry</h1>
          <p className="text-sm sm:text-sm text-slate-500 mt-0.5">
            Real-time platform metrics, revenue streams, 096 IP lines, and voice AI activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={load} className="px-4 py-2.5 rounded-xl text-sm font-bold bg-white border border-slate-200 text-[#12544F] hover:bg-slate-50">Refresh</button>
          <Link
            to="/admin/packages"
            className="px-4 py-2.5 rounded-xl text-sm font-bold bg-[#12544F] text-white hover:bg-[#092328] shadow-xs transition-colors"
          >
            + Create New Package
          </Link>
        </div>
      </div>

      {/* Top 4 Primary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-sm font-bold text-slate-500 uppercase tracking-wider">
            <span>Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-[#2A835F]/10 text-[#2A835F] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#092328]">
            ৳{parseFloat(stats.total_revenue || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-[#2A835F] font-semibold">৳{parseFloat(stats.total_recharge || 0).toLocaleString()} total recharge volume</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-sm font-bold text-slate-500 uppercase tracking-wider">
            <span>Registered Users</span>
            <div className="w-8 h-8 rounded-lg bg-[#12544F]/10 text-[#12544F] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#092328]">
            {stats.total_users || 0}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">{stats.active_users || 0} active subscribers</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-sm font-bold text-slate-500 uppercase tracking-wider">
            <span>Active 096 Plans</span>
            <div className="w-8 h-8 rounded-lg bg-[#2A835F]/10 text-[#2A835F] flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#092328]">
            {stats.active_ip_subscriptions || 0}
          </div>
          <p className="text-[11px] text-slate-500">{stats.active_ai_subscriptions || 0} AI Voice plans</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-sm font-bold text-slate-500 uppercase tracking-wider">
            <span>Pending Orders / Tickets</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <LifeBuoy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600">
            {stats.pending_orders || 0} / {stats.open_tickets || 0}
          </div>
          <p className="text-[11px] text-slate-400">Requires administrator action</p>
        </div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/admin/payments" className="p-5 rounded-2xl bg-white border border-amber-200 hover:border-amber-400 transition-colors"><div className="flex justify-between"><div><div className="text-sm font-bold uppercase text-slate-400">Pending Payments</div><div className="text-2xl font-black text-amber-600 mt-1">{stats.pending_payments || 0}</div></div><CreditCard className="w-5 h-5 text-amber-500"/></div><div className="text-[11px] text-slate-500 mt-2">Open verification queue →</div></Link>
        <Link to="/admin/subscriptions" className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-400 transition-colors"><div className="flex justify-between"><div><div className="text-sm font-bold uppercase text-slate-400">Pending Recharges</div><div className="text-2xl font-black text-emerald-600 mt-1">{stats.pending_recharges || 0}</div></div><Wallet className="w-5 h-5 text-emerald-500"/></div><div className="text-[11px] text-slate-500 mt-2">Wallet verification & subscriptions →</div></Link>
        <Link to="/admin/packages" className="p-5 rounded-2xl bg-white border border-blue-200 hover:border-blue-400 transition-colors"><div className="flex justify-between"><div><div className="text-sm font-bold uppercase text-slate-400">Package Control</div><div className="text-sm font-black text-[#092328] mt-1">Package Manager</div></div><CalendarCheck className="w-5 h-5 text-blue-500"/></div><div className="text-[11px] text-slate-500 mt-2">Add, edit, deactivate plans →</div></Link>
      </div>

      {/* Analytics Charts (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Revenue & Recharge Trend Chart (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-[#092328]">Revenue & Call Traffic Growth</h3>
              <p className="text-sm text-slate-400">Monthly billing volume & concurrent call growth</p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.monthly_trend || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#12544F" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#12544F" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRech" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2A835F" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2A835F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', color: '#092328', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="recharge" stroke="#2A835F" fillOpacity={1} fill="url(#colorRech)" name="Recharge (৳)" />
                <Area type="monotone" dataKey="revenue" stroke="#12544F" fillOpacity={1} fill="url(#colorRev)" name="Net Revenue (৳)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Service Category Distribution (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-[#092328]">Service Usage Split</h3>
            <p className="text-sm text-slate-400">IP Telephony vs Voice Automation</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.service_distribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(charts.service_distribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', color: '#092328', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-sm pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#12544F]" />
                <span className="text-slate-600">IP Telephony (PBX)</span>
              </div>
              <span className="font-bold text-[#092328]">{charts.service_distribution?.find(x => x.name === 'IP Telephony')?.value || 0}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#2A835F]" />
                <span className="text-slate-600">AI Voice Automation</span>
              </div>
              <span className="font-bold text-[#092328]">{charts.service_distribution?.find(x => x.name === 'AI Voice Automation')?.value || 0}%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Feed: Transactions & Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Transactions */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-[#092328]">Recent Transactions Feed</h3>
            <Link to="/admin/recharge" className="text-sm font-bold text-[#12544F] hover:underline">
              Ledger
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-sm">
            {data?.recentTransactions?.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">{t.user_name} ({t.user_email})</div>
                  <div className="text-[10px] text-slate-400">{t.description} • {new Date(t.created_at).toLocaleDateString()}</div>
                </div>
                <div className={`font-black ${t.direction === 'credit' ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {t.direction === 'credit' ? '+' : '-'}৳{parseFloat(t.amount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-[#092328]">Recent Service Orders</h3>
            <Link to="/admin/orders" className="text-sm font-bold text-[#12544F] hover:underline">
              All Orders
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-sm">
            {data?.recentOrders?.map((o) => (
              <div key={o.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">{o.item_title}</div>
                  <div className="text-[10px] text-slate-400">Order #{o.order_number} • {o.user_name}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#12544F]/10 text-[#12544F] border border-[#12544F]/20 capitalize">
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

