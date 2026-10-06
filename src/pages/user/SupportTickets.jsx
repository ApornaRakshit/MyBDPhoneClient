import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import {
  LifeBuoy,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  ChevronRight
} from 'lucide-react';

export const UserSupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [department, setDepartment] = useState('technical');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');

  const loadTickets = async () => {
    try {
      const res = await API.get('/tickets/my');
      if (res.data.success) {
        setTickets(res.data.tickets);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setError('');
    setCreating(true);

    try {
      await API.post('/tickets/create', {
        department,
        subject,
        message,
        priority,
      });
      setShowModal(false);
      setSubject('');
      setMessage('');
      loadTickets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">Support Ticketing Helpdesk</h1>
          <p className="text-sm sm:text-sm text-slate-500 mt-0.5">
            Submit issues and chat directly with our Dhaka telecommunications engineers.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#12544F] to-[#2A835F] text-white shadow-md hover:brightness-110 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Open New Ticket</span>
        </button>
      </div>

      {/* Tickets List Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Ticket ID</th>
                <th className="pb-3">Department</th>
                <th className="pb-3">Subject</th>
                <th className="pb-3">Priority</th>
                <th className="pb-3">Replies</th>
                <th className="pb-3">Last Updated</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">Loading support tickets...</td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">No support tickets created yet</td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50">
                    <td className="py-3 font-mono font-bold text-[#12544F]">{t.ticket_code}</td>
                    <td className="py-3 capitalize text-slate-600 font-semibold">{t.department.replace('_', ' ')}</td>
                    <td className="py-3 font-bold text-slate-800 max-w-xs truncate">{t.subject}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        t.priority === 'urgent' ? 'bg-rose-50 text-rose-700' :
                        t.priority === 'high' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600">{t.reply_count || 1} msg</td>
                    <td className="py-3 text-slate-500">{new Date(t.updated_at || t.created_at).toLocaleDateString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        t.status === 'open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        t.status === 'waiting_for_user' ? 'bg-blue-50 text-blue-700' :
                        t.status === 'resolved' ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {t.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/user/support/${t.id}`}
                        className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-[#12544F] hover:text-white text-slate-700 font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-[#2A835F]">New Inquiry</span>
              <h3 className="text-xl font-black text-[#092328] mt-0.5">Submit Support Ticket</h3>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
                  >
                    <option value="technical">Technical / SIP Support</option>
                    <option value="billing">Billing & Recharge</option>
                    <option value="telecom_pbx">IP Phone / PBX Numbers</option>
                    <option value="ai_calling">AI Calling & Campaigns</option>
                    <option value="general">General Inquiries</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Need assistance setting up Zoiper Android SIP"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Detailed Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your question or issue in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#12544F] to-[#2A835F] shadow-md"
                >
                  {creating ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

