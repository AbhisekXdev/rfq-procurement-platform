import React, { useEffect, useState } from "react";
import {
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiTrash2,
  FiMessageCircle,
  FiFileText,
} from "react-icons/fi";
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
      notify(
        getErrorMessage(error, "Failed to load notifications"),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!socket) return undefined;

    const onNotification = (notification) => {
      setItems((current) => [
        notification,
        ...current.filter((item) => item.id !== notification.id),
      ]);

      notify(notification.title || "New notification", "info");
    };

    socket.on("notification:new", onNotification);

    return () => {
      socket.off("notification:new", onNotification);
    };
  }, [socket, notify]);

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);

      setItems((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, isRead: true }
            : item
        )
      );
    } catch (error) {
      notify(
        getErrorMessage(error, "Failed to update notification"),
        "error"
      );
    }
  };

  const markAll = async () => {
    try {
      await api.patch("/notifications/read-all");

      setItems((current) =>
        current.map((item) => ({
          ...item,
          isRead: true,
        }))
      );

      notify("All notifications marked as read.", "success");
    } catch (error) {
      notify(
        getErrorMessage(error, "Failed to update notifications"),
        "error"
      );
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);

      setItems((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch (error) {
      notify(
        getErrorMessage(error, "Failed to delete notification"),
        "error"
      );
    }
  };

  const open = async (item) => {
    if (!item.isRead) {
      await markRead(item.id);
    }

    if (
      item.type === "MESSAGE" &&
      item.referenceId
    ) {
      navigate(
        `/chat?conversation=${item.referenceId}`
      );
    }

    if (
      item.type === "QUOTATION" &&
      item.referenceId
    ) {
      navigate("/quotations");
    }
  };

  const unreadCount = items.filter(
    (item) => !item.isRead
  ).length;

  return (
    <div className="page w-full max-w-full overflow-hidden px-3 sm:px-4 md:px-6 lg:px-8">

      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div className="min-w-0">
          <span className="eyebrow">ACTIVITY</span>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold sm:text-3xl">
              Notifications
            </h1>

            {unreadCount > 0 && (
              <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-600">
                {unreadCount} new
              </span>
            )}
          </div>

          <p className="muted mt-1 text-sm sm:text-base">
            Messages, quotations and marketplace activity.
          </p>
        </div>

        {unreadCount > 0 && (
          <div className="shrink-0">
            <Button
              variant="secondary"
              onClick={markAll}
            >
              <FiCheckCircle />
              Mark all read
            </Button>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <Card>

        {loading ? (
          <div className="flex min-h-[220px] items-center justify-center px-4">
            <div className="text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-800" />

              <p className="text-sm text-slate-500">
                Loading notifications…
              </p>
            </div>
          </div>
        ) : items.length === 0 ? (

          /* EMPTY STATE */
          <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">

            <div className="
              mb-4
              flex h-16 w-16
              items-center justify-center
              rounded-full
              bg-slate-100
              text-slate-500
            ">
              <FiBell size={28} />
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
              You're all caught up
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-500">
              No notifications yet. New messages,
              quotations and marketplace activity
              will appear here.
            </p>

          </div>
        ) : (

          /* NOTIFICATION LIST */
          <div className="divide-y divide-slate-100">

            {items.map((item) => (
              <NotificationItem
                key={item.id}
                item={item}
                onOpen={open}
                onRead={markRead}
                onDelete={remove}
              />
            ))}

          </div>
        )}

      </Card>
    </div>
  );
}


/* ---------------------------------------
   NOTIFICATION ITEM
---------------------------------------- */

function NotificationItem({
  item,
  onOpen,
  onRead,
  onDelete,
}) {
  const isUnread = !item.isRead;

  const getIcon = () => {
    if (item.type === "MESSAGE") {
      return <FiMessageCircle />;
    }

    if (item.type === "QUOTATION") {
      return <FiFileText />;
    }

    return <FiBell />;
  };

  return (
    <div
      className={`
        group
        relative
        flex
        flex-col
        gap-3
        p-4
        transition
        sm:flex-row
        sm:items-start
        sm:gap-4
        sm:p-5
        cursor-pointer
        hover:bg-slate-50

        ${
          isUnread
            ? "bg-slate-50/80"
            : "bg-white"
        }
      `}
      onClick={() => onOpen(item)}
    >

      {/* UNREAD INDICATOR */}
      {isUnread && (
        <span
          className="
            absolute
            left-0
            top-4
            h-8
            w-1
            rounded-r-full
            bg-slate-900
            sm:top-5
          "
        />
      )}

      {/* ICON */}
      <div
        className={`
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          ${
            isUnread
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-500"
          }
        `}
      >
        {getIcon()}
      </div>

      {/* CONTENT */}
      <div className="min-w-0 flex-1">

        {/* TITLE */}
        <div className="flex flex-wrap items-start gap-2">

          <strong
            className={`
              min-w-0
              break-words
              text-sm
              sm:text-base
              ${
                isUnread
                  ? "text-slate-900"
                  : "text-slate-700"
              }
            `}
          >
            {item.title}
          </strong>

          {isUnread && (
            <Badge tone="success">
              New
            </Badge>
          )}

        </div>

        {/* MESSAGE */}
        <p
          className="
            mt-1
            break-words
            text-sm
            leading-6
            text-slate-500
          "
        >
          {item.message}
        </p>

        {/* DATE */}
        <div className="mt-2 flex flex-wrap items-center gap-2">

          <small className="text-xs text-slate-400">
            {new Date(
              item.createdAt
            ).toLocaleString()}
          </small>

          {item.type && (
            <>
              <span className="text-slate-300">
                •
              </span>

              <small className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {item.type}
              </small>
            </>
          )}

        </div>
      </div>

      {/* ACTIONS */}
      <div
        className="
          flex
          w-full
          items-center
          justify-end
          gap-2
          sm:w-auto
          sm:shrink-0
        "
        onClick={(e) => e.stopPropagation()}
      >

        {isUnread && (
          <button
            type="button"
            title="Mark as read"
            aria-label="Mark as read"
            onClick={() => onRead(item.id)}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-slate-200
              bg-white
              text-slate-500
              transition
              hover:bg-slate-100
              hover:text-slate-900
            "
          >
            <FiCheck size={16} />
          </button>
        )}

        <button
          type="button"
          title="Delete notification"
          aria-label="Delete notification"
          onClick={() => onDelete(item.id)}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            border
            border-slate-200
            bg-white
            text-slate-400
            transition
            hover:border-red-200
            hover:bg-red-50
            hover:text-red-600
          "
        >
          <FiTrash2 size={16} />
        </button>

      </div>
    </div>
  );
}