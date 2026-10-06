import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Phone,
  Bot,
  CheckCircle2,
  ArrowRight,
  Wallet,
  CreditCard,
  X,
  AlertCircle
} from 'lucide-react';

export const Packages = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('wallet_balance');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [manualReference, setManualReference] = useState('');
  const [manualPhone, setManualPhone] = useState(user?.phone || '');
  const [manualProof, setManualProof] = useState(null);
  const [manualNote, setManualNote] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const paymentLogoUrl = (url) =>
    url
      ? (
          url.startsWith('/uploads/')
            ? `${String(
                import.meta.env.VITE_API_URL ||
                  'https://api.mybdphone.com/api'
              ).replace(/\/api\/?$/, '')}${url}`
            : url
        )
      : '';

  useEffect(() => {
    API.get('/payment-methods/public')
      .then((res) => {
        if (res.data?.success) {
          setPaymentMethods(res.data.methods || []);
        }
      })
      .catch((err) => {
        console.error('[Packages] payment methods load failed:', err);
      });

    API.get('/packages')
      .then((res) => {
        if (res.data?.success) {
          setPackages(res.data.packages || []);
        }
      })
      .catch((err) => {
        console.error('[Packages] package load failed:', err);
      });
  }, []);

  useEffect(() => {
    if (user?.phone) {
      setManualPhone(user.phone);
    }
  }, [user?.phone]);

  const handleSelectPackage = (pkg) => {
    if (!user) {
      navigate('/login?redirect=/packages');
      return;
    }

    setSelectedPkg(pkg);
    setMessage(null);
    setError(null);

    setManualReference('');
    setManualProof(null);
    setManualNote('');

    setPaymentMethod((current) => current || 'wallet_balance');
  };

  const isManualPaymentMethod = (method) => {
    if (!method) return false;

    return ![
      'wallet_balance',
      'dgepay',
      'moneybag',
    ].includes(String(method).toLowerCase());
  };

  const isOnlineGateway = (method) => {
    const code = String(method || '').toLowerCase();

    return (
      code === 'dgepay' ||
      code === 'moneybag'
    );
  };

  const handleConfirmPurchase = async () => {
    if (!selectedPkg) return;

    const selectedMethod = String(paymentMethod || '').toLowerCase();

    const isWallet = selectedMethod === 'wallet_balance';
    const isOnline = isOnlineGateway(selectedMethod);
    const isManual = !isWallet && !isOnline;

    // Only manual / voucher payment requires transaction reference.
    if (isManual && !manualReference.trim()) {
      setError(
        'Coupon Code is required for manual payment.'
      );
      return;
    }

    setSubscribing(true);
    setMessage(null);
    setError(null);

    try {
      let res;

      // -----------------------------------------
      // MANUAL / VOUCHER PAYMENT
      // -----------------------------------------
      if (isManual) {
        const form = new FormData();

        form.append('item_id', selectedPkg.id);
        form.append('payment_method', selectedMethod);
        form.append(
          'payment_reference',
          manualReference.trim()
        );
        form.append(
          'payer_phone',
          manualPhone.trim()
        );
        form.append(
          'customer_note',
          manualNote.trim()
        );

        if (manualProof) {
          form.append('proof', manualProof);
        }

        res = await API.post('/orders/manual', form);
      }

      // -----------------------------------------
      // WALLET / DGEPAY / MONEYBAG
      // -----------------------------------------
      else {
        res = await API.post('/orders/checkout', {
          item_type: 'package',
          item_id: selectedPkg.id,
          payment_method: selectedMethod,
        });
      }

      if (!res.data?.success) {
        throw new Error(
          res.data?.message ||
            'Failed to process package purchase'
        );
      }

      // -----------------------------------------
      // HOSTED GATEWAY
      // Moneybag and DGePay both redirect here.
      // -----------------------------------------
      const paymentUrl =
        res.data?.data?.payment_url;

      if (paymentUrl) {
        window.location.assign(paymentUrl);
        return;
      }

      // -----------------------------------------
      // WALLET SUCCESS / MANUAL SUBMISSION
      // -----------------------------------------
      setMessage(
        res.data?.message ||
          (
            isManual
              ? 'Payment submitted successfully.'
              : 'Package purchase completed successfully.'
          )
      );

      await refreshUser();

      const nextPath =
        isManual
          ? '/user/orders'
          : selectedPkg.service_type === 'ip_phone'
            ? '/user/ip-phone'
            : '/user/subscriptions';

      setTimeout(() => {
        setSelectedPkg(null);
        navigate(nextPath);
      }, 1500);
    } catch (err) {
      console.error(
        '[Packages] purchase failed:',
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to complete package purchase'
      );
    } finally {
      setSubscribing(false);
    }
  };

  const filtered = packages.filter((pkg) => {
    if (filter === 'all') return true;
    return pkg.service_type === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

      {/* HEADER */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">

        <span className="text-sm font-bold uppercase tracking-wider text-[#2A835F] bg-[#2A835F]/10 px-3.5 py-1 rounded-full">
          Official Bangladeshi Service Catalog
        </span>

        <h1 className="text-3xl sm:text-5xl font-black text-[#092328]">
          Transparent IP Phone & AI Voice Packages
        </h1>

        <p className="text-slate-600 text-sm sm:text-base">
          All packages include verified 096 routing, flexible
          devices, and 100% database-driven pricing with zero
          hidden fees.
        </p>

        {/* FILTER BUTTONS */}
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200 mt-4">

          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              filter === 'all'
                ? 'bg-white text-[#092328] shadow-xs'
                : 'text-slate-600 hover:text-[#092328]'
            }`}
          >
            All Packages ({packages.length})
          </button>

          <button
            onClick={() => setFilter('ip_phone')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
              filter === 'ip_phone'
                ? 'bg-[#12544F] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#092328]'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>IP Phone</span>
          </button>

          <button
            onClick={() => setFilter('ai_calling')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
              filter === 'ai_calling'
                ? 'bg-[#2A835F] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#092328]'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Calling</span>
          </button>

        </div>
      </div>

      {/* PACKAGES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {filtered.map((pkg) => {
          const isRecommended = pkg.is_recommended;
          const isAi = pkg.service_type === 'ai_calling';

          return (
            <div
              key={pkg.id}
              className={`rounded-3xl p-8 flex flex-col justify-between relative transition-all duration-300 ${
                isRecommended
                  ? 'bg-gradient-to-b from-[#092328] to-[#12544F] text-white shadow-2xl ring-2 ring-[#2A835F] scale-102'
                  : 'bg-white text-slate-800 border border-slate-200 hover:border-[#2A835F] shadow-sm hover:shadow-xl'
              }`}
            >

              {pkg.badge_text && (
                <div className="absolute -top-3.5 right-6">
                  <span className="px-3 py-1 rounded-full text-sm font-black bg-[#2A835F] text-white shadow-sm">
                    {pkg.badge_text}
                  </span>
                </div>
              )}

              <div className="space-y-4">

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                      isAi
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-[#8BBB92]/20 text-[#8BBB92]'
                    }`}
                  >
                    {isAi
                      ? 'AI Calling'
                      : 'IP Telephony'}
                  </span>
                </div>

                <div>
                  <h3
                    className={`text-2xl font-black ${
                      isRecommended
                        ? 'text-white'
                        : 'text-[#092328]'
                    }`}
                  >
                    {pkg.name}
                  </h3>

                  <p
                    className={`text-sm mt-1 leading-relaxed ${
                      isRecommended
                        ? 'text-slate-300'
                        : 'text-slate-500'
                    }`}
                  >
                    {pkg.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1 py-1">

                  <span className="text-4xl font-black text-[#8BBB92]">
                    ৳
                    {parseFloat(pkg.price).toLocaleString()}
                  </span>

                  <span
                    className={`text-sm font-semibold ${
                      isRecommended
                        ? 'text-slate-300'
                        : 'text-slate-500'
                    }`}
                  >
                    /{pkg.billing_period}
                  </span>

                </div>

                <div
                  className={`border-t pt-4 space-y-2.5 ${
                    isRecommended
                      ? 'border-white/15'
                      : 'border-slate-100'
                  }`}
                >
                  {Array.isArray(pkg.features) &&
                    pkg.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-sm font-medium"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#8BBB92] shrink-0 mt-0.5" />

                        <span
                          className={
                            isRecommended
                              ? 'text-slate-200'
                              : 'text-slate-700'
                          }
                        >
                          {feat}
                        </span>
                      </div>
                    ))}
                </div>

              </div>

              <div className="pt-8">

                <button
                  onClick={() =>
                    handleSelectPackage(pkg)
                  }
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
                    isRecommended
                      ? 'bg-gradient-to-r from-[#2A835F] to-[#8BBB92] text-[#092328] hover:brightness-110'
                      : 'bg-[#12544F] hover:bg-[#092328] text-white'
                  }`}
                >
                  <span>Subscribe Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>

            </div>
          );
        })}

      </div>

      {/* CHECKOUT MODAL */}
      {selectedPkg && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">

          <div className="bg-white rounded-3xl max-w-md w-full my-2 sm:my-4 p-5 sm:p-8 shadow-2xl border border-slate-200 space-y-5 relative max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)] overflow-y-auto overscroll-contain">

            {/* CLOSE */}
            <button
              onClick={() =>
                setSelectedPkg(null)
              }
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* TITLE */}
            <div>

              <span className="text-sm font-bold uppercase tracking-wider text-[#2A835F]">
                Checkout
              </span>

              <h3 className="text-2xl font-black text-[#092328] mt-0.5">
                Subscribe to {selectedPkg.name}
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Amount payable:{' '}
                <span className="font-extrabold text-[#12544F] text-base">
                  ৳
                  {parseFloat(
                    selectedPkg.price
                  ).toLocaleString()}
                </span>
              </p>

            </div>

            {/* BALANCE */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-sm font-semibold">

              <div className="flex items-center gap-2 text-slate-700">
                <Wallet className="w-4 h-4 text-[#2A835F]" />
                <span>Your Account Balance:</span>
              </div>

              <span className="font-black text-[#12544F]">
                ৳
                {parseFloat(
                  user?.balance || 0
                ).toLocaleString()}
              </span>

            </div>

            {/* PAYMENT METHODS */}
            <div className="space-y-2">

              <label className="text-sm font-bold text-slate-700">
                Select Payment Source:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

                {/* WALLET */}
                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod('wallet_balance')
                  }
                  className={`p-3 rounded-xl border text-left text-sm font-bold ${
                    paymentMethod === 'wallet_balance'
                      ? 'border-[#2A835F] bg-[#2A835F]/10 text-[#12544F]'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Wallet className="w-4 h-4 mb-1 text-[#2A835F]" />
                  <span>Wallet Balance</span>
                </button>

                {/* DGEPAY */}
                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod('dgepay')
                  }
                  className={`p-3 rounded-xl border text-left text-sm font-bold ${
                    paymentMethod === 'dgepay'
                      ? 'border-[#E2136E] bg-pink-50 text-[#E2136E]'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">

                    {paymentMethods.find(
                      (m) => m.code === 'dgepay'
                    )?.logo_url ? (
                      <img
                        src={paymentLogoUrl(
                          paymentMethods.find(
                            (m) =>
                              m.code === 'dgepay'
                          ).logo_url
                        )}
                        alt=""
                        className="w-8 h-7 object-contain rounded-md bg-white border border-slate-200"
                      />
                    ) : (
                      <span className="w-8 h-7 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-[#E2136E]" />
                      </span>
                    )}

                    <span>DGePay Online</span>

                  </div>
                </button>

                {/* MONEYBAG + OTHER METHODS */}
                {paymentMethods
                  .filter(
                    (m) =>
                      String(m.code).toLowerCase() !==
                      'dgepay'
                  )
                  .map((m) => {

                    const code = String(
                      m.code || ''
                    ).toLowerCase();

                    const isMoneybag =
                      code === 'moneybag';

                    const isGateway =
                      String(
                        m.method_type || ''
                      ).toLowerCase() ===
                        'gateway' ||
                      isMoneybag;

                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() =>
                          setPaymentMethod(
                            m.code
                          )
                        }
                        className={`p-3 rounded-xl border text-left text-sm font-bold ${
                          paymentMethod === m.code
                            ? 'border-[#2A835F] bg-[#2A835F]/10 text-[#12544F]'
                            : 'border-slate-200 text-slate-600'
                        }`}
                      >

                        <div className="flex items-center gap-2 mb-1">

                          {m.logo_url ? (
                            <img
                              src={paymentLogoUrl(
                                m.logo_url
                              )}
                              alt=""
                              className="w-8 h-7 object-contain rounded-md bg-white border border-slate-200"
                            />
                          ) : (
                            <span className="w-8 h-7 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center">
                              <CreditCard className="w-4 h-4" />
                            </span>
                          )}

                          <span>
                            {isMoneybag
                              ? 'Moneybag'
                              : m.name}
                          </span>

                        </div>

                        <div className="text-[10px] font-medium text-slate-400 mt-1">
                          {isGateway
                            ? isMoneybag
                              ? 'Secure hosted checkout'
                              : (m.provider ||
                                'Online payment')
                            : (
                                m.account_number ||
                                m.provider ||
                                'Manual verification'
                              )}
                        </div>

                      </button>
                    );
                  })}

              </div>
            </div>

            {/* MANUAL PAYMENT FORM ONLY */}
            {isManualPaymentMethod(
              paymentMethod
            ) && (
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">

                {paymentMethods.find(
                  (m) =>
                    m.code === paymentMethod
                )?.instructions && (
                  <div className="text-sm text-slate-600">
                    {
                      paymentMethods.find(
                        (m) =>
                          m.code === paymentMethod
                      ).instructions
                    }
                  </div>
                )}

                <input
                  value={manualReference}
                  onChange={(e) =>
                    setManualReference(
                      e.target.value
                    )
                  }
                  placeholder="Coupone Code *"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm"
                />

                <input
                  value={manualPhone}
                  onChange={(e) =>
                    setManualPhone(
                      e.target.value
                    )
                  }
                  placeholder="Payer phone number"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm"
                />

                <label className="block p-4 rounded-xl border-2 border-dashed border-slate-300 bg-white text-sm font-bold text-slate-600 cursor-pointer">

                  Payment Screenshot / Receipt
                  (optional)

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,application/pdf"
                    onChange={(e) =>
                      setManualProof(
                        e.target.files?.[0] ||
                          null
                      )
                    }
                    className="block mt-2 w-full text-sm"
                  />

                  <span className="text-[10px] text-slate-400 font-medium">
                    PNG, JPG, WEBP or PDF —
                    maximum 5MB
                  </span>

                </label>

                <textarea
                  value={manualNote}
                  onChange={(e) =>
                    setManualNote(
                      e.target.value
                    )
                  }
                  placeholder="Additional note"
                  rows="2"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm"
                />

                <p className="text-[11px] text-amber-700">
                  Manual/voucher payments remain
                  pending until an administrator
                  verifies the reference and proof.
                </p>

              </div>
            )}

            {/* MONEYBAG INFO */}
            {paymentMethod === 'moneybag' && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">

                <div className="flex items-start gap-2">

                  <CheckCircle2 className="w-4 h-4 text-[#2A835F] mt-0.5 shrink-0" />

                  <div>
                    <p className="text-sm font-bold text-[#12544F]">
                      Moneybag Online Checkout
                    </p>

                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      You will be redirected to
                      Moneybag's secure hosted payment
                      page. After payment, the transaction
                      will be verified by the server and
                      remain pending until administrator
                      approval.
                    </p>
                  </div>

                </div>

              </div>
            )}

            {/* ERROR */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">

                <AlertCircle className="w-4 h-4 shrink-0" />

                <span>{error}</span>

              </div>
            )}

            {/* MESSAGE */}
            {message && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">

                <CheckCircle2 className="w-4 h-4 shrink-0" />

                <span>{message}</span>

              </div>
            )}

            {/* ACTIONS */}
            <div className="pt-2 flex gap-3">

              <button
                type="button"
                onClick={() =>
                  setSelectedPkg(null)
                }
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmPurchase}
                disabled={subscribing}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#12544F] to-[#2A835F] hover:from-[#092328] hover:to-[#12544F] shadow-md"
              >
                {subscribing
                  ? 'Processing...'
                  : paymentMethod === 'moneybag'
                    ? 'Continue to Moneybag'
                    : paymentMethod === 'dgepay'
                      ? 'Continue to DGePay'
                      : paymentMethod === 'wallet_balance'
                        ? 'Confirm & Activate'
                        : 'Submit for Approval'}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};