import React from "react";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Profile(){
 const {user}=useAuth();
 return <div className="page narrow-page"><div className="page-heading"><div><span className="eyebrow">ACCOUNT</span><h1>Profile</h1><p className="muted">Your marketplace account information.</p></div></div>
 <Card><div className="profile-hero"><div className="profile-avatar">{user?.name?.charAt(0)?.toUpperCase()}</div><div><h2>{user?.name}</h2><Badge tone="success">{user?.role}</Badge></div></div>
 <div className="profile-grid"><div><span>Name</span><strong>{user?.name}</strong></div><div><span>Email</span><strong>{user?.email}</strong></div><div><span>Role</span><strong>{user?.role}</strong></div><div><span>Verification</span><Badge tone="success">Verified</Badge></div></div></Card>
 </div>
}