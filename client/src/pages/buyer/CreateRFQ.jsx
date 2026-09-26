import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import api, { getErrorMessage } from "../../lib/api.js";

export default function CreateRFQ() {
  const navigate = useNavigate();
  const { notify } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ productName: "", description: "", quantity: "", deliveryLocation: "", deadline: "", category: "", budget: "", currency: "INR" });
  const update = (key, value) => setForm((v) => ({ ...v, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api.post("/rfqs", { ...form, quantity: Number(form.quantity), budget: form.budget ? Number(form.budget) : undefined });
      notify("RFQ published successfully.", "success");
      navigate("/rfqs", { replace: true });
    } catch (error) {
      notify(getErrorMessage(error, "Failed to create RFQ"), "error");
    } finally { setLoading(false); }
  };

  return <div className="page narrow-page"><div className="page-heading"><div><span className="eyebrow">BUYER</span><h1>Create RFQ</h1><p className="muted">Publish a live requirement for suppliers.</p></div></div>
    <Card title="Requirement details"><form onSubmit={submit} className="form-grid">
      <Input label="Product / service name" className="span-2" value={form.productName} onChange={(e) => update("productName", e.target.value)} required />
      <label className="field span-2"><span>Description</span><textarea rows="5" value={form.description} onChange={(e) => update("description", e.target.value)} required /></label>
      <Input label="Quantity" type="number" min="1" value={form.quantity} onChange={(e) => update("quantity", e.target.value)} required />
      <Input label="Delivery location" value={form.deliveryLocation} onChange={(e) => update("deliveryLocation", e.target.value)} required />
      <Input label="Deadline" type="date" value={form.deadline} onChange={(e) => update("deadline", e.target.value)} required />
      <Input label="Category" value={form.category} onChange={(e) => update("category", e.target.value)} />
      <Input label="Budget" type="number" min="0" value={form.budget} onChange={(e) => update("budget", e.target.value)} />
      <label className="field"><span>Currency</span><select value={form.currency} onChange={(e) => update("currency", e.target.value)}><option>INR</option><option>USD</option><option>EUR</option></select></label>
      <div className="form-actions span-2"><Button type="button" variant="secondary" onClick={() => navigate("/rfqs")}>Cancel</Button><Button type="submit" loading={loading}>Publish RFQ</Button></div>
    </form></Card>
  </div>;
}
