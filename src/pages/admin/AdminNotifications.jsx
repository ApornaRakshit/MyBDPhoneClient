import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle2, ExternalLink, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import Pagination from '../../components/common/Pagination';

const PAGE_SIZE = 15;

export const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const load = async () => {
    try {
      const res = await API.get('/admin/notifications?limit=500');
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(Number(res.data.unread_count || 0));
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('ADMIN NOTIFICATIONS LOAD ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    const target = notifications.find((n) => Number(n.id) === Number(id));
    if (!target || Number(target.is_read) === 1) return;

    try {
      const res = await API.put(`/admin/notifications/${id}/read`);
      if (res.data?.success) {
        setNotifications((items) =>
          items.map((n) =>
            Number(n.id) === Number(id)
              ? { ...n, is_read: 1, read_at: n.read_at || new Date().toISOString() }
              : n
          )
        );
        setUnreadCount((count) => Math.max(0, count - 1));
      }
    } catch (error) {
      setActionError(error.response?.data?.message || 'Could not mark this notification as read.');
    }
  };

  const markAll = async () => {
    if (unreadCount <= 0 || markingAll) return;

    setMarkingAll(true);
    setActionMessage('');
    setActionError('');

    try {
      let res;
      try {
        res = await API.post('/admin/notifications/mark-all-read');
      } catch {
        res = await API.put('/admin/notifications/all/read');
      }
      if (!res.data?.success) {
        throw new Error(res.data?.message || 'Could not mark all notifications as read.');
      }

      setNotifications((items) =>
        items.map((n) => ({
          ...n,
          is_read: 1,
          read_at: n.read_at || new Date().toISOString(),
        }))
      );
      setUnreadCount(0);
      setActionMessage(`${Number(res.data?.updated || 0)} unread notification(s) marked as read.`);
    } catch (error) {
      setActionError(
        error.response?.data?.message || error.message || 'Could not mark all notifications as read.'
      );
    } finally {
      setMarkingAll(false);
    }
  };

  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-7 pb-12 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#12544F] text-sm font-black uppercase tracking-wider">
            <Bell className="w-4 h-4" /> Control Room Alerts
          </div>
          <h1 className="text-3xl font-black text-[#092328] mt-1">Admin Notifications</h1>
          <p className="text-sm text-slate-500 mt-1">
            Orders, subscription purchases, payment verification, recharges and customer actions.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button
            type="button"
            onClick={markAll}
            disabled={unreadCount <= 0 || markingAll}
            className="px-4 py-2.5 rounded-xl bg-[#12544F] text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:bg-[#0e3f3b] transition-colors"
          >
            {markingAll ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            {markingAll
              ? 'Marking…'
              : `Mark all read${unreadCount > 0 ? ` (${unreadCount > 99 ? '99+' : unreadCount})` : ''}`}
          </button>
        </div>
      </div>

      {(actionMessage || actionError) && (
        <div
          className={`px-4 py-3 rounded-2xl text-sm font-semibold border ${
            actionError
              ? 'bg-rose-50 border-rose-200 text-rose-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}
        >
          {actionError || actionMessage}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-400">Loading admin alerts...</div>
        ) : paginatedNotifications.length === 0 ? (
          <div className="p-16 text-center text-sm text-slate-400">No admin notifications yet.</div>
        ) : (
          paginatedNotifications.map((n) => (
            <div
              key={n.id}
              role="button"
              tabIndex={0}
              onClick={() => markRead(n.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  markRead(n.id);
                }
              }}
              className={`p-5 flex items-start justify-between gap-4 cursor-pointer transition-colors ${
                n.is_read ? 'bg-white hover:bg-slate-50' : 'bg-amber-50/50 hover:bg-amber-50'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    n.is_read ? 'bg-slate-100 text-slate-500' : 'bg-[#12544F]/10 text-[#12544F]'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-sm text-[#092328]">{n.title}</h3>
                    {!n.is_read && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[9px] font-black uppercase">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                  <div className="text-[11px] text-slate-400 mt-2">
                    {new Date(n.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                {n.link && (
                  <Link
                    to={n.link}
                    onClick={(e) => {
                      e.stopPropagation();
                      markRead(n.id);
                    }}
                    className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-[#12544F] hover:text-white text-slate-700 text-[11px] font-bold inline-flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> View
                  </Link>
                )}
                {!n.is_read && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      markRead(n.id);
                    }}
                    className="p-2 rounded-lg hover:bg-emerald-50 transition-colors"
                    title="Mark as read"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#2A835F]" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        {!loading && notifications.length > 0 && (
          <div className="p-4 bg-slate-50/50">
            <Pagination
              currentPage={currentPage}
              totalItems={notifications.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};
