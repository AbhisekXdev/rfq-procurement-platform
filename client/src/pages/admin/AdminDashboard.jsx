import React, { useEffect, useState } from "react";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { Link } from "react-router-dom";
import api, { getErrorMessage } from "../../lib/api.js";
import { useToast } from "../../context/ToastContext.jsx";

export default function AdminDashboard() {
  const { notify } = useToast();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard").then(({ data }) => setStats(data.data)).catch((error) => notify(getErrorMessage(error, "Failed to load admin dashboard"), "error"));
  }, [notify]);

  const cards = [
    ["Total users", stats?.totalUsers ?? "—", "♙"],
    ["Active RFQs", stats?.openRFQs ?? "—", "▣"],
    ["Quotations", stats?.totalQuotations ?? "—", "◫"],
    ["Active users", stats?.activeUsers ?? "—", "●"],
  ];

  return <div className="page">
    <div className="page-heading"><div><span className="eyebrow">ADMINISTRATION</span><h1>Platform overview</h1><p className="muted">Live marketplace metrics from the admin API.</p></div><Badge tone="success">ADMIN MODE</Badge></div>
    <div className="stats-grid">{cards.map(([label, value, icon]) => <Card className="stat-card" key={label}><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong></div></Card>)}</div>
    <div className="dashboard-grid"><Card title="Administration"><div className="quick-grid">
      <Link to="/admin/users" className="quick-card"><b>♙ Manage users</b><span>Activate accounts and change roles.</span></Link>
      <Link to="/admin/rfqs" className="quick-card"><b>▣ Review RFQs</b><span>Monitor buyer requirements.</span></Link>
      <Link to="/admin/quotations" className="quick-card"><b>◫ Review quotations</b><span>Inspect submitted commercial offers.</span></Link>
      <Link to="/chat" className="quick-card"><b>◉ Messages</b><span>Open persistent realtime conversations.</span></Link>
    </div></Card><Card title="System health"><div className="health-list"><div><span className="status-dot online"/><span>API</span><Badge tone="success">Ready</Badge></div><div><span className="status-dot online"/><span>Registration OTP</span><Badge tone="success">Email</Badge></div><div><span className="status-dot online"/><span>Socket.IO</span><Badge tone="success">Realtime</Badge></div><div><span className="status-dot online"/><span>Database</span><Badge tone="success">Aiven</Badge></div></div></Card></div>
  </div>;
}
