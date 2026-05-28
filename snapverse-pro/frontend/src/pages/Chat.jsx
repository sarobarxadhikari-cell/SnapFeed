import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../socket";
import { encrypt, decrypt } from "../crypto";
import ChatBox from "../components/ChatBox";

export default function Chat({ user, token }) {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [typing, setTyping] = useState(false);
  const navigate = useNavigate();
  const msgRef = useRef(null);

  useEffect(() => {
    loadMessages();
    loadOtherUser();

    socket.on("receive-message", (msg) => {
      if (msg.from === userId || msg.to === userId) {
        const decrypted = decrypt(msg.text);
        setMessages(prev => [...prev, {
          _id: Date.now(),
          sender: msg.from,
          text: decrypted,
          isRead: true,
          createdAt: new Date().toISOString()
        }]);
      }
    });

    socket.on("message-seen", ({ id }) => {
      setMessages(prev => prev.map(m =>
        m._id === id ? { ...m, isRead: true } : m
      ));
    });

    socket.on("user-typing", ({ userId: tid }) => {
      if (tid === userId) setTyping(true);
    });

    socket.on("user-stop-typing", ({ userId: tid }) => {
      if (tid === userId) setTyping(false);
    });

    return () => {
      socket.off("receive-message");
      socket.off("message-seen");
      socket.off("user-typing");
      socket.off("user-stop-typing");
    };
  }, [userId]);

  useEffect(() => {
    msgRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async () => {
    try {
      const res = await axios.get(`/users/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.messages || []);
    } catch {}
  };

  const loadOtherUser = async () => {
    try {
      const res = await axios.get("/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const found = (res.data.users || []).find(u => u._id === userId);
      setOtherUser(found);
    } catch {}
  };

  const sendMessage = () => {
    if (!text.trim()) return;

    const encrypted = encrypt(text);
    const tempId = Date.now();

    const msgData = {
      from: user.id,
      to: userId,
      text: encrypted,
      tempId,
      seen: false
    };

    socket.emit("send-message", msgData);

    setMessages(prev => [...prev, {
      _id: tempId,
      sender: user.id,
      text,
      isRead: false,
      createdAt: new Date().toISOString(),
      pending: true
    }]);

    setText("");
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <button className="back-btn" onClick={() => navigate("/")}>←</button>
        <div className="chat-header-info">
          <div className="chat-avatar">{otherUser?.name?.charAt(0) || "?"}</div>
          <div>
            <b>{otherUser?.name || "User"}</b>
            {typing && <p className="typing-text">typing...</p>}
          </div>
        </div>
        <button className="call-btn" onClick={() => navigate(`/call/${userId}`)}>📞</button>
      </div>

      <div className="messages-container">
        {messages.map((m, i) => (
          <div key={m._id || i} className={`message ${m.sender === user.id || m.sender === user._id ? "mine" : "theirs"}`}>
            <p>{m.text}</p>
            <div className="msg-info">
              <span className="msg-time">
                {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
              {(m.sender === user.id || m.sender === user._id) && (
                <span className={`msg-seen ${m.isRead ? "read" : ""}`}>
                  {m.isRead ? "✓✓" : m.pending ? "◌" : "✓"}
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={msgRef} />
      </div>

      <div className="chat-input-area">
        <input
          placeholder="Type an encrypted message..."
          value={text}
          onChange={e => {
            setText(e.target.value);
            socket.emit("typing", { to: userId, from: user.id });
            clearTimeout(window.typingTimeout);
            window.typingTimeout = setTimeout(() => {
              socket.emit("stop-typing", { to: userId, from: user.id });
            }, 1000);
          }}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button className="send-btn" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
