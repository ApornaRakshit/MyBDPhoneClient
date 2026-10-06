import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { BrandLogo } from '../common/BrandLogo';
import { useAuth } from '../../context/AuthContext';
import {
  Phone,
  Bot,
  Package,
  ShoppingBag,
  Sparkles,
  Menu,
  X,
  User,
  LayoutDashboard,
  ShieldAlert,
  LogOut,
  Wallet,
  ChevronDown,
  ChevronRight,
  Headphones,
  FileText,
  Shield,
  Zap,
  Code,
  LifeBuoy,
  Users,
  MapPin,
  Server
} from 'lucide-react';

const API_ROOT = String(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
const mediaUrl = (value, fallback='') => { if (!value) return fallback; if (/^(https?:\/\/|data:)/i.test(value)) return value; if (value.startsWith('/uploads/')) return `${API_ROOT}${value}`; return value; };

const ICON_MAP = {
  Phone,
  Bot,
  Package,
  ShoppingBag,
  Sparkles,
  Headphones,
  FileText,
  Shield,
  Zap,
  Code,
  LifeBuoy,
  Users,
  MapPin,
  Wallet,
  Server,
  LayoutDashboard,
};

export const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const [navItems, setNavItems] = useState([]);
  const [headerConfig, setHeaderConfig] = useState({});
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [mobileExpandedCat, setMobileExpandedCat] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownTimeoutRef = useRef(null);

  // Fetch dynamic navigation menu from backend API
  const fetchNavMenu = async () => {
    try {
      const res = await API.get('/navigation/public');
      if (res.data.success && Array.isArray(res.data.navigation)) {
        setNavItems(res.data.navigation);
      }
    } catch (err) {
      console.error('Error fetching dynamic navigation:', err);
    }
  };

  useEffect(() => {
    fetchNavMenu();
    API.get('/cms/public/header')
      .then((res) => setHeaderConfig(res.data?.config || {}))
      .catch((err) => console.error('Error fetching CMS header:', err));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setActiveDropdownId(null);
  }, [location.pathname]);

  const handleMouseEnter = (itemId) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdownId(itemId);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdownId(null);
    }, 200);
  };

  const toggleMobileCategory = (catId) => {
    setMobileExpandedCat((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderIcon = (iconName) => {
    if (!iconName) return null;
    const IconComp = ICON_MAP[iconName];
    if (!IconComp) return null;
    return <IconComp className="w-4 h-4 text-[#2A835F] shrink-0" />;
  };

  // Resolve dynamic paths smartly depending on auth state (e.g. Instant Recharge, Customer Portal)
  const resolveNavPath = (navItem) => {
    if (!navItem) return '#';
    const rawPath = typeof navItem === 'string' ? navItem : navItem.path || '#';
    const title = (typeof navItem === 'object' ? navItem.title || '' : '').trim().toLowerCase();

    // Instant Recharge
    if (title.includes('instant recharge') || rawPath === '/recharge' || rawPath === '/user/recharge') {
      if (user) {
        return isAdmin ? '/admin/recharge' : '/user/recharge';
      }
      return '/login?redirect=/user/recharge';
    }

    // Customer Portal
    if (title.includes('customer portal') || rawPath === '/user/dashboard' || rawPath === '/dashboard') {
      if (user) {
        return isAdmin ? '/admin/dashboard' : '/user/dashboard';
      }
      return '/login?redirect=/user/dashboard';
    }

    if (rawPath === '/login') {
      if (user) {
        return isAdmin ? '/admin/dashboard' : '/user/dashboard';
      }
    }

    return rawPath;
  };

  // Determine which SINGLE top-level navigation item is currently active
  const activeTopLevelId = useMemo(() => {
    const currentPath = location.pathname;
    if (!navItems || navItems.length === 0) return null;

    // 1. Highest priority: Exact match on top-level direct links (e.g. /contact, /packages, /)
    const directMatch = navItems.find((item) => {
      const hasDropdown = item.has_dropdown || (item.children && item.children.length > 0);
      if (hasDropdown) return false;
      if (!item.path || item.path === '#') return false;
      if (item.path === '/') return currentPath === '/';
      return currentPath === item.path;
    });

    if (directMatch) {
      return directMatch.id;
    }

    // Set of standalone direct paths to avoid dropdown matching shared utility links
    const directPaths = new Set(
      navItems
        .filter((item) => !(item.has_dropdown || (item.children && item.children.length > 0)))
        .map((item) => item.path)
        .filter((p) => p && p !== '#')
    );

    // 2. Second priority: Match within dropdown items (ignoring paths that belong to standalone top-level links)
    for (const item of navItems) {
      const hasDropdown = item.has_dropdown || (item.children && item.children.length > 0);
      if (!hasDropdown) continue;

      // Check item.children
      if (Array.isArray(item.children)) {
        const found = item.children.some(
          (child) => child.path && child.path !== '#' && child.path === currentPath && !directPaths.has(child.path)
        );
        if (found) return item.id;
      }

      // Check item.columns
      if (item.columns) {
        for (const colKey of Object.keys(item.columns)) {
          const colItems = item.columns[colKey];
          if (Array.isArray(colItems)) {
            const found = colItems.some(
              (sub) => sub.path && sub.path !== '#' && sub.path === currentPath && !directPaths.has(sub.path)
            );
            if (found) return item.id;
          }
        }
      }
    }

    // 3. Fallback prefix match for sub-routes under dropdowns
    for (const item of navItems) {
      const hasDropdown = item.has_dropdown || (item.children && item.children.length > 0);
      if (!hasDropdown) continue;

      const checkPrefix = (subPath) => {
        if (!subPath || subPath === '#' || subPath === '/' || directPaths.has(subPath)) return false;
        return currentPath.startsWith(subPath);
      };

      if (Array.isArray(item.children)) {
        if (item.children.some((child) => checkPrefix(child.path))) return item.id;
      }

      if (item.columns) {
        for (const colKey of Object.keys(item.columns)) {
          const colItems = item.columns[colKey];
          if (Array.isArray(colItems)) {
            if (colItems.some((sub) => checkPrefix(sub.path))) return item.id;
          }
        }
      }
    }

    return null;
  }, [navItems, location.pathname]);

  return (
    <header
      className={`${headerConfig.sticky_header !== false ? 'sticky top-0' : 'relative'} z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-2.5'
          : 'bg-white border-b border-slate-100 py-3.5'
      }`}
    >
     

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            {headerConfig.logo_url ? (
              <Link to="/" className="inline-flex items-center">
                <img src={mediaUrl(headerConfig.logo_url)} alt="MyBDPhone" className="w-[160px] h-auto max-h-12 object-contain" />
              </Link>
            ) : (
              <BrandLogo size="md" showTagline={false} />
            )}
          </div>

          {/* ======================================================== */}
          {/* DESKTOP DYNAMIC NAVBAR WITH MEGA MENUS */}
          {/* ======================================================== */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-3">
            {navItems.map((item) => {
              const hasDropdown = item.has_dropdown || (item.children && item.children.length > 0);
              const isItemActive = activeTopLevelId === item.id;
              const isDropdownOpen = activeDropdownId === item.id;

              if (hasDropdown) {
                const cols = item.columns || { 1: [], 2: [], 3: [] };
                const hasCol1 = cols[1] && cols[1].length > 0;
                const hasCol2 = cols[2] && cols[2].length > 0;
                const hasCol3 = cols[3] && cols[3].length > 0;

                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Dropdown Header Trigger */}
                    <button
                      type="button"
                      onClick={() => setActiveDropdownId(isDropdownOpen ? null : item.id)}
                      className={`relative py-1.5 px-3 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center gap-1 cursor-pointer select-none ${
                        isItemActive
                          ? 'text-[#2A835F] font-bold'
                          : isDropdownOpen
                            ? 'text-[#2A835F]'
                            : 'text-slate-700 hover:text-[#2A835F]'
                      }`}
                    >
                      {renderIcon(item.icon)}
                      <span>{item.title}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isDropdownOpen 
                            ? 'rotate-180 text-[#2A835F]' 
                            : isItemActive 
                              ? 'text-[#2A835F]' 
                              : 'text-slate-400'
                        }`}
                      />
                      {item.badge && (
                        <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-[#2A835F] text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {isItemActive && (
                        <span className="absolute -bottom-1 left-3 right-3 h-[2.5px] bg-[#2A835F] rounded-full transition-all duration-200" />
                      )}
                    </button>

                    {/* Mega Dropdown Panel */}
                    {isDropdownOpen && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                        style={{ minWidth: hasCol3 ? '680px' : hasCol2 ? '480px' : '260px' }}
                      >
                        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-5 overflow-hidden">
                          
                          {/* Dropdown Title Bar */}
                          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 text-sm">
                            <span className="font-extrabold text-[#092328] uppercase tracking-wider flex items-center gap-1.5">
                              {renderIcon(item.icon)}
                              <span>{item.title} Platform & Solutions</span>
                            </span>
                            <span className="text-[11px] text-slate-400 font-semibold">
                              Unified Telecom Suite
                            </span>
                          </div>

                          {/* 3 Columns Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map((colNum) => {
                              const colItems = cols[colNum] || [];
                              if (colItems.length === 0 && !hasCol3) return null;

                              return (
                                <div key={colNum} className="space-y-3">
                                  <div className="space-y-1">
                                    {colItems.map((sub) => {
                                      const targetPath = resolveNavPath(sub);
                                      const isSubActive = isItemActive && (location.pathname === sub.path || location.pathname === targetPath) && targetPath !== '#';
                                      const iconNode = renderIcon(sub.icon);
                                      return (
                                        <Link
                                          key={sub.id}
                                          to={targetPath}
                                          onClick={() => setActiveDropdownId(null)}
                                          className={`group block p-2.5 rounded-xl transition-all ${
                                            isSubActive
                                              ? 'bg-[#12544F]/10 text-[#12544F] font-bold border-l-2 border-[#2A835F]'
                                              : 'hover:bg-slate-50 text-slate-700'
                                          }`}
                                        >
                                          <div className="flex items-start gap-2.5">
                                            {iconNode && (
                                              <div className="mt-0.5 shrink-0">
                                                {iconNode}
                                              </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                              <div className={`text-sm flex items-center gap-1.5 transition-colors ${
                                                isSubActive ? 'font-black text-[#12544F]' : 'font-bold text-[#092328] group-hover:text-[#12544F]'
                                              }`}>
                                                <span>{sub.title}</span>
                                                {sub.badge && (
                                                  <span className="px-1.5 py-0.2 text-[8px] font-black uppercase tracking-wider bg-[#2A835F] text-white rounded-full">
                                                    {sub.badge}
                                                  </span>
                                                )}
                                              </div>
                                              {sub.description && (
                                                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 leading-snug">
                                                  {sub.description}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Dropdown Bottom Banner */}
                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-sm bg-slate-50/80 -mx-5 -mb-5 px-5 py-3">
                            <span className="text-slate-600 font-medium">
                              Need a custom enterprise setup?
                            </span>
                            <Link
                              to="/contact"
                              onClick={() => setActiveDropdownId(null)}
                              className="font-bold text-[#12544F] hover:text-[#2A835F] flex items-center gap-1"
                            >
                              <span>Talk to Telecom Specialist</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // Direct Link (e.g. Home, Call Packages, Contact us, etc.)
              const directTargetPath = resolveNavPath(item);
              return (
                <Link
                  key={item.id}
                  to={directTargetPath}
                  className={`relative py-1.5 px-3 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center gap-1.5 ${
                    isItemActive
                      ? 'text-[#2A835F] font-bold'
                      : 'text-slate-700 hover:text-[#2A835F]'
                  }`}
                >
                  {renderIcon(item.icon)}
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-[#2A835F] text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {isItemActive && (
                    <span className="absolute -bottom-1 left-3 right-3 h-[2.5px] bg-[#2A835F] rounded-full transition-all duration-200" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ======================================================== */}
          {/* ACTION CTAS / USER AUTH AREA */}
          {/* ======================================================== */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 pl-3 pr-2.5 py-1.5 rounded-full border border-slate-200 hover:border-[#2A835F]/40 bg-slate-50 hover:bg-white transition-all text-sm font-medium shadow-2xs cursor-pointer"
                >
                  {/* Balance Pill for User / Admin Badge for Admin */}
                  {isAdmin ? (
                    <div className="flex items-center gap-1 text-sm font-black text-white bg-[#12544F] px-2.5 py-0.5 rounded-full">
                      <ShieldAlert className="w-3 h-3 text-[#8BBB92]" />
                      <span>Admin</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-sm font-bold text-[#12544F] bg-[#8BBB92]/20 px-2 py-0.5 rounded-full">
                      <Wallet className="w-3.5 h-3.5 text-[#2A835F]" />
                      <span>৳{parseFloat(user.balance || 0).toLocaleString()}</span>
                    </div>
                  )}

                  {/* User name & avatar */}
                  <span className="text-slate-800 font-semibold max-w-[110px] truncate">
                    {user.name?.split(' ')[0]}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#12544F] to-[#2A835F] text-white flex items-center justify-center font-bold text-sm">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Signed in as</p>
                      <p className="text-sm font-bold text-[#092328] truncate">{user.email}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                        isAdmin ? 'bg-[#12544F] text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        Role: {user.role}
                      </span>
                    </div>

                    <div className="py-1">
                      {isAdmin ? (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-[#12544F]/10 hover:text-[#12544F] font-semibold"
                        >
                          <ShieldAlert className="w-4 h-4 text-[#2A835F]" />
                          Admin Control Room
                        </Link>
                      ) : (
                        <>
                          <Link
                            to="/user/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-[#12544F]/10 hover:text-[#12544F] font-semibold"
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#12544F]" />
                            User Dashboard
                          </Link>

                          <Link
                            to="/user/recharge"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-[#12544F]/10 hover:text-[#12544F] font-semibold"
                          >
                            <Wallet className="w-4 h-4 text-[#2A835F]" />
                            Recharge Balance
                          </Link>

                          <Link
                            to="/user/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-[#12544F]/10 hover:text-[#12544F] font-semibold"
                          >
                            <User className="w-4 h-4 text-slate-500" />
                            Account Settings
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-semibold cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to={headerConfig.login_url || "/login"}
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-[#12544F] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to={headerConfig.primary_url || "/packages"}
                  className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-[#12544F] to-[#2A835F] hover:from-[#092328] hover:to-[#12544F] rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                >
                  <span>{headerConfig.primary_text || 'Get Started'}</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#8BBB92]" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center xl:hidden space-x-2">
            {user && !isAdmin && (
              <Link
                to="/user/dashboard"
                className="p-2 rounded-lg bg-slate-100 text-[#12544F] font-bold text-sm flex items-center gap-1"
              >
                <Wallet className="w-3.5 h-3.5 text-[#2A835F]" />
                <span>৳{parseFloat(user.balance || 0).toFixed(0)}</span>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-[#12544F] hover:bg-slate-100 focus:outline-hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* MOBILE DRAWER NAVIGATION (DYNAMIC ACCORDION) */}
      {/* ======================================================== */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top duration-200 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const hasDropdown = item.has_dropdown || (item.children && item.children.length > 0);
              const isItemActive = activeTopLevelId === item.id;
              const isExpanded = Boolean(mobileExpandedCat[item.id]);

              if (hasDropdown) {
                return (
                  <div key={item.id} className="border-b border-slate-100 py-1">
                    <button
                      onClick={() => toggleMobileCategory(item.id)}
                      className={`w-full px-3 py-2.5 text-sm font-bold flex items-center justify-between rounded-xl transition-colors ${
                        isItemActive ? 'text-[#2A835F] bg-[#2A835F]/10' : 'text-[#092328] hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {renderIcon(item.icon)}
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.2 text-[8px] font-black bg-[#2A835F] text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180 text-[#2A835F]' : ''}`} />
                    </button>

                    {/* Sub-items in mobile */}
                    {isExpanded && (
                      <div className="pl-6 pr-2 py-2 space-y-1 bg-slate-50/60 rounded-xl mt-1">
                        {item.children?.map((sub) => {
                          const targetPath = resolveNavPath(sub);
                          const isSubActive = isItemActive && (location.pathname === sub.path || location.pathname === targetPath) && targetPath !== '#';
                          const iconNode = renderIcon(sub.icon);
                          return (
                            <Link
                              key={sub.id}
                              to={targetPath}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`block px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                                isSubActive
                                  ? 'text-[#2A835F] font-bold bg-[#2A835F]/10'
                                  : 'text-slate-700 hover:text-[#12544F]'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                {iconNode && (
                                  <div className="mt-0.5 shrink-0">
                                    {iconNode}
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 font-bold text-[#092328]">
                                    <span>{sub.title}</span>
                                    {sub.badge && (
                                      <span className="px-1.5 py-0.2 text-[8px] font-black bg-[#2A835F] text-white rounded-full">
                                        {sub.badge}
                                      </span>
                                    )}
                                  </div>
                                  {sub.description && (
                                    <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                                      {sub.description}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // Direct link
              const directTargetPath = resolveNavPath(item);
              return (
                <Link
                  key={item.id}
                  to={directTargetPath}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 text-sm font-semibold flex items-center justify-between transition-colors rounded-xl ${
                    isItemActive
                      ? 'text-[#2A835F] font-bold bg-[#2A835F]/10 border-l-4 border-[#2A835F]'
                      : 'text-slate-700 hover:text-[#2A835F] hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {renderIcon(item.icon)}
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#2A835F] text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to={isAdmin ? "/admin/dashboard" : "/user/dashboard"}
                  className="w-full text-center py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#12544F] to-[#2A835F]"
                >
                  {isAdmin ? "Open Admin Panel" : "Go to User Dashboard"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 rounded-xl text-sm font-bold text-rose-600 bg-rose-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-slate-100"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#12544F] to-[#2A835F]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
