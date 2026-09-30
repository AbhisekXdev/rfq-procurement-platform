import React from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiBarChart2,
  FiCheckCircle,
  FiFileText,
  FiMessageCircle,
  FiPlus,
  FiUser,
  FiTrendingUp,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();

  const buyer = user?.role === "BUYER";
  const supplier = user?.role === "SUPPLIER";

  const stats = buyer
    ? [
        {
          label: "Open RFQs",
          value: "0",
          icon: FiFileText,
          description: "Active requirements",
        },
        {
          label: "Quotations",
          value: "0",
          icon: FiBarChart2,
          description: "Responses received",
        },
        {
          label: "Conversations",
          value: "0",
          icon: FiMessageCircle,
          description: "Active chats",
        },
        {
          label: "Awards",
          value: "0",
          icon: FiCheckCircle,
          description: "Successful awards",
        },
      ]
    : [
        {
          label: "Available RFQs",
          value: "0",
          icon: FiFileText,
          description: "Open opportunities",
        },
        {
          label: "My Quotations",
          value: "0",
          icon: FiBarChart2,
          description: "Submitted bids",
        },
        {
          label: "Conversations",
          value: "0",
          icon: FiMessageCircle,
          description: "Active chats",
        },
        {
          label: "Accepted Bids",
          value: "0",
          icon: FiCheckCircle,
          description: "Successful bids",
        },
      ];

  const quickActions = buyer
    ? [
        {
          title: "Publish requirement",
          description: "Create a new RFQ for suppliers.",
          icon: FiPlus,
          to: "/rfqs/new",
        },
        {
          title: "Review RFQs",
          description: "Track your open and awarded requests.",
          icon: FiFileText,
          to: "/rfqs",
        },
        {
          title: "Compare quotations",
          description: "Review supplier responses.",
          icon: FiBarChart2,
          to: "/quotations",
        },
        {
          title: "Open messages",
          description: "Continue supplier conversations.",
          icon: FiMessageCircle,
          to: "/chat",
        },
      ]
    : [
        {
          title: "Browse requirements",
          description: "Find new procurement opportunities.",
          icon: FiFileText,
          to: "/rfqs",
        },
        {
          title: "My quotations",
          description: "Track every submitted quotation.",
          icon: FiBarChart2,
          to: "/quotations",
        },
        {
          title: "Messages",
          description: "Chat with buyers in real time.",
          icon: FiMessageCircle,
          to: "/chat",
        },
        {
          title: "Company profile",
          description: "Keep your account information updated.",
          icon: FiUser,
          to: "/profile",
        },
      ];

  return (
    <div className="min-h-full w-full bg-slate-50 px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-[1600px]">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600 sm:text-xs">
              Workspace
            </div>

            <h1 className="break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Good to see you,{" "}
              <span className="text-indigo-600">
                {user?.name?.split(" ")[0] || "User"}
              </span>
              .
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Manage your procurement activity, quotations and conversations
              from one place.
            </p>
          </div>

          {buyer && (
            <Link
              to="/rfqs/new"
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98] sm:w-auto"
            >
              <FiPlus className="text-lg" />
              Create RFQ
            </Link>
          )}
        </div>

        {/* STATS */}
        <div className="mb-6 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-slate-500 sm:text-sm">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                      {stat.value}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-400">
                      {stat.description}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-100">
                    <Icon className="text-lg" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.8fr)]">

          {/* QUICK ACTIONS */}
          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                    Quick actions
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Frequently used workspace actions
                  </p>
                </div>

                <FiTrendingUp className="hidden text-lg text-indigo-500 sm:block" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.title}
                    to={action.to}
                    className="group flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-indigo-100 group-hover:text-indigo-600">
                      <Icon className="text-lg" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="truncate text-sm font-semibold text-slate-900">
                          {action.title}
                        </h3>

                        <FiArrowRight className="shrink-0 text-sm text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600" />
                      </div>

                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                        {action.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ACCOUNT STATUS */}
          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                Account status
              </h2>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Your account and workspace information
              </p>
            </div>

            <div className="p-4 sm:p-6">
              {/* VERIFIED */}
              <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <FiCheckCircle className="text-lg" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-emerald-900">
                    Email verified
                  </h3>

                  <p className="mt-1 break-words text-xs leading-5 text-emerald-700">
                    Your {user?.role?.toLowerCase() || "user"} workspace is
                    active.
                  </p>
                </div>
              </div>

              {/* ACCOUNT DETAILS */}
              <div className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200">
                <div className="flex flex-col gap-1 px-4 py-3 min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between">
                  <span className="text-xs text-slate-500">Account type</span>

                  <span className="break-words text-xs font-semibold text-slate-900">
                    {user?.role || "—"}
                  </span>
                </div>

                <div className="flex flex-col gap-1 px-4 py-3 min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between">
                  <span className="text-xs text-slate-500">Email</span>

                  <span className="break-all text-xs font-medium text-slate-900 min-[400px]:text-right">
                    {user?.email || "—"}
                  </span>
                </div>

                <div className="flex flex-col gap-1 px-4 py-3 min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between">
                  <span className="text-xs text-slate-500">Realtime</span>

                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Available
                  </span>
                </div>
              </div>

              {/* PROFILE BUTTON */}
              <Link
                to="/profile"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <FiUser />
                View profile
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}