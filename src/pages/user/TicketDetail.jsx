import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  LifeBuoy,
  Send,
  ArrowLeft,
  User,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const UserTicketDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadTicket = async () => {
    try {
      const res = await API.get(`/tickets/${id}`);
      if (res.data.success) {
        setTicket(res.data.ticket);
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
  }, [id]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSending(true);

    try {
      await API.post(`/tickets/${id}/reply`, { message: replyText });
      setReplyText('');
      loadTicket();
    } catch (err) {
      alert('Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-slate-400">Loading conversation thread...</div>;
  }

  if (!ticket) {
    return <div className="p-12 text-center text-sm text-rose-500">Ticket not found</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl pb-12 w-full min-w-0">
      
      {/* Back button & Header */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          to="/user/support"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-[#12544F]">#{ticket.ticket_code}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              ticket.status === 'open' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {ticket.status}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#092328] mt-0.5 break-words break-all">{ticket.subject}</h1>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-6 w-full min-w-0 overflow-hidden">
        <div className="space-y-4 w-full min-w-0">
          {messages.map((m) => {
            const isAdmin = m.sender_type === 'admin';
            return (
              <div
                key={m.id}
                className={`p-4 rounded-2xl w-full min-w-0 overflow-hidden transition-all ${
                  isAdmin
                    ? 'bg-[#12544F]/5 border border-[#12544F]/20 text-slate-800'
                    : 'bg-slate-50 border border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/40 text-sm gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isAdmin ? 'bg-[#12544F] text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isAdmin ? <Shield className="w-3 h-3 text-[#8BBB92]" /> : <User className="w-3 h-3" />}
                    </div>
                    <span className="font-bold truncate">{m.sender_name || (isAdmin ? 'Support Engineer' : user?.name)}</span>
                    {isAdmin && (
                      <span className="px-1.5 py-0.2 bg-[#2A835F] text-white text-[9px] font-bold rounded shrink-0">
                        SUPPORT STAFF
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{new Date(m.created_at).toLocaleString()}</span>
                </div>
                <div className="text-sm text-slate-700 leading-relaxed pt-2.5 whitespace-pre-wrap break-words break-all [overflow-wrap:anywhere] select-text">
                  {m.message}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Box */}
        <form onSubmit={handleSendReply} className="space-y-3 pt-4 border-t border-slate-100">
          <label className="text-sm font-bold text-slate-700 block">Write a Reply:</label>
          <textarea
            required
            rows={3}
            placeholder="Type your message to support staff..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={sending}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#12544F] to-[#2A835F] hover:from-[#092328] hover:to-[#12544F] shadow-sm flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sending ? 'Sending...' : 'Send Reply'}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

