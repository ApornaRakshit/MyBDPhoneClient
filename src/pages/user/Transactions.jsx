import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  Receipt,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Search,
  Wallet
} from 'lucide-react';
import Pagination from '../../components/common/Pagination';

const PAGE_SIZE = 15;

export const UserTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/transactions/my${filterType ? `?type=${filterType}` : ''}`);
      if (res.data.success) {
        setTransactions(res.data.transactions || []);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [filterType]);

  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">
            Financial Ledger & Transactions
          </h1>
          <p className="text-sm sm:text-sm text-slate-500 mt-0.5">
            Complete transparent audit trail of recharges, package subscriptions, and talk-time deductions.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:border-[#12544F]"
          >
            <option value="">All Transactions</option>
            <option value="recharge">Recharges Only</option>
            <option value="package_purchase">Package Purchases</option>
            <option value="shop_order">Shop Orders</option>
            <option value="adjustment">Admin Adjustments</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Transaction Code</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Description</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Balance After</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    Loading transactions...
                  </td>
                </tr>
              ) : paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No transactions recorded
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 font-mono font-bold text-slate-800">{t.transaction_code}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          t.direction === 'credit'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {t.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-slate-700">{t.description}</td>
                    <td
                      className={`py-3 font-black ${
                        t.direction === 'credit' ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {t.direction === 'credit' ? '+' : '-'}৳{parseFloat(t.amount).toLocaleString()}
                    </td>
                    <td className="py-3 font-bold text-slate-600">
                      ৳{parseFloat(t.balance_after).toLocaleString()}
                    </td>
                    <td className="py-3 text-slate-500">{new Date(t.created_at).toLocaleString()}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && transactions.length > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <Pagination
              currentPage={currentPage}
              totalItems={transactions.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};
