
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiShield,
  FiShoppingBag,
  FiTruck,
  FiLock,
  FiZap,
} from "react-icons/fi";

import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import Captcha from "../../components/auth/Captcha.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

const ROLES = [
  {
    id: "BUYER",
    title: "Buyer",
    description: "Post RFQs and receive competitive quotations.",
    icon: <FiShoppingBag size={21} />,
    color: "blue",
  },
  {
    id: "SUPPLIER",
    title: "Supplier",
    description: "Discover requirements and submit quotations.",
    icon: <FiTruck size={21} />,
    color: "emerald",
  },
  {
    id: "ADMIN",
    title: "Admin",
    description: "Manage users and oversee the marketplace.",
    icon: <FiShield size={21} />,
    color: "violet",
  },
];

export default function Login() {
  const { login, loading } = useAuth();
  const { notify } = useToast();

  const navigate = useNavigate();
  const location = useLocation();
  const captchaRef = useRef(null);

  const queryMode = new URLSearchParams(location.search).get("mode");
  const queryRole = new URLSearchParams(location.search).get("role");

  const initialRole =
    queryMode === "admin"
      ? "ADMIN"
      : ["BUYER", "SUPPLIER"].includes(queryRole)
        ? queryRole
        : "BUYER";

  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setRole(initialRole);
  }, [initialRole]);

  const selectRole = (nextRole) => {
    setRole(nextRole);

    if (nextRole === "ADMIN") {
      navigate("/login?mode=admin", { replace: true });
    } else {
      navigate(`/login?role=${nextRole}`, { replace: true });
    }
  };

  const handleVerifiedToken = async (captchaToken) => {
    try {
      const data = await login(email, password, role, captchaToken);

      notify("Login successful. Welcome back!", "success");

      const destination =
        data.user.role === "ADMIN"
          ? "/admin"
          : "/dashboard";

      navigate(destination, { replace: true });
    } catch (error) {
      notify(error.message || "Unable to login.", "error");
      captchaRef.current?.reset();
    } finally {
      setSubmitting(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();

    if (loading || submitting) return;

    if (!email.trim() || !password) {
      notify("Please enter your email and password.", "error");
      return;
    }

    setSubmitting(true);

    try {
      captchaRef.current?.execute();
    } catch {
      setSubmitting(false);
      notify("Security verification could not start.", "error");
    }
  };

  const activeRole = ROLES.find((item) => item.id === role);

  return (
    <AuthLayout title="Welcome back" mode={role}>
      <div className="space-y-6 animate-auth-in">

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
            <FiZap />
            Secure account access
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Sign in to your workspace
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Choose your account type and continue to RFQ Marketplace.
          </p>
        </div>

        {/* Account role selection */}
        <div>
          <div className="mb-3 flex items-center justify-between gap-2">
            <label className="text-sm font-bold text-slate-800">
              Select account type
            </label>
            <span className="text-[11px] text-slate-400">
              Required
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {ROLES.map((item) => {
              const selected = role === item.id;

              const colorClasses = {
                blue: selected
                  ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                  : "border-slate-200 hover:border-blue-300",
                emerald: selected
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100"
                  : "border-slate-200 hover:border-emerald-300",
                violet: selected
                  ? "border-violet-500 bg-violet-50 text-violet-700 ring-2 ring-violet-100"
                  : "border-slate-200 hover:border-violet-300",
              };

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectRole(item.id)}
                  aria-pressed={selected}
                  className={`
                    group relative flex min-h-[112px] flex-col
                    items-start rounded-2xl border p-3 text-left
                    transition-all duration-300
                    hover:-translate-y-1 hover:shadow-lg
                    active:scale-[0.98]
                    ${colorClasses[item.color]}
                  `}
                >
                  {selected && (
                    <FiCheckCircle
                      className="absolute right-3 top-3"
                      size={17}
                    />
                  )}

                  <span className={`
                    mb-3 flex h-10 w-10 items-center justify-center
                    rounded-xl bg-white shadow-sm transition-transform
                    duration-300 group-hover:scale-110
                    ${selected ? "scale-105" : "text-slate-500"}
                  `}>
                    {item.icon}
                  </span>

                  <span className="text-sm font-extrabold">
                    {item.title}
                  </span>

                  <span className="mt-1 text-[10px] leading-4 text-slate-500">
                    {item.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login form */}
        <form onSubmit={submit} className="space-y-5">
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            autoComplete="username"
            required
          />

          <div className="space-y-2">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />

            <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-500">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(event) => setShowPassword(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 accent-blue-600"
              />
              Show password
            </label>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600">
              <FiLock size={17} />
            </span>

            <div>
              <p className="text-xs font-bold text-slate-800">
                Protected sign in
              </p>
              <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
                Your account is protected by automatic security verification.
              </p>
            </div>
          </div>

          <Captcha
            ref={captchaRef}
            onVerified={handleVerifiedToken}
            onError={(message) => {
              setSubmitting(false);
              notify(message, "error");
            }}
          />

          <Button
            type="submit"
            loading={loading || submitting}
            disabled={loading || submitting}
          >
            <span className="flex items-center justify-center gap-2">
              {submitting
                ? "Verifying securely..."
                : `Continue as ${activeRole?.title || "User"}`}
              {!loading && !submitting && <FiArrowRight size={17} />}
            </span>
          </Button>
        </form>

        {role === "ADMIN" ? (
          <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
            <div className="flex gap-3">
              <FiShield className="mt-0.5 shrink-0 text-violet-600" size={19} />
              <div>
                <p className="text-sm font-bold text-violet-900">
                  Restricted administrator access
                </p>
                <p className="mt-1 text-xs leading-5 text-violet-700">
                  Only accounts with the ADMIN role can access the administration workspace.
                  Public registration does not create admin accounts.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account yet?
            </p>
            <Link
              to="/register"
              className="mt-2 inline-flex items-center gap-2 text-sm font-extrabold text-blue-600 transition hover:gap-3 hover:text-blue-700"
            >
              Create your account <FiArrowRight />
            </Link>
          </div>
        )}

        <p className="text-center text-[11px] text-slate-400">
          By continuing, you agree to use RFQ Marketplace responsibly.
        </p>
      </div>
    </AuthLayout>
  );
}

/* Shared authentication layout */

export function AuthLayout({ title, children, mode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">
      <style>{`
        @keyframes authEnter {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes authFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes authPulse {
          0%, 100% { opacity: .35; transform: scale(1); }
          50% { opacity: .65; transform: scale(1.08); }
        }
        .animate-auth-in { animation: authEnter .55s ease-out both; }
        .auth-float { animation: authFloat 6s ease-in-out infinite; }
        .auth-pulse { animation: authPulse 7s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-auth-in, .auth-float, .auth-pulse {
            animation: none !important;
          }
        }
      `}</style>

      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.05fr)_minmax(480px,.95fr)]">

        {/* Left visual panel */}
        <aside className="relative hidden overflow-hidden bg-[#07152d] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl auth-pulse" />
          <div className="pointer-events-none absolute -bottom-28 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl auth-pulse" />

          <Link to="/" className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black shadow-xl shadow-blue-900/40">
              R
            </div>
            <div>
              <p className="text-lg font-extrabold tracking-tight">
                RFQ Marketplace
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[.24em] text-blue-300">
                B2B Procurement Platform
              </p>
            </div>
          </Link>

          <div className="relative z-10 my-12 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-bold text-blue-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              SMARTER BUSINESS CONNECTIONS
            </span>

            <h1 className="mt-7 text-4xl font-black leading-[1.12] tracking-tight xl:text-6xl">
              Procurement made
              <span className="block bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                simpler and smarter.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-slate-300">
              Connect buyers and suppliers, manage requests for quotations,
              compare offers and build stronger business relationships.
            </p>

            <div className="mt-10 grid max-w-xl grid-cols-2 gap-3">
              <Feature
                icon={<FiShoppingBag />}
                title="For Buyers"
                description="Create requirements and compare offers."
              />
              <Feature
                icon={<FiTruck />}
                title="For Suppliers"
                description="Discover opportunities and submit quotes."
              />
              <Feature
                icon={<FiShield />}
                title="Secure Access"
                description="Role-based authentication and protection."
              />
              <Feature
                icon={<FiZap />}
                title="One Workspace"
                description="Keep procurement workflows organized."
              />
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs text-slate-400">
            <span>© {new Date().getFullYear()} RFQ Marketplace</span>
            <span>Built for better business</span>
          </div>

          <div className="pointer-events-none absolute right-12 top-[34%] h-28 w-28 rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm auth-float" />
          <div className="pointer-events-none absolute bottom-[23%] right-[25%] h-14 w-14 rounded-2xl border border-blue-300/20 bg-blue-400/10 auth-float" />
        </aside>

        {/* Right form panel */}
        <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 lg:px-10 xl:px-14">
          <div className="w-full max-w-[540px]">

            <div className="mb-7 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-black text-white shadow-lg shadow-blue-600/20">
                R
              </div>
              <div>
                <p className="font-extrabold text-slate-900">
                  RFQ Marketplace
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                  B2B Procurement
                </p>
              </div>
            </div>

            <div className="mb-6">
              <Link
                to="/"
                className="text-xs font-bold text-slate-400 transition hover:text-blue-600"
              >
                ← Back to home
              </Link>

              <div className="mt-6">
                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.16em] text-blue-700">
                  {mode === "ADMIN" ? "Administrator access" : "Procurement workspace"}
                </span>
                <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                  {title}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Access your account securely and continue your work.
                </p>
              </div>
            </div>

            <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_24px_80px_-35px_rgba(15,23,42,.25)] sm:p-8">
              {children}
            </section>

            <p className="mt-6 text-center text-[11px] text-slate-400">
              RFQ Marketplace · Secure B2B procurement
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/[0.09]">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300">
        {icon}
      </div>
      <p className="text-xs font-extrabold text-white">{title}</p>
      <p className="mt-1 text-[11px] leading-5 text-slate-400">{description}</p>
    </div>
  );
}
