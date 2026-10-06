import { useState, useEffect, useMemo } from 'react';
import API from '../../services/api';
import {
  ShoppingBag,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Search,
  RefreshCw,
  Eye,
  EyeOff,
  Layers,
} from 'lucide-react';

const CATEGORY_PRESETS = [
  { value: 'caller_tune', label: 'Caller Tune' },
  { value: 'recording', label: 'Call Recording' },
  { value: 'device_addon', label: 'Device Extension' },
  { value: 'vip_number', label: 'VIP Golden Number' },
  { value: 'ai_addon', label: 'AI Voice Add-on' },
  { value: 'integration', label: 'Enterprise SIP Trunk' },
];

const BADGE_SUGGESTIONS = [
  'Popular Add-on',
  'Essential for Business',
  'Scale Your Team',
  'Exclusive',
  'Starter Choice',
  'Enterprise Choice',
  'Best Value',
];

export const AdminShopManagement = () => {
  const [products, setProducts] = useState([]);
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProd, setEditingProd] = useState(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('caller_tune');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [price, setPrice] = useState('99');
  const [billingType, setBillingType] = useState('MONTHLY');
  const [description, setDescription] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [badge, setBadge] = useState('');
  const [allowAllPaymentMethods, setAllowAllPaymentMethods] = useState(true);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState('0');
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    setActionError('');
    try {
      const [prodRes, methodsRes] = await Promise.allSettled([
        API.get('/shop/products?include_inactive=true'),
        API.get('/admin/payment-methods').catch(() => API.get('/payment-methods/public')),
      ]);

      if (prodRes.status === 'fulfilled' && prodRes.value.data?.success) {
        setProducts(prodRes.value.data.products || []);
      }

      if (methodsRes.status === 'fulfilled' && methodsRes.value.data?.success) {
        setAvailablePaymentMethods(methodsRes.value.data.methods || []);
      }
    } catch (err) {
      console.error('ERROR LOADING SHOP DATA:', err);
      setActionError(err.response?.data?.message || 'Failed to load shop products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProd(null);
    setName('');
    setCategory('caller_tune');
    setCustomCategory('');
    setIsCustomCategory(false);
    setPrice('99');
    setBillingType('MONTHLY');
    setDescription('');
    setFeaturesText('Custom Audio File Upload\nMP3 / WAV Support\nSchedule Business Hours Jingle');
    setBadge('Popular Add-on');
    setAllowAllPaymentMethods(true);
    setSelectedPaymentMethods([]);
    setIsActive(true);
    setSortOrder('0');
    setActionError('');
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProd(p);
    setName(p.name || '');
    
    const isStandard = CATEGORY_PRESETS.some((c) => c.value === p.category);
    if (isStandard) {
      setCategory(p.category);
      setIsCustomCategory(false);
      setCustomCategory('');
    } else {
      setCategory('custom');
      setIsCustomCategory(true);
      setCustomCategory(p.category || '');
    }

    setPrice(String(p.price ?? 0));
    setBillingType(p.billing_type || 'MONTHLY');
    setDescription(p.description || '');
    setFeaturesText(Array.isArray(p.features) ? p.features.join('\n') : (p.features || ''));
    setBadge(p.badge || '');

    if (p.payment_methods && Array.isArray(p.payment_methods) && p.payment_methods.length > 0) {
      setAllowAllPaymentMethods(false);
      setSelectedPaymentMethods(p.payment_methods);
    } else {
      setAllowAllPaymentMethods(true);
      setSelectedPaymentMethods([]);
    }

    setIsActive(Boolean(p.is_active));
    setSortOrder(String(p.sort_order ?? 0));
    setActionError('');
    setShowModal(true);
  };

  const handleTogglePaymentMethod = (code) => {
    setSelectedPaymentMethods((prev) => {
      if (prev.includes(code)) {
        return prev.filter((c) => c !== code);
      } else {
        return [...prev, code];
      }
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    setActionError('');

    const finalCategory = isCustomCategory ? (customCategory.trim() || 'custom') : category;
    const features = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const payload = {
      name: name.trim(),
      category: finalCategory,
      price: parseFloat(price) || 0,
      billing_type: billingType,
      description: description.trim(),
      features,
      badge: badge.trim() || null,
      payment_methods: allowAllPaymentMethods ? null : selectedPaymentMethods,
      is_active: isActive ? 1 : 0,
      sort_order: parseInt(sortOrder, 10) || 0,
    };

    try {
      if (editingProd) {
        const res = await API.put(`/shop/products/${editingProd.id}`, payload);
        if (res.data?.success) {
          setActionMessage(`"${payload.name}" updated successfully!`);
        }
      } else {
        const res = await API.post('/shop/products', payload);
        if (res.data?.success) {
          setActionMessage(`"${payload.name}" added to marketplace!`);
        }
      }
      loadProducts();
      setShowModal(false);
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      console.error('ERROR SAVING PRODUCT:', err);
      setActionError(err.response?.data?.message || err.message || 'Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (p) => {
    try {
      const res = await API.patch(`/shop/products/${p.id}/toggle`);
      if (res.data?.success) {
        setProducts((prev) =>
          prev.map((item) => (item.id === p.id ? { ...item, is_active: res.data.is_active } : item))
        );
        setActionMessage(res.data.message || 'Status updated');
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this service from the marketplace?')) return;
    try {
      const res = await API.delete(`/shop/products/${id}`);
      if (res.data?.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setActionMessage('Product removed from marketplace.');
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting product');
    }
  };

  const formatBillingText = (type) => {
    switch (type) {
      case 'ONE_TIME': return '(One-Time)';
      case 'YEARLY': return '/ year';
      case 'MONTHLY':
      default: return '/ month';
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
      const matchSearch =
        !search.trim() ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase()) ||
        p.badge?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, categoryFilter, search]);

  const uniqueCategories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(set);
  }, [products]);

  const activeCount = products.filter((p) => p.is_active).length;
  const hiddenCount = products.length - activeCount;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#12544F] text-sm font-black uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4" /> Digital Services & Marketplace
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">
            Marketplace Add-ons Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Configure digital products, set prices, choose billing cycles (Monthly, Yearly, One-Time), and toggle live visibility for users.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadProducts}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl font-bold text-sm bg-[#12544F] hover:bg-[#092328] text-white shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Shop Service</span>
          </button>
        </div>
      </div>

      {/* Action Alerts */}
      {(actionMessage || actionError) && (
        <div
          className={`px-4 py-3 rounded-2xl text-sm font-semibold border flex items-center justify-between gap-3 ${
            actionError
              ? 'bg-rose-50 border-rose-200 text-rose-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}
        >
          <span>{actionError || actionMessage}</span>
          <button
            onClick={() => {
              setActionError('');
              setActionMessage('');
            }}
            className="text-sm font-bold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-sm font-bold uppercase tracking-wider">Total Products</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#092328]">{products.length}</div>
          <div className="text-sm text-slate-400">Available add-ons in catalog</div>
        </div>

        <div className="p-5 rounded-3xl bg-emerald-50/60 border border-emerald-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-sm font-black uppercase tracking-wider">Live & Active</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-900">{activeCount}</div>
          <div className="text-sm text-emerald-700/80">Visible to customers</div>
        </div>

        <div className="p-5 rounded-3xl bg-amber-50/60 border border-amber-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-sm font-black uppercase tracking-wider">Hidden / Draft</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <EyeOff className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-900">{hiddenCount}</div>
          <div className="text-sm text-amber-700/80">Hidden from user shop</div>
        </div>

        <div className="p-5 rounded-3xl bg-blue-50/60 border border-blue-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-blue-800">
            <span className="text-sm font-black uppercase tracking-wider">Categories</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-blue-900">{uniqueCategories.length}</div>
          <div className="text-sm text-blue-700/80">Product categories</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products, descriptions, badges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm font-medium focus:border-[#12544F] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-colors whitespace-nowrap cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-[#12544F] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories ({products.length})
          </button>
          {CATEGORY_PRESETS.map((cat) => {
            const count = products.filter((p) => p.category === cat.value).length;
            if (count === 0 && categoryFilter !== cat.value) return null;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategoryFilter(cat.value)}
                className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  categoryFilter === cat.value
                    ? 'bg-[#12544F] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-sm">
                <th className="pb-3">Product Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Price & Cycle</th>
                <th className="pb-3">Payment Methods</th>
                <th className="pb-3">Features</th>
                <th className="pb-3">Badge</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400 text-sm">
                    Loading shop products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400 text-sm">
                    No products found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const methods = Array.isArray(p.payment_methods) ? p.payment_methods : null;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4">
                        <div className="font-extrabold text-[#092328] text-sm">{p.name}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{p.description}</div>
                      </td>
                      <td className="py-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-sm capitalize">
                          {p.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="font-black text-[#12544F] text-base">
                          ৳{parseFloat(p.price).toLocaleString()}
                        </div>
                        <div className="text-[11px] font-bold text-slate-500">
                          {formatBillingText(p.billing_type)}
                        </div>
                      </td>
                      <td className="py-4">
                        {!methods || methods.length === 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            🌐 All Active Methods
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {methods.map((m) => (
                              <span
                                key={m}
                                className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase"
                              >
                                {m.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-4 text-slate-600 text-sm">
                        {Array.isArray(p.features) ? p.features.length : 0} items
                      </td>
                      <td className="py-4">
                        {p.badge ? (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#12544F]/10 text-[#12544F]">
                            {p.badge}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(p)}
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 border cursor-pointer transition-all ${
                            p.is_active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                          title="Click to toggle live status"
                        >
                          {p.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{p.is_active ? 'Active' : 'Hidden'}</span>
                        </button>
                      </td>
                      <td className="py-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="px-3 py-1.5 rounded-xl bg-[#12544F]/10 hover:bg-[#12544F]/20 text-[#12544F] text-sm font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-sm font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-800 space-y-5 relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-sm font-black uppercase tracking-wider text-[#12544F]">
                Digital Marketplace Service
              </span>
              <h3 className="text-2xl font-black text-[#092328]">
                {editingProd ? 'Edit Marketplace Service' : 'Add New Marketplace Service'}
              </h3>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-sm">
              <div>
                <label className="text-slate-700 font-bold block mb-1 text-sm">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Golden 096 IP Number"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] font-bold focus:bg-white focus:outline-none focus:border-[#12544F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1 text-sm">Category</label>
                  <select
                    value={isCustomCategory ? 'custom' : category}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setIsCustomCategory(true);
                      } else {
                        setIsCustomCategory(false);
                        setCategory(e.target.value);
                      }
                    }}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] font-semibold focus:bg-white focus:outline-none"
                  >
                    {CATEGORY_PRESETS.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                    <option value="custom">+ Other / Custom Category</option>
                  </select>

                  {isCustomCategory && (
                    <input
                      type="text"
                      placeholder="Enter custom category"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="mt-2 w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:bg-white focus:outline-none"
                    />
                  )}
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1 text-sm">Billing Cycle</label>
                  <select
                    value={billingType}
                    onChange={(e) => setBillingType(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] font-bold focus:bg-white focus:outline-none"
                  >
                    <option value="MONTHLY">Monthly (৳... / month)</option>
                    <option value="YEARLY">Yearly (৳... / year)</option>
                    <option value="ONE_TIME">One-Time (৳... one-time)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1 text-sm">Price (৳) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="e.g. 999.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] font-black focus:bg-white focus:outline-none focus:border-[#12544F]"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1 text-sm">Badge Tag (Optional)</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. Exclusive, Popular"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] font-semibold focus:bg-white focus:outline-none"
                  />
                  {/* Quick suggestions */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {BADGE_SUGGESTIONS.map((b) => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setBadge(b)}
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 hover:bg-[#12544F]/10 hover:text-[#12544F] text-slate-600 transition-colors cursor-pointer"
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Methods Config */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-slate-800 font-bold block text-sm">Allowed Payment Methods</label>
                    <span className="text-[11px] text-slate-500">Choose which payment gateways/methods users can use</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (allowAllPaymentMethods) {
                        setAllowAllPaymentMethods(false);
                        setSelectedPaymentMethods(availablePaymentMethods.map((m) => m.code).concat(['wallet_balance']));
                      } else {
                        setAllowAllPaymentMethods(true);
                        setSelectedPaymentMethods([]);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                      allowAllPaymentMethods
                        ? 'bg-[#12544F] text-white'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {allowAllPaymentMethods ? 'All Active (Default)' : 'Custom Selection'}
                  </button>
                </div>

                {!allowAllPaymentMethods && (
                  <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700 cursor-pointer hover:border-[#12544F]">
                      <input
                        type="checkbox"
                        checked={selectedPaymentMethods.includes('wallet_balance')}
                        onChange={() => handleTogglePaymentMethod('wallet_balance')}
                        className="rounded text-[#12544F] focus:ring-0 cursor-pointer"
                      />
                      <span>💳 Wallet Balance</span>
                    </label>

                    {availablePaymentMethods.map((method) => (
                      <label
                        key={method.code}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700 cursor-pointer hover:border-[#12544F]"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPaymentMethods.includes(method.code)}
                          onChange={() => handleTogglePaymentMethod(method.code)}
                          className="rounded text-[#12544F] focus:ring-0 cursor-pointer"
                        />
                        <span className="truncate">{method.name || method.code}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1 text-sm">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of this add-on or service..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-none resize-y"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1 text-sm">Features (1 per line)</label>
                <textarea
                  rows={3}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="Exclusive Golden Sequence&#10;Lifetime Ownership&#10;Free Portability Guidance"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] font-mono focus:bg-white focus:outline-none resize-y"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-sm text-slate-800 block">Product Visibility</span>
                  <span className="text-[11px] text-slate-500">Show this service live in user shop & pricing</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                    isActive ? 'bg-[#2A835F]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                      isActive ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl font-bold bg-[#12544F] text-white hover:bg-[#092328] transition-colors cursor-pointer text-sm shadow-md disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Marketplace Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminShopManagement;
