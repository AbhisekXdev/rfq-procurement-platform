import React, { useEffect, useState } from "react";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { Link } from "react-router-dom";
import api, { getErrorMessage } from "../../lib/api.js";
import { useToast } from "../../context/ToastContext.jsx";
import {
  FiUsers,
  FiFileText,
  FiBriefcase,
  FiActivity,
  FiUserCheck,
  FiChevronRight,
  FiMessageCircle,
  FiShield,
} from "react-icons/fi";

export default function AdminDashboard() {
  const { notify } = useToast();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then(({ data }) => setStats(data.data))
      .catch((error) =>
        notify(
          getErrorMessage(error, "Failed to load admin dashboard"),
          "error"
        )
      )
      .finally(() => setLoading(false));
  }, [notify]);

  const cards = [
    {
      label: "Total users",
      value: loading ? "…" : (stats?.totalUsers ?? "—"),
      icon: FiUsers,
      description: "Registered platform users",
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active RFQs",
      value: loading ? "…" : (stats?.openRFQs ?? "—"),
      icon: FiFileText,
      description: "Currently open requirements",
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Quotations",
      value: loading ? "…" : (stats?.totalQuotations ?? "—"),
      icon: FiBriefcase,
      description: "Submitted supplier offers",
      iconStyle: "bg-purple-50 text-purple-600",
    },
    {
      label: "Active users",
      value: loading ? "…" : (stats?.activeUsers ?? "—"),
      icon: FiUserCheck,
      description: "Currently active accounts",
      iconStyle: "bg-amber-50 text-amber-600",
    },
  ];

  const quickActions = [
    {
      to: "/admin/users",
      icon: FiUsers,
      title: "Manage users",
      description: "Activate accounts and manage user roles.",
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      to: "/admin/rfqs",
      icon: FiFileText,
      title: "Review RFQs",
      description: "Monitor buyer requirements and RFQ activity.",
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
    {
      to: "/admin/quotations",
      icon: FiBriefcase,
      title: "Review quotations",
      description: "Inspect submitted commercial offers.",
      iconStyle: "bg-purple-50 text-purple-600",
    },
    {
      to: "/chat",
      icon: FiMessageCircle,
      title: "Messages",
      description: "Open persistent realtime conversations.",
      iconStyle: "bg-orange-50 text-orange-600",
    },
  ];

  const systemHealth = [
    ["API", "Ready"],
    ["Registration OTP", "Email"],
    ["Socket.IO", "Realtime"],
    ["Database", "Aiven"],
  ];

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">

      {/* HEADER */}
      <div className="flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="min-w-0">
          <div className="mb-2">
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold tracking-wider text-blue-600">
              ADMINISTRATION
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Platform overview
          </h1>

          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Live marketplace metrics from the admin API.
          </p>
        </div>

        <div className="shrink-0">
          <Badge tone="success">ADMIN MODE</Badge>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {cards.map(
          ({
            label,
            value,
            icon: Icon,
            description,
            iconStyle,
          }) => (
            <Card
              key={label}
              className="group min-w-0"
            >
              <div className="flex min-w-0 items-start justify-between gap-4">

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-500">
                    {label}
                  </p>

                  <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {value}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-400">
                    {description}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

              </div>
            </Card>
          )
        )}

      </div>

      {/* MAIN GRID */}
      <div className="grid w-full min-w-0 grid-cols-1 gap-5 xl:grid-cols-3">

        {/* ADMINISTRATION */}
        <Card
          title="Administration"
          className="min-w-0 xl:col-span-2"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            {quickActions.map(
              ({
                to,
                icon: Icon,
                title,
                description,
                iconStyle,
              }) => (
                <Link
                  key={to}
                  to={to}
                  className="
                    group
                    flex
                    min-w-0
                    items-center
                    gap-4
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-4
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-blue-200
                    hover:bg-blue-50/30
                    hover:shadow-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    focus:ring-offset-2
                  "
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="truncate text-sm font-bold text-slate-800">
                        {title}
                      </h4>

                      <FiChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
                    </div>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {description}
                    </p>
                  </div>
                </Link>
              )
            )}

          </div>
        </Card>

        {/* SYSTEM HEALTH */}
        <Card
          title="System health"
          className="min-w-0"
        >
          <div className="divide-y divide-slate-100">

            {systemHealth.map(([name, status]) => (
              <div
                key={name}
                className="flex min-w-0 items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex min-w-0 items-center gap-3">

                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>

                  <span className="truncate text-sm font-medium text-slate-700">
                    {name}
                  </span>

                </div>

                <Badge tone="success">
                  {status}
                </Badge>
              </div>
            ))}

          </div>
        </Card>

      </div>

      {/* SECURITY INFORMATION */}
      <Card className="min-w-0">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FiShield className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900">
              Administrator workspace
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
              Manage platform users, RFQs, quotations and realtime
              communication from the administration workspace.
            </p>
          </div>

          <div className="sm:ml-auto">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600">
              <FiActivity className="h-4 w-4" />
              Platform operational
            </div>
          </div>

        </div>
      </Card>

    </div>
  );
}