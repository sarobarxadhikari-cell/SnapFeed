import { Server } from "socket.io";

let onlineUsers = {};

export function setupSocket(server) {
  const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  });

  io.on("connection", (socket) => {

    socket.on("join", (userId) => {
      onlineUsers[userId] = socket.id;
      io.emit("online-users", Object.keys(onlineUsers));
    });

    socket.on("send-message", (data) => {
      const targetSocket = onlineUsers[data.to];

      if (targetSocket) {
        io.to(targetSocket).emit("receive-message", {
          ...data,
          seen: true
        });

        io.to(socket.id).emit("message-seen", { id: data.tempId });
      }

      if (data.from) {
        io.to(socket.id).emit("message-sent", { id: data.tempId });
      }
    });

    socket.on("typing", ({ to, from }) => {
      const targetSocket = onlineUsers[to];
      if (targetSocket) {
        io.to(targetSocket).emit("user-typing", { userId: from });
      }
    });

    socket.on("stop-typing", ({ to, from }) => {
      const targetSocket = onlineUsers[to];
      if (targetSocket) {
        io.to(targetSocket).emit("user-stop-typing", { userId: from });
      }
    });

    socket.on("call-user", ({ to, signal, from }) => {
      const targetSocket = onlineUsers[to];
      if (targetSocket) {
        io.to(targetSocket).emit("incoming-call", { signal, from });
      }
    });

    socket.on("accept-call", ({ to, signal }) => {
      const targetSocket = onlineUsers[to];
      if (targetSocket) {
        io.to(targetSocket).emit("call-accepted", { signal });
      }
    });

    socket.on("end-call", ({ to }) => {
      const targetSocket = onlineUsers[to];
      if (targetSocket) {
        io.to(targetSocket).emit("call-ended");
      }
    });

    socket.on("disconnect", () => {
      for (let id in onlineUsers) {
        if (onlineUsers[id] === socket.id) {
          delete onlineUsers[id];
        }
      }
      io.emit("online-users", Object.keys(onlineUsers));
    });
  });

  return io;
}
