import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiPlus,
  FiEye,
  FiRefreshCw,
  FiFileText,
  FiMapPin,
  FiCalendar,
  FiPackage,
  FiDollarSign,
  FiFilter,
  FiChevronDown,
} from "react-icons/fi";

import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import api, { getErrorMessage } from "../../lib/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export default function RFQList() {
  const { user } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    try {
      const { data } = await api.get(
        user?.role === "BUYER" ? "/rfqs/my" : "/rfqs"
      );

      setRows(data.rfqs || []);
    } catch (error) {
      notify(
        getErrorMessage(error, "Failed to load RFQs"),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role) {
      load();
    }
  }, [user?.role]);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();

    return rows.filter((item) => {
      const text = `
        ${item.productName || ""}
        ${item.category || ""}
        ${item.deliveryLocation || ""}
        ${item.description || ""}
      `.toLowerCase();

      const matchesSearch = text.includes(search);

      const matchesStatus =
        status === "ALL" || item.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [rows, query, status]);

  const openRFQs = rows.filter(
    (item) => item.status === "OPEN"
  ).length;

  const closedRFQs = rows.filter(
    (item) => item.status === "CLOSED"
  ).length;

  return (
    <div className="min-h-full w-full bg-slate-50 px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-[1600px]">

        {/* ================= HEADER ================= */}
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
              <FiFileText size={14} />
              Procurement
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {user?.role === "BUYER"
                ? "My RFQs"
                : "Browse RFQs"}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              {user?.role === "BUYER"
                ? "Manage your procurement requirements and monitor supplier responses."
                : "Discover active procurement requirements and submit competitive quotations."}
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">

            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiRefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            {user?.role === "BUYER" && (
              <Link
                to="/rfqs/new"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
              >
                <FiPlus size={17} />
                Create RFQ
              </Link>
            )}
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">

          <StatCard
            icon={<FiFileText />}
            label="Total RFQs"
            value={rows.length}
          />

          <StatCard
            icon={<FiPackage />}
            label="Open RFQs"
            value={openRFQs}
            positive
          />

          <StatCard
            icon={<FiCheckIcon />}
            label="Closed RFQs"
            value={closedRFQs}
          />
        </div>

        {/* ================= MAIN CARD ================= */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Toolbar */}
          <div className="border-b border-slate-200 bg-white p-4 sm:p-5 lg:p-6">

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

              {/* Search */}
              <div className="relative w-full lg:max-w-xl">
                <FiSearch
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, categories or locations..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Filter */}
              <div className="relative w-full lg:w-52">
                <FiFilter
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="ALL">
                    All statuses
                  </option>
                  <option value="OPEN">OPEN</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="AWARDED">AWARDED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>

                <FiChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            {/* Result information */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>
                Showing{" "}
                <strong className="text-slate-700">
                  {filtered.length}
                </strong>{" "}
                of{" "}
                <strong className="text-slate-700">
                  {rows.length}
                </strong>{" "}
                RFQs
              </span>

              {(query || status !== "ALL") && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setStatus("ALL");
                  }}
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* ================= MOBILE CARDS ================= */}
          <div className="block divide-y divide-slate-100 md:hidden">

            {loading ? (
              <MobileLoading />
            ) : filtered.length === 0 ? (
              <EmptyState />
            ) : (
              filtered.map((item) => (
                <MobileRFQCard
                  key={item.id}
                  item={item}
                  navigate={navigate}
                />
              ))
            )}
          </div>

          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden overflow-x-auto md:block">

            <table className="w-full min-w-[900px] border-collapse">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-left">
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Requirement
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Quantity
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Location
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Deadline
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Budget
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {loading ? (
                  <DesktopLoading />
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7">
                      <EmptyState />
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <DesktopRFQRow
                      key={item.id}
                      item={item}
                      navigate={navigate}
                    />
                  ))
                )}

              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  label,
  value,
  positive = false,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center gap-4">

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            positive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DESKTOP ROW
========================================================= */

