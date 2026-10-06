import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Clock3, XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const DGePayResult = () => {
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState('checking');
  const [message, setMessage] = useState('Checking your payment status...');
  const [details, setDetails] = useState(null);
  const timerRef = useRef(null);

  const verify = useCallback(async () => {
    const uniqueTxnId = searchParams.get('unique_txn_id');
    const encryptedData = searchParams.get('data');

    if (!uniqueTxnId && !encryptedData) {
      setState('failed');
      setMessage('Payment transaction information was not found.');
      return 'terminal';
    }

    setState('checking');
    try {
      const res = await API.post('/dgepay/verify-result', {
        unique_txn_id: uniqueTxnId || undefined,
        data: encryptedData || undefined,
      });

      const data = res.data?.data;
      setDetails(data || null);

      if (data?.status === 'approved') {
        setState('success');
        setMessage('Payment verified successfully. Your recharge/package has been updated.');
        return 'terminal';
      }

      if (data?.status === 'failed' || data?.status === 'cancelled') {
        setState('failed');
        setMessage(data.status === 'cancelled' ? 'Payment was cancelled.' : 'Payment failed.');
        return 'terminal';
      }

      setState('pending');
      setMessage(data?.admin_verification_required
        ? 'Payment received successfully. Administrator verification is pending before your package or wallet is activated.'
        : 'Payment is still being processed. We will check again automatically.');
      return 'pending';
    } catch (error) {
      setState('failed');
      setMessage(error.response?.data?.message || 'Unable to verify the payment.');
      return 'error';
    }
  }, [searchParams]);

  useEffect(() => {
    if (authLoading || !user) return;

    let cancelled = false;
    let attempts = 0;

    const run = async () => {
      if (cancelled) return;
      attempts += 1;
      const result = await verify();
      if (!cancelled && result === 'pending' && attempts < 6) {
        timerRef.current = setTimeout(run, 5000);
      }
    };

    run();

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [authLoading, user, verify]);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Checking account...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center">
          <h1 className="text-2xl font-black text-[#092328]">Login Required</h1>
          <p className="mt-2 text-slate-500">Please log in to verify your MyBDPhone payment.</p>
          <Link to="/login" className="inline-flex mt-6 px-5 py-3 rounded-xl bg-[#12544F] text-white font-bold">Go to Login</Link>
        </div>
      </div>
    );
  }

  const icon = state === 'success'
    ? <CheckCircle2 className="w-16 h-16 text-emerald-500" />
    : state === 'pending' || state === 'checking'
      ? <Clock3 className="w-16 h-16 text-amber-500" />
      : <XCircle className="w-16 h-16 text-rose-500" />;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 text-center">
        <div className="flex justify-center">{icon}</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328] mt-5">
          {state === 'success' ? 'Payment Successful' : state === 'pending' || state === 'checking' ? 'Payment Processing' : 'Payment Not Completed'}
        </h1>
        <p className="mt-2 text-slate-500">{message}</p>

        {details && (
          <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-4 text-left text-sm space-y-2">
            <div className="flex justify-between gap-4"><span className="text-slate-500">Status</span><strong className="uppercase">{details.status}</strong></div>
            {details.unique_txn_id && <div className="flex justify-between gap-4"><span className="text-slate-500">Transaction</span><strong className="font-mono text-sm break-all">{details.unique_txn_id}</strong></div>}
            {details.gateway_status && <div className="flex justify-between gap-4"><span className="text-slate-500">Gateway Status</span><strong className="uppercase">{details.gateway_status}</strong></div>}
            {details.gateway_status_code && <div className="flex justify-between gap-4"><span className="text-slate-500">Gateway Code</span><strong>{details.gateway_status_code}</strong></div>}
          </div>
        )}

        <div className="mt-7 flex flex-col sm:flex-row gap-3">
          {(state === 'pending' || state === 'checking') && (
            <button onClick={() => verify()} className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#12544F] text-white font-bold">
              <RefreshCw className="w-4 h-4" /> Check Again
            </button>
          )}
          <Link to="/user/orders" className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold">
            <ArrowLeft className="w-4 h-4" /> My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DGePayResult;
