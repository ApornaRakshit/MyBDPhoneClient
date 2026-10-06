import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  LifeBuoy,
  MessageSquare,
  Send,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AdminTicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [adminOptions, setAdminOptions] = useState([]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams(); if (statusFilter) q.set('status', statusFilter); if (departmentFilter) q.set('department', departmentFilter); if (priorityFilter) q.set('priority', priorityFilter); if (search.trim()) q.set('search', search.trim()); const res = await API.get(`/tickets/admin/all?${q.toString()}`);
      if (res.data.success) setTickets(res.data.tickets);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
    API.get('/admin/users?status=active').then(r=>{ if(r.data.success) setAdminOptions((r.data.users||[]).filter(u=>u.role==='admin')); }).catch(()=>{});
  }, [statusFilter, departmentFilter, priorityFilter]);

  const handleOpenTicket = async (t) => {
    setSelectedTicket(t);
    try {
      const res = await API.get(`/tickets/${t.id}`);
      if (res.data.success) setMessages(res.data.messages);
    } catch (e) {}
  };

  const handleSendAdminReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    setSending(true);

    try {
      await API.post(`/tickets/${selectedTicket.id}/reply`, { message: replyText });
      setReplyText('');
      const res = await API.get(`/tickets/${selectedTicket.id}`);
      if (res.data.success) setMessages(res.data.messages);
      loadTickets();
    } catch (err) {
      alert('Error sending reply');
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`/tickets/${id}/status`, { status });
      loadTickets();
      if (selectedTicket) setSelectedTicket({ ...selectedTicket, status });
    } catch (e) {
      alert('Error updating status');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">Helpdesk Ticketing Center</h1>
          <p className="text-sm sm:text-sm text-slate-500 mt-0.5">
            Resolve technical inquiries, SIP routing questions, and customer billing support tickets.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
        <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&loadTickets()} placeholder="Search ticket, customer, subject..." className="p-2.5 rounded-xl bg-white border border-slate-200 text-sm w-64" />
        <select value={departmentFilter} onChange={e=>setDepartmentFilter(e.target.value)} className="p-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold"><option value="">All Departments</option><option value="technical">Technical</option><option value="billing">Billing</option><option value="telecom_pbx">Telecom PBX</option><option value="ai_calling">AI Calling</option><option value="general">General</option></select>
        <select value={priorityFilter} onChange={e=>setPriorityFilter(e.target.value)} className="p-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold"><option value="">All Priorities</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700 focus:outline-hidden shadow-2xs"
        >
          <option value="">All Tickets</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="waiting_for_user">Waiting for User</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select></div>
      </div>

      {/* Tickets Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-sm">
                <th className="pb-3">Ticket Code</th>
                <th className="pb-3">Customer User</th>
                <th className="pb-3">Department</th>
                <th className="pb-3">Subject</th>
                <th className="pb-3">Priority</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">Loading tickets...</td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">No support tickets found</td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#12544F] text-sm">#{t.ticket_code}</td>
                    <td className="py-3.5">
                      <div className="font-bold text-[#092328]">{t.user_name}</div>
                      <div className="text-[11px] text-slate-400">{t.user_email}</div><div className="text-[10px] text-[#2A835F] font-bold">{t.assigned_admin_name ? `Assigned: ${t.assigned_admin_name}` : "Unassigned"}</div>
                    </td>
                    <td className="py-3.5 capitalize text-slate-700 text-sm">{t.department.replace('_', ' ')}</td>
                    <td className="py-3.5 font-bold text-slate-800 max-w-xs truncate text-sm">{t.subject}</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                        t.priority === 'urgent' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        t.status === 'open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {t.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleOpenTicket(t)}
                        className="px-3 py-1.5 rounded-lg bg-[#12544F] hover:bg-[#092328] text-white text-sm font-bold transition-colors cursor-pointer shadow-2xs"
                      >
                        Open Thread
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Reply Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-800 space-y-4 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-sm font-mono font-bold text-[#12544F]">#{selectedTicket.ticket_code}</span>
                <h3 className="text-lg font-black text-[#092328]">{selectedTicket.subject}</h3>
                <p className="text-sm text-slate-500">User: {selectedTicket.user_name} ({selectedTicket.user_email})</p>
              </div>

              <div className="flex flex-wrap gap-2 justify-end">
              <select
                value={selectedTicket.department}
                onChange={(e) => API.put(`/tickets/${selectedTicket.id}/status`, { department: e.target.value }).then(()=>{setSelectedTicket({...selectedTicket, department:e.target.value});loadTickets();}).catch(()=>alert('Department update failed'))}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700"
              >
                <option value="technical">Technical</option><option value="billing">Billing</option><option value="telecom_pbx">Telecom PBX</option><option value="ai_calling">AI Calling</option><option value="general">General</option>
              </select>
              <select
                value={selectedTicket.priority}
                onChange={(e) => API.put(`/tickets/${selectedTicket.id}/status`, { priority: e.target.value }).then(()=>{setSelectedTicket({...selectedTicket, priority:e.target.value});loadTickets();}).catch(()=>alert('Priority update failed'))}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700"
              >
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
              </select>
              <select
                value={selectedTicket.assigned_admin_id || ''}
                onChange={(e) => API.put(`/tickets/${selectedTicket.id}/status`, { assigned_admin_id: e.target.value || null }).then(()=>{setSelectedTicket({...selectedTicket, assigned_admin_id:e.target.value ? Number(e.target.value) : null});loadTickets();}).catch(()=>alert('Assignment update failed'))}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700"
              >
                <option value="">Unassigned</option>
                {adminOptions.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <select
                value={selectedTicket.status}
                onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value)}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="waiting_for_user">Waiting for User</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              </div>
            </div>

            {/* Conversation list */}
            <div className="space-y-3 max-h-64 overflow-y-auto p-2 w-full min-w-0">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-2xl text-sm w-full min-w-0 overflow-hidden ${
                    m.sender_type === 'admin'
                      ? 'bg-[#12544F]/5 border border-[#12544F]/20'
                      : 'bg-slate-50 border border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1 text-[10px] text-slate-500 gap-2">
                    <span className="font-bold text-[#092328] truncate">{m.sender_name} ({m.sender_type.toUpperCase()})</span>
                    <span className="shrink-0">{new Date(m.created_at).toLocaleString()}</span>
                  </div>
                  <div className="text-slate-700 leading-relaxed pt-1 whitespace-pre-wrap text-sm break-words break-all [overflow-wrap:anywhere] select-text">
                    {m.message}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="text-sm font-black text-amber-800">Internal note</div>
              <textarea rows={2} value={internalNote} onChange={e=>setInternalNote(e.target.value)} placeholder="Visible to support staff only..." className="w-full p-2.5 rounded-xl bg-white border border-amber-200 text-sm" />
              <button type="button" onClick={async()=>{if(!internalNote.trim())return;try{await API.put(`/tickets/${selectedTicket.id}/status`,{internal_notes:internalNote.trim()});setInternalNote('');const r=await API.get(`/tickets/${selectedTicket.id}`);if(r.data.success){setSelectedTicket(r.data.ticket);setMessages(r.data.messages)};loadTickets();}catch(e){alert(e.response?.data?.message||'Could not save note')}}} className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-sm font-bold">Save Internal Note</button>
            </div>

            {/* Reply form */}
            <form onSubmit={handleSendAdminReply} className="space-y-3 pt-2 border-t border-slate-100">
              <textarea
                required
                rows={3}
                placeholder="Write official technical response..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden focus:border-[#12544F]"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={sending}
                  className="px-5 py-2 rounded-xl font-bold text-sm bg-[#12544F] text-white hover:bg-[#092328] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sending ? 'Sending...' : 'Reply to Customer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

