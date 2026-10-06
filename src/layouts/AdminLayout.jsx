import { useEffect, useState, useRef, useMemo } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/common/BrandLogo';
import API from '../services/api';
import {
  LayoutDashboard,
  Users,
  Phone,
  Bot,
  Package,
  ShoppingBag,
  Receipt,
  Wallet,
  LifeBuoy,
  CreditCard,
  FileText,
  Settings,
  Shield,
  CalendarCheck,
  BadgeDollarSign,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  UserCircle,
  BookOpen,
  MessageSquare,
  Search,
  ChevronRight
} from 'lucide-react';

const ADMIN_SEARCH_INDEX = [
  // Core Operations
  {
    id: 'admin-dashboard',
    name: 'Analytics Dashboard',
    category: 'Operations',
    description: 'Real-time telemetry, revenue metrics, active 096 IP lines, and voice activity',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
    keywords: ['dashboard', 'analytics', 'telemetry', 'metrics', 'stats', 'revenue', 'overview', 'calls', 'home'],
  },
  {
    id: 'admin-users',
    name: 'Users Management',
    category: 'Operations',
    description: 'Manage registered clients, balances, account statuses, and verification',
    path: '/admin/users',
    icon: Users,
    keywords: ['users', 'clients', 'customers', 'accounts', 'members', 'user list', 'balance adjustment', 'block user'],
  },
  {
    id: 'admin-ip-phone',
    name: '096 IP Phone Suite',
    category: 'Telephony',
    description: 'Manage 096 IP numbers, SIP extensions, DID mapping, and call routes',
    path: '/admin/ip-phone',
    icon: Phone,
    keywords: ['096', 'ip phone', 'sip', 'did', 'extensions', 'telephony', 'voip', 'numbers', 'trunk'],
  },
  {
    id: 'admin-packages',
    name: 'Package Manager',
    category: 'Pricing & Plans',
    description: 'Create & edit talktime bundles, minutes pricing, validity, and limits',
    path: '/admin/packages',
    icon: Package,
    keywords: ['package', 'packages', 'plans', 'pricing', 'bundle', 'talktime', 'minutes', 'create package'],
  },
  {
    id: 'admin-shop',
    name: 'Shop & Marketplace',
    category: 'E-Commerce',
    description: 'Manage hardware products, IP desk phones, headsets, prices, and stock',
    path: '/admin/shop',
    icon: ShoppingBag,
    keywords: ['shop', 'products', 'hardware', 'store', 'marketplace', 'desk phone', 'headset', 'inventory'],
  },
  {
    id: 'admin-orders',
    name: 'Orders Center',
    category: 'E-Commerce',
    description: 'Customer product orders, tracking statuses, fulfillment, and invoices',
    path: '/admin/orders',
    icon: Receipt,
    keywords: ['orders', 'order center', 'hardware orders', 'invoices', 'shipments', 'tracking', 'deliveries'],
  },
  {
    id: 'admin-recharge',
    name: 'Recharges & Ledger',
    category: 'Billing',
    description: 'Wallet top-ups, transaction logs, credit/debit audit trail, and balances',
    path: '/admin/recharge',
    icon: Wallet,
    keywords: ['recharge', 'ledger', 'topup', 'wallet', 'balance', 'credit', 'debit', 'transactions', 'money'],
  },
  {
    id: 'admin-tickets',
    name: 'Support Helpdesk',
    category: 'Support',
    description: 'Manage support tickets, client conversations, priority resolution, and replies',
    path: '/admin/tickets',
    icon: LifeBuoy,
    keywords: ['support', 'helpdesk', 'tickets', 'customer support', 'issues', 'messages', 'complaints'],
  },
  {
    id: 'admin-inquiries',
    name: 'Contact Inquiries',
    category: 'Support',
    description: 'Submissions from public contact form, sales inquiries, and customer leads',
    path: '/admin/inquiries',
    icon: MessageSquare,
    keywords: ['inquiries', 'contact us', 'contact form', 'leads', 'messages', 'questions', 'prospects'],
  },
  {
    id: 'admin-payments',
    name: 'Payment Verification',
    category: 'Billing',
    description: 'Verify bKash, Nagad, manual payment proofs, and approve transactions',
    path: '/admin/payments',
    icon: CreditCard,
    keywords: ['payment', 'verification', 'approve payment', 'bkash', 'nagad', 'manual payment', 'trxid'],
  },
  {
    id: 'admin-subscriptions',
    name: 'Subscription Management',
    category: 'Billing',
    description: 'Active client package subscriptions, auto-renewals, and expirations',
    path: '/admin/subscriptions',
    icon: CalendarCheck,
    keywords: ['subscriptions', 'active plans', 'renewals', 'package subscribers', 'expiry'],
  },
  {
    id: 'admin-payment-methods',
    name: 'Payment Methods',
    category: 'Settings',
    description: 'Configure payment gateways, bKash/Nagad/Rocket merchant accounts, and banks',
    path: '/admin/payment-methods',
    icon: BadgeDollarSign,
    keywords: ['payment methods', 'gateways', 'bkash merchant', 'nagad merchant', 'bank accounts'],
  },
  {
    id: 'admin-payment-settings',
    name: 'Payment Settings',
    category: 'Settings',
    description: 'Currency rates, payment keys, auto-approval thresholds, and gateways',
    path: '/admin/payment-settings',
    icon: Settings,
    keywords: ['payment settings', 'currency', 'gateway keys', 'billing config'],
  },
  {
    id: 'admin-notifications',
    name: 'Admin Notifications',
    category: 'Operations',
    description: 'System alerts, ticket updates, new order notifications, and payment events',
    path: '/admin/notifications',
    icon: Bell,
    keywords: ['notifications', 'alerts', 'system notices', 'unread', 'events'],
  },
  {
    id: 'admin-profile',
    name: 'My Account & Security',
    category: 'Account',
    description: 'Admin profile, credentials, password change, and security settings',
    path: '/admin/profile',
    icon: UserCircle,
    keywords: ['profile', 'account', 'password', 'security', 'admin user', 'credentials'],
  },
  {
    id: 'admin-settings',
    name: 'System Settings',
    category: 'Settings',
    description: 'Platform wide configurations, branding, telemetry, and system maintenance',
    path: '/admin/settings',
    icon: Settings,
    keywords: ['settings', 'system settings', 'configuration', 'maintenance', 'platform'],
  },

  // CMS & Site Management
  {
    id: 'cms-navigation',
    name: 'Navigation Menu Manager',
    category: 'CMS & Website',
    description: 'Manage main navbar menus, dropdown items, links, and display order',
    path: '/admin/navigation',
    icon: Menu,
    keywords: ['navigation', 'navbar', 'menu', 'dropdown', 'links', 'header menu', 'menu manager'],
  },
  {
    id: 'cms-pages',
    name: 'Pages / Landing CMS',
    category: 'CMS & Website',
    description: 'Page editor, dynamic content, landing pages, and SEO metadata',
    path: '/admin/cms/pages',
    icon: FileText,
    keywords: ['cms pages', 'landing pages', 'page builder', 'seo', 'custom pages'],
  },
  {
    id: 'cms-contact',
    name: 'Contact Page CMS',
    category: 'CMS & Website',
    description: 'Edit contact info, office address, phone numbers, email, and Google map',
    path: '/admin/cms/contact',
    icon: FileText,
    keywords: ['contact cms', 'contact page', 'address', 'office location', 'contact email', 'phone info'],
  },
  {
    id: 'cms-resources',
    name: 'Resources & Guides CMS',
    category: 'CMS & Website',
    description: 'Help articles, user guides, knowledgebase documents, and download links',
    path: '/admin/cms/resources',
    icon: BookOpen,
    keywords: ['resources', 'guides', 'knowledgebase', 'help center', 'documentation', 'manuals'],
  },
  {
    id: 'cms-header',
    name: 'Header / Navbar Manager',
    category: 'CMS & Website',
    description: 'Top notification announcement bar, logo options, and header layout',
    path: '/admin/cms/header',
    icon: FileText,
    keywords: ['header', 'topbar', 'announcement', 'navbar layout', 'header branding'],
  },
  {
    id: 'cms-footer',
    name: 'Footer Manager',
    category: 'CMS & Website',
    description: 'Footer column links, social links, copyright notice, and badges',
    path: '/admin/cms/footer',
    icon: FileText,
    keywords: ['footer', 'social media', 'copyright', 'bottom links', 'footer columns'],
  },
  {
    id: 'cms-home',
    name: 'Home Page Manager',
    category: 'CMS & Website',
    description: 'Homepage hero banner, CTA buttons, statistics counter, and section order',
    path: '/admin/cms/home',
    icon: FileText,
    keywords: ['home page', 'hero banner', 'cta', 'stats counter', 'front page', 'landing content'],
  },
  {
    id: 'cms-clients',
    name: 'Brand Logos / Clients',
    category: 'CMS & Website',
    description: 'Client partner logos, trust badges, and brand showcase slider',
    path: '/admin/cms/home?tab=clients',
    icon: FileText,
    keywords: ['clients', 'brands', 'brand logos', 'partners', 'partner logos', 'trust badge'],
  },
  {
    id: 'cms-features',
    name: 'Features Manager',
    category: 'CMS & Website',
    description: 'Edit feature cards, service highlights, product capabilities, and icons',
    path: '/admin/cms/features',
    icon: FileText,
    keywords: ['features', 'services', 'capabilities', 'feature cards', 'solution highlights'],
  },
  {
    id: 'cms-faq',
    name: 'FAQ Manager',
    category: 'CMS & Website',
    description: 'Manage frequently asked questions, categories, and accordion answers',
    path: '/admin/cms/home?tab=faq',
    icon: FileText,
    keywords: ['faq', 'questions', 'frequently asked questions', 'answers', 'accordion'],
  },
  {
    id: 'cms-testimonials',
    name: 'Testimonials CMS',
    category: 'CMS & Website',
    description: 'Customer reviews, ratings, client feedbacks, and testimonial quotes',
    path: '/admin/cms/testimonials',
    icon: FileText,
    keywords: ['testimonials', 'reviews', 'feedback', 'ratings', 'client reviews', 'quotes'],
  },
  {
    id: 'cms-blog',
    name: 'Blog & News Manager',
    category: 'CMS & Website',
    description: 'Create & edit blog posts, company news, articles, and announcements',
    path: '/admin/cms/blog',
    icon: FileText,
    keywords: ['blog', 'news', 'articles', 'posts', 'announcements', 'updates'],
  },
  {
    id: 'cms-media',
    name: 'Media Library',
    category: 'CMS & Website',
    description: 'Upload and manage images, banners, logos, and uploaded asset files',
    path: '/admin/cms/media',
    icon: FileText,
    keywords: ['media', 'images', 'upload', 'assets', 'gallery', 'photos', 'graphics'],
  },
  {
    id: 'cms-settings',
    name: 'Global Site Settings',
    category: 'CMS & Website',
    description: 'Global site name, meta tags, favicons, OG image, and contact details',
    path: '/admin/cms/settings',
    icon: Settings,
    keywords: ['site settings', 'seo tags', 'favicon', 'meta', 'global config', 'brand settings'],
  },
];

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [adminUnread, setAdminUnread] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef(null);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return ADMIN_SEARCH_INDEX.filter((item) => {
      const matchName = item.name.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q));
      return matchName || matchCat || matchDesc || matchKeywords;
    });
  }, [searchQuery]);

  const handleSelectResult = (path) => {
    setShowSearchDropdown(false);
    setSearchQuery('');
    navigate(path);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && filteredResults.length > 0) {
      e.preventDefault();
      handleSelectResult(filteredResults[0].path);
    } else if (e.key === 'Escape') {
      setShowSearchDropdown(false);
    }
  };

  const loadAdminNotifications = async () => {
    try {
      const res = await API.get('/admin/notifications?limit=8');
      if (res.data.success) {
        setAdminNotifications(res.data.notifications || []);
        setAdminUnread(Number(res.data.unread_count || 0));
      }
    } catch (error) {
      console.error('ADMIN NOTIFICATION LOAD ERROR:', error);
    }
  };

  useEffect(() => {
    loadAdminNotifications();
    const timer = window.setInterval(loadAdminNotifications, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const markAdminRead = async (id) => {
    const target = adminNotifications.find((n) => Number(n.id) === Number(id));
    if (!target || Number(target.is_read) === 1) return;

    try {
      const res = await API.put(`/admin/notifications/${id}/read`);
      if (res.data?.success) {
        setAdminNotifications((items) =>
          items.map((n) =>
            Number(n.id) === Number(id)
              ? { ...n, is_read: 1, read_at: n.read_at || new Date().toISOString() }
              : n
          )
        );
        setAdminUnread((count) => Math.max(0, count - 1));
      }
    } catch (error) {
      console.error('ADMIN NOTIFICATION READ ERROR:', error);
    }
  };

  const markAllAdminRead = async () => {
    if (adminUnread <= 0) return;

    try {
      let res;
      try {
        res = await API.post('/admin/notifications/mark-all-read');
      } catch {
        // Keep the legacy PUT route as a safe fallback for cached/cPanel deployments.
        res = await API.put('/admin/notifications/all/read');
      }
      if (res.data?.success) {
        setAdminNotifications((items) =>
          items.map((n) => ({
            ...n,
            is_read: 1,
            read_at: n.read_at || new Date().toISOString(),
          }))
        );
        setAdminUnread(0);
      }
    } catch (error) {
      console.error('ADMIN NOTIFICATIONS MARK ALL ERROR:', error);
    }
  };

  const isCmsPath =
    location.pathname.startsWith('/admin/navigation') ||
    location.pathname.startsWith('/admin/cms');
  const [cmsOpen, setCmsOpen] = useState(isCmsPath);

  const adminNav = [
    { name: 'Analytics Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users Management', path: '/admin/users', icon: Users },
    { name: '096 IP Phone Suite', path: '/admin/ip-phone', icon: Phone },
    { name: 'Package Manager', path: '/admin/packages', icon: Package, },
    { name: 'Shop & Marketplace', path: '/admin/shop', icon: ShoppingBag },
    { name: 'Orders Center', path: '/admin/orders', icon: Receipt },
    { name: 'Recharges & Ledger', path: '/admin/recharge', icon: Wallet },
    { name: 'Support Helpdesk', path: '/admin/tickets', icon: LifeBuoy },
    { name: 'Contact Inquiries', path: '/admin/inquiries', icon: MessageSquare },
    { name: 'Payment Verification', path: '/admin/payments', icon: CreditCard },
    { name: 'Subscription Management', path: '/admin/subscriptions', icon: CalendarCheck },
    { name: 'Payment Methods', path: '/admin/payment-methods', icon: BadgeDollarSign },
    { name: 'Payment Settings', path: '/admin/payment-settings', icon: Settings },
    { name: 'Admin Notifications', path: '/admin/notifications', icon: Bell },
    {
      name: 'CMS & Site Management',
      icon: FileText,
      badge: 'CMS',
      isGroup: true,
      children: [
        { name: 'Navigation Menu Manager', path: '/admin/navigation', icon: Menu },
        { name: 'Pages / Landing CMS', path: '/admin/cms/pages', icon: FileText },
        { name: 'Contact Page CMS', path: '/admin/cms/contact', icon: FileText },
        { name: 'Resources & Guides CMS', path: '/admin/cms/resources', icon: BookOpen },
        { name: 'Header / Navbar Manager', path: '/admin/cms/header', icon: FileText },
        { name: 'Footer Manager', path: '/admin/cms/footer', icon: FileText },
        { name: 'Home Page Manager', path: '/admin/cms/home', icon: FileText },
        { name: 'Brand Logos / Clients', path: '/admin/cms/home?tab=clients', icon: FileText },
        { name: 'Features Manager', path: '/admin/cms/features', icon: FileText },
        { name: 'FAQ Manager', path: '/admin/cms/home?tab=faq', icon: FileText },
        { name: 'Testimonials', path: '/admin/cms/testimonials', icon: FileText },
        { name: 'Blog / News', path: '/admin/cms/blog', icon: FileText },
        { name: 'Media Library', path: '/admin/cms/media', icon: FileText },
        { name: 'Global Site Settings', path: '/admin/cms/settings', icon: Settings },
      ],
    },
    { name: 'My Account & Security', path: '/admin/profile', icon: UserCircle },
    { name: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-slate-200 fixed inset-y-0 left-0 z-30 shadow-xs">
        
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
        <div className="inline-block">
                  <BrandLogo size="lg" showTagline={false} to="/" />
                </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#12544F]/10 text-[#12544F] border border-[#12544F]/20">
            Admin
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-2">
          {adminNav.map((item) => {
            if (item.isGroup) {
              const isChildActive = item.children.some((c) => {
                const [cPath] = c.path.split('?');
                return location.pathname === cPath || location.pathname.startsWith(`${cPath}/`);
              });
              return (
                <div key={item.name} className="space-y-1 pt-1">
                  <button
                    type="button"
                    onClick={() => setCmsOpen(!cmsOpen)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      isChildActive
                        ? 'bg-slate-100 text-[#092328] font-bold'
                        : 'text-slate-600 hover:text-[#092328] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className={`w-4 h-4 ${isChildActive ? 'text-[#12544F]' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${cmsOpen ? 'rotate-180 text-[#12544F]' : ''}`} />
                  </button>

                  {cmsOpen && (
                    <div className="pl-6 pr-1 py-1 space-y-1 bg-slate-50/70 rounded-xl border border-slate-100/80">
                      {item.children.map((sub) => {
                        const [subPath, subQuery] = sub.path.split('?');
                        const isSubActive =
                          location.pathname === subPath &&
                          (subQuery
                            ? location.search === `?${subQuery}` || location.search.startsWith(`?${subQuery}&`)
                            : (!location.search || item.children.every((other) => !other.path.includes('?') || location.search !== `?${other.path.split('?')[1]}`)));
                        const SubIcon = sub.icon;
                        return (
                          <Link
                            key={sub.name}
                            to={sub.path}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                              isSubActive
                                ? 'bg-[#12544F] text-white font-bold shadow-xs'
                                : 'text-slate-600 hover:text-[#092328] hover:bg-white'
                            }`}
                          >
                            <SubIcon className={`w-3.5 h-3.5 ${isSubActive ? 'text-[#8BBB92]' : 'text-slate-400'}`} />
                            <span>{sub.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#12544F] text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-[#092328] hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#8BBB92]' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full ${
                    isActive ? 'bg-[#2A835F] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <div className="px-3 py-2 rounded-xl bg-slate-50 text-sm text-slate-500 font-medium">
            Signed in as <strong className="text-slate-700 block truncate">{user?.email || 'admin@gmail.com'}</strong>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen bg-[#F8FAFC]">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-2xs">
          
          {/* Mobile menu trigger & logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            <BrandLogo size="sm" isDark={false} to="/" />
          </div>

          {/* Breadcrumb path */}
          <div className="hidden xl:block text-sm font-bold text-slate-500 shrink-0">
            <span className="text-[#12544F]">Control Room</span> <span className="text-slate-300">/</span> <span className="text-[#092328] capitalize">{location.pathname.split('/').pop().replace('-', ' ') || 'Dashboard'}</span>
          </div>

          {/* Search Bar with Live Options Dropdown */}
          <div ref={searchContainerRef} className="hidden md:flex items-center flex-1 max-w-md relative mx-2">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search users, 096 IP phone, packages, CMS, orders..."
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full cursor-pointer"
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
                        Try searching for: <span className="text-[#12544F] font-bold">Users</span>, <span className="text-[#12544F] font-bold">096 IP</span>, <span className="text-[#12544F] font-bold">Packages</span>, <span className="text-[#12544F] font-bold">CMS</span>, <span className="text-[#12544F] font-bold">Orders</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationOpen((open) => !open)}
                className="relative w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 flex items-center justify-center"
                title="Admin notifications"
              >
                <Bell className="w-4 h-4" />
                {adminUnread > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                    {adminUnread > 99 ? '99+' : adminUnread}
                  </span>
                )}
              </button>
              {notificationOpen && (
                <div className="absolute right-0 top-11 w-[360px] max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-black text-[#092328]">Admin Notifications</div>
                        <div className="text-[10px] text-slate-400">
                          {adminUnread > 99 ? '99+' : adminUnread} unread
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={markAllAdminRead}
                          disabled={adminUnread <= 0}
                          className="text-[10px] font-bold text-slate-400 hover:text-[#12544F] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Mark all read
                        </button>
                        <Link
                          to="/admin/notifications"
                          onClick={() => setNotificationOpen(false)}
                          className="text-[11px] font-bold text-[#12544F]"
                        >
                          View all
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
                    {adminNotifications.length === 0 ? (
                      <div className="p-8 text-center text-sm text-slate-400">No notifications yet.</div>
                    ) : adminNotifications.map((n) => (
                      <div
                        key={n.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => markAdminRead(n.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            markAdminRead(n.id);
                          }
                        }}
                        className={`p-3 cursor-pointer transition-colors ${
                          n.is_read ? 'bg-white hover:bg-slate-50' : 'bg-amber-50/50 hover:bg-amber-50'
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#12544F]/10 text-[#12544F] flex items-center justify-center shrink-0">
                            <Bell className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-black text-[#092328] truncate">{n.title}</div>
                              {!n.is_read && (
                                <span className="shrink-0 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[8px] font-black uppercase">
                                  New
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-600 mt-0.5 leading-relaxed line-clamp-2">{n.message}</div>
                            <div className="flex items-center gap-3 mt-2">
                              {n.link && (
                                <Link
                                  to={n.link}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAdminRead(n.id);
                                    setNotificationOpen(false);
                                  }}
                                  className="text-[10px] font-bold text-[#12544F]"
                                >
                                  Open →
                                </Link>
                              )}
                              {!n.is_read && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAdminRead(n.id);
                                  }}
                                  className="text-[10px] font-bold text-slate-400 hover:text-slate-700"
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12544F]/10 border border-[#2A835F]/20 text-sm font-bold text-[#12544F]">
              <Shield className="w-3.5 h-3.5 text-[#2A835F]" />
              <span>Super Admin Suite</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#12544F] text-white flex items-center justify-center text-sm font-bold shadow-xs">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white text-slate-800 p-4 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <BrandLogo size="sm" isDark={false} to="/" />
              <button onClick={() => setSidebarOpen(false)} className="text-slate-500 hover:text-slate-800">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="space-y-1 overflow-y-auto flex-1">
              {adminNav.map((item) => {
                if (item.isGroup) {
                  return (
                    <div key={item.name} className="space-y-1 pt-1 border-t border-slate-100">
                      <div className="px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400">
                        {item.name}
                      </div>
                      {item.children.map((sub) => {
                        const [subPath, subQuery] = sub.path.split('?');
                        const isSubActive =
                          location.pathname === subPath &&
                          (subQuery
                            ? location.search === `?${subQuery}` || location.search.startsWith(`?${subQuery}&`)
                            : (!location.search || item.children.every((other) => !other.path.includes('?') || location.search !== `?${other.path.split('?')[1]}`)));
                        const SubIcon = sub.icon;
                        return (
                          <Link
                            key={sub.name}
                            to={sub.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                              isSubActive
                                ? 'bg-[#12544F] text-white font-bold'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <SubIcon className={`w-4 h-4 ${isSubActive ? 'text-[#8BBB92]' : 'text-slate-400'}`} />
                            <span>{sub.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  );
                }

                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold ${
                      isActive ? 'bg-[#12544F] text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