function DesktopRFQRow({
  item,
  navigate,
}) {
  return (
    <tr className="group transition hover:bg-slate-50">

      {/* Requirement */}
      <td className="px-5 py-4">
        <div className="flex max-w-[280px] items-start gap-3">

          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <FiPackage size={16} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">
              {item.productName}
            </p>

            <p className="mt-1 truncate text-xs text-slate-500">
              {item.category || "Uncategorized"}
            </p>
          </div>
        </div>
      </td>

      {/* Quantity */}
      <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-700">
        {Number(item.quantity).toLocaleString()}
      </td>

      {/* Location */}
      <td className="px-5 py-4">
        <div className="flex max-w-[180px] items-center gap-2 text-sm text-slate-600">
          <FiMapPin
            size={15}
            className="shrink-0 text-slate-400"
          />

          <span className="truncate">
            {item.deliveryLocation}
          </span>
        </div>
      </td>

      {/* Deadline */}
      <td className="whitespace-nowrap px-5 py-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <FiCalendar
            size={15}
            className="text-slate-400"
          />

          {formatDate(item.deadline)}
        </div>
      </td>

      {/* Budget */}
      <td className="whitespace-nowrap px-5 py-4">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
          <FiDollarSign
            size={14}
            className="text-slate-400"
          />

          {item.budget
            ? `${item.currency || "INR"} ${Number(
                item.budget
              ).toLocaleString()}`
            : "—"}
        </div>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <StatusBadge status={item.status} />
      </td>

      {/* Action */}
      <td className="px-5 py-4 text-right">
        <button
          type="button"
          onClick={() =>
            navigate(`/rfqs/${item.id}`)
          }
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          <FiEye size={15} />
          View
        </button>
      </td>
    </tr>
  );
}

/* =========================================================
   MOBILE CARD
========================================================= */

function MobileRFQCard({
  item,
  navigate,
}) {
  return (
    <article className="p-4 transition active:bg-slate-50">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">

        <div className="flex min-w-0 items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FiPackage size={18} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-900">
              {item.productName}
            </h3>

            <p className="mt-1 truncate text-xs text-slate-500">
              {item.category || "Uncategorized"}
            </p>
          </div>
        </div>

        <StatusBadge status={item.status} />
      </div>

      {/* Details */}
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">

        <MobileDetail
          icon={<FiPackage />}
          label="Quantity"
          value={Number(item.quantity).toLocaleString()}
        />

        <MobileDetail
          icon={<FiMapPin />}
          label="Location"
          value={item.deliveryLocation || "—"}
        />

        <MobileDetail
          icon={<FiCalendar />}
          label="Deadline"
          value={formatDate(item.deadline)}
        />

        <MobileDetail
          icon={<FiDollarSign />}
          label="Budget"
          value={
            item.budget
              ? `${item.currency || "INR"} ${Number(
                  item.budget
                ).toLocaleString()}`
              : "—"
          }
        />
      </div>

      {/* Action */}
      <button
        type="button"
        onClick={() =>
          navigate(`/rfqs/${item.id}`)
        }
        className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white transition hover:bg-blue-700 active:scale-[0.99]"
      >
        <FiEye size={16} />
        View RFQ
      </button>
    </article>
  );
}

/* =========================================================
   MOBILE DETAIL
========================================================= */

function MobileDetail({
  icon,
  label,
  value,
}) {
  return (
    <div className="min-w-0">

      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {icon}
        {label}
      </div>

      <p className="mt-1 truncate text-xs font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   STATUS
========================================================= */

function StatusBadge({
  status,
}) {
  const styles = {
    OPEN: "border-emerald-200 bg-emerald-50 text-emerald-700",
    CLOSED: "border-slate-200 bg-slate-100 text-slate-600",
    AWARDED: "border-blue-200 bg-blue-50 text-blue-700",
    CANCELLED: "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
        styles[status] ||
        "border-slate-200 bg-slate-100 text-slate-600"
      }`}
    >
      {status || "UNKNOWN"}
    </span>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState() {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center px-5 py-10 text-center">

      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <FiFileText size={25} />
      </div>

      <h3 className="text-sm font-bold text-slate-800">
        No RFQs found
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
        Try changing your search or status filter to find
        relevant procurement requirements.
      </p>
    </div>
  );
}

/* =========================================================
   LOADING
========================================================= */

function MobileLoading() {
  return (
    <div className="space-y-4 p-4">

      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-xl border border-slate-100 p-4"
        >
          <div className="flex gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-200" />

            <div className="flex-1">
              <div className="h-4 w-2/3 rounded bg-slate-200" />
              <div className="mt-2 h-3 w-1/3 rounded bg-slate-200" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="h-10 rounded bg-slate-100" />
            <div className="h-10 rounded bg-slate-100" />
            <div className="h-10 rounded bg-slate-100" />
            <div className="h-10 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function DesktopLoading() {
  return (
    <tr>
      <td colSpan="7">
        <div className="space-y-4 p-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-12 animate-pulse rounded-lg bg-slate-100"
            />
          ))}
        </div>
      </td>
    </tr>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function FiCheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}