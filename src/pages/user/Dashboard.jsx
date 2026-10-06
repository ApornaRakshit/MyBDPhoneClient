import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Wallet,
  Phone,
  Bot,
  LifeBuoy,
  PhoneCall,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Cloud,
  Server,
  Headphones,
  ShoppingBag,
  CreditCard,
  Layers,
  Sparkles
} from 'lucide-react';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    ipPhone: null,
    recentOrders: [],
    recentTransactions: [],
    openTickets: [],
    activeSubscriptionsCount: 0,
    loading: true,
  });

  const loadDashboardData = async () => {
    try {
      const [ipRes, ordersRes, txnRes, ticketRes, subRes] = await Promise.all([
        API.get('/ip-phone/my-service'),
        API.get('/orders/my?limit=5'),
        API.get('/transactions/my?limit=5'),
        API.get('/tickets/my'),
        API.get('/subscriptions/my'),
      ]);

      setStats({
        ipPhone: ipRes.data?.details || null,
        recentOrders: ordersRes.data?.orders?.slice(0, 5) || [],
        recentTransactions: txnRes.data?.transactions?.slice(0, 5) || [],
        openTickets: ticketRes.data?.tickets?.filter((t) => t.status !== 'closed')?.slice(0, 3) || [],
        activeSubscriptionsCount: subRes.data?.subscriptions?.filter((s) => s.status === 'active')?.length || 0,
        loading: false,
      });
    } catch (err) {
      console.error('Failed to load user dashboard:', err);
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const productCards = [
    {
      title: 'Cloud IP PBX',
      price: 'Starts from BDT ৳ 500 / month',
      desc: 'Smart scalable cloud PBX with multi-device extensions & call routing.',
      icon: Cloud,
      link: '/user/packages',
      btnText: 'Select Plan',
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Dedicated IP PBX',
      price: 'Starts from BDT ৳ 1,000 / month',
      desc: 'Private high-capacity PBX infrastructure for enterprise call centers.',
      icon: Server,
      link: '/user/packages',
      btnText: 'Select Plan',
      iconBg: 'bg-teal-50 text-teal-600',
    },
    {
      title: 'IP Number',
      price: 'Starts from BDT ৳ 500 / month',
      desc: 'Official 096 IP number allocation with nationwide calling capabilities.',
      icon: Phone,
      link: '/user/ip-phone',
      btnText: 'Get 096 Number',
      iconBg: 'bg-cyan-50 text-cyan-600',
    },
    {
      title: 'PBX Recharge',
      price: 'Starts from BDT ৳ 100',
      desc: 'Instant online wallet recharge via bKash, Nagad, Rocket & Cards.',
      icon: Wallet,
      link: '/user/recharge',
      btnText: 'Recharge Now',
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'IP Phone Hardware',
      price: 'Physical Desk Phones',
      desc: 'Certified Grandstream, Fanvil, and Yealink IP desktop hardware.',
      icon: PhoneCall,
      link: '/user/shop',
      btnText: 'Browse Shop',
      iconBg: 'bg-slate-100 text-slate-700',
    },
    {
      title: 'Accessories & Add-ons',
      price: 'Headsets & Add-ons',
      desc: 'Caller tunes, extra device slots, cloud recording & digital services.',
      icon: Headphones,
      link: '/user/shop',
      btnText: 'View Add-ons',
      iconBg: 'bg-indigo-50 text-indigo-600',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-sm sm:text-sm text-slate-500 mt-1">
            Manage your 096 IP phone lines, top up wallet balance, and explore digital telecom add-ons.
          </p>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex items-center gap-2">
          <Link
            to="/user/recharge"
            className="px-4 py-2.5 rounded-xl font-bold text-sm bg-[#12544F] text-white shadow-xs hover:bg-[#092328] flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Recharge ৳</span>
          </Link>
          <Link
            to="/user/shop"
            className="px-3.5 py-2.5 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#2A835F]" />
            <span>Digital Shop</span>
          </Link>
        </div>
      </div>

      {/* SECTION: Browse Products & Services */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-[#092328]">Browse Products & Services</h2>
            <p className="text-sm text-slate-500">Select an IP telephony package, hardware, or top up balance</p>
          </div>
          <Link to="/user/packages" className="text-sm font-bold text-[#12544F] hover:underline flex items-center gap-0.5">
            <span>View All Packages</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {productCards.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${p.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-[#12544F] bg-[#12544F]/5 px-2.5 py-1 rounded-full border border-[#12544F]/10">
                      {p.price}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#092328] group-hover:text-[#12544F] transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={p.link}
                    className="w-full py-2 px-3 rounded-xl font-bold text-sm bg-slate-50 hover:bg-[#12544F] text-slate-700 hover:text-white transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <span>{p.btnText}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION: 4 Core Account Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Balance */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-sm font-bold uppercase tracking-wider">
            <span>Account Balance</span>
            <div className="w-8 h-8 rounded-lg bg-[#2A835F]/10 text-[#2A835F] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#092328]">
            ৳ {parseFloat(user?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">Min ৳100 • Max ৳10k</span>
            <Link to="/user/recharge" className="text-[11px] font-bold text-[#12544F] hover:underline">
              Top Up &rarr;
            </Link>
          </div>
        </div>

        {/* Card 2: Active IP Number & Plan */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-sm font-bold uppercase tracking-wider">
            <span>096 IP Phone</span>
            <div className="w-8 h-8 rounded-lg bg-[#12544F]/10 text-[#12544F] flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-black text-[#12544F] truncate font-mono">
            {stats.ipPhone?.number || 'No 096 Assigned'}
          </div>
          <div className="flex items-center justify-between pt-1 text-[11px]">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {stats.ipPhone?.subscription?.package_name || 'Active Line'}
            </span>
            <Link to="/user/ip-phone" className="font-bold text-slate-600 hover:underline">
              Config &rarr;
            </Link>
          </div>
        </div>

        {/* Card 3: Active Subscriptions */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-sm font-bold uppercase tracking-wider">
            <span>Subscriptions</span>
            <div className="w-8 h-8 rounded-lg bg-[#2A835F]/10 text-[#2A835F] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#092328]">
            {stats.activeSubscriptionsCount} <span className="text-sm font-semibold text-slate-400">Active</span>
          </div>
          <div className="flex items-center justify-between pt-1 text-[11px]">
            <span className="text-slate-400">Monthly Plans</span>
            <Link to="/user/subscriptions" className="font-bold text-[#2A835F] hover:underline">
              Manage &rarr;
            </Link>
          </div>
        </div>

        {/* Card 4: Support Helpdesk */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-sm font-bold uppercase tracking-wider">
            <span>Support Tickets</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <LifeBuoy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#092328]">
            {stats.openTickets.length} <span className="text-sm font-semibold text-slate-400">Active</span>
          </div>
          <div className="flex items-center justify-between pt-1 text-[11px]">
            <span className="text-slate-400">Dhaka Helpdesk</span>
            <Link to="/user/support" className="font-bold text-[#12544F] hover:underline">
              Open Ticket &rarr;
            </Link>
          </div>
        </div>

      </div>

      {/* Main Grid: Recent Orders & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-[#092328]">Recent Orders & Services</h3>
              <p className="text-sm text-slate-400">Packages, numbers, and digital shop orders</p>
            </div>
            <Link to="/user/orders" className="text-sm font-bold text-[#12544F] hover:underline">
              View All Orders
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {stats.recentOrders.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">No orders placed yet</div>
            ) : (
              stats.recentOrders.map((order) => (
                <div key={order.id} className="py-3.5 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#12544F]/10 text-[#12544F] flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{order.item_title}</div>
                      <div className="text-[10px] text-slate-400">
                        #{order.order_number} • {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-emerald-600 text-sm">৳{parseFloat(order.amount).toLocaleString()}</div>
                    <div className={`text-[10px] font-bold uppercase ${
                      order.status === 'completed' || order.status === 'active' ? 'text-emerald-600' :
                      order.status === 'pending' ? 'text-amber-600' : 'text-slate-400'
                    }`}>
                      {order.status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Transactions & Quick Info (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-[#092328]">Recent Ledger</h3>
              <p className="text-sm text-slate-400">Recharges and package purchases</p>
            </div>
            <Link to="/user/transactions" className="text-sm font-bold text-[#12544F] hover:underline">
              Ledger
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {stats.recentTransactions.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">No transactions recorded yet</div>
            ) : (
              stats.recentTransactions.map((t) => (
                <div key={t.id} className="py-3 flex items-center justify-between text-sm">
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{t.description}</div>
                    <div className="text-[10px] text-slate-400">{new Date(t.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className={`font-black text-sm ${t.direction === 'credit' ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {t.direction === 'credit' ? '+' : '-'}৳{parseFloat(t.amount).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

