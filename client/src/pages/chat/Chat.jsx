import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiSend,
  FiMoreVertical,
  FiPhone,
  FiVideo,
  FiInfo,
  FiMessageCircle,
  FiWifi,
  FiWifiOff,
  FiCheck,
  FiArrowLeft,
  FiSearch,
  FiSmile,
  FiPaperclip,
} from "react-icons/fi";

import { useSocket } from "../../hooks/useSocket.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import api, { getErrorMessage } from "../../lib/api.js";

export default function Chat() {
  const { user } = useAuth();
  const { socket, connected } = useSocket();
  const { notify } = useToast();

  const [searchParams, setSearchParams] = useSearchParams();

  const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [search, setSearch] = useState("");

  const endRef = useRef(null);
  const typingTimerRef = useRef(null);

  const selectedConversation = useMemo(
    () =>
      conversations.find(
        (c) => Number(c.id) === Number(conversationId)
      ),
    [conversations, conversationId]
  );

  const loadConversations = async () => {
    try {
      const { data } = await api.get("/chat/conversations");

      const list = data.data || [];

      setConversations(list);

      const requested = searchParams.get("conversation");
      const first = requested || conversationId || list[0]?.id;

      if (
        first &&
        list.some((c) => Number(c.id) === Number(first))
      ) {
        await openConversation(first, list);
      }
    } catch (error) {
      notify(
        getErrorMessage(error, "Failed to load conversations"),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const openConversation = async (
    id,
    list = conversations,
    fromMobile = true
  ) => {
    const numericId = Number(id);

    if (!Number.isInteger(numericId) || numericId <= 0) return;

    if (!socket || !connected) {
      setConversationId(String(numericId));

      if (fromMobile) {
        setMobileChatOpen(true);
      }

      return;
    }

    try {
      const { data } = await api.get(
        `/chat/conversations/${numericId}/messages`
      );

      setMessages(data.data || []);
      setConversationId(String(numericId));
      setJoined(false);

      socket.emit(
        "conversation:join",
        { conversationId: numericId },
        (result) => {
          if (!result?.success) {
            notify(
              result?.message || "Unable to join conversation",
              "error"
            );
            return;
          }

          setJoined(true);

          socket.emit("message:read", {
            conversationId: numericId,
          });
        }
      );

      setSearchParams(
        { conversation: String(numericId) },
        { replace: true }
      );

      if (fromMobile) {
        setMobileChatOpen(true);
      }
    } catch (error) {
      notify(
        getErrorMessage(error, "Unable to open conversation"),
        "error"
      );
    }
  };

  useEffect(() => {
    loadConversations();

    return () => {
      window.clearTimeout(typingTimerRef.current);
    };
  }, [socket, connected]);

  useEffect(() => {
    if (!socket) return undefined;

    const onMessage = (msg) => {
      if (
        Number(msg.conversationId) !==
        Number(conversationId)
      ) {
        return;
      }

      setMessages((current) =>
        current.some((item) => item.id === msg.id)
          ? current
          : [...current, msg]
      );
    };

    const onTypingStart = (data = {}) => {
      if (
        Number(data.conversationId) ===
          Number(conversationId) &&
        Number(data.userId) !== Number(user?.id)
      ) {
        setTyping(true);
      }
    };

    const onTypingStop = (data = {}) => {
      if (
        Number(data.conversationId) ===
        Number(conversationId)
      ) {
        setTyping(false);
      }
    };

    const onConversationUpdated = () =>
      loadConversations();

    socket.on("message:new", onMessage);
    socket.on("typing:start", onTypingStart);
    socket.on("typing:stop", onTypingStop);
    socket.on(
      "conversation:updated",
      onConversationUpdated
    );

    return () => {
      socket.off("message:new", onMessage);
      socket.off("typing:start", onTypingStart);
      socket.off("typing:stop", onTypingStop);
      socket.off(
        "conversation:updated",
        onConversationUpdated
      );
    };
  }, [socket, conversationId, user?.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages, typing]);

  const send = () => {
    const text = message.trim();
    const id = Number(conversationId);

    if (
      !socket ||
      !connected ||
      !joined ||
      !text ||
      !id
    ) {
      return;
    }

    socket.emit(
      "message:send",
      {
        conversationId: id,
        message: text,
        messageType: "TEXT",
      },
      (result) => {
        if (!result?.success) {
          notify(
            result?.message || "Message failed",
            "error"
          );
        }
      }
    );

    setMessage("");

    socket.emit("typing:stop", {
      conversationId: id,
    });
  };

  const handleMessageChange = (event) => {
    const value = event.target.value;

    setMessage(value);

    if (!socket || !connected || !joined) return;

    const id = Number(conversationId);

    socket.emit(
      value.trim()
        ? "typing:start"
        : "typing:stop",
      {
        conversationId: id,
      }
    );

    window.clearTimeout(typingTimerRef.current);

    typingTimerRef.current = window.setTimeout(() => {
      socket.emit("typing:stop", {
        conversationId: id,
      });
    }, 1200);
  };

  const otherParticipants =
    selectedConversation?.participants
      ?.map((p) => p.user)
      .filter(Boolean)
      .filter(
        (p) => Number(p.id) !== Number(user?.id)
      ) || [];

  const filteredConversations = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return conversations;

    return conversations.filter((conversation) => {
      const others =
        conversation.participants
          ?.map((p) => p.user)
          .filter(
            (p) =>
              p &&
              Number(p.id) !== Number(user?.id)
          ) || [];

      const names = others
        .map((p) => p.name)
        .join(" ");

      const rfq =
        conversation.rfq?.productName ||
        `RFQ #${conversation.rfqId || ""}`;

      return `${names} ${rfq}`
        .toLowerCase()
        .includes(value);
    });
  }, [conversations, search, user?.id]);

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-slate-50 p-3 sm:p-4 lg:p-6">
      <div className="mx-auto flex h-[calc(100vh-104px)] max-w-[1600px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            {mobileChatOpen && (
              <button
                type="button"
                onClick={() => setMobileChatOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 lg:hidden"
                aria-label="Back to conversations"
              >
                <FiArrowLeft size={18} />
              </button>
            )}

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
              <FiMessageCircle size={20} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                  Messages
                </h1>

                <span
                  className={`hidden items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold sm:flex ${
                    connected
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {connected ? (
                    <FiWifi size={11} />
                  ) : (
                    <FiWifiOff size={11} />
                  )}

                  {connected
                    ? "Connected"
                    : "Offline"}
                </span>
              </div>

              <p className="hidden truncate text-xs text-slate-500 sm:block">
                Buyer and supplier conversations
              </p>
            </div>
          </div>

          <div
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold sm:hidden ${
              connected
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {connected ? (
              <FiWifi size={12} />
            ) : (
              <FiWifiOff size={12} />
            )}

            {connected ? "Online" : "Offline"}
          </div>
        </div>

        {/* CHAT BODY */}
        <div className="relative min-h-0 flex-1 overflow-hidden">

          {/* CONVERSATION SIDEBAR */}
          <aside
            className={`absolute inset-0 z-20 flex min-h-0 flex-col bg-white transition-transform duration-300 lg:static lg:z-auto lg:w-[340px] lg:shrink-0 lg:translate-x-0 lg:border-r lg:border-slate-200 ${
              mobileChatOpen
                ? "-translate-x-full lg:translate-x-0"
                : "translate-x-0"
            }`}
          >
            {/* SIDEBAR HEADER */}
            <div className="shrink-0 border-b border-slate-100 p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Conversations
                  </h2>

                  <p className="text-xs text-slate-500">
                    {conversations.length} active
                  </p>
                </div>

                <FiMessageCircle className="text-slate-400" />
              </div>

              {/* SEARCH */}
              <div className="relative">
                <FiSearch
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search conversations..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                />
              </div>
            </div>

            {/* CONVERSATION LIST */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex h-40 items-center justify-center px-5 text-center text-sm text-slate-500">
                  Loading conversations…
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex h-full min-h-[260px] flex-col items-center justify-center px-6 text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <FiMessageCircle size={25} />
                  </div>

                  <strong className="text-sm text-slate-800">
                    No conversations found
                  </strong>

                  <span className="mt-1 max-w-[230px] text-xs leading-5 text-slate-500">
                    Open an RFQ quotation and click Chat to start a conversation.
                  </span>
                </div>
              ) : (
                <div className="p-2">
                  {filteredConversations.map((c) => {
                    const others =
                      c.participants
                        ?.map((p) => p.user)
                        .filter(
                          (p) =>
                            p &&
                            Number(p.id) !==
                              Number(user?.id)
                        ) || [];

                    const name =
                      others
                        .map((p) => p.name)
                        .join(", ") ||
                      `Conversation #${c.id}`;

                    const active =
                      Number(conversationId) ===
                      Number(c.id);

                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() =>
                          openConversation(c.id)
                        }
                        className={`mb-1.5 flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                          active
                            ? "bg-slate-900 text-white shadow-sm"
                            : "text-slate-800 hover:bg-slate-50"
                        }`}
                      >
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                            active
                              ? "bg-white/15 text-white"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {(others[0]?.name ||
                            "C")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <strong className="block truncate text-sm">
                            {name}
                          </strong>

                          <small
                            className={`mt-0.5 block truncate text-xs ${
                              active
                                ? "text-slate-300"
                                : "text-slate-500"
                            }`}
                          >
                            {c.rfq?.productName ||
                              (c.rfqId
                                ? `RFQ #${c.rfqId}`
                                : "General conversation")}
                          </small>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

          {/* CHAT WINDOW */}
          <section
            className={`absolute inset-0 z-10 flex min-h-0 flex-col bg-slate-50 transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 ${
              mobileChatOpen
                ? "translate-x-0"
                : "translate-x-full lg:translate-x-0"
            }`}
          >
            {/* CHAT HEADER */}
            <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-3 py-3 sm:px-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                {(otherParticipants[0]?.name ||
                  "R")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <strong className="block truncate text-sm font-bold text-slate-900 sm:text-base">
                  {otherParticipants
                    .map((p) => p.name)
                    .join(", ") ||
                    "Select a conversation"}
                </strong>

                <span className="block truncate text-xs text-slate-500">
                  {selectedConversation?.rfq
                    ?.productName ||
                    (joined
                      ? `Conversation #${conversationId}`
                      : "Choose a conversation")}
                </span>
              </div>

              <div className="hidden items-center gap-1 sm:flex">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                  title="Call"
                >
                  <FiPhone size={17} />
                </button>

                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                  title="Video call"
                >
                  <FiVideo size={17} />
                </button>

                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                  title="Conversation information"
                >
                  <FiInfo size={17} />
                </button>

                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <FiMoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-5 sm:py-6">
              {!joined && !messages.length && (
                <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                    <FiMessageCircle size={30} />
                  </div>

                  <strong className="text-sm font-bold text-slate-800">
                    Start a conversation
                  </strong>

                  <span className="mt-1 max-w-[300px] text-xs leading-5 text-slate-500">
                    Select a buyer or supplier conversation to start messaging.
                  </span>
                </div>
              )}

              {joined && messages.length === 0 && (
                <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                    <FiMessageCircle size={25} />
                  </div>

                  <strong className="text-sm text-slate-800">
                    No messages yet
                  </strong>

                  <span className="mt-1 text-xs text-slate-500">
                    Send the first message below.
                  </span>
                </div>
              )}

              <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
                {messages.map((item, index) => {
                  const mine =
                    Number(item.senderId) ===
                    Number(user?.id);

                  return (
                    <div
                      key={item.id || index}
                      className={`flex ${
                        mine
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] ${
                          mine
                            ? "items-end"
                            : "items-start"
                        } flex flex-col`}
                      >
                        <div
                          className={`rounded-2xl px-4 py-2.5 text-sm leading-6 shadow-sm ${
                            mine
                              ? "rounded-br-md bg-slate-900 text-white"
                              : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
                          }`}
                        >
                          {item.message}
                        </div>

                        <small className="mt-1 flex items-center gap-1 px-1 text-[10px] text-slate-400">
                          {mine
                            ? "You"
                            : item.sender?.name ||
                              "Participant"}

                          {mine && (
                            <FiCheck size={11} />
                          )}
                        </small>
                      </div>
                    </div>
                  );
                })}

                {typing && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-500 shadow-sm">
                      Participant is typing…
                    </div>
                  </div>
                )}

                <div ref={endRef} />
              </div>
            </div>

            {/* COMPOSER */}
            <div className="shrink-0 border-t border-slate-200 bg-white p-3 sm:p-4">
              <div className="mx-auto flex max-w-4xl items-end gap-2">
                <button
                  type="button"
                  disabled={!joined}
                  className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 sm:flex"
                  title="Attach file"
                >
                  <FiPaperclip size={19} />
                </button>

                <button
                  type="button"
                  disabled={!joined}
                  className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 sm:flex"
                  title="Emoji"
                >
                  <FiSmile size={19} />
                </button>

                <div className="relative flex min-w-0 flex-1">
                  <input
                    value={message}
                    onChange={handleMessageChange}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !event.shiftKey
                      ) {
                        event.preventDefault();
                        send();
                      }
                    }}
                    placeholder={
                      joined
                        ? "Write a message…"
                        : "Select a conversation first"
                    }
                    disabled={
                      !joined || !connected
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <button
                  type="button"
                  onClick={send}
                  disabled={
                    !joined ||
                    !connected ||
                    !message.trim()
                  }
                  className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
                >
                  <FiSend size={17} />

                  <span className="hidden sm:inline">
                    Send
                  </span>
                </button>
              </div>

              <p className="mx-auto mt-2 hidden max-w-4xl text-[10px] text-slate-400 sm:block">
                Press Enter to send your message.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}