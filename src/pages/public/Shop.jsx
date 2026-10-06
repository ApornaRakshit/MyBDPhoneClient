import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  ShoppingBag,
  Sparkles,
  Radio,
  FileAudio,
  Smartphone,
  CheckCircle2,
  Wallet,
  CreditCard,
  X,
  AlertCircle,
  Building2,
  Ticket,
  Send,
  Info,
} from 'lucide-react';

export const Shop = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [activePaymentMethods, setActivePaymentMethods] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('wallet_balance');
  const [paymentReference, setPaymentReference] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [buying, setBuying] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get('/shop/products')
      .then((res) => {
        if (res.data.success) setProducts(res.data.products || []);
      })
      .catch((err) => console.error(err));

    API.get('/payment-methods/public')
      .then((res) => {
        if (res.data.success) setActivePaymentMethods(res.data.methods || []);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleBuy = (prod) => {
    if (!user) {
      navigate('/login?redirect=/shop');
      return;
    }
    setSelectedProduct(prod);
    setPaymentReference('');
    setCustomerNote('');
    setMessage(null);
    setError(null);

    // Set initial payment method based on product restrictions
    if (prod.payment_methods && Array.isArray(prod.payment_methods) && prod.payment_methods.length > 0) {
      if (prod.payment_methods.includes('wallet_balance')) {
        setPaymentMethod('wallet_balance');
      } else {
        setPaymentMethod(prod.payment_methods[0]);
      }
    } else {
      setPaymentMethod('wallet_balance');
    }
  };

  // Filter available payment methods based on product restrictions
  const availableMethodsForSelected = useMemo(() => {
    if (!selectedProduct) return [];
    const allowed = selectedProduct.payment_methods;
    if (!allowed || !Array.isArray(allowed) || allowed.length === 0) {
      return activePaymentMethods;
    }
    return activePaymentMethods.filter((m) => allowed.includes(m.code));
  }, [selectedProduct, activePaymentMethods]);

  const allowWallet = useMemo(() => {
    if (!selectedProduct) return true;
    const allowed = selectedProduct.payment_methods;
    if (!allowed || !Array.isArray(allowed) || allowed.length === 0) return true;
    return allowed.includes('wallet_balance');
  }, [selectedProduct]);

  const selectedMethodObj = useMemo(() => {
    if (paymentMethod === 'wallet_balance') return null;
    return activePaymentMethods.find((m) => m.code === paymentMethod);
  }, [paymentMethod, activePaymentMethods]);

  const isManualMethod = selectedMethodObj && selectedMethodObj.method_type !== 'gateway' && !['dgepay', 'moneybag'].includes(selectedMethodObj.code);

  const handleConfirmOrder = async () => {
    if (!selectedProduct) return;

    if (isManualMethod && !paymentReference.trim()) {
      setError('Please enter your Transaction ID / Voucher Code / Payment Reference.');
      return;
    }

    setBuying(true);
    setMessage(null);
    setError(null);

    try {
      const res = await API.post('/orders/checkout', {
        item_type: 'shop_product',
        item_id: selectedProduct.id,
        payment_method: paymentMethod,
        payment_reference: paymentReference.trim() || undefined,
        customer_note: customerNote.trim() || undefined,
      });

      if (res.data.success) {
        const paymentUrl = res.data?.data?.payment_url;
        if (paymentUrl) {
          window.location.assign(paymentUrl);
          return;
        }

        setMessage(res.data.message);
        await refreshUser();
        setTimeout(() => {
          setSelectedProduct(null);
          navigate('/user/orders');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete product purchase');
    } finally {
      setBuying(false);
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'caller_tune': return Radio;
      case 'recording': return FileAudio;
      case 'device_addon': return Smartphone;
      default: return Sparkles;
    }
  };

  const getMethodIcon = (code, type) => {
    if (code === 'wallet_balance') return Wallet;
    if (type === 'bank') return Building2;
    if (type === 'voucher') return Ticket;
    if (type === 'mobile_banking') return Smartphone;
    return CreditCard;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-sm font-bold uppercase tracking-wider text-[#12544F] bg-[#12544F]/10 px-3.5 py-1 rounded-full">
          Digital Services Marketplace
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#092328]">
          Add-ons, Features & Telecom Upgrades
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Power up your 096 number with specialized telecom extensions, custom caller tunes, cloud recording archives, and VIP numbers.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((prod) => {
          const Icon = getCategoryIcon(prod.category);
          return (
            <div
              key={prod.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-[#2A835F] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
            >
              {prod.badge && (
                <div className="absolute -top-3 right-6">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#2A835F] text-white">
                    {prod.badge}
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#12544F]/10 text-[#12544F] group-hover:bg-[#2A835F] group-hover:text-white transition-colors flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#092328]">{prod.name}</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{prod.description}</p>
                </div>

                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-2xl font-black text-[#12544F]">
                    ৳{parseFloat(prod.price).toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-slate-500">
                    {prod.billing_type === 'ONE_TIME' ? '(One-Time)' : prod.billing_type === 'YEARLY' ? '/ year' : '/ month'}
                  </span>
                </div>

                {/* Features */}
                <div className="border-t border-slate-100 pt-3 space-y-2">
                  {Array.isArray(prod.features) &&
                    prod.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2A835F] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleBuy(prod)}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-[#12544F] hover:bg-[#092328] text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Purchase Service</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Purchase Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-[#2A835F]">Shop Checkout</span>
              <h3 className="text-2xl font-black text-[#092328] mt-0.5">{selectedProduct.name}</h3>
              <p className="text-sm text-slate-500 mt-1">
                Price: <span className="font-black text-[#12544F] text-base">৳{parseFloat(selectedProduct.price).toLocaleString()}</span>{' '}
                <span className="text-sm font-bold text-slate-500">
                  {selectedProduct.billing_type === 'ONE_TIME' ? '(One-Time)' : selectedProduct.billing_type === 'YEARLY' ? '/ year' : '/ month'}
                </span>
              </p>
            </div>

            {/* Account Balance Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-sm font-semibold">
              <div className="flex items-center gap-2 text-slate-700">
                <Wallet className="w-4 h-4 text-[#2A835F]" />
                <span>Account Wallet Balance:</span>
              </div>
              <span className="font-black text-[#12544F]">৳{parseFloat(user?.balance || 0).toLocaleString()}</span>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2.5">
              <label className="text-sm font-bold uppercase tracking-wider text-slate-700 block">Select Payment Method:</label>
              <div className="grid grid-cols-2 gap-2.5">
                {allowWallet && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet_balance')}
                    className={`p-3 rounded-2xl border text-left text-sm font-bold transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'wallet_balance'
                        ? 'border-[#2A835F] bg-[#2A835F]/10 text-[#12544F] shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Wallet className="w-4 h-4 mb-2 text-[#2A835F]" />
                    <span className="font-extrabold">Wallet Balance</span>
                    <span className="text-[10px] text-slate-500 font-normal">Instant activation</span>
                  </button>
                )}

                {availableMethodsForSelected.map((m) => {
                  const Icon = getMethodIcon(m.code, m.method_type);
                  const isSelected = paymentMethod === m.code;
                  return (
                    <button
                      key={m.code}
                      type="button"
                      onClick={() => setPaymentMethod(m.code)}
                      className={`p-3 rounded-2xl border text-left text-sm font-bold transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#12544F] bg-[#12544F]/10 text-[#12544F] shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="w-4 h-4 text-[#12544F]" />
                        {m.method_type === 'gateway' ? (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">Online</span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold uppercase">Manual</span>
                        )}
                      </div>
                      <span className="font-extrabold truncate">{m.name}</span>
                      <span className="text-[10px] text-slate-500 font-normal truncate">{m.provider || m.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Manual Payment Instructions & Inputs */}
            {isManualMethod && selectedMethodObj && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3 animate-in fade-in">
                <div className="flex items-start gap-2 text-sm text-amber-900 font-medium">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">{selectedMethodObj.name} Payment Instructions:</div>
                    {selectedMethodObj.account_number && (
                      <div className="mt-1 font-mono font-black text-amber-950 bg-amber-100 px-2 py-1 rounded inline-block">
                        Account / Number: {selectedMethodObj.account_number}
                      </div>
                    )}
                    <p className="mt-1 text-slate-600 text-sm leading-relaxed">
                      {selectedMethodObj.instructions || 'Please complete the payment and enter your transaction ID or reference below for admin approval.'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-800 block mb-1">
                    Transaction ID / Reference Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 8N2K9X0P / REF-12345"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-amber-200 text-sm font-bold text-[#092328] focus:outline-none focus:border-[#12544F]"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-800 block mb-1">
                    Optional Note / Sender Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sent from 017XXXXXXXX"
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-amber-200 text-sm text-[#092328] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmOrder}
                disabled={buying}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#12544F] to-[#2A835F] hover:from-[#092328] hover:to-[#12544F] shadow-md cursor-pointer disabled:opacity-60"
              >
                {buying ? 'Processing...' : isManualMethod ? 'Submit Payment' : 'Confirm & Pay'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default Shop;

