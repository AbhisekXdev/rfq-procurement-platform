import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiBell,
  FiBriefcase,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiMessageCircle,
  FiPlus,
  FiSettings,
  FiUser,
  FiFileText,
  FiX,
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

  const [open, setOpen] = useState(() => window.innerWidth > 1024);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const navigate = useNavigate();

  const links = useMemo(
    () => roleLinks[user?.role] || [],
    [user?.role]
  );

  const loadUnread = async () => {
    try {
      const { data } = await api.get("/notifications");
      setUnread(Number(data.unreadCount || 0));
    } catch {
      // protected page may be logging out
    }
  };

  useEffect(() => {
    loadUnread();
  }, []);

  useEffect(() => {
    if (!socket) return undefined;

    const onNew = () => {
      setUnread((count) => count + 1);
    };

    const onRead = () => {
      loadUnread();
    };

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

  const roleName =
    user?.role === "ADMIN"
      ? "Admin"
      : user?.role === "BUYER"
        ? "Buyer"
        : "Supplier";

  const roleWorkspace =
    user?.role === "ADMIN"
      ? "ADMIN CONSOLE"
      : `${user?.role || "USER"} WORKSPACE`;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 text-slate-900">

      {/* ================= MOBILE BACKDROP ================= */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[60] bg-slate-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-[70]
          flex flex-col
          border-r border-slate-800
          bg-slate-950 text-white
          shadow-2xl
          transition-all duration-300 ease-in-out

          w-[280px]

          ${open ? "lg:w-[280px]" : "lg:w-[82px]"}

          ${mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
          }
        `}
      >

        {/* BRAND */}
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-white/10 px-4">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-black shadow-lg shadow-blue-600/20">
              R
            </div>

            {(open || mobileOpen) && (
              <div className="min-w-0">
                <h1 className="truncate text-sm font-extrabold tracking-tight">
                  RFQ Market
                </h1>

                <p className="truncate text-[10px] font-medium text-slate-400">
                  B2B Procurement
                </p>
              </div>
            )}
          </div>

          {/* Mobile close */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* WORKSPACE */}
        {(open || mobileOpen) && (
          <div className="px-5 pb-2 pt-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
              {roleWorkspace}
            </p>
          </div>
        )}

        {/* NAVIGATION */}
        <nav className="scrollbar-thin flex-1 space-y-1 overflow-y-auto px-3 py-3">

          {links.map(([label, to, Icon]) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `
                group relative flex min-h-[46px] items-center gap-3
                rounded-xl px-3
                text-sm font-semibold
                transition-all duration-200

                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:bg-white/[0.07] hover:text-white"
                }

                ${!open && !mobileOpen ? "lg:justify-center" : ""}
              `}
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`
                      flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                      ${
                        isActive
                          ? "bg-white/15"
                          : "bg-white/[0.04] group-hover:bg-white/[0.08]"
                      }
                    `}
                  >
                    <Icon size={18} />
                  </span>

                  {(open || mobileOpen) && (
                    <span className="min-w-0 flex-1 truncate">
                      {label}
                    </span>
                  )}

                  {label === "Notifications" && unread > 0 && (
                    <span
                      className={`
                        flex shrink-0 items-center justify-center
                        rounded-full bg-red-500
                        px-1.5 py-0.5
                        text-[10px] font-black text-white
                        ${!open && !mobileOpen ? "absolute right-1 top-1" : ""}
                      `}
                    >
                      {unread > 99 ? "99+" : unread}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* ADMIN SECTION */}
          {user?.role === "ADMIN" && (open || mobileOpen) && (
            <div className="mt-6 border-t border-white/10 pt-5">

              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                Administration
              </p>

              <NavLink
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `
                  flex min-h-[46px] items-center gap-3 rounded-xl px-3
                  text-sm font-semibold transition
                  ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:bg-white/[0.07] hover:text-white"
                  }
                `}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                  <FiSettings size={18} />
                </span>

                <span className="truncate">
                  Admin control center
                </span>
              </NavLink>
            </div>
          )}
        </nav>

        {/* SIDEBAR BOTTOM */}
        <div className="shrink-0 border-t border-white/10 p-3">

          {(open || mobileOpen) && (
            <div className="mb-2 flex items-center gap-2 rounded-xl bg-white/[0.04] px-3 py-2.5">
              <span
                className={`
                  h-2.5 w-2.5 shrink-0 rounded-full
                  ${connected ? "bg-emerald-400 shadow-lg shadow-emerald-400/50" : "bg-slate-500"}
                `}
              />

              <span className="truncate text-xs font-medium text-slate-400">
                {connected ? "Realtime connected" : "Realtime offline"}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={signOut}
            className={`
              group flex min-h-[46px] w-full items-center gap-3
              rounded-xl px-3
              text-sm font-semibold text-slate-400
              transition hover:bg-red-500/10 hover:text-red-400
              ${!open && !mobileOpen ? "lg:justify-center" : ""}
            `}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] group-hover:bg-red-500/10">
              <FiLogOut size={18} />
            </span>

            {(open || mobileOpen) && (
              <span>Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* ================= MAIN AREA ================= */}
      <div
        className={`
          min-h-screen transition-[padding] duration-300
          ${open ? "lg:pl-[280px]" : "lg:pl-[82px]"}
        `}
      >

        {/* ================= TOPBAR ================= */}
        <header className="sticky top-0 z-50 flex h-[72px] items-center border-b border-slate-200 bg-white/95 px-3 shadow-sm backdrop-blur-xl sm:px-5 lg:px-6">

          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
            aria-label="Open navigation"
          >
            <FiMenu size={21} />
          </button>

          {/* Desktop Sidebar Toggle */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 lg:flex"
            aria-label="Collapse navigation"
          >
            {open ? (
              <FiChevronLeft size={20} />
            ) : (
              <FiChevronRight size={20} />
            )}
          </button>

          {/* Page identity */}
          <div className="ml-3 min-w-0 flex-1 sm:ml-4">
            <p className="truncate text-xs font-medium text-slate-400">
              RFQ Marketplace 
            </p>

            <p className="truncate text-sm font-extrabold text-slate-900 sm:text-base">
              {roleName} Workspace
            </p>
          </div>

          {/* Right Actions */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">

            {/* Notification */}
            <NavLink
              to="/notifications"
              title="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-blue-600"
            >
              <FiBell size={19} />

              {unread > 0 && (
                <span className="absolute -right-1 -top-1 flex min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white ring-2 ring-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </NavLink>

            {/* Role */}
            <span className="hidden rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 sm:inline-flex">
              {roleName}
            </span>

            {/* User */}
            <button
              type="button"
              onClick={() => navigateTo("/profile")}
              className="flex max-w-[190px] items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 pr-2 transition hover:bg-slate-50 sm:gap-3 sm:pr-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-black text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="hidden min-w-0 text-left sm:block">
                <p className="truncate text-xs font-bold text-slate-900">
                  {user?.name || "User"}
                </p>

                <p className="max-w-[120px] truncate text-[10px] text-slate-500">
                  {user?.email || ""}
                </p>
              </div>
            </button>
          </div>
        </header>

        {/* ================= PAGE CONTENT ================= */}
        <main className="min-h-[calc(100vh-72px)] w-full overflow-x-hidden bg-slate-50">
          <div className="mx-auto w-full max-w-[1920px] px-3 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6 xl:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}