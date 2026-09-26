import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMessageCircle } from "react-icons/fi";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import api, { getErrorMessage } from "../../lib/api.js";
import { useToast } from "../../context/ToastContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Quotations() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notify } = useToast();
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rfqMap, setRfqMap] = useState({});

  const openChat = async (quotation) => {
    const participantId = user?.role === "BUYER" ? quotation.supplierId : rfqMap[quotation.rfqId]?.buyerId;
    if (!participantId) {
      notify("The other participant could not be identified.", "error");
      return;
    }
    try {
      const { data } = await api.post("/chat/conversations", {
        participantIds: [Number(participantId)],
        rfqId: Number(quotation.rfqId),
      });
      navigate(`/chat?conversation=${data.data.id}`);
    } catch (error) {
      notify(getErrorMessage(error, "Unable to start conversation"), "error");
    }
  };

  const loadSupplier = async () => {
    const { data } = await api.get("/quotations/my");
    const quotations = data.quotations || [];
    setRows(quotations);
    const entries = await Promise.all(quotations.map(async (q) => {
      try { const response = await api.get(`/rfqs/${q.rfqId}`); return [q.rfqId, response.data.rfq]; } catch { return [q.rfqId, null]; }
    }));
    setRfqMap(Object.fromEntries(entries));
  };

  const loadBuyer = async () => {
    const { data } = await api.get("/rfqs/my");
    const rfqs = data.rfqs || [];
    const quoteSets = await Promise.all(rfqs.map(async (rfq) => {
      try { const response = await api.get(`/quotations/rfq/${rfq.id}`); return (response.data.quotations || []).map((q) => ({ ...q, rfq })); } catch { return []; }
    }));
    setRows(quoteSets.flat());
  };

  const load = async () => {
    setLoading(true);
    try { await (user?.role === "SUPPLIER" ? loadSupplier() : loadBuyer()); }
    catch (error) { notify(getErrorMessage(error, "Failed to load quotations"), "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [user?.role]);

  const filtered = useMemo(() => filter === "ALL" ? rows : rows.filter((r) => r.status === filter), [rows, filter]);

  return <div className="page">
    <div className="page-heading"><div><span className="eyebrow">COMMERCIAL</span><h1>{user?.role === "SUPPLIER" ? "My Quotations" : "RFQ Quotations"}</h1><p className="muted">Live quotation records from the backend.</p></div></div>
    <Card>
      <div className="filter-tabs">{["ALL", "SUBMITTED", "NEGOTIATION", "ACCEPTED", "REJECTED", "WITHDRAWN"].map((x) => <button className={filter === x ? "active" : ""} onClick={() => setFilter(x)} key={x}>{x}</button>)}</div>
      <div className="table-wrap"><table><thead><tr><th>RFQ</th><th>{user?.role === "SUPPLIER" ? "Buyer / RFQ" : "Supplier"}</th><th>Price</th><th>Delivery</th><th>Status</th><th>Action</th></tr></thead><tbody>
        {loading ? <tr><td colSpan="6">Loading quotations…</td></tr> : filtered.length === 0 ? <tr><td colSpan="6">No quotations found.</td></tr> : filtered.map((q) => <tr key={q.id}><td><strong>{q.rfq?.productName || rfqMap[q.rfqId]?.productName || `RFQ-${q.rfqId}`}</strong><small>RFQ-{q.rfqId}</small></td><td>{user?.role === "SUPPLIER" ? (rfqMap[q.rfqId]?.buyerId || "Buyer") : `Supplier #${q.supplierId}`}</td><td>{q.rfq?.currency || rfqMap[q.rfqId]?.currency || "INR"} {q.price}</td><td>{q.estimatedDeliveryTime}</td><td><Badge tone={q.status === "ACCEPTED" ? "success" : q.status === "NEGOTIATION" ? "warning" : "neutral"}>{q.status}</Badge></td><td><div className="table-actions"><Button variant="ghost" onClick={() => setSelected(q)}>View</Button><Button variant="ghost" onClick={() => openChat(q)}><FiMessageCircle /> Chat</Button></div></td></tr>)}
      </tbody></table></div>
    </Card>

    {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="modal-card" onClick={(e) => e.stopPropagation()}><div className="modal-heading"><div><span className="eyebrow">QUOTATION-{selected.id}</span><h2>Quotation details</h2></div><button className="icon-btn" onClick={() => setSelected(null)}>×</button></div><div className="detail-list"><div><span>RFQ</span><b>{selected.rfq?.productName || rfqMap[selected.rfqId]?.productName || `RFQ-${selected.rfqId}`}</b></div><div><span>Supplier</span><b>{selected.supplierId}</b></div><div><span>Price</span><b>{selected.rfq?.currency || rfqMap[selected.rfqId]?.currency || "INR"} {selected.price}</b></div><div><span>Estimated delivery</span><b>{selected.estimatedDeliveryTime}</b></div><div><span>Status</span><Badge tone={selected.status === "ACCEPTED" ? "success" : "neutral"}>{selected.status}</Badge></div><div><span>Message</span><b>{selected.message || "No message"}</b></div></div><Button onClick={() => setSelected(null)}>Close</Button></div></div>}
  </div>;
}
