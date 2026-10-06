
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../../components/common/BrandLogo';
import {
  Lock,
  Mail,
  User,
  Phone,
  Building,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

const PHONE_REGEX = /^01[3-9]\d{8}$/;

const Register = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company_name: '',
    password: '',
    confirm_password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [emailVerificationRequired, setEmailVerificationRequired] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const phone = formData.phone.trim().replace(/[\s()-]/g, '');

    if (!PHONE_REGEX.test(phone)) {
      setError(
        'Please enter a valid Bangladesh mobile number, for example 01712345678.'
      );
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (
      !/[a-z]/.test(formData.password) ||
      !/[A-Z]/.test(formData.password) ||
      !/\d/.test(formData.password) ||
      !/[^A-Za-z0-9]/.test(formData.password)
    ) {
      setError(
        'Password must include uppercase, lowercase, number, and special character.'
      );
      return;
    }

    setLoading(true);

    try {
      const result = await register(
        formData.name,
        formData.email,
        phone,
        formData.password,
        formData.company_name,
        formData.confirm_password
      );

      setEmailVerificationRequired(Boolean(result?.email_verification_required));
      setRegistered(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <BrandLogo size="lg" showTagline={true} />

          <div className="mt-6 bg-white py-9 px-6 sm:px-10 rounded-3xl shadow-xl border border-slate-200">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h2 className="mt-4 text-2xl font-black text-[#092328]">
              {emailVerificationRequired ? 'Check Your Email' : 'Account Created'}
            </h2>

            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {emailVerificationRequired
                ? 'Your MyBDPhone account has been created. Please verify your email address before signing in.'
                : 'Your MyBDPhone account has been created successfully. You can now sign in to your account.'}
            </p>

            <Link
              to="/login"
              className="mt-6 w-full py-3.5 rounded-xl font-bold text-sm text-white bg-[#12544F] hover:bg-[#092328] flex items-center justify-center gap-2"
            >
              Go to Login
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-block">
          <BrandLogo size="lg" showTagline={true} />
        </div>

        <h2 className="text-2xl font-black text-[#092328]">
          Create Your Account
        </h2>

        <p className="text-sm text-slate-500">
          Get your official 096 IP number and start calling today.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-xl border border-slate-200/80 space-y-6">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="e.g. Enter your name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="name@mail.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    inputMode="numeric"
                    autoComplete="tel"
                    pattern="01[3-9][0-9]{8}"
                    placeholder="017XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
                  />
                </div>
                <p className="mt-1 text-[10px] text-slate-400">
                  11-digit Bangladesh mobile number
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Company / Organization (Optional)
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Your company name"
                  value={formData.company_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      company_name: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={formData.confirm_password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirm_password: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <p className="text-[11px] leading-relaxed text-slate-400">
              Password must contain at least 8 characters, including uppercase,
              lowercase, number, and special character.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#12544F] to-[#2A835F] hover:from-[#092328] hover:to-[#12544F] shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              <span>
                {loading ? "Creating account..." : "Register MyBDPhone Account"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-[#12544F] hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Register };
