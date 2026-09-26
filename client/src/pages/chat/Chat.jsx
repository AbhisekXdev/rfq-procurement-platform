import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiSend,
  FiPaperclip,
  FiMoreVertical,
  FiPhone,
  FiVideo,
  FiInfo,
  FiMessageCircle,
  FiWifi,
  FiWifiOff,
  FiCheck,
  FiX,
  FiArrowLeft,
  FiSearch,
  FiSmile,
  FiImage,
  FiFile,
} from "react-icons/fi";
import { useSocket } from "../../hooks/useSocket.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
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
  const endRef = useRef(null);
  const typingTimerRef = useRef(null);

  const selectedConversation = useMemo(
    () => conversations.find((c) => Number(c.id) === Number(conversationId)),
    [conversations, conversationId]
  );

  const loadConversations = async () => {
    try {
      const { data } = await api.get("/chat/conversations");
      const list = data.data || [];
      setConversations(list);
      const requested = searchParams.get("conversation");
      const first = requested || conversationId || list[0]?.id;
      if (first && list.some((c) => Number(c.id) === Number(first))) {
        await openConversation(first, list);
      }
    } catch (error) {
      notify(getErrorMessage(error, "Failed to load conversations"), "error");
    } finally {
      setLoading(false);
    }
  };

  const openConversation = async (id, list = conversations) => {
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) return;
    if (!socket || !connected) {
      setConversationId(String(numericId));
      return;
    }

    try {
      const { data } = await api.get(`/chat/conversations/${numericId}/messages`);
      setMessages(data.data || []);
      setConversationId(String(numericId));

      socket.emit("conversation:join", { conversationId: numericId }, (result) => {
        if (!result?.success) {
          notify(result?.message || "Unable to join conversation", "error");
          return;
        }
        setJoined(true);
        socket.emit("message:read", { conversationId: numericId });
      });

      setSearchParams({ conversation: String(numericId) }, { replace: true });
    } catch (error) {
      notify(getErrorMessage(error, "Unable to open conversation"), "error");
    }
  };

  useEffect(() => {
    loadConversations();
    return () => window.clearTimeout(typingTimerRef.current);
  }, [socket, connected]);

  useEffect(() => {
    if (!socket) return undefined;

    const onMessage = (msg) => {
      if (Number(msg.conversationId) !== Number(conversationId)) return;
      setMessages((current) => current.some((item) => item.id === msg.id) ? current : [...current, msg]);
    };

    const onTypingStart = (data = {}) => {
      if (Number(data.conversationId) === Number(conversationId) && Number(data.userId) !== Number(user?.id)) {
        setTyping(true);
      }
    };

    const onTypingStop = (data = {}) => {
      if (Number(data.conversationId) === Number(conversationId)) setTyping(false);
    };

    const onConversationUpdated = () => loadConversations();
    socket.on("message:new", onMessage);
    socket.on("typing:start", onTypingStart);
    socket.on("typing:stop", onTypingStop);
    socket.on("conversation:updated", onConversationUpdated);

    return () => {
      socket.off("message:new", onMessage);
      socket.off("typing:start", onTypingStart);
      socket.off("typing:stop", onTypingStop);
      socket.off("conversation:updated", onConversationUpdated);
    };
  }, [socket, conversationId, user?.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, typing]);

  const send = () => {
    const text = message.trim();
    const id = Number(conversationId);
    if (!socket || !connected || !joined || !text || !id) return;

    socket.emit("message:send", {
      conversationId: id,
      message: text,
      messageType: "TEXT",
    }, (result) => {
      if (!result?.success) notify(result?.message || "Message failed", "error");
    });

    setMessage("");
    socket.emit("typing:stop", { conversationId: id });
  };

  const handleMessageChange = (event) => {
    const value = event.target.value;
    setMessage(value);
    if (!socket || !connected || !joined) return;

    const id = Number(conversationId);
    socket.emit(value.trim() ? "typing:start" : "typing:stop", { conversationId: id });
    window.clearTimeout(typingTimerRef.current);
    typingTimerRef.current = window.setTimeout(() => {
      socket.emit("typing:stop", { conversationId: id });
    }, 1200);
  };

  const otherParticipants = selectedConversation?.participants
    ?.map((p) => p.user)
    .filter(Boolean)
    .filter((p) => Number(p.id) !== Number(user?.id)) || [];

  return (
    <div className="page chat-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">REAL-TIME</span>
          <h1>Messages</h1>
          <p className="muted">Buyer and supplier conversations update instantly.</p>
        </div>
        <div className="connection-pill">
          {connected ? <FiWifi /> : <FiWifiOff />}
          {connected ? "Connected" : "Offline"}
        </div>
      </div>

      <div className="chat-layout">
        <Card className="chat-sidebar">
          <div className="chat-sidebar-heading">
            <div><strong>Conversations</strong><small>{conversations.length} active</small></div>
            <FiMessageCircle />
          </div>

          {loading ? <div className="chat-empty">Loading conversations…</div> :
            conversations.length === 0 ? (
              <div className="chat-empty">
                <FiMessageCircle size={28} />
                <strong>No conversations yet</strong>
                <span>Open an RFQ quotation and click Chat to start.</span>
              </div>
            ) : (
              <div className="conversation-list">
                {conversations.map((c) => {
                  const others = c.participants?.map((p) => p.user).filter((p) => p && Number(p.id) !== Number(user?.id)) || [];
                  return (
                    <button
                      key={c.id}
                      className={`conversation-item ${Number(conversationId) === Number(c.id) ? "active" : ""}`}
                      onClick={() => openConversation(c.id)}
                    >
                      <div className="conversation-avatar">{(others[0]?.name || "C").charAt(0).toUpperCase()}</div>
                      <div className="conversation-copy">
                        <strong>{others.map((p) => p.name).join(", ") || `Conversation #${c.id}`}</strong>
                        <small>{c.rfq?.productName || (c.rfqId ? `RFQ #${c.rfqId}` : "General conversation")}</small>
                      </div>
                    </button>
                  );
                })}
              </div>
            )
          }
        </Card>

        <Card className="chat-window">
          <div className="chat-header">
            <div className="avatar">{(otherParticipants[0]?.name || "R").charAt(0).toUpperCase()}</div>
            <div>
              <strong>{otherParticipants.map((p) => p.name).join(", ") || "Select a conversation"}</strong>
              <span>{selectedConversation?.rfq?.productName || (joined ? `Conversation #${conversationId}` : "Choose a conversation")}</span>
            </div>
          </div>

          <div className="messages">
            {!joined && !messages.length && (
              <div className="chat-placeholder">
                <FiMessageCircle size={40} />
                <strong>Start a conversation</strong>
                <span>Select a buyer/supplier conversation from the left.</span>
              </div>
            )}

            {joined && messages.length === 0 && (
              <div className="chat-placeholder"><strong>No messages yet</strong><span>Send the first message below.</span></div>
            )}

            {messages.map((item, index) => {
              const mine = Number(item.senderId) === Number(user?.id);
              return (
                <div key={item.id || index} className={`message ${mine ? "mine" : ""}`}>
                  <div className="message-bubble">{item.message}</div>
                  <small>
                    {mine ? "You" : item.sender?.name || "Participant"}
                    {mine && <FiCheck />}
                  </small>
                </div>
              );
            })}

            {typing && <div className="typing">Participant is typing…</div>}
            <div ref={endRef} />
          </div>

          <div className="message-compose">
            <input
              value={message}
              onChange={handleMessageChange}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  send();
                }
              }}
              placeholder={joined ? "Write a message…" : "Select a conversation first"}
              disabled={!joined || !connected}
            />
            <Button onClick={send} disabled={!joined || !connected || !message.trim()}>
              <FiSend /> Send
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
