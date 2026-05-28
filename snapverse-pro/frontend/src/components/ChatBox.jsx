export default function ChatBox({ messages, userId, onSend }) {
  return (
    <div className="chatbox">
      {messages.map((m, i) => (
        <div key={i} className={`msg ${m.sender === userId ? "mine" : "theirs"}`}>
          <p>{m.text}</p>
          <span className="msg-status">
            {m.isRead ? "✓✓" : "✓"}
          </span>
        </div>
      ))}
    </div>
  );
}
