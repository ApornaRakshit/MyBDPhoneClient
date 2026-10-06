import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Clock3, XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import API from '../../services/api';

const MoneybagResult = () => {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState('checking');
  const [message, setMessage] = useState('Checking your Moneybag payment status...');
  const [details, setDetails] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const timerRef = useRef(null);

  const orderRef = searchParams.get('order_ref');
  const transactionId = searchParams.get('transaction_id');
  const paymentId = searchParams.get('payment_id');
  const callbackResult = searchParams.get('callback_result') || searchParams.get('result') || searchParams.get('status');

  const verify = useCallback(async () => {
    const isCancel =
      String(callbackResult || '').toLowerCase() === 'cancel' ||
      String(callbackResult || '').toLowerCase() === 'cancelled';

    if (isCancel) {
      setState('failed');
      setMessage('Moneybag payment was cancelled.');
      if (orderRef) {
        try {
          const res = await API.post('/moneybag/verify-result', {
            order_ref: orderRef,
            payment_id: paymentId ? Number(paymentId) : undefined,
            callback_result: 'cancel',
          });
          if (res.data?.data) {
            setDetails(res.data.data);
          }
        } catch (_) {}
      }
      return 'terminal';
    }

    if (!orderRef || !transactionId) {
      setState('failed');
      setMessage('Moneybag did not return the required order reference and transaction ID.');
      return 'terminal';
    }

    setState('checking');
    try {
      const res = await API.post('/moneybag/verify-result', {
        order_ref: orderRef,
        transaction_id: transactionId,
        payment_id: paymentId ? Number(paymentId) : undefined,
        callback_result: callbackResult || undefined,
      });

      const data = res.data?.data || null;
      setDetails(data);

      const localStatus = String(data?.status || '').toLowerCase();
      const gatewayStatus = String(data?.gateway_status || '').toLowerCase();
      const rechargeStatus = String(data?.recharge_status || '').toLowerCase();

      if (localStatus === 'approved' || gatewayStatus === 'approved' || localStatus === 'completed' || rechargeStatus === 'completed') {
        setState('success');
        setMessage('Payment successful! Your order / wallet recharge is completed.');
        return 'terminal';
      }

      if (localStatus === 'failed' || localStatus === 'cancelled' || rechargeStatus === 'failed' || rechargeStatus === 'cancelled') {
        setState('failed');
        setMessage(localStatus === 'cancelled' || rechargeStatus === 'cancelled' ? 'Moneybag payment was cancelled.' : 'Moneybag payment failed.');
        return 'terminal';
      }

      setState('pending');
      setMessage('Moneybag payment return received. Server-side verification is still processing.');
      return 'pending';
    } catch (error) {
      setState('pending');
      setMessage(error.response?.data?.message || 'Payment return received. Verification is pending; please check again.');
      return 'pending';
    }
  }, [orderRef, transactionId, paymentId, callbackResult]);

  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    const run = async () => {
      if (cancelled) return;
      tries += 1;
      setAttempt(tries);
      const result = await verify();
      if (!cancelled && result === 'pending' && tries < 4) timerRef.current = setTimeout(run, 5000);
    };
    run();
    return () => { cancelled = true; if (timerRef.current) clearTimeout(timerRef.current); };
  }, [verify]);

  const icon = state === 'pending' || state === 'checking'
    ? <Clock3 className="w-16 h-16 text-amber-500" />
    : state === 'success'
      ? <CheckCircle2 className="w-16 h-16 text-emerald-500" />
      : <XCircle className="w-16 h-16 text-rose-500" />;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 text-center">
        <div className="flex justify-center">{icon}</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328] mt-5">
          {state === 'pending' || state === 'checking' ? 'Payment Pending' : state === 'success' ? 'Payment Successful' : 'Payment Not Completed'}
        </h1>
        <p className="mt-2 text-slate-500">{message}</p>

        {details && (
          <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-4 text-left text-sm space-y-2">
            {details.order_ref && <div className="flex justify-between gap-4"><span className="text-slate-500">Order / Reference</span><strong className="font-mono text-sm break-all">{details.order_ref}</strong></div>}
            <div className="flex justify-between gap-4"><span className="text-slate-500">Payment Status</span><strong className="uppercase">{details.status || 'pending'}</strong></div>
            {details.gateway_status && <div className="flex justify-between gap-4"><span className="text-slate-500">Gateway Status</span><strong className="uppercase">{details.gateway_status}</strong></div>}
            {details.transaction_id && <div className="flex justify-between gap-4"><span className="text-slate-500">Transaction</span><strong className="font-mono text-sm break-all">{details.transaction_id}</strong></div>}
            {details.recharge_status && <div className="flex justify-between gap-4"><span className="text-slate-500">Recharge</span><strong className="uppercase">{details.recharge_status}</strong></div>}
            {details.admin_verification_required && <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-amber-800 text-sm font-semibold">Administrator approval is required before wallet credit.</div>}
          </div>
        )}

        <div className="mt-7 flex flex-col sm:flex-row gap-3">
          {(state === 'pending' || state === 'checking') && (
            <button onClick={verify} className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#12544F] text-white font-bold">
              <RefreshCw className="w-4 h-4" /> Check Again
            </button>
          )}
          <Link to="/user/orders" className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold">
            <ArrowLeft className="w-4 h-4" /> My Orders
          </Link>
        </div>
        {attempt > 1 && <p className="mt-4 text-[11px] text-slate-400">Verification check #{attempt}</p>}
      </div>
    </div>
  );
};

export default MoneybagResult;
