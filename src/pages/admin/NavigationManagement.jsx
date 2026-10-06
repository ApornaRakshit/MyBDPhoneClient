import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import API from '../../services/api';
import {
 
  Plus,
  RotateCcw,
  RefreshCw,
  Search,
  GripVertical,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  MoveRight,
  ChevronDown,
  
  ExternalLink,
  Layers,
  Sparkles,
  Phone,
  Bot,
  Package,
  ShoppingBag,
  Headphones,
  FileText,
  Shield,
  Zap,
  Code,
  LifeBuoy,
  Users,
  MapPin,
  Wallet,
  LayoutDashboard,
  Server,
  ArrowDownUp,
  FolderPlus,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';

const ICON_OPTIONS = [
  { label: 'None', value: '' },
  { label: 'Phone', value: 'Phone', icon: Phone },
  { label: 'Bot (AI)', value: 'Bot', icon: Bot },
  { label: 'Sparkles', value: 'Sparkles', icon: Sparkles },
  { label: 'Headphones', value: 'Headphones', icon: Headphones },
  { label: 'Package', value: 'Package', icon: Package },
  { label: 'ShoppingBag', value: 'ShoppingBag', icon: ShoppingBag },
  { label: 'FileText', value: 'FileText', icon: FileText },
  { label: 'Shield', value: 'Shield', icon: Shield },
  { label: 'Zap', value: 'Zap', icon: Zap },
  { label: 'Code', value: 'Code', icon: Code },
  { label: 'LifeBuoy', value: 'LifeBuoy', icon: LifeBuoy },
  { label: 'Users', value: 'Users', icon: Users },
  { label: 'MapPin', value: 'MapPin', icon: MapPin },
  { label: 'Wallet', value: 'Wallet', icon: Wallet },
  { label: 'Server', value: 'Server', icon: Server },
  { label: 'Dashboard', value: 'LayoutDashboard', icon: LayoutDashboard },
];

export const AdminNavigationManagement = () => {
  const [tree, setTree] = useState([]);
  const [flatList, setFlatList] = useState([]);
  const [dropdownCategories, setDropdownCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingReorder, setSavingReorder] = useState(false);
  const [viewMode, setViewMode] = useState('drag'); // 'drag' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('all'); // 'all' or categoryId
  
  // Modals
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Drag state
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverTarget, setDragOverTarget] = useState(null); // { type: 'main' | 'column', categoryId, columnNum }

  // Toast
  const [toast, setToast] = useState(null);
  const [moveMenu, setMoveMenu] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    path: '#',
    parent_id: '',
    column_number: 1,
    is_dropdown: false,
    icon: '',
    badge: '',
    description: '',
    sort_order: 0,
    is_visible: true,
  });

  const [categoryTitle, setCategoryTitle] = useState('');

  // Fetch Navigation
  const fetchNavigation = async () => {
    setLoading(true);
    try {
      const res = await API.get('/navigation/admin/all');
      if (res.data.success) {
        setTree(res.data.tree || []);
        setFlatList(res.data.flatList || []);
        setDropdownCategories(res.data.dropdownCategories || []);
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to fetch navigation items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNavigation();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Open Modal to Add or Edit Item
  const handleOpenItemModal = (item = null, preset = {}) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title || '',
        path: item.path || '#',
        parent_id: item.parent_id || '',
        column_number: item.column_number || 1,
        is_dropdown: Boolean(item.is_dropdown),
        icon: item.icon || '',
        badge: item.badge || '',
        description: item.description || '',
        sort_order: item.sort_order || 0,
        is_visible: item.is_visible === 1 || item.is_visible === true,
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        path: preset.path || '#',
        parent_id: preset.parent_id !== undefined ? preset.parent_id : '',
        column_number: preset.column_number || 1,
        is_dropdown: preset.is_dropdown || false,
        icon: '',
        badge: '',
        description: '',
        sort_order: 0,
        is_visible: true,
      });
    }
    setItemModalOpen(true);
  };

  // Save Item (Create or Update)
  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('error', 'Title is required');
      return;
    }

    try {
      const payload = {
        ...formData,
        parent_id: formData.parent_id ? parseInt(formData.parent_id, 10) : null,
        column_number: parseInt(formData.column_number, 10) || 1,
        sort_order: parseInt(formData.sort_order, 10) || 0,
      };

      if (editingItem) {
        const res = await API.put(`/navigation/admin/item/${editingItem.id}`, payload);
        if (res.data.success) {
          showToast('success', res.data.message || 'Menu item updated successfully!');
        }
      } else {
        const res = await API.post('/navigation/admin/item', payload);
        if (res.data.success) {
          showToast('success', res.data.message || 'Menu item added successfully!');
        }
      }

      setItemModalOpen(false);
      fetchNavigation();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to save menu item');
    }
  };

  // Add New Dropdown Category Shortcut
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!categoryTitle.trim()) return;

    try {
      const res = await API.post('/navigation/admin/item', {
        title: categoryTitle.trim(),
        path: '#',
        parent_id: null,
        is_dropdown: true,
        sort_order: tree.length + 1,
        is_visible: true,
      });

      if (res.data.success) {
        showToast('success', `Dropdown Category "${categoryTitle}" created!`);
        setCategoryTitle('');
        setCategoryModalOpen(false);
        fetchNavigation();
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to create category');
    }
  };

  // Toggle Visibility
  const handleToggleVisibility = async (itemId) => {
    try {
      const res = await API.patch(`/navigation/admin/item/${itemId}/toggle-visibility`);
      if (res.data.success) {
        showToast('success', res.data.message);
        fetchNavigation();
      }
    } catch (err) {
      showToast('error', 'Failed to toggle visibility');
    }
  };

  // Delete Item
  const handleDeleteItem = async (itemId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? If it is a dropdown category, all child items inside it will also be removed.`)) {
      return;
    }

    try {
      const res = await API.delete(`/navigation/admin/item/${itemId}`);
      if (res.data.success) {
        showToast('success', res.data.message || 'Item deleted successfully');
        fetchNavigation();
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to delete item');
    }
  };

  // Quick Move to Main Navbar
  const handleMoveToMain = async (item) => {
    try {
      const payload = [{
        id: item.id,
        parent_id: null,
        column_number: 1,
        sort_order: tree.length + 1,
        is_dropdown: 0,
      }];
      await API.put('/navigation/admin/reorder', { items: payload });
      showToast('success', `Moved "${item.title}" to Main Navbar`);
      fetchNavigation();
    } catch (err) {
      showToast('error', 'Failed to move item');
    }
  };

  // Quick Move to Dropdown Category & Column
  const handleMoveToDropdown = async (item, targetCategoryId, targetColumn = 1) => {
    try {
      const payload = [{
        id: item.id,
        parent_id: parseInt(targetCategoryId, 10),
        column_number: parseInt(targetColumn, 10),
        sort_order: 99,
        is_dropdown: 0,
      }];
      await API.put('/navigation/admin/reorder', { items: payload });
      showToast('success', `Moved "${item.title}" into dropdown`);
      fetchNavigation();
    } catch (err) {
      showToast('error', 'Failed to move item');
    }
  };

  // Quick Move between columns
  const handleMoveToColumn = async (item, targetColumn) => {
    try {
      const payload = [{
        id: item.id,
        parent_id: item.parent_id,
        column_number: parseInt(targetColumn, 10),
        sort_order: item.sort_order,
      }];
      await API.put('/navigation/admin/reorder', { items: payload });
      showToast('success', `Moved "${item.title}" to Column ${targetColumn}`);
      fetchNavigation();
    } catch (err) {
      showToast('error', 'Failed to move column');
    }
  };


  // Reorder an item within its current parent + column.
  const handleMoveVertical = async (item, direction) => {
    try {
      const siblings = flatList
        .filter((candidate) => {
          const sameParent =
            (candidate.parent_id ?? null) ===
            (item.parent_id ?? null);

          if (!sameParent) return false;
          if (item.parent_id === null) return true;

          return Number(candidate.column_number || 1) ===
            Number(item.column_number || 1);
        })
        .sort((a, b) => {
          const orderDiff =
            Number(a.sort_order || 0) - Number(b.sort_order || 0);
          return orderDiff !== 0
            ? orderDiff
            : Number(a.id) - Number(b.id);
        });

      const currentIndex = siblings.findIndex(
        (candidate) => Number(candidate.id) === Number(item.id)
      );

      if (currentIndex < 0) return;

      const targetIndex =
        direction === 'up'
          ? currentIndex - 1
          : currentIndex + 1;

      if (targetIndex < 0 || targetIndex >= siblings.length) return;

      const reordered = [...siblings];
      [reordered[currentIndex], reordered[targetIndex]] = [
        reordered[targetIndex],
        reordered[currentIndex],
      ];

      const payload = reordered.map((candidate, index) => ({
        id: candidate.id,
        parent_id: candidate.parent_id ?? null,
        column_number: Number(candidate.column_number || 1),
        sort_order: index + 1,
        is_dropdown:
          candidate.parent_id === null
            ? (candidate.is_dropdown ? 1 : 0)
            : 0,
      }));

      const res = await API.put('/navigation/admin/reorder', {
        items: payload,
      });

      if (!res.data?.success) {
        throw new Error(res.data?.message || 'Reorder failed');
      }

      setMoveMenu(null);
      showToast(
        'success',
        `Moved \"${item.title}\" ${direction === 'up' ? 'up' : 'down'} successfully`
      );
      await fetchNavigation();
    } catch (err) {
      showToast(
        'error',
        err.response?.data?.message ||
          err.message ||
          'Failed to reorder item'
      );
    }
  };

  const getSiblingInfo = (item) => {
    const siblings = flatList
      .filter((candidate) => {
        const sameParent =
          (candidate.parent_id ?? null) ===
          (item.parent_id ?? null);

        if (!sameParent) return false;
        if (item.parent_id === null) return true;

        return Number(candidate.column_number || 1) ===
          Number(item.column_number || 1);
      })
      .sort((a, b) => {
        const orderDiff =
          Number(a.sort_order || 0) - Number(b.sort_order || 0);
        return orderDiff !== 0
          ? orderDiff
          : Number(a.id) - Number(b.id);
      });

    const index = siblings.findIndex(
      (candidate) => Number(candidate.id) === Number(item.id)
    );

    return {
      first: index <= 0,
      last: index < 0 || index === siblings.length - 1,
    };
  };

  const openMoveMenu = (event, item, currentColumn = null) => {
    event.preventDefault();
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 230;
    const menuHeight = item.parent_id === null ? 100 : 290;
    const gap = 8;

    const left = Math.min(
      Math.max(8, rect.right - menuWidth),
      Math.max(8, window.innerWidth - menuWidth - 8)
    );

    const shouldOpenUp =
      rect.bottom + menuHeight + gap > window.innerHeight;

    const top = shouldOpenUp
      ? Math.max(8, rect.top - menuHeight - gap)
      : Math.min(
          Math.max(8, rect.bottom + gap),
          Math.max(8, window.innerHeight - menuHeight - 8)
        );

    setMoveMenu({
      item,
      currentColumn,
      top,
      left,
    });
  };

  useEffect(() => {
    if (!moveMenu) return undefined;

    const closeOnOutside = (event) => {
      if (event.target.closest('[data-navigation-move-menu]')) return;
      if (event.target.closest('[data-navigation-move-trigger]')) return;
      setMoveMenu(null);
    };

    const closeOnViewportChange = () => setMoveMenu(null);

    document.addEventListener('mousedown', closeOnOutside);
    window.addEventListener('resize', closeOnViewportChange);
    window.addEventListener('scroll', closeOnViewportChange, true);

    return () => {
      document.removeEventListener('mousedown', closeOnOutside);
      window.removeEventListener('resize', closeOnViewportChange);
      window.removeEventListener('scroll', closeOnViewportChange, true);
    };
  }, [moveMenu]);

  // Reset to Default Menu
  const handleResetDefault = async () => {
    if (!window.confirm('⚠️ WARNING: This will reset the entire Navigation Menu back to the original default telecom structure (Home, Products, Solutions, Features, Call Packages, Developers, Resources, Company). Continue?')) {
      return;
    }

    try {
      const res = await API.post('/navigation/admin/reset-default');
      if (res.data.success) {
        showToast('success', res.data.message);
        fetchNavigation();
      }
    } catch (err) {
      showToast('error', 'Failed to reset default menu');
    }
  };

  // -------------------------------------------------------------
  // HTML5 Drag and Drop Handlers
  // -------------------------------------------------------------
  const onDragStartItem = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.setData('text/plain', JSON.stringify({ id: item.id, parent_id: item.parent_id, column_number: item.column_number }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOverZone = (e, targetInfo) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTarget(targetInfo);
  };

  const onDropZone = async (e, targetInfo) => {
    e.preventDefault();
    setDragOverTarget(null);

    if (!draggedItem) return;

    // Check if target is same as source
    const isSameLocation =
      draggedItem.parent_id === targetInfo.categoryId &&
      (draggedItem.column_number || 1) === (targetInfo.columnNum || 1);

    if (isSameLocation) {
      setDraggedItem(null);
      return;
    }

    setSavingReorder(true);

    try {
      let payload = [];

      if (targetInfo.type === 'main') {
        // Moved to Main Navbar
        payload = [{
          id: draggedItem.id,
          parent_id: null,
          column_number: 1,
          sort_order: 99,
          is_dropdown: draggedItem.is_dropdown ? 1 : 0,
        }];
      } else if (targetInfo.type === 'column') {
        // Moved to a category column
        payload = [{
          id: draggedItem.id,
          parent_id: targetInfo.categoryId,
          column_number: targetInfo.columnNum,
          sort_order: 99,
          is_dropdown: 0,
        }];
      }

      const res = await API.put('/navigation/admin/reorder', { items: payload });
      if (res.data.success) {
        showToast('success', `Moved "${draggedItem.title}" successfully!`);
        fetchNavigation();
      }
    } catch (err) {
      showToast('error', 'Error reordering items');
    } finally {
      setSavingReorder(false);
      setDraggedItem(null);
    }
  };

  // Filtered List for Search
  const filteredFlatList = flatList.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.path && item.path.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  });

  const renderIcon = (iconName) => {
    const opt = ICON_OPTIONS.find((i) => i.value === iconName);
    if (opt && opt.icon) {
      const IconComponent = opt.icon;
      return <IconComponent className="w-3.5 h-3.5 text-[#2A835F]" />;
    }
    return null;
  };

  // Filter categories for the Part 3 view
  const categoriesList = tree.filter((c) => c.is_dropdown === 1 || (c.children && c.children.length > 0));
  const displayedCategories = selectedCategoryTab === 'all'
    ? categoriesList
    : categoriesList.filter((c) => String(c.id) === String(selectedCategoryTab));

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-8 z-50 p-4 rounded-2xl shadow-xl border flex items-center gap-3 transition-all animate-in slide-in-from-top-3 ${
          toast.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* PART 1: HEADER BANNER & ACTION CONTROLS */}
      {/* ======================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">
            Navigation Menu & Dropdown Manager
          </h1>
          <p className="text-sm sm:text-sm text-slate-500 leading-relaxed max-w-3xl">
            Drag any link into the Main Top Navbar to make it a top-level link, drag within the Main Navbar to reorder links, or drag items into any Dropdown Column below. Whatever order you set here appears identically on the website frontend.
          </p>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* View Mode Switcher */}
          <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setViewMode('drag')}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                viewMode === 'drag' ? 'bg-white text-[#12544F] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Drag & Reorder
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-[#12544F] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Full List ({flatList.length})
            </button>
          </div>

          <button
            onClick={handleResetDefault}
            className="px-3.5 py-2 rounded-xl text-sm font-bold border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset to default telecom menu structure"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <button
            onClick={fetchNavigation}
            disabled={loading || savingReorder}
            className="px-3.5 py-2 rounded-xl text-sm font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading || savingReorder ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setCategoryModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-sm font-bold border border-[#12544F]/20 bg-[#12544F]/10 text-[#12544F] hover:bg-[#12544F]/20 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5 text-[#2A835F]" />
            <span>+ New Category</span>
          </button>

          <button
            onClick={() => handleOpenItemModal()}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-[#12544F] hover:bg-[#092328] text-white shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#8BBB92]" />
            <span>+ Add Navbar Item</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Quick Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search navbar items by title or path..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:border-[#12544F]"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm font-semibold text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#12544F]" />
            <span>{tree.length} Main Items</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2A835F]" />
            <span>{dropdownCategories.length} Dropdown Categories</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>{flatList.filter(i => i.is_visible).length} Visible</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-sm font-semibold text-slate-400 bg-white rounded-3xl border border-slate-200">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#12544F]" />
          <span>Loading dynamic navigation hierarchy from database...</span>
        </div>
      ) : viewMode === 'list' ? (
        
        // ==========================================
        // TABULAR FULL LIST VIEW
        // ==========================================
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#092328] uppercase tracking-wider">All Navigation Items ({filteredFlatList.length})</h3>
            <span className="text-sm text-slate-500">Manage all items in a single tabular view</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Title</th>
                  <th className="px-4 py-3.5">Type / Placement</th>
                  <th className="px-4 py-3.5">Path URL</th>
                  <th className="px-4 py-3.5">Column</th>
                  <th className="px-4 py-3.5">Badge</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFlatList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-400 font-medium">
                      No navigation items found matching "{searchQuery}"
                    </td>
                  </tr>
                ) : (
                  filteredFlatList.map((item) => {
                    const parentCategory = tree.find((t) => t.id === item.parent_id);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-3.5 font-bold text-[#092328] flex items-center gap-2">
                          {renderIcon(item.icon)}
                          <span>{item.title}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          {item.parent_id === null ? (
                            item.is_dropdown ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#12544F]/10 text-[#12544F]">
                                Main Dropdown Header
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                                Main Top Link
                              </span>
                            )
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Inside "{parentCategory?.title || 'Dropdown'}"
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-slate-500 truncate max-w-[160px]">
                          {item.path}
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 font-semibold">
                          {item.parent_id ? `Column ${item.column_number || 1}` : '—'}
                        </td>
                        <td className="px-4 py-3.5">
                          {item.badge ? (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-[#2A835F] text-white">
                              {item.badge}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <button
                            onClick={() => handleToggleVisibility(item.id)}
                            className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                              item.is_visible
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {item.is_visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            <span>{item.is_visible ? 'Visible' : 'Hidden'}</span>
                          </button>
                        </td>
                        <td className="px-6 py-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleOpenItemModal(item)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, item.title)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      ) : (

        // ==========================================
        // 3-PART DRAG & DROP BUILDER
        // ==========================================
        <div className="space-y-10">
          
          {/* ======================================================== */}
          {/* PART 2: MAIN NAVBAR (TOP-LEVEL MENU LINKS) */}
          {/* ======================================================== */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-[#092328]">
                    Main Navbar (Top-Level Menu Links)
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-sm font-black bg-[#12544F] text-white">
                    {tree.length} Top Links
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  These items appear directly in the top header navbar bar. Drag cards here from any dropdown to promote them, or drag within this box to reorder the top navbar sequence.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenItemModal(null, { parent_id: '', is_dropdown: false })}
                  className="px-3.5 py-2 rounded-xl text-sm font-bold bg-[#12544F] text-white hover:bg-[#092328] shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[#8BBB92]" />
                  <span>+ Add Top Link</span>
                </button>
              </div>
            </div>

            {/* Drop Zone & Horizontal Draggable Cards for Main Navbar */}
            <div
              onDragOver={(e) => onDragOverZone(e, { type: 'main' })}
              onDrop={(e) => onDropZone(e, { type: 'main' })}
              className={`p-4 rounded-2xl border-2 border-dashed transition-all flex flex-wrap gap-3 min-h-[90px] items-center ${
                dragOverTarget?.type === 'main'
                  ? 'border-[#2A835F] bg-[#2A835F]/10'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              {tree.length === 0 ? (
                <div className="w-full text-center py-6 text-sm text-slate-400 font-medium">
                  Main Navbar is empty. Drag an item here or click "+ Add Top Link".
                </div>
              ) : (
                tree.map((item) => {
                  const hasDropdown = item.is_dropdown === 1 || (item.children && item.children.length > 0);
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => onDragStartItem(e, item)}
                      className={`group relative flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#12544F] hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${
                        !item.is_visible ? 'opacity-60 bg-slate-100' : ''
                      }`}
                    >
                      <GripVertical className="w-4 h-4 text-slate-400 group-hover:text-[#12544F]" />
                      
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-bold text-sm text-[#092328]">
                          {renderIcon(item.icon)}
                          <span>{item.title}</span>
                          {hasDropdown && <ChevronDown className="w-3.5 h-3.5 text-[#2A835F]" />}
                          {item.badge && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-[#2A835F] text-white">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 truncate max-w-[110px]">
                          {hasDropdown ? 'Mega Dropdown' : item.path}
                        </div>
                      </div>

                      {/* Card Action Controls */}
                      <div className="flex items-center gap-1 ml-2 pl-2 border-l border-slate-100">
                        <button
                          onClick={() => handleToggleVisibility(item.id)}
                          className={`p-1 rounded-md text-sm transition-colors cursor-pointer ${
                            item.is_visible ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-200'
                          }`}
                          title={item.is_visible ? 'Visible on Navbar' : 'Hidden'}
                        >
                          {item.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => handleOpenItemModal(item)}
                          className="p-1 rounded-md text-slate-500 hover:text-[#12544F] hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Edit Item"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Move To Dropdown Quick Selector */}
                        {dropdownCategories.length > 0 && !hasDropdown && (
                          <div className="relative group/move">
                            <button
                              className="p-1 rounded-md text-slate-500 hover:text-[#2A835F] hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Move into a Dropdown Category"
                            >
                              <MoveRight className="w-3.5 h-3.5" />
                            </button>
                            <div className="hidden group-hover/move:block absolute left-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40">
                              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase">Move into Dropdown:</div>
                              {dropdownCategories.map((cat) => (
                                <button
                                  key={cat.id}
                                  onClick={() => handleMoveToDropdown(item, cat.id, 1)}
                                  className="w-full text-left px-2 py-1.5 text-sm font-semibold text-slate-700 hover:bg-[#12544F]/10 hover:text-[#12544F] rounded-lg transition-colors truncate cursor-pointer"
                                >
                                  {cat.title} (Col 1)
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => handleDeleteItem(item.id, item.title)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* PART 3: DROPDOWN SUBMENUS BY CATEGORY */}
          {/* ======================================================== */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-[#092328] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#2A835F]" />
                  <span>Dropdown Submenus by Category</span>
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Select a category to manage its multi-column dropdown submenus. Drag cards between columns, reorder, or drag to the Main Navbar above.
                </p>
              </div>

              <button
                onClick={() => setCategoryModalOpen(true)}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-[#2A835F] hover:bg-[#12544F] text-white shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>+ Create Dropdown Category</span>
              </button>
            </div>

            {/* Category Selector Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <button
                onClick={() => setSelectedCategoryTab('all')}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  selectedCategoryTab === 'all'
                    ? 'bg-[#12544F] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                All Categories ({categoriesList.length})
              </button>

              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryTab(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    String(selectedCategoryTab) === String(cat.id)
                      ? 'bg-[#12544F] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat.title}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                    String(selectedCategoryTab) === String(cat.id) ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {(cat.children || []).length}
                  </span>
                </button>
              ))}
            </div>

            {/* Render Category Blocks */}
            <div className="space-y-8">
              {displayedCategories.map((category) => {
                const cols = category.columns || { 1: [], 2: [], 3: [] };
                return (
                  <div
                    key={category.id}
                    className="relative bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-visible"
                  >
                    {/* Category Header */}
                    <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-[#12544F] text-white flex items-center justify-center font-black text-sm shadow-xs">
                          {category.title.substring(0, 2).toUpperCase()}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-black text-[#092328]">{category.title} Dropdown</h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {(category.children || []).length} Sub-items
                            </span>
                            {!category.is_visible && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                                Hidden
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Appears when hovering "{category.title}" on the main navigation bar.
                          </p>
                        </div>
                      </div>

                      {/* Category Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenItemModal(null, { parent_id: category.id, column_number: 1 })}
                          className="px-3 py-1.5 rounded-xl text-sm font-bold bg-[#12544F] text-white hover:bg-[#092328] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#8BBB92]" />
                          <span>Add Item to {category.title}</span>
                        </button>

                        <button
                          onClick={() => handleOpenItemModal(category)}
                          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#12544F] hover:bg-slate-50 transition-colors cursor-pointer"
                          title="Rename Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleToggleVisibility(category.id)}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            category.is_visible
                              ? 'bg-white border-slate-200 text-emerald-600 hover:bg-slate-50'
                              : 'bg-slate-100 border-slate-200 text-slate-400'
                          }`}
                          title="Toggle Category Visibility"
                        >
                          {category.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => handleDeleteItem(category.id, category.title)}
                          className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* 3 Columns Layout (Column 1, Column 2, Column 3) */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                      {[1, 2, 3].map((colNum) => {
                        const itemsInCol = cols[colNum] || [];
                        const isDragTarget =
                          dragOverTarget?.type === 'column' &&
                          dragOverTarget?.categoryId === category.id &&
                          dragOverTarget?.columnNum === colNum;

                        return (
                          <div
                            key={colNum}
                            onDragOver={(e) => onDragOverZone(e, { type: 'column', categoryId: category.id, columnNum: colNum })}
                            onDrop={(e) => onDropZone(e, { type: 'column', categoryId: category.id, columnNum: colNum })}
                            className={`flex flex-col rounded-2xl border transition-all ${
                              isDragTarget
                                ? 'border-[#2A835F] bg-[#2A835F]/10 ring-2 ring-[#2A835F]/30'
                                : 'border-slate-200 bg-slate-50/60'
                            }`}
                          >
                            {/* Column Header */}
                            <div className="px-4 py-3 border-b border-slate-200/80 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-md bg-[#12544F]/10 text-[#12544F] font-black text-[11px] flex items-center justify-center">
                                  {colNum}
                                </span>
                                <span className="text-sm font-black text-[#092328] uppercase tracking-wider">
                                  Column {colNum}
                                </span>
                                <span className="text-[11px] text-slate-400 font-semibold">
                                  ({itemsInCol.length})
                                </span>
                              </div>

                              <button
                                onClick={() => handleOpenItemModal(null, { parent_id: category.id, column_number: colNum })}
                                className="p-1 rounded-lg text-[#12544F] hover:bg-white transition-colors cursor-pointer"
                                title={`Add Item directly into Column ${colNum}`}
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Column Item Cards / Drop Zone */}
                            <div className="p-3 space-y-2.5 flex-1 min-h-[140px]">
                              {itemsInCol.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center py-8 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-xl p-3">
                                  <span>Empty Column {colNum}</span>
                                  <span className="text-[10px] text-slate-300">Drop items here</span>
                                </div>
                              ) : (
                                itemsInCol.map((item) => (
                                  <div
                                    key={item.id}
                                    draggable
                                    onDragStart={(e) => onDragStartItem(e, item)}
                                    className={`group relative p-3 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-[#12544F] hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${
                                      !item.is_visible ? 'opacity-60 bg-slate-100' : ''
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex items-start gap-2">
                                        <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-[#12544F] mt-0.5 shrink-0" />
                                        <div className="space-y-0.5">
                                          <div className="flex items-center gap-1.5 text-sm font-bold text-[#092328]">
                                            {renderIcon(item.icon)}
                                            <span>{item.title}</span>
                                            {item.badge && (
                                              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-[#2A835F] text-white">
                                                {item.badge}
                                              </span>
                                            )}
                                          </div>
                                          {item.description && (
                                            <p className="text-[11px] text-slate-500 line-clamp-1">
                                              {item.description}
                                            </p>
                                          )}
                                          <div className="text-[10px] font-mono text-slate-400">
                                            {item.path}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Actions for Item in Dropdown Column */}
                                      <div className="flex items-center gap-0.5 shrink-0">
                                        <button
                                          onClick={() => handleToggleVisibility(item.id)}
                                          className={`p-1 rounded-md transition-colors cursor-pointer ${
                                            item.is_visible ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-200'
                                          }`}
                                          title={item.is_visible ? 'Visible' : 'Hidden'}
                                        >
                                          {item.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                        </button>

                                        <button
                                          onClick={() => handleOpenItemModal(item)}
                                          className="p-1 rounded-md text-slate-500 hover:text-[#12544F] hover:bg-slate-100 transition-colors cursor-pointer"
                                          title="Edit Item"
                                        >
                                          <Edit2 className="w-3.5 h-3.5" />
                                        </button>

                                        {/* Move / Reorder Selector */}
                                        <button
                                          type="button"
                                          data-navigation-move-trigger
                                          onClick={(e) => openMoveMenu(e, item, colNum)}
                                          className="p-1 rounded-md text-slate-400 hover:text-[#2A835F] hover:bg-slate-100 transition-colors cursor-pointer"
                                          title="Move / Reorder item"
                                        >
                                          <ArrowDownUp className="w-3.5 h-3.5" />
                                        </button>

                                        <button
                                          onClick={() => handleDeleteItem(item.id, item.title)}
                                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                          title="Delete Item"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: ADD / EDIT NAVBAR ITEM */}
      {/* ======================================================== */}
      {itemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-base font-black text-[#092328]">
                {editingItem ? 'Edit Navigation Item' : 'Add New Navigation Item'}
              </h3>
              <button onClick={() => setItemModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 space-y-4 overflow-y-auto flex-1 text-sm">
              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Item Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud PBX, Call Packages, About Us"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#12544F]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Route / URL Path *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /packages, /ip-phone, /ai-calling or #"
                  value={formData.path}
                  onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#12544F]"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Use '#' for dropdown category triggers. For a no-code page, use a route such as <span className="font-mono">/features</span> or <span className="font-mono">/company</span> and publish the matching slug from Pages / Landing CMS.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Parent / Placement
                  </label>
                  <select
                    value={formData.parent_id}
                    onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#12544F]"
                  >
                    <option value="">Main Navbar (Top-Level)</option>
                    {dropdownCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        Inside "{cat.title}" Dropdown
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Dropdown Column
                  </label>
                  <select
                    disabled={!formData.parent_id}
                    value={formData.column_number}
                    onChange={(e) => setFormData({ ...formData, column_number: parseInt(e.target.value, 10) })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#12544F] disabled:opacity-50"
                  >
                    <option value={1}>Column 1</option>
                    <option value={2}>Column 2</option>
                    <option value={3}>Column 3</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Supporting Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Enterprise 096 IP telephony and PBX cluster"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#12544F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Icon
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#12544F]"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AI, New, Hot, 50% Off"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#12544F]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-sm font-bold text-slate-800 block">Item Visibility</span>
                  <span className="text-[11px] text-slate-400">Show or hide this item on the live public website.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_visible}
                    onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#12544F]"></div>
                </label>
              </div>

              {!formData.parent_id && (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#12544F]/5 border border-[#2A835F]/20">
                  <div>
                    <span className="text-sm font-bold text-[#092328] block">Act as Dropdown Category Header</span>
                    <span className="text-[11px] text-slate-500">Enable if this main navbar item contains multi-column mega menu children.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.is_dropdown}
                    onChange={(e) => setFormData({ ...formData, is_dropdown: e.target.checked })}
                    className="w-4 h-4 rounded text-[#12544F] focus:ring-[#12544F]"
                  />
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setItemModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#12544F] hover:bg-[#092328] shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#8BBB92]" />
                  <span>{editingItem ? 'Update Menu Item' : 'Save to Menu'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ======================================================== */}
      {/* PORTAL: MOVE / REORDER MENU */}
      {/* ======================================================== */}
      {moveMenu && createPortal(
        (() => {
          const { item, currentColumn, top, left } = moveMenu;
          const siblingInfo = getSiblingInfo(item);
          const isChild = item.parent_id !== null;
          const activeColumn = Number(currentColumn || item.column_number || 1);

          return (
            <div
              data-navigation-move-menu
              className="fixed z-[9999] w-[230px] rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl ring-1 ring-black/5"
              style={{ top, left }}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-2.5 py-2 border-b border-slate-100 mb-1">
                <div className="text-[11px] font-black text-[#092328] truncate">
                  {item.title}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {isChild ? `Column ${activeColumn}` : 'Main Navbar'}
                </div>
              </div>

              <button
                type="button"
                disabled={siblingInfo.first}
                onClick={() => handleMoveVertical(item, 'up')}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-sm font-bold transition-colors ${
                  siblingInfo.first
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-700 hover:bg-[#12544F]/10 hover:text-[#12544F] cursor-pointer'
                }`}
              >
                <span>Move Up</span>
                <span className="text-sm leading-none">↑</span>
              </button>

              <button
                type="button"
                disabled={siblingInfo.last}
                onClick={() => handleMoveVertical(item, 'down')}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-sm font-bold transition-colors ${
                  siblingInfo.last
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-700 hover:bg-[#12544F]/10 hover:text-[#12544F] cursor-pointer'
                }`}
              >
                <span>Move Down</span>
                <span className="text-sm leading-none">↓</span>
              </button>

              {isChild && (
                <>
                  <div className="my-1 border-t border-slate-100" />

                  <button
                    type="button"
                    onClick={() => handleMoveToMain(item)}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-sm font-bold text-[#12544F] hover:bg-[#12544F]/10 cursor-pointer"
                  >
                    <span>Move to Main Navbar</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <div className="mt-1 px-2.5 py-1 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                    Change Column
                  </div>

                  {[1, 2, 3].map((column) => (
                    <button
                      key={column}
                      type="button"
                      disabled={activeColumn === column}
                      onClick={() => handleMoveToColumn(item, column)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
                        activeColumn === column
                          ? 'text-slate-300 cursor-not-allowed'
                          : 'text-slate-700 font-semibold hover:bg-slate-100 cursor-pointer'
                      }`}
                    >
                      <span>Column {column}</span>
                      {activeColumn === column && (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                    </button>
                  ))}
                </>
              )}

              <div className="mt-1 pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setMoveMenu(null)}
                  className="w-full px-2.5 py-1.5 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          );
        })(),
        document.body
      )}

      {/* ======================================================== */}
      {/* MODAL 2: CREATE DROPDOWN CATEGORY */}
      {/* ======================================================== */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-[#2A835F]" />
                <h3 className="text-base font-black text-[#092328]">New Dropdown Category</h3>
              </div>
              <button onClick={() => setCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-500">
              Creates a new mega menu header on the Main Navbar (e.g., Enterprise, Ecosystem, Services).
            </p>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solutions, Ecosystem, Services"
                  value={categoryTitle}
                  onChange={(e) => setCategoryTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#12544F]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-[#12544F] hover:bg-[#092328] shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#8BBB92]" />
                  <span>Create Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
