import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  Wallet,
  Receipt,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import Pagination from '../../components/common/Pagination';

const PAGE_SIZE = 15;

export const AdminRechargeManagement = () => {
  const [recharges, setRecharges] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [tab, setTab] = useState('recharges');
  const [loading, setLoading] = useState(true);
  const [rechargePage, setRechargePage] = useState(1);
  const [ledgerPage, setLedgerPage] = useState(1);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      API.get('/recharge/admin/all'),
      API.get('/transactions/admin/all'),
    ])
      .then(([rRes, tRes]) => {
        if (rRes.data?.success) setRecharges(rRes.data.recharges || []);
        if (tRes.data?.success) setTransactions(tRes.data.transactions || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const paginatedRecharges = recharges.slice(
    (rechargePage - 1) * PAGE_SIZE,
    rechargePage * PAGE_SIZE
  );

  const paginatedTransactions = transactions.slice(
    (ledgerPage - 1) * PAGE_SIZE,
    ledgerPage * PAGE_SIZE
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">
            Recharge Queue & Financial Ledger
          </h1>
          <p className="text-sm sm:text-sm text-slate-500 mt-0.5">
            Audit gateway recharge transactions across bKash, Nagad, Rocket, Moneybag, DGePay and cards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-slate-600" />
          </button>

          <div className="inline-flex p-1 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <button
              onClick={() => setTab('recharges')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                tab === 'recharges'
                  ? 'bg-[#12544F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#092328]'
              }`}
            >
              Recharges ({recharges.length})
            </button>
            <button
              onClick={() => setTab('ledger')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                tab === 'ledger'
                  ? 'bg-[#12544F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#092328]'
              }`}
            >
              Full Ledger ({transactions.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="overflow-x-auto">
          {tab === 'recharges' ? (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-sm">
                  <th className="pb-3">Transaction ID</th>
                  <th className="pb-3">Customer User</th>
                  <th className="pb-3">Gateway</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      Loading recharge queue...
                    </td>
                  </tr>
                ) : paginatedRecharges.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      No recharge records found.
                    </td>
                  </tr>
                ) : (
                  paginatedRecharges.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 font-mono font-bold text-[#12544F] text-sm">
                        {r.transaction_id}
                      </td>
                      <td className="py-3.5">
                        <div className="font-bold text-[#092328]">{r.user_name}</div>
                        <div className="text-[11px] text-slate-400">{r.user_email}</div>
                      </td>
                      <td className="py-3.5 uppercase font-bold text-[#2A835F] text-sm">
                        {r.payment_method}
                      </td>
                      <td className="py-3.5 font-black text-emerald-600 text-sm">
                        ৳{parseFloat(r.amount).toLocaleString()}
                      </td>
                      <td className="py-3.5 text-slate-400 text-sm">
                        {new Date(r.created_at).toLocaleString()}
                      </td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-sm">
                  <th className="pb-3">Txn Code</th>
                  <th className="pb-3">User</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Balance After</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400">
                      Loading financial ledger...
                    </td>
                  </tr>
                ) : paginatedTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400">
                      No ledger records found.
                    </td>
                  </tr>
                ) : (
                  paginatedTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 font-mono font-bold text-[#12544F] text-sm">
                        {t.transaction_code}
                      </td>
                      <td className="py-3.5 font-bold text-[#092328]">{t.user_name}</td>
                      <td className="py-3.5 capitalize text-slate-600 text-sm">
                        {t.type.replace('_', ' ')}
                      </td>
                      <td className="py-3.5 text-slate-700 text-sm">{t.description}</td>
                      <td
                        className={`py-3.5 font-black ${
                          t.direction === 'credit' ? 'text-emerald-600' : 'text-slate-800'
                        }`}
                      >
                        {t.direction === 'credit' ? '+' : '-'}৳{parseFloat(t.amount).toLocaleString()}
                      </td>
                      <td className="py-3.5 font-bold text-slate-700 text-sm">
                        ৳{parseFloat(t.balance_after).toLocaleString()}
                      </td>
                      <td className="py-3.5 text-slate-400 text-sm">
                        {new Date(t.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {!loading && tab === 'recharges' && recharges.length > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <Pagination
              currentPage={rechargePage}
              totalItems={recharges.length}
              pageSize={PAGE_SIZE}
              onPageChange={setRechargePage}
            />
          </div>
        )}

        {!loading && tab === 'ledger' && transactions.length > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <Pagination
              currentPage={ledgerPage}
              totalItems={transactions.length}
              pageSize={PAGE_SIZE}
              onPageChange={setLedgerPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};
