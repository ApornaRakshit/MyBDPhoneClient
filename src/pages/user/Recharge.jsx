import { useEffect, useMemo, useState } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Wallet,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import Pagination from '../../components/common/Pagination';

const API_ORIGIN = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
).replace(/\/api\/?$/, '');

const DEFAULT_MIN_RECHARGE = 1;
const DEFAULT_MAX_RECHARGE = 10000;
const MONEYBAG_MIN_RECHARGE = 10;
const MONEYBAG_MAX_RECHARGE = 1000000;

const money = (value) =>
  Number(value || 0).toLocaleString('en-BD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

const getLogoUrl = (logoUrl) => {
  if (!logoUrl) return '';

  if (logoUrl.startsWith('/uploads/')) {
    return `${API_ORIGIN}${logoUrl}`;
  }

  return logoUrl;
};

const formatGatewayName = (method) => {
  if (method?.name) return method.name;

  const code = String(method?.code || '').toLowerCase();
  if (code === 'dgepay') return 'DGePay Online';
  if (code === 'moneybag') return 'Moneybag Online';

  return method?.provider || method?.code || 'Online Payment';
};

const formatGatewayDescription = (method) => {
  if (method?.instructions) return method.instructions;

  const code = String(method?.code || '').toLowerCase();
  if (code === 'dgepay') {
    return 'Secure hosted payment checkout';
  }
  if (code === 'moneybag') {
    return 'Secure hosted checkout with server-side verification';
  }

  return 'Secure online payment gateway';
};

const getGatewayMinimum = (methodCode, globalMinimum) => {
  return methodCode === 'moneybag'
    ? Math.max(Number(globalMinimum) || DEFAULT_MIN_RECHARGE, MONEYBAG_MIN_RECHARGE)
    : Number(globalMinimum) || DEFAULT_MIN_RECHARGE;
};

const getGatewayMaximum = (methodCode, globalMaximum) => {
  return methodCode === 'moneybag'
    ? Math.min(Number(globalMaximum) || DEFAULT_MAX_RECHARGE, MONEYBAG_MAX_RECHARGE)
    : Number(globalMaximum) || DEFAULT_MAX_RECHARGE;
};

export const UserRecharge = () => {
  const { user, refreshUser } = useAuth();

  const [amount, setAmount] = useState('500');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [senderPhone, setSenderPhone] = useState(user?.phone || '');
  const [recharges, setRecharges] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [globalMinRecharge, setGlobalMinRecharge] = useState(DEFAULT_MIN_RECHARGE);
  const [globalMaxRecharge, setGlobalMaxRecharge] = useState(DEFAULT_MAX_RECHARGE);
  const [loading, setLoading] = useState(false);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [historyPage, setHistoryPage] = useState(1);

  const loadHistory = async () => {
    try {
      const res = await API.get('/recharge/my-history');
      if (res.data?.success) {
        setRecharges(res.data.recharges || []);
        setHistoryPage(1);
      }
    } catch (err) {
      console.error('[Recharge] history load failed:', err);
    }
  };

  const loadPaymentMethods = async () => {
    setLoadingMethods(true);

    try {
      const res = await API.get('/payment-methods/public');

      if (!res.data?.success) {
        throw new Error(res.data?.message || 'Could not load payment methods');
      }

      const allMethods = Array.isArray(res.data?.methods)
        ? res.data.methods
        : [];

      // User recharge page should display only ACTIVE ONLINE GATEWAYS.
      // Manual/mobile banking methods such as bKash/Nagad/Voucher are intentionally
      // not shown here because this page starts a hosted gateway checkout.
      const gateways = allMethods.filter((method) => {
        const code = String(method?.code || '').trim().toLowerCase();
        const type = String(method?.method_type || '').trim().toLowerCase();
        const active = Number(method?.is_active ?? 1) === 1;

        return (
          active &&
          Boolean(code) &&
          (type === 'gateway' || code === 'dgepay' || code === 'moneybag')
        );
      });

      setPaymentMethods(gateways);

      // Prefer the currently selected gateway when still active;
      // otherwise prefer DGePay, then the first active gateway.
      setPaymentMethod((current) => {
        if (current && gateways.some((method) => method.code === current)) {
          return current;
        }

        const dgepay = gateways.find(
          (method) => String(method.code).toLowerCase() === 'dgepay'
        );

        return dgepay?.code || gateways[0]?.code || '';
      });

      // Public endpoint can optionally provide the site-level recharge limits.
      const minFromApi = Number(res.data?.min_recharge);
      const maxFromApi = Number(res.data?.max_recharge);

      if (Number.isFinite(minFromApi) && minFromApi >= 1) {
        setGlobalMinRecharge(minFromApi);
      }

      if (Number.isFinite(maxFromApi) && maxFromApi >= 1) {
        setGlobalMaxRecharge(maxFromApi);
      }
    } catch (err) {
      console.error('[Recharge] payment methods load failed:', err);
      setPaymentMethods([]);
      setPaymentMethod('');
      setError(
        err.response?.data?.message ||
          err.message ||
          'Payment gateways could not be loaded.'
      );
    } finally {
      setLoadingMethods(false);
    }
  };

  useEffect(() => {
    loadHistory();
    loadPaymentMethods();
  }, []);

  useEffect(() => {
    if (user?.phone) {
      setSenderPhone(user.phone);
    }
  }, [user?.phone]);

  const selectedMethod = useMemo(
    () =>
      paymentMethods.find(
        (method) => String(method.code).toLowerCase() === String(paymentMethod).toLowerCase()
      ) || null,
    [paymentMethods, paymentMethod]
  );

  const selectedMin = useMemo(
    () => getGatewayMinimum(paymentMethod, globalMinRecharge),
    [paymentMethod, globalMinRecharge]
  );

  const selectedMax = useMemo(
    () => getGatewayMaximum(paymentMethod, globalMaxRecharge),
    [paymentMethod, globalMaxRecharge]
  );

  const quickAmounts = useMemo(() => {
    const base = [100, 300, 500, 1000, 2500, 5000];

    return base.filter((value) => value >= selectedMin && value <= selectedMax);
  }, [selectedMin, selectedMax]);

  useEffect(() => {
    const currentAmount = Number(amount);

    if (!Number.isFinite(currentAmount)) return;

    if (currentAmount < selectedMin) {
      setAmount(String(selectedMin));
      return;
    }

    if (currentAmount > selectedMax) {
      setAmount(String(selectedMax));
    }
  }, [selectedMin, selectedMax]);

  const handleRecharge = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const numAmount = Number(amount);

    if (!Number.isFinite(numAmount) || numAmount <= 0) {
      setError('Please enter a valid recharge amount.');
      return;
    }

    if (numAmount < selectedMin || numAmount > selectedMax) {
      setError(
        `Recharge amount must be between ৳${money(selectedMin)} and ৳${money(selectedMax)} for ${formatGatewayName(selectedMethod)}.`
      );
      return;
    }

    if (!paymentMethod) {
      setError('Please select an active payment gateway.');
      return;
    }

    if (!selectedMethod) {
      setError('Selected payment gateway is no longer active. Please refresh the page.');
      return;
    }

    if (!senderPhone.trim()) {
      setError('Account phone number is required for payment.');
      return;
    }

    setLoading(true);

    try {
      const res = await API.post('/recharge/process', {
        amount: numAmount,
        payment_method: String(paymentMethod).toLowerCase(),
        sender_phone: senderPhone.trim(),
      });

      if (!res.data?.success) {
        throw new Error(res.data?.message || 'Recharge could not be initialized.');
      }

      const paymentUrl = res.data?.data?.payment_url;

      // The gateway page owns the actual payment. Browser redirect is only the
      // customer journey; wallet credit happens only after backend verification
      // and admin approval.
      if (paymentUrl) {
        window.location.assign(paymentUrl);
        return;
      }

      setMessage(
        res.data?.message ||
          `${formatGatewayName(selectedMethod)} payment initialized successfully.`
      );

      await refreshUser();
      await loadHistory();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to process recharge'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">
          Recharge Account Balance
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Top up your calling wallet securely through the available online payment gateways.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#092328] to-[#12544F] text-white flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5 text-[#8BBB92]" />
              </div>
              <div>
                <span className="text-[11px] text-slate-300 font-semibold uppercase">
                  Current Account Balance
                </span>
                <div className="text-2xl font-black text-white">
                  ৳{money(user?.balance)}
                </div>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#2A835F] text-white text-center whitespace-nowrap">
              Pending until payment verification
            </span>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleRecharge} className="space-y-5 text-sm">
            <div>
              <label className="text-slate-700 font-bold block mb-1">
                Enter Recharge Amount (৳{money(selectedMin)} – ৳{money(selectedMax)}) *
              </label>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-black text-slate-400">
                  ৳
                </span>
                <input
                  type="number"
                  min={selectedMin}
                  max={selectedMax}
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
                />
              </div>

              {quickAmounts.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {quickAmounts.map((q) => {
                    const stringValue = String(q);

                    return (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setAmount(stringValue)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-all ${
                          amount === stringValue
                            ? 'bg-[#12544F] text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        ৳{money(q)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-2">
                Payment Gateway *
              </label>

              {loadingMethods ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  Loading active payment gateways...
                </div>
              ) : paymentMethods.length === 0 ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                  No active online payment gateway is available right now.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {paymentMethods.map((method) => {
                    const code = String(method.code || '').toLowerCase();
                    const selected = code === String(paymentMethod || '').toLowerCase();
                    const logo = getLogoUrl(method.logo_url);

                    return (
                      <button
                        key={method.id || code}
                        type="button"
                        onClick={() => setPaymentMethod(code)}
                        className={`p-3 rounded-xl border text-left font-bold transition-all ${
                          selected
                            ? 'border-[#2A835F] ring-2 ring-[#2A835F]/20 bg-slate-50'
                            : 'border-slate-200 bg-white hover:border-[#2A835F]/60 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {logo ? (
                            <img
                              src={logo}
                              alt={formatGatewayName(method)}
                              className="w-9 h-8 object-contain rounded-md bg-white border border-slate-200 shrink-0"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}

                          <span
                            className={`w-9 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center shrink-0 ${
                              logo ? 'hidden' : ''
                            }`}
                          >
                            <CreditCard className="w-4 h-4 text-[#2A835F]" />
                          </span>

                          <div className="min-w-0">
                            <span className="text-sm text-[#12544F] block truncate">
                              {formatGatewayName(method)}
                            </span>
                            <span className="block text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-2">
                              {formatGatewayDescription(method)}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">
                Account Phone Number
              </label>
              <input
                type="text"
                placeholder="017XXXXXXXX"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={loading || loadingMethods || paymentMethods.length === 0}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#12544F] to-[#2A835F] hover:from-[#092328] hover:to-[#12544F] shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4 text-[#8BBB92]" />
              <span>
                {loading
                  ? 'Processing Transaction...'
                  : `Proceed to Recharge ৳${money(amount || 0)}`}
              </span>
            </button>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-[#092328] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2A835F]" />
              Recharge Policy & Guidelines
            </h3>

            <ul className="space-y-2.5 text-sm text-slate-600 leading-relaxed pl-4 list-disc">
              <li>
                Payment first becomes pending and is credited only after successful server-side verification and admin approval.
              </li>
              <li>
                Moneybag online checkout requires at least ৳10 per provider rules.
              </li>
              <li>
                Wallet balance is usable for IP Phone talk-time, monthly package subscriptions, and AI calling voice minutes.
              </li>
              <li>
                All payment history remains available in your recharge/financial history.
              </li>
            </ul>
          </div>

          {selectedMethod && (
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-sm font-black uppercase tracking-wide text-slate-400">
                Selected Gateway
              </div>
              <div className="text-base font-black text-[#092328]">
                {formatGatewayName(selectedMethod)}
              </div>
              <div className="text-sm text-slate-500">
                Allowed recharge: ৳{money(selectedMin)} – ৳{money(selectedMax)}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-[#092328]">Recharge History</h3>
            <p className="text-sm text-slate-400">
              All online top-up records and transaction IDs
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Transaction ID</th>
                <th className="pb-3">Gateway Method</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50 font-medium">
              {recharges.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    No recharge records found
                  </td>
                </tr>
              ) : (
                recharges
                  .slice((historyPage - 1) * 15, historyPage * 15)
                  .map((recharge) => {
                    const status = String(recharge.status || 'pending').toLowerCase();

                    const statusClass =
                      status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : status === 'failed' || status === 'refunded'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200';

                    return (
                      <tr key={recharge.id} className="hover:bg-slate-50/50">
                        <td className="py-3 font-mono font-bold text-slate-800">
                          {recharge.transaction_id}
                        </td>
                        <td className="py-3 uppercase font-bold text-[#12544F]">
                          {recharge.payment_method}
                        </td>
                        <td className="py-3 font-black text-[#12544F]">
                          ৳{money(recharge.amount)}
                        </td>
                        <td className="py-3 text-slate-500">
                          {recharge.created_at
                            ? new Date(recharge.created_at).toLocaleString()
                            : '—'}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${statusClass}`}
                          >
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>

        {recharges.length > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <Pagination
              currentPage={historyPage}
              totalItems={recharges.length}
              pageSize={15}
              onPageChange={setHistoryPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};
