
import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import API from '../../services/api';
import { BrandLogo } from '../../components/common/BrandLogo';
import heroBg from '../../assets/hero-bg.png';

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [role, setRole] = useState('user');

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('This verification link is missing a token.');
        return;
      }

      try {
        const res = await API.get(
          `/auth/verify-email?token=${encodeURIComponent(token)}`
        );

        if (!cancelled) {
          setStatus('success');
          setMessage(
            res.data.message || 'Email verified successfully.'
          );
          setRole(res.data.role || 'user');
        }
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setMessage(
            err.response?.data?.message ||
              'This verification link is invalid or expired.'
          );
        }
      }
    };

    verify();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div
      className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#f2f9f6] bg-no-repeat bg-cover bg-center"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <BrandLogo size="lg" showTagline={false} />

        <div className="mt-6 bg-white py-9 px-6 sm:px-10 rounded-3xl shadow-xl border border-slate-200">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 mx-auto text-[#12544F] animate-spin" />
              <h2 className="mt-5 text-2xl font-black text-[#092328]">
                Verifying Email...
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Please wait while we securely verify your email address.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="mt-5 text-2xl font-black text-[#092328]">
                Email Verified
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {message}
              </p>

              <Link
                to={role === 'admin' ? '/admin/login' : '/login'}
                className="mt-6 w-full py-3.5 rounded-xl font-bold text-sm text-white bg-[#12544F] hover:bg-[#092328] flex items-center justify-center gap-2"
              >
                Continue to Login
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mx-auto w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h2 className="mt-5 text-2xl font-black text-[#092328]">
                Verification Failed
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {message}
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  to="/login"
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-[#12544F] hover:bg-[#092328] flex items-center justify-center"
                >
                  Back to Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-bold text-[#12544F] hover:underline"
                >
                  Create a New Account
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
