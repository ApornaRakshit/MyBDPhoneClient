import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { CreditCard, RefreshCw } from 'lucide-react';
import Pagination from '../../components/common/Pagination';

const PAGE_SIZE = 15;

export const UserPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const r = await API.get('/payment-methods/my');
      if (r.data.success) {
        setPayments(r.data.payments || []);
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
  }, []);

  const paginatedPayments = payments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-7 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[#092328]">My Payments</h1>
          <p className="text-sm text-slate-500 mt-1">
            All gateway, voucher and recharge payment records for your account.
          </p>
        </div>
        <button
          onClick={load}
          className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase text-slate-400">
              <tr>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Reference</th>
                <th className="px-5 py-4">Purpose</th>
                <th className="px-5 py-4">Method</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    Loading payments...
                  </td>
                </tr>
              ) : paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No payment records yet.
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {new Date(p.created_at).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 font-mono text-sm font-bold text-[#12544F]">
                      {p.gateway_transaction_id || p.gateway_unique_txn_id || p.recharge_transaction_id}
                    </td>
                    <td className="px-5 py-4">{p.item_title || 'Wallet Recharge'}</td>
                    <td className="px-5 py-4 text-sm uppercase font-bold">{p.payment_method}</td>
                    <td className="px-5 py-4 font-black">
                      ৳{Number(p.amount || 0).toLocaleString()}
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
    </div>
  );
};
