import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  Mail,
  Phone,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
  User,
  Send,
  Copy,
  Check,
  AlertCircle,
  MessageCircle,
  Calendar,
  Save,
  X
} from 'lucide-react';

const STATUS_COLORS = {
  new: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'New Inquiry' },
  read: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Read / Reviewed' },
  contacted: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', label: 'Contacted' },
  in_progress: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', label: 'In Progress' },
  resolved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Resolved / Won' },
  closed: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', label: 'Closed' },
};

export const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [stats, setStats] = useState({ total: 0, unread: 0, new: 0, contacted: 0, in_progress: 0, resolved: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [modalStatus, setModalStatus] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [copiedKey, setCopiedKey] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');

  const loadInquiries = async () => {
    setLoading(true);
    setActionError('');
    try {
      const q = new URLSearchParams();
      if (statusFilter && statusFilter !== 'all') q.set('status', statusFilter);
      if (search.trim()) q.set('search', search.trim());
      q.set('limit', '200');

      const res = await API.get(`/contact/admin/inquiries?${q.toString()}`);
      if (res.data?.success) {
        setInquiries(res.data.inquiries || []);
        if (res.data.stats) setStats(res.data.stats);
      }
    } catch (err) {
      console.error('ERROR LOADING INQUIRIES:', err);
      setActionError(err.response?.data?.message || 'Failed to load contact inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, [statusFilter]);

  const handleOpenDetail = (inquiry) => {
    setSelectedInquiry(inquiry);
    setAdminNotes(inquiry.admin_notes || '');
    setModalStatus(inquiry.status || 'new');
    if (!inquiry.is_read) {
      markRead(inquiry.id, true);
    }
  };

  const markRead = async (id, isRead) => {
    try {
      await API.put(`/contact/admin/inquiries/${id}/read`, { is_read: isRead ? 1 : 0 });
      setInquiries((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_read: isRead ? 1 : 0 } : item
        )
      );
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry((prev) => ({ ...prev, is_read: isRead ? 1 : 0 }));
      }
      setStats((prev) => ({
        ...prev,
        unread: isRead ? Math.max(0, prev.unread - 1) : prev.unread + 1,
      }));
    } catch (err) {
      console.error('ERROR MARKING READ:', err);
    }
  };

  const markAllRead = async () => {
    try {
      const res = await API.put('/contact/admin/inquiries/mark-all-read');
      if (res.data?.success) {
        setInquiries((prev) => prev.map((item) => ({ ...item, is_read: 1 })));
        setStats((prev) => ({ ...prev, unread: 0 }));
        setActionMessage('All inquiries marked as read.');
        setTimeout(() => setActionMessage(''), 4000);
      }
    } catch (err) {
      setActionError('Could not mark all inquiries as read.');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await API.put(`/contact/admin/inquiries/${id}/status`, { status: newStatus });
      if (res.data?.success) {
        const updated = res.data.inquiry;
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
        );
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry((prev) => ({ ...prev, ...updated }));
        }
        setActionMessage(`Status updated to ${newStatus}.`);
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleSaveModal = async () => {
    if (!selectedInquiry) return;
    setSavingNotes(true);
    try {
      const res = await API.put(`/contact/admin/inquiries/${selectedInquiry.id}/status`, {
        status: modalStatus,
        admin_notes: adminNotes,
      });
      if (res.data?.success) {
        const updated = res.data.inquiry;
        setInquiries((prev) =>
          prev.map((item) => (item.id === selectedInquiry.id ? { ...item, ...updated } : item))
        );
        setSelectedInquiry((prev) => ({ ...prev, ...updated }));
        setActionMessage('Inquiry changes and notes saved successfully.');
        setTimeout(() => setActionMessage(''), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save notes.');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact inquiry permanently?')) return;
    try {
      const res = await API.delete(`/contact/admin/inquiries/${id}`);
      if (res.data?.success) {
        setInquiries((prev) => prev.filter((item) => item.id !== id));
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry(null);
        }
        setActionMessage('Inquiry deleted.');
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete inquiry.');
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2500);
  };

  const formatCleanPhone = (phone = '') => {
    let clean = phone.replace(/[^0-9+]/g, '');
    if (clean.startsWith('01')) clean = '+88' + clean;
    if (clean.startsWith('8801')) clean = '+' + clean;
    return clean;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#12544F] text-sm font-black uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" /> Customer Inquiries & Leads
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">
            Contact Form Inquiries
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            View inquiries submitted from the website Contact page. Review customer requirements, contact prospects directly, update statuses, and log internal notes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={loadInquiries}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-bold flex items-center gap-2 text-slate-700 shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={markAllRead}
            disabled={stats.unread === 0}
            className="px-4 py-2.5 rounded-xl bg-[#12544F] hover:bg-[#092328] text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark all read {stats.unread > 0 && `(${stats.unread})`}
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
            className="text-sm font-bold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-sm font-bold uppercase tracking-wider">Total Inquiries</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#092328]">{stats.total}</div>
          <div className="text-sm text-slate-400">All submitted website leads</div>
        </div>

        <div className="p-5 rounded-3xl bg-amber-50/50 border border-amber-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-sm font-black uppercase tracking-wider">New / Unread</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-900">{stats.unread}</div>
          <div className="text-sm text-amber-700/80">Pending review & follow up</div>
        </div>

        <div className="p-5 rounded-3xl bg-blue-50/50 border border-blue-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-blue-800">
            <span className="text-sm font-black uppercase tracking-wider">In Progress / Contacted</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-blue-900">{stats.contacted + stats.in_progress}</div>
          <div className="text-sm text-blue-700/80">Account manager active discussions</div>
        </div>

        <div className="p-5 rounded-3xl bg-emerald-50/50 border border-emerald-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-sm font-black uppercase tracking-wider">Resolved / Won</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-900">{stats.resolved}</div>
          <div className="text-sm text-emerald-700/80">Successfully closed inquiries</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone, email, service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadInquiries()}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm font-medium focus:border-[#12544F] focus:outline-none"
          />
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { key: 'all', label: 'All Inquiries' },
            { key: 'new', label: 'New' },
            { key: 'contacted', label: 'Contacted' },
            { key: 'in_progress', label: 'In Progress' },
            { key: 'resolved', label: 'Resolved' },
            { key: 'closed', label: 'Closed' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === tab.key
                  ? 'bg-[#12544F] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-sm text-slate-400">Loading inquiries...</div>
        ) : inquiries.length === 0 ? (
          <div className="p-16 text-center text-sm text-slate-400 space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-600">No contact inquiries found</p>
            <p className="text-sm text-slate-400">
              {statusFilter !== 'all' ? 'Try clearing your filters.' : 'When users submit the contact form on your website, inquiries will appear here.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {inquiries.map((inquiry) => {
              const statusCfg = STATUS_COLORS[inquiry.status] || STATUS_COLORS.new;
              return (
                <div
                  key={inquiry.id}
                  className={`p-5 lg:p-6 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-5 ${
                    !inquiry.is_read ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-slate-50/70'
                  }`}
                >
                  {/* Left: Contact Info & Message */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-black text-base shadow-xs ${
                        !inquiry.is_read
                          ? 'bg-[#12544F] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {inquiry.name ? inquiry.name[0].toUpperCase() : 'U'}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-base text-[#092328]">
                          {inquiry.name}
                        </span>
                        {!inquiry.is_read && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
                            New
                          </span>
                        )}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                        >
                          {statusCfg.label}
                        </span>
                        {inquiry.subject && (
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                            {inquiry.subject}
                          </span>
                        )}
                      </div>

                      {/* Direct contact badges */}
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                        <a
                          href={`tel:${inquiry.phone}`}
                          className="flex items-center gap-1 font-bold text-[#12544F] hover:underline"
                          title="Click to call"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{inquiry.phone}</span>
                        </a>

                        <span className="text-slate-300">•</span>

                        <a
                          href={`mailto:${inquiry.email}`}
                          className="flex items-center gap-1 font-medium text-slate-600 hover:text-[#12544F] hover:underline"
                          title="Click to email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>{inquiry.email}</span>
                        </a>

                        <span className="text-slate-300">•</span>

                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(inquiry.created_at).toLocaleString()}</span>
                        </span>
                      </div>

                      {/* Message preview */}
                      <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed bg-white/70 p-3 rounded-xl border border-slate-200/60 mt-2 break-words break-all [overflow-wrap:anywhere]">
                        "{inquiry.message}"
                      </p>

                      {/* Admin follow up remarks banner */}
                      {inquiry.admin_notes && (
                        <div className="text-sm text-slate-600 bg-amber-50/60 border border-amber-200/60 p-2.5 rounded-xl flex items-start gap-2 break-words break-all [overflow-wrap:anywhere]">
                          <span className="font-bold text-amber-800 shrink-0">Admin Note:</span>
                          <span className="break-words break-all">{inquiry.admin_notes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-wrap items-center lg:flex-col lg:items-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="flex items-center gap-2">
                      <select
                        value={inquiry.status}
                        onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 shadow-xs cursor-pointer focus:outline-none focus:border-[#12544F]"
                      >
                        <option value="new">New Inquiry</option>
                        <option value="read">Reviewed / Read</option>
                        <option value="contacted">Contacted</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved / Won</option>
                        <option value="closed">Closed</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => markRead(inquiry.id, !inquiry.is_read)}
                        className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 cursor-pointer"
                        title={inquiry.is_read ? 'Mark as Unread' : 'Mark as Read'}
                      >
                        {inquiry.is_read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#2A835F]" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(inquiry)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#12544F] hover:bg-[#092328] text-white text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View & Contact</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(inquiry.id)}
                        className="p-1.5 rounded-xl border border-rose-100 text-rose-500 hover:bg-rose-50 cursor-pointer"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail & Quick Contact Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#092328] to-[#12544F] text-white flex items-center justify-between">
              <div className="space-y-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-black uppercase tracking-wider text-[#8BBB92]">
                    Inquiry #{selectedInquiry.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
                    {STATUS_COLORS[selectedInquiry.status]?.label || selectedInquiry.status}
                  </span>
                </div>
                <h3 className="text-xl font-black truncate">{selectedInquiry.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[calc(85vh-140px)] overflow-y-auto">
              {/* Quick Communication Toolbar */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-sm font-black uppercase tracking-wider text-slate-500">
                  Quick Direct Actions
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="p-3 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-emerald-800 flex flex-col items-center justify-center text-center gap-1 transition-all group"
                  >
                    <Phone className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-black">Call Phone</span>
                  </a>

                  <a
                    href={`https://wa.me/${formatCleanPhone(selectedInquiry.phone).replace('+', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-emerald-800 flex flex-col items-center justify-center text-center gap-1 transition-all group"
                  >
                    <MessageCircle className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-black">WhatsApp</span>
                  </a>

                  <a
                    href={`mailto:${selectedInquiry.email}?subject=Re: MyBDPhone Inquiry - ${encodeURIComponent(selectedInquiry.subject || '')}`}
                    className="p-3 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-blue-800 flex flex-col items-center justify-center text-center gap-1 transition-all group"
                  >
                    <Mail className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-black">Send Email</span>
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        `Name: ${selectedInquiry.name}\nPhone: ${selectedInquiry.phone}\nEmail: ${selectedInquiry.email}\nService: ${selectedInquiry.subject}\nMessage: ${selectedInquiry.message}`,
                        'all'
                      )
                    }
                    className="p-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer"
                  >
                    {copiedKey === 'all' ? (
                      <Check className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-slate-500" />
                    )}
                    <span className="text-sm font-black">
                      {copiedKey === 'all' ? 'Copied!' : 'Copy Info'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Contact Information Details */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 overflow-hidden">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">Phone Number</span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-slate-800 text-base break-all">{selectedInquiry.phone}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedInquiry.phone, 'phone')}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 shrink-0"
                      title="Copy phone"
                    >
                      {copiedKey === 'phone' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 overflow-hidden">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">Email Address</span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-slate-800 text-sm truncate" title={selectedInquiry.email}>{selectedInquiry.email}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedInquiry.email, 'email')}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 shrink-0"
                      title="Copy email"
                    >
                      {copiedKey === 'email' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 overflow-hidden">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">Service Interest</span>
                  <div className="font-bold text-slate-800 text-sm break-words">{selectedInquiry.subject || 'General Inquiry'}</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 overflow-hidden">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">Submission Date</span>
                  <div className="font-bold text-slate-800 text-sm">
                    {new Date(selectedInquiry.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Message Description */}
              <div className="space-y-2">
                <span className="text-sm font-black text-slate-700 uppercase tracking-wider block">
                  Customer Message Description
                </span>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap break-words break-all [overflow-wrap:anywhere] max-h-60 overflow-y-auto select-text">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Status and Follow-up Remarks */}
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <label className="text-sm font-black text-slate-700 uppercase tracking-wider">
                    Pipeline Inquiry Status
                  </label>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value)}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-800 focus:outline-none focus:border-[#12544F]"
                  >
                    <option value="new">New Inquiry</option>
                    <option value="read">Reviewed / Read</option>
                    <option value="contacted">Contacted Prospect</option>
                    <option value="in_progress">In Progress / Under Negotiation</option>
                    <option value="resolved">Resolved / Customer Won</option>
                    <option value="closed">Closed / Not Interested</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-black text-slate-700 uppercase tracking-wider">
                      Admin Internal Notes & Follow-up Remarks
                    </label>
                    {selectedInquiry.responder_name && (
                      <span className="text-[11px] text-slate-400">
                        Last handled by: {selectedInquiry.responder_name}
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="e.g. Called customer at 2:30 PM. Interested in 5 lines 096 PBX setup. Sent enterprise pricing proposal via email."
                    className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm font-medium focus:border-[#12544F] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleDelete(selectedInquiry.id)}
                className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-sm font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-sm font-bold text-slate-700 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveModal}
                  disabled={savingNotes}
                  className="px-5 py-2.5 rounded-xl bg-[#12544F] hover:bg-[#092328] text-white text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingNotes ? 'Saving...' : 'Save Changes & Notes'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminInquiries;
