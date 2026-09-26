import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../lib/api.js";
import { useAuth } from "./AuthContext.jsx";

const SocketContext = createContext({ socket: null, connected: false });

export function SocketProvider({ children }) {
  const { token } = useAuth();
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) {
      if (socketRef.current) socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setConnected(false);
      return undefined;
    }

    const instance = io(SOCKET_URL, {
      auth: { token },
      transports: ["polling", "websocket"],
      upgrade: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
      withCredentials: true,
    });

    socketRef.current = instance;
    setSocket(instance);

    const handleConnect = () => {
      console.log("🟢 Socket connected:", instance.id);
      setConnected(true);
    };
    const handleDisconnect = (reason) => {
      console.log("🔴 Socket disconnected:", reason);
      setConnected(false);
    };
    const handleConnectError = (error) => {
      console.error("❌ Socket.IO connection error:", error?.message || error);
      setConnected(false);
    };

    instance.on("connect", handleConnect);
    instance.on("disconnect", handleDisconnect);
    instance.on("connect_error", handleConnectError);

    return () => {
      instance.off("connect", handleConnect);
      instance.off("disconnect", handleDisconnect);
      instance.off("connect_error", handleConnectError);
      instance.disconnect();
      if (socketRef.current === instance) socketRef.current = null;
      setSocket(null);
      setConnected(false);
    };
  }, [token]);

  const value = useMemo(() => ({ socket, connected }), [socket, connected]);
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  return useContext(SocketContext);
}
