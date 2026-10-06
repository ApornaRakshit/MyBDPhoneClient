import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/common/BrandLogo';
import API from '../services/api';
import {
  LayoutDashboard,
  Phone,
  Bot,
  Wallet,
  Receipt,
  PhoneCall,
  Package,
  ShoppingBag,
  LifeBuoy,
  User,
  Bell,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  CreditCard,
  Plus,
  BookOpen,
  Search,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export const UserLayout = () => {
  const { user, logout, refreshUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'superadmin')) {
      navigate('/admin/dashboard', { replace: true });
      return;
    }
    refreshUser();
    API.get('/auth/notifications')
      .then((res) => {
        if (res.data.success) setNotifications(res.data.notifications || []);
      })
      .catch(() => {});
  }, [location.pathname]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setShowSearchDropdown(false);
    setSearchQuery('');
    setShowNotifications(false);
    setSidebarOpen(false);
  }, [location.pathname]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAllRead = async () => {
    try {
      await API.put('/auth/notifications/all/read');
      setNotifications(notifications.map((n) => ({ ...n, is_read: 1 })));
    } catch {
      // keep current notification state on API failure
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const searchIndex = useMemo(() => [
    {
      id: 'dashboard',
      name: 'Dashboard Overview',
      category: 'Client Portal',
      path: '/user/dashboard',
      icon: LayoutDashboard,
      keywords: 'dashboard overview stats analytics summary account wallet balance home summary quick',
      description: 'Account overview, wallet balance glance, and active telecom services',
    },
    {
      id: 'packages',
      name: 'Services & IP Telephony Packages',
      category: 'Client Portal',
      path: '/user/packages',
      icon: Package,
      keywords: 'packages services cloud pbx dedicated pbx ip number pricing subscription plans buy order pricing rates sip trunk',
      description: 'Explore and subscribe to Cloud PBX, Dedicated IP trunks, and SIP lines',
    },
    {
      id: 'subscriptions',
      name: 'My Subscriptions & Active Lines',
      category: 'Client Portal',
      path: '/user/subscriptions',
      icon: CreditCard,
      keywords: 'subscriptions active plans validity auto renewal renew package active lines expiry dates',
      description: 'Manage current phone lines, subscription expiry dates, and auto-renewals',
    },
    {
      id: 'recharge',
      name: 'Billing & Wallet Top-up',
      category: 'Account',
      path: '/user/recharge',
      icon: Wallet,
      keywords: 'recharge top up balance wallet bkash nagad rocket payment add money deposit billing auto recharge topup taka',
      description: 'Top up your account balance instantly with bKash, Nagad, Rocket or Cards',
    },
    {
      id: 'ip-phone',
      name: 'My 096 IP Phone & SIP Settings',
      category: 'Account',
      path: '/user/ip-phone',
      icon: Phone,
      keywords: '096 ip phone sip pbx zoiper dialer credentials port caller id registration extensions setup password connection',
      description: 'View assigned 096 number, SIP server host, domain, and dialer credentials',
    },
    {
      id: 'profile',
      name: 'Account Details & Profile',
      category: 'Account',
      path: '/user/profile',
      icon: User,
      keywords: 'profile account user info name email phone company edit details settings address contact information',
      description: 'Update your personal profile, company information, and contact info',
    },
    {
      id: 'security',
      name: 'Security & Password',
      category: 'Account',
      path: '/user/profile',
      icon: ShieldCheck,
      keywords: 'security password change password pin authentication credentials login update reset',
      description: 'Change your account password and review security settings',
    },
    {
      id: 'transactions',
      name: 'Financial Ledger & Recharge History',
      category: 'Account',
      path: '/user/transactions',
      icon: Receipt,
      keywords: 'ledger transactions history recharge records statements credits debits financial deductions payments balance log',
      description: 'Full financial audit log, recharge transactions, and call usage deductions',
    },
    {
      id: 'payments',
      name: 'My Payments & Invoices',
      category: 'Account',
      path: '/user/payments',
      icon: CreditCard,
      keywords: 'payments invoices receipts billing transactions payment status manual verification offline bKash statement',
      description: 'View verified payment receipts, pending payment proofs, and invoices',
    },
    {
      id: 'orders',
      name: 'My Orders & Hardware Purchases',
      category: 'Account',
      path: '/user/orders',
      icon: ShoppingBag,
      keywords: 'orders hardware purchases items delivery tracking shopping invoices equipment cart',
      description: 'Track orders for IP desk phones, headsets, PBX setups, and add-ons',
    },
    {
      id: 'shop',
      name: 'Digital Shop & Hardware Catalog',
      category: 'Resources',
      path: '/user/shop',
      icon: ShoppingBag,
      keywords: 'shop hardware ip phones headsets devices grandstream fanvil yealink caller tune addons equipment buy store',
      description: 'Purchase certified IP desktop phones, operator headsets, and business caller tunes',
    },
    {
      id: 'support',
      name: 'Support Tickets & Helpdesk',
      category: 'Resources',
      path: '/user/support',
      icon: LifeBuoy,
      keywords: 'support tickets helpdesk complain technical issue assistance help engineer chat inquiry ticket create problem',
      description: 'Open new support tickets and get assistance from Dhaka telecom engineers',
    },
    {
      id: 'notifications',
      name: 'Notifications & System Alerts',
      category: 'Resources',
      path: '/user/notifications',
      icon: Bell,
      keywords: 'notifications alerts messages system announcements warnings billing updates unread notification notice',
      description: 'Review system announcements, recharge receipts, and ticket updates',
    },
  ], []);

  const filteredResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return searchIndex.filter((item) => {
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, searchIndex]);

  const handleSelectResult = (path) => {
    setSearchQuery('');
    setShowSearchDropdown(false);
    navigate(path);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (filteredResults.length > 0) {
        e.preventDefault();
        handleSelectResult(filteredResults[0].path);
      }
    } else if (e.key === 'Escape') {
      setShowSearchDropdown(false);
    }
  };

  const navSections = [
    {
      title: 'CLIENT PORTAL',
      items: [
        { name: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
        { name: 'Services & Packages', path: '/user/packages', icon: Package },
        { name: 'My Subscriptions', path: '/user/subscriptions', icon: CreditCard },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { name: 'Account details', path: '/user/profile', icon: User },
        { name: 'My 096 IP Phone', path: '/user/ip-phone', icon: Phone },
        { name: 'Billing & Top-up', path: '/user/recharge', icon: Wallet, highlight: true },
        { name: 'Security & Password', path: '/user/profile', icon: ShieldCheck },
        { name: 'Financial Ledger', path: '/user/transactions', icon: Receipt },
        { name: 'My Payments', path: '/user/payments', icon: CreditCard },
        { name: 'My Orders', path: '/user/orders', icon: ShoppingBag },
      ],
    },
    {
      title: 'RESOURCES',
      items: [
        { name: 'Digital Shop', path: '/user/shop', icon: ShoppingBag },
        { name: 'Support Tickets', path: '/user/support', icon: LifeBuoy },
        { name: 'Notifications', path: '/user/notifications', icon: Bell, badgeCount: unreadCount },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#092328] text-slate-300 border-r border-[#12544F]/50 fixed inset-y-0 left-0 z-30">
        
        {/* Sidebar Header */}
        <div className="h-16 px-6 flex items-center border-b border-[#12544F]/50">
          <BrandLogo size="md" isDark={true} to="/" />
        </div>

        {/* User Balance Glance */}
        <div className="p-4 mx-4 my-3 rounded-2xl bg-[#12544F]/40 border border-[#2A835F]/30 space-y-2">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-300">
            <span>Account Balance</span>
            <Link to="/user/recharge" className="text-[#8BBB92] hover:underline font-bold flex items-center gap-0.5 text-sm">
              <Plus className="w-3 h-3" /> Top Up
            </Link>
          </div>
          <div className="text-2xl font-black text-white">
            ৳ {parseFloat(user?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TK
          </div>
          <div className="text-[11px] text-[#8BBB92] font-medium truncate">
            {user?.active_subscription?.package_name || 'No active plan'}
          </div>
        </div>

        {/* Nav Links Grouped by Section */}
        <nav className="flex-1 min-h-0 px-3 space-y-4 overflow-y-auto overscroll-contain py-2 scrollbar-thin">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
                {section.title}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#12544F] text-white font-bold shadow-xs'
                        : item.highlight
                        ? 'text-[#8BBB92] bg-[#2A835F]/15 hover:bg-[#2A835F]/25 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#8BBB92]' : item.highlight ? 'text-[#8BBB92]' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-[#2A835F] text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {item.badgeCount > 0 && (
                      <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-rose-500 text-white rounded-full">
                        {item.badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#12544F]/50">
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        
        {/* Top Header matching Image 4 */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between shadow-2xs gap-4">
          
          {/* Mobile Menu Trigger & Logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <BrandLogo size="sm" to="/" />
          </div>

          {/* Search Bar with Live Options Dropdown */}
          <div ref={searchContainerRef} className="hidden md:flex items-center flex-1 max-w-md relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search features, recharge, 096 IP phone, packages..."
                value={searchQuery}
                onFocus={() => setShowSearchDropdown(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onKeyDown={handleSearchKeyDown}
                className="w-full pl-9 pr-8 py-2 rounded-full bg-slate-100 text-sm text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-[#12544F] focus:bg-white focus:outline-hidden transition-all shadow-2xs"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchDropdown(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Floating Live Results Dropdown */}
            {showSearchDropdown && searchQuery.trim() && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-[#092328]">
                    {filteredResults.length > 0
                      ? `Found ${filteredResults.length} matching option${filteredResults.length > 1 ? 's' : ''}`
                      : 'No options found'}
                  </span>
                  <span className="text-[10px] text-slate-400">Click to open or press Enter</span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-50 p-1.5">
                  {filteredResults.length > 0 ? (
                    filteredResults.map((res) => {
                      const Icon = res.icon;
                      return (
                        <button
                          key={res.id}
                          type="button"
                          onClick={() => handleSelectResult(res.path)}
                          className="w-full text-left p-3 rounded-xl hover:bg-[#12544F]/5 transition-all flex items-start gap-3 group cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#12544F]/10 text-[#12544F] group-hover:bg-[#12544F] group-hover:text-white flex items-center justify-center shrink-0 transition-colors mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-sm text-[#092328] group-hover:text-[#12544F] transition-colors">
                                {res.name}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                                {res.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                              {res.description}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#12544F] group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-6 text-center space-y-2">
                      <p className="text-sm font-semibold text-slate-600">
                        No matching options found for "{searchQuery}"
                      </p>
                      <p className="text-xs text-slate-400">
                        Try searching for: <span className="text-[#12544F] font-bold">Recharge</span>, <span className="text-[#12544F] font-bold">IP Phone</span>, <span className="text-[#12544F] font-bold">Packages</span>, <span className="text-[#12544F] font-bold">Support</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Controls Header */}
          <div className="flex items-center gap-3 ml-auto">
            
            {/* Orders / Cart Icon */}
            <Link
              to="/user/orders"
              className="p-2 rounded-full text-slate-600 hover:bg-slate-100 hover:text-[#092328] relative transition-colors"
              title="My Orders & Subscriptions"
            >
              <ShoppingBag className="w-4 h-4" />
            </Link>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full text-slate-600 hover:bg-slate-100 hover:text-[#092328] relative transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#092328]">Notifications</span>
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] text-[#2A835F] font-bold hover:underline cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-slate-400">No notifications yet</div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div key={n.id} className={`p-3 text-sm ${n.is_read ? 'opacity-70' : 'bg-[#12544F]/5'}`}>
                          <div className="font-bold text-[#092328]">{n.title}</div>
                          <div className="text-slate-500 text-[11px] mt-0.5 leading-snug">{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="pt-2 px-4 border-t border-slate-100 text-center">
                    <Link to="/user/notifications" className="text-sm font-bold text-[#12544F] hover:underline">
                      View all alerts
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Balance Pill */}
            <Link
              to="/user/recharge"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-sm font-bold text-slate-700 transition-colors"
            >
              <span>Balance:</span>
              <strong className="text-[#12544F]">
                BDT ৳ {parseFloat(user?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TK
              </strong>
            </Link>

            {/* Currency Selector */}
            <div className="hidden sm:flex items-center px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-sm font-bold text-slate-600">
              <span>BDT ৳</span>
            </div>

            {/* Welcome Greeting & Avatar Pill */}
            <Link
              to="/user/profile"
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-sm font-bold text-slate-800 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-[#12544F] text-white flex items-center justify-center text-[10px] font-bold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:inline">Welcome, {user?.name?.split(' ')[0] || 'User'}!</span>
            </Link>

          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#092328] text-slate-300 p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#12544F]/50">
              <BrandLogo size="sm" isDark={true} />
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="space-y-4 overflow-y-auto flex-1">
              {navSections.map((section) => (
                <div key={section.title} className="space-y-1">
                  <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {section.title}
                  </div>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold ${
                          isActive ? 'bg-[#12544F] text-white' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
            <div className="pt-2 border-t border-[#12544F]/50">
              <button
                onClick={handleLogout}
                className="w-full py-2 px-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

