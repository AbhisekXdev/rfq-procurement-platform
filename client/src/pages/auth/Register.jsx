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

  /* =====================================================
     REGISTER
  ===================================================== */

  const submit = async (event) => {
    event.preventDefault();

    try {
      const data = await register(form);

      setExpires(data.otpExpiresIn);
      setStep("otp");

      notify(
        "Registration OTP sent to your email.",
        "success"
      );
    } catch (error) {
      notify(error.message, "error");
    }
  };

  /* =====================================================
     VERIFY OTP
  ===================================================== */

  const verify = async (event) => {
    event.preventDefault();

    try {
      const data = await verifyRegistration(
        form.email,
        otp
      );

      notify(
        "Account verified successfully.",
        "success"
      );

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

  /* =====================================================
     RESEND OTP
  ===================================================== */

  const resend = async () => {
    try {
      const data = await resendRegistrationOtp(
        form.email
      );

      setExpires(data.otpExpiresIn);

      notify(
        "A new OTP has been sent.",
        "success"
      );
    } catch (error) {
      notify(error.message, "error");
    }
  };

  return (
    <AuthLayout
      title={
        step === "form"
          ? "Create your workspace"
          : "Verify your email"
      }
      mode="user"
    >
      {step === "form" ? (
        <RegistrationForm
          form={form}
          update={update}
          submit={submit}
          loading={loading}
        />
      ) : (
        <VerificationForm
          form={form}
          otp={otp}
          setOtp={setOtp}
          expires={expires}
          verify={verify}
          resend={resend}
          setStep={setStep}
          loading={loading}
        />
      )}
    </AuthLayout>
  );
}

/* =========================================================
   REGISTRATION FORM
========================================================= */

function RegistrationForm({
  form,
  update,
  submit,
  loading,
}) {
  return (
    <form
      onSubmit={submit}
      className="space-y-5"
    >

      {/* Introduction */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
        <div className="flex gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
            <FiShoppingBag size={17} />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-800">
              Join RFQ Market
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Create your procurement workspace and
              start connecting with businesses.
            </p>
          </div>

        </div>
      </div>

      {/* Name */}
      <Input
        label="Full name"
        value={form.name}
        onChange={(e) =>
          update("name", e.target.value)
        }
        placeholder="Enter your full name"
        autoComplete="name"
        required
      />

      {/* Email */}
      <Input
        label="Work email"
        type="email"
        value={form.email}
        onChange={(e) =>
          update("email", e.target.value)
        }
        placeholder="you@company.com"
        autoComplete="email"
        required
      />

      {/* Password */}
      <Input
        label="Password"
        type="password"
        value={form.password}
        onChange={(e) =>
          update("password", e.target.value)
        }
        placeholder="Create a secure password"
        autoComplete="new-password"
        minLength={8}
        required
      />

      {/* Account Type */}
      <div>
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Account type
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

          {/* Buyer */}
          <RoleCard
            selected={form.role === "BUYER"}
            title="Buyer"
            description="Post RFQs & receive quotations"
            icon={<FiShoppingBag size={19} />}
            onClick={() =>
              update("role", "BUYER")
            }
          />

          {/* Supplier */}
          <RoleCard
            selected={form.role === "SUPPLIER"}
            title="Supplier"
            description="Find RFQs & submit quotations"
            icon={<FiTruck size={19} />}
            onClick={() =>
              update("role", "SUPPLIER")
            }
          />

        </div>

        {/* Hidden native select to preserve simple form semantics */}
        <select
          value={form.role}
          onChange={(e) =>
            update("role", e.target.value)
          }
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
        >
          <option value="BUYER">Buyer</option>
          <option value="SUPPLIER">Supplier</option>
        </select>
      </div>

      {/* Security information */}
      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">

        <FiShield
          className="mt-0.5 shrink-0 text-emerald-600"
          size={17}
        />

        <p className="text-xs leading-5 text-slate-500">
          Your email will be verified with a secure
          one-time password before your account is
          activated.
        </p>

      </div>

      {/* Submit */}
      <Button
        type="submit"
        loading={loading}
      >
        <span className="flex items-center justify-center gap-2">
          Create account & send OTP
          {!loading && (
            <FiArrowRight size={17} />
          )}
        </span>
      </Button>

      {/* Login */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">

        <p className="text-sm text-slate-500">
          Already registered?
        </p>

        <Link
          to="/login"
          className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-blue-600 transition hover:text-blue-700"
        >
          Sign in
          <FiArrowRight size={14} />
        </Link>

      </div>
    </form>
  );
}

/* =========================================================
   ROLE CARD
========================================================= */

function RoleCard({
  selected,
  title,
  description,
  icon,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative w-full rounded-2xl border p-4
        text-left transition-all duration-200
        active:scale-[0.98]
        ${
          selected
            ? "border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-500"
            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
        }
      `}
    >

      {/* Check */}
      {selected && (
        <span className="absolute right-3 top-3 text-blue-600">
          <FiCheckCircle size={17} />
        </span>
      )}

      <div
        className={`
          mb-3 flex h-10 w-10 items-center justify-center
          rounded-xl
          ${
            selected
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-500"
          }
        `}
      >
        {icon}
      </div>

      <p className="text-sm font-bold text-slate-900">
        {title}
      </p>

      <p className="mt-1 pr-4 text-[11px] leading-4 text-slate-500">
        {description}
      </p>
    </button>
  );
}

/* =========================================================
   OTP VERIFICATION
========================================================= */

function VerificationForm({
  form,
  otp,
  setOtp,
  expires,
  verify,
  resend,
  setStep,
  loading,
}) {
  return (
    <form
      onSubmit={verify}
      className="space-y-5"
    >

      {/* Email verification header */}
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">

        <div className="flex gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <FiMail size={18} />
          </div>

          <div className="min-w-0">

            <p className="text-sm font-bold text-slate-800">
              Check your inbox
            </p>

            <p className="mt-1 break-all text-xs leading-5 text-slate-500">
              We sent a 6-digit verification code to{" "}
              <strong className="font-bold text-slate-700">
                {form.email}
              </strong>
            </p>

          </div>

        </div>
      </div>

      {/* Timer */}
      {expires && (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-3">

          <span className="h-2 w-2 rounded-full bg-emerald-500" />

          <p className="text-xs font-semibold text-slate-500">
            OTP expires in{" "}
            <strong className="text-slate-800">
              {Math.ceil(expires / 60)} minutes
            </strong>
          </p>

        </div>
      )}

      {/* OTP */}
      <div>
        <Input
          label="Verification code"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={otp}
          onChange={(e) =>
            setOtp(
              e.target.value
                .replace(/\D/g, "")
                .slice(0, 6)
            )
          }
          placeholder="000000"
          maxLength={6}
          required
        />

        <p className="mt-2 text-center text-[11px] text-slate-400">
          Enter the 6-digit code from your email.
        </p>
      </div>

      {/* Verify */}
      <Button
        type="submit"
        loading={loading}
        disabled={otp.length !== 6}
      >
        <span className="flex items-center justify-center gap-2">
          Verify email & activate account

          {!loading && (
            <FiCheckCircle size={17} />
          )}
        </span>
      </Button>

      {/* Actions */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

        <button
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          type="button"
          onClick={resend}
          disabled={loading}
        >
          <FiRefreshCw size={14} />
          Resend OTP
        </button>

        <button
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          type="button"
          onClick={() => setStep("form")}
          disabled={loading}
        >
          <FiEdit3 size={14} />
          Change details
        </button>

      </div>

      {/* Security */}
      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">

        <FiShield
          className="mt-0.5 shrink-0 text-emerald-600"
          size={16}
        />

        <p className="text-[11px] leading-5 text-slate-500">
          Never share your verification code with
          anyone. RFQ Market will never ask you to
          disclose your OTP.
        </p>

      </div>

    </form>
  );
}