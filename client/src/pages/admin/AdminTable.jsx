import React, { useEffect, useState } from "react";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import api, { getErrorMessage } from "../../lib/api.js";
import { useToast } from "../../context/ToastContext.jsx";
import {
  FiUsers,
  FiFileText,
  FiBriefcase,
  FiCheckCircle,
  FiXCircle,
  FiShield,
  FiRefreshCw,
} from "react-icons/fi";

/* =========================================================
   ADMIN USERS
========================================================= */

export function AdminUsers() {
  const { notify } = useToast();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    try {
      const { data } = await api.get("/admin/users");
      setRows(data.data || []);
    } catch (error) {
      notify(getErrorMessage(error, "Failed to load users"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, isActive) => {
    try {
      await api.patch(`/admin/users/${id}/status`, { isActive });

      notify("User status updated", "success");

      load();
    } catch (error) {
      notify(getErrorMessage(error), "error");
    }
  };

  const updateRole = async (id, role) => {
    try {
      await api.patch(`/admin/users/${id}/role`, { role });

      notify("User role updated", "success");

      load();
    } catch (error) {
      notify(getErrorMessage(error), "error");
    }
  };

  return (
    <AdminPage
      title="Users"
      eyebrow="ADMIN · USERS"
      description="Manage marketplace accounts and roles."
    >
      {/* Desktop / Tablet table */}
      <div className="hidden md:block">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <TableHeader>User</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Verified</TableHeader>
                <TableHeader>Created</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <LoadingRow colSpan={6} text="Loading users..." />
              ) : rows.length === 0 ? (
                <EmptyRow colSpan={6} text="No users found." />
              ) : (
                rows.map((u) => (
                  <tr
                    key={u.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={u.name} />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {u.name}
                          </p>

                          <p className="max-w-[220px] truncate text-xs text-slate-500">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <RoleSelect
                        value={u.role}
                        onChange={(value) =>
                          updateRole(u.id, value)
                        }
                      />
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge active={u.isActive} />
                    </td>

                    <td className="px-4 py-4">
                      {u.isEmailVerified ? (
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                          <FiCheckCircle />
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400">
                          <FiXCircle />
                          No
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-500">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-4 py-4">
                      <Button
                        variant="ghost"
                        onClick={() =>
                          updateStatus(u.id, !u.isActive)
                        }
                        className="whitespace-nowrap"
                      >
                        {u.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {loading ? (
          <MobileLoading />
        ) : rows.length === 0 ? (
          <MobileEmpty text="No users found." />
        ) : (
          rows.map((u) => (
            <div
              key={u.id}
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
              "
            >
              {/* User */}
              <div className="flex min-w-0 items-center gap-3">
                <UserAvatar name={u.name} />

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-slate-900">
                    {u.name}
                  </h3>

                  <p className="truncate text-xs text-slate-500">
                    {u.email}
                  </p>
                </div>

                <StatusBadge active={u.isActive} />
              </div>

              {/* Details */}
              <div className="mt-4 grid grid-cols-2 gap-3">

                <MobileInfo
                  label="Role"
                  value={
                    <RoleSelect
                      value={u.role}
                      onChange={(value) =>
                        updateRole(u.id, value)
                      }
                    />
                  }
                />

                <MobileInfo
                  label="Verified"
                  value={
                    u.isEmailVerified ? (
                      <span className="text-xs font-semibold text-emerald-600">
                        Verified
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400">
                        Not verified
                      </span>
                    )
                  }
                />

                <MobileInfo
                  label="Created"
                  value={
                    u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString()
                      : "—"
                  }
                />

                <MobileInfo
                  label="User ID"
                  value={`#${u.id}`}
                />
              </div>

              {/* Action */}
              <div className="mt-4 border-t border-slate-100 pt-3">
                <Button
                  variant="ghost"
                  onClick={() =>
                    updateStatus(u.id, !u.isActive)
                  }
                  className="w-full justify-center"
                >
                  {u.isActive
                    ? "Deactivate User"
                    : "Activate User"}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminPage>
  );
}

/* =========================================================
   ADMIN RFQS
========================================================= */

export function AdminRFQs() {
  return (
    <AdminDataTable
      endpoint="/rfqs"
      title="RFQs"
      eyebrow="ADMIN · RFQS"
      description="Review marketplace requirements."
      headers={[
        "Requirement",
        "Buyer",
        "Deadline",
        "Status",
        "Budget",
      ]}
      renderRow={(r) => (
        <tr
          key={r.id}
          className="border-b border-slate-100 transition hover:bg-slate-50"
        >
          <td className="px-4 py-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {r.productName}
              </p>

              <p className="mt-1 max-w-[280px] truncate text-xs text-slate-500">
                {r.description}
              </p>
            </div>
          </td>

          <td className="px-4 py-4 text-sm text-slate-600">
            {r.buyerId}
          </td>

          <td className="px-4 py-4 text-sm text-slate-600">
            {new Date(r.deadline).toLocaleDateString()}
          </td>

          <td className="px-4 py-4">
            <Badge
              tone={
                r.status === "OPEN"
                  ? "success"
                  : "neutral"
              }
            >
              {r.status}
            </Badge>
          </td>

          <td className="px-4 py-4">
            <strong className="text-sm text-slate-800">
              {r.currency} {r.budget || "—"}
            </strong>
          </td>
        </tr>
      )}
    />
  );
}

/* =========================================================
   ADMIN QUOTATIONS
========================================================= */

export function AdminQuotations() {
  const { notify } = useToast();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/rfqs");

        const sets = await Promise.all(
          (data.rfqs || []).map(async (r) => {
            try {
              const q = await api.get(
                `/quotations/rfq/${r.id}`
              );

              return (q.data.quotations || []).map(
                (x) => ({
                  ...x,
                  rfq: r,
                })
              );
            } catch {
              return [];
            }
          })
        );

        setRows(sets.flat());
      } catch (error) {
        notify(
          getErrorMessage(
            error,
            "Failed to load quotations"
          ),
          "error"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [notify]);

  return (
    <AdminPage
      title="Quotations"
      eyebrow="ADMIN · QUOTATIONS"
      description="Monitor commercial submissions."
    >
      {/* Desktop */}
      <div className="hidden md:block">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <TableHeader>RFQ</TableHeader>
                <TableHeader>Supplier</TableHeader>
                <TableHeader>Price</TableHeader>
                <TableHeader>Delivery</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Message</TableHeader>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <LoadingRow colSpan={6} text="Loading quotations..." />
              ) : rows.length === 0 ? (
                <EmptyRow
                  colSpan={6}
                  text="No quotations found."
                />
              ) : (
                rows.map((q) => (
                  <tr
                    key={q.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-4">
                      <strong className="text-sm text-slate-800">
                        {q.rfq?.productName ||
                          `RFQ-${q.rfqId}`}
                      </strong>
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-600">
                      {q.supplierId}
                    </td>

                    <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                      {q.rfq?.currency || "INR"} {q.price}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-600">
                      {q.estimatedDeliveryTime}
                    </td>

                    <td className="px-4 py-4">
                      <Badge
                        tone={
                          q.status === "ACCEPTED"
                            ? "success"
                            : "neutral"
                        }
                      >
                        {q.status}
                      </Badge>
                    </td>

                    <td className="max-w-[250px] px-4 py-4">
                      <p className="truncate text-sm text-slate-500">
                        {q.message || "—"}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile */}
      <div className="space-y-3 md:hidden">
        {loading ? (
          <MobileLoading />
        ) : rows.length === 0 ? (
          <MobileEmpty text="No quotations found." />
        ) : (
          rows.map((q) => (
            <div
              key={q.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    RFQ
                  </p>

                  <h3 className="mt-1 truncate text-sm font-bold text-slate-900">
                    {q.rfq?.productName ||
                      `RFQ-${q.rfqId}`}
                  </h3>
                </div>

                <Badge
                  tone={
                    q.status === "ACCEPTED"
                      ? "success"
                      : "neutral"
                  }
                >
                  {q.status}
                </Badge>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <MobileInfo
                  label="Supplier"
                  value={q.supplierId}
                />

                <MobileInfo
                  label="Price"
                  value={`${q.rfq?.currency || "INR"} ${q.price}`}
                />

                <MobileInfo
                  label="Delivery"
                  value={q.estimatedDeliveryTime}
                />

                <MobileInfo
                  label="RFQ ID"
                  value={`#${q.rfqId}`}
                />
              </div>

              {q.message && (
                <div className="mt-4 rounded-xl bg-slate-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Message
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {q.message}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </AdminPage>
  );
}

/* =========================================================
   GENERIC ADMIN DATA TABLE
========================================================= */

function AdminDataTable({
  endpoint,
  title,
  eyebrow,
  description,
  headers,
  renderRow,
}) {
  const { notify } = useToast();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    api
      .get(endpoint)
      .then(({ data }) =>
        setRows(data.rfqs || data.data || [])
      )
      .catch((error) =>
        notify(
          getErrorMessage(
            error,
            `Failed to load ${title}`
          ),
          "error"
        )
      )
      .finally(() => setLoading(false));
  }, [endpoint, title, notify]);

  return (
    <AdminPage
      title={title}
      eyebrow={eyebrow}
      description={description}
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {headers.map((h) => (
                <TableHeader key={h}>{h}</TableHeader>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <LoadingRow
                colSpan={headers.length}
                text={`Loading ${title.toLowerCase()}...`}
              />
            ) : rows.length === 0 ? (
              <EmptyRow
                colSpan={headers.length}
                text="No records found."
              />
            ) : (
              rows.map(renderRow)
            )}
          </tbody>
        </table>
      </div>
    </AdminPage>
  );
}

/* =========================================================
   ADMIN PAGE
========================================================= */

function AdminPage({
  title,
  eyebrow,
  description,
  children,
}) {
  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">

      {/* Heading */}
      <div className="min-w-0">
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold tracking-wider text-blue-600 sm:text-[11px]">
          {eyebrow}
        </span>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>

        <p className="mt-1 text-sm text-slate-500 sm:text-base">
          {description}
        </p>
      </div>

      {/* Content */}
      <Card className="min-w-0 overflow-hidden">
        {children}
      </Card>
    </div>
  );
}

/* =========================================================
   UI HELPERS
========================================================= */

function TableHeader({ children }) {
  return (
    <th className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
      {children}
    </th>
  );
}

function LoadingRow({ colSpan, text }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <FiRefreshCw className="h-5 w-5 animate-spin text-blue-600" />

          <span className="text-sm text-slate-500">
            {text}
          </span>
        </div>
      </td>
    </tr>
  );
}

function EmptyRow({ colSpan, text }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-12 text-center text-sm text-slate-500"
      >
        {text}
      </td>
    </tr>
  );
}

function UserAvatar({ name }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-sm">
      {name?.charAt(0)?.toUpperCase() || "U"}
    </div>
  );
}

function StatusBadge({ active }) {
  return (
    <Badge tone={active ? "success" : "neutral"}>
      {active ? "ACTIVE" : "INACTIVE"}
    </Badge>
  );
}

function RoleSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full
        min-w-[120px]
        rounded-lg
        border
        border-slate-200
        bg-white
        px-3
        py-2
        text-xs
        font-semibold
        text-slate-700
        outline-none
        transition
        focus:border-blue-500
        focus:ring-2
        focus:ring-blue-100
      "
    >
      <option value="BUYER">BUYER</option>
      <option value="SUPPLIER">SUPPLIER</option>
      <option value="ADMIN">ADMIN</option>
    </select>
  );
}

function MobileInfo({ label, value }) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="mt-1 truncate text-xs font-semibold text-slate-700">
        {value}
      </div>
    </div>
  );
}

function MobileLoading() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-12">
      <FiRefreshCw className="h-6 w-6 animate-spin text-blue-600" />

      <p className="mt-3 text-sm text-slate-500">
        Loading...
      </p>
    </div>
  );
}

function MobileEmpty({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center">
      <FiFileText className="mx-auto h-7 w-7 text-slate-300" />

      <p className="mt-3 text-sm text-slate-500">
        {text}
      </p>
    </div>
  );
}