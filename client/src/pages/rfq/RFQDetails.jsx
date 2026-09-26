import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiMessageCircle, FiArrowLeft, FiSend } from "react-icons/fi";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import api, { getErrorMessage } from "../../lib/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export default function RFQDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [rfq, setRfq] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(null);
  const [form, setForm] = useState({ price: "", estimatedDeliveryTime: "", message: "" });

  const load = async () => {
    try {
      const { data } = await api.get(`/rfqs/${id}`);
      setRfq(data.rfq);

      if (user?.role === "BUYER") {
        const quoteRes = await api.get(`/quotations/rfq/${id}`);
        setQuotations(quoteRes.data.quotations || []);
      }
    } catch (error) {
      notify(getErrorMessage(error, "Failed to load RFQ"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id, user?.role]);

  const submitQuote = async (event) => {
    event.preventDefault();
    setQuoteLoading(true);
    try {
      await api.post(`/quotations/rfq/${id}`, {
        ...form,
        price: Number(form.price),
      });
      notify("Quotation submitted successfully.", "success");
      setForm({ price: "", estimatedDeliveryTime: "", message: "" });
    } catch (error) {
      notify(getErrorMessage(error, "Failed to submit quotation"), "error");
    } finally {
      setQuoteLoading(false);
    }
  };

  const openChat = async (participantId, rfqId = id) => {
    if (!participantId) {
      notify("The other participant could not be identified.", "error");
      return;
    }

    setChatLoading(Number(participantId));
    try {
      const { data } = await api.post("/chat/conversations", {
        participantIds: [Number(participantId)],
        rfqId: Number(rfqId),
      });

      const conversationId = data?.data?.id;
      if (!conversationId) throw new Error("Conversation was not created");
      navigate(`/chat?conversation=${conversationId}`);
    } catch (error) {
      notify(getErrorMessage(error, "Unable to start conversation"), "error");
    } finally {
      setChatLoading(null);
    }
  };

  if (loading) return <div className="page"><Card>Loading RFQ…</Card></div>;
  if (!rfq) return <div className="page"><Card>RFQ not found.</Card></div>;

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">RFQ-{rfq.id}</span>
          <h1>{rfq.productName}</h1>
          <p className="muted">{rfq.description}</p>
        </div>
        <Badge tone={rfq.status === "OPEN" ? "success" : "neutral"}>{rfq.status}</Badge>
      </div>

      <div className="dashboard-grid">
        <Card title="Requirement">
          <div className="detail-list">
            <div><span>Quantity</span><b>{Number(rfq.quantity).toLocaleString()}</b></div>
            <div><span>Delivery</span><b>{rfq.deliveryLocation}</b></div>
            <div><span>Deadline</span><b>{new Date(rfq.deadline).toLocaleDateString()}</b></div>
            <div><span>Budget</span><b>{rfq.budget ? `${rfq.currency} ${rfq.budget}` : "Not specified"}</b></div>
            <div><span>Category</span><b>{rfq.category || "—"}</b></div>
          </div>
        </Card>

        {user?.role === "SUPPLIER" && rfq.status === "OPEN" && (
          <Card title="Submit quotation">
            <form onSubmit={submitQuote} className="form-stack">
              <Input label="Price" type="number" min="0" value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              <Input label="Estimated delivery time" value={form.estimatedDeliveryTime}
                onChange={(e) => setForm({ ...form, estimatedDeliveryTime: e.target.value })}
                placeholder="e.g. 15 days" required />
              <label className="field">
                <span>Message</span>
                <textarea rows="4" value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </label>
              <Button type="submit" loading={quoteLoading}><FiSend /> Submit quotation</Button>
            </form>
          </Card>
        )}

        {user?.role === "SUPPLIER" && (
          <Card title="Buyer">
            <div className="detail-list">
              <div><span>Buyer ID</span><b>{rfq.buyerId}</b></div>
            </div>
            <Button onClick={() => openChat(rfq.buyerId)} loading={chatLoading === Number(rfq.buyerId)}>
              <FiMessageCircle /> Chat with buyer
            </Button>
          </Card>
        )}
      </div>

      {user?.role === "BUYER" && (
        <Card title={`Quotations (${quotations.length})`}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Supplier</th><th>Price</th><th>Delivery</th><th>Message</th><th>Status</th><th>Chat</th></tr>
              </thead>
              <tbody>
                {quotations.length === 0 ? (
                  <tr><td colSpan="6">No quotations submitted yet.</td></tr>
                ) : quotations.map((q) => (
                  <tr key={q.id}>
                    <td><strong>{q.supplier?.name || `Supplier #${q.supplierId}`}</strong><small>{q.supplier?.email || ""}</small></td>
                    <td>{rfq.currency} {q.price}</td>
                    <td>{q.estimatedDeliveryTime}</td>
                    <td>{q.message || "—"}</td>
                    <td><Badge tone={q.status === "ACCEPTED" ? "success" : "neutral"}>{q.status}</Badge></td>
                    <td>
                      <Button variant="ghost"
                        onClick={() => openChat(q.supplierId)}
                        loading={chatLoading === Number(q.supplierId)}>
                        <FiMessageCircle /> Chat
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Link className="btn btn-secondary" to="/rfqs"><FiArrowLeft /> Back to RFQs</Link>
    </div>
  );
}
