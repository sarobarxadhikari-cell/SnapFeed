import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onSearch, searchResults, onSendRequest }) {
  const { user, logout, switchAccount } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [savedUsers, setSavedUsers] = useState(
    JSON.parse(localStorage.getItem("sv_saved_users") || "[]")
  );
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const handleSearch = (value) => {
    setQ(value);
    if (onSearch) onSearch(value);
  };

  const handleSwitch = (saved) => {
    setShowSwitcher(false);
    switchAccount(saved);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h1 className="nav-logo" onClick={() => navigate("/feed")}>Snapverse</h1>
        <div className="nav-search-container">
          <input
            placeholder="Search Snapverse..."
            value={q}
            onChange={(e) => handleSearch(e.target.value)}
            className="nav-search"
          />
          {q.length >= 2 && searchResults?.length > 0 && (
            <div className="nav-search-results">
              {searchResults.map((u) => (
                <div key={u._id} className="search-result-item">
                  <span>{u.name}</span>
                  {onSendRequest && (
                    <button className="btn-sm btn-primary" onClick={() => onSendRequest(u._id)}>
                      Add Friend
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="nav-center">
        <div className="nav-tab active" onClick={() => navigate("/feed")}>🏠</div>
        <div className="nav-tab" onClick={() => navigate("/snap")}>👻</div>
        <div className="nav-tab" onClick={() => navigate("/chat")}>💬</div>
        <div className="nav-tab" onClick={() => navigate("/map")}>📍</div>
      </div>

      <div className="nav-right">
        <div className="nav-user" onClick={() => setShowDropdown(!showDropdown)}>
          <div className="nav-avatar">
            {user?.photo ? (
              <img src={user.photo} />
            ) : (
              user?.name?.charAt(0)
            )}
          </div>
        </div>

        {showDropdown && (
          <div className="nav-dropdown" onClick={() => setShowDropdown(false)}>
            <div className="dropdown-content" onClick={(e) => e.stopPropagation()}>
              <div className="dropdown-user">
                <div className="dropdown-avatar">{user?.name?.charAt(0)}</div>
                <div>
                  <b>{user?.name}</b>
                  <p>{user?.email}</p>
                </div>
              </div>
              <hr />
              <div className="dropdown-item" onClick={() => { navigate("/profile"); setShowDropdown(false); }}>👤 Profile</div>
              <div className="dropdown-item" onClick={() => { navigate("/feed"); setShowDropdown(false); }}>📰 Feed</div>
              <div className="dropdown-item" onClick={() => { navigate("/snap"); setShowDropdown(false); }}>👻 Snap</div>
              <div className="dropdown-item" onClick={() => { navigate("/chat"); setShowDropdown(false); }}>💬 Messages</div>
              <div className="dropdown-item" onClick={() => { navigate("/map"); setShowDropdown(false); }}>📍 Map</div>
              <hr />
              <div className="dropdown-item" onClick={() => { setShowDropdown(false); setShowSwitcher(true); }}>🔄 Switch Account</div>
              <div className="dropdown-item logout" onClick={() => { logout(); navigate("/"); }}>🚪 Log Out</div>
            </div>
          </div>
        )}

        {showSwitcher && (
          <div className="nav-dropdown" onClick={() => setShowSwitcher(false)}>
            <div className="switcher-content" onClick={(e) => e.stopPropagation()}>
              <div className="switcher-header">
                <h3>Switch Account</h3>
                <button className="modal-close" onClick={() => setShowSwitcher(false)}>✕</button>
              </div>
              <div className="switcher-list">
                {savedUsers.map((saved) => (
                  <div key={saved.email} className="switcher-item" onClick={() => handleSwitch(saved)}>
                    <div className="switcher-avatar">
                      {saved.photo ? <img src={saved.photo} /> : saved.name?.charAt(0)}
                    </div>
                    <div>
                      <b>{saved.name}</b>
                      <p>{saved.email}</p>
                    </div>
                    {saved.email === user?.email && <span className="switcher-active">Active</span>}
                  </div>
                ))}
              </div>
              <button className="auth-btn" style={{ marginTop: 12 }} onClick={() => { setShowSwitcher(false); logout(); navigate("/"); }}>
                Log Out & Add Account
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
