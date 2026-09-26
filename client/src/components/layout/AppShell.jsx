import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiBell, FiBriefcase, FiChevronLeft, FiChevronRight, FiGrid, FiLogOut,
  FiMenu, FiMessageCircle, FiPlus, FiSettings, FiUser, FiFileText
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSocket } from "../../hooks/useSocket.js";
import api from "../../lib/api.js";

const roleLinks = {
  BUYER: [
    ["Dashboard", "/dashboard", FiGrid],
    ["My RFQs", "/rfqs", FiFileText],
    ["Create RFQ", "/rfqs/new", FiPlus],
    ["Quotations", "/quotations", FiBriefcase],
    ["Messages", "/chat", FiMessageCircle],
    ["Notifications", "/notifications", FiBell],
    ["Profile", "/profile", FiUser],
  ],
  SUPPLIER: [
    ["Dashboard", "/dashboard", FiGrid],
    ["Browse RFQs", "/rfqs", FiFileText],
    ["My Quotations", "/quotations", FiBriefcase],
    ["Messages", "/chat", FiMessageCircle],
    ["Notifications", "/notifications", FiBell],
    ["Profile", "/profile", FiUser],
  ],
  ADMIN: [
    ["Overview", "/admin", FiGrid],
    ["Users", "/admin/users", FiUser],
    ["RFQs", "/admin/rfqs", FiFileText],
    ["Quotations", "/admin/quotations", FiBriefcase],
    ["Messages", "/chat", FiMessageCircle],
    ["Notifications", "/notifications", FiBell],
  ],
};

export default function AppShell() {
  const { user, logout } = useAuth();
  const { connected, socket } = useSocket();
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const navigate = useNavigate();
  const links = useMemo(() => roleLinks[user?.role] || [], [user?.role]);

  const loadUnread = async () => {
    try {
      const { data } = await api.get("/notifications");
      setUnread(Number(data.unreadCount || 0));
    } catch { /* protected page may be logging out */ }
  };

  useEffect(() => { loadUnread(); }, []);
  useEffect(() => {
    if (!socket) return undefined;
    const onNew = () => setUnread((count) => count + 1);
    const onRead = () => loadUnread();
    socket.on("notification:new", onNew);
    socket.on("notifications:read", onRead);
    return () => {
      socket.off("notification:new", onNew);
      socket.off("notifications:read", onRead);
    };
  }, [socket]);

  const signOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navigateTo = (to) => {
    setMobileOpen(false);
    navigate(to);
  };

  return (
    <div className="app-shell">
      {mobileOpen && <button className="mobile-backdrop" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${open ? "" : "sidebar-collapsed"} ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">R</div>
          {open && <div><strong>RFQ Market</strong><small>B2B procurement</small></div>}
        </div>

        {open && <div className="workspace-label">{user?.role === "ADMIN" ? "ADMIN CONSOLE" : `${user?.role} WORKSPACE`}</div>}
        <nav className="nav-list">
          {links.map(([label, to, Icon]) => (
            <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
              <span className="nav-icon"><Icon /></span>
              {open && <span>{label}</span>}
              {label === "Notifications" && unread > 0 && <em className="nav-badge">{unread > 99 ? "99+" : unread}</em>}
            </NavLink>
          ))}
        </nav>

        {user?.role === "ADMIN" && open && (
          <div className="admin-nav-block">
            <div className="admin-tab-title">ADMIN</div>
            <NavLink to="/admin" onClick={() => setMobileOpen(false)} className={({ isActive }) => `admin-tab-link ${isActive ? "active" : ""}`}><FiSettings /> Admin control center</NavLink>
          </div>
        )}

        <div className="sidebar-bottom">
          {open && <div className="connection"><span className={`status-dot ${connected ? "online" : ""}`} />{connected ? "Realtime connected" : "Realtime offline"}</div>}
          <button className="nav-item logout-btn" onClick={signOut}><span className="nav-icon"><FiLogOut /></span>{open && <span>Logout</span>}</button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <button className="icon-btn mobile-menu-btn" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><FiMenu /></button>
          <button className="icon-btn desktop-menu-btn" onClick={() => setOpen(!open)} aria-label="Collapse navigation">{open ? <FiChevronLeft /> : <FiChevronRight />}</button>
          <div className="topbar-spacer" />
          <NavLink className="notification-top-link" to="/notifications" title="Notifications"><FiBell />{unread > 0 && <b>{unread > 9 ? "9+" : unread}</b>}</NavLink>
          <div className="topbar-role-tabs"><span className="role-pill">{user?.role === "ADMIN" ? "Admin" : user?.role === "BUYER" ? "Buyer" : "Supplier"}</span></div>
          <div className="user-chip" onClick={() => navigateTo("/profile")}>
            <div className="avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
            <div className="user-chip-text"><strong>{user?.name}</strong><span>{user?.email}</span></div>
          </div>
        </header>
        <main className="page-content"><Outlet /></main>
      </div>
    </div>
  );
}
