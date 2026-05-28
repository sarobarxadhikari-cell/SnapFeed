import { useState } from "react";

const REACTIONS = [
  { type: "like", icon: "👍", label: "Like" },
  { type: "love", icon: "❤️", label: "Love" },
  { type: "wow", icon: "😮", label: "Wow" },
  { type: "haha", icon: "😂", label: "Haha" },
  { type: "sad", icon: "😢", label: "Sad" },
  { type: "angry", icon: "😡", label: "Angry" }
];

export default function PostCard({ post, currentUser, onLike, onComment }) {
  const [showComment, setShowComment] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showReactions, setShowReactions] = useState(false);

  const userReaction = post.reactions?.find(
    r => r.user === currentUser?._id || r.user?._id === currentUser?._id
  );

  const reactionCounts = {};
  post.reactions?.forEach(r => {
    reactionCounts[r.type] = (reactionCounts[r.type] || 0) + 1;
  });
  const totalReactions = post.reactions?.length || 0;
  const hasReaction = !!userReaction;

  const handleReaction = (type) => {
    setShowReactions(false);
    if (onLike) onLike(type);
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    onComment(commentText);
    setCommentText("");
    setShowComment(false);
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-user">
          <img
            src={post.user?.photo || `https://ui-avatars.com/api/?name=${post.user?.name}`}
            className="post-avatar"
          />
          <div>
            <b>{post.user?.name}</b>
            <span className="post-time">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="post-body">
        <p>{post.text}</p>
        {post.image && <img src={post.image} className="post-image" />}
      </div>

      <div className="post-stats">
        <span className="reaction-summary">
          {totalReactions > 0 && (
            <>
              {Object.entries(reactionCounts).slice(0, 3).map(([type, count]) => (
                <span key={type}>{REACTIONS.find(r => r.type === type)?.icon} {count}</span>
              ))}
            </>
          )}
          {totalReactions === 0 && <span>💬 0</span>}
        </span>
        <span>💬 {post.comments?.length || 0}</span>
      </div>

      <div className="post-actions">
        <div className="reaction-wrapper">
          <button
            className={`post-action-btn ${hasReaction ? "reacted" : ""}`}
            onClick={() => setShowReactions(!showReactions)}
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setShowReactions(false)}
          >
            {hasReaction ? `${userReaction.icon} ${userReaction.label}` : "👍 Like"}
          </button>
          {showReactions && (
            <div className="reaction-picker"
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setShowReactions(false)}
            >
              {REACTIONS.map((r) => (
                <span
                  key={r.type}
                  className={`reaction-option ${userReaction?.type === r.type ? "active" : ""}`}
                  onClick={() => handleReaction(r.type)}
                  title={r.label}
                >
                  {r.icon}
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          className="post-action-btn"
          onClick={() => setShowComment(!showComment)}
        >
          💬 Comment
        </button>
      </div>

      {showComment && (
        <div className="post-comment-box">
          <input
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleComment()}
            className="comment-input"
            autoFocus
          />
          <button className="comment-send" onClick={handleComment}>Post</button>
        </div>
      )}

      {post.comments?.length > 0 && (
        <div className="post-comments">
          {post.comments.map((c, i) => (
            <div key={i} className="comment-item">
              <b>{c.user?.name || "User"}</b>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
