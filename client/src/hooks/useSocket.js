// Backward-compatible hook. The actual Socket.IO connection is created once
// by SocketProvider so Chat and AppShell share the same connection.
export { useSocket } from "../context/SocketContext.jsx";
