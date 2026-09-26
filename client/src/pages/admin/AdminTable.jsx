import React, { useEffect, useState } from "react";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import api, { getErrorMessage } from "../../lib/api.js";
import { useToast } from "../../context/ToastContext.jsx";

export function AdminUsers() {
  const { notify } = useToast();
  const [rows, setRows] = useState([]);
  const load = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setRows(data.data || []);
    } catch (error) {
      notify(getErrorMessage(error, "Failed to load users"), "error");
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
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Status</th>
            <th>Verified</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan="6">No users found.</td>
            </tr>
          ) : (
            rows.map((u) => (
              <tr key={u.id}>
                <td>
                  <strong>{u.name}</strong>
                  <small>{u.email}</small>
                </td>
                <td>
                  <select
                    value={u.role}
                    onChange={(e) => updateRole(u.id, e.target.value)}
                  >
                    <option>BUYER</option>
                    <option>SUPPLIER</option>
                    <option>ADMIN</option>
                  </select>
                </td>
                <td>
                  <Badge tone={u.isActive ? "success" : "neutral"}>
                    {u.isActive ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </td>
                <td>{u.isEmailVerified ? "Yes" : "No"}</td>
                <td>
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString()
                    : "—"}
                </td>
                <td>
                  <Button
                    variant="ghost"
                    onClick={() => updateStatus(u.id, !u.isActive)}
                  >
                    {u.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </AdminPage>
  );
}

export function AdminRFQs() {
  return (
    <AdminDataTable
      endpoint="/rfqs"
      title="RFQs"
      eyebrow="ADMIN · RFQS"
      description="Review marketplace requirements."
      renderRow={(r) => (
        <tr key={r.id}>
          <td>
            <strong>{r.productName}</strong>
            <small>{r.description}</small>
          </td>
          <td>{r.buyerId}</td>
          <td>{new Date(r.deadline).toLocaleDateString()}</td>
          <td>
            <Badge tone={r.status === "OPEN" ? "success" : "neutral"}>
              {r.status}
            </Badge>
          </td>
          <td>
            <strong>
              {r.currency} {r.budget || "—"}
            </strong>
          </td>
        </tr>
      )}
      headers={["Requirement", "Buyer", "Deadline", "Status", "Budget"]}
    />
  );
}

export function AdminQuotations() {
  const { notify } = useToast();
  const [rows, setRows] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/rfqs");
        const sets = await Promise.all(
          (data.rfqs || []).map(async (r) => {
            try {
              const q = await api.get(`/quotations/rfq/${r.id}`);
              return (q.data.quotations || []).map((x) => ({ ...x, rfq: r }));
            } catch {
              return [];
            }
          }),
        );
        setRows(sets.flat());
      } catch (error) {
        notify(getErrorMessage(error, "Failed to load quotations"), "error");
      }
    })();
  }, [notify]);
  return (
    <AdminPage
      title="Quotations"
      eyebrow="ADMIN · QUOTATIONS"
      description="Monitor commercial submissions."
    >
      <table>
        <thead>
          <tr>
            <th>RFQ</th>
            <th>Supplier</th>
            <th>Price</th>
            <th>Delivery</th>
            <th>Status</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan="6">No quotations found.</td>
            </tr>
          ) : (
            rows.map((q) => (
              <tr key={q.id}>
                <td>
                  <strong>{q.rfq?.productName || `RFQ-${q.rfqId}`}</strong>
                </td>
                <td>{q.supplierId}</td>
                <td>
                  {q.rfq?.currency || "INR"} {q.price}
                </td>
                <td>{q.estimatedDeliveryTime}</td>
                <td>
                  <Badge tone={q.status === "ACCEPTED" ? "success" : "neutral"}>
                    {q.status}
                  </Badge>
                </td>
                <td>{q.message || "—"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </AdminPage>
  );
}

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
  useEffect(() => {
    api
      .get(endpoint)
      .then(({ data }) => setRows(data.rfqs || data.data || []))
      .catch((error) =>
        notify(getErrorMessage(error, `Failed to load ${title}`), "error"),
      );
  }, [endpoint, title, notify]);
  return (
    <AdminPage title={title} eyebrow={eyebrow} description={description}>
      <table>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length}>No records found.</td>
            </tr>
          ) : (
            rows.map(renderRow)
          )}
        </tbody>
      </table>
    </AdminPage>
  );
}

function AdminPage({ title, eyebrow, description, children }) {
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p className="muted">{description}</p>
        </div>
      </div>
      <Card>
        <div className="table-wrap">{children}</div>
      </Card>
    </div>
  );
}
