import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../socket";
import Sidebar from "../components/Sidebar";

export default function Home({ user, token, onLogout }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("join", user.id);

    socket.on("online-users", (ids) => {
      setOnlineUsers(ids);
    });

    axios.get("/users", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUsers(res.data.users || []));

    return () => {
      socket.off("online-users");
    };
  }, [user.id, token]);

  const handleSearch = async (q) => {
    setSearch(q);
    if (q.length < 2) return;
    try {
      const res = await axios.get(`/users/search?q=${q}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users || []);
    } catch {}
  };

  const filtered = search.length >= 2
    ? users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()))
    : users;

  return (
    <div className="home-page">
      <Sidebar
        user={user}
        search={search}
        onSearch={handleSearch}
        onLogout={onLogout}
      />

      <div className="main-content">
        <div className="welcome">
          <h2>Welcome, {user.name}</h2>
          <p>{onlineUsers.length} users online</p>
        </div>

        <div className="user-grid">
          {filtered.map((u) => (
            <div key={u._id} className="user-card" onClick={() => navigate(`/chat/${u._id}`)}>
              <div className="user-avatar-wrap">
                <div className="user-avatar">{u.name?.charAt(0)}</div>
                <span className={`online-dot ${onlineUsers.includes(u._id) ? "online" : ""}`}></span>
              </div>
              <b>{u.name}</b>
              <p className="user-email">{u.email}</p>
              <span className="status-text">
                {onlineUsers.includes(u._id) ? "🟢 Online" : "🔴 Offline"}
              </span>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="no-users">No users found</p>
          )}
        </div>
      </div>
    </div>
  );
}
