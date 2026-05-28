export default function UserList({ users, onlineUsers, onSelect }) {
  return (
    <div className="user-list">
      {users.map(u => (
        <div key={u._id} className="user-list-item" onClick={() => onSelect(u)}>
          <div className="user-list-avatar">
            {u.name?.charAt(0)}
            <span className={`dot ${onlineUsers.includes(u._id) ? "on" : ""}`}></span>
          </div>
          <div>
            <b>{u.name}</b>
            <p>{onlineUsers.includes(u._id) ? "Online" : "Offline"}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
