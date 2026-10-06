import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { Search, Eye, RefreshCw, PackageCheck } from 'lucide-react';
import Pagination from '../../components/common/Pagination';

const money = (v) => `৳${Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
const paymentStage = (o) =>
  o.payment_status === 'paid' || ['active', 'completed'].includes(o.status)
    ? 'approved'
    : o.status === 'cancelled'
    ? 'cancelled'
    : o.status === 'processing'
    ? 'payment_submitted'
    : 'pending_payment';

const stageLabel = (s) =>
  ({
    pending_payment: 'Pending Payment',
    payment_submitted: 'Payment Submitted',
    approved: 'Approved',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
  })[s] || s;

const snapshot = (o) => {
  try {
    return typeof o.details === 'string' ? JSON.parse(o.details || '{}') : o.details || {};
  } catch {
    return { raw: o.details || '' };
  }
};

const PAGE_SIZE = 15;

export const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (filter) q.set('status', filter);
      if (search) q.set('search', search);
      const r = await API.get(`/orders/admin/all?${q}`);
      if (r.data.success) {
        setOrders(r.data.orders || []);
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
  }, [filter]);

  const saveStatus = async (id, status) => {
    try {
      const mapped =
        status === 'approved'
          ? 'active'
          : status === 'cancelled'
          ? 'cancelled'
          : status === 'payment_submitted'
          ? 'processing'
          : 'pending';
      const r = await API.put(`/orders/admin/${id}/status`, { status: mapped });
      if (r.data.success) {
        setSelected(null);
        await load();
      }
    } catch (e) {
      alert(e.response?.data?.message || 'Could not update order');
    }
  };

  const paginatedOrders = orders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-7 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#12544F] text-sm font-black uppercase">
            <PackageCheck className="w-4 h-4" /> Commerce Control
          </div>
          <h1 className="text-3xl font-black text-[#092328] mt-1">Order Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage package purchases, payment state, activation and customer order history from one queue.
          </p>
        </div>
        <button
          onClick={load}
          className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            placeholder="Search by order #, customer, email..."
            className="w-full pl-9 p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#12544F]"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="p-3 rounded-xl border border-slate-200 font-bold text-sm bg-white focus:outline-none focus:border-[#12544F]"
        >
          <option value="">All Order Statuses</option>
          <option value="pending">Pending Payment</option>
          <option value="processing">Payment Submitted</option>
          <option value="active">Approved</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-4">Order #</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Package / Item</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Order Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    Loading order queue...
                  </td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((o) => {
                  const stage = paymentStage(o);
                  return (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-mono text-sm font-bold text-[#12544F]">
                        {o.order_number}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold">{o.user_name}</div>
                        <div className="text-sm text-slate-400">{o.user_email}</div>
                      </td>
                      <td className="px-5 py-4 font-semibold">{o.item_title}</td>
                      <td className="px-5 py-4 font-black text-[#12544F]">{money(o.amount)}</td>
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {new Date(o.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            stage === 'approved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : stage === 'payment_submitted'
                              ? 'bg-blue-50 text-blue-700'
                              : stage === 'cancelled'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {stageLabel(stage)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm uppercase font-bold">{o.payment_method}</td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelected(o)}
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!loading && orders.length > 0 && (
          <div className="p-4 border-t border-slate-100">
            <Pagination
              currentPage={currentPage}
              totalItems={orders.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full my-2 sm:my-4 p-5 sm:p-6 space-y-5 max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)] overflow-y-auto shadow-2xl">
            <div className="flex justify-between">
              <div>
                <h2 className="text-xl font-black">Order Management: {selected.order_number}</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Customer: {selected.user_name} · {selected.user_email}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-slate-50">
                <span className="text-sm text-slate-400">Package</span>
                <div className="font-bold">{selected.item_title}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50">
                <span className="text-sm text-slate-400">Amount</span>
                <div className="font-black text-blue-600">{money(selected.amount)}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50">
                <span className="text-sm text-slate-400">Payment</span>
                <div className="font-bold uppercase">{selected.payment_method}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50">
                <span className="text-sm text-slate-400">Payment Status</span>
                <div className="font-bold">{selected.payment_status}</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200">
              <div className="text-sm font-bold text-slate-500 mb-2">Package Snapshot</div>
              <pre className="bg-slate-950 text-slate-200 rounded-xl p-4 text-[11px] max-h-48 overflow-auto">
                {JSON.stringify(snapshot(selected), null, 2)}
              </pre>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border">
              <div className="text-sm font-black mb-2">Order status</div>
              <select
                value={paymentStage(selected)}
                onChange={(e) => saveStatus(selected.id, e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#12544F]"
              >
                <option value="pending_payment">Pending Payment</option>
                <option value="payment_submitted">Payment Submitted</option>
                <option value="approved">Approved</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-2">
                For manual/voucher payments, use Payment Verification to approve the payment; approval there also activates the package.
              </p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
