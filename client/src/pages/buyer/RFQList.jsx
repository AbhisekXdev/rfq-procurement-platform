import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card.jsx";
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
      const { data } = await api.get(user?.role === "BUYER" ? "/rfqs/my" : "/rfqs");
      setRows(data.rfqs || []);
    } catch (error) {
      notify(getErrorMessage(error, "Failed to load RFQs"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [user?.role]);

  const filtered = useMemo(() => rows.filter((item) => {
    const text = `${item.productName} ${item.category || ""} ${item.deliveryLocation}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (status === "ALL" || item.status === status);
  }), [rows, query, status]);

  return (
    <div className="page">
      <div className="page-heading">
        <div><span className="eyebrow">PROCUREMENT</span><h1>{user?.role === "BUYER" ? "My RFQs" : "Browse RFQs"}</h1><p className="muted">Live RFQ data from the marketplace backend.</p></div>
        {user?.role === "BUYER" && <Link className="btn btn-primary" to="/rfqs/new">+ Create RFQ</Link>}
      </div>
      <Card>
        <div className="toolbar"><input className="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products, categories or locations..." /><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="ALL">All statuses</option><option value="OPEN">OPEN</option><option value="CLOSED">CLOSED</option><option value="AWARDED">AWARDED</option><option value="CANCELLED">CANCELLED</option></select></div>
        <div className="table-wrap"><table><thead><tr><th>Requirement</th><th>Quantity</th><th>Location</th><th>Deadline</th><th>Budget</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="7">Loading RFQs…</td></tr> : filtered.length === 0 ? <tr><td colSpan="7">No RFQs found.</td></tr> : filtered.map((item) => <tr key={item.id}><td><strong>{item.productName}</strong><small>{item.category || "Uncategorized"}</small></td><td>{Number(item.quantity).toLocaleString()}</td><td>{item.deliveryLocation}</td><td>{new Date(item.deadline).toLocaleDateString()}</td><td>{item.budget ? `${item.currency || "INR"} ${item.budget}` : "—"}</td><td><Badge tone={item.status === "OPEN" ? "success" : "neutral"}>{item.status}</Badge></td><td><Button variant="ghost" onClick={() => navigate(`/rfqs/${item.id}`)}>View</Button></td></tr>)}
          </tbody></table></div>
      </Card>
    </div>
  );
}
