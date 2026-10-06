import { useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  Lock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

import API from "../../services/api";
import { BrandLogo } from "../../components/common/BrandLogo";
import heroBg from "../../assets/hero-bg.png";

export const ResetPassword = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const resetToken =
    searchParams.get("token") || "";

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!resetToken) {
      setError(
        "This password recovery link is invalid or missing."
      );
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "New password and confirm password do not match."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await API.post(
        "/auth/reset-password",
        {
          token: resetToken,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }
      );

      if (res.data.success) {
        setSuccess(
          "Password reset successfully. You can now login with your new password."
        );

        setTimeout(() => {
          navigate("/login", {
            replace: true,
          });
        }, 1800);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reset your password. The recovery link may have expired."
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
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 relative z-10">
        <div className="inline-block">
          <BrandLogo
            size="lg"
            showTagline={false}
          />
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">
          Reset Your Password
        </h2>

        <p className="text-sm text-slate-600">
          Create a new secure password for your
          MyBDPhone account.
        </p>
      </div>

      {/* Card */}
      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-9 px-6 sm:px-10 rounded-3xl shadow-xl border border-slate-200/90">
          {/* Error */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />

              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />

              <span>{success}</span>
            </div>
          )}

          {!resetToken ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-slate-600">
                This password recovery link is
                invalid or missing.
              </p>

              <Link
                to="/forgot-password"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#12544F] hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />

                Back to Password Recovery
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* New Password */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  New Password
                </label>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

                  <input
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(
                        e.target.value
                      )
                    }
                    className="w-full pl-10 pr-11 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#12544F] focus:outline-none transition-all"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword(
                        (value) => !value
                      )
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <p className="mt-1.5 text-sm text-slate-400">
                  Minimum 8 characters.
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    className="w-full pl-10 pr-11 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#12544F] focus:outline-none transition-all"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (value) => !value
                      )
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  loading || Boolean(success)
                }
                className="w-full py-3.5 rounded-xl font-bold text-base text-white bg-[#12544F] hover:bg-[#092328] shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>
                  {loading
                    ? "Updating Password..."
                    : "Reset Password"}
                </span>

                {!loading && (
                  <ArrowRight className="w-4 h-4 text-[#8BBB92]" />
                )}
              </button>
            </form>
          )}

          {/* Back Login */}
          <div className="text-center pt-5">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#12544F] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />

              Back to Login
            </Link>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 pt-4 mt-5 text-center text-sm text-slate-400 leading-relaxed">
            <p className="font-semibold text-slate-600">
              MyBDPhone Technologies Ltd
            </p>

            <p>Dhaka, Bangladesh</p>

            <p className="text-[11px] text-[#12544F] font-bold">
              www.mybdphone.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};