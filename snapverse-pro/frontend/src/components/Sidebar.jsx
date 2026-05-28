import { useNavigate } from "react-router-dom";

export default function Sidebar({ user, search, onSearch, onLogout }) {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="logo">Snapverse Pro</h2>
      </div>

      <div className="sidebar-user">
        <div className="sidebar-avatar">{user.name?.charAt(0)}</div>
        <div>
          <b>{user.name}</b>
          <p className="sidebar-email">{user.email}</p>
        </div>
      </div>

      <div className="sidebar-search">
        <input
          placeholder="Search users..."
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
      </div>

      <nav className="sidebar-nav">
        <div className="nav-item active" onClick={() => navigate("/")}>🏠 Home</div>
        <div className="nav-item" onClick={() => navigate("/snap")}>👻 Snap</div>
        <div className="nav-item" onClick={() => navigate("/chat")}>💬 Chats</div>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>🚪 Log Out</button>
      </div>
    </aside>
  );
}
