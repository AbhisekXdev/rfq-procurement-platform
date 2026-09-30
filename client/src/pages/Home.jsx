import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Globe2,
  Menu,
  Package,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const dashboardPath =
    user?.role === "ADMIN"
      ? "/admin"
      : user?.role === "SUPPLIER"
        ? "/supplier"
        : "/buyer";

  const handleDashboard = () => {
    setMobileMenuOpen(false);
    navigate(dashboardPath);
  };

  const handleLogin = () => {
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const handleRegister = () => {
    setMobileMenuOpen(false);
    navigate("/register");
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 text-slate-900">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1800px] items-center justify-between px-4 sm:px-6 lg:px-8 2xl:px-12">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex min-w-0 items-center gap-2"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <ShoppingCart size={19} />
            </div>

            <div className="min-w-0">
              <div className="truncate text-sm font-extrabold tracking-tight sm:text-base">
                RFQ Marketplace
              </div>
              <div className="hidden text-[10px] font-medium text-slate-500 sm:block cursor-pointer">
               <navigate to="/"> B2B Procurement Platform</navigate>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            <a
              href="#features"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              How it works
            </a>

            <a
              href="#benefits"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Benefits
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <button
                type="button"
                onClick={handleDashboard}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Dashboard
                <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleLogin}
                  className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={handleRegister}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Get Started
                  <ArrowRight size={16} />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 md:hidden"
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white md:hidden">
            <div className="mx-auto w-full max-w-[1800px] space-y-1 px-4 py-4 sm:px-6">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Features
              </a>

              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                How it works
              </a>

              <a
                href="#benefits"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Benefits
              </a>

              <div className="mt-3 grid grid-cols-1 gap-2 border-t border-slate-100 pt-3">
                {user ? (
                  <button
                    type="button"
                    onClick={handleDashboard}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white"
                  >
                    Dashboard
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleLogin}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700"
                    >
                      Login
                    </button>

                    <button
                      type="button"
                      onClick={handleRegister}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white"
                    >
                      Get Started
                      <ArrowRight size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />

          <div className="mx-auto grid w-full max-w-[1800px] items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-24 2xl:px-12 2xl:py-32">
            {/* Hero Content */}
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 sm:text-sm">
                <Zap size={14} />
                <span className="truncate">
                  Smarter B2B Procurement
                </span>
              </div>

              <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl xl:text-7xl">
                Connect Buyers & Suppliers
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Faster & Smarter.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 lg:text-xl">
                A modern B2B procurement platform that helps businesses
                create RFQs, receive competitive quotations, compare
                suppliers, and manage procurement from one place.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {user ? (
                  <button
                    type="button"
                    onClick={handleDashboard}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-700 sm:w-auto"
                  >
                    Open Dashboard
                    <ArrowRight size={18} />
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleRegister}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-700 sm:w-auto"
                    >
                      Start Procurement
                      <ArrowRight size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={handleLogin}
                      className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>

              {/* Trust Points */}
              <div className="mt-8 grid grid-cols-1 gap-3 text-sm text-slate-600 min-[420px]:grid-cols-2">
                {[
                  "Verified business users",
                  "Competitive quotations",
                  "Secure procurement",
                  "Real-time communication",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2
                      size={17}
                      className="shrink-0 text-emerald-600"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
              <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/10 sm:p-5">
                <div className="rounded-2xl bg-slate-950 p-4 sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Procurement Overview
                      </p>
                      <p className="mt-1 text-lg font-bold text-white sm:text-xl">
                        Business Dashboard
                      </p>
                    </div>

                    <div className="rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-400">
                      Live
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      ["24", "Open RFQs"],
                      ["128", "Suppliers"],
                      ["56", "Quotations"],
                      ["₹8.4L", "Savings"],
                    ].map(([value, label]) => (
                      <div
                        key={label}
                        className="min-w-0 rounded-xl bg-white/5 p-3"
                      >
                        <p className="truncate text-lg font-black text-white sm:text-xl">
                          {value}
                        </p>
                        <p className="mt-1 truncate text-[10px] text-slate-400 sm:text-xs">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 space-y-3">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-xl bg-white/5 p-3"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                          <Package size={17} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="h-2 w-2/3 rounded-full bg-white/20" />
                          <div className="mt-2 h-2 w-1/2 rounded-full bg-white/10" />
                        </div>

                        <div className="h-7 w-14 shrink-0 rounded-lg bg-emerald-500/10" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section
          id="features"
          className="scroll-mt-20 bg-white py-16 sm:py-20 lg:py-24"
        >
          <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 2xl:px-12">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                Platform Features
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Everything you need for modern procurement
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
                Manage the complete RFQ and quotation lifecycle through a
                single procurement platform.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {[
                {
                  icon: ShoppingCart,
                  title: "RFQ Management",
                  text: "Create and manage procurement requests efficiently.",
                },
                {
                  icon: Users,
                  title: "Supplier Network",
                  text: "Connect with verified suppliers and businesses.",
                },
                {
                  icon: BarChart3,
                  title: "Quotation Comparison",
                  text: "Compare supplier quotations in one place.",
                },
                {
                  icon: ShieldCheck,
                  title: "Secure Platform",
                  text: "Role-based access and secure authentication.",
                },
                {
                  icon: Truck,
                  title: "Order Management",
                  text: "Move from quotation to procurement smoothly.",
                },
                {
                  icon: Globe2,
                  title: "Business Network",
                  text: "Build long-term B2B supplier relationships.",
                },
              ].map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 text-base font-extrabold text-slate-950">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
       <section
  id="how-it-works"
  className="scroll-mt-20 bg-slate-50 py-16 sm:py-20 lg:py-24"
>
  <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 2xl:px-12">

    {/* Section Header */}
    <div className="mx-auto max-w-3xl text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-blue-700">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
        How It Works
      </div>

      <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
        Procurement made
        <span className="text-blue-600"> simple</span>
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
        From creating an RFQ to receiving supplier quotations,
        manage your procurement workflow in a few simple steps.
      </p>
    </div>

    {/* Steps */}
    <div className="relative mx-auto mt-12 max-w-6xl lg:mt-16">

      {/* Connecting line - desktop */}
      <div className="absolute left-[16.66%] right-[16.66%] top-10 hidden h-px bg-gradient-to-r from-blue-200 via-indigo-300 to-blue-200 md:block" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
        {[
          {
            number: "01",
            title: "Create an RFQ",
            text: "Publish your requirements, quantities, specifications and deadlines.",
          },
          {
            number: "02",
            title: "Receive Quotations",
            text: "Suppliers review your RFQ and submit competitive quotations.",
          },
          {
            number: "03",
            title: "Compare & Procure",
            text: "Compare offers and continue with the supplier that meets your requirements.",
          },
        ].map((step, index) => (
          <div key={step.number} className="group relative">

            {/* Step number */}
            <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-100 bg-white shadow-lg shadow-blue-900/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-blue-200 group-hover:shadow-xl group-hover:shadow-blue-900/10">
              <span className="text-2xl font-black text-blue-600">
                {step.number}
              </span>
            </div>

            {/* Card */}
            <div className="mt-5 h-full rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-blue-200 group-hover:shadow-xl group-hover:shadow-slate-900/5 sm:p-7">

              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-sm font-black text-blue-600">
                {index + 1}
              </div>

              <h3 className="mt-5 text-lg font-black text-slate-950 sm:text-xl">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {step.text}
              </p>

              {/* Bottom indicator */}
              <div className="mx-auto mt-6 h-1 w-10 rounded-full bg-blue-100 transition-all duration-300 group-hover:w-16 group-hover:bg-blue-600" />
            </div>

            {/* Mobile connector */}
            {index < 2 && (
              <div className="mx-auto my-1 h-6 w-px bg-blue-200 md:hidden" />
            )}

          </div>
        ))}
      </div>
    </div>

    {/* Bottom message */}
    <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center justify-center gap-3 text-center sm:mt-14 sm:flex-row">
      <div className="flex -space-x-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-xs font-bold text-blue-700">
          B
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-indigo-100 text-xs font-bold text-indigo-700">
          S
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-violet-100 text-xs font-bold text-violet-700">
          +
        </div>
      </div>

      <p className="text-sm font-medium text-slate-600">
        One structured workflow for{" "}
        <span className="font-bold text-slate-900">
          buyers and suppliers
        </span>
      </p>
    </div>

  </div>
</section>

        {/* BENEFITS */}
       <section
  id="benefits"
  className="scroll-mt-20 overflow-hidden bg-slate-50 py-16 sm:py-20 lg:py-28"
>
  <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 2xl:px-12">
    
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

      {/* LEFT CONTENT */}
      <div>
        <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-700">
            Built for B2B
          </span>
        </div>

        <h2 className="mt-5 max-w-3xl text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl xl:text-6xl">
          A smarter way to manage
          <span className="block text-blue-600">
            business procurement
          </span>
        </h2>

        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          Reduce manual communication, organize supplier quotations,
          and manage your entire procurement workflow from one
          centralized platform.
        </p>

        {/* Benefits */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Centralized workflow",
              text: "Manage RFQs and quotations in one place.",
            },
            {
              title: "Better communication",
              text: "Connect buyers and suppliers efficiently.",
            },
            {
              title: "Secure access",
              text: "Role-based dashboards keep data organized.",
            },
            {
              title: "Scalable platform",
              text: "Built for growing procurement teams.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <CheckCircle2 size={18} />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {item.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT CTA CARD */}
      {/* RIGHT CTA CARD */}
<div className="relative w-full">
  {/* Soft glow */}
  <div className="absolute -inset-3 rounded-[2rem] bg-blue-500/20 blur-3xl" />

  <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl shadow-slate-900/20">

    {/* Gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-violet-800 opacity-95" />

    {/* Decorative gradient */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.18),transparent_35%)]" />

    {/* Decorative circles */}
    <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-white/10 bg-white/5 blur-sm transition duration-700 group-hover:scale-110" />
    <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full border border-white/10 bg-indigo-400/10" />

    {/* Grid pattern */}
    <div
      className="absolute inset-0 opacity-[0.08]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />

    <div className="relative p-6 sm:p-8 lg:p-10 xl:p-12">

      {/* Top badge */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-md">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          B2B PROCUREMENT PLATFORM
        </div>

        <div className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white/80 sm:flex">
          <ArrowRight size={18} />
        </div>
      </div>

      {/* Icon */}
      <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-md sm:h-[68px] sm:w-[68px]">
        <BarChart3
          size={30}
          className="text-white"
          strokeWidth={2}
        />
      </div>

      {/* Heading */}
      <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-blue-200">
        RFQ Marketplace
      </p>

      <h3 className="mt-3 max-w-xl text-3xl font-black leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-[2.65rem]">
        Ready to simplify
        <span className="block text-blue-200">
          your procurement?
        </span>
      </h3>

      {/* Description */}
      <p className="mt-5 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
        Connect buyers and suppliers through a structured,
        transparent and modern procurement workflow designed
        for growing businesses.
      </p>

      {/* CTA */}
      <button
        type="button"
        onClick={user ? handleDashboard : handleRegister}
        className="group/btn mt-8 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 text-sm font-black text-blue-700 shadow-xl shadow-blue-950/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-2xl sm:w-auto"
      >
        <span>
          {user ? "Go to Dashboard" : "Create Account"}
        </span>

        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 transition-transform duration-300 group-hover/btn:translate-x-1">
          <ArrowRight
            size={16}
            className="text-blue-700"
          />
        </span>
      </button>

      {/* Trust / Features */}
      <div className="mt-8 border-t border-white/15 pt-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-blue-200">
          Everything you need
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/15">
              <CheckCircle2
                size={16}
                className="text-emerald-300"
              />
            </div>

            <span className="text-xs font-semibold text-white">
              Buyer & Supplier
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/15">
              <CheckCircle2
                size={16}
                className="text-cyan-300"
              />
            </div>

            <span className="text-xs font-semibold text-white">
              Secure Access
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-400/15">
              <CheckCircle2
                size={16}
                className="text-violet-300"
              />
            </div>

            <span className="text-xs font-semibold text-white">
              Real-time Workflow
            </span>
          </div>

        </div>
      </div>

      {/* Bottom stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/10 bg-black/10 p-3 text-center">
          <p className="text-lg font-black text-white">RFQ</p>
          <p className="mt-0.5 text-[10px] text-blue-200">
            Management
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/10 p-3 text-center">
          <p className="text-lg font-black text-white">24/7</p>
          <p className="mt-0.5 text-[10px] text-blue-200">
            Access
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/10 p-3 text-center">
          <p className="text-lg font-black text-white">Live</p>
          <p className="mt-0.5 text-[10px] text-blue-200">
            Communication
          </p>
        </div>
      </div>

    </div>
  </div>
</div>

    </div>
  </div>
</section>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 text-white">
  <div className="mx-auto w-full max-w-[1800px] px-4 py-10 sm:px-6 lg:px-8 2xl:px-12">
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

      {/* Brand */}
      <div className="sm:col-span-2 lg:col-span-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-black text-slate-950 shadow-lg">
            R
          </div>

          <div>
            <h3 className="text-base font-extrabold tracking-tight">
              RFQ Marketplace
            </h3>
            <p className="text-xs text-slate-400">
              B2B Procurement Platform
            </p>
          </div>
        </div>

        <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
          Connect buyers and suppliers through a simple, secure and
          professional procurement workflow.
        </p>
      </div>

      {/* Platform */}
      <div>
        <h4 className="mb-4 text-sm font-bold text-white">
          Platform
        </h4>

        <div className="flex flex-col gap-3 text-sm text-slate-400">
          <a
            href="#features"
            className="w-fit transition hover:translate-x-1 hover:text-white"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="w-fit transition hover:translate-x-1 hover:text-white"
          >
            How it works
          </a>

          <a
            href="#benefits"
            className="w-fit transition hover:translate-x-1 hover:text-white"
          >
            Benefits
          </a>
        </div>
      </div>

      {/* Support */}
      <div>
        <h4 className="mb-4 text-sm font-bold text-white">
          Support
        </h4>

        <div className="space-y-3 text-sm">
          <a
            href="mailto:codepilot.devteam@gmail.com"
            className="block break-all text-slate-400 transition hover:text-white"
          >
            codepilot.devteam@gmail.com
          </a>

          <a
            href="tel:9398316147"
            className="block text-slate-400 transition hover:text-white"
          >
            +91 93983 16147
          </a>
        </div>
      </div>

      {/* Developer */}
      <div>
        <h4 className="mb-4 text-sm font-bold text-white">
          Developer
        </h4>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-sm font-bold text-white">
            Abhisek
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Full Stack Developer
          </p>

          <a
            href="mailto:codepilot.devteam@gmail.com"
            className="mt-3 inline-flex text-xs font-semibold text-slate-300 transition hover:text-white"
          >
            Contact Developer →
          </a>
        </div>
      </div>
    </div>

    {/* Bottom */}
    <div className="mt-10 flex flex-col gap-4 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-center text-xs text-slate-500 sm:text-left">
        © {new Date().getFullYear()} RFQ Marketplace. All rights reserved.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 sm:justify-end">
        <span>Built for modern procurement</span>

        <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />

        <span>
          Developed by <strong className="text-slate-300">Abhisek</strong>
        </span>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
}