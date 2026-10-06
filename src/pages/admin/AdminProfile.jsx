
import React, { useState } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

const PHONE_REGEX = /^01[3-9]\d{8}$/;

export const AdminProfile = () => {
  const { user, logout, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [phonePassword, setPhonePassword] = useState('');

  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [devEmailVerificationUrl, setDevEmailVerificationUrl] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [phoneMsg, setPhoneMsg] = useState('');
  const [phoneErr, setPhoneErr] = useState('');
  const [emailMsg, setEmailMsg] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [passErr, setPassErr] = useState('');

  const [loading, setLoading] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileErr('');
    setLoading(true);

    try {
      const res = await API.put('/auth/profile', { name });

      if (res.data.success) {
        setProfileMsg('Admin profile updated successfully.');
        await refreshUser();
      }
    } catch (err) {
      setProfileErr(
        err.response?.data?.message || 'Failed to update admin profile.'
      );
    } finally {
      setLoading(false);
    }
  };

  const changePhone = async (e) => {
    e.preventDefault();
    setPhoneMsg('');
    setPhoneErr('');

    const normalizedPhone = phone.trim().replace(/[\s()-]/g, '');

    if (!PHONE_REGEX.test(normalizedPhone)) {
      setPhoneErr(
        'Enter a valid Bangladesh mobile number, for example 01712345678.'
      );
      return;
    }

    try {
      const res = await API.post('/auth/change-phone', {
        new_phone: normalizedPhone,
        current_password: phonePassword,
      });

      if (res.data.success) {
        setPhoneMsg(res.data.message);
        setPhonePassword('');

        setTimeout(() => {
          logout();
          window.location.href = '/admin/login';
        }, 1500);
      }
    } catch (err) {
      setPhoneErr(
        err.response?.data?.message || 'Failed to change phone number.'
      );
    }
  };

  const requestEmailChange = async (e) => {
    e.preventDefault();
    setEmailMsg('');
    setEmailErr('');
    setDevEmailVerificationUrl('');

    try {
      const res = await API.post('/auth/request-email-change', {
        new_email: newEmail.trim(),
        current_password: emailPassword,
      });

      if (res.data.success) {
        setEmailMsg(res.data.message);
        setDevEmailVerificationUrl(res.data.dev_verification_url || '');
        setNewEmail('');
        setEmailPassword('');
      }
    } catch (err) {
      setEmailErr(
        err.response?.data?.message || 'Failed to request email change.'
      );
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPassMsg('');
    setPassErr('');

    if (newPassword !== confirmPassword) {
      setPassErr('New password and confirm password do not match.');
      return;
    }

    if (
      newPassword.length < 8 ||
      !/[a-z]/.test(newPassword) ||
      !/[A-Z]/.test(newPassword) ||
      !/\d/.test(newPassword) ||
      !/[^A-Za-z0-9]/.test(newPassword)
    ) {
      setPassErr(
        'Password must contain 8+ characters, uppercase, lowercase, number, and special character.'
      );
      return;
    }

    try {
      const res = await API.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      if (res.data.success) {
        setPassMsg(res.data.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');

        setTimeout(() => {
          logout();
          window.location.href = '/admin/login';
        }, 1500);
      }
    } catch (err) {
      setPassErr(
        err.response?.data?.message || 'Failed to change admin password.'
      );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">
          My Account & Security
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Change your own admin name, email, phone number, and password.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-[#12544F]/5 border border-[#12544F]/10 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-[#12544F] shrink-0" />
        <div className="text-sm text-slate-600">
          <p className="font-bold text-[#092328]">Admin account protection</p>
          <p className="mt-1">
            Email changes require email verification. Phone and password changes
            require your current password and invalidate the existing session.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-[#12544F]" />
            <h3 className="font-bold text-sm">Profile</h3>
          </div>

          {profileMsg && <div className="mt-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm">{profileMsg}</div>}
          {profileErr && <div className="mt-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-sm">{profileErr}</div>}

          <form onSubmit={saveProfile} className="mt-4 space-y-3">
            <input
              type="text"
              required
              placeholder="Admin name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
            />
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[10px] uppercase font-bold text-slate-400">Current email</p>
              <p className="text-sm font-bold text-[#092328] break-all">{user?.email}</p>
            </div>
            <button
              disabled={loading}
              className="w-full py-2.5 rounded-xl font-bold text-sm bg-[#12544F] text-white disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Mail className="w-4 h-4 text-[#12544F]" />
            <h3 className="font-bold text-sm">Change Email</h3>
          </div>

          {emailMsg && <div className="mt-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm">{emailMsg}</div>}
          {emailErr && <div className="mt-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-sm">{emailErr}</div>}

          <form onSubmit={requestEmailChange} className="mt-4 space-y-3">
            <input
              type="email"
              required
              placeholder="new-admin@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
            />
            <input
              type="password"
              required
              placeholder="Current password"
              autoComplete="current-password"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
            />
            <button className="w-full py-2.5 rounded-xl font-bold text-sm bg-[#12544F] text-white">
              Send Verification
            </button>
          </form>

          {devEmailVerificationUrl && (
            <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm">
              <p className="font-black text-amber-900">Local development link</p>
              <a
                href={devEmailVerificationUrl}
                className="mt-1 flex gap-2 break-all underline font-semibold text-amber-900"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                {devEmailVerificationUrl}
              </a>
            </div>
          )}
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Phone className="w-4 h-4 text-[#12544F]" />
            <h3 className="font-bold text-sm">Change Phone</h3>
          </div>

          {phoneMsg && <div className="mt-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm">{phoneMsg}</div>}
          {phoneErr && <div className="mt-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-sm">{phoneErr}</div>}

          <form onSubmit={changePhone} className="mt-4 space-y-3">
            <input
              type="tel"
              required
              inputMode="numeric"
              pattern="01[3-9][0-9]{8}"
              placeholder="017XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
            />
            <input
              type="password"
              required
              placeholder="Current password"
              autoComplete="current-password"
              value={phonePassword}
              onChange={(e) => setPhonePassword(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
            />
            <button className="w-full py-2.5 rounded-xl font-bold text-sm bg-[#12544F] text-white">
              Change Phone Number
            </button>
          </form>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Lock className="w-4 h-4 text-[#12544F]" />
            <h3 className="font-bold text-sm">Change Password</h3>
          </div>

          {passMsg && <div className="mt-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm">{passMsg}</div>}
          {passErr && <div className="mt-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-sm">{passErr}</div>}

          <form onSubmit={changePassword} className="mt-4 space-y-3">
            <input
              type="password"
              required
              placeholder="Current password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
            />
            <input
              type="password"
              required
              minLength={8}
              placeholder="New password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
            />
            <input
              type="password"
              required
              minLength={8}
              placeholder="Confirm new password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
            />
            <button className="w-full py-2.5 rounded-xl font-bold text-sm bg-slate-800 text-white">
              Change Password
            </button>
          </form>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-800 flex gap-2">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span>
          Passwords are hashed server-side. Reset and email verification links
          are single-use and expire automatically.
        </span>
      </div>
    </div>
  );
};
