
import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  ShieldCheck,
  Lock,
  Building,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const PHONE_REGEX = /^01[3-9]\d{8}$/;

export const UserProfile = () => {
  const { user, refreshUser, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [companyName, setCompanyName] = useState(user?.company_name || '');
  const [address, setAddress] = useState(user?.address || '');

  const [phone, setPhone] = useState(user?.phone || '');
  const [phonePassword, setPhonePassword] = useState('');

  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');

  const [nidNumber, setNidNumber] = useState(user?.nid_number || '');

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
  const [kycMsg, setKycMsg] = useState('');
  const [kycErr, setKycErr] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPhone, setSavingPhone] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name || '');
    setCompanyName(user.company_name || '');
    setAddress(user.address || '');
    setPhone(user.phone || '');
    setNidNumber(user.nid_number || '');
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileErr('');
    setSavingProfile(true);

    try {
      const res = await API.put('/auth/profile', {
        name,
        company_name: companyName,
        address,
      });

      if (res.data.success) {
        setProfileMsg('Profile updated successfully!');
        await refreshUser();
      }
    } catch (err) {
      setProfileErr(
        err.response?.data?.message || 'Failed to update profile'
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePhone = async (e) => {
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

    if (!phonePassword) {
      setPhoneErr('Current password is required to change your phone number.');
      return;
    }

    setSavingPhone(true);

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
          window.location.href = '/login';
        }, 1500);
      }
    } catch (err) {
      setPhoneErr(
        err.response?.data?.message || 'Failed to change phone number'
      );
    } finally {
      setSavingPhone(false);
    }
  };

  const handleRequestEmailChange = async (e) => {
    e.preventDefault();
    setEmailMsg('');
    setEmailErr('');

    if (!newEmail.trim()) {
      setEmailErr('Enter your new email address.');
      return;
    }

    if (!emailPassword) {
      setEmailErr('Current password is required to change your email.');
      return;
    }

    setSavingEmail(true);

    try {
      const res = await API.post('/auth/request-email-change', {
        new_email: newEmail.trim(),
        current_password: emailPassword,
      });

      if (res.data.success) {
        setEmailMsg(
          import.meta.env.DEV
            ? 'Verification link generated. Open the link printed in the backend terminal to confirm the new email.'
            : res.data.message
        );
        setNewEmail('');
        setEmailPassword('');
      }
    } catch (err) {
      setEmailErr(
        err.response?.data?.message || 'Failed to request email change'
      );
    } finally {
      setSavingEmail(false);
    }
  };

  const handleSubmitKyc = async (e) => {
    e.preventDefault();
    setKycMsg('');
    setKycErr('');

    try {
      const res = await API.post('/auth/kyc', {
        nid_number: nidNumber,
        address,
        company_name: companyName,
      });

      if (res.data.success) {
        setKycMsg(
          'KYC details submitted successfully and are pending admin review.'
        );
        await refreshUser();
      }
    } catch (err) {
      setKycErr(
        err.response?.data?.message || 'Failed to submit KYC'
      );
    }
  };

  const handleChangePassword = async (e) => {
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

    setSavingPassword(true);

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
          window.location.href = '/login';
        }, 1500);
      }
    } catch (err) {
      setPassErr(
        err.response?.data?.message || 'Failed to change password'
      );
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl pb-12">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">
          Profile & Security Settings
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your profile, email, phone number, password, and telecom KYC.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General profile */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <User className="w-4 h-4 text-[#12544F]" />
            <h3 className="font-bold text-sm text-[#092328]">
              General Information
            </h3>
          </div>

          {profileMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm">
              {profileMsg}
            </div>
          )}
          {profileErr && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-sm">
              {profileErr}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-3">
            <div>
              <label className="text-slate-700 font-bold block mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">
                Address
              </label>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full py-2.5 rounded-xl font-bold text-sm bg-[#12544F] hover:bg-[#092328] text-white disabled:opacity-60"
            >
              {savingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Email */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Mail className="w-4 h-4 text-[#12544F]" />
            <h3 className="font-bold text-sm text-[#092328]">
              Email Security
            </h3>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-[11px] text-slate-500">Current email</p>
            <p className="font-bold text-sm text-[#092328] break-all">
              {user?.email}
            </p>
            <p className="text-[11px] mt-1 text-emerald-600">
              {user?.email_verified_at
                ? 'Email verified'
                : 'Email not verified'}
            </p>
          </div>

          {emailMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm">
              {emailMsg}
            </div>
          )}
          {emailErr && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-sm">
              {emailErr}
            </div>
          )}

          <form onSubmit={handleRequestEmailChange} className="space-y-3">
            <div>
              <label className="text-slate-700 font-bold block mb-1">
                New Email Address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="new-email@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={savingEmail}
              className="w-full py-2.5 rounded-xl font-bold text-sm bg-[#12544F] hover:bg-[#092328] text-white disabled:opacity-60"
            >
              {savingEmail ? 'Sending...' : 'Send Email Verification'}
            </button>
          </form>
        </div>

        {/* Phone */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Phone className="w-4 h-4 text-[#12544F]" />
            <h3 className="font-bold text-sm text-[#092328]">
              Phone Number
            </h3>
          </div>

          {phoneMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm">
              {phoneMsg}
            </div>
          )}
          {phoneErr && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-sm">
              {phoneErr}
            </div>
          )}

          <form onSubmit={handleChangePhone} className="space-y-3">
            <div>
              <label className="text-slate-700 font-bold block mb-1">
                New Phone Number
              </label>
              <input
                type="tel"
                required
                inputMode="numeric"
                pattern="01[3-9][0-9]{8}"
                placeholder="017XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Bangladesh mobile format: 013–019 + 8 digits
              </p>
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={phonePassword}
                onChange={(e) => setPhonePassword(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={savingPhone}
              className="w-full py-2.5 rounded-xl font-bold text-sm bg-[#12544F] hover:bg-[#092328] text-white disabled:opacity-60"
            >
              {savingPhone ? 'Updating...' : 'Change Phone Number'}
            </button>
          </form>
        </div>

        {/* KYC */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2A835F]" />
              <h3 className="font-bold text-sm text-[#092328]">
                NID / KYC Verification
              </h3>
            </div>

            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                user?.kyc_status === 'verified'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {user?.kyc_status || 'Unsubmitted'}
            </span>
          </div>

          {kycMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm">
              {kycMsg}
            </div>
          )}
          {kycErr && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-sm">
              {kycErr}
            </div>
          )}

          <form onSubmit={handleSubmitKyc} className="space-y-3">
            <div>
              <label className="text-slate-700 font-bold block mb-1">
                National ID (NID) / Smart Card #
              </label>
              <input
                type="text"
                required
                value={nidNumber}
                onChange={(e) => setNidNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-sm bg-[#2A835F] hover:bg-[#12544F] text-white"
            >
              Submit KYC Compliance
            </button>
          </form>
        </div>
      </div>

      {/* Password */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Lock className="w-4 h-4 text-slate-700" />
          <h3 className="font-bold text-sm text-[#092328]">
            Change Password
          </h3>
        </div>

        {passMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm">
            {passMsg}
          </div>
        )}
        {passErr && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-sm">
            {passErr}
          </div>
        )}

        <form
          onSubmit={handleChangePassword}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <input
            type="password"
            required
            placeholder="Current password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
          />

          <input
            type="password"
            required
            minLength={8}
            placeholder="New password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
          />

          <input
            type="password"
            required
            minLength={8}
            placeholder="Confirm new password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
          />

          <div className="sm:col-span-3">
            <p className="text-[11px] text-slate-400 mb-3">
              8+ characters with uppercase, lowercase, number, and special
              character. You will be signed out after a successful change.
            </p>

            <button
              type="submit"
              disabled={savingPassword}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-slate-800 hover:bg-black text-white disabled:opacity-60"
            >
              {savingPassword ? 'Updating...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>

      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-sm text-blue-800 flex gap-2">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>
          Email changes require verification. Phone and password changes require
          the current password and invalidate the existing security session.
        </span>
      </div>
    </div>
  );
};
