import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";
import AppShell from "./components/layout/AppShell.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Dashboard from "./pages/common/Dashboard.jsx";
import RFQList from "./pages/buyer/RFQList.jsx";
import CreateRFQ from "./pages/buyer/CreateRFQ.jsx";
import RFQDetails from "./pages/rfq/RFQDetails.jsx";
import Quotations from "./pages/supplier/Quotations.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import { AdminUsers, AdminRFQs, AdminQuotations } from "./pages/admin/AdminTable.jsx";
import Chat from "./pages/chat/Chat.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Home from "./pages/Home.jsx";
import Notifications from "./pages/Notifications.jsx";

function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? (user.role === "ADMIN" ? "/admin" : "/dashboard") : "/login"} replace />;
}

export default function App() {
  return <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route element={<ProtectedRoute />}><Route element={<AppShell />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/rfqs" element={<RFQList />} />
      <Route path="/rfqs/new" element={<CreateRFQ />} />
      <Route path="/rfqs/:id" element={<RFQDetails />} />
      <Route path="/quotations" element={<Quotations />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/notifications" element={<Notifications />} />
    </Route></Route>
    <Route element={<ProtectedRoute roles={["ADMIN"]} />}><Route element={<AppShell />}>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/rfqs" element={<AdminRFQs />} />
      <Route path="/admin/quotations" element={<AdminQuotations />} />
    </Route></Route>
    <Route path="*" element={<HomeRedirect />} />
  </Routes>;
}
