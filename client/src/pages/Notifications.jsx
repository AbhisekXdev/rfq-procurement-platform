import React, { useEffect, useState } from "react";
import { FiBell, FiCheck, FiCheckCircle, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import api, { getErrorMessage } from "../lib/api.js";
import { useToast } from "../context/ToastContext.jsx";
import { useSocket } from "../hooks/useSocket.js";

export default function Notifications() {
  const { notify } = useToast();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get("/notifications");
      setItems(data.data || []);
    } catch (error) {
      notify(getErrorMessage(error, "Failed to load notifications"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!socket) return undefined;
    const onNotification = (notification) => {
      setItems((current) => [notification, ...current.filter((item) => item.id !== notification.id)]);
      notify(notification.title || "New notification", "info");
    };
    socket.on("notification:new", onNotification);
    return () => socket.off("notification:new", onNotification);
  }, [socket, notify]);

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setItems((current) => current.map((item) => item.id === id ? { ...item, isRead: true } : item));
    } catch (error) {
      notify(getErrorMessage(error, "Failed to update notification"), "error");
    }
  };

  const markAll = async () => {
    try {
      await api.patch("/notifications/read-all");
      setItems((current) => current.map((item) => ({ ...item, isRead: true })));
      notify("All notifications marked as read.", "success");
    } catch (error) {
      notify(getErrorMessage(error, "Failed to update notifications"), "error");
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      notify(getErrorMessage(error, "Failed to delete notification"), "error");
    }
  };

  const open = async (item) => {
    if (!item.isRead) await markRead(item.id);
    if (item.type === "MESSAGE" && item.referenceId) navigate(`/chat?conversation=${item.referenceId}`);
    if (item.type === "QUOTATION" && item.referenceId) navigate("/quotations");
  };

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">ACTIVITY</span>
          <h1>Notifications</h1>
          <p className="muted">Messages, quotations and marketplace activity.</p>
        </div>
        {items.some((item) => !item.isRead) && <Button variant="secondary" onClick={markAll}><FiCheckCircle /> Mark all read</Button>}
      </div>

      <Card>
        {loading ? <div className="notification-empty">Loading notifications…</div> :
          items.length === 0 ? (
            <div className="notification-empty"><FiBell size={32} /><strong>You're all caught up</strong><span>No notifications yet.</span></div>
          ) : (
            <div className="notification-list">
              {items.map((item) => (
                <div key={item.id} className={`notification-item ${item.isRead ? "" : "unread"}`} onClick={() => open(item)}>
                  <div className="notification-icon"><FiBell /></div>
                  <div className="notification-copy">
                    <div className="notification-title"><strong>{item.title}</strong>{!item.isRead && <Badge tone="success">New</Badge>}</div>
                    <p>{item.message}</p>
                    <small>{new Date(item.createdAt).toLocaleString()}</small>
                  </div>
                  <div className="notification-actions">
                    {!item.isRead && <button title="Mark as read" onClick={(e) => { e.stopPropagation(); markRead(item.id); }}><FiCheck /></button>}
                    <button title="Delete" onClick={(e) => { e.stopPropagation(); remove(item.id); }}><FiTrash2 /></button>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </Card>
    </div>
  );
}
