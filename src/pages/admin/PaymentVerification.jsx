import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { Search, CheckCircle2, XCircle, Eye, RefreshCw, WalletCards } from 'lucide-react';
import Pagination from '../../components/common/Pagination';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
const money = (v) => `৳${Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
const PAGE_SIZE = 15;

export const AdminPaymentVerification = () => {
  const [payments, setPayments] = useState([]);
  const [status, setStatus] = useState('pending');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (status) q.set('status', status);
      if (search.trim()) q.set('search', search.trim());
      const res = await API.get(`/admin/payments?${q.toString()}`);
      if (res.data.success) {
        setPayments(res.data.payments || []);
        setCurrentPage(1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [status]);

  const verify = async (id, decision) => {
    try {
      const res = await API.put(`/admin/payments/${id}/verify`, { status: decision, note });
      if (res.data.success) {
        setSelected(null);
        setNote('');
        await load();
      }
    } catch (e) {
      alert(e.response?.data?.message || 'Payment verification failed');
    }
  };

  const paginatedPayments = payments.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-7 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#12544F] text-sm font-black uppercase tracking-wider">
            <WalletCards className="w-4 h-4" /> Finance Control
          </div>
          <h1 className="text-3xl font-black text-[#092328] mt-1">Payment Verification Desk</h1>
          <p className="text-sm text-slate-500 mt-1">
            Verify DGePay results and manually submitted voucher, bank and mobile-banking payments before service activation.
          </p>
        </div>
        <button
          onClick={load}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl bg-white border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            placeholder="Search TrxID, order, customer, email..."
            className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#12544F]"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-3 rounded-xl border border-slate-200 text-sm font-bold bg-white focus:outline-none focus:border-[#12544F]"
        >
          <option value="">All Payment Statuses</option>
          <option value="pending">Pending Verification</option>
          <option value="approved">Approved</option>
          <option value="failed">Failed / Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr className="text-[11px] uppercase tracking-wider text-slate-400">
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Order / Recharge</th>
                <th className="px-5 py-4">Method</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Gateway</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    Loading payment queue...
                  </td>
                </tr>
              ) : paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    No payments found.
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {new Date(p.created_at).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold">{p.user_name}</div>
                      <div className="text-sm text-slate-400">{p.user_email}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-mono text-sm font-bold text-[#12544F]">
                        {p.order_number || p.recharge_transaction_id || p.gateway_unique_txn_id}
                      </div>
                      <div className="text-sm text-slate-500">
                        {p.item_title || 'Wallet Recharge'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                        {p.payment_method}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-black text-[#12544F]">
                      {money(p.amount)}
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <div className="font-bold uppercase">{p.gateway || p.payment_method}</div>
                      <div className="text-[10px] text-slate-400">
                        {p.gateway_status || 'Awaiting verification'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          p.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : p.status === 'pending'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelected(p);
                          setNote(p.notes || '');
                        }}
                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && payments.length > 0 && (
          <div className="p-4 border-t border-slate-100">
            <Pagination
              currentPage={currentPage}
              totalItems={payments.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between">
              <div>
                <h2 className="text-xl font-black text-[#092328]">Verify Payment</h2>
                <p className="text-sm text-slate-500 mt-1">{selected.gateway_unique_txn_id}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-400 text-sm">Customer</span>
                <div className="font-bold">{selected.user_name}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-400 text-sm">Amount</span>
                <div className="font-black text-[#12544F]">{money(selected.amount)}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-400 text-sm">Order</span>
                <div className="font-mono font-bold">{selected.order_number || 'Wallet Recharge'}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-400 text-sm">Payer Phone</span>
                <div className="font-bold">{selected.payer_phone || selected.user_phone || '—'}</div>
              </div>
            </div>
            {selected.proof_url && (
              <a
                href={selected.proof_url?.startsWith('/') ? `${API_ORIGIN}${selected.proof_url}` : selected.proof_url}
                target="_blank"
                rel="noreferrer"
                className="block p-3 rounded-xl border border-blue-200 text-blue-700 text-sm font-bold"
              >
                Open payment proof / receipt
              </a>
            )}
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Admin verification note"
              rows="3"
              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#12544F]"
            />
            <div className="flex gap-3">
              <button
                onClick={() => verify(selected.id, 'failed')}
                className="flex-1 py-3 rounded-xl bg-rose-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-700 transition-colors"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
              <button
                onClick={() => verify(selected.id, 'approved')}
                className="flex-1 py-3 rounded-xl bg-[#12544F] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#0e3f3b] transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve & Activate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
