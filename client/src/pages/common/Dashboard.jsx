import React from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const buyer = user?.role === "BUYER";
  const supplier = user?.role === "SUPPLIER";

  const stats = buyer
    ? [["Open RFQs","0","▣"],["Quotations received","0","◫"],["Active conversations","0","◉"],["Awards","0","✓"]]
    : [["Available RFQs","0","▣"],["Submitted quotations","0","◫"],["Active conversations","0","◉"],["Accepted bids","0","✓"]];

  return (
    <div className="page">
      <div className="page-heading">
        <div><span className="eyebrow">WORKSPACE</span><h1>Good to see you, {user?.name?.split(" ")[0]}.</h1><p className="muted">Manage procurement activity from one place.</p></div>
        {buyer && <Link className="btn btn-primary" to="/rfqs/new">+ Create RFQ</Link>}
      </div>

      <div className="stats-grid">
        {stats.map(([label,value,icon]) => <Card key={label} className="stat-card"><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong></div></Card>)}
      </div>

      <div className="dashboard-grid">
        <Card title="Quick actions">
          <div className="quick-grid">
            {buyer ? <>
              <Link to="/rfqs/new" className="quick-card"><b>+ Publish requirement</b><span>Create a new RFQ for suppliers.</span></Link>
              <Link to="/rfqs" className="quick-card"><b>▣ Review RFQs</b><span>Track open and awarded requests.</span></Link>
              <Link to="/quotations" className="quick-card"><b>◫ Compare quotations</b><span>Review supplier responses.</span></Link>
              <Link to="/chat" className="quick-card"><b>◉ Open messages</b><span>Continue supplier conversations.</span></Link>
            </> : <>
              <Link to="/rfqs" className="quick-card"><b>▣ Browse requirements</b><span>Find open opportunities.</span></Link>
              <Link to="/quotations" className="quick-card"><b>◫ My quotations</b><span>Track every submitted bid.</span></Link>
              <Link to="/chat" className="quick-card"><b>◉ Messages</b><span>Chat with buyers in real time.</span></Link>
              <Link to="/profile" className="quick-card"><b>◎ Company profile</b><span>Keep your account information current.</span></Link>
            </>}
          </div>
        </Card>

        <Card title="Account status">
          <div className="account-status">
            <div className="status-large">✓</div>
            <div><strong>Email verified</strong><p className="muted">Your {user?.role?.toLowerCase()} workspace is active.</p></div>
          </div>
          <div className="mini-list">
            <div><span>Account</span><b>{user?.role}</b></div>
            <div><span>Email</span><b>{user?.email}</b></div>
            <div><span>Realtime</span><Badge tone="success">Available</Badge></div>
          </div>
        </Card>
      </div>
    </div>
  );
}