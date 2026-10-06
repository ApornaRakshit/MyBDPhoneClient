import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Receipt,
  LifeBuoy,
  Phone,
  Bot
} from 'lucide-react';

export const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const res = await API.get('/auth/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await API.put(`/auth/notifications/${id}/read`);
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, is_read: 1 } : n)));
    } catch (e) {}
  };

  const handleMarkAll = async () => {
    try {
      await API.put('/auth/notifications/all/read');
      setNotifications(notifications.map((n) => ({ ...n, is_read: 1 })));
    } catch (e) {}
  };

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">System Notifications</h1>
          <p className="text-sm sm:text-sm text-slate-500 mt-0.5">
            Real-time alerts for recharges, order activations, ticket replies, and balance updates.
          </p>
        </div>

        <button
          onClick={handleMarkAll}
          className="text-sm font-bold text-[#12544F] hover:underline"
        >
          Mark all as read
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-400">Loading alerts...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">No notifications available</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 flex items-start justify-between gap-4 transition-colors ${
                n.is_read ? 'bg-white opacity-80' : 'bg-[#12544F]/5'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#12544F]/10 text-[#12544F] flex items-center justify-center shrink-0 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-sm sm:text-sm text-[#092328]">{n.title}</div>
                  <p className="text-sm text-slate-600 leading-relaxed">{n.message}</p>
                  <div className="text-[10px] text-slate-400">{new Date(n.created_at).toLocaleString()}</div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {n.link && (
                  <Link
                    to={n.link}
                    className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-[#12544F] hover:text-white text-slate-700 text-[11px] font-bold"
                  >
                    View
                  </Link>
                )}
                {!n.is_read && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="p-1 text-slate-400 hover:text-slate-700"
                    title="Mark as read"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#2A835F]" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

