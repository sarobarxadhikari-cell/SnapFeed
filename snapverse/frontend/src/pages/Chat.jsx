import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChatAPI, AuthAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { io as socketIO } from "socket.io-client";

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [users, setUsers] = useState([]);
  const [searchQ, setSearchQ] = useState("");
  const [socket, setSocket] = useState(null);
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
    loadUsers();

    const newSocket = socketIO("/", {
      auth: { token }
    });
    setSocket(newSocket);

    newSocket.on("new-message", (msg) => {
      if (activeChat && (msg.sender._id === activeChat || msg.receiver === activeChat)) {
        setMessages((prev) => [...prev, msg]);
      }
      loadConversations();
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const res = await ChatAPI.getConversations();
      setConversations(res.data.conversations || []);
    } catch { }
  };

  const loadUsers = async () => {
    try {
      const res = await AuthAPI.searchUsers("");
      setUsers(res.data.users || []);
    } catch { }
  };

  const openChat = async (userId) => {
    setActiveChat(userId);
    try {
      const res = await ChatAPI.getMessages(userId);
      setMessages(res.data.messages || []);
    } catch { }
  };

  const sendMessage = () => {
    if (!text.trim() || !activeChat) return;

    const msgData = { receiver: activeChat, text };

    if (socket) {
      socket.emit("send-message", msgData);
    } else {
      ChatAPI.sendMessage(msgData).then(() => loadConversations());
    }

    setText("");
  };

  const startNewChat = (u) => {
    setActiveChat(u._id);
    setMessages([]);
    setSearchQ("");
  };

  const getOtherUser = (conv) => {
    return conv.user;
  };

  return (
    <div className="chat-page">
      {/* Chat Topbar */}
      <div className="chat-topbar">
        <button className="chat-back" onClick={() => navigate("/feed")}>← Feed</button>
        <h2>Messenger</h2>
        <div className="chat-topbar-spacer"></div>
      </div>

      <div className="chat-layout">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="chat-search">
            <input
              placeholder="Search users..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
            />
          </div>

          {searchQ ? (
            <div className="chat-user-list">
              {users
                .filter((u) => u.name?.toLowerCase().includes(searchQ.toLowerCase()))
                .map((u) => (
                  <div key={u._id} className="chat-user-item" onClick={() => startNewChat(u)}>
                    <img src={u.photo || `https://ui-avatars.com/api/?name=${u.name}`} />
                    <div>
                      <b>{u.name}</b>
                      <p>Click to chat</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="chat-conversations">
              {conversations.length === 0 ? (
                <p className="no-conversations">No conversations yet</p>
              ) : (
                conversations.map((conv, i) => {
                  const other = getOtherUser(conv);
                  return (
                    <div
                      key={i}
                      className={`chat-conv-item ${activeChat === other?._id ? "active" : ""}`}
                      onClick={() => openChat(other?._id)}
                    >
                      <div className="conv-avatar">
                        {other?.name?.charAt(0)}
                      </div>
                      <div className="conv-info">
                        <b>{other?.name}</b>
                        <p>{conv.lastMessage?.text?.substring(0, 30) || "Start chatting"}</p>
                      </div>
                      {conv.unread > 0 && <span className="unread-badge">{conv.unread}</span>}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="chat-main">
          {!activeChat ? (
            <div className="chat-placeholder">
              <div className="chat-placeholder-icon">💬</div>
              <p>Select a conversation to start chatting</p>
            </div>
          ) : (
            <>
              <div className="chat-messages">
                {messages.length === 0 ? (
                  <p className="no-messages">No messages yet. Say hello!</p>
                ) : (
                  messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`chat-bubble ${msg.sender?._id === user?._id || msg.sender === user?._id ? "mine" : "theirs"}`}
                    >
                      {msg.text && <p>{msg.text}</p>}
                      {msg.media && <img src={msg.media} className="chat-media" />}
                      {msg.isSnap && (
                        <div className="snap-indicator">
                          {msg.snapOpened ? "👁️ Opened" : "📸 Snap"}
                        </div>
                      )}
                      <span className="chat-time">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input-area">
                <input
                  placeholder="Type a message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="chat-input"
                />
                <button className="chat-send-btn" onClick={sendMessage}>Send</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
