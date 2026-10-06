import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import API from '../../services/api';
import { BrandLogo } from '../../components/common/BrandLogo';
import heroBg from '../../assets/hero-bg.png';

export const AdminForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError('Please enter your administrator email address.');
      return;
    }

    if (!newPassword) {
      setError('Please enter a new password.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await API.post('/auth/admin/forgot-password', {
        email: normalizedEmail,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      if (res.data.success) {
        setSuccess(
          res.data.message || 'Admin password updated successfully! Redirecting to login...'
        );
        setTimeout(() => {
          navigate('/admin/login', { replace: true });
        }, 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to process the password reset request.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#f2f9f6] bg-no-repeat bg-cover bg-center"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <BrandLogo size="lg" showTagline={false} />

        <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">
          Reset Admin Password
        </h2>

        <p className="text-sm text-slate-600">
          Enter your administrator email and choose a new password.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-9 px-6 sm:px-10 rounded-3xl shadow-xl border border-slate-200 space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@mybdphone.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || Boolean(success)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#12544F] focus:outline-hidden disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="Enter new password (min. 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading || Boolean(success)}
                  className="w-full pl-10 pr-10 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#12544F] focus:outline-hidden disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading || Boolean(success)}
                  className="w-full pl-10 pr-10 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#12544F] focus:outline-hidden disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || Boolean(success)}
              className="w-full mt-2 py-3.5 rounded-xl font-bold text-base text-white bg-[#12544F] hover:bg-[#092328] shadow-md flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Updating Password...' : 'Set New Admin Password'}
              <ArrowRight className="w-4 h-4 text-[#8BBB92]" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#12544F] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
