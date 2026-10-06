import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  Receipt,
  Package,
  ShoppingBag,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import Pagination from '../../components/common/Pagination';

const PAGE_SIZE = 15;

export const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const loadOrders = () => {
    setLoading(true);
    API.get('/orders/my')
      .then((res) => {
        if (res.data?.success) {
          setOrders(res.data.orders || []);
          setCurrentPage(1);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const paginatedOrders = orders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">
            Order History
          </h1>
          <p className="text-sm sm:text-sm text-slate-500 mt-0.5">
            View all your previous package subscriptions, shop digital add-ons, and payment receipts.
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      {/* Orders Table */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Order #</th>
                <th className="pb-3">Service / Item</th>
                <th className="pb-3">Item Type</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Order Date</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    Loading orders...
                  </td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No orders placed yet
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((o) => (
                  <tr
                    key={`${o.history_source || 'order'}-${o.order_number || o.id}`}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 font-mono font-bold text-slate-800">{o.order_number}</td>
                    <td className="py-3 font-bold text-[#12544F]">{o.item_title}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {o.item_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 font-black text-slate-900">
                      ৳{parseFloat(o.amount).toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span className="capitalize text-[11px] text-slate-600 font-semibold">
                        {o.payment_method.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize inline-flex items-center gap-1 ${
                          o.status === 'completed' ||
                          o.status === 'active' ||
                          o.payment_status === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : o.status === 'cancelled' || o.status === 'failed'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : o.status === 'processing'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : o.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && orders.length > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <Pagination
              currentPage={currentPage}
              totalItems={orders.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};
