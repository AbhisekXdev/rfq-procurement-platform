import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCheck,
  FiLock,
  FiShield,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";

import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import Captcha from "../../components/auth/Captcha.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export default function Login() {
  const { login, loading } = useAuth();
  const { notify } = useToast();

  const navigate = useNavigate();
  const location = useLocation();

  const queryAdmin =
    new URLSearchParams(location.search).get("mode") === "admin";

  const [mode, setMode] = useState(queryAdmin ? "admin" : "user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValid, setCaptchaValid] = useState(false);

  useEffect(() => {
    setMode(queryAdmin ? "admin" : "user");
  }, [queryAdmin]);

  const submit = async (event) => {
    event.preventDefault();

    if (!captchaValid) {
      notify("Please complete the CAPTCHA correctly.", "error");
      return;
    }

    try {
      const data = await login(
        email,
        password,
        mode === "admin" ? "ADMIN" : undefined
      );

      notify("Login successful.", "success");

      navigate(
        data.user.role === "ADMIN" ? "/admin" : "/dashboard",
        { replace: true }
      );
    } catch (error) {
      notify(error.message, "error");
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);

    if (nextMode === "admin") {
      navigate("/login?mode=admin", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  };

  return (
    <AuthLayout
      title={mode === "admin" ? "Admin sign in" : "Welcome back"}
      mode={mode}
    >
      {/* ================= MODE TABS ================= */}
      <div className="mb-6 grid grid-cols-2 rounded-2xl bg-slate-100 p-1.5">

        <button
          type="button"
          onClick={() => switchMode("user")}
          className={`
            flex min-h-[46px] items-center justify-center gap-2
            rounded-xl px-3 text-sm font-bold
            transition-all duration-200
            ${
              mode === "user"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }
          `}
        >
          <FiUsers size={16} />
          <span>Buyer / Supplier</span>
        </button>

        <button
          type="button"
          onClick={() => switchMode("admin")}
          className={`
            flex min-h-[46px] items-center justify-center gap-2
            rounded-xl px-3 text-sm font-bold
            transition-all duration-200
            ${
              mode === "admin"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }
          `}
        >
          <FiShield size={16} />
          <span>Admin</span>
        </button>
      </div>

      {/* ================= LOGIN FORM ================= */}
      <form onSubmit={submit} className="space-y-5">

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />

        {/* Security indicator */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <FiLock className="shrink-0 text-emerald-600" size={15} />

          <span className="text-xs font-medium text-slate-500">
            Your credentials are protected with secure authentication.
          </span>
        </div>

        {/* CAPTCHA */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3">
          <Captcha onValidChange={setCaptchaValid} />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          loading={loading}
          disabled={!captchaValid}
        >
          <span className="flex items-center justify-center gap-2">
            {mode === "admin" ? "Sign in as Admin" : "Sign in"}

            {!loading && <FiArrowRight size={17} />}
          </span>
        </Button>

        {/* Footer note */}
        {mode === "user" ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-sm text-slate-500">
              New to the marketplace?
            </p>

            <Link
              to="/register"
              className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-blue-600 transition hover:text-blue-700"
            >
              Create an account
              <FiArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex gap-3">
              <FiShield
                className="mt-0.5 shrink-0 text-amber-600"
                size={18}
              />

              <p className="text-xs leading-5 text-amber-800">
                Admin access is restricted to accounts with the{" "}
                <strong>ADMIN</strong> role.
              </p>
            </div>
          </div>
        )}
      </form>
    </AuthLayout>
  );
}

/* =========================================================
   AUTH LAYOUT
========================================================= */

export function AuthLayout({ title, children }) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-slate-950">
          <div className="flex w-full flex-col justify-between p-8 xl:p-12">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                R
              </div>

              <div>
                <div className="text-lg font-bold text-white">
                  RFQ Market
                </div>

                <div className="text-xs uppercase tracking-widest text-blue-400">
                  B2B Procurement
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-xl">
              <span className="inline-flex rounded-full bg-blue-500/10 px-4 py-2 text-xs font-semibold tracking-wider text-blue-400">
                B2B PROCUREMENT PLATFORM
              </span>

              <h1 className="mt-6 text-4xl font-bold leading-tight text-white xl:text-5xl">
                Smarter sourcing.
                <br />
                <span className="text-blue-500">
                  Faster decisions.
                </span>
              </h1>

              <p className="mt-6 text-base leading-7 text-slate-300">
                Publish requirements, discover suppliers, collect quotations
                and manage your procurement workflow from one workspace.
              </p>
            </div>

            {/* Footer */}
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} RFQ Market
            </p>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex min-h-screen w-full items-start justify-center bg-white px-4 py-6 sm:px-6 sm:py-10 md:px-8 lg:w-1/2 lg:items-center xl:w-[45%]">

          <div className="w-full max-w-md">

            {/* MOBILE LOGO */}
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                R
              </div>

              <div>
                <div className="text-lg font-bold text-slate-900">
                  RFQ Market
                </div>

                <div className="text-xs uppercase tracking-widest text-blue-600">
                  B2B Procurement
                </div>
              </div>

            </div>

            {/* TITLE */}
            <div className="mb-7 text-center lg:text-left">

              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600">
                Procurement Workspace
              </span>

              <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                {title}
              </h2>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Secure access to your procurement workspace.
              </p>

            </div>

            {/* FORM CARD */}
            <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:p-7">
              {children}
            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              Secure B2B procurement platform
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}

/* =========================================================
   FEATURE COMPONENT
========================================================= */

function Feature({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">

      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
        {icon}
      </div>

      <p className="text-xs font-bold text-white">
        {title}
      </p>

      <p className="mt-1 text-[10px] leading-4 text-slate-500">
        {description}
      </p>
    </div>
  );
}