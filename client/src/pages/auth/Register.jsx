
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiMail,
  FiShield,
  FiShoppingBag,
  FiTruck,
  FiRefreshCw,
  FiEdit3,
  FiUserPlus,
} from "react-icons/fi";

import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { AuthLayout } from "./Login.jsx";

export default function Register() {
  const {
    register,
    verifyRegistration,
    resendRegistrationOtp,
    loading,
  } = useAuth();

  const { notify } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState("form");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "BUYER",
  });

  const [otp, setOtp] = useState("");
  const [expires, setExpires] = useState(null);

  const update = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    try {
      const data = await register({
        ...form,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
      });

      setExpires(data.otpExpiresIn);
      setStep("otp");
      notify("Verification code sent to your email.", "success");
    } catch (error) {
      notify(error.message, "error");
    }
  };

  const verify = async (event) => {
    event.preventDefault();

    try {
      const data = await verifyRegistration(form.email, otp);

      notify("Your account has been verified successfully.", "success");

      navigate(
        data.user.role === "ADMIN"
          ? "/admin"
          : "/dashboard",
        { replace: true }
      );
    } catch (error) {
      notify(error.message, "error");
    }
  };

  const resend = async () => {
    try {
      const data = await resendRegistrationOtp(form.email);
      setExpires(data.otpExpiresIn);
      setOtp("");
      notify("A new verification code has been sent.", "success");
    } catch (error) {
      notify(error.message, "error");
    }
  };

  return (
    <AuthLayout
      title={step === "form" ? "Create your account" : "Verify your email"}
      mode="REGISTER"
    >
      <div className="animate-auth-in space-y-6">

        {step === "form" ? (
          <>
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-blue-600">
                <FiUserPlus />
                Get started
              </div>

              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Join RFQ Marketplace
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Choose how you want to participate in the B2B marketplace.
              </p>
            </div>

            <form onSubmit={submit} className="space-y-5">

              <div>
                <label className="mb-3 block text-sm font-bold text-slate-800">
                  I want to join as
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <RoleCard
                    selected={form.role === "BUYER"}
                    title="Buyer"
                    subtitle="Find products and services"
                    description="Create RFQs, receive quotations and compare suppliers."
                    icon={<FiShoppingBag size={22} />}
                    onClick={() => update("role", "BUYER")}
                    color="blue"
                  />

                  <RoleCard
                    selected={form.role === "SUPPLIER"}
                    title="Supplier"
                    subtitle="Grow your business"
                    description="Explore buyer requirements and submit quotations."
                    icon={<FiTruck size={22} />}
                    onClick={() => update("role", "SUPPLIER")}
                    color="emerald"
                  />
                </div>
              </div>

              <Input
                label="Full name"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />

              <Input
                label="Email address"
                type="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                required
              />

              <div className="space-y-2">
                <Input
                  label="Create password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(event) => update("password", event.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />

                <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-500">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(event) => setShowPassword(event.target.checked)}
                    className="h-4 w-4 rounded accent-blue-600"
                  />
                  Show password
                </label>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
                <FiShield className="mt-0.5 shrink-0 text-emerald-600" size={18} />
                <p className="text-xs leading-5 text-slate-600">
                  Your email will be verified through a one-time password.
                  Your account will be activated after successful verification.
                </p>
              </div>

              <Button type="submit" loading={loading} disabled={loading}>
                <span className="flex items-center justify-center gap-2">
                  Create account <FiArrowRight size={17} />
                </span>
              </Button>
            </form>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?
              </p>
              <Link
                to="/login"
                className="mt-2 inline-flex items-center gap-2 text-sm font-extrabold text-blue-600 transition hover:gap-3"
              >
                Sign in <FiArrowRight />
              </Link>
            </div>
          </>
        ) : (
          <form onSubmit={verify} className="space-y-5">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                  <FiMail size={20} />
                </div>

                <div className="min-w-0">
                  <p className="font-extrabold text-slate-900">
                    Check your inbox
                  </p>
                  <p className="mt-1 break-all text-xs leading-5 text-slate-600">
                    We sent a verification code to{" "}
                    <strong>{form.email}</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <p className="text-xs text-slate-500">
                Account type:{" "}
                <strong className="text-slate-800">{form.role}</strong>
              </p>
              {expires && (
                <p className="mt-1 text-xs text-slate-500">
                  OTP validity:{" "}
                  <strong className="text-slate-800">
                    {Math.ceil(expires / 60)} minutes
                  </strong>
                </p>
              )}
            </div>

            <Input
              label="6-digit verification code"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="000000"
              maxLength={6}
              required
            />

            <Button
              type="submit"
              loading={loading}
              disabled={loading || otp.length !== 6}
            >
              <span className="flex items-center justify-center gap-2">
                Verify email and activate account
                <FiCheckCircle />
              </span>
            </Button>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={resend}
                disabled={loading}
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
              >
                <FiRefreshCw />
                Resend code
              </button>

              <button
                type="button"
                onClick={() => setStep("form")}
                disabled={loading}
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
              >
                <FiEdit3 />
                Change details
              </button>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <FiShield className="mt-0.5 shrink-0 text-emerald-600" />
              <p className="text-xs leading-5 text-slate-500">
                Never share your verification code with anyone.
              </p>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}

function RoleCard({
  selected,
  title,
  subtitle,
  description,
  icon,
  onClick,
  color,
}) {
  const selectedClass =
    color === "emerald"
      ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100"
      : "border-blue-500 bg-blue-50 ring-2 ring-blue-100";

  const iconClass =
    color === "emerald"
      ? "bg-emerald-600 text-white"
      : "bg-blue-600 text-white";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`
        group relative flex min-h-[178px] flex-col items-start
        rounded-2xl border p-4 text-left transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg active:scale-[.98]
        ${selected ? selectedClass : "border-slate-200 bg-white hover:border-slate-300"}
      `}
    >
      {selected && (
        <FiCheckCircle
          className="absolute right-3 top-3 text-emerald-600"
          size={18}
        />
      )}

      <div className={`
        mb-4 flex h-11 w-11 items-center justify-center
        rounded-xl shadow-sm transition-transform duration-300
        group-hover:scale-110
        ${selected ? iconClass : "bg-slate-100 text-slate-500"}
      `}>
        {icon}
      </div>

      <p className="text-base font-extrabold text-slate-900">{title}</p>
      <p className="mt-1 text-xs font-bold text-blue-600">{subtitle}</p>
      <p className="mt-2 text-[11px] leading-5 text-slate-500">
        {description}
      </p>
    </button>
  );
}
